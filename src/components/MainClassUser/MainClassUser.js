import { Grid, Avatar, List, ListItem, ListItemText, ListItemAvatar, Divider, ListItemIcon, Checkbox } from '@mui/material';
import { useState, useEffect, React } from "react";
import { useLocalContext } from "../../context/context";
import "./style.css";
import IconButton from '@mui/material/IconButton';
import ListItemButton from '@mui/material/ListItemButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
// import {
//     InviteTeacher,
//     InviteStudent
// } from '..';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import InviteStudent from '../InviteDialog/InviteStudent';
import InviteTeacher from '../InviteDialog/InviteTeacher';

const MainClassUser = ({ classData }) => {
    //for login 
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

    let email;
    if (loginData) email = loginData.email;
    if (tokenData) email = parseJwt(tokenData).email;


    const { idC, setidC } = useLocalContext();

    function parseJwt(token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    };
    //end login

    const { createTabs, setCreateTabs } = useLocalContext();
    setCreateTabs(true);
    //owner toi cao
    const [ownerClass, setOwerClass] = useState();
    //Tim vai tro cua Ban trong lop
    const [position, setPosition] = useState("");
    ////1 owner
    ////2 coop
    ////3 student

    //coop owner
    const [coopOwner, setCoopOwner] = useState([]);
    const fetchItemsCoopOwner = async () => {
        // const url = '//localhost:5000/classroom/' + classData._id + '/allteacher'
        const url = ' //thclassroom-api-app.herokuapp.com/classroom/' + classData._id + '/allteacher'
        const data = await fetch(url);
        const items = await data.json();
        setCoopOwner(items);
        for (let i = 0; i < items.length; i++) {
            if (items[i].idUser.email == email) {
                console.log("items[i].idUser.email");
                setPosition("coop");
                console.log(position);
            }
        }
    };

    const fetchItems1 = async () => {
        // const url = '//localhost:5000/user/findEmail/' + classData.owner + '';
        const url = ' //thclassroom-api-app.herokuapp.com/user/findEmail/' + classData.owner + '';
        const data = await fetch(url);
        const items = await data.json();
        setOwerClass(items);

        if (items[0].email == email) {
            setPosition("owner");
            console.log(position);
        }
    };
    // https://thclassroom-api-app.herokuapp.com/
    const [createdClassesPeople, setCreatedClassesPeople] = useState([]);
    const fetchItems = async () => {
        // url = '//localhost:5000/classroom/' + classData._id + '/alluser'
        url = ' //thclassroom-api-app.herokuapp.com/classroom/' + classData._id + '/alluser'
        const data = await fetch(url);
        const items = await data.json();
        setCreatedClassesPeople(items);
        for (let i = 0; i < items.length; i++) {
            if (items[i].idUser.email == email) {
                //console.log("items[i].idUser.emailMET MOI ");
                setPosition("student");
                console.log(position);
            }
        }
    };
    useEffect(() => {
        fetchItems();
        fetchItems1();
        fetchItemsCoopOwner();
    }, []
    );

    const [checked, setChecked] = useState([0]);
    const [checkedAll, setCheckedAll] = useState(true);

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
        console.log(newChecked);
    };

    const handleToggleall = () => {
        setCheckedAll(!checkedAll);
        const newChecked = [];
        if (checkedAll) {
            for (let i = 0; i < createdClassesPeople.length; i++) {
                newChecked.push(i);
            }
        }
        setChecked(newChecked);
        console.log(newChecked);
    };

    //create invite teacher
    const { createInviteTeacherDialog, setcreateInviteTeacherDialog } = useLocalContext();
    const handleInviteTeacher = () => {
        setcreateInviteTeacherDialog(true);
    };

    //create invite student
    const { createInviteStudentDialog, setcreateInviteStudentDialog } = useLocalContext();
    const handleInviteStudent = () => {
        setcreateInviteStudentDialog(true);
    };

    //Set more icon open menu 
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    //console.log("NGU NGOC");
    return (
        <div className='divcenter'>
            <Grid container spacing={2}>
                <Grid item xs={10}>
                    <h1>Teachers</h1>
                </Grid>
                <Grid item xs={2}>
                    <div className='tf'>
                        {position=="student" ? null:<IconButton color="primary" aria-label="invite teacher">
                            <AddIcon onClick={handleInviteTeacher} />
                        </IconButton>}
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
                {coopOwner.map((item, value) => {
                    const labelId = `checkbox-list-label-${value}`;
                    return (
                        <ListItem
                            key={item}
                            secondaryAction={
                                <div>
                                    <IconButton edge="end" aria-label="comments"
                                        aria-controls="demo-positioned-menu"
                                        aria-haspopup="true"
                                        aria-expanded={open ? 'true' : undefined}
                                        onClick={handleClick}>
                                        {position=="student" ? null:<MoreVertIcon />}
                                    </IconButton>
                                    <Menu
                                        id="demo-positioned-menu"
                                        aria-labelledby="demo-positioned-button"
                                        anchorEl={anchorEl}
                                        open={open}
                                        onClose={handleClose}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'left',
                                        }}
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'left',
                                        }}
                                    >
                                        <MenuItem onClick={handleClose}>LeaveClass</MenuItem>
                                        <MenuItem onClick={handleClose}>Delete</MenuItem>
                                        <MenuItem onClick={handleClose}>Hide</MenuItem>
                                    </Menu>

                                </div>
                            }
                            disablePadding
                        >
                            <ListItemButton role={undefined} onClick={handleToggle(value)} dense>
                                <ListItemAvatar>
                                    <Avatar />
                                </ListItemAvatar>
                                <ListItemText id={labelId} primary={item.idUser.username} />
                            </ListItemButton>
                        </ListItem>
                    );
                })}

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
                        {position=="student" ? null:<IconButton color="primary" aria-label="invite teacher">
                            <AddIcon onClick={handleInviteStudent} />
                        </IconButton>}
                    </div>
                </Grid>
            </Grid>
            <Divider />

            <List sx={{ width: '100%', bgcolor: 'background.paper', margin: 2 }}>
                <ListItem
                    //key={item}
                    disablePadding
                >
                    <ListItemButton role={undefined} onClick={handleToggleall} dense>
                        {position=="student" ? null:<ListItemIcon>
                            <Checkbox
                                edge="start"
                                //checked={checked.indexOf(value) !== -1}
                                tabIndex={-1}
                                disableRipple
                            //inputProps={{ 'aria-labelledby': labelId }}
                            />
                        </ListItemIcon>}
                    </ListItemButton>
                </ListItem>
                {createdClassesPeople.map((item, value) => {
                    const labelId = `checkbox-list-label-${value}`;
                    return (
                        <ListItem
                            key={item}
                            secondaryAction={
                                <div>
                                    <IconButton edge="end" aria-label="comments"
                                        aria-controls="demo-positioned-menu"
                                        aria-haspopup="true"
                                        aria-expanded={open ? 'true' : undefined}
                                        onClick={handleClick}>
                                        {position=="student" ? null:<MoreVertIcon />}
                                    </IconButton>
                                    <Menu
                                        id="demo-positioned-menu"
                                        aria-labelledby="demo-positioned-button"
                                        anchorEl={anchorEl}
                                        open={open}
                                        onClose={handleClose}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'left',
                                        }}
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'left',
                                        }}
                                    >
                                        <MenuItem onClick={handleClose}>Send Email</MenuItem>
                                        <MenuItem onClick={handleClose}>Delete</MenuItem>
                                        <MenuItem onClick={handleClose}>Hide</MenuItem>
                                    </Menu>

                                </div>
                            }
                            disablePadding
                        >
                            <ListItemButton role={undefined} onClick={handleToggle(value)} dense>
                                {position=="student" ? null:<ListItemIcon>
                                    <Checkbox
                                        edge="start"
                                        checked={checked.indexOf(value) !== -1}
                                        tabIndex={-1}
                                        disableRipple
                                        inputProps={{ 'aria-labelledby': labelId }}
                                    />
                                </ListItemIcon>}
                                <ListItemAvatar>
                                    <Avatar />
                                </ListItemAvatar>
                                <ListItemText id={labelId} primary={item.idUser.username} />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
            <InviteTeacher classData={classData} />
            <InviteStudent classData={classData} />
        </div>
    )
}

export default MainClassUser;
