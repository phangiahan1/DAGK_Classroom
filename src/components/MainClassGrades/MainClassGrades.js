import React from 'react'
import * as XLSX from 'xlsx';
import DataTable from 'react-data-table-component';
import { useState, useEffect } from 'react';
import { apiUrl } from '../../context/constants';
import ReactExport from "react-export-excel";
import { DataGrid,GridRowsProp, GridColDef } from '@mui/x-data-grid';
import {MenuItem} from '@mui/material';
import {Select} from '@mui/material';
import { FormControl } from '@mui/material';
import { InputLabel } from '@mui/material';
import ReactHtmlTableToExcel from 'react-html-table-to-excel';
import axios from 'axios';
import "./style.css";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export const MainClassGrades = ({classData}) => {
  
  //fetch grade constructor
  const [gradeConstructor, setGradeConstructor] = useState([]);
  const fetchItem = async () => {
    const data = await fetch(`${apiUrl}/gradeConstructor/` + classData._id);
    const items = await data.json();
    setGradeConstructor(items);
  };

  const [studentList, setStudentList] = useState([]);
  const fetchItemStudentList = async () => {
    const database = await fetch(`${apiUrl}/StudentList/` + classData._id);
    const items = await database.json();
    setStudentList(items)
  };

  const [user, setUser] = useState([]);
  const fetchItemUser = async () => {
    const database = await fetch(`${apiUrl}/user`);
    const items = await database.json();
    setUser(items)
  }

  const [gradeOfStudent, setGradeOfStudent] = useState([]);
  const fetchItemGradeOfStudent = async() => {
      const data = await fetch(`${apiUrl}/gradeStudent/` + "61a757c5e736480004b91b0a");
      const items = await data.json();
      setGradeOfStudent(items);
  };
    useEffect(() => {
        fetchItem()
        fetchItemStudentList()
        fetchItemUser()
        fetchItemGradeOfStudent()
        console.log(gradeOfStudent)
    }, []
    );
    
    // const [columns, setColumns] = useState([]);
    const columnss = [
      
      { field: 'Student', headerName: 'Student', width: 200 },
      { field: 'TotalGrade', headerName: 'Total grade', width: 200 , editable:true}
    ];    
    const [fileGrade, setFileGrade] = React.useState('');
    const handleChange = (event) => {
      setFileGrade(event.target.value);
    };    
    
    const chooseGradeFile = [];
    gradeConstructor.map((item) =>{
      chooseGradeFile.push(item.name);
      columnss.push({ field: item._id, headerName:  item.name +" - " + item.percentage, width: 200, editable: true })
    })
    const [columns, setColumns] = useState([]);
    const [data, setData] = useState([]);
    const rowss = [];
    
    studentList.map((item) =>{
      let points = 0;

      let name = item.StudentId + " - " + item.Fullname;
      user.map((u)=>
        (item.StudentId === u.studentId)?
          name = item.StudentId + " - " + item.Fullname + " - user = " + u.username:name,
      )
      gradeOfStudent.map((point)=>{
        if(item.StudentId == point.StudentId)
          points = point.numberGrade;
        
      })
      
      rowss.push({id:item.StudentId, Student: name, idGrade:points})
    })
    // process CSV data
    const processData = dataString => {
      const dataStringLines = dataString.split(/\r\n|\n/);
      const headers = dataStringLines[0].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
      
      const list = [];
      for (let i = 1; i < dataStringLines.length; i++) {
        const row = dataStringLines[i].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
        if (headers && row.length == headers.length) {
          const obj = {};
          for (let j = 0; j < headers.length; j++) {
            let d = row[j];
            if (d.length > 0) {
              if (d[0] == '"')
                d = d.substring(1, d.length - 1);
              if (d[d.length - 1] == '"')
                d = d.substring(d.length - 2, 1);
            }
            if (headers[j]) {
              obj[headers[j]] = d;
            }
          }
  
          // remove the blank rows
          if (Object.values(obj).filter(x => x).length > 0) {
            list.push(obj);
          }
        }
      }
      
      // prepare columns list from headers
      const columns = headers.map(c => ({
        name: c,
        selector: c,
      }));
  
      setData(list);
      setColumns(columns);
    }
  
    // handle file upload
    const handleFileUpload = e => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (evt) => {
        /* Parse data */
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        /* Get first worksheet */
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        /* Convert array of arrays */
        const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
        processData(data);
      };
      reader.readAsBinaryString(file);
    }
  
    const data1 = [{ StudentId: "", Grade: "" }];
    const camelCase = (str) =>  {
      return str.substring(0, 1).toUpperCase() + str.substring(1);
    };

    const filterColumns = (data) => {
        // Get column names
        const columns = Object.keys(data[0]);
        // Remove by key (firstname)
        const filterColsByKey = columns.filter(c => c !== 'firstname');
        
        return filterColsByKey // OR return columns
    };

    const handleSubmit = e => {
      e.preventDefault();
      // if(window.confirm("Are you sure you wish to save this import?")){
      //   data.forEach(student => {
      //     const newGrade = {
      //       idClass: classData._id,
      //       idGrade: "61a757c5e736480004b91b0a",
      //       StudentId: student.StudentId,
      //       numberGrade: student.Grade
      //     }
      //       axios.post(`${apiUrl}/gradeStudent`, newGrade)
      //           .then(response => {
      //               if (response.ok) {
      //                   console.log("import successful");
      //               }
      //           })
      //           .then(data => {
      //               console.log(data);
      //           }
      //           )
      //           .catch(error => {
      //               console.log(error);
      //           });
      //     })
        
      // }
    }

  return (
    <div>
    <FormControl sx={{ m: 1, minWidth: 200 }}>
          <InputLabel id="demo-simple-select-autowidth-label">Choose file grade import</InputLabel>
          <Select
            labelId="demo-simple-select-autowidth-label"
            id="demo-simple-select-autowidth"
            value={fileGrade}
            onChange={handleChange}
            autoWidth
            label="Choose file grade import"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {chooseGradeFile.map(item =>
              <MenuItem value={item}>{item}</MenuItem>
            )}
          </Select>
        </FormControl>
    <ExcelFile filename="template Student Grade">
          <ExcelSheet data={data1} name="StudentList">
            {
              filterColumns(data1).map((col)=> {
              return <ExcelColumn label={camelCase(col)} value={col}/>
              })
            }
          </ExcelSheet>
        </ExcelFile>
        <table id="table-to-xls" class="hide">
                <tbody>
                {data1.map(item => {
                    return (
                        <tr></tr>
                    );
                })}
                </tbody>
            </table>
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileUpload}
        />
        
        <button onClick={handleSubmit}>Save data</button>
      {/* <DataTable
        pagination
        highlightOnHover
        columns={columns}
        data={data}
      /> */}
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rowss}
        columns={columnss}
        pageSize={5}
        rowsPerPageOptions={[5]}
      />
    </div>
      <ReactHtmlTableToExcel  
        className="btn btn-info"  
        table="Exporttable"  
        filename="Export"  
        sheet="Sheet"  
        buttonText="Export excel" />  
        <table id="Exporttable" class="hide">
                <tbody>
                {columnss.map(item => {
                    return (
                        <td>{item.headerName}</td>
                    );
                })}
                {rowss.map(item => {
                    return (
                      <tr>
                        <td>{item.Student}</td>
                        <td>{item.ToTalGrade}</td>
                      </tr>
                    );
                })}
                </tbody>
            </table>
    </div>
  );
}

export default MainClassGrades;