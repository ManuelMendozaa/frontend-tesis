import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import "../scss/app-container.scss";

// Shared component
import Sidebar from '../shared/Sidebar';

// Components

const AppContainer = () => {
    return (
        <div className="app-container">
            <Router>
                <Sidebar />

                <div className="app-body">
                    <Route exact path="/" component={Home} />
                </div>
            </Router>
        </div>
    )
}

const Home = () => {
    return (
        <div>
            XD
        </div>
    )
}

export default AppContainer;
