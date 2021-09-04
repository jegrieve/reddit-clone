import React, {useState, useEffect} from "react";
import FeedComment from "./FeedComment"
import CreateComment from "./CreateComment"

const CommentFeed = (props) => { 
        const [loadedComments, setLoadedComments] = useState([]); 
        const [commentLimit, setCommentLimit] = useState(10);
        const [createCommentData, setCreateCommentData] = useState("");
        useEffect(() => {
            getComments();
        }, [])

        useEffect(() => {
            if (commentLimit > 10) {
                getComments();
                setCreateCommentData("");
            }
        }, [commentLimit])

        useEffect(() => {
            if (createCommentData === "") {
                props.getCommentLength();
            }
        }, [createCommentData])

        const getComments = () => {
            const url = `/api/v1/comments/index?id=${props.postId}&limit=${commentLimit}`;
            fetch(url)
              .then(response => {
                if (response.ok) {
                  return response.json();
                }
                throw new Error("Network response was not ok.");
              })
              .then(response => {
                console.log(response);
                setLoadedComments(response);
              })
              .catch(() => console.log("error"));
        }

        const getMoreComments = () => {
            setCommentLimit(commentLimit + 10);
        }

        return (
            <div className = "comment-feed">
                <div className = "create-comment">
                    <CreateComment postId = {props.postId} setCommentLimit = {setCommentLimit} commentLimit = {commentLimit} 
                    createCommentData = {createCommentData} setCreateCommentData = {setCreateCommentData}/>
                </div>
                {loadedComments.length ? 
                <div>
                    {loadedComments.map((el,i) => {
                    return (
                        <div className = "comment" key = {i}>
                            <div>
                                <FeedComment data = {el}/>
                            </div>
                        </div>
                        )
                    })}
                    <div className = "load-more-comments-btn">
                        <button className = "btn btn-secondary" onClick = {getMoreComments}>Load more</button>            
                    </div>
                </div> 
                : <div>No Comments.</div>}
            </div>
        )
}

export default CommentFeed;
