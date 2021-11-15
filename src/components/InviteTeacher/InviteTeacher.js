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

export const InviteTeacher = () => {
    const { createInviteTeacherDialog, setcreateInviteTeacherDialog } = useLocalContext();

    const [Email, setEmail] = useState("");
    const [Owner, setOwner] = useState("phanhan226@gmail.com");

    const handleSubmit = e => {
        e.preventDefault();
        const newC = {
            email: Email
        };
        axios.post('http://localhost:5000/classroom', newC)
            .then(response => console.log(newC));
        setEmail("");
        setcreateInviteTeacherDialog(false);
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
                                id="filled-basic"
                                label="Type a name or email"
                                className="form__input"
                                variant="filled"
                                value={Email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                        </div>
                        <DialogContent/>  
                        <DialogContent/>
                        <Divider />
                        <DialogContent>
                            <DialogContentText>
                                Teachers you add can do everything you can, except delete the class
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button type="submit" autoFocus onClick={() => setcreateInviteTeacherDialog(false)}>
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