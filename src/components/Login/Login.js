import { FolderOpen, PermContactCalendar } from "@material-ui/icons";
import { Link } from "react-router-dom";
import ReactFacebookLogin from "react-facebook-login";
import "./Login.css";
import './App.css';
import GoogleLogin from 'react-google-login';
import axios from "axios";
import React, { useState } from "react";
import { Avatar, Button, Dialog, Slide, TextField } from "@material-ui/core";
import { Alert, AlertTitle } from "@mui/material";
import { useLocalContext } from "../../context/context";
import { Close } from "@material-ui/icons";
import "./style.css";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const Login = () => {
    const { loginDialog, setLoginDialog } = useLocalContext();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [re_password, setRePassword] = useState("");
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState(true);
    const [MessageError, setMessageError] = useState("");
    const [tokenData, setTokenData ] = useState(
      localStorage.getItem('TokenData')
    ? JSON.parse(localStorage.getItem('TokenData'))
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
        const newUser = {
          username: data.name,
          email: data.email,
          password:data.email,
          status: status
      };
      axios.post('http://localhost:5000/user/', newUser) 
      .then(res =>  {
        console.log(res.data)
        localStorage.setItem('tokenData', JSON.stringify(res.data));
      })
      
      localStorage.setItem('loginData', JSON.stringify(data));
        
      window.location.reload(true);
      };

      const handleLogout = () => {
        localStorage.removeItem('loginData');
        setLoginData(null);
      };

      // end login by google

      //Login by email, password
      const LoginSubmit = e => {
        e.preventDefault();
        const user = {
            email: email,
            password: password
        };
        axios.post('http://localhost:5000/user/login',user) 
        .then(response => { 
            alert("Login successful")
            // setMessageError("Login successful");
            setTokenData(response.data);
            localStorage.setItem('tokenData', JSON.stringify(response.data));
            console.log(localStorage.getItem('tokenData'))
            window.location.reload(true);
        })
        .catch(error=>{
          // alert("Please check email and password")
          setMessageError(error.response.data.message);
          console.log(error)
        })
        // setLoginDialog(false);
      }



    return (
        <div>
        <Dialog
                fullScreen
                open={loginDialog}
                onClose={() => setLoginDialog(false)}
                TransitionComponent={Transition}
            >
            <div className="login">
                <div className="login__wrapper">
                    <div
                        className="login__wraper2"
                        onClick={() => setLoginDialog(false)}>
                        <Close className="login__svg" />
                        <div className="login__topHead">Login</div>
                    </div>
                </div>
                {
                  MessageError?(
                    <Alert severity="error">
                      <AlertTitle placeholder="bjhbfjs">Error</AlertTitle>
                        {MessageError}
                      </Alert>
                     ):(
                      <div></div>
                    )
                  }
            <div id="login-box">
                <div class="left">
                    <h1>Login</h1>
                    <form onSubmit={LoginSubmit}>
                      <input className="login_input" type="text" name="email" placeholder="E-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <input className="login_input" type="password" name="password" placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    
                      <input class="Signup" type="submit" onClick={LoginSubmit} name="signup_submit" value="Login"/>
                    </form>
                
                </div>
                
                <div class="right">
                    <span class="loginwith">Login with<br/><br/>social network</span>
                    <div class="social-signin " onClick={handleLoginFb}>
                      <ReactFacebookLogin
                        appId="1510139052705581"
                        fields="name,email,picture"
                        />
                    </div>

                    {/* <button class="social-signin twitter">Log in with Twitter</button>
                    <button class="social-signin google">Log in with Google+</button> */}
                    <div class="social-signin">
                        {/* {
                            loginData ? (
                            <div>
                            <h3>You logged in as {loginData.email}</h3>
                            <button onClick={handleLogout}>Logout</button>
                            </div>  
                        ) :
                        ( */}
                            <GoogleLogin
                            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                            buttonText="LOG IN WITH GOOGLE"
                            onSuccess={handleLogin}
                            onFailure={handleFailure}
                            cookiePolicy={'single_host_origin'}
                            ></GoogleLogin>
                        {/* )} */}
                    </div>
                </div>
                <div class="or">OR</div>
            </div>
            </div>
            </Dialog>
        </div>
    );
};

export default Login;
