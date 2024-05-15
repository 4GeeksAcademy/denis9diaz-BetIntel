import React, { useEffect, useState } from "react";

const Ranking = () => {
    const [rankings, setRankings] = useState([]);

    useEffect(() => {
        const fetchRankings = async () => {
            try {
                const response = await fetch(`${process.env.BACKEND_URL}/api/rankings`);
                if (response.ok) {
                    const data = await response.json();
                    setRankings(data);
                } else {
                    const errorData = await response.json();
                    console.error("Error al obtener el ranking:", errorData.msg);
                }
            } catch (error) {
                console.error("Error en la solicitud fetch:", error);
            }
        };

        fetchRankings();
    }, []);

    return (
        <div className="ranking-container">
            <h1 className="ranking-title">Ranking</h1>
            <table className="rankings-table">
                <thead>
                    <tr className="rankings-header">
                        <th>Posición</th>
                        <th>Usuario</th>
                        <th>Unidades de Beneficio</th>
                        <th>Yield</th>
                        <th>Ver más</th>
                        <th>Contratar</th>
                    </tr>
                </thead>
                <tbody className="rankings-data">
                    {rankings.map((user, index) => (
                        <tr key={user.user_id}>
                            <td>{index + 1}</td>
                            <td>{user.username}</td>
                            <td>{user.profit_units}</td>
                            <td>{user.yield_percentage}%</td>
                            <td><button className="btn-profile">Ver más</button></td>
                            <td><button className="btn-contract">Contratar</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Ranking;
