import { FolderOpen, PermContactCalendar } from "@material-ui/icons";
import { Link } from "react-router-dom";
import ReactFacebookLogin from "react-facebook-login";
import MyClass from '../MyClass/MyClass'
import "./Login.css";
import GoogleLogin from 'react-google-login';
import App from '../../App'
import { ContextProvider } from '../../context/context';
import axios from "axios";
import React, { useState } from "react";
import { Avatar, Dialog, Slide, TextField } from "@material-ui/core";
import { Alert, AlertTitle } from "@mui/material";
import { useLocalContext } from "../../context/context";
import { Close } from "@material-ui/icons";
import Button from '@mui/material/Button'
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
    const [picture, setPicture] = useState("");
    const [MessageError, setMessageError] = useState("");
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
          password: data.email,
          status: status,
          picture: data.picture
      };
      // axios.post('http://localhost:5000/user', newUser) 
      axios.post('http://thclassroom-api-app.herokuapp.com/user', newUser) 
      .then(res =>  {
        localStorage.setItem('tokenData', JSON.stringify(res.data));
      }
      );

      localStorage.setItem('loginData', JSON.stringify(data));
        
      window.location.href="/";
      };

      const handleLogout = () => {
        localStorage.removeItem('loginData');
        setLoginData(null);
      };

      // end login by google

      //register by email, password
      const SignupSubmit = e => {
        e.preventDefault();
        if(password !== re_password){
          setMessageError("Password not compare re-pasword")
        }
        else{
          const newUser = {
              username: username,
              email: email,
              password: password,
              status: status,
              picture: "/public/user.png"
          };
          // axios.post('http://localhost:5000/user', newUser) 
          axios.post('http://thclassroom-api-app.herokuapp.com/user', newUser) 
          .then(response =>  {
            alert("SignUp successful")
            setTokenData(response.data);
            localStorage.setItem('tokenData', JSON.stringify(response.data));
            window.location.href="/"
          })
          .catch(error => {
            setMessageError(error.response.data.message);
          })
        // setRegisterDialog(false);
      }
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
                    <Button variant="contained" onClick={SignupSubmit}>Sign up</Button>
                      {/* <input class="Signup" type="submit" onClick={SignupSubmit} name="signup_submit" value="Sign up"/> */}
                    </form>
                    
                </div>
                
                <div class="right">
                    <span class="loginwith">Sign in with<br/><br/>social network</span>
                    <div class="social-signin " onClick={handleLoginFb}>
                      <ReactFacebookLogin
                        appId="1510139052705581"
                        fields="name,email,picture"
                        />
                    </div>

                    {/* <button class="social-signin twitter">Log in with Twitter</button>
                    <button class="social-signin google">Log in with Google+</button> */}
                    <div class="social-signin">
                        {
                             loginData ? 
                            (
                              <form  >
                                {/* <input name="usernameGG" type="hidden">loginData.name</input>
                                <input name="emailGG"  type="hidden">loginData.email</input>
                                <input className="login_input" type="password" name="password" placeholder="Password"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                />
                                <input className="login_input" type="password" name="password2" placeholder="Retype password"
                                  value={re_password}
                                  onChange={(e) => setRePassword(e.target.value)}
                                /> */}
                                <GoogleLogin
                                clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                                buttonText="LOG IN WITH GOOGLE"
                                onSuccess={handleLogin}
                                onFailure={handleFailure}
                                cookiePolicy={'single_host_origin'}
                              ></GoogleLogin>
                                {/* <Button type="hidden" autoLoad={SignupSubmitGoogle} name="signup_submit" value="Sign up"/>  */}
                              </form>
                              
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
