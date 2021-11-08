// import { Avatar } from "@material-ui/core";
// import { FolderOpen, PermContactCalendar } from "@material-ui/icons";
// import React from "react";
// import { Link } from "react-router-dom";

// import MyClass from '../MyClass/MyClass'
// import "./Register.css";
// import './App.css';

// import { useState } from 'react';
// import App from '../../App'
// import { ContextProvider } from '../../context/context';


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


export const Register = () => {
    const { registerDialog, setRegisterDialog } = useLocalContext();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [re_password, setRePassword] = useState("");
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState(true);

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

    //login by Facebook
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

    // begin login by google
    const [loginData, setLoginData] = useState(
        localStorage.getItem('loginData')
          ? JSON.parse(localStorage.getItem('loginData'))
          : null
      );
    
      const handleFailure = (result) => {
        alert(result);
      };
    
      const handleLogin = async (googleData) => {
        const res = await fetch('/api/google-login', {
          method: 'POST',
          body: JSON.stringify({
            token: googleData.tokenId,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
    
        const data = await res.json();
        setLoginData(data);
        localStorage.setItem('loginData', JSON.stringify(data));
      };
      const handleLogout = () => {
        localStorage.removeItem('loginData');
        setLoginData(null);
      };

      // end login by google

      //register by email, password
      const SignupSubmit = e => {
        e.preventDefault();
        const newUser = {
            username: username,
            email: email,
            password: password,
            status: status
        };
        axios.post('http://localhost:5000/user', newUser) 
        .then(response =>  console.log(newUser));
        setRegisterDialog(false);
      }

      //login by email, password
      const loginHandle = e =>{
      }
    return (
        <div>
        <Dialog
                fullScreen
                open={registerDialog}
                onClose={() => setRegisterDialog(false)}
                TransitionComponent={Transition}
            >
            <div className="login">
                <div className="login__wrapper">
                    <div
                        className="login__wraper2"
                        onClick={() => setRegisterDialog(false)}>
                        <Close className="login__svg" />
                        <div className="login__topHead">Sign Up</div>
                    </div>
                </div>
            <div id="login-box">
                <div class="left">
                    <h1>Sign up</h1>
                    <form onSubmit={SignupSubmit}>
                      <input className="login_input" type="text" name="username" placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                      <input className="login_input" type="text" name="email" placeholder="E-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <input className="login_input" type="password" name="password" placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <input className="login_input" type="password" name="password2" placeholder="Retype password"
                        value={re_password}
                        onChange={(e) => setRePassword(e.target.value)}
                      />
                    
                      <input class="Signup" type="submit" onClick={SignupSubmit} name="signup_submit" value="Sign up"/>
                    </form>
                    
                </div>
                
                <div class="right">
                    <span class="loginwith">Sign in with<br/><br/>social network</span>
                    <div class="social-signin ">{fbContent}</div>

                    {/* <button class="social-signin twitter">Log in with Twitter</button>
                    <button class="social-signin google">Log in with Google+</button> */}
                    <div class="social-signin">
                        {
                            loginData ? (
                            <div>
                            <h3>You logged in as {loginData.email}</h3>
                            <button onClick={handleLogout}>Logout</button>
                            </div>  
                        ) :
                        (
                            <GoogleLogin
                            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                            buttonText="LOG IN WITH GOOGLE"
                            onSuccess={handleLogin}
                            onFailure={handleFailure}
                            cookiePolicy={'single_host_origin'}
                            ></GoogleLogin>
                        )}
                    </div>
                </div>
                <div class="or">OR</div>
            </div>
            </div>
            </Dialog>
        </div>
    );
}
export default Register;
