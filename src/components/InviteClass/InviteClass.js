import * as React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useLocalContext } from "../../context/context";
import axios from 'axios';

export const InviteClass = () => {
  const { openDialogCofirmInvite, setOpenDialogCofirmInvite } = useLocalContext();
  const { CofirmInvite, setCofirmInvite } = useLocalContext();

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

  const { idC, setidC } = useLocalContext();

  function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  };

  const handleClose = () => {
    setOpenDialogCofirmInvite(false);
    setCofirmInvite(true);
  };
  const handleAccept = () => {
    let email;
    if (loginData) email = loginData.email;
    if (tokenData) email = parseJwt(tokenData).email;
    //add joined class
    const newC = {
      email: email
    };
    axios.post('https://thclassroom-api-app.herokuapp.com/' + idC + '/invite_teacher', newC)
      .then(response => console.log(newC));
    setOpenDialogCofirmInvite(false);
    setCofirmInvite(true);
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
