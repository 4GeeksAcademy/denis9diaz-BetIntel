import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db, User, EstadisticasUsuario, Apuestas
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from flask_cors import CORS
import re

# from models import Person

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../public/')
app = Flask(__name__)
CORS(app)
app.config["JWT_SECRET_KEY"] = "super-secret"  # Change this!
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
app.url_map.strict_slashes = False

# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints


@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file


@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response

'''------------------------------------ENDPOINTS----------------------------------'''

@app.route('/api/register', methods=['POST'])
def register():
    body = request.get_json(silent = True)
    if body is None:
        return jsonify({'msg': "Debes enviar información en el body"}), 400
    if 'email' not in body or body["email"] == "":
        return jsonify({'msg': "El campo email es obligatorio"}), 400
    if not re.match(r'\S+@\S+\.\S+', body['email']):
        return jsonify({'msg': "Introduce un email válido"}), 400
    if "username" not in body or body["username"] == "":
        return jsonify({"msg": "El campo username es obligatorio"}), 400
    if 'password' not in body:
        return jsonify({'msg': "El campo password es obligatorio"}), 400

    user_exist = User.query.filter_by(email=body["email"]).first()
    username_exist = User.query.filter_by(username=body["username"]).first()

    if user_exist is not None:
        return jsonify({"msg": "Este email ya esta registrado"}), 400
    if username_exist is not None:
        return jsonify({"msg": "Este nombre de usuario ya está registrado"}), 400

    new_user = User()
    new_user.email = body['email']
    new_user.username = body['username']
    pw_hash = bcrypt.generate_password_hash(body["password"]).decode("utf-8")
    new_user.password = pw_hash
    new_user.is_active = True
    db.session.add (new_user)
    db.session.commit()
    return jsonify({"msg": "El usuario ha sido creado con exito"}), 201


@app.route('/api/login', methods=['POST'])
def login():
    body = request.get_json(silent = True)
    if body is None:
        return jsonify({'msg': "Debes enviar información en el body"}), 400
    if 'email' not in body:
        return jsonify({'msg': "El campo email es obligatorio"}), 400
    if 'password' not in body:
        return jsonify({'msg': "El campo password es obligatorio"}), 400
    user = User.query.filter_by(email= body["email"]).first()
    if user is None:
        return jsonify({'msg': "El usuario no existe"}), 400
    password_correct = bcrypt.check_password_hash(user.password, body["password"])
    if not password_correct:
        return jsonify({'msg': "La contraseña es incorrecta"}), 400
    access_token = create_access_token(identity=user.email)
    return jsonify({'msg': "Login aceptado",
                    'token': access_token})


@app.route('/api/pronostico', methods=['POST'])
@jwt_required()  # Se requiere un token JWT para acceder a este endpoint
def add_pronostico():
    current_user_email = get_jwt_identity()  # Obtener el email del usuario autenticado
    user = User.query.filter_by(email=current_user_email).first()  # Buscar el usuario en la base de datos
    if not user:
        return jsonify({'msg': "Usuario no encontrado"}), 404

    # Obtener los datos del pronóstico del cuerpo de la solicitud
    body = request.get_json(silent=True)
    if not body:
        return jsonify({'msg': "Debes enviar información en el cuerpo de la solicitud"}), 400
    if 'event_date' not in body or 'event_name' not in body or 'prediction' not in body or 'odds' not in body or 'amount_bet' not in body:
        return jsonify({'msg': "Faltan campos obligatorios en el pronóstico"}), 400

    # Crear un nuevo pronóstico
    pronostico = Apuestas(
        user_id=user.id,
        event_date=body['event_date'],
        event_name=body['event_name'],
        prediction=body['prediction'],
        odds=body['odds'],
        amount_bet=body['amount_bet']
    )

    # Calcular el stake
    pronostico.stake = pronostico.amount_bet / user.unit_value

    # Calcular el resultado en euros y unidades
    pronostico.result_amount = pronostico.amount_bet * pronostico.odds
    pronostico.result_units = pronostico.result_amount / user.unit_value

    # Añadir el pronóstico a la base de datos
    db.session.add(pronostico)
    db.session.commit()

    # Actualizar las estadísticas del usuario
    user_stats = EstadisticasUsuario.query.filter_by(user_id=user.id).first()
    if not user_stats:
        user_stats = EstadisticasUsuario(user_id=user.id)

    user_stats.total_bets += 1
    if pronostico.result_amount > pronostico.amount_bet:
        user_stats.successes += 1
    elif pronostico.result_amount < pronostico.amount_bet:
        user_stats.failures += 1
    else:
        user_stats.draws += 1

    user_stats.success_rate = (user_stats.successes / user_stats.total_bets) * 100
    user_stats.average_odds = (user_stats.average_odds * (user_stats.total_bets - 1) + pronostico.odds) / user_stats.total_bets
    user_stats.average_stake = (user_stats.average_stake * (user_stats.total_bets - 1) + pronostico.stake) / user_stats.total_bets

    db.session.add(user_stats)
    db.session.commit()

    return jsonify({'msg': "Pronóstico añadido exitosamente"}), 201


@app.route('/api/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200


@app.route('/api/current-user', methods=['GET'])
@jwt_required()
def get_current_user():
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()
    print(user.id)
    if user:
        return jsonify(user.serialize()), 200
    else:
        return jsonify({"msg": "Usuario no encontrado"}), 404


'''-------------------------------------Finish Endpoints---------------------------------'''

# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
