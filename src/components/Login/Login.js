import { Avatar } from "@material-ui/core";
import { FolderOpen, PermContactCalendar } from "@material-ui/icons";
import React from "react";
import { Link } from "react-router-dom";
import ReactFacebookLogin from "react-facebook-login";
import MyClass from '../MyClass/MyClass'
import "./Login.css";
import './App.css';
import GoogleLogin from 'react-google-login';
import { useState } from 'react';
import App from '../../App'
import { ContextProvider } from '../../context/context';

const Login = ({ classData }) => {

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
    return (
        <div>
            <div id="login-box">
                <div class="left">
                    <h1>Sign up</h1>
                    
                    <input type="text" name="username" placeholder="Username"/>
                    <input type="text" name="email" placeholder="E-mail"/>
                    <input type="password" name="password" placeholder="Password"/>
                    <input type="password" name="password2" placeholder="Retype password"/>
                    
                    <input class="Signup" type="submit" name="signup_submit" value="Sign me up"/>
                </div>
                
                <div class="right">
                    <span class="loginwith">Sign in with<br/>social network</span>
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
    );
};

export default Login;
