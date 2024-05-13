import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const isValidEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    };
    const isValidPassword = (password) => {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== repeatPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }
        if (!isValidEmail(email)) {
            setError("Introduce una dirección válida");
            return;
        }
        if (!isValidPassword(password)) {
            setError("La contraseña debe contener al menos una mayúscula, una minúscula, un número y 8 caracteres");
            return;
        }
        const resp = await fetch(process.env.BACKEND_URL + "/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "email": email, "password": password, "username": username })
        });

        const data = await resp.json();
        console.log(data)
        if (resp.status == 400) {
            setError(data.msg)
        }
        if (resp.status == 201) {
            navigate("/login")
        }
        return data;
    };

    return (
        <div className="auth-container">
            <div className="container form-body">
                <h1 className="title">Crear cuenta</h1>
                <form onSubmit={handleSubmit} className="form-register">
                    <div className="input-group">
                        <label className="label-form" htmlFor="email">Email</label>
                        <input
                            type="text"
                            id="email"
                            className="input-form"
                            placeholder="Introduce tu email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <label className="label-form" htmlFor="username">Nombre de usuario</label>
                        <input
                            type="text"
                            id="username"
                            className="input-form"
                            placeholder="Introduce tu nombre de usuario"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <label className="label-form" htmlFor="password">Contraseña</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            className="input-form"
                            placeholder="Introduce tu contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </div>
                    </div>
                    <div className="input-group">
                        <label className="label-form" htmlFor="repeatPassword">Repetir contraseña</label>
                        <input
                            type={showRepeatPassword ? "text" : "password"}
                            id="repeatPassword"
                            className="input-form"
                            placeholder="Repite tu contraseña"
                            value={repeatPassword}
                            onChange={(e) => setRepeatPassword(e.target.value)}
                        />
                        <div className="password-toggle-icon" onClick={() => setShowRepeatPassword(!showRepeatPassword)}>
                            {showRepeatPassword ? <FaEyeSlash /> : <FaEye />}
                        </div>
                    </div>
                    {error && <div className="error-message mb-4">{error}</div>}
                    <button type="submit" className="btn btn-primary">Registro</button>
                </form>
                <p className="mt-3 text-center">
                    ¿Ya tienes una cuenta? <a href="/login">Inicia sesión</a>
                </p>
            </div>
        </div>
    );
};

export default Register;
