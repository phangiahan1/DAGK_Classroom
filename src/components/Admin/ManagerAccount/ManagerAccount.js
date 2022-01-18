import * as React from 'react';
import LockIcon from '@mui/icons-material/Lock';
import { Button } from '@mui/material';
import { apiUrl } from '../../../context/constants';
import axios from 'axios';
import { useLocalContext } from '../../../context/context';
import { useState, useEffect, useHistory, useLocation } from 'react';
import PageviewIcon from '@mui/icons-material/Pageview';
import {
  DataGrid,
  GridActionsCellItem,
} from '@mui/x-data-grid';

export default function ManagerAccount() {
  const { tabValue, setTabValue } = useLocalContext()
  setTabValue(0)
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

  const rows = []
  let id = 0;
  user.map(item=>{
    id++;
    if(item.status==true)
      rows.push({ id: item._id,idIndex: id, username: item.username, email: item.email, studentId: item.studentId })
  })

  const view = React.useCallback(
    (id) => () => {
      setTimeout(() => {
      window.location.href=id+"/admin";
      });
    },
    [],
  );

  const columns = React.useMemo(
    () => [
        { field: 'id', headerName: 'ID', width: 70, hide:true },
        { field: 'idIndex', headerName: 'ID', width: 70 },
        { field: 'username', headerName: 'Name', width: 300 },
        { field: 'email', headerName: 'Email', width: 300 },
        {
          field: 'studentId',
          headerName: 'Student Id',
          type: 'number',
          width: 100,
          
        },
        {
          field: 'actions',
          type: 'actions',
          width: 60,
          getActions: (params) => [
            <GridActionsCellItem
              icon={<PageviewIcon />}
              label="View"
              onClick={view(params.id)}
            />,
          ],
        },
      ],
    [view],
  );
  const [chooseUserLock,setChooseUserLock] = useState([]);
  const lockUser = () =>{
    
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
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLoadTable = e => {
    lockUser()
    setRefreshKey(oldKey => oldKey + 1)
  }
  useEffect(() => {
    fetchItemUser()
  }, [refreshKey])

  return (
    <div>
        <Button variant="outlined" onClick={handleLoadTable} startIcon={<LockIcon />}>
            Ban
        </Button>
        <div style={{ height: 600, width: 900 , marginInline: '20%' }}>
        <DataGrid
            rows={rows}
            columns={columns}
            pstudentIdSize={20}
            rowsPerPstudentIdOptions={[20]}
            checkboxSelection
            onSelectionModelChange={(ids) => {
              setChooseUserLock(ids)
            }}
        />
        </div>
    </div>
  );
}
