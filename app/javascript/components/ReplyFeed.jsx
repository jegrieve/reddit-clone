import React, {useState, useEffect} from "react";
import CreateReply from "./CreateReply";
import CommentReply from "./CommentReply";

const ReplyFeed = (props) => {
    const [loadedReplies, setLoadedReplies] = useState([]); 
    const [replyLimit, setReplyLimit] = useState(10);
    const [viewReplies, setViewReplies] = useState(false);
    const [createNewReply, setCreateNewReply] = useState(false);
    console.log(loadedReplies)
    useEffect(() => {
        getReplies();
    },[])

    useEffect(() => {
        getReplies();
    }, [replyLimit])

    const getReplies = () => {
        const url = `/api/v1/replies/index?id=${props.commentData.id}&limit=${replyLimit}`;
        fetch(url)
          .then(response => {
            if (response.ok) {
              return response.json();
            }
            throw new Error("Network response was not ok.");
          })
          .then(response => {
            setLoadedReplies(response);
          })
          .catch(() => console.log("error"));
    }

    const toggleReplies = () => {
        setViewReplies(!viewReplies)
    }

    const toggleCreateReply = () => {
        setCreateNewReply(!createNewReply)
    }

    const getMoreReplies = () => {
        setReplyLimit(replyLimit + 5);
    }

    const submitEditReply = (replyId, editReplyData) => {
        const body = {
          body: editReplyData["body"]
      }
        const url = `/api/v1/replies/update/${replyId}`;
        const token = document.querySelector('meta[name="csrf-token"]').content;
        fetch(url, {
        method: "PATCH",
        headers: {
        "X-CSRF-Token": token, 
        "Content-Type": "application/json"
      },
        body: JSON.stringify(body)
      })
      .then(response => {
          if (response.ok) {
              return response.json()
          }
          throw new Error("Network response was not ok.");
      })
      .then(response => {
          getReplies();
      })
      .catch(error => console.log(error.message))
      }

      const confirmDeleteComment= (replyId) => {
        const url = `/api/v1/replies/destroy/${replyId}`;
        const token = document.querySelector('meta[name="csrf-token"]').content;
      
        fetch(url, {
          method: "DELETE",
          headers: {
            "X-CSRF-Token": token,
            "Content-Type": "application/json"
          }
        })
          .then(response => {
            if (response.ok) {
              return response.json();
            }
            throw new Error("Network response was not ok.");
          })
          .then((response) => {
            getReplies();
          })
          .catch(error => console.log(error.message));
      }

    return (
        <div>
            {createNewReply ? 
                <div>
                    <CreateReply commentId = {props.commentData.id} currentUser = {props.currentUser}
                    setReplyLimit = {setReplyLimit} replyLimit = {replyLimit} />
                    <div>
                        <div className = "create-reply-btn" onClick = {toggleCreateReply}>Cancel Reply</div>
                    </div>
                </div> : 
                <div className = "view-reply-info">
                    <div className = "create-reply-btn" onClick = {toggleCreateReply}>Reply</div>
                </div>}
                {!viewReplies && !createNewReply ? <div className = "view-reply-info view-reply-btn dot-separate"> • </div> : false}
            {viewReplies ? 
            <div>
                <div className = "view-reply-btn" onClick = {toggleReplies}>Hide Replies</div>
                {loadedReplies.length ? 
                    <div>
                        {loadedReplies.map((el,i) => {
                        return (
                            <div className = "reply reply-style" key = {"r" + i}>
                                <CommentReply currentUser = {props.currentUser} data = {el} submitEditReply = {submitEditReply}
                                confirmDeleteComment = {confirmDeleteComment} />
                            </div>
                            )
                        })}
                    <div className = "load-more-replies-btn">
                        <button className = "btn btn-light" onClick = {getMoreReplies}>Load more</button>            
                    </div>
                    </div> 
                    : 
                    <div>No replies.</div>}
            </div> 
            :
            <div className = "view-reply-info">
                <div className = "view-reply-btn" onClick = {toggleReplies}>View Replies (amount)</div>
            </div>}
        </div>
    )
};


export default ReplyFeed;