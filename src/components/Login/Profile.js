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
import { Avatar, Button, Dialog, Slide, TextField, Box, Portal } from "@material-ui/core";
import { useLocalContext } from "../../context/context";
import { Close } from "@material-ui/icons";
import "./style.css";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


export const Profile = () => {
    const [show, setShow] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
    const [showName, setShowName] = React.useState(false);
    const container1 = React.useRef(null);
    const container2 = React.useRef(null);
    const container3 = React.useRef(null);
    const { profileDialog, setProfileDialog } = useLocalContext();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
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
    picture: ''
  });

  const responseFacebook = response => {
    console.log(response);
  }
  const componentClicked = () => console.log('clicked');

  function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  };

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

    if (tokenData) {
      axios.put('http://localhost:5000/user/' + parseJwt(tokenData).id, newUser)
        .then(response => {
          console.log(newUser);
          // localStorage.setItem('tokenData',JSON.stringify(response.data))
        });
    }
    else if (loginData) {
      //console.log(loginData)
      axios.put('http://localhost:5000/user/' + loginData.id, newUser)
        .then(response => {
          console.log(newUser);
          // localStorage.setItem('tokenData',JSON.stringify(response.data))
        });
    }
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
  const loginHandle = e => {
  }



      //change username 
      const changeUsername = e => {
        e.preventDefault();
        const newUser = {
            username: username,
        };

        if(tokenData){
          axios.put('http://localhost:5000/user/updateUsername/' + parseJwt(tokenData).email, newUser) 
          .then(response =>  {
            console.log(newUser);
            // localStorage.setItem('tokenData',JSON.stringify(response.data))
          });
        }
        else if(loginData){
          console.log(loginData)
          axios.put('http://localhost:5000/user/updateUsername/' + loginData.email, newUser) 
          .then(response =>  {
            console.log(newUser);
            // localStorage.setItem('tokenData',JSON.stringify(response.data))
          });
        }
        // setProfileDialog(false);
      }


            //change pass
      const changePassword = e => {
        e.preventDefault();
        if(newPassword !== re_password){
          alert("Password not compare re-pasword")
        }else{
          const newUser = {
              password: password,
          };


          if(tokenData){
            axios.post('http://localhost:5000/user/updatePasswordCheck/' + parseJwt(tokenData).email, newUser) 
            .then(response =>  {
                const newPass = {
                  password: newPassword
                }
                console.log(newPass.password)
              axios.put('http://localhost:5000/user/updatePassword/' + parseJwt(tokenData).email, newPass) 
              .then(res => console.log(res))
              .catch(console.error())
              // localStorage.setItem('tokenData',JSON.stringify(response.data))
          })
        }
          else
           if(loginData){
            axios.post('http://localhost:5000/user/updatePasswordCheck/' + loginData.email, newUser) 
            .then(response =>  {
                const newPass = {
                  password: newPassword
                }
                console.log(newPass.password)
              axios.put('http://localhost:5000/user/updatePassword/' + loginData.email, newPass) 
              .then(res => console.log(res))
              .catch(console.error())
              // localStorage.setItem('tokenData',JSON.stringify(response.data))
            })
            .catch(console.error());
          }
        // setProfileDialog(false);
        }
      }
      //change username 
      // const changeUsername = e => {
      //   e.preventDefault();
      //   const newUser = {
      //       username: username,
      //   };

      //   if(tokenData){
      //     axios.put('http://localhost:5000/user/updateUsername/' + parseJwt(tokenData).id, newUser) 
      //     .then(response =>  {
      //       console.log(newUser);
      //       // localStorage.setItem('tokenData',JSON.stringify(response.data))
      //     });
      //   }
      //   else if(loginData){
      //     console.log(loginData)
      //     axios.put('http://localhost:5000/user/updateUsername/' + loginData.email, newUser) 
      //     .then(response =>  {
      //       console.log(newUser);
      //       // localStorage.setItem('tokenData',JSON.stringify(response.data))
      //     });
      //   }
      //   // setProfileDialog(false);
      // }

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
      // const loginHandle = e =>{
      // }

      const addStudentId = e =>{
        e.preventDefault();
        const user = {
            studentId: studentId
        };
        
        if(tokenData){
          axios.put('http://localhost:5000/user/studentId/'+parseJwt(tokenData).email,user) 
          .then(response => { 
              alert("Add student id successful")
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
        else if(loginData){
          axios.put('http://localhost:5000/user/studentId/email/'+ loginData.email,user) 
          .then(response => { 
              alert("Add student id successful")
              // setMessageError("Login successful");
              // setTokenData(response.data);
              // localStorage.setItem('tokenData', JSON.stringify(response.data));
              // console.log(loginData.email)
          })
          .catch(error=>{
            alert("Please check student id")
            // setMessageError(error.response.data.message);
            console.log(error)
          })
        }
      }
      
      // const addStudentId = e => {
      //   e.preventDefault();
      //   const user = {
      //     studentId: studentId
      //   };
    
      //   if (tokenData) {
      //     axios.put('http://localhost:5000/user/studentId/' + parseJwt(tokenData).id, user)
      //       .then(response => {
      //         alert("Add student id successful")
      //         // setMessageError("Login successful");
      //         // setTokenData(response.data);
      //         // localStorage.setItem('tokenData', JSON.stringify(response.data));
      //         console.log(parseJwt(tokenData).id)
      //       })
      //       .catch(error => {
      //         alert("Please check student id")
      //         // setMessageError(error.response.data.message);
      //         console.log(error)
      //       })
      //   }
      //   else if (loginData) {
      //     console.log(loginData)
      //     axios.put('http://localhost:5000/user/studentId/' + loginData.email, user)
      //       .then(response => {
      //         alert("Add student id successful")
      //         // setMessageError("Login successful");
      //         // setTokenData(response.data);
      //         // localStorage.setItem('tokenData', JSON.stringify(response.data));
      //         console.log(parseJwt(tokenData).email)
      //       })
      //       .catch(error => {
      //         alert("Please check student id")
      //         // setMessageError(error.response.data.message);
      //         console.log(error)
      //       })
      //   }
      // }
      const handleClick = () => {
        setShow(!show);
      };

      const handleClickPassword = () => {
        setShowPassword(!showPassword);
      };

      const handleClickName = () => {
        setShowName(!showName);
      };

    return (
        <div>
        <Dialog
                fullScreen
                open={profileDialog}
                onClose={() => setProfileDialog(false)}
                TransitionComponent={Transition}
            >
            
      {loginData?(
            <div className="login">
                <div className="login__wrapper">
                    <div
                        className="login__wraper2"
                        onClick={() => setProfileDialog(false)}>
                        <Close className="login__svg" />
                        <div className="login__topHead">Profile</div>
                    </div>
                </div>
            <div id="login-box-profile">
                <div class="left">

                    <button class="profile" type="button" onClick={handleClickPassword}>
                      {showPassword ? 'Password' : 'Change Password'}
                    </button>
                    <Box sx={{ p: 1, my: 1, border: '1px solid' }}>
                      Password: ***********
                      {showPassword ? (
                        <Portal container={container2.current}>
                          <input className="login_input_studentid" type="password" name="password" placeholder="old password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                          <input className="login_input_studentid" type="password" name="newpassword" placeholder="new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                          <input className="login_input_studentid" type="password" name="password2" placeholder="Retype password"
                            value={re_password}
                            onChange={(e) => setRePassword(e.target.value)}
                          />
                        <input class="profile" type="submit" onClick={changePassword} name="signup_submit" value="Add"/>
                        </Portal>
                      ) : null}
                    </Box>
                    <Box sx={{ p: 1, my: 1, border: '1px solid' }} ref={container2} />
                    {/* {
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
                    } */}
                    {/* {
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
                        
                          <input class="profile" type="submit" onClick={changeProfile} name="signup_submit" value="Change Profile"/>
                        </form>
                      ):(
                        <div></div>
                      )
                    } */}
                </div>
                
                <div class="right-profile"> 
                  {/* {loginData?(
                        <Avatar sx={{ height: '70px', width: '70px' }} scr={loginData.picture} ></Avatar>
                      ):tokenData?(
                        <Avatar sx={{ height: '70px', width: '70px' }} scr={parseJwt (tokenData).picture} ></Avatar>
                      ):(
                        <Avatar >T</Avatar>
                      )
                    } */}
                    <button class="profile" type="button" onClick={handleClickName}>
                      {showName ? 'Fullname' : 'Change Fullname'}
                    </button>
                    <Box sx={{ p: 1, my: 1, border: '1px solid' }}>
                      Fullname:{
                        loginData.name
                      }
                      {showName ? (
                        <Portal container={container1.current}>
                          <input className="login_input_studentid" type="text" name="username" placeholder="New fullname"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                          />
                        <input class="profile" type="submit" onClick={changeUsername} name="signup_submit" value="Change"/>
                        </Portal>
                      ) : null}
                    </Box>
                    <Box sx={{ p: 1, my: 1, border: '1px solid' }} ref={container1} />
                    <button class="profile" type="button" onClick={handleClick}>
                      {show ? 'Hide Change StudentID' : 'Change StudentID'}
                    </button>
                    <Box sx={{ p: 1, my: 1, border: '1px solid' }}>
                      Student ID:{
                        studentId
                      }
                      {show ? (
                        <Portal container={container3.current}>
                          <input className="login_input_studentid" type="text" name="studentId" placeholder="studentId"
                          value={studentId}
                          onChange={(e) => setStudentId(e.target.value)}
                        />
                        <input class="profile" type="submit" onClick={addStudentId} name="signup_submit" value="Add"/>
                        </Portal>
                      ) : null}
                    </Box>
                    <Box sx={{ p: 1, my: 1, border: '1px solid' }} ref={container3} />
                </div>
                <div class="or">AND</div>
            </div>
            </div>
            ):tokenData?(
            <div>
              <div className="login">
                <div className="login__wrapper">
                    <div
                        className="login__wraper2"
                        onClick={() => setProfileDialog(false)}>
                        <Close className="login__svg" />
                        <div className="login__topHead">Profile</div>
                    </div>
                </div>
            <div id="login-box-profile">
                <div class="left">

                    <button class="profile" type="button" onClick={handleClickPassword}>
                      {showPassword ? 'Password' : 'Change Password'}
                    </button>
                    <Box sx={{ p: 1, my: 1, border: '1px solid' }}>
                      Password: ***********
                      {showPassword ? (
                        <Portal container={container2.current}>
                          <input className="login_input_studentid" type="password" name="password" placeholder="old password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                          <input className="login_input_studentid" type="password" name="newpassword" placeholder="new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                          <input className="login_input_studentid" type="password" name="password2" placeholder="Retype password"
                            value={re_password}
                            onChange={(e) => setRePassword(e.target.value)}
                          />
                        <input class="profile" type="submit" onClick={changePassword} name="signup_submit" value="Add"/>
                        </Portal>
                      ) : null}
                    </Box>
                    <Box sx={{ p: 1, my: 1, border: '1px solid' }} ref={container2} />
                    {/* {
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
                    } */}
                    {/* {
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
                        
                          <input class="profile" type="submit" onClick={changeProfile} name="signup_submit" value="Change Profile"/>
                        </form>
                      ):(
                        <div></div>
                      )
                    } */}
                </div>
                
                <div class="right-profile"> 
                  {/* {loginData?(
                        <Avatar sx={{ height: '70px', width: '70px' }} scr={loginData.picture} ></Avatar>
                      ):tokenData?(
                        <Avatar sx={{ height: '70px', width: '70px' }} scr={parseJwt (tokenData).picture} ></Avatar>
                      ):(
                        <Avatar >T</Avatar>
                      )
                    } */}
                    <button class="profile" type="button" onClick={handleClickName}>
                      {showName ? 'Fullname' : 'Change Fullname'}
                    </button>
                    <Box sx={{ p: 1, my: 1, border: '1px solid' }}>
                      Fullname:{
                        parseJwt (tokenData).username
                      }
                      {showName ? (
                        <Portal container={container1.current}>
                          <input className="login_input_studentid" type="text" name="username" placeholder="New fullname"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                          />
                        <input class="profile" type="submit" onClick={changeUsername} name="signup_submit" value="Change"/>
                        </Portal>
                      ) : null}
                    </Box>
                    <Box sx={{ p: 1, my: 1, border: '1px solid' }} ref={container1} />
                    <button class="profile" type="button" onClick={handleClick}>
                      {show ? 'Hide Change StudentID' : 'Change StudentID'}
                    </button>
                    <Box sx={{ p: 1, my: 1, border: '1px solid' }}>
                      Student ID:{
                        studentId
                      }
                      {show ? (
                        <Portal container={container3.current}>
                          <input className="login_input_studentid" type="text" name="studentId" placeholder="studentId"
                          value={studentId}
                          onChange={(e) => setStudentId(e.target.value)}
                        />
                        <input class="profile" type="submit" onClick={addStudentId} name="signup_submit" value="Add"/>
                        </Portal>
                      ) : null}
                    </Box>
                    <Box sx={{ p: 1, my: 1, border: '1px solid' }} ref={container3} />
                </div>
                <div class="or">AND</div>
            </div>

            <div class="right-profile">
              <input className="login_input" type="text" name="studentId" placeholder="studentId"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
              />
              <input class="Signup" type="submit" onClick={addStudentId} name="signup_submit" value="Add" />
            </div>
            </div>
            </div>)
            :(<div></div>)}
            {/* </Dialog> */}
        {/* </div> */}
      </Dialog>
    </div>
  );
}
export default Profile;
