import { AppBar, Toolbar, Typography, Avatar, Menu, MenuItem } from '@mui/material';
import { Add, Apps } from "@mui/icons-material";
import { React, useState, useEffect } from 'react';
import { useStyles } from './style';
import { Drawer, CreateClass, JoinClass, Profile } from '..';
import { Button, Tabs, Tab } from '@material-ui/core';
import { useLocalContext } from "../../context/context";
import { Link } from "react-router-dom";
import Box from '@mui/material/Box';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Logout from '@mui/icons-material/Logout';
import { AuthContext } from "../../context/AuthContext"
import { useContext } from 'react'
import axios from 'axios';
import { Badge } from '@mui/material';
import { apiUrl } from '../../context/constants';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HomeIcon from '@mui/icons-material/Home';
import './style.css';

const Header = ({ classData }) => {
    //context
    const {
        authState: {
            user
        },
        logoutUser
    } = useContext(AuthContext)

    //Find role in class
    const [position, setPosition] = useState();

    const fetchPosition = async () => {
        const type = await axios.get(`${apiUrl}/classroom/${classData._id}/${user[0].email}/getPosition`);
        setPosition(type.data.message)

    };

    const [notifications, setNotifications] = useState([]);
    const fetchNotification = async () => {
      const data = await fetch(`${apiUrl}/gradeReview/`+user[0].email+`/teacher`);
      const items = await data.json();
      setNotifications(items);
    };

    const [notificationsOfStudent, setNotificationsOfStudent] = useState([]);
    const [notiOfStudentTemp, setNotiOfStudentTemp] = useState([]);
    const fetchNotificationStudent = async () => {
        const data = await fetch(`${apiUrl}/gradeReview/`);
        const items = await data.json();
        items.map(item=>{
            if(item.StudentId === user[0].studentId && item.status == true){
                notiOfStudentTemp.push(item)
            }
        })
        setNotificationsOfStudent(notiOfStudentTemp)
      };

    const [notificationsDecision, setNotificationsDecision] = useState([]);
    const [notiDecision, setNotiDecision] = useState([]);
    const fetchNotificationFinalDecision = async () => {
        const data = await fetch(`${apiUrl}/gradeReview/`);
        const items = await data.json();
        items.map(item=>{
            if(item.StudentId === user[0].studentId && item.pending == false){
                notiDecision.push(item)
            }
        })
        setNotificationsDecision(notiDecision)
      };

    const [notificationsTeacherReturn, setNotificationsTeacherReturn] = useState([]);
    const notiTeacherReturn = [];
    const [final, setFinal] = useState([]);
    const fetchNotificationTeacherReturn = async () => {
        const data = await fetch(`${apiUrl}/gradeConstructor/true/returnData`);
        const items = await data.json();
        items.map( async(item)=>{
            const dataGrade = await fetch(`${apiUrl}/gradeStudent/`+item._id+`/grade`);
            const itemsGrades = await dataGrade.json();
            if(itemsGrades.length>0){
                itemsGrades.map(i=>{
                    const check=0;
                    // notiTeacherReturn.push(i)
                    if(i.StudentId === user[0].studentId){
                        notificationsTeacherReturn.map(noti=>{
                            if(noti._id===i._id){
                                check = 1
                            }
                        })
                        if(check!=1)
                            notificationsTeacherReturn.push(i)
                    }
                })
            }

        })
        console.log(notificationsTeacherReturn)
      };
    // ////1 owner
    // ////2 coop
    // ////3 student
    useEffect(() => {
        // fetchNotification();
        // fetchNotificationStudent();
        // fetchNotificationFinalDecision();
        // fetchNotificationTeacherReturn();
        if (classData != null)
            fetchPosition();
    }, []
    );
    //use style css
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorEl2, setAnchorEl2] = useState(null);

    //
    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    //create class dialog
    const { setCreateClassDialog } = useLocalContext();
    //create join class
    const { setJoinClassDialog } = useLocalContext();
    //create login
    const { setLoginDialog } = useLocalContext();
    //create register
    const { setRegisterDialog } = useLocalContext();
    //tab value
    const { tabValue, setTabValue } = useLocalContext();
    //create tab bar
    const { createTabs } = useLocalContext();
    //create profile
    const { setProfileDialog } = useLocalContext();

    const handleChangeTab = (event, newValue) => {
        setTabValue(newValue);
    };

    const open = Boolean(anchorEl2);
    const handleCreate = () => {
        handleClose();
        setCreateClassDialog(true);
    };
    const handleJoin = () => {
        handleClose();
        setJoinClassDialog(true);
    };

    const handleProfile = () => {
        handleClose();
        setProfileDialog(true);
    }

    const handleLogout = () => { logoutUser() };

    const [anchorE3, setAnchorE3] = useState(null);
    const open3 = Boolean(anchorE3);
    const handleClick3 = (event) => {
        setAnchorE3(event.currentTarget);
    };
    const handleClose3 = () => {
        setAnchorE3(null);
    };
    const [anchorE4, setAnchorE4] = useState(null);
    const open4 = Boolean(anchorE4);
    const handleClick4 = (event) => {
        setAnchorE4(event.currentTarget);
    };
    const handleClose4 = () => {
        setAnchorE4(null);
    };
    const [openNotification, setOpenNotification] = useState(false);


    function displayNotification(n) {
        return (
            <MenuItem>{n.StudentId} have a review</MenuItem>
        )
    }

    function displayNotificationAnswer(n) {
        return (
            <MenuItem>Teacher {n.idTeacher} replied to your review</MenuItem>
        )
    }

    function displayNotificationsDecision(n) {
        return (
            <MenuItem>Teacher {n.idTeacher} creates a final decision on a mark review</MenuItem>
        )
    }
    const [name, setName] = useState("");
    function displayNotificationsTeacherReturn(n) {
        // console.log(n)
        // axios.get(`${apiUrl}/gradeConstructor/byId/`+ n.idGrade)
        // .then(data=>
        //   setName(data.data.name))
        // .catch(err=>console.log(err))

        return (
            <MenuItem>Teacher finalizes a grade composition </MenuItem>
        )
    }

    return (
        <div className={classes.root}>
            <AppBar className={classes.appBar} position="static">
                <Toolbar className={classes.toolbar}>
                    <div className={classes.headerWrapper}>
                        <Drawer />
                        <Typography variant="h6" className={classes.title}>
                            {classData ? <div style={{ color: 'white' }}>
                                {/* <Link to='/' style={{ textDecoration: 'none', color: 'white' }}>
                                    <HomeIcon />
                                </Link>  */}
                                {classData.classname}
                            </div>
                                : <Link to='/' style={{ textDecoration: 'none', color: 'white' }}>
                                    TH Classroom
                                </Link>}
                        </Typography>
                    </div>
                    <div>
                        {createTabs && classData != null && position != null ?
                            <>
                                <Tabs value={tabValue} centered>
                                    <Link to={`/${classData._id}/`} style={{ textDecoration: 'none', color: 'white' }} onClick={() => { setTabValue(0) }}><Tab label="Stream" style={{ textTransform: 'none' }} value="0" /></Link>
                                    <Link to={`/${classData._id}/classwork`} style={{ textDecoration: 'none', color: 'white' }} onClick={() => { setTabValue(1) }}><Tab label="Classwork" style={{ textTransform: 'none' }} value="1" /></Link>
                                    <Link to={`/${classData._id}/people`} style={{ textDecoration: 'none', color: 'white' }} onClick={() => { setTabValue(2) }}><Tab label="People" style={{ textTransform: 'none' }} value="2" /></Link>
                                    {position == "student" ?
                                        <Link to={`/${classData._id}/GradesStu`} style={{ textDecoration: 'none', color: 'white' }} onClick={() => { setTabValue(3) }}><Tab label="Grades" style={{ textTransform: 'none' }} value="3" /></Link>
                                        : <Link to={`/${classData._id}/Grades`} style={{ textDecoration: 'none', color: 'white' }} onClick={() => { setTabValue(3) }}><Tab label="Grades" style={{ textTransform: 'none' }} value="3" /></Link>
                                    }
                                    {position == "student" ? null :
                                        <Link to={`/${classData._id}/StudentList`} style={{ textDecoration: 'none', color: 'white' }} onClick={() => { setTabValue(4) }}><Tab label="Student" style={{ textTransform: 'none' }} value="4" /></Link>
                                    }
                                </Tabs>
                            </>
                            : null}
                    </div>
                    <div className={classes.header__wrapper__right}>
                        {!createTabs && user ?
                            <Add onClick={handleClick} className={classes.icon} />
                            : null}
                        <Badge badgeContent={notifications.length + notificationsOfStudent.length +
                         notificationsDecision.length + notificationsTeacherReturn.length} color="secondary"  className={classes.icon} onClick={() => setOpenNotification(!openNotification)}>
                            <NotificationsIcon/>
                        </Badge>
                        <Menu
                            id="simple-menu"
                            anchorEl={anchorE4}
                            keepMounted
                            open={openNotification}
                            onClose={handleClose}
                            onClick={() => setOpenNotification(!openNotification)}
                        >
                        {/* <Badge badgeContent={notifications.length + notificationsOfStudent.length +
                         notificationsDecision.length + notificationsTeacherReturn.length} color="secondary"  className={classes.icon} onClick={() => setOpenNotification(!openNotification)}>
                            <NotificationsIcon/>
                        </Badge> */}
                            {openNotification && (
                            <div>
                                {/* gọi list danh sách notification */}
                                {notifications.length > 0 ?
                                    (
                                        notifications.map(n =>
                                            displayNotification(n)
                                        )) : (<></>)}
                                {notificationsOfStudent.length > 0 ? (
                                    notificationsOfStudent.map(i =>
                                        displayNotificationAnswer(i)
                                    )) : (<></>)}
                                {notificationsDecision ? (
                                    notificationsDecision.map(i =>
                                        displayNotificationsDecision(i)
                                    )) : (<></>)}
                                {notificationsTeacherReturn.length > 0 ? (
                                    notificationsTeacherReturn.map(i =>
                                        displayNotificationsTeacherReturn(i)
                                    )) : (<></>)}
                                {/* <button className="nButton" >
                                    Mark as read
                                </button> */}
                            </div>
                        )}

                        </Menu>
                        <Menu
                            id="simple-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleJoin}>Join Class</MenuItem>
                            <MenuItem onClick={handleCreate}>Create Class</MenuItem>

                        </Menu>
                        {
                            user ? (
                                <div>
                                    <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                                        <Tooltip title="Account settings">
                                            <IconButton onClick={handleClick3} size="small" sx={{ ml: 2 }}>
                                                <Avatar sx={{ width: 32, height: 32 }} src={user.picture} />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                    <Menu
                                        anchorEl={anchorE3}
                                        open={open3}
                                        onClose={handleClose3}
                                        onClick={handleClose3}
                                        PaperProps={{
                                            elevation: 0,
                                            sx: {
                                                overflow: 'visible',
                                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                                mt: 1.5,
                                                '& .MuiAvatar-root': {
                                                    width: 32,
                                                    height: 32,
                                                    ml: -0.5,
                                                    mr: 1,
                                                },
                                                '&:before': {
                                                    content: '""',
                                                    display: 'block',
                                                    position: 'absolute',
                                                    top: 0,
                                                    right: 14,
                                                    width: 10,
                                                    height: 10,
                                                    bgcolor: 'background.paper',
                                                    transform: 'translateY(-50%) rotate(45deg)',
                                                    zIndex: 0,
                                                },
                                            },
                                        }}
                                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                    >
                                        <MenuItem onClick={handleProfile}>
                                            <Avatar /> Profile
                                        </MenuItem>

                                        <MenuItem onClick={handleLogout}>
                                            <ListItemIcon>
                                                <Logout fontSize="small" />
                                            </ListItemIcon>
                                            Logout
                                        </MenuItem>
                                    </Menu>
                                </div>
                            ) : (
                                <div>
                                    <Link to={`/login`} style={{ textDecoration: 'none' }}>
                                        <Button
                                            id="fade-button"
                                            aria-controls="fade-menu"
                                            aria-haspopup="true"
                                            aria-expanded={open ? 'true' : undefined}
                                        >
                                            Login
                                        </Button>
                                    </Link>
                                    <Link to={`/register`} style={{ textDecoration: 'none' }}>
                                        <Button
                                            id="fade-button"
                                            aria-controls="fade-menu"
                                            aria-haspopup="true"
                                            aria-expanded={open ? 'true' : undefined}
                                        >
                                            Register
                                        </Button>
                                    </Link>
                                </div>
                            )
                        }
                    </div>
                </Toolbar>
            </AppBar>
            <CreateClass />
            <JoinClass />
            {/* <Login /> */}
            {/* <Register /> */}
            <Profile />
        </div>
    )
}
export default Header