import { Avatar, Button, TextField } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import "./style.css";
import { useLocalContext } from "../../context/context";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';

import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import Grid from '@mui/material/Grid';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import { blue } from '@mui/material/colors';

import axios from 'axios';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const MainClass = ({ classData }) => {
    const [showInput, setShowInput] = useState(false);
    const { createTabs, setCreateTabs } = useLocalContext();

    //grade constructor
    const [showGradeCons, setShowGradeCons] = useState(false);

    //fetch grade constructor
    const [gradeConstructor, setGradeConstructor] = useState([]);
    const fetchItem = async () => {
        const data = await fetch('http://localhost:5000/gradeConstructor/' + classData._id);
        const items = await data.json();
        setGradeConstructor(items);
    };
    function handleOnDragEnd(result) {
        if (!result.destination) return;

        const items = Array.from(gradeConstructor);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setGradeConstructor(items);
        axios.delete('http://localhost:5000/gradeConstructor/' + classData._id + '/deleteAll')
            .then(data => {
                for (let i = 0; i < gradeConstructor.length; i++) {
                    axios.post('http://localhost:5000/gradeConstructor', gradeConstructor[i])
                }
            }
            )
    }

    useEffect(() => {
        fetchItem()
        //console.log(gradeConstructor)
    }, []
    );

    setCreateTabs(true);
    return (
        <>
            <div className="main">
                <div className="main__wrapper">
                    <div className="main__content">
                        <div className="main__wrapper1">
                            <div className="main__bgImage">
                                <div className="main__emptyStyles" />
                            </div>
                            <div className="main__text">
                                <h1 className="main__heading main__overflow">
                                    {classData.classname}
                                </h1>
                                <div className="main__section main__overflow">
                                    {classData.section}
                                </div>
                                <div className="main__wrapper2">
                                    <em className="main__code">Class Code :</em>
                                    <div className="main__id">{classData._id}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="main__announce">
                        <div className="main__status">
                            <p>Upcoming</p>
                            <p className="main__subText">No work due</p>
                        </div>
                        <div className="main__announcements">
                            <div className="main__announcementsWrapper">
                                <div className="main__ancContent">
                                    {showInput ? (
                                        <div className="main__form">
                                            <TextField
                                                id="filled-multiline-flexible"
                                                multiline
                                                label="Announce Something to class"
                                                variant="filled" />
                                            <div className="main__buttons">
                                                <input
                                                    //onChange={handleChange}
                                                    variant="outlined"
                                                    color="primary"
                                                    type="file" />

                                                <div>
                                                    <Button>
                                                        Cancel
                                                    </Button>

                                                    <Button

                                                        color="primary"
                                                        variant="contained"
                                                    >
                                                        Post
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            className="main__wrapper100"
                                            onClick={() => setShowInput(true)}
                                        >
                                            <Avatar />
                                            <div>Announce Something to class</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <Card sx={{ width: 155 }}
                        onClick={() => setShowGradeCons(true)}
                    >
                        <CardContent>
                            <Typography sx={{ fontSize: 16 }} color="text.secondary" gutterBottom>
                                Grade Constructor
                            </Typography>
                            {gradeConstructor.map((item) => <ListItem>
                                <ListItemText primary={item.name} secondary={item.percentage}/>
                            </ListItem>)}
                        </CardContent>
                    </Card>
                </div>
            </div>
            <div>
                <Dialog
                    fullScreen
                    open={showGradeCons}
                    onClose={() => setShowGradeCons(false)}
                    TransitionComponent={Transition}
                >
                    <AppBar sx={{ position: 'relative' }}>
                        <Toolbar>
                            <IconButton
                                edge="start"
                                color="inherit"
                                onClick={() => setShowGradeCons(false)}
                                aria-label="close"
                            >
                                <CloseIcon />
                            </IconButton>
                            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                                Grade constructor
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <Grid
                        align="center"
                        justify="center"
                    >
                        <Box display="flex" flexDirection="column" alignItems="stretch" sx={{
                            width: 300,
                            margin: 2
                        }}>
                            <Card sx={{
                                width: 300,
                                backgroundColor: blue[50]

                            }}>
                                <CardContent>
                                    <form>
                                        <p>
                                            <TextField
                                                id="name"
                                                label="Name"

                                            />
                                        </p>
                                        <TextField
                                            id="per"
                                            label="Percentage"
                                            type="number"

                                        />
                                    </form>
                                </CardContent>
                                <Divider />
                                <CardActions
                                    sx={{
                                        display: "flex",
                                        justifyContent: "flex-end"
                                    }}>
                                    <IconButton color="primary" size="small" onClick={() => {
                                        if (document.getElementById('name').value === '')
                                            alert("name can not null")
                                        else if (document.getElementById('per').value === '')
                                            alert("percentage can not null")
                                        else {
                                            const newC = {
                                                idClass: classData._id,
                                                name: document.getElementById('name').value,
                                                percentage: document.getElementById('per').value
                                            }
                                            alert("Save item");
                                            axios.post('http://localhost:5000/gradeConstructor', newC)
                                                .then(response => {
                                                    if (response.data.success) {
                                                        alert("Save Success")
                                                        document.getElementById('name').value = "";
                                                        document.getElementById('per').value = "";
                                                        fetchItem()
                                                    } else {
                                                        alert("Fail Save")
                                                        document.getElementById('name').value = "";
                                                        document.getElementById('per').value = "";
                                                    }
                                                }).catch(error => alert(error))
                                        }
                                    }}><SaveIcon /></IconButton>
                                </CardActions>
                            </Card>
                        </Box>
                    </Grid>
                    <DragDropContext onDragEnd={handleOnDragEnd}>
                        <Droppable droppableId="characters">

                            {(provided) => (
                                <ul className="characters" {...provided.droppableProps} ref={provided.innerRef}>

                                    {gradeConstructor.map(({ _id, name, percentage }, index) => {
                                        return (
                                            <Grid
                                                align="center"
                                                justify="center"
                                            >

                                                <Draggable key={_id} draggableId={_id} index={index}>
                                                    {(provided) => (
                                                        <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                            <Box display="flex" flexDirection="column" alignItems="stretch" sx={{
                                                                width: 300,
                                                                margin: 2
                                                            }}>
                                                                <Card sx={{
                                                                    width: 300,
                                                                    backgroundColor: blue[100]

                                                                }}>
                                                                    <CardContent>
                                                                        <form>
                                                                            <p>
                                                                                <TextField
                                                                                    id={_id + 'name'}
                                                                                    label="Name"
                                                                                    defaultValue={name}
                                                                                />
                                                                            </p>
                                                                            <TextField
                                                                                id={_id + 'per'}
                                                                                label="Percentage"
                                                                                type="number"
                                                                                defaultValue={percentage}
                                                                            />
                                                                        </form>
                                                                    </CardContent>
                                                                    <Divider />
                                                                    <CardActions
                                                                        sx={{
                                                                            display: "flex",
                                                                            justifyContent: "flex-end"
                                                                        }}>
                                                                        <IconButton color="success" size="small" onClick={() => {
                                                                            if (document.getElementById(_id + 'name').value === '')
                                                                                alert("name can not null")
                                                                            else if (document.getElementById(_id + 'per').value === '')
                                                                                alert("percentage can not null")
                                                                            else {
                                                                                const newC = {
                                                                                    name: document.getElementById(_id + 'name').value,
                                                                                    percentage: document.getElementById(_id + 'per').value
                                                                                }
                                                                                alert("Edit item: " + _id);
                                                                                axios.put('http://localhost:5000/gradeConstructor/' + _id, newC)
                                                                                    .then(response => {
                                                                                        console.log(response.data.success)
                                                                                        if (response.data.success) {
                                                                                            alert("Save Success")
                                                                                            fetchItem()
                                                                                        } else {
                                                                                            alert("Fail Edit")
                                                                                            document.getElementById(_id + 'name').value = name;
                                                                                            document.getElementById(_id + 'per').value = percentage;
                                                                                        }
                                                                                    }).catch(error => alert(error))
                                                                            }
                                                                        }}><CheckIcon /></IconButton>
                                                                        <IconButton color="error" size="small" onClick={() => {
                                                                            alert("Confirm delete")
                                                                            axios.delete('http://localhost:5000/gradeConstructor/' + _id)
                                                                                .then(response => {
                                                                                    if (response.success) alert("Delete Success")
                                                                                    fetchItem()
                                                                                }).catch(error => alert(error))
                                                                        }}><DeleteIcon /></IconButton>
                                                                    </CardActions>
                                                                </Card>
                                                            </Box>
                                                        </li>
                                                    )
                                                    }
                                                </Draggable>
                                            </Grid>
                                        );
                                    })}
                                    {provided.placeholder}
                                </ul>
                            )}
                        </Droppable>
                    </DragDropContext>

                </Dialog>
            </div>
        </>
    )
}
export default MainClass;