import React, { useState, useContext } from "react";
import { Avatar, Button, Dialog, Slide, TextField } from "@material-ui/core";
import { useLocalContext } from "../../context/context";
import { Close } from "@material-ui/icons";
import "./style.css";
import { AuthContext } from '../../context/AuthContext'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


export const JoinClass = () => {
    //Context
    const {
        authState: {
            user
        },
        logoutUser
    } = useContext(AuthContext)

    const handleLogout = () => { logoutUser() };

    const { joinClassDialog, setJoinClassDialog } = useLocalContext();
    return (
        <div>
            <Dialog
                fullScreen
                open={joinClassDialog}
                onClose={() => setJoinClassDialog(false)}
                TransitionComponent={Transition}
            >
                <div className="joinClass">
                    <div className="joinClass__wrapper">
                        <div
                            className="joinClass__wraper2"
                            onClick={() => setJoinClassDialog(false)}
                        >
                            <Close className="joinClass__svg" />
                            <div className="joinClass__topHead">Join Class <b>(Tính năng chưa phát triển)</b></div>
                        </div>
                        <Button
                            className="joinClass__btn"
                            variant="contained"
                            color="primary"
                        //onClick={handleSubmit}
                        >
                            Join
                        </Button>
                    </div>
                    <div className="joinClass__form">
                        <p className="joinClass__formText">
                            You're currently signed in as ...
                        </p>
                        <div className="joinClass__loginInfo">
                            <div className="joinClass__classLeft">
                                <Avatar />
                                <div className="joinClass__loginText">
                                    <div className="joinClass__loginName">
                                        {user[0].username}
                                    </div>
                                    <div className="joinClass__loginEmail">
                                        {user[0].email}
                                    </div>
                                </div>
                            </div>
                            <Button variant="outlined" color="primary" onClick={handleLogout}>
                                Logout
                            </Button>
                        </div>
                    </div>
                    <div className="joinClass__form">
                        <div
                            style={{ fontSize: "1.25rem", color: "#3c4043" }}
                            className="joinClass__formText"
                        >
                            Class Code 
                        </div>
                        <div
                            style={{ color: "#3c4043", marginTop: "-5px" }}
                            className="joinClass__formText"
                        >
                            Ask your teacher for the class code, then enter it here.
                        </div>
                        <div className="joinClass__loginInfo">
                            <TextField
                                id="outlined-basic"
                                label="Class Code"
                                variant="outlined"
                            //value={classCode}
                            //onChange={(e) => setClassCode(e.target.value)}
                            //error={error}
                            //helperText={error && "No class was found"}
                            />
                            <TextField
                                id="outlined-basic"
                                label="Owner's email"
                                variant="outlined"
                            //value={email}
                            //onChange={(e) => setemail(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </Dialog>
        </div>
    )
}
export default JoinClass;
