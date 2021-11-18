import { FolderOpen, PermContactCalendar } from "@material-ui/icons";
import { Link } from "react-router-dom";
import ReactFacebookLogin from "react-facebook-login";
import MyClass from '../MyClass/MyClass'
import "./Login.css";
import './App.css';
import GoogleLogin from 'react-google-login';
import App from '../../App'
import { ContextProvider } from '../../context/context';
import axios from "axios";
import React, { useState } from "react";
import { Avatar, Button, Dialog, Slide, TextField } from "@material-ui/core";
import { useLocalContext } from "../../context/context";
import { Close } from "@material-ui/icons";
import "./style.css";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


export const Profile = () => {
    const { profileDialog, setProfileDialog } = useLocalContext();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [re_password, setRePassword] = useState("");
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState(true);
    const [studentId, setStudentId] = useState("");
    const [tokenData, setTokenData ] = useState(
      localStorage.getItem('tokenData')
    ? JSON.parse(localStorage.getItem('tokenData'))
    : null
  );

    let fbContent = null;
    const [state, setState] = React.useState({
        isLoginIn: false,
        userID: '',
        name: '',
        email: '',
        picture:''
      });
    
    const responseFacebook = response=>{
          console.log(response);
      }
    const componentClicked =()=>console.log('clicked');

    function parseJwt (token) {
      var base64Url = token.split('.')[1];
      var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
  
      return JSON.parse(jsonPayload);
  };

    //login by Facebook
    const handleLoginFb = _ =>{
      if(state.isLoginIn){
        // <MyClass/>
      }else{
          fbContent =(
              <ReactFacebookLogin
                  appId="1510139052705581"
                  autoLoad={true}
                  fields="name,email,picture"
                  onClick={componentClicked}
                  callback={responseFacebook} />
          )
      }
    }


    // begin login by google
    const [loginData, setLoginData] = useState(
        localStorage.getItem('loginData')
          ? JSON.parse(localStorage.getItem('loginData'))
          : null
      );
    

      // end login by google

      //change profile 
      const changeProfile = e => {
        e.preventDefault();
        const newUser = {
            username: username,
            email: email,
            password: password,
            status: status
        };

        console.log(username)
        axios.put('http://localhost:5000/user/' + parseJwt(tokenData).id, newUser) 
        .then(response =>  {
          console.log(newUser);
          // localStorage.setItem('tokenData',JSON.stringify(response.data))
        });
        setProfileDialog(false);
      }

      //   //push account gg
      // const changeProfileGoogle = (e,loginData) => {
      //   e.preventDefault();
      //   const username = document.getElementsByName("usernameGG");
      //   const email = document.getElementsByName("emailGG");
      //   const newUser = {
      //       username: loginData.name,
      //       email: loginData.name
      //   };
      //   console.log(username)
      //   axios.post('http://localhost:5000/user', newUser) 
      //   .then(response =>  console.log(newUser));
      //   setProfileDialog(false);
      // }
      //login by email, password
      const loginHandle = e =>{
      }

      const addStudentId = e =>{
        e.preventDefault();
        const user = {
            studentId: studentId
        };
        axios.put('http://localhost:5000/user/studentId/'+parseJwt(tokenData).id,user) 
        .then(response => { 
            alert("Login successful")
            // setMessageError("Login successful");
            // setTokenData(response.data);
            // localStorage.setItem('tokenData', JSON.stringify(response.data));
            console.log(parseJwt(tokenData).id)
        })
        .catch(error=>{
          alert("Please check student id")
          // setMessageError(error.response.data.message);
          console.log(error)
        })
      }
      


    return (
        <div>
        <Dialog
                fullScreen
                open={profileDialog}
                onClose={() => setProfileDialog(false)}
                TransitionComponent={Transition}
            >
            <div className="login">
                <div className="login__wrapper">
                    <div
                        className="login__wraper2"
                        onClick={() => setProfileDialog(false)}>
                        <Close className="login__svg" />
                        <div className="login__topHead">Profile</div>
                    </div>
                </div>
            <div id="login-box">
                <div class="left">
                    <h1>Profile</h1>
                    {
                      loginData?(
                        <form onSubmit={changeProfile}>
                          <input className="login_input" type="text" name="username" placeholder={loginData.name}
                            value={username}
                            onChange={(e) => setUsername(e.target.value?e.target.value:loginData.name)}
                          />
                          <input className="login_input" type="text" name="email" placeholder={loginData.email}
                            value={email}
                            onChange={(e) => setEmail(e.target.value?e.target.value:loginData.email)}
                          />
                          <input className="login_input" type="password" name="password" placeholder={loginData.password}
                            value={password}
                            onChange={(e) => setPassword(e.target.value?e.target.value:loginData.password)}
                          />
                          <input className="login_input" type="password" name="password2" placeholder="Retype password"
                            value={re_password}
                            onChange={(e) => setRePassword(e.target.value)}
                          />
                        
                          <input class="Signup" type="submit" onClick={changeProfile} name="signup_submit" value="Change Profile"/>
                        </form>
                      ):(
                        <div></div>
                      )
                    }
                    {
                      tokenData?(
                        <form onSubmit={changeProfile}>
                          <input className="login_input" type="text" name="username" placeholder={parseJwt (tokenData).username}
                            value={username}
                            onChange={(e) => setUsername(e.target.value?e.target.value:parseJwt (tokenData).username)}
                          />
                          <input className="login_input" type="text" name="email" placeholder={parseJwt (tokenData).email}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                          <input className="login_input" type="password" name="password" placeholder={parseJwt (tokenData).password}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                          <input className="login_input" type="password" name="password2" placeholder="Retype password"
                            value={re_password}
                            onChange={(e) => setRePassword(e.target.value)}
                          />
                        
                          <input class="Signup" type="submit" onClick={changeProfile} name="signup_submit" value="Change Profile"/>
                        </form>
                      ):(
                        <div></div>
                      )
                    }
                </div>
                
                <div class="right-profile"> 
                    <input className="login_input" type="text" name="studentId" placeholder="studentId"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                    />
                    <input class="Signup" type="submit" onClick={addStudentId} name="signup_submit" value="Add"/>
                </div>
                <div class="or">AND</div>
            </div>
            </div>
            </Dialog>
        </div>
    );
}
export default Profile;
