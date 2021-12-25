import * as React from 'react';
import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { GridValueGetterParams } from '@mui/x-data-grid';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { Button } from '@mui/material';
import { apiUrl } from '../../../context/constants';


export default function ManagerClasses() {

    const [classroom, setClassroom] = useState([]);
    const fetchItemClassroom = async () => {
      const database = await fetch(`${apiUrl}/classroom`);
      const items = await database.json();
      setClassroom(items)
    }
  
    useEffect(() => {
      fetchItemClassroom()
    }, []
    );

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'classname', headerName: 'Class', width: 130 },
        { field: 'section', headerName: 'Section', width: 130 },
        { field: 'subject', headerName: 'Subject', width: 130 },
        { field: 'room', headerName: 'Room', width: 130 },
        { field: 'owner', headerName: 'Owner', width: 130 },
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
      
      console.log(classroom)
      const rows = []
      let id = 0;
      classroom.map(item=>{
        id++;
        rows.push({ id: id, classname: item.classname, section: item.section, subject: item.subject, room: item.room, owner: item.owner })
      })

  return (
    <div>
        <Button variant="outlined" startIcon={<LockIcon />}>
            Ban
        </Button>
        <Button variant="outlined" startIcon={<LockOpenIcon />}>
            Unban
        </Button>
        <div style={{ height: 400, width: '100%' }}>
        <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
        />
        </div>
    </div>
  );
}