import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListAlt, faClock, faCalculator, faChartLine, faPercentage, faMoneyBillWave, faDollarSign, faMoneyCheckAlt, faStream, faCheckCircle, faTachometerAlt, faHandHoldingUsd, faTrophy, faUserFriends, faCheck } from '@fortawesome/free-solid-svg-icons';

const SeccionIntroduccion = () => {
    return (
        <div>
            <section className="home-header">
                <div className="container">
                    <h1 className="home-title">Plataforma de estadísticas de apuestas deportivas</h1>
                    <p className="home-subtitle">Lleva un control exhaustivo de tus apuestas y mejora tus resultados con nuestras herramientas</p>
                </div>
            </section>
            <section className="home-introduction">
                <div className="container">
                    <div className="intro-section">
                        <div className="intro-section-left">
                            <h2 className="what-title">¿Qué puedes hacer aquí?</h2>
                            <ul className="introduction-list">
                                <li><FontAwesomeIcon className="icon" icon={faCheck} /><span className="what-item">Crear y gestionar pronósticos de manera eficiente</span></li>
                                <li><FontAwesomeIcon className="icon" icon={faCheck} /><span className="what-item">Acceder a una lista detallada de tus apuestas</span></li>
                                <li><FontAwesomeIcon className="icon" icon={faCheck} /><span className="what-item">Acceder a todas tus estadísticas</span></li>
                                <li><FontAwesomeIcon className="icon" icon={faCheck} /><span className="what-item">Competir con otros usuarios por ser el mejor pronosticador</span></li>
                            </ul>
                        </div>
                        <div className="intro-section-right">
                            <h2 className="how-title">¿Cómo funciona?</h2>
                            <ol className="how-it-works-list">
                                <li><FontAwesomeIcon className="icon" icon={faListAlt} /><span className="how-list-item">Añade tus pronósticos</span></li>
                                <li><FontAwesomeIcon className="icon" icon={faClock} /><span className="how-list-item">Espera a que se determine el resultado</span></li>
                                <li>
                                    <FontAwesomeIcon className="icon" icon={faCalculator} /><span className="how-list-item">Automáticamente se calcularán las siguientes estadísticas:</span>
                                    <ul className="sub-stats-list">
                                        <li><FontAwesomeIcon className="sub-icon" icon={faChartLine} /><span className="sub-stats-item">Unidades de beneficio</span></li>
                                        <li><FontAwesomeIcon className="sub-icon" icon={faPercentage} /><span className="sub-stats-item">Yield</span></li>
                                        <li><FontAwesomeIcon className="sub-icon" icon={faMoneyBillWave} /><span className="sub-stats-item">Dinero apostado</span></li>
                                        <li><FontAwesomeIcon className="sub-icon" icon={faDollarSign} /><span className="sub-stats-item">Dinero obtenido</span></li>
                                        <li><FontAwesomeIcon className="sub-icon" icon={faMoneyCheckAlt} /><span className="sub-stats-item">Beneficio</span></li>
                                        <li><FontAwesomeIcon className="sub-icon" icon={faStream} /><span className="sub-stats-item">Total de apuestas (Acertadas, falladas y nulas)</span></li>
                                        <li><FontAwesomeIcon className="sub-icon" icon={faCheckCircle} /><span className="sub-stats-item">Porcentaje de acierto</span></li>
                                        <li><FontAwesomeIcon className="sub-icon" icon={faTachometerAlt} /><span className="sub-stats-item">Cuota promedio</span></li>
                                        <li><FontAwesomeIcon className="sub-icon" icon={faHandHoldingUsd} /><span className="sub-stats-item">Stake promedio</span></li>
                                    </ul>
                                </li>
                                <li><FontAwesomeIcon className="icon" icon={faTrophy} /><span className="how-list-item">Según estas estadísticas, ocuparás una posición en el ranking de mejores pronosticadores</span></li>
                                <li><FontAwesomeIcon className="icon" icon={faUserFriends} /><span className="how-list-item">Podrás añadir tus redes sociales para darte a conocer y facilitar que contraten tus servicios</span></li>
                            </ol>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default SeccionIntroduccion