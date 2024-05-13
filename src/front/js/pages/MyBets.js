import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

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
                    Swal.fire("Error", errorData.msg || "Error al obtener las apuestas del usuario", "error");
                }
            } catch (error) {
                console.error("Error en la solicitud fetch:", error);
                Swal.fire("Error", "Error al obtener las apuestas del usuario", "error");
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
                    </tr>
                </thead>
                <tbody>
                    {userBets.map(bet => (
                        <tr key={bet.id}>
                            <td>{bet.event_name}</td>
                            <td>{bet.prediction}</td>
                            <td>{bet.odds}</td>
                            <td>{bet.amount_bet}€</td>
                            <td>{bet.stake}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default MyBets;
