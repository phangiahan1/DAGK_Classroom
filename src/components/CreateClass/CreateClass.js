import React from 'react';
import { useState } from "react";
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

    const [className, setClassName] = useState("");
    const [Section, setSection] = useState("");
    const [Room, setRoom] = useState("");
    const [Subject, setSubject] = useState("");
    const [fetchedData, setFetchedData] = useState('')


    const handleSubmit = e => {
        e.preventDefault();
        const newC = {
            classname: className,
            section: Section,
            subject: Subject,
            room: Room
        };
        axios.post('http://localhost:5000/classroom', newC) 
        .then(response =>  console.log(newC));
        setClassName("");
        setSection("");
        setRoom("");
        setSubject("");
        setCreateClassDialog(false);
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
                        <Button type="submit">
                            Create
                        </Button>
                    </div>
                </form>
            </Dialog>
        </div>
    )
}
export default CreateClass;