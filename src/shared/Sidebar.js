import React from 'react';
import {NavLink} from "react-router-dom";
import "../scss/sidebar.scss";

const Sidebar = () => {


    return (
        <nav className="sidebar-container">
            <div className="logo">
                <img src="/icon.png" alt="" style={{ height: "40px" }}/>
                <p>Unimet AI</p>
            </div>
            <div className="sidebar-options">
                <NavLink exact to="/" activeClassName="nav-active">
                    <div className="option-container">
                        <p><i className="fas fa-home"></i>Inicio</p>
                    </div>
                </NavLink>

                <NavLink to="/analyzer" activeClassName="nav-active">
                    <div className="option-container">
                        <p><i className="fas fa-robot"></i>Analizar</p>
                    </div>
                </NavLink>

                <NavLink to="/collections" activeClassName="nav-active">
                    <div className="option-container">
                        <p><i className="fas fa-folder"></i>Colecciones</p>
                    </div>
                </NavLink>
            </div>
        </nav>
    )
}

export default Sidebar;
