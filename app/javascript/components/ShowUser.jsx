import React, {useState, useEffect} from "react";
import UserInfo from "./UserInfo";
import ActivityFeed from "./ActivityFeed";


const ShowUser = (props) => {
    const [userData, setUserData] = useState(null);
    const [userEdit, setUserEdit] = useState(false);
    console.log(userData)

    useEffect(() => {
      getUserData();
    }, [])

    useEffect(() => {
      if (props.currentUser && userData && 
        props.currentUser.id === userData.id && 
        userEdit === false) {
        setUserEdit(true);
      } else if (userEdit && !props.currentUser) {
        setUserEdit(false);
      }
    })

    const getUserData = () => {
      const id = props.match.params.id
      const url = `/api/v1/users/show/${id}`;
  
      fetch(url)
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error("Network response was not ok.");
        })
        .then(response => {
          setUserData(response)
      })
        .catch(() => console.log("error"));
    }


    const updateProfileImage = (userId, imageData) => { 
      const formData =  new FormData();
      formData.append('profile_image', imageData["image"]);
      const url = `/api/v1/users/update/${userId}`;
      const token = document.querySelector('meta[name="csrf-token"]').content;
      fetch(url, {
      method: "PATCH",
      body: formData,
      headers: {
      "X-CSRF-Token": token, 
    },
  })
      .then(response => {
          if (response.ok) {
              return response.json()
          }
          throw new Error("Network response was not ok.");
      })
      .then(response => {
        getUserData();
      })
      .catch(error => console.log(error.message))
    }

    const updateProfileBio = (userId, bioText) => {
      const body = {
        bio: bioText,
    }
      const url = `/api/v1/users/update/${userId}`;
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
        getUserData();
    })
    .catch(error => console.log(error.message))
    }


    return(
      <div className = "activity-feed">
        <div className = "container-fluid">
          <div className = "row">
            <div className = "col-6">
              {userData ? 
                <UserInfo userData = {userData} updateProfileImage = {updateProfileImage} currentUser = {props.currentUser} 
                setCurrentUser = {props.setCurrentUser} userEdit = {userEdit} updateProfileBio = {updateProfileBio} 
                history = {props.history} /> : 
                false} {/* this would show a page with "no userdata for this user"*/}
            </div>
            <div className = "col-6">
              {userData ? 
                <ActivityFeed userData = {userData} /> :
                false}
            </div>
          </div>
        </div>
      </div>
    )
}



export default ShowUser;
