import "./Login.css";
import axios from "axios";
import React, { useState, useContext } from "react";
import { Dialog, Slide, Box, Portal } from "@material-ui/core";
import { useLocalContext } from "../../context/context";
import { Close } from "@material-ui/icons";
import Button from '@mui/material/Button';
import "./style.css";

import { AuthContext } from '../../context/AuthContext'
import { apiUrl } from "../../context/constants"

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


export const Profile = () => {
  //context
  const {
    authState: {
      user
    }
  } = useContext(AuthContext)

  const [userApp, setUser] = useState({
    id: '',
    username: '',
    email: '',
    picture: '',
    password: '',
    studentId: ''
  });

  axios.get('http://thclassroom-api-app.herokuapp.com/user/findEmail/' + user[0].email)
    .then(response => {
      setUser({
        username: response.data[0].username,
        email: response.data[0].email,
        picture: response.data[0].picture,
        password: response.data[0].password,
        studentId: response.data[0].studentId
      });
    });

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

  //change username 
  const changeUsername = e => {
    e.preventDefault();
    const newUser = {
      username: username,
    };
    axios.put(`${apiUrl}/user/updateUsername/` + user[0].email, newUser)
      .then(response => {
        alert("Successful change username")
      });
  }

  //change pass
  const changePassword = e => {
    e.preventDefault();
    if (newPassword !== re_password) {
      alert("Password not compare re-pasword")
    } else {
      const newUser = {
        password: password,
      };

      axios.post(`${apiUrl}/user/updatePasswordCheck/` + user[0].email, newUser)
        .then(response => {
          const newPass = {
            password: newPassword
          }
          axios.put(`${apiUrl}/user/updatePassword/` + user[0].email, newPass)
            .then(res => {
              alert("Successful change password")
              console.log(res)
            })
            .catch(console.error())
        })
    }
  }

  const addStudentId = e => {
    e.preventDefault();
    const userID = {
      studentId: studentId
    };
    axios.put(`${apiUrl}/user/studentId/email/` + user[0].email, userID)
      .then(response => {
        alert("Add student id successful")
      })
      .catch(error => {
        alert("Please check student id! it can already exist")
        console.log(error)
      })
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
              {userApp.email}
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
                    userApp.username
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
                    userApp.studentId
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
