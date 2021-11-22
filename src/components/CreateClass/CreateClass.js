import React from 'react';
import { useState , useEffect} from "react";
import { useLocalContext } from "../../context/context";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    TextField
} from "@mui/material";
import './style.css';
import axios from 'axios';

export const CreateClass = () => {
    const { createClassDialog, setCreateClassDialog } = useLocalContext();

    const [tokenData, setTokenData] = useState(
        localStorage.getItem('tokenData')
          ? JSON.parse(localStorage.getItem('tokenData'))
          : null
      );
      const [loginData, setLoginData] = useState(
        localStorage.getItem('loginData')
          ? JSON.parse(localStorage.getItem('loginData'))
          : null
      );

      function parseJwt(token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    
        return JSON.parse(jsonPayload);
      };

    const [className, setClassName] = useState("");
    const [Section, setSection] = useState("");
    const [Room, setRoom] = useState("");
    const [Subject, setSubject] = useState("");
    const [Owner, setOwner] = useState("");

    useEffect(() => {
        if (loginData) {
            setOwner(loginData.email);
        }
    }, [loginData]
    );
    useEffect(() => {
        if (tokenData) {
            setOwner(parseJwt(tokenData).email);
        }
    }, [tokenData]
    );

    const handleSubmit = e => {
        e.preventDefault();
        const newC = {
            classname: className,
            section: Section,
            subject: Subject,
            room: Room,
            owner: Owner
        };
        axios.post('http://thclassroom-api-app.herokuapp.com/classroom', newC) 
        .then(response =>  console.log(newC));
        setClassName("");
        setSection("");
        setRoom("");
        setSubject("");
        setCreateClassDialog(false);
        window.location.reload(true);
    }
    return (
        <div>
            <Dialog
                onClose={() => setCreateClassDialog(false)}
                aria-labelledby="customized-dialog-title"
                open={createClassDialog}
                className="form__dialog"
                maxWidth="lg"
            >
                <form onSubmit={handleSubmit}>
                    <div className="form">
                        <p className="class__title">Create Class</p>
                        <div className="form__inputs">
                            <TextField
                                id="filled-basic"
                                label="Class Name (required)"
                                className="form__input"
                                variant="filled"
                                value={className}
                                onChange={(e) => setClassName(e.target.value)}
                            />
                            <TextField
                                id="filled-basic"
                                label="Section"
                                className="form__input"
                                variant="filled"
                                value={Section}
                                onChange={(e) => setSection(e.target.value)}
                            />
                            <TextField
                                id="filled-basic"
                                label="Subject"
                                className="form__input"
                                variant="filled"
                                value={Subject}
                                onChange={(e) => setSubject(e.target.value)}
                            />
                            <TextField
                                id="filled-basic"
                                label="Room"
                                className="form__input"
                                variant="filled"
                                value={Room}
                                onChange={(e) => setRoom(e.target.value)}
                            />
                        </div>
                        <DialogActions>
                            <Button autoFocus onClick={() => setCreateClassDialog(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">Create</Button>
                        </DialogActions>
                    </div>
                </form>
            </Dialog>
        </div>
    )
}
export default CreateClass;