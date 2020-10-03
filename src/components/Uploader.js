import React, { useState } from 'react';
import axios from "axios";
import "../scss/uploader.scss"
import UploadFile from './UploadFile';

const Uploader = () => {

    const [file, setFile] = useState();
    const [ uploadedFiles, setUploadedFiles ] = useState([]);
    const [ uploadPercentages, setUploadedPercentages ] = useState([0]);

    const onSubmit = async e => {
        if(!!file) {
            e.preventDefault();

            const formData = new FormData();
            formData.append("file", file);

            let aux_file = file;

            
                // Showing box in screen
                addUpload(aux_file);

                // Clearing the space
                removeFile();
                
                // Sending to backend
                await axios.post("/upload_video", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    },
                    onUploadProgress: progressEvent => {

                        let aux_list = uploadPercentages;
                        let file_index = uploadPercentages.length - 1;

                        function loadbar(aux_list, file_index) {
                            aux_list[file_index] = parseInt(Math.round(
                                (progressEvent.loaded * 100) / progressEvent.total
                            ));

                            setUploadedPercentages(aux_list);
                        }
                        
                        loadbar(aux_list, file_index);

                        let new_percentage = uploadPercentages.concat(0);
                        setUploadedPercentages(new_percentage)
                    }
                })

                
        }

        // Avoid refreshing the page to keep changes
        console.log("reach")
        return false
    }

    const onChange = e => {
        setFile(e.target.files[0]);
    }

    const addUpload = async (file) => {

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

        let aux_list = uploadedFiles.concat({
            index: uploadedFiles.length,
            filename: filename,
            format: format,
            size: size
        });

        setUploadedFiles(aux_list);
    }

    const removeUpload = filename => {
        let new_list = []
        for (let index = 0; index < uploadedFiles.length; index++) {
            if(uploadedFiles[index].filename !== filename) {
                new_list.push(uploadedFiles[index])
            }
        }
        setUploadedFiles(new_list)
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

    return (
        <div className="uploader-container">
            <div className="uploader-title">
                Upload File
            </div>
            <div className="uploader-list">
                <ul>
                    { uploadedFiles.map((item) => 
                        <li key={item.index}>
                            <UploadFile
                                filename={item.filename}
                                format={item.format}
                                size={item.size}
                                deleteFile={deleteUpload}
                                loaded={uploadPercentages[item.index]}
                            />
                        </li>
                    )}
                </ul>
            </div>
            
            <form className="choose-file" onSubmit={ onSubmit }> 
            
                <div className="file-container">
                    { file ?
                        <p> { file.name } </p>
                        :
                        <label className="file-label" htmlFor={"customFile"}>
                            <input type="file" className="file-input" id={"customFile"} onChange={ onChange }/>
                            <p><i className="fas fa-cloud-upload-alt"></i></p>
                            <p>Click here to select file</p>
                        </label>   
                    }
                </div>

                <div className="file-options">
                    <input type="submit" value="Upload" className="file-input" id={"customFile"} />
                    <button onClick={ removeFile }>Delete File</button>
                </div>

            </form>
            
        </div>
    )
}

export default Uploader;
