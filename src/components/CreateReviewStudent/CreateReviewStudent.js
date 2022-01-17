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
import { AuthContext } from "../../context/AuthContext"
import { useContext } from 'react'
import { apiUrl } from "../../context/constants"

export const CreatereviewStudent = ({ classData, InfoClass }) => {
    //context
    const {
        authState: {
            user
        }
    } = useContext(AuthContext)

    const { createGradeReview, setCreateGradeReview } = useLocalContext();

    const [expectationGrade, setExpectationGrade] = useState("");
    const [explanationMessage, setExplanationMessage] = useState("");

    const handleSubmit = e => {
        e.preventDefault();
        const newC = {
            gradeConId: classData._id,
            idTeacher: InfoClass.owner,
            idClass: InfoClass._id,
            StudentId: user[0].studentId,
            gradeNew: expectationGrade,
            messStu: explanationMessage
        };
        axios.post(`${apiUrl}/gradeReview`, newC)
            .then(response => {
                console.log(response)
                if (response.data.success) {
                    setExpectationGrade("");
                    setExplanationMessage("");
                    window.location.reload(true);
                }
            })
            .catch(error => {
                alert(error + ": " + 'Fail to create class');
                setExpectationGrade("");
                setExplanationMessage("");
                //window.location.reload(true);
            });
    }
    return (
        <div>
            <Dialog
                onClose={() => setCreateGradeReview(false)}
                aria-labelledby="customized-dialog-title"
                open={createGradeReview}
                className="form__dialog"
                maxWidth="lg"
            >
                <form onSubmit={handleSubmit}>
                    <div className="form">
                        <p className="class__title">Request Review</p>
                        <div className="form__inputs">
                            <TextField
                                id="filled-basic"
                                label="Grade Constructor Name"
                                className="form__input"
                                variant="filled"
                                value={classData.name}
                                disabled
                            />
                            <TextField
                                id="filled-basic"
                                label="Current grade"
                                className="form__input"
                                variant="filled"
                                value={classData.grade}
                                disabled
                            />
                            <TextField
                                id="filled-basic"
                                label="Expectation Grade"
                                className="form__input"
                                variant="filled"
                                value={expectationGrade}
                                type="number"
                                InputProps={{ inputProps: { min: 0, max: 10 } }}
                                //onChange={(e) => setExpectationGrade(e.target.value)}
                                onChange={(e) => {
                                    let value = parseFloat(e.target.value, 10);
                                    if (value > 10) value = 10;
                                    if (value < 0) value = 0;
                                    setExpectationGrade(value)
                                }}
                            />
                            <TextField
                                multiline={true}
                                rows={3}
                                id="filled-basic"
                                label="Explanation Message"
                                className="form__input"
                                variant="filled"
                                value={explanationMessage}
                                onChange={(e) => setExplanationMessage(e.target.value)}
                            />
                        </div>
                        <DialogActions>
                            <Button autoFocus onClick={() => setCreateGradeReview(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">Send</Button>
                        </DialogActions>
                    </div>
                </form>
            </Dialog>
        </div>
    )
}
export default CreatereviewStudent;