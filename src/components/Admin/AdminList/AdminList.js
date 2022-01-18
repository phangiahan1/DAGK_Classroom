import * as React from 'react';
import { useState, useEffect, useHistory, useLocation } from 'react';
import { apiUrl } from '../../../context/constants';
import PageviewIcon from '@mui/icons-material/Pageview';
import {
  DataGrid,
  GridActionsCellItem,
  GridRowId,
  GridValueOptionsParams,
} from '@mui/x-data-grid';

export default function AdminList() {

  const [user, setUser] = useState([]);
  const admin = [];
  const fetchItemUser = async () => {
    const database = await fetch(`${apiUrl}/user`);
    const items = await database.json();
    items.map(item=>{
      if(item.role){
        admin.push(item)
      }
    })
    setUser(admin)
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
      rows.push({ id: item._id, idAdmin: id, username: item.username, email: item.email, studentId: item.studentId })
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
      { field: 'id', type: 'string', hide:true },
      { field: 'idAdmin', type: 'string' },
      { field: 'username', type: 'string' },
      { field: 'email', type: 'string', width: 220 },
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
    <div style={{ height: 300, width: 500 , marginInline: '30%' }}>
      <DataGrid columns={columns} rows={rows} />
    </div>
  );
}
