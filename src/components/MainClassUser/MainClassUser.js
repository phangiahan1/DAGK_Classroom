import { Grid, Avatar, List, ListItem, ListItemText, ListItemAvatar, Divider, ListItemIcon, Checkbox } from '@mui/material';
import { useState, useEffect, React } from "react";
import { useLocalContext } from "../../context/context";
import "./style.css";
import IconButton from '@mui/material/IconButton';
import ListItemButton from '@mui/material/ListItemButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import {
    InviteTeacher
} from '..';

const MainClassUser = ({ classData }) => {
    const { createTabs, setCreateTabs } = useLocalContext();
    setCreateTabs(true);

    const [ownerClass, setOwerClass] = useState();

    const fetchItems1 = async () => {
        const url = '//localhost:5000/user/findEmail/' + classData.owner + '';
        const data = await fetch(url);
        const items = await data.json();
        setOwerClass(items);
        //console.log(items);
    };

    const [createdClassesPeople, setCreatedClassesPeople] = useState([]);
    const fetchItems = async () => {
        const url = '//localhost:5000/classroom/' + classData._id + '/alluser'
        const data = await fetch(url);
        const items = await data.json();
        setCreatedClassesPeople(items);
        //console.log(items);
    };
    useEffect(() => {
        fetchItems();
        fetchItems1();
    }, []
    );

    const [checked, setChecked] = useState([0]);

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    //phan invite giao vien
    const [anchorEl, setAnchorEl] = useState(null);
    const handleClose = () => setAnchorEl(null);

    //create invite teacher
    const { createInviteTeacherDialog, setcreateInviteTeacherDialog } = useLocalContext();
    const handleInviteTeacher = () => {
        setcreateInviteTeacherDialog(true);
    };
    return (
        <div className='divcenter'>
            <Grid container spacing={2}>
                <Grid item xs={10}>
                    <h1>Teachers</h1>
                </Grid>
                <Grid item xs={2}>
                    <div className='tf'>
                        <IconButton color="primary" aria-label="invite teacher">
                            <AddIcon onClick={handleInviteTeacher} />
                        </IconButton>
                    </div>
                </Grid>
            </Grid>
            <Divider />
            <List sx={{ width: '100%', bgcolor: 'background.paper', margin: 2 }}>
                {ownerClass ?
                    <ListItem disablePadding >
                        <ListItemButton role={undefined} dense>
                            <ListItemAvatar>
                                <Avatar />
                            </ListItemAvatar>
                            <ListItemText primary={ownerClass[0].username} />
                        </ListItemButton>
                    </ListItem>
                    : null}
            </List>

            <Grid container spacing={2}>
                <Grid item xs={9}>
                    <h1>Students</h1>
                </Grid>
                <Grid item xs={2}>
                    <div className='tf'>
                        <h3>{createdClassesPeople.length} student</h3>
                    </div>
                </Grid>
                <Grid item xs={1}>
                    <div className='tf'>
                        <IconButton color="primary" aria-label="invite teacher">
                            <AddIcon />
                        </IconButton>
                    </div>
                </Grid>
            </Grid>
            <Divider />
            <List sx={{ width: '100%', bgcolor: 'background.paper', margin: 2 }}>
                {createdClassesPeople.map((item, value) => {
                    const labelId = `checkbox-list-label-${value}`;
                    return (
                        <ListItem
                            key={item}
                            secondaryAction={
                                <IconButton edge="end" aria-label="comments">
                                    <MoreVertIcon />
                                </IconButton>
                            }
                            disablePadding
                        >
                            <ListItemButton role={undefined} onClick={handleToggle(value)} dense>
                                <ListItemIcon>
                                    <Checkbox
                                        edge="start"
                                        checked={checked.indexOf(value) !== -1}
                                        tabIndex={-1}
                                        disableRipple
                                        inputProps={{ 'aria-labelledby': labelId }}
                                    />
                                </ListItemIcon>
                                <ListItemAvatar>
                                    <Avatar />
                                </ListItemAvatar>
                                <ListItemText id={labelId} primary={item.idUser.email} />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
            <InviteTeacher/>
        </div>
    )
}

export default MainClassUser;
