import React, { Fragment, useEffect, useState } from 'react';
import axios from "axios";
import "../scss/analysis.scss";

// Components
import Results from "./Results";

const Analysis = (props) => {

    // Hooks
    const [ results, setResults ] = useState();
    
    // useEffect to analyze just once
    useEffect(() => {
        
        const analysis = async () => {
            let videoList = props.files;
            let results = []
    
            for (let index = 0; index < videoList.length; index++) {
                // Obtaining filename for backend
                let filename = videoList[index].filename;

                // Getting results' container ready
                results.push({
                    file: filename,
                    datasets: []
                })
    
                // At first let's get the number of requests needed
                await axios.get("/get_blocks", {
                    params: {
                        filename: filename,
                        folder: props.folder
                    }
                }).then(async (res) => {
                    // Once done, it's time to start analyzing videos
                    let blocks = res.data + 15;
                    console.log("Blocks: " + blocks)
    
                    // For each block, make request and append data
                    for (let block_id = 0; block_id < blocks; block_id++) {
                        await axios.get("get_predictions", {
                            params: {
                                filename: filename,
                                folder: props.folder,
                                block_id: block_id,
                                total_blocks: blocks
                            },
                            timeout: 120000
                        }).then((res) => {
                            results[index].datasets = res.data
                        }).catch((err) => {
                            console.log(err)
                        })
                        break
                    }
    
                }).catch((err) => {
                    console.log(err)
                });
            }
    
            return results
        }

        const controller = async () => {
            await analysis().then((res) => {
                setResults(res)

            });
        }

        controller();

    }, [])

    return (
        <div className="analysis-container">
            <Fragment>
                {  results ?
                    <Results 
                        res    = {results}
                        folder = {props.folder}
                    />
                    :
                    <div className="loading-container">
                        Loading...
                    </div>
                }
            </Fragment>
        </div>
    )
}

export default Analysis;