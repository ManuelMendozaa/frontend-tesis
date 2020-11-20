import React from 'react';
import "../scss/results.scss";

// ChartJS
import Line from "react-chartjs-2";

const Results = (props) => {

    console.log(props.res)
    const listItems = props.res.map((item, index) => {

        const datasets = item.datasets.map((dataset) => {
            const data1 = {
                labels: dataset.labels,
                datasets: [
                    {
                        label: "neutral",
                        data: dataset.exp[0],
                        borderColor: "rgb(50, 50, 50, 1)",
                        backgroundColor: "rgb(50, 50, 50, 0.1)"
                    },
                    {
                        label: "felicidad",
                        data: dataset.exp[1],
                        borderColor: "rgb(250, 167, 0, 1)",
                        backgroundColor: "rgb(250, 167, 0, 0.1)"
                    },
                    {
                        label: "tristeza",
                        data: dataset.exp[2],
                        borderColor: "rgb(200, 162, 235, 1)",
                        backgroundColor: "rgb(200, 162, 235, 0.1)"
                    },
                    {
                        label: "sorpresa",
                        data: dataset.exp[3],
                        borderColor: "rgb(0, 240, 227, 1)",
                        backgroundColor: "rgb(0, 240, 227, 0.1)"
                    },
                    {
                        label: "miedo",
                        data: dataset.exp[4],
                        borderColor: "rgb(0, 183, 255, 1)",
                        backgroundColor: "rgb(0, 183, 255, 0.1)"
                    },
                    {
                        label: "disgusto",
                        data: dataset.exp[5],
                        borderColor: "rgb(107, 245, 172, 1)",
                        backgroundColor: "rgb(107, 245, 172, 0.1)"
                    },
                    {
                        label: "molestia",
                        data: dataset.exp[6],
                        borderColor: "rgb(255, 92, 123, 1)",
                        backgroundColor: "rgb(255, 92, 123, 0.1)"
                    }
                ]
            }
    
            const data2 = {
                labels: dataset.labels,
                datasets: [
                    {
                        label: "valencia",
                        data: dataset.val,
                        borderColor: "rgb(250, 167, 0, 1)",
                        backgroundColor: "rgb(250, 167, 0, 0.1)"
                    },
                    {
                        label: "excitacion",
                        data: dataset.aro,
                        borderColor: "rgb(255, 80, 110, 1)",
                        backgroundColor: "rgb(255, 92, 123, 0.1)"
                    }
                ]
            }

            let chartWidth = data1.labels.length * 8;
            if(chartWidth <= 100) {
                chartWidth = 100
            }

            return (
                <div className={"lower-set"}>
                    <div className="expresions">
                        <p>Expresiones faciales</p>
                        <div className="content">
                            <div className="chartWrapper" style={{width:chartWidth+"%"}}>
                                
                                <Line 
                                    type    = "line"
                                    data    = {data1}
                                    options = {{ 
                                        maintainAspectRatio: false,
                                        legend: {
                                            display: true,
                                            position: "left"
                                        }
                                    }}
                                        
                                />
                                
                            </div>
                        </div>
                    </div>
                    <div className="variables">
                        <p>Valencia y excitación </p>
                        <div className="content">
                            <div className="chartWrapper" style={{width:chartWidth+"%"}}>
                                
                                <Line 
                                    type    = "line"
                                    data    = {data2}
                                    options = {{ 
                                        maintainAspectRatio: false,
                                        legend: {
                                            display: true,
                                            position: "left"
                                        }
                                    }}
                                        
                                />
                                
                            </div>
                        </div>
                    </div>
                </div>
            )
        })

        var sum_val = 0
        var sum_aro = 0
        var detected_faces = item.datasets.length
        for (let index = 0; index < detected_faces; index++) {
            let aux_sum_val = item.datasets[index].val.reduce((acc, c) => acc + c, 0)
            let prom_val = aux_sum_val / item.datasets[0].val.length
            sum_val += prom_val

            let aux_sum_aro = item.datasets[index].aro.reduce((acc, c) => acc + c, 0)
            let prom_aro = aux_sum_aro / item.datasets[0].aro.length
            sum_aro += prom_aro
        }

        sum_val /= detected_faces
        sum_val = sum_val.toString().substring(0,5)

        sum_aro /= detected_faces
        sum_aro = sum_aro.toString().substring(0,5)


        const expressions = ["Neutral","Felicidad","Tristeza","Sorpresa","Miedo","Disgusto","Molestia"]
        let max_exp = null
        let sum_exp = 0

        for (let index = 0; index < expressions.length; index++) {

            let sum = 0
            for (let index2 = 0; index2 < detected_faces; index2++) {
                sum = item.datasets[index2].exp[index].reduce((acc, c) => acc + c, 0)
            }

            if(sum > sum_exp) {
                sum_exp = sum
                max_exp = expressions[index]
            }
        }
        
        return (
        <li key={index}>
            <div className="list-content">
                <div className="upper-set">
                    <video
                        src={"http://127.0.0.1:5000/get_video?filename=" + item.file + "&folder=" + props.folder}
                        controls={true}
                    />
                    <div className="general-stats">
                        <div className="stats-box">
                            <div className="stat">
                                <div className="stat-value">
                                    <p>{sum_aro}</p>
                                    <i className="fas fa-thermometer-three-quarters"></i>
                                </div>
                                <p>Excitación promedio</p>
                            </div>
                        </div>
                        <div className="stats-box">
                            <div className="stat">
                                <div className="stat-value">
                                    <p>{sum_val}</p>
                                    <i className="fas fa-smile"></i>
                                </div>
                                <p>Valencia promedio</p>
                            </div>
                        </div>
                        <div className="stats-box">
                            <div className="stat">
                                <div className="stat-value">
                                    <p>{max_exp}</p>
                                </div>
                                <p>Emoción principal</p>
                            </div>
                        </div>
                        <div className="stats-box">
                            <div className="stat">
                                <div className="stat-value">
                                    <p>{detected_faces}</p>
                                </div>
                                <p>Rostros detectados</p>
                            </div>
                        </div>
                        
                    </div>
                </div>

                {datasets}

            </div>
        </li>
        )
        }
    )

    return (
        <div className="results-container">
            <div className="title">
                Resultados
            </div>
            <div className="results-box">
                <ul>
                    {listItems}
                </ul>
            </div>
        </div>
        
    )
}

export default Results;
