import { AppBar, Toolbar, Typography, Avatar, Menu, MenuItem } from '@mui/material';
import { Add, Apps } from "@mui/icons-material";
import { React, useState } from 'react';
import { useStyles } from './style';
import { Drawer, CreateClass, JoinClass, Login, MainClassUser, Register, MainClass, MainClassClassWork, MainClassMarks } from '..';
import Fade from '@mui/material/Fade';
import { Button, Tabs, Tab } from '@material-ui/core';
import { useLocalContext } from "../../context/context";
import { Link } from "react-router-dom";
import { RoutedTabs, NavTab, TabLink } from "react-router-tabs";
import { Route, Switch, Redirect, useParams } from "react-router-dom";
//const Header = () => {
const Header = ({ classData }) => {
    //console.log({classData});
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorEl2, setAnchorEl2] = useState(null);
    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClickAvatar = (event) => setAnchorEl2(event.currentTarget);
    const handleClose = () => setAnchorEl(null);
    const handleCloseAvatar = () => setAnchorEl2(null);
    //create class dialog
    const { createClassDialog, setCreateClassDialog } = useLocalContext();
    //create join class
    const { joinClassDialog, setJoinClassDialog } = useLocalContext();
    //create login
    const { loginDialog, setLoginDialog } = useLocalContext();
    //create register
    const { registerDialog, setRegisterDialog } = useLocalContext();
    //tab value
    const { tabValue, setTabValue } = useLocalContext();
    //create tab bar
    const { createTabs, setCreateTabs } = useLocalContext();

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
                                Classroom
                            </Link>
                        </Typography>
                    </div>
                    <div>
                        {createTabs && classData != null ?
                            <>
                                <Tabs value={tabValue} onChange={handleChangeTab} centered>
                                    {/* <Link to={`/${classData._id}/`} label="Stream" />
                                    <Link to={`/${classData._id}/classword`} label="Classwork" />
                                    <Link to={`/${classData._id}/people`} label="People" />
                                    <Link to={`/${classData._id}/marks`} label="Marks" /> */}
                                    {/* <Link to={`/${classData._id}/`}>Stream</Link>
                                    <Link to={`/${classData._id}/classwork`}>Classwork</Link>
                                    <Link to={`/${classData._id}/people`}>People</Link>
                                    <Link to={`/${classData._id}/marks`}>Marks</Link> */}

                                    <Link to={`/${classData._id}/`} style={{ textDecoration: 'none' }}><Tab label="Stream" /></Link>
                                    <Link to={`/${classData._id}/classwork`} style={{ textDecoration: 'none' }}><Tab label="Classwork" /></Link>
                                    <Link to={`/${classData._id}/people`} style={{ textDecoration: 'none' }}><Tab label="People" /></Link>
                                    <Link to={`/${classData._id}/marks`} style={{ textDecoration: 'none' }}><Tab label="Marks" /></Link>

                                    {/* <Tab label="Stream"><Link to={`/${classData._id}/`}>Stream</Link></Tab>
                                    <Tab label="Classwork"><Link to={`/${classData._id}/classwork`}>Classwork</Link></Tab>
                                    <Tab label="People"><Link to={`/${classData._id}/people`}>People</Link></Tab>
                                    <Tab label="Marks"><Link to={`/${classData._id}/marks`}>Marks</Link></Tab> */}
                                </Tabs>
                                {/* <Switch>
                                    <Route
                                        exact
                                        path={`${classData._id}`}
                                        render={() => <Redirect replace to={`${classData._id}/admins`} />} />
                                    <Route path={`${classData._id}/`} component={MainClass} />
                                    <Route path={`${classData._id}/people`} component={MainClassUser} />
                                    <Route path={`${classData._id}/classword`} component={MainClassClassWork} />
                                    <Route path={`${classData._id}/marks`} component={MainClassMarks} />
                                </Switch> */}
                            </>
                            // <BrowserRouter>
                            //     <div>
                            //         <Route
                            //             path="/"
                            //             render={({ location }) => (
                            //                 <Fragment>
                            //                     <Tabs value={location.pathname}>
                            //                         <Tab label="Item One" value="/" component={Link} to={allTabs[0]} />
                            //                         <Tab label="Item Two" value="/tab2" component={Link} to={allTabs[1]} />
                            //                         <Tab
                            //                             value="/tab3"
                            //                             label="Item Three"
                            //                             component={Link}
                            //                             to={allTabs[2]}
                            //                         />
                            //                     </Tabs>
                            //                     <Switch>
                            //                         <Route path={allTabs[1]} render={() => <div>Tab 2</div>} />
                            //                         <Route path={allTabs[2]} render={() => <div>Tab 3</div>} />
                            //                         <Route path={allTabs[0]} render={() => <div>Tab 1</div>} />
                            //                     </Switch>
                            //                 </Fragment>
                            //             )}
                            //         />
                            //     </div>
                            // </BrowserRouter>
                            : null}
                    </div>
                    <div className={classes.header__wrapper__right}>
                        {!createTabs ?
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
                            Sign Up
                        </Button>
                    </div>
                </Toolbar>
            </AppBar>
            <CreateClass />
            <JoinClass />
            <Login />
            <Register />
        </div>
    )
}
export default Header