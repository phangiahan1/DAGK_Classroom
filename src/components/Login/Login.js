import { Link, useHistory, useLocation } from "react-router-dom";
import ReactFacebookLogin from "react-facebook-login";
import "./Login.css";
import GoogleLogin from 'react-google-login';
import React, { useState, useContext } from "react";
import { Alert, AlertTitle } from "@mui/material";
import Button from '@mui/material/Button'
import "./style.css";
import { AuthContext } from '../../context/AuthContext'
import { apiUrl } from "../../context/constants";

const Login = () => {

  let location = useLocation();

  console.log("MET ROI A")
  // const a = location.state
  // console.log(a)
  let { from } = location.state || { from: { pathname: "/" } }
  let { fromAdmin } = {fromAdmin: {pathname: "/admin/user"} }
  //Context
  const { loginUser, loginUserGG } = useContext(AuthContext)
  
  //Router
  const history = useHistory()

  //Local state
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(true);
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
  //Login gg fail 
  const handleFailure = (result) => {
    alert("fail: " + result);
  };

  //Login gg success
const handleLogin = async (googleData) => {
    const res = await fetch(`${apiUrl}/api/google-login`, {
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
        //history.push('/')
        history.replace(from);
      }
    } catch (error) {
      console.log(error)
    }
  };
  
  // end login by google

  //Login by email, password (Dang nhap thong thuong)
  const LoginSubmit = async e => {
    e.preventDefault();
    const user = {
      email: email,
      password: password
    };
    try {
      const login = await loginUser(user)
      //Trường hợp login không thành công 
      if (!login.success) {
        setMessageError("Please check email and password");
        setTimeout(() => setMessageError(null), 2000)
      } else if(login.isAdmin){
      // } else if(email==="admin@gmail.com"){
        history.replace(fromAdmin);
      } else {
        //history.push('/')
        history.replace(from);
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <div className="login">
        <div className="login__wrapper">
          <div className="login__topHead">Login</div>
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
              <Button variant="contained" type="submit">Login</Button>
              <div>You haven't accout?
                <Link to={`/register`} style={{ textDecoration: 'none' }}>
                  <Button variant="contained">SignUp</Button>
                </Link>
              </div>
            </form>

          </div>

          <div class="right">
            <span class="loginwith">Login with<br /><br />social network</span>
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
};

export default Login;
