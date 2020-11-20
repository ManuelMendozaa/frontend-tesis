import React, { useState, useEffect } from 'react';
import axios from "axios";
import "../scss/home.scss";

const Home = () => {

    const [ collections, setCollections ] = useState(0);
    const [ analysis, setAnalysis ] = useState(0);
    const [ storage, setStorage ] = useState(0);
    const [ pending, setPending ] = useState(0);

    useEffect(() => {
        
        const get_data = async () => {
            let res = await axios.get("/home")
            return res
        }

        const env = async () => {
            await get_data().then((res) => {
                setCollections(res.data.collections);
                setAnalysis(res.data.analysis);
                setStorage(res.data.storage);
                setPending(res.data.uploads);
            })
        }

        env();

    }, [])


    return (
        <div className="home-container">
            <div className="title">
                Inicio
            </div>
            <div className="home-data">
                <div className="general-stats">
                    <div className="stats-box">
                        <div className="stat">
                            <div className="stat-value">
                                <p>{collections}</p>
                                <i className="fas fa-folder"></i>
                            </div>
                            <p>Colecciones</p>
                        </div>
                    </div>
                    <div className="stats-box">
                        <div className="stat">
                            <div className="stat-value">
                                <p>{analysis}</p>
                                <i className="fas fa-chart-bar"></i>
                            </div>
                            <p>Análisis</p>
                        </div>
                    </div>
                    <div className="stats-box">
                        <div className="stat">
                            <div className="stat-value">
                                <p>{storage}</p>
                                <i className="fas fa-database"></i>
                            </div>
                            <p>Almacenamiento</p>
                            
                        </div>
                    </div>
                    <div className="stats-box">
                        <div className="stat">
                            <div className="stat-value">
                                <p>{pending}</p>
                                <i className="fas fa-video"></i>
                            </div>
                            <p>Videos pendientes</p>
                        </div>
                    </div>
                            
                </div>
                
            </div>
        </div>
    )
}

export default Home;
