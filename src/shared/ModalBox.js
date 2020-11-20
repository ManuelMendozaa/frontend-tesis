import React, { Fragment, useState, useEffect } from 'react';
import axios from "axios";
import "../scss/modalbox.scss";

const ModalBox = (props) => {

    const [ folders, setFolders ] = useState([]);
    const [ value, setValue ] = useState("");

    // Selecting folders
    useEffect(() => {
        
        const getCollections = async () => {
            let folders = await axios.get("/get_folders")
            return folders
        }

        const env = async () => {
            await getCollections().then((res) => {
                setFolders(res.data)
            })
        }
        
        if(props.analysis) {
            env();
        }
    }, [])

    async function onSelected(folder) {
        console.log(folder)
        props.setFolder(folder)
    }

    // Creating folders
    async function onSubmit(e) {
        e.preventDefault();
        
        try{
            let res = await axios.get("/create_collection", {
                params: {
                    new_name: value
                }
            })
            props.setFolderNames(res.data)

        } catch(err) {
            console.log(err)
        }

        props.setModal(<div></div>);
    }

    async function onChange(e) {
        e.preventDefault();
        setValue(e.target.value)
    }

    // General code
    function onClick(e) {
        e.preventDefault();
        // Delete modal
        props.setModal(<div></div>);
    }

    function onExit(e) {
        e.preventDefault();
        props.setModal(<div></div>);
    }

    function onModalClick(e) {
        // Avoid closing modal when clicking on it
        e.stopPropagation();
    }

    let collectionList = ""
    if (props.analysis) {
        collectionList = folders.map((item,index) => {  
            return (
                <li key={index}>
                    <div className="folder">
                        <i className="fas fa-folder" onClick={(e) => {onSelected(item)}}></i>
                        <p>{item}</p>
                    </div>
                </li>
            )
        })
    }
    
    return (
        <div className="modalbox-container" onClick={onClick}>
            <div className="modal-box" onClick={onModalClick}>
                <Fragment>
                    { props.analysis ?
                        <div className="analysis">
                            <div className="title">
                                <h3>Seleccione la colección destino para este análisis haciendo click</h3>
                            </div>
                            
                            <ul className="listfolders">
                                {collectionList}
                            </ul>           
                        </div>
                        :
                        <div className="creation">
                            <i className="fas fa-folder-plus"></i>

                            <form onSubmit={onSubmit}>
                                <input type="text" className="form__field" placeholder="Name" value={value} id='name' onChange={onChange} required />
                                <label className="form__label" htmlFor="name">Name</label>
                                <div className="modal-options">
                                    <input type="submit" value="Crear" className="create" id="name"/>
                                </div>
                            </form>

                            
                        </div>           
                    }
                    <button className="close fas fa-times" onClick={onExit}></button>
                </Fragment>
            </div>
        </div>
    )
}

export default ModalBox;
