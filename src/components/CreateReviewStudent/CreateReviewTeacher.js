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
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export const CreateReviewTeacher = ({ classData, InfoClass }) => {
    //context
    const {
        authState: {
            user
        }
    } = useContext(AuthContext)

    console.log(classData)

    const { createGradeReviewTeacher, setCreateGradeReviewTeacher } = useLocalContext();

    const [NewGradeUpdate, setNewGradeUpdate] = useState("");
    const [explanationMessage, setExplanationMessage] = useState("");

    const hanleDisagree = () => {
        const newC = {
            explanationMessage: explanationMessage,
            idGradeReview: classData.idGradeReview
        };
        axios.put(`${apiUrl}/gradeReview/review/false`, newC)
            .then(response => {
                console.log(response)
                if (response.data.success) {
                    setExplanationMessage("");
                    setNewGradeUpdate("");
                    setCreateGradeReviewTeacher(false)
                }
            })
            .catch(error => {
                alert(error + ": " + 'Fail');
                setNewGradeUpdate("");
                setExplanationMessage("");
                setCreateGradeReviewTeacher(false)
            });
    }

    const handleSubmit = e => {
        e.preventDefault();
        const newC = {
            explanationMessage: explanationMessage,
            NewGradeUpdate: NewGradeUpdate,
            idGradeReview: classData.idGradeReview,
            idGradeCon: classData.button._id,
            StudentId: classData.StudentID
        };
        axios.put(`${apiUrl}/gradeReview/review/true`, newC)
            .then(response => {
                console.log(response)
                if (response.data.success) {
                    setExplanationMessage("");
                    setNewGradeUpdate("");
                    setCreateGradeReviewTeacher(false)
                }
            })
            .catch(error => {
                alert(error + ": " + 'Fail');
                setNewGradeUpdate("");
                setExplanationMessage("");
                setCreateGradeReviewTeacher(false)
            });
    }
    return (
        <div>
            <Dialog
                onClose={() => setCreateGradeReviewTeacher(false)}
                aria-labelledby="customized-dialog-title"
                open={createGradeReviewTeacher}
                className="form__dialog"
                maxWidth="lg"
            >
                <form onSubmit={handleSubmit}>
                    <div className="form">
                        <p className="class__title">Handle Review</p>
                        <div className="form__inputs">
                            <TextField
                                id="filled-basic"
                                label="Student ID"
                                className="form__input"
                                variant="filled"
                                value={classData.StudentID}
                                disabled
                            />
                            <TextField
                                id="filled-basic"
                                label="Tên cột điểm"
                                className="form__input"
                                variant="filled"
                                value={classData.GradeName}
                                disabled
                            />
                            <TextField
                                id="filled-basic"
                                label="Điểm đề xuất"
                                className="form__input"
                                variant="filled"
                                value={classData.OldGrade + "  --->  " + classData.NewGrade}
                                disabled
                            />
                            <TextField
                                id="filled-basic"
                                label="Lý do"
                                className="form__input"
                                variant="filled"
                                value={classData.Why}
                                disabled
                            />
                            <TextField
                                id="filled-basic"
                                label="Expectation Grade"
                                className="form__input"
                                variant="filled"
                                value={NewGradeUpdate}
                                type="number"
                                InputProps={{ inputProps: { min: 0, max: 10 } }}
                                onChange={(e) => {
                                    let value = parseFloat(e.target.value, 10);
                                    if (value > 10) value = 10;
                                    if (value < 0) value = 0;
                                    setNewGradeUpdate(value)
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
                            <Button autoFocus onClick={() => setCreateGradeReviewTeacher(false)}>
                                Cancel
                            </Button>
                            <Button onClick={hanleDisagree} variant="contained" endIcon={<HighlightOffIcon />} color="error">Disagree</Button>
                            <Button type="submit" variant="contained" endIcon={<CheckCircleOutlineIcon />}>Agree</Button>
                        </DialogActions>
                    </div>
                </form>
            </Dialog>
        </div>
    )
}
export default CreateReviewTeacher;