import React, {useState, useEffect} from "react";

const CreatePost = (props) => {
    const [postContent, setPostContent] = useState({
        title: '',
        body: '',
        image: null
    })
    const [loadedContent, setLoadedContent] = useState(null)

    const handleChange = (e) => {
        setPostContent((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    }

    const onImageChange = (e) => {
        setPostContent((prev) => ({
            ...prev,
            image: e.target.files[0]
        }))
    };

    const submitPostData = (e) => {
        e.preventDefault();
        const formData =  new FormData();
        formData.append('title', postContent["title"]);
        formData.append('body', postContent["body"]);
        formData.append('image', postContent["image"]);

        const url = "api/v1/posts/create"
        const token = document.querySelector('meta[name="csrf-token"]').content;
        fetch(url, {
        method: "POST",
        body: formData,
        headers: {
        "X-CSRF-Token": token, 
      },
    })
     .then(response => {
         if (response.ok) {
            renderPostData();
         } else {
            console.log("did not post")
         }
     })
}

    const renderPostData = () => {
            const id = props.currentUser.id
            const url = `/api/v1/users/show/${id}`;
        
            fetch(url)
              .then(response => {
                if (response.ok) {
                  return response.json();
                }
                throw new Error("Network response was not ok.");
              })
              .then(response => {
                props.history.push(`/post/${response.posts[response.posts.length - 1].id}`);
            })
              .catch(() => console.log("error"));
    }


    return (
        <div>
            <form onSubmit = {submitPostData}>
                <label>Title:
                <input name = "title" type = "text" onChange = {handleChange} value = {postContent["title"]} />
                </label>
                <label>Body:
                <input name = "body" type = "text" onChange = {handleChange} value = {postContent["body"]}/>
                </label>
                <label>Image:
                <input type = "file" accept = "image/*" multiple = {false} onChange = {onImageChange} />
                </label>
                <button>Create Post</button>
            </form>
        </div>
    )
};

export default CreatePost;

{/* <input id="user-email" type="email" onChange = {enterSignUpInputs} value = {createUserInputs["email"]} /> */}
