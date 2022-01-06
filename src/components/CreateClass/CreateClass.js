import React from 'react';
import { useState, useEffect } from "react";
import { useLocalContext } from "../../context/context";
import {
    Button,
    Dialog,
    DialogActions,
    TextField
} from "@mui/material";
import './style.css';
import axios from 'axios';
import {AuthContext} from "../../context/AuthContext"
import { useContext } from 'react'
import { apiUrl } from "../../context/constants"

export const CreateClass = () => {
    //context
    const {
		authState: {
			user
		}
	} = useContext(AuthContext)

    const { createClassDialog, setCreateClassDialog } = useLocalContext();

    const [className, setClassName] = useState("");
    const [Section, setSection] = useState("");
    const [Room, setRoom] = useState("");
    const [Subject, setSubject] = useState("");
    const [Owner, setOwner] = useState("");

    useEffect(() => {
        setOwner(user[0].email)
    }, [user]
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
        axios.post(`${apiUrl}/classroom`, newC)
            .then(response => {
                if (response.ok) {
                    setClassName("");
                    setSection("");
                    setRoom("");
                    setSubject("");
                    setCreateClassDialog(false);
                    window.location.reload(true);
                // } else {
                //     throw new Error('Fail to create class');
                }
            })
            .then(data => {
                setClassName("");
                setSection("");
                setRoom("");
                setSubject("");
                setCreateClassDialog(false);
                window.location.reload(true);
            }
            )
            .catch(error => {
                alert(error + ": "+ 'Fail to create class');
                setClassName("");
                setSection("");
                setRoom("");
                setSubject("");
                setCreateClassDialog(false);
                //window.location.reload(true);
            });
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