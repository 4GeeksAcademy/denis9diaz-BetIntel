import React, { useEffect, useState } from "react";
import { FaTrophy } from 'react-icons/fa';

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
        <div className="ranking ">
            <h1 className="ranking-title">Ranking de Pronosticadores</h1>
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
                        <tr key={user.user_id} className={index < 3 ? 'top-rank' : ''}>
                            <td>{index + 1}</td>
                            <td>
                                {user.username}
                                {index < 3 && (
                                    <span className="cup-icon" style={{ fontSize: index === 0 ? '2rem' : index === 1 ? '1.5rem' : '1.2rem', color: 'black' }}>
                                        <FaTrophy />
                                    </span>
                                )}
                            </td>
                            <td>{user.profit_units !== null ? parseFloat(user.profit_units).toFixed(2) : 'N/A'}</td>
                            <td>{user.yield_percentage !== null ? parseFloat(user.yield_percentage).toFixed(2) + '%' : 'N/A'}</td>
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
