import React from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCircle } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from "react";
import ReplyFeed from "./ReplyFeed";

const FeedComment = (props) => { 
    const [editCommentData, setEditCommentData] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    useEffect(() => {
        if (editCommentData && editCommentData.id !== props.data.id) {
            setEditCommentData({...props.data});
            setEditMode(false);
            setConfirmDelete(false);
        } else if (editCommentData === null) {
            setEditCommentData({...props.data});
        }
    })

    const editComment = () => {
        setEditMode(true);
    }
    
    const cancelEditComment = () => {
        setEditMode(false);
    }

    const changeEditCommentData = (e) => {
            setEditCommentData((prev) => ({
              ...prev,
              [e.target.name]: e.target.value
            }));
    }

    const submitEditComment = (e) => {
        e.preventDefault();
        props.submitEditComment(editCommentData.id, editCommentData)
        setEditMode(false);
    }

    const deleteComment = () => {
        setConfirmDelete(true);
    }

    const cancelDeleteComment = () => {
        setConfirmDelete(false);
    }

    const cancelSubmit = () => {
        setEditCommentData({...props.data})
        setEditMode(false);
    }
    const confirmDeleteComment = () => {
        props.confirmDeleteComment(props.data.id)
    }

    return (
        <div>
            <div className = "comment-info d-flex align-items-center">
                {props.data.user.profile_image ? 
                <div>
                    <NavLink to = {`/user/${props.data.user.id}`}>
                        <img className = "comment-avatar-img" src = {props.data.user.profile_image.url}/>
                    </NavLink> 
                </div> 
                : 
                <div className = "comment-avatar-fa">
                    <NavLink className = "comment-avatar-link" to = {`/user/${props.data.user.id}`}>
                        <FontAwesomeIcon icon={faUserCircle} />
                    </NavLink> 
                </div>}
                <div className = "comment-user">
                    <NavLink className = "comment-user-link" to={`/user/${props.data.user.id}`}> u/{props.data.user.username} </NavLink>
                </div>
                <div className = "show-post-date">
                    • {props.data.created_at}
                </div>
            </div>
            {props.currentUser
            && props.currentUser.id === props.data.user.id ? 
            <div>
                {editMode ?
                 <div>
                     <form onSubmit = {submitEditComment}>
                        <textarea className = "create-comment-input" onChange = {changeEditCommentData} type = "text" name = "body" value = {editCommentData["body"]} rows = "2" minLength = {1} maxLength = {1000} placeholder = "Edit Comment" />
                        <div>
                            <div className = "edit-btns">
                                <button type = "submit" className = "btn btn-success submit-btn">Submit</button>
                                <button className = "btn btn-danger cancel-btn" onClick = {cancelSubmit}>Cancel</button>
                            </div>
                        </div>
                     </form>
                 </div> :             
            <div>
                {props.data.body}
                <div className = "edit-delete-btns">
                    <span className = "edit-post-btn" onClick = {editComment}>Edit </span>
                  • <span className = "delete-post-btn" onClick = {deleteComment}> Delete</span>
                </div>
                {confirmDelete ?
                <div>
                <div className = "red-text">Confirm delete?</div>
                <span><button className = "btn btn-primary" onClick = {cancelDeleteComment}>Cancel</button></span>
                <span className = "show-post-dlt"><button className = "btn btn-warning" onClick = {confirmDeleteComment}>Confirm</button></span>
                </div> : false }
            </div>}
            </div> : 
            <div>
                {props.data.body}
            </div>}
                <ReplyFeed commentData = {props.data} currentUser = {props.currentUser} />
        </div>
    )
}

export default FeedComment;
