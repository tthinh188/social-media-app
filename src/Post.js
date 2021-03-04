import React, { useState, useEffect, forwardRef } from 'react'
import "./Post.css"
import Avatar from "@material-ui/core/Avatar"
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder"
import FavoriteIcon from "@material-ui/icons/Favorite"
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import firebase from "firebase"
import { db } from "./firebase"

const Post = forwardRef(({username, user, imageURL, caption, postId, likes }, ref) => {
    const [like, setLike] = useState(likes?.indexOf(user?.displayName) !== -1);
    const [comments, setComments] = useState([]);
    const [userComment, setUserComment] = useState("");
    
    useEffect( () => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db
                .collection("posts")
                .doc(postId)
                .collection("comments")
                .orderBy("timestamp", "desc")
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map(doc => doc.data()));
                })
        }
        return () => {
            unsubscribe();
        }
    }, [postId])

    const handleComment = (e) => {
        e.preventDefault();
        
        db.collection("posts").doc(postId).collection("comments").add({
            text: userComment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
        setUserComment("");
    }

    const handleLike = () => {
        setLike(!like);
        if (user) {
            db.collection("posts").doc(postId).update({
                likes: like? firebase.firestore.FieldValue.arrayRemove(user.displayName) : 
                    firebase.firestore.FieldValue.arrayUnion(user.displayName)
            })
        }
            // if (like){

            // }
            // else {
            //     db.collection("posts").doc(postId).update({
            //         likes: firebase.firestore.FieldValue.arrayUnion(user.displayName)
            //     })
            // }
        
        // console.log(userLiked)
        
        // db.collection("posts").doc(postId).where("username", "==", user.displayName)
        // .get().then(data => {
        //     data.docs.map(doc => {
        //         console.log(doc.data().username)
        //     })
        // })
        
        
        // db.collection("posts").doc(postId).collection("comments")
        // .where("username", "==",  user.displayName)
        // .get()
        //     .then(data => {
        //         data.docs.map(doc =>{
        //             console.log(doc.data().username)
                    
        //         })
        //     })
        
        // if(!user.displayName in userLiked)
        // var cmt = db.collection("posts").doc(postId).collection("userLiked")
        // .add({
        //     username: user.displayName
        // })
        // console.log(user.displayName)
    }
    return (
        <div ref={ref} className="post">
            <div className="post_header">
                <Avatar
                className="post_avatar"
                alt={username}
                src=""
                />
            <h3>{username}</h3>
            </div>
            
            <img 
                className="post_image"
                alt=""
                src={imageURL}
            />
            <div className="post_features">
                <div className={`post_icon ${like && "like"}`}>
                    {like? <FavoriteIcon onClick={handleLike}/> : <FavoriteBorderIcon onClick={handleLike}/>}
                </div>
                <div className="post_icon">
                    <ChatBubbleOutlineIcon />
                </div>
            </div>
            <div>
                <p className="post_like"><strong>{likes?.length} {likes.length === 1 || likes.length === 0? "Like" : "Likes"}</strong></p>
            </div>
            <h4 className="post_text"><strong>{username}</strong>: {caption}</h4>
           
            <div className="post_comments">
                {comments.map((comment) => (
                    <p>
                        <b>{comment.username}</b>: {comment.text}
                    </p>
                ))}            
            </div>

            {user && (
                <form className="post_commentForm">
                <input 
                    className="post_commentText" 
                    type="text"
                    value={userComment}
                    placeholder="Add a comment"
                    onChange={(e)=> setUserComment(e.target.value)} 
                />
                <button
                    disabled={!userComment}
                    className="post_button"
                    type="submit"
                    onClick={handleComment}
                >Post</button>
            </form>
            )}

        </div>
    )
})

export default Post
