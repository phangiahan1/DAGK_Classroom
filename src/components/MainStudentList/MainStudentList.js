import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import DataTable from 'react-data-table-component';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import ReactExport from "react-export-excel";
import { apiUrl } from "../../context/constants"
import axios from 'axios';
import "./style.css";
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { useLocalContext } from "../../context/context";
import Button from '@mui/material/Button';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export const MainStudentList = ({ classData }) => {
  //set tab header
  const { createTabs, setCreateTabs } = useLocalContext();
  setCreateTabs(true);
  //tab value
  const { tabValue, setTabValue } = useLocalContext()
  setTabValue(4)

  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);

  const [studentList, setStudentList] = useState([]);
  const fetchItem = async () => {
    const database = await fetch(`${apiUrl}/StudentList/` + classData._id);
    const items = await database.json();
    setStudentList(items)
    console.log(items);
    setData(items);
  };

  useEffect(() => {
    fetchItem()
    console.log(studentList)
  }, []
  );

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

  const data1 = [{ StudentId: "", Fullname: "" }];
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

  const handleSubmit = e => {
    e.preventDefault();
    if (window.confirm("Are you sure you wish to save this import?")) {
      data.forEach(student => {
        console.log(student)
        const newImport = {
          idClass: classData._id,
          StudentId: student.StudentId,
          Fullname: student.Fullname
        }
        axios.post(`${apiUrl}/StudentList`, newImport)
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
      })

    }
  }
  const rows = [];
  studentList.map(item => {
    rows.push({ id: item._id, col1: item.StudentId, col2: item.Fullname })
  })

  return (
    <div>
      <div>
      <Button>
        <ExcelFile
          filename="template Student Grade"
          element={<Button variant="outlined" sx={{mt: 2, mx: 2}}>Download</Button>}>
           <ExcelSheet data={data1} name="StudentList">
            {
              filterColumns(data1).map((col) => {
                return <ExcelColumn label={camelCase(col)} value={col} />
              })
            }
          </ExcelSheet>
        </ExcelFile>
      </Button>
        {/* <ExcelFile filename="template Student List">
          <ExcelSheet data={data1} name="StudentList">
            {
              filterColumns(data1).map((col) => {
                return <ExcelColumn label={camelCase(col)} value={col} />
              })
            }
          </ExcelSheet>
        </ExcelFile> */}
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
        {(studentList.length) ? (
          <div style={{ height: 300, width: '100%' }}>
            <DataGrid
              columns={[
                { field: 'col1', headerName: 'StudentId', width: 350, editable: true },
                { field: 'col2', headerName: 'FullName', width: 350, editable: true },
              ]}
              rows={rows}
            />
          </div>
        ) : (
          <DataTable
            pagination
            highlightOnHovers
            columns={columns}
            data={data}
          />
        )}
        <Button onClick={handleSubmit} variant="contained" sx={{mt: 2, mx: 2}}>Save data</Button>
      </div>
    </div>
  );
}

export default MainStudentList;
