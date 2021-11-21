import React from 'react';
import { useState } from "react";
import { useLocalContext } from "../../context/context";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    TextField,
    Divider
} from "@mui/material";
import './style.css';
import axios from 'axios';

export const InviteTeacher = ({ classData }) => {
    const { createInviteTeacherDialog, setcreateInviteTeacherDialog } = useLocalContext();

    const [Email, setEmail] = useState("");
    const [EmailError, setEmailError] = useState("");
    const [Owner, setOwner] = useState("");

    //setOwner(loginData.email);

    const handleSubmit = e => {
        e.preventDefault();
        const newC = {
            owner: classData.owner,
            email: Email,
            classname: classData.classname,
            idclass: classData._id
        };
        axios.post('http://localhost:5000/send_mail_teacher', newC)
            .then(response => console.log(newC));
        setEmail("");
        setcreateInviteTeacherDialog(false);
        console.log(newC);
    }

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        //const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return re.test(email);
    }
    return (
        <div>
            <Dialog
                onClose={() => setcreateInviteTeacherDialog(false)}
                aria-labelledby="customized-dialog-title"
                open={createInviteTeacherDialog}
                className="form__dialog"
                maxWidth="lg"
            >
                <form onSubmit={handleSubmit}>
                    <div className="form">
                        <p className="class__title">Invite teachers</p>
                        <div className="form__inputs">
                            <TextField
                                error={
                                    EmailError === "" ? false : true
                                }
                                helperText={EmailError}
                                id="filled-basic"
                                label="Type email"
                                className="form__input"
                                variant="filled"
                                //value={Email}
                                onChange={(e) => {
                                    if (validateEmail(e.target.value)) {
                                        setEmail(e.target.value);
                                        setEmailError("");
                                        //console.log(Email);
                                    } else {
                                        setEmailError("Email is not valid");
                                    }
                                }}
                            />

                        </div>
                        <DialogContent />
                        <DialogContent />
                        <Divider />
                        <DialogContent>
                            <DialogContentText>
                                Teachers you add can do everything you can, except delete the class
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button autoFocus onClick={() => setcreateInviteTeacherDialog(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">Invite</Button>
                        </DialogActions>
                    </div>
                </form>
            </Dialog>
        </div>
    )
}
export default InviteTeacher;