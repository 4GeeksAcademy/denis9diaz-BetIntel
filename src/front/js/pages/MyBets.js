import React, { useState, useEffect } from "react";

const MyBets = () => {
    const [userBets, setUserBets] = useState([]);

    useEffect(() => {
        const fetchUserBets = async () => {
            try {
                const token = localStorage.getItem("jwt-token");
                const response = await fetch(`${process.env.BACKEND_URL}/api/bets/user`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const bets = await response.json();
                    setUserBets(bets);
                } else {
                    const errorData = await response.json();
                    console.error("Error al obtener las apuestas del usuario:", errorData.msg);
                }
            } catch (error) {
                console.error("Error en la solicitud fetch:", error);
            }
        };

        fetchUserBets();
    }, []);

    return (
        <div className="my-bet-container">
            <h1 className="my-bet-title">Mis Apuestas</h1>
            <table className="my-bet-table">
                <thead>
                    <tr>
                        <th>Evento</th>
                        <th>Predicción</th>
                        <th>Cuota</th>
                        <th>Cantidad Apostada</th>
                        <th>Stake</th>
                        <th>Resultado</th>
                        <th>Dinero Obtenido</th>
                        <th>Unidades</th>
                    </tr>
                </thead>
                <tbody>
                    {userBets.map(bet => (
                        <tr key={bet.id}>
                            <td>{bet.event_name}</td>
                            <td>{bet.prediction}</td>
                            <td>{parseFloat(bet.odds).toFixed(2)}</td>
                            <td>{parseFloat(bet.amount_bet).toFixed(2)}€</td>
                            <td>{bet.stake}</td>
                            <td>{bet.resultado || ''}</td>
                            <td>{parseFloat(bet.result_amount).toFixed(2) || ''}€</td>
                            <td>{parseFloat(bet.result_units).toFixed(2) || ''}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default MyBets;
