import { AppBar, Toolbar, Typography, Avatar, Menu, MenuItem } from '@mui/material';
import { Add, Apps } from "@mui/icons-material";
import { React, useState } from 'react';
import { useStyles } from './style';
import { Drawer, CreateClass, JoinClass, Login, Register, Profile } from '..';
import { Button, Tabs, Tab } from '@material-ui/core';
import { useLocalContext } from "../../context/context";
import { Link, Redirect } from "react-router-dom";

import Box from '@mui/material/Box';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Logout from '@mui/icons-material/Logout';


const Header = ({ classData }) => {
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorEl2, setAnchorEl2] = useState(null);
    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClickAvatar = (event) => setAnchorEl2(event.currentTarget);
    const handleClose = () => setAnchorEl(null);
    const handleCloseAvatar = () => setAnchorEl2(null);
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
    const { createTabs, setCreateTabs } = useLocalContext();
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
    const handleLogin = () => {
        handleClose();
        setLoginDialog(true);
    };
    const handleRegister = () => {
        handleClose();
        setRegisterDialog(true);
    };

    function parseJwt(token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    };

    const [loginData, setLoginData] = useState(
        localStorage.getItem('loginData')
            ? JSON.parse(localStorage.getItem('loginData'))
            : null
    );
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [tokenData, setTokenData] = useState(
        localStorage.getItem('tokenData')
            ? JSON.parse(localStorage.getItem('tokenData'))
            : null
    );
    //   const handleFailure = (result) => {
    //     alert(result);
    //   };

    //   const handleLoginGoogle = async (googleData) => {
    //     const res = await fetch('/api/google-login', {
    //       method: 'POST',
    //       body: JSON.stringify({
    //         token: googleData.tokenId,
    //       }),
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //     });

    //     const data = await res.json();
    //     setLoginData(data);
    //     localStorage.setItem('loginData', JSON.stringify(data));
    //   };

    const handleProfile = () => {
        handleClose();
        setProfileDialog(true);
    }

    const handleLogout = () => {
        localStorage.removeItem('loginData');
        localStorage.removeItem('tokenData');
        setLoginData(null);
        setTokenData(null);
        window.location.href = "/";
    };


    const [anchorE3, setAnchorE3] = useState(null);
    const open3 = Boolean(anchorE3);
    const handleClick3 = (event) => {
        setAnchorE3(event.currentTarget);
    };
    const handleClose3 = () => {
        setAnchorE3(null);
    };

    return (
        <div className={classes.root}>
            <AppBar className={classes.appBar} position="static">
                <Toolbar className={classes.toolbar}>
                    <div className={classes.headerWrapper}>
                        <Drawer />
                        {/* <img
                            src="https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg"
                            alt="Classroom"
                        /> */}
                        <Typography variant="h6" className={classes.title}>
                            <Link to='/' style={{ textDecoration: 'none' }}>
                                TH Classroom
                            </Link>
                        </Typography>
                    </div>
                    <div>
                        {createTabs && classData != null ?
                            <>
                                <Tabs value={tabValue} onChange={handleChangeTab} centered>
                                    <Link to={`/${classData._id}/`} style={{ textDecoration: 'none' }}><Tab label="Stream" /></Link>
                                    <Link to={`/${classData._id}/classwork`} style={{ textDecoration: 'none' }}><Tab label="Classwork" /></Link>
                                    <Link to={`/${classData._id}/people`} style={{ textDecoration: 'none' }}><Tab label="People" /></Link>
                                    <Link to={`/${classData._id}/marks`} style={{ textDecoration: 'none' }}><Tab label="Marks" /></Link>
                                </Tabs>
                            </>
                            : null}
                    </div>
                    <div className={classes.header__wrapper__right}>
                        {!createTabs && (loginData || tokenData) ?
                            <Add onClick={handleClick} className={classes.icon} />
                            : null}
                        <Apps className={classes.icon} />
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

                        {/* <div>{tokenData}</div> */}
                        {
                            tokenData ? (
                                <div>
                                    {/* <div>{parseJwt(tokenData).username}</div> */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                                        <Tooltip title="Account settings">
                                            <IconButton onClick={handleClick3} size="small" sx={{ ml: 2 }}>
                                                {/* <Avatar sx={{ width: 32, height: 32 }} src="/public/user.png"/> */}
                                                <Avatar sx={{ width: 32, height: 32 }} src={parseJwt(tokenData).picture} />
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
                                        {/* <MenuItem>
                                    <Avatar /> My account
                                    </MenuItem>
                                    <Divider />
                                    <MenuItem>
                                    <ListItemIcon>
                                        <PersonAdd fontSize="small" />
                                    </ListItemIcon>
                                    Add another account
                                    </MenuItem>
                                    <MenuItem>
                                    <ListItemIcon>
                                        <Settings fontSize="small" />
                                    </ListItemIcon>
                                    Settings
                                    </MenuItem> */}
                                        <MenuItem onClick={handleLogout}>
                                            <ListItemIcon>
                                                <Logout fontSize="small" />
                                            </ListItemIcon>
                                            Logout
                                        </MenuItem>
                                    </Menu>
                                </div>
                            ) :
                                loginData ? (
                                    <div>
                                        {/* <div>{parseJwt(tokenData).username}</div> */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                                            <Tooltip title="Account settings">
                                                <IconButton onClick={handleClick3} size="small" sx={{ ml: 2 }}>
                                                    <Avatar sx={{ width: 32, height: 32 }} src={loginData.picture} />
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
                                        <Button
                                            id="fade-button"
                                            aria-controls="fade-menu"
                                            aria-haspopup="true"
                                            aria-expanded={open ? 'true' : undefined}
                                            onClick={handleLogin}
                                        >
                                            Login
                                        </Button>
                                        <Button
                                            id="fade-button"
                                            aria-controls="fade-menu"
                                            aria-haspopup="true"
                                            aria-expanded={open ? 'true' : undefined}
                                            onClick={handleRegister}
                                        >
                                            Register
                                        </Button>
                                    </div>
                                )
                        }
                    </div>
                </Toolbar>
            </AppBar>
            <CreateClass />
            <JoinClass />
            <Login />
            <Register />
            <Profile />
        </div>
    )
}
export default Header