import React, {useState, useEffect} from "react";
import { NavLink } from "react-router-dom";

const Board = (props) => {
    const [editBoardData, setEditBoardData] = useState(null);
    const [editBoard, setEditBoard] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    useEffect(() => {
        setEditBoardData({...props.data})
    }, [])

    const confirmEditBoardData = () => {
        setEditBoard("text");
    }

    const cancelEditBoard = () => {
        setEditBoardData({...props.data})
        setEditBoard(false);
    }

    const deleteBoard = () => {
        setConfirmDelete(true);
    }

    const cancelDeleteBoard = () => {
        setConfirmDelete(false);
    }

    const confirmDeleteBoard = () => {
        props.confirmDeleteBoard(editBoardData.id)
    }

    const submitEditBoardData = (e) => {
        e.preventDefault();
        props.submitEditBoardData(editBoardData.id, editBoardData);
        setEditBoard(false);
    }

    const handleEditBoard = (e) => {
        setEditBoardData((prev) => ({
          ...prev,
          [e.target.name]: e.target.value
        }));
      }
    
    const editBoardImage = () => {
        setEditBoard("image");
    }

    const onImageChange = (e) => {
        setEditBoardData((prev) => ({
            ...prev,
            board_image: e.target.files[0]
        }))
    };

    const cancelImageSubmit = () => {
        setEditBoard(false);
        setEditBoardData({...props.data});
    }

    const submitEditBoardImage = (e) => {
        e.preventDefault();
        props.submitEditBoardImage(editBoardData.id, editBoardData)
        setEditBoard(false);
    }

      if (editBoard === "text"
        && props.currentUser
        && props.currentUser.id === props.data.user_id.id) {
            return (
            <div>
                <form onSubmit = {submitEditBoardData}>
                    <div className = "form-group">
                        <div className = "edit-board-input-title">Title</div>
                        <input className = "form-control" name = "title" type = "text" onChange = {handleEditBoard} value = {editBoardData["title"]} minLength = {4} maxLength = {21} placeholder = "Title required" required/>
                    </div>
                    <div className = "form-group">
                        <div className = "edit-board-input-title">Body</div>
                        <textarea className = "form-control" name = "body" type = "text" onChange = {handleEditBoard} value = {editBoardData["body"]} rows = {4} placeholder = "Describe the type of content found in this board" minLength = {6} maxLength = {300} required/>
                    </div>
                    <div className = "edit-btns">
                        <button type = "submit" className = "btn btn-success submit-btn">Submit</button>
                        <button className = "btn btn-danger cancel-btn" onClick = {cancelEditBoard}>Cancel</button>
                    </div>
                </form>
            </div>)
        } else if (editBoard === "image"
        && props.currentUser
        && props.currentUser.id === props.data.user_id.id)  {
            return (
                <div>
                    <form onSubmit = {submitEditBoardImage}>
                        <div className = "form-group">
                            <div className = "edit-board-input-title">Image</div>
                            <input name = "board_image" className = "form-control" type = "file" accept = "image/*" multiple = {false} onChange = {onImageChange} required/>
                        </div>
                        <button className = "btn btn-success submit-btn">Submit</button>
                        <button className = "btn btn-danger cancel-btn" onClick = {cancelImageSubmit}>Cancel</button>
                    </form>
                </div>
            )
        } else {
            return (
                <div>
                    <div className = "container">
                        <div className = "row">
                            <div className = "col-sm-12 col-lg-8">
                                <div className = "show-board-title">{props.data.title}</div>
                                <div className = "board-create-data">Created by&nbsp; 
                                    <NavLink className = "board-user-link" to={`/user/${props.data.user_id.id}`}>u/{props.data.user_id.username}</NavLink>
                                    &nbsp;• {props.data.created_at} 
                                </div>
                                {props.currentUser 
                                && props.currentUser.id === props.data.user_id.id ?
                                <div className = "edit-board">
                                    <span className = "edit-board-info" onClick = {confirmEditBoardData}>Edit Board </span>
                                    • <span className = "edit-board-info" onClick = {deleteBoard}>Delete Board</span>
                                    {props.data.board_image ? <span> • <span className = "edit-board-info" onClick = {editBoardImage}>Edit Image</span></span> : false}
                                </div>: false}
                                {props.currentUser 
                                && props.currentUser.id === props.data.user_id.id
                                && confirmDelete ? 
                                <div>
                                    <div className = "red-text">WARNING: Delete board and all associated posts.</div>
                                    <span><button className = "btn btn-primary" onClick = {cancelDeleteBoard}>Cancel</button></span>
                                    <span className = "show-post-dlt"><button className = "btn btn-warning" onClick = {confirmDeleteBoard}>Confirm</button></span>
                                </div> : false}
                                <div className = "show-board-body">
                                    {props.data.body}
                                </div>
                            </div>
                            <div className = "col-4 d-none d-lg-block">
                                {props.data.board_image ? 
                                <div>
                                    <img className = "show-board-img" src = {props.data.board_image.url} />
                                </div> 
                                : false}
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
}


export default Board;