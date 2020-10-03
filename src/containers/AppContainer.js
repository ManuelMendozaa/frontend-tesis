import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import "../scss/app-container.scss";

// Shared component
import Sidebar from '../shared/Sidebar';

// Components
import Home from "../components/Home";
import Uploader from '../components/Uploader';

const AppContainer = () => {
    return (
        <div className="app-container">
            <Router>
                <Sidebar />

                <div className="app-body">
                    <Route exact path="/" component={Home} />
                    <Route path="/analyzer" component={Uploader} />
                </div>
            </Router>
        </div>
    )
}


export default AppContainer;
