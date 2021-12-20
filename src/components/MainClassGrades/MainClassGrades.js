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
import axios from 'axios';
import {
  GridToolbarContainer,
  GridToolbarExport,
  gridClasses,
} from '@mui/x-data-grid';
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

  const columnBoardGrade = [
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
    //columnBoardGrade.push({ field: item._id, headerName: item.name + " - " + item.percentage, width: 100, editable: true })
    columnBoardGrade.push({ field: item.name, headerName: item.name + " - " + item.percentage, width: 100, editable: true})
  })
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]); // điểm excel

  //For table
  const [RowTable, setRowTable] = useState([]);
  const rowBoardGrade = [];

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
      let objrowBoardGrade = { id: item.StudentId, Student: name }
      gradeConstructor.map((i) => {
        objrowBoardGrade[i.name] = "0";
      })
      rowBoardGrade.push(objrowBoardGrade)
    })
    console.log("rowBoardGrade")
    console.log(rowBoardGrade)
    setRowTable(rowBoardGrade);
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

  const postStudentGrade =async(StudentId,numberGrade)=>{
    const idGradeFind = await fetch(`${apiUrl}/gradeConstructor/find/` + fileGrade);
    const items = await idGradeFind.json();
      const newImport = {
        idGrade: items[0]._id,
        StudentId: StudentId,
        numberGrade: numberGrade,
        status: false
      }
      axios.post(`${apiUrl}/gradeStudent`, newImport)
        .then(response => {
          if (response.ok) {
            console.log("import successful");
          }
        })
        .then(data => {
          console.log(data);
        }
        )
        .catch(error => {
          console.log(error);
        });
  }

  const handleSaveOnTable = e => {
    setRefreshKey(oldKey => oldKey +1)
  }
  useEffect(() => {
    async function fetchDataGrade() {
      let fakeRow = RowTable
      const result = await data.forEach(dataItem => {
        fakeRow.forEach(rowBoardGradeItem => {
          if (rowBoardGradeItem.id == dataItem.StudentId) {
            console.log(rowBoardGradeItem.id + "==" + dataItem.StudentId)
            postStudentGrade(dataItem.StudentId,dataItem.Grade)
            for (let property in rowBoardGradeItem) {
              if (property == fileGrade) {
                rowBoardGradeItem[property] = dataItem.Grade
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

  function ExportToolbar() {
    return (
      <GridToolbarContainer className={gridClasses.toolbarContainer}>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
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
          columns={columnBoardGrade}
          pageSize={5}
          rowsPerPageOptions={[5]}
          components={{
          Toolbar: ExportToolbar,
        }}
        />
      </div>
    </div>
  );
}

export default MainClassGrades;