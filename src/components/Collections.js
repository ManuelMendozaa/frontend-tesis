import React, { Fragment, useEffect, useState } from 'react';
import axios from "axios";
import { Redirect } from 'react-router';
import "../scss/collections.scss"

// React components
import Results from "./Results";
import ModalBox from '../shared/ModalBox';

const Collections = () => {

    // Hooks
    const [ folderNames, setFolderNames ] = useState([]);
    const [ selectedFolder, setSelectedFolder ] = useState();
    const [ analysis, setAnalysis ] = useState();
    const [ deleteFolder, setDeleteFolder ] = useState(false);
    const [ redirect, setRedirect ] = useState(false)
    const [ modal, setModal ] = useState(<div></div>);

    useEffect(() => {
        
        const getCollections = async () => {
            let folders = await axios.get("/get_folders")
            return folders
        }

        const env = async () => {
            await getCollections().then((res) => {
                setFolderNames(res.data)
            })
        }

        env();

    }, [])

    // Events
    const onClick = async (item) => {
        if(!deleteFolder){
            if(selectedFolder) {
                let filename = item;
                
                await axios.get("/get_analysis", {
                    params: {
                        filename: filename,
                        folder: selectedFolder
                    }
                }).then((res) => {
                    setAnalysis(res.data)
                })

            } else {
                setSelectedFolder(item)
                getItems(item)
            }
        } else {
            // delete item code
            if(selectedFolder) {
                await axios.get("/delete_analysis", {
                    params: {
                        file_name: item,
                        collection: selectedFolder
                    }
                }).then((res) => {
                    setFolderNames(res.data)
                })
            } else {
                await axios.get("/delete_collection", {
                    params: {
                        collection_name: item
                    }
                }).then((res) => {
                    setFolderNames(res.data)
                })
            }
        }
    }

    function onCreate(e) {
        e.preventDefault();
        setModal(<ModalBox analysis={false} setModal={setModal} setFolderNames={setFolderNames}/>)
    }

    async function onDelete (e) {
        e.preventDefault();
        setDeleteFolder(true)
    }

    function onDone(e) {
        e.preventDefault();
        setDeleteFolder(false);
    }

    function onRedirect(e) {
        e.preventDefault();
        setRedirect(true);
    }

    // Aux code
    const getItems = async (item) => {
        setFolderNames([]);
        let videos = await axios.get("/get_items", {
            params: {
                filename: item
            }
        })
        setFolderNames(videos.data);
    }

    // Change of view (redirect or analysis)
    if(redirect) {
        return <Redirect to="/analyzer" />
    }
    if(analysis) {
        console.log(analysis)
        return (
            <Results 
                res    = {analysis}
                folder = {selectedFolder}
            />
        )
    }

    // Creating list of items according to main folder
    const listItems = folderNames.map((item,index) => {  
        
        let code = "fas fa-folder";

        if (item.split(".").length > 1) {
            code = "fas fa-video"

            if(deleteFolder) {
                code += "-slash"
            }
        }
        else {
            if(deleteFolder) {
                code += "-minus"
            }
        }

        return (
            <li key={index}>
                <i className={code} onClick={(e) => {onClick(item)}}></i>
                <p>{item}</p>
            </li>
        )
    })

    // Setting options
    let options = <div></div>
    if (!deleteFolder) {
        if(selectedFolder) {
            options = (
                <div className="collections-options">
                    <button className="create" onClick={onRedirect}>Crear</button>
                    <button className="delete" onClick={onDelete}>Eliminar</button>
                </div>
            )
        } else {
            options = (
                <div className="collections-options">
                    <button className="create" onClick={onCreate}>Crear</button>
                    <button className="delete" onClick={onDelete}>Eliminar</button>
                </div>
            )
        }
        
    } else {
        options = (
            <div className="collections-options">
                <button className="create" onClick={onDone}>Done</button>
            </div>
        )
    }

    return (
        <div className="collections-container">
            <Fragment>
            
                <div className="title">
                    Colecciones
                </div>

                { selectedFolder ?
                    <div className="title">
                        {selectedFolder}
                    </div>
                    :
                    modal
                }

                <div className="collections">
                    <ul>
                        {listItems}
                    </ul>
                    
                    {options}
                    
                </div>

            </Fragment>
        </div>
    )
}

export default Collections;
