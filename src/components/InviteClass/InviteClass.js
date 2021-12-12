import * as React from 'react';
import { useState , useContext } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useLocalContext } from "../../context/context";
import axios from 'axios';
import { apiUrl } from "../../context/constants"
import {AuthContext} from '../../context/AuthContext'

export const InviteClass = () => {
  //Context
  const {
    authState: {
      user
    } } = useContext(AuthContext)

  const { openDialogCofirmInvite, setOpenDialogCofirmInvite } = useLocalContext();
  const { CofirmInvite, setCofirmInvite } = useLocalContext();
  const { idC, setidC } = useLocalContext();

  const handleClose = () => {
    setOpenDialogCofirmInvite(false);
    setCofirmInvite(true);
  };
  const handleAccept = () => {
    //add joined class
    const newC = {
      email: user[0].email
    };
    axios.post(`${apiUrl}/` + idC + `/invite_teacher`, newC)
      .then(response => console.log(newC));
    setOpenDialogCofirmInvite(false);
    setCofirmInvite(true);
    //window.location.reload(true)

  };

  return (
    <div>
      <Dialog
        open={openDialogCofirmInvite}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Co-teach class?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You've been invited to co-teach class.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={handleAccept} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default InviteClass;
