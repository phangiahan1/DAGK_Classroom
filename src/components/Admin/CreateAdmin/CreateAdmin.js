import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import { DataGrid , GridRowParams} from '@mui/x-data-grid';
import { GridValueGetterParams } from '@mui/x-data-grid';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { Button } from '@mui/material';
import { apiUrl } from '../../../context/constants';
import axios from 'axios';
import { useLocalContext } from '../../../context/context';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext'

export default function CreateAdmin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [re_password, setRePassword] = useState("");
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState(true);
    const [picture, setPicture] = useState("");
    const [MessageError, setMessageError] = useState("");

  const [user, setUser] = useState([]);
  const fetchItemUser = async () => {
    const database = await fetch(`${apiUrl}/user`);
    const items = await database.json();
    setUser(items)
  }

  useEffect(() => {
    fetchItemUser()
  }, []
  );

  const { tabValue, setTabValue } = useLocalContext()
  setTabValue(1)

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'username', headerName: 'Name', width: 130 },
    { field: 'email', headerName: 'Email', width: 130 },
    {
      field: 'studentId',
      headerName: 'Student Id',
      type: 'number',
      width: 90,
    },
    // {
    //   field: 'fullName',
    //   headerName: 'Full name',
    //   description: 'This column has a value getter and is not sortable.',
    //   sortable: false,
    //   width: 160,
    //   valueGetter: (params: GridValueGetterParams) =>
    //     `${params.getValue(params.id, 'email') || ''} ${
    //       params.getValue(params.id, 'username') || ''
    //     }`,
    // },
  ];
  
  const rows = []
  let id = 0;
  user.map(item=>{
    id++;
    if(item.status==true)
      rows.push({ id: id, username: item.username, email: item.email, studentId: item.studentId })
  })

  const [chooseUserLock,setChooseUserLock] = useState([]);
  const lockUser = () =>{
    
    console.log(rows)
    rows.map(item=>{
      chooseUserLock.map(i=>{
        if(item.id == i)
        axios.put(`${apiUrl}/user/lock/`+item.email)
        .then(data=>
          console.log(data))
        .catch(err=>console.log(err))
      })
      
    })
  }

  const handleCreateAdmin = e => {
    
  }

  const [refreshKey, setRefreshKey] = useState(0);

  const handleLoadTable = e => {
    lockUser()
    setRefreshKey(oldKey => oldKey + 1)
  }

  useEffect(() => {
    fetchItemUser()
    //console.log(RowTable)
  }, [refreshKey])

  const {registerUser } = useContext(AuthContext)

  const SignupSubmit = async e => {
    e.preventDefault();
    if (password !== re_password) {
      setMessageError("Password not compare re-pasword")
    }
    else {
      const newUser = {
        username: username,
        email: email,
        password: email,
        status: status,
        picture: "/public/user.png",
        role: true
      };

      try {
        const register = await registerUser(newUser)
        //Trường hợp login không thành công 
        if (!register.success) {
          setMessageError("Please check your information");
          setTimeout(() => setMessageError(null), 2000)
        } else {
        //   history.push('/')
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <div>
      {/* <h2>LIST ACCOUNT</h2> */}
        {/* <Button variant="outlined" onClick={handleCreateAdmin} startIcon={<AddCircleOutlineIcon />}>
            Create account admin
        </Button> */}
        <form onSubmit={SignupSubmit}>
              <input className="login_input" type="text" name="username" placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input className="login_input" type="text" name="email" placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button variant="contained" type="submit">Create account</Button>
            </form>
    </div>
  );
}