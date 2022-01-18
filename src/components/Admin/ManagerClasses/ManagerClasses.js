import * as React from 'react';
import { useLocalContext } from '../../../context/context';
import PlagiarismIcon from '@mui/icons-material/Plagiarism';
import { GridValueGetterParams } from '@mui/x-data-grid';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { Button } from '@mui/material';
import { apiUrl } from '../../../context/constants';
import axios from 'axios';
import { useState, useEffect, useHistory, useLocation } from 'react';
import PageviewIcon from '@mui/icons-material/Pageview';
import {
  DataGrid,
  GridActionsCellItem,
  GridRowId,
  GridValueOptionsParams,
} from '@mui/x-data-grid';

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

  const rows = []
  let id = 0;
  classroom.map(item=>{
    id++;
    rows.push({ id: item._id, idClass:id, classname: item.classname, section: item.section, subject: item.subject, room: item.room, owner: item.owner })
  })

  const view = React.useCallback(
    (id) => () => {
      setTimeout(() => {
      window.location.href=id+"/class";
      });
    },
    [],
  );

  const columns = React.useMemo(
    () => [  
        { field: 'id', headerName: 'ID', width: 70 , hide: true },
        { field: 'idClass', headerName: 'ID', width: 70 },
        { field: 'classname', headerName: 'Class', width: 170 },
        { field: 'section', headerName: 'Section', width: 170 },
        { field: 'subject', headerName: 'Subject', width: 170 },
        { field: 'room', headerName: 'Room', width: 170 },
        { field: 'owner', headerName: 'Owner', width: 270 },
        {
          field: 'actions',
          type: 'actions',
          width: 80,
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

  return (
  <div>
    <div style={{ height: 600, width: '90%', marginInline: '5%' }}>
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