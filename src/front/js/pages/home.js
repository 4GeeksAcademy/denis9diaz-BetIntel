import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const Home = () => {
	const { store, actions } = useContext(Context);
	const navigate = useNavigate();

	useEffect(() => {
        const token = localStorage.getItem("jwt-token");
        if (!token) {
            navigate("/login");
        } else {
            actions.getMyTasks();
        }
    }, [navigate, actions]);

	return (
		<div className="text-center mt-5">
			<h1>Dentro!!</h1>
		</div>
	);
};
