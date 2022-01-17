import { Link, useHistory } from "react-router-dom";
import ReactFacebookLogin from "react-facebook-login";
import "./Login.css";
import GoogleLogin from 'react-google-login';
import axios from "axios";
import React, { useState, useContext } from "react";
import { Avatar, Dialog, Slide, TextField } from "@material-ui/core";
import { Alert, AlertTitle } from "@mui/material";
import { useLocalContext } from "../../context/context";
import { Close } from "@material-ui/icons";
import Button from '@mui/material/Button'
import "./style.css";
import { AuthContext } from '../../context/AuthContext'
import OTPActivation from "../OTPActivation/OTPActivation";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


export const Register = () => {
  //Context
  const { loginUserGG, registerUser } = useContext(AuthContext)

  //Router
  const history = useHistory()

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [re_password, setRePassword] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(true);
  const [picture, setPicture] = useState("");
  const [MessageError, setMessageError] = useState("");

  let fbContent = null;
  const [state, setState] = React.useState({
    isLoginIn: false,
    userID: '',
    name: '',
    email: '',
    picture: ''
  });

  const responseFacebook = response => {
    console.log(response);
  }
  const componentClicked = () => console.log('clicked');

  //login by Facebook
  const handleLoginFb = _ => {
    if (state.isLoginIn) {
      // <MyClass/>
    } else {
      fbContent = (
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
  const handleFailure = (result) => {
    alert(result);
  };

  //Login bằng google
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
    const newUser = {
      username: data.username,
      email: data.email,
      password: data.email,
      status: status,
      picture: data.picture
    };

    try {
      const loginGG = await loginUserGG(newUser)
      //Trường hợp login không thành công 
      if (!loginGG.success) {
        setMessageError("Please check email and password");
        setTimeout(() => setMessageError(null), 2000)
      } else {
        history.push('/')
      }
    } catch (error) {
      console.log(error)
    }
  };
  // end login by google

  //register by email, password
  const SignupSubmit = async e => {
    e.preventDefault();
    if (password !== re_password) {
      setMessageError("Password not compare re-pasword")
    }
    else {
      const newUser = {
        username: username,
        email: email,
        password: password,
        status: status,
        picture: "/public/user.png"
      };

      try {
        const register = await registerUser(newUser)
        //Trường hợp login không thành công 
        if (!register.success) {
          setMessageError("Please check your information");
          setTimeout(() => setMessageError(null), 2000)
        } else {
          history.push('/otp')
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <div>
      <div className="login">
        <div className="login__wrapper">
          <div className="login__wraper2">
            <div className="login__topHead">Sign Up</div>
          </div>
        </div>
        {
          MessageError ? (
            <Alert severity="error">
              <AlertTitle placeholder="bjhbfjs">Error</AlertTitle>
              {MessageError}
            </Alert>
          ) : (
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
              <Button variant="contained" type="submit">Sign up</Button>
              <div>You have accout?
                <Link to={`/login`} style={{ textDecoration: 'none' }}>
                  <Button variant="contained">Login</Button>
                </Link>
              </div>
            </form>
          </div>

          <div class="right">
            <span class="loginwith">Sign in with<br /><br />social network</span>
            <div class="social-signin " onClick={handleLoginFb}>
              <ReactFacebookLogin
                appId="1510139052705581"
                fields="name,email,picture"
              />
            </div>

            <div class="social-signin">
              <GoogleLogin
                clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                buttonText="LOG IN WITH GOOGLE"
                onSuccess={handleLogin}
                onFailure={handleFailure}
                cookiePolicy={'single_host_origin'}
              ></GoogleLogin>
            </div>
          </div>
          <div class="or">OR</div>
        </div>
      </div>
    </div>
  );
}
export default Register;
