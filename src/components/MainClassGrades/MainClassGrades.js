import React from 'react'
import * as XLSX from 'xlsx';
import { useLocalContext } from "../../context/context";
import DataTable from 'react-data-table-component';
import { useState, useEffect } from 'react';
import { apiUrl } from '../../context/constants';
import ReactExport from "react-export-excel";
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { MenuItem } from '@mui/material';
import { Select } from '@mui/material';
import { FormControl } from '@mui/material';
import { InputLabel } from '@mui/material';
import ReactHtmlTableToExcel from 'react-html-table-to-excel';
import axios from 'axios';
import "./style.css";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export const MainClassGrades = ({ classData }) => {
  //set tab header
  const { createTabs, setCreateTabs } = useLocalContext()
  setCreateTabs(true);
  //tab value
  const { tabValue, setTabValue } = useLocalContext()
  setTabValue(3)

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
    //fetchDataOnTable()
  };

  const [user, setUser] = useState([]);
  const fetchItemUser = async () => {
    const database = await fetch(`${apiUrl}/user`);
    const items = await database.json();
    setUser(items)
    //fetchDataOnTable()
  }

  const [gradeOfStudent, setGradeOfStudent] = useState([]);
  const fetchItemGradeOfStudent = async () => {
    const data = await fetch(`${apiUrl}/gradeStudent/` + `61a757c5e736480004b91b0a`);
    const items = await data.json();
    setGradeOfStudent(items);
  };
  useEffect(() => {
    fetchItem()
    fetchItemStudentList()
    fetchItemUser()
    fetchItemGradeOfStudent()

  }, []
  );

  const columnss = [
    { field: 'id', headerName: 'StudentID', width: 100 },
    { field: 'Student', headerName: 'Student', width: 250 },
    { field: 'TotalGrade', headerName: 'Total grade', width: 100, editable: true }
  ];

  const [fileGrade, setFileGrade] = React.useState('');// chọn file để input 
  const handleChange = (event) => {
    setFileGrade(event.target.value);
  };

  const chooseGradeFile = [];
  gradeConstructor.map((item) => {
    chooseGradeFile.push(item.name);
    //columnss.push({ field: item._id, headerName: item.name + " - " + item.percentage, width: 100, editable: true })
    columnss.push({ field: item.name, headerName: item.name + " - " + item.percentage, width: 100})
  })
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]); // điểm excel

  //For table
  const [RowTable, setRowTable] = useState([]);
  const rowss = [];

  // const fetchDataOnTable = async () => {
  //   const dataload = await studentList.map((item) => {
  const fetchDataOnTable = () => {
    studentList.map((item) => {
      let points = 0;
      let name = item.Fullname;
      user.map((u) =>
        (item.StudentId === u.studentId) ?
          name = item.Fullname + " - user = " + u.username : name,
      )
      gradeOfStudent.map((point) => {
        if (item.StudentId == point.StudentId)
          points = point.numberGrade;
      })
      let objRowss = { id: item.StudentId, Student: name }
      gradeConstructor.map((i) => {
        objRowss[i.name] = "0";
      })
      rowss.push(objRowss)
    })
    console.log("rowss")
    console.log(rowss)
    setRowTable(rowss);
  };

  useEffect(() => {
    fetchDataOnTable()
  }, [studentList, user, gradeOfStudent, gradeConstructor])

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

    setData(list)
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
  const camelCase = (str) => {
    return str.substring(0, 1).toUpperCase() + str.substring(1);
  };

  const filterColumns = (data) => {
    // Get column names
    const columns = Object.keys(data[0]);
    // Remove by key (firstname)
    const filterColsByKey = columns.filter(c => c !== 'firstname');

    return filterColsByKey // OR return columns
  };

  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = React.useState(false);

  const handleSaveOnTable = e => {
    setRefreshKey(oldKey => oldKey +1)
  }
  useEffect(() => {
    async function fetchDataGrade() {
      let fakeRow = RowTable
      const result = await data.forEach(dataItem => {
        fakeRow.forEach(rowssItem => {
          if (rowssItem.id == dataItem.StudentId) {
            console.log(rowssItem.id + "==" + dataItem.StudentId)
            for (let property in rowssItem) {
              if (property == fileGrade) {
                rowssItem[property] = dataItem.Grade
              }
            }
          }
        });
      })
      setRowTable(fakeRow)
      console.log("fakeRow")
      console.log(RowTable)
    }
    fetchDataGrade()
    console.log(RowTable)
  }, [studentList, user, gradeOfStudent, gradeConstructor,refreshKey])


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
            filterColumns(data1).map((col) => {
              return <ExcelColumn label={camelCase(col)} value={col} />
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

      <button onClick={handleSaveOnTable}>Save data</button>
      {/* <DataTable
        pagination
        highlightOnHover
        columns={columns}
        data={data}
      /> */}
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={RowTable}
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
          <tr>
            {columnss.map(item => {
              return (
                <th>{item.headerName}</th>
              );
            })}
          </tr>
          {rowss.map(item => {
            return (
              <tr>
                <td>{item.id}</td>
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