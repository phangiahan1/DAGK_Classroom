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
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import { CopyToClipboard } from "react-copy-to-clipboard";

export const InviteStudent = ({ classData }) => {
    const { createInviteStudentDialog, setcreateInviteStudentDialog } = useLocalContext();

    const [Email, setEmail] = useState("");
    const [EmailError, setEmailError] = useState("");
    const [Owner, setOwner] = useState("");
    const [isCopied, setIsCopied] = useState(false);
    const [LinkInviteClass, setLinkInviteClass] = useState(window.location.host + "/" + classData._id + "/invite_student");
    console.log(LinkInviteClass);

    //setOwner(loginData.email);

    const handleSubmit = e => {
        e.preventDefault();
        const newC = {
            owner: classData.owner,
            email: Email,
            classname: classData.classname,
            idclass: classData._id
        };
        axios.post('http://thclassroom-api-app.herokuapp.com/send_mail_student', newC)
            .then(response => console.log(newC));
        setEmail("");
        setcreateInviteStudentDialog(false);
        console.log(newC);
    }

    const onCopyText = () => {
        setIsCopied(true);
        setTimeout(() => {
            setIsCopied(false);
        }, 1000);
    };

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        //const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return re.test(email);
    }
    return (
        <div>
            <Dialog
                onClose={() => setcreateInviteStudentDialog(false)}
                aria-labelledby="customized-dialog-title"
                open={createInviteStudentDialog}
                className="form__dialog"
                maxWidth="lg"
            >
                <form onSubmit={handleSubmit}>
                    <div className="form">
                        <p className="class__title">Invite student</p>
                        <DialogContent>
                            <DialogContentText>
                                Invite Link
                            </DialogContentText>
                            <List>
                                <ListItem
                                    secondaryAction={
                                        <IconButton edge="end" aria-label="delete">
                                            <CopyToClipboard text={LinkInviteClass} onCopy={onCopyText}>
                                                <div className="copy-area">
                                                    <ContentCopyIcon />
                                                </div>
                                            </CopyToClipboard>
                                        </IconButton>
                                    }
                                >
                                    <ListItemText primary={LinkInviteClass} />
                                </ListItem>
                            </List>
                        </DialogContent>

                        <Divider />
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
                        <DialogActions>
                            <Button autoFocus onClick={() => setcreateInviteStudentDialog(false)}>
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
export default InviteStudent;