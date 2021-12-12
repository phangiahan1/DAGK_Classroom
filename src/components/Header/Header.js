import { AppBar, Toolbar, Typography, Avatar, Menu, MenuItem } from '@mui/material';
import { Add, Apps } from "@mui/icons-material";
import { React, useState } from 'react';
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

const Header = ({ classData }) => {
    //context
    const {
        authState: {
            user
        },
        logoutUser
    } = useContext(AuthContext)

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

    return (
        <div className={classes.root}>
            <AppBar className={classes.appBar} position="static">
                <Toolbar className={classes.toolbar}>
                    <div className={classes.headerWrapper}>
                        <Drawer />
                        <Typography variant="h6" className={classes.title}>
                            <Link to='/' style={{ textDecoration: 'none', color: 'white' }}>
                                TH Classroom
                            </Link>
                        </Typography>
                    </div>
                    <div>
                        {createTabs && classData != null ?
                            <>
                                <Tabs value={tabValue} centered>
                                    <Link to={`/${classData._id}/`} style={{ textDecoration: 'none', color: 'white' }} onClick={() => { setTabValue(0) }}><Tab label="Stream" style={{ textTransform: 'none' }} value="0" /></Link>
                                    <Link to={`/${classData._id}/classwork`} style={{ textDecoration: 'none', color: 'white' }} onClick={() => { setTabValue(1) }}><Tab label="Classwork" style={{ textTransform: 'none' }} value="1" /></Link>
                                    <Link to={`/${classData._id}/people`} style={{ textDecoration: 'none', color: 'white' }} onClick={() => { setTabValue(2) }}><Tab label="People" style={{ textTransform: 'none' }} value="2" /></Link>
                                    <Link to={`/${classData._id}/marks`} style={{ textDecoration: 'none', color: 'white' }} onClick={() => { setTabValue(3) }}><Tab label="Marks" style={{ textTransform: 'none' }} value="3" /></Link>
                                </Tabs>
                            </>
                            : null}
                    </div>
                    <div className={classes.header__wrapper__right}>
                        {!createTabs && user ?
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