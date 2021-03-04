import { Button } from '@material-ui/core'
import React, { useState } from 'react'
import { storage, db} from "./firebase"
import firebase from "firebase"
import "./ImageUpload.css"

function ImageUpload({ username }) {
    const [caption, setCaption] = useState("");
    const [image , setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(false);

    const handleChange = (e) => {
        if(e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    }

    const handleUpload = () => {
        if(image == null) {
            setError(true)
            return;
        }

        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                )
                setProgress(progress);
            },
            (error) => {alert(error.message)},
            () => {
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageURL: url,
                            username: username,
                            likes: []
                        })
                        setProgress(0);
                        setCaption("");
                        setImage(null);
                        setError(false)
                    })
            }
        )        
    }

    return (
        <div className="imageupload">
            <input type="text" placeholder={`What's on your mind, ${username} ?`}
                onChange={e => setCaption(e.target.value)}
                value={caption}
                className="imageupload_caption"
            />
            <input className="imageupload_file" type="file" onChange={handleChange}/>
            {progress !== 0? <progress value={progress} max="100"/> : ""}
            {error? <p className="imageupload_error">Please upload image</p> : ""}
            <Button className="imageupload_button" onClick={handleUpload}>Upload</Button>
        </div>
    )
}

export default ImageUpload
