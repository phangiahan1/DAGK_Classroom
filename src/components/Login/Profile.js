import ReactFacebookLogin from "react-facebook-login";
import "./Login.css";
import axios from "axios";
import React, { useState } from "react";
import { Dialog, Slide, Box, Portal } from "@material-ui/core";
import { useLocalContext } from "../../context/context";
import { Close } from "@material-ui/icons";
import Button from '@mui/material/Button';
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

  const [user , setUser] = useState({
    id: '',
    username: '',
    email: '',
    picture: '',
    password:'',
    studentId:''
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
      axios.put('https://thclassroom-api-app.herokuapp.com/user/' + parseJwt(tokenData).id, newUser)
        .then(response => {
          console.log(newUser);
          // localStorage.setItem('tokenData',JSON.stringify(response.data))
        });
    }
    else if (loginData) {
      //console.log(loginData)
      axios.put('https://thclassroom-api-app.herokuapp.com/user/' + loginData.id, newUser)
        .then(response => {
          console.log(newUser);
          // localStorage.setItem('tokenData',JSON.stringify(response.data))
        });
    }
    setProfileDialog(false);
  }

      //change username 
      const changeUsername = e => {
        e.preventDefault();
        const newUser = {
            username: username,
        };

        if(tokenData){
          axios.put('https://thclassroom-api-app.herokuapp.com/user/updateUsername/' + parseJwt(tokenData).email, newUser) 
          .then(response =>  {
            alert("Successful change username")
            // localStorage.setItem('tokenData',JSON.stringify(response.data))
          });
        }
        else if(loginData){
          console.log(loginData)
          axios.put('https://thclassroom-api-app.herokuapp.com/user/updateUsername/' + loginData.email, newUser) 
          .then(response =>  {
            alert("Successful change username")
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
            axios.post('https://thclassroom-api-app.herokuapp.com/user/updatePasswordCheck/' + parseJwt(tokenData).email, newUser) 
            .then(response =>  {
                const newPass = {
                  password: newPassword
                }
              axios.put('https://thclassroom-api-app.herokuapp.com/user/updatePassword/' + parseJwt(tokenData).email, newPass) 
              .then(res =>{
                alert("Successful change password")
                console.log(res)
               } )
              .catch(console.error())
              // localStorage.setItem('tokenData',JSON.stringify(response.data))
          })
        }
          else
           if(loginData){
            axios.post('https://thclassroom-api-app.herokuapp.com/user/updatePasswordCheck/' + loginData.email, newUser) 
            .then(response =>  {
                const newPass = {
                  password: newPassword
                }
                console.log(newPass.password)
              axios.put('https://thclassroom-api-app.herokuapp.com/user/updatePassword/' + loginData.email, newPass) 
              .then(res => {
                alert("Successful change password")
                console.log(res)
              })
              .catch(console.error())
              // localStorage.setItem('tokenData',JSON.stringify(response.data))
            })
            .catch(console.error());
          }
        // setProfileDialog(false);
        }
      }

      const addStudentId = e =>{
        e.preventDefault();
        const user = {
            studentId: studentId
        };
        
        if(tokenData){
          axios.put('https://thclassroom-api-app.herokuapp.com/user/studentId/email/'+parseJwt(tokenData).email,user) 
          .then(response => { 
              alert("Add student id successful")
          })
          .catch(error=>{
            alert("Please check student id! it can already exist")
            console.log(error)
          })
        }
        else if(loginData){
          axios.put('https://thclassroom-api-app.herokuapp.com/user/studentId/email/'+ loginData.email,user) 
          .then(response => { 
              alert("Add student id successful")
          })
          .catch(error=>{
            alert("Please check student id! it can already exist")
            console.log(error)
          })
        }
      }
      
      const handleClick = () => {
        setShow(!show);
      };

      const handleClickPassword = () => {
        setShowPassword(!showPassword);
      };

      const handleClickName = () => {
        setShowName(!showName);
      };

      if(tokenData)
      axios.get('https://thclassroom-api-app.herokuapp.com/user/findEmail/' + parseJwt(tokenData).email)
            .then(response => {
              setUser({
                username: response.data[0].username,
                email: response.data[0].email,
                picture: response.data[0].picture,
                password: response.data[0].password,
                studentId: response.data[0].studentId
            });
          })
      else if(loginData)
      axios.get('https://thclassroom-api-app.herokuapp.com/user/findEmail/' + loginData.email)
            .then(response => {
              setUser({
                username: response.data[0].username,
                email: response.data[0].email,
                picture: response.data[0].picture,
                password: response.data[0].password,
                studentId: response.data[0].studentId
            });
          });
    

    return (
        <div>
        <Dialog
                fullScreen
                open={profileDialog}
                onClose={() => setProfileDialog(false)}
                TransitionComponent={Transition}
            >
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
                <h1>
                {user.email}
                </h1>
            <div id="login-box-profile">
                <div class="left">
                  <Button variant="contained" type="button" onClick={handleClickPassword}>
                      {showPassword ? 'Password' : 'Change Password'}
                    </Button>
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
                          <Button variant="contained" onClick={changePassword}>Update</Button>
                        {/* <input class="profile" type="submit" onClick={changePassword} name="signup_submit" value="Add"/> */}
                        </Portal>
                      ) : null}
                    </Box>
                    <Box sx={{ p: 1, my: 1, border: '1px solid' }} ref={container2} />
                    
                </div>
                
                <div class="right-profile"> 
                    <Button variant="contained" type="button" onClick={handleClickName}>
                      {showName ? 'Fullname' : 'Change Fullname'}
                    </Button>
                    <Box sx={{ p: 1, my: 1, border: '1px solid' }}>
                      Fullname:{
                        user.username
                      }
                      {showName ? (
                        <Portal container={container1.current}>
                          <input className="login_input_studentid" type="text" name="username" placeholder="New fullname"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                          />
                        <Button variant="contained" onClick={changeUsername}>Update</Button>
                        {/* <input class="profile" type="submit" onClick={changeUsername} name="signup_submit" value="Change"/> */}
                        </Portal>
                      ) : null}
                    </Box>
                    <Box sx={{ p: 1, my: 1, border: '1px solid' }} ref={container1} />
                    <Button variant="contained" type="button" onClick={handleClick}>
                      {show ? 'Hide Change StudentID' : 'Change StudentID'}
                    </Button>
                    <Box sx={{ p: 1, my: 1, border: '1px solid' }}>
                      Student ID:{
                        user.studentId
                      }
                      {show ? (
                        <Portal container={container3.current}>
                          <input className="login_input_studentid" type="text" name="studentId" placeholder="studentId"
                          value={studentId}
                          onChange={(e) => setStudentId(e.target.value)}
                        />
                        <Button variant="contained" onClick={addStudentId}>Update</Button>
                        {/* <input class="profile" type="submit" onClick={addStudentId} name="signup_submit" value="Add"/> */}
                        </Portal>
                      ) : null}
                    </Box>
                    <Box sx={{ p: 1, my: 1, border: '1px solid' }} ref={container3} />
                </div>
                <div class="or">AND</div>
            </div>

            </div>
            </div>
      </Dialog>
    </div>
  );
}
export default Profile;
