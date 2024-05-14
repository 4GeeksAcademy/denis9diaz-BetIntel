import React from "react";
import SeccionIntroduccion from "./SeccionIntroduccion";
import SeccionPronosticos from "./SeccionPronosticos";
import SeccionEstadisticas from "./SeccionEstadisticas";
import SeccionRankings from "./SeccionRankings";

export const Home = () => {
	
	return (
		<div className="home-container">
			<SeccionIntroduccion />
            <SeccionPronosticos />
            <SeccionEstadisticas />
            <SeccionRankings />
		</div>
	);
};
