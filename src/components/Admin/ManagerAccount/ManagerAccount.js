import * as React from 'react';
import { useState, useEffect } from 'react';
import { DataGrid , GridRowParams} from '@mui/x-data-grid';
import { GridValueGetterParams } from '@mui/x-data-grid';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { Button } from '@mui/material';
import { apiUrl } from '../../../context/constants';
import axios from 'axios';

export default function ManstudentIdrAccount() {
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

  
  return (
    <div>
        <Button variant="outlined" onClick={lockUser()} startIcon={<LockIcon />}>
            Ban
        </Button>
        <Button variant="outlined" startIcon={<LockOpenIcon />}>
            Unban
        </Button>
        <div style={{ height: 400, width: '100%' }}>
        <DataGrid
            rows={rows}
            columns={columns}
            pstudentIdSize={5}
            rowsPerPstudentIdOptions={[5]}
            checkboxSelection
            onSelectionModelChange={(ids) => {
              setChooseUserLock(ids)
              console.log(chooseUserLock)
              console.log(ids);
            }}
        />
        </div>
    </div>
  );
}