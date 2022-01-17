import React from 'react';
import './style.css';
import axios from 'axios';
import { apiUrl } from "../../context/constants" 
import { useState, useEffect, useContext, useHistory, useLocation } from 'react';
import { DataGrid , GridRowParams} from '@mui/x-data-grid';
import { GridValueGetterParams } from '@mui/x-data-grid';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { Button } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Link } from 'react-router-dom';
import { Alert, AlertTitle } from "@mui/material";
import { useLocalContext } from "../../context/context";
import { AuthContext } from '../../context/AuthContext'

export const OTPActivation = () => {
      //context
    const {
        authState: {
        user
        }
    } = useContext(AuthContext)

    console.log(user[0])
    useEffect(() => {
        const input = {
            email : user[0].email,
            activation : user[0].activation,
        };
        console.log(input.email)
        try{
        axios.post(`${apiUrl}/send_mail_account_activation`, input)
            .then(response => console.log(response));
        } catch(e){
            console.log(e)
        }
      }, []
      );
    const [otp,setOtp] = useState("");
    const handleSubmit = e => {
        e.preventDefault();
        if(otp===user[0].activation){
            axios.put(`${apiUrl}/user/otp/`+user[0].email)
            .then(response => console.log(response));
        }

        window.location.href='/'
        
    }


    return (
        <div>
            <div className="login">
                <div className="login__wrapper">
                <div className="login__topHead">OTP</div>
            {/* {
            MessageError ? (
                <Alert icon={false} severity='success'>
                <AlertTitle placeholder="bjhbfjs">Alert</AlertTitle>
                {MessageError}
                </Alert>
            ) : (
                <div></div>
            )
            } */}
            <div id="admin-box">
            <div class="left">
                <form onSubmit={handleSubmit} >
                <input className="login_input" type="text" name="otp" placeholder="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                />
                <Button variant="contained" type="submit">Confirm OTP</Button>
                </form>
                <br/>
                <div>You want login?
                    <Link to={`/login`} style={{ textDecoration: 'none' }}>
                    <Button variant="contained">Login</Button>
                    </Link>
                </div>
                <br/>
                <div>You want register?
                    <Link to={`/register`} style={{ textDecoration: 'none' }}>
                    <Button variant="contained">Register</Button>
                    </Link>
                </div>
            </div>
        </div>
    </div>
    </div>
    </div>
    )
}
export default OTPActivation;