import React from "react";

const SeccionPronosticos = () => {
    return (
        <section className="home-new-bet">
				<div className="container">
					<h2 className="bet-title">Crea un nuevo pronóstico</h2>
					<p className="text-home">¿Tienes una nueva apuesta en mente? ¡Regístrala aquí y comienza a seguir su rendimiento!</p>
					<a href="/newbet" className="btn btn-primary">Crear Pronóstico</a>
				</div>
		</section>
    )
}

export default SeccionPronosticos