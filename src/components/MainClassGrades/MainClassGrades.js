// import React from 'react'

import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';

export const MainClassGrades = ({classData}) => {
  
  //fetch grade constructor
  const [gradeConstructor, setGradeConstructor] = useState([]);
  const fetchItem = async () => {
    const data = await fetch('http://localhost:5000/gradeConstructor/' + classData._id);
    const items = await data.json();
    setGradeConstructor(items);
  };

    useEffect(() => {
        fetchItem()
        //console.log(gradeConstructor)
    }, []
    );
    
    const [columns, setColumns] = useState([]);
    // const columns = [
      
      // { field: 'id', headerName: 'ID', width: 70 },
      // { field: 'firstName', headerName: 'First name', width: 130 },
      // { field: 'lastName', headerName: 'Last name', width: 130 },
      // {
      //   field: 'age',
      //   headerName: 'Age',
      //   type: 'number',
      //   width: 90,
      // },
      // {
      //   field: 'fullName',
      //   headerName: 'Full name',
      //   description: 'This column has a value getter and is not sortable.',
      //   sortable: false,
      //   width: 160,
      //   valueGetter: (params) =>
      //     `${params.getValue(params.id, 'firstName') || ''} ${
      //       params.getValue(params.id, 'lastName') || ''
      //     }`,
      // },
    // ];

    const rows = [
      { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
      { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
      { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
      { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
      { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
      { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
      { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
      { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
      { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
    ];

    const [row, setRow] = useState([]);
    const [col, setCol] = useState([]);
  return (
    <div style={{ height: 400, width: '100%' }}>
      <tr>         
      {gradeConstructor.map((item) =>{
                    return (
                        <th><div>{item.name}</div></th>          
                    );
                  })}
                  </tr>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />
    </div>
  );
}

export default MainClassGrades;