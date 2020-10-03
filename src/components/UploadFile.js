import React from 'react';
import "../scss/upload-file.scss";

const UploadFile = (props) => {

    const deleteFile = e => {
        props.deleteFile(props.filename)
    }

    return (
        <div className="upload-file">
            <div className="format">
                <p>{props.format}</p>
            </div>
            <div className="file-progress">
                <div className="file-info">
                    <div className="file-name">
                        <p>{props.filename}</p>
                    </div>
                    <div className="file-size-wrap">
                        <div className="file-size">{props.size}</div>
                        <div onClick={deleteFile} className="file-delete">X</div>
                    </div>
                </div>
                <div className="progress">
                     <div className="progress-bar" style={{ width: `${props.loaded}%` }}></div>
                </div>
            </div>
        </div>
    )
}

export default UploadFile
