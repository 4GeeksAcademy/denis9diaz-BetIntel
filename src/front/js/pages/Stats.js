import React, { useState, useEffect } from "react";

const Stats = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchUserStats = async () => {
            try {
                const token = localStorage.getItem("jwt-token");
                const response = await fetch(`${process.env.BACKEND_URL}/api/stats/user`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setStats(data.stats);
                } else {
                    console.error("Error al obtener las estadísticas del usuario");
                }
            } catch (error) {
                console.error("Error en la solicitud fetch:", error);
            }
        };

        fetchUserStats();
    }, []);

    return (
        <div className="stats-container">
            <h1 className="stats-title">Estadísticas</h1>
            {stats && (
                <div className="stats-details">
                    <p>Dinero apostado: {stats.money_bet}</p>
                    <p>Dinero ganado: {stats.money_won}</p>
                    <p>Beneficio: {stats.profit}</p>
                    <p>Unidades jugadas: {stats.played_units}</p>
                    <p>Unidades de beneficio: {stats.profit_units}</p>
                    <p>Porcentaje de Yield: {stats.yield_percentage}</p>
                    <p>Total de apuestas: {stats.total_bets}</p>
                    <p>Cuota promedio: {stats.average_odds}</p>
                    <p>Stake promedio: {stats.average_stake}</p>
                </div>
            )}
        </div>
    );
}

export default Stats;
