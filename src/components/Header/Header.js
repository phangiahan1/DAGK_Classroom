import { AppBar, Toolbar, Typography, Avatar, Menu , MenuItem } from '@mui/material';
import { Add, Apps } from "@mui/icons-material";
import React from 'react';
import { useStyles } from './style';
import { CreateClass } from '..';
import { useLocalContext } from "../../context/context";
const Header = ({ children }) => {
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const {createClassDialog, setCreateClassDialog} = useLocalContext();
    const handleCreate = () => {
        handleClose();
        setCreateClassDialog(true);
      };
    
    return (
        <div className={classes.root}>
            <AppBar className={classes.appBar} position="static">
                <Toolbar className={classes.toolbar}>
                    <div className={classes.headerWrapper}>
                        {children}
                        {/* <img
                            src="https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg"
                            alt="Classroom"
                        /> */}
                        <Typography variant="h6" className={classes.title}>
                            Classroom
                        </Typography>
                    </div>
                    <div className={classes.header__wrapper__right}>
                        <Add onClick={handleClick} className={classes.icon} />
                        <Apps className={classes.icon} />
                        <Menu
                            id="simple-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem >Join Class</MenuItem>
                            <MenuItem onClick={handleCreate}>Create Class</MenuItem>

                        </Menu>
                        <div>
                            <Avatar className={classes.icon}></Avatar>
                        </div>
                    </div>
                </Toolbar>
            </AppBar>
            <CreateClass/>
        </div>
    )
}
export default Header