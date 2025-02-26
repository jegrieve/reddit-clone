import React, {useEffect, useState} from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons'

const ShowPostData = (props) => {
    const [editPostData, setEditPostData] = useState(null);
    const [editPost, setEditPost] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    useEffect(() => {
        setEditPostData({...props.data})
    },[])

    useEffect(() => {
        if (editPost === "submitted") {
          props.submitEditPost(editPostData.id, editPostData);
        } else if (editPost === "submitted-image") {
          props.submitEditPostImage(editPostData.id, editPostData)
        } else if (editPost === "cancel") {
            setEditPostData({...props.data});
            setEditPost(false);
        }
      }, [editPost])


    const editPostText = () => {
        if (editPostData) {
            setEditPost("text");
        }
    }

    const handleEditPost = (e) => {
        setEditPostData((prev) => ({
          ...prev,
          [e.target.name]: e.target.value
        }));
      }

    const submitEditPostData = (e) => {
        e.preventDefault();
        if (editPost === "text") {
            setEditPost("submitted");
        } else {
            setEditPost("submitted-image")
        }
      }

    const editPostImage = () => {
        if (editPostData) {
            setEditPost("image");
        }
    }

    const onImageChange = (e) => {
        setEditPostData((prev) => ({
            ...prev,
            image: e.target.files[0]
        }))
    };

    const cancelSubmit = () => {
        setEditPost("cancel")
    }

    const deletePostConfirm = () => {
        setConfirmDelete(true);
    }

    const cancelDeletePost = () => {
        setConfirmDelete(false);
    }

    const confirmDeletePost = () => {
        props.confirmDeletePost(props.data.id)
    }


    if (editPost === "text" 
        && props.currentUser
        && props.currentUser.id === props.data.user.id) {
        return (
            <div>
                <form onSubmit = {submitEditPostData}>
                    <div className = "form-group">
                        <div className = "edit-title">Title</div>
                        <textarea id = "test" className = "show-post-title-edit form-control" name = "title" value = {editPostData["title"]} 
                        onChange = {handleEditPost} minLength = {1} maxLength = {300} placeholder = "Title required" required/> 
                    </div>
                    <div className = "form-group">
                        <div className = "edit-title">Body</div>
                        <textarea className = "show-post-body-edit form-control" name = "body" value = {editPostData["body"]} 
                        onChange = {handleEditPost} placeholder = "Body optional" maxLength = {10000} rows="5" />
                    </div>
                    <div>
                        {props.data.video_link ? 
                            <div className = "form-group">
                                <div className = "edit-title">YouTube Link</div>
                                <input className = "show-post-video-edit form-control" name = "video_link" type = "text" value = {editPostData["video_link"]} 
                                onChange = {handleEditPost} />
                            </div> 
                            : false}
                    </div>
                    <div className = "edit-btns">
                        <button className = "btn btn-success submit-btn">Submit</button>
                        <button className = "btn btn-danger cancel-btn" onClick = {cancelSubmit}>Cancel</button>
                    </div>
                </form>
            </div>
        )
    } else if (editPost === "image"
                && props.currentUser
                && props.currentUser.id === props.data.user.id) {
        return (
            <div>
                <form onSubmit = {submitEditPostData}>
                    <div className = "form-group">
                        <div className = "edit-title">Image</div>
                        <input name = "image" className = "form-control show-post-image-edit" type = "file" accept = "image/*" multiple = {false} onChange = {onImageChange} required/>
                        <div className = "edit-btns">
                            <button className = "btn btn-success submit-btn">Submit</button>
                            <button className = "btn btn-danger cancel-btn" onClick = {cancelSubmit}>Cancel</button>
                        </div>
                    </div>
                </form>
            </div>
        )
    } else {
        return (
            <div>
                <div>
                    <div className = "show-post-title">{props.data.title}</div>
                </div>
                <div className = "show-post-info">
                    <span className = "show-post-board">
                        <NavLink className = "post-board-link" to={`/board/${props.data.board.id}`}> b/{props.data.board.title} </NavLink>
                    </span>
                    <span className = "show-post-user">
                        • posted by <NavLink className = "post-user-link" to={`/user/${props.data.user.id}`}> u/{props.data.user.username} </NavLink>
                    </span>
                    <span className = "show-post-user-date">
                       • created on {props.data.created_at}
                    </span>
                    {props.data.created_at !== props.data.updated_at ? 
                    <span className = "show-post-updated-date">
                         • edited on {props.data.updated_at}
                    </span>
                    :false}
                </div>
                <div>
                    <div className = "show-post-body">{props.data.body}</div>
                </div>
                {props.data.image ? 
                    <div className = "show-post-image-container">
                        <img className = "show-post-image" src = {props.data.image.url} />
                    </div>
                    : props.formattedVideoLink ? 
                    <div className = "show-post-video-container">
                        <iframe frameBorder="0" className = "show-post-video" width="850" height="480" src={props.formattedVideoLink} />
                    </div> 
                    : false}
                    {props.data ? 
                    <div className = "d-flex align-items-center post-comments-options">
                        <div className = "show-post-likes-count">
                            {props.currentUser ? (props.data.liking_users.some((ele) => ele.id === props.currentUser.id) || props.userLiked === true)
                            ? 
                            <div className = "show-post-heart-btn" onClick = {props.unLikePost}>
                                <FontAwesomeIcon icon = {faHeart} /> {props.likedPost} Likes
                            </div> 
                            : 
                            <div className = "show-post-heart-btn" onClick = {props.likePost}>
                                <FontAwesomeIcon icon = {farHeart} /> {props.likedPost} Likes
                            </div>
                            :
                            <div className = "show-post-heart-btn">
                            <FontAwesomeIcon icon = {farHeart} /> {props.likedPost} Likes
                            </div>}
                        </div>
                        <div className = "show-post-comments-count">
                            • {props.commentLength} Comments&nbsp;
                            {props.currentUser
                            && props.currentUser.id === props.data.user.id ? 
                            <span>
                                • <span className = "edit-post-btn" onClick = {editPostText}>Edit Post </span>
                                {props.data.image ? <span>• <span className = "edit-post-btn" onClick = {editPostImage}>Edit Image</span> </span> : false}
                                • <span className = "delete-post-btn" onClick = {deletePostConfirm}>Delete Post</span>
                            </span> : false}
                        </div>
                    </div> : false}
                    {confirmDelete
                    && props.currentUser
                    && props.currentUser.id === props.data.user.id ? 
                            <div>
                                <div className = "red-text">WARNING: Delete post and all associated comments.</div>
                                <span><button className = "btn btn-primary" onClick = {cancelDeletePost}>Cancel</button></span>
                                <span className = "show-post-dlt"><button className = "btn btn-warning" onClick = {confirmDeletePost}>Confirm</button></span>
                            </div> : false}
            </div>
        )
    }

    
}




export default ShowPostData;