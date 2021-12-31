import * as React from 'react';
import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { GridValueGetterParams } from '@mui/x-data-grid';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { Button } from '@mui/material';
import { apiUrl } from '../../../context/constants';
import { useLocalContext } from '../../../context/context';
import PlagiarismIcon from '@mui/icons-material/Plagiarism';

export default function ManagerClasses() {

  const [chooseClass, setChooseClass] = useState([]);
  const { tabValue, setTabValue } = useLocalContext()
  setTabValue(2)
  
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
        { field: 'idClass', headerName: 'IDClass', width: 70 },
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
      
      //console.log(classroom)
      const rows = []
      let id = 0;
      classroom.map(item=>{
        id++;
        rows.push({ id: id, idClass:item._id, classname: item.classname, section: item.section, subject: item.subject, room: item.room, owner: item.owner })
      })

  const handleDetailClass = () =>{
    console.log(rows[chooseClass].isClass)
  }

  return (
    <div>
        {/* <Button variant="outlined" startIcon={<LockIcon />}>
            Ban
        </Button>
        <Button variant="outlined" startIcon={<LockOpenIcon />}>
            Unban
        </Button> */}
        <Button variant="outlined" onClick={handleDetailClass} startIcon={<PlagiarismIcon />}>
            View Detail
        </Button> 
        <div style={{ height: 600, width: '100%' }}>
        <DataGrid
            rows={rows}
            columns={columns}
            pageSize={20}
            rowsPerPageOptions={[20]}
            checkboxSelection
            onSelectionModelChange={(ids) => {
              setChooseClass(ids)
            }}
        />
        </div>
    </div>
  );
}