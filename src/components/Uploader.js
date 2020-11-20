import React, { useEffect, useState } from 'react';
import axios from "axios";
import "../scss/uploader.scss"
import UploadFile from './UploadFile';
import Analysis from './Analysis';
import ModalBox from '../shared/ModalBox';

const Uploader = () => {

    // Hooks for file uploading
    const [ file, setFile ] = useState(null);
    const [ uploadedFiles, setUploadedFiles ] = useState([]);
    const [ uploadPercentages, setUploadPercentages ] = useState([0]);

    // Hooks for analysis
    const [ folder, setFolder ] = useState();
    const [ modal, setModal ] = useState(<div></div>);

    // Getting uploaded files
    useEffect(() => {
        const getUploads = async () => {
            let res = await axios.get("/get_uploads");
            return res;
        }
        const env = async () => {
            await getUploads().then((res) => {
                setUploadedFiles(res.data.uploads)
                setUploadPercentages(res.data.percentages)
            })
        }

        env();
    }, [])


    // onEvent handlers
    async function onChange (e) {
        console.log(e.target.files[0])
        setFile(e.target.files[0]);
    }

    async function onSubmit (e) {
        e.preventDefault();

        if(!!file) {
            // Show file box on screen
            let index = addUpload(file);

            const formData = new FormData();
            formData.append("file", file);

            // Clean label
            removeFile();

            try {
                
                await axios.post("/upload_video", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    onUploadProgress: progressEvent => {
                        function updateBar(index) {
                            const { loaded, total } = progressEvent;
                            let progress = uploadPercentages
                            progress[index] = Math.round((loaded * 100) / total)
                            setUploadPercentages(progress);
                        }
                        
                        updateBar(index)

                        let progress = uploadPercentages.concat(0);
                        setUploadPercentages(progress);
                    }
                });

            } catch(err) {
                if(!!err.response){
                    if(err.response.status === 500) {
                        alert("There was a problem with the server")
                    }
                    else if(err.response.status === 404) {
                        alert("Server was not found")
                    }
                    else if(err.response.status === 400) {
                        alert(err.response.data)
                    }
                    else {
                        alert("Something went wrong")
                    }
                } else {
                    console.log(err)
                }
                removeUpload(uploadPercentages[index].filename)
            }
        }
        console.log("xd")
        return false
    }

    const deleteUpload = filename => {
        removeUpload(filename)

        const formData = new FormData();
        formData.append("filename", filename);

        try {
            let proxy_path = "/delete_video";
            axios.post(proxy_path, formData);

        } catch (err) {
            if(!!err.response) {
                if(err.response.status === 404) {
                    alert("Server not found")
                } else {
                    alert("Mamaste")
                }
            }
        }
    }

    const removeFile = () => {
        setFile(null);
    }

    const onAnalyze = () => {
    
        let aux_bool = true
        for (let index = 0; index < uploadPercentages.length; index++) {
            if(uploadPercentages[index] !== 100) {
                aux_bool = false;
                break;
            }
        }

        if(uploadPercentages[uploadPercentages.length-1] === 0) {
            aux_bool = true
        }

        if(aux_bool && uploadPercentages.length > 0) {
            setModal(<ModalBox analysis={true} setModal={setModal} setFolder={setFolder}/>)
        }
    }

    // Aux functions
    const addUpload = file => {
        let filename = file.name
        let format = filename.split(".")[1]

        // Computing size
        let aux_size = file.size

        let size_scale = ["B","KB","MB","GB","TB"]
        let aux_index = 0
        while(aux_size > 1024 && aux_index < size_scale.length) {
            aux_size /= 1024
            aux_index += 1
        }
        aux_size = Math.round(aux_size * 100) / 100;
        let size = `${aux_size}` + size_scale[aux_index];
        let index = uploadedFiles.length

        let aux_list = uploadedFiles.concat({
            index: index,
            filename: filename,
            format: format,
            size: size
        });

        setUploadedFiles(aux_list);
        return index
    }

    const removeUpload = filename => {
        let new_list = []
        let new_percentages = []
        for (let index = 0; index < uploadedFiles.length; index++) {
            if(uploadedFiles[index].filename !== filename) {
                new_list.push(uploadedFiles[index])
                new_percentages.push(uploadPercentages[index])
            }
        }
        setUploadedFiles(new_list);
        setUploadPercentages(new_percentages);
    }

    
    if(!!folder) {
        return (
            <Analysis 
                files  = {uploadedFiles}
                folder = {folder}
            />
        )
    }

    const listItems = uploadedFiles.map((item) => 
        <li key={item.index}>
            <UploadFile
                filename={item.filename}
                format={item.format}
                size={item.size}
                deleteFile={deleteUpload}
                loaded={uploadPercentages[item.index]}
            />
        </li>
    )

    return (
        <div className="uploader-container">
            <div className="uploader-title">
                archivos para analizar
            </div>
            <div className="uploader-list">
                <ul>{listItems}</ul>
            </div>
            
            <form className="choose-file" onSubmit={onSubmit}> 
            
                <div className="file-container">
                    { file ?
                        <p> { file.name } </p>
                        :
                        <label className="file-label" htmlFor="customFile">
                            <input type="file" className="file-input" id="customFile" onChange={ onChange }/>
                            <p><i className="fas fa-cloud-upload-alt"></i></p>
                            <p>Presione para seleccionar archivo</p>
                        </label>   
                    }
                </div>

                <div className="file-options">
                    <input type="submit" value="Cargar" className="file-input" id="customFile"/>
                    <button type="button" onClick={ removeFile }>Eliminar</button>
                </div>

            </form>

            <div  className="analysis-button">
                <button onClick={onAnalyze}>Analizar</button>
            </div>
            
            {modal}
        </div>
    )
}

export default Uploader;