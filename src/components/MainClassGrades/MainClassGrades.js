import React from 'react'
import * as XLSX from 'xlsx';
import { useLocalContext } from "../../context/context";
import { useState, useEffect } from 'react';
import { apiUrl } from '../../context/constants';
import ReactExport from "react-export-excel";
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { MenuItem } from '@mui/material';
import { Select } from '@mui/material';
import { FormControl } from '@mui/material';
import { InputLabel } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import DownloadIcon from '@mui/icons-material/Download';
import axios from 'axios';
import {
  GridToolbarContainer,
  GridToolbarExport,
  gridClasses,
} from '@mui/x-data-grid';
import "./style.css";
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";
import { CreatereviewTeacher } from "..";
import SendIcon from '@mui/icons-material/Send';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export const MainClassGrades = ({ classData }) => {

  //For table Review
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14
    }
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0
    }
  }));
  function createDataGradereview(StudentID, GradeName, OldGrade, NewGrade, Why, button, idGradeReview) {
    return { StudentID, GradeName, OldGrade, NewGrade, Why, button, idGradeReview };
  }
  // End for table Review

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

  const [totalGradeOfStudent, setTotalGradeOfStudent] = useState([]);
  // const fetchItemTotalGradeOfStudent = async () => {
  //   // const data = await fetch(`${apiUrl}/gradeStudent/` + `61a757c5e736480004b91b0a`);
  //   // const items = await data.json();

  //   const gradesOfStudent = await (await fetch(`${apiUrl}/gradeStudent/findGrade/byStudentId/` + StudentId)).json();

  //   // const newImport = {
  //   //   idGrade: items[0]._id,
  //   //   StudentId: StudentId,
  //   //   numberGrade: numberGrade,
  //   //   status: false
  //   // }
  //   // const database = await fetch(`${apiUrl}/gradeStudent/findGrade/find`, newImport);
  //   // const grade = await database.json();

  //   setTotalGradeOfStudent(items);
  // };

  useEffect(() => {
    fetchItem()
    fetchItemStudentList()
    fetchItemUser()
  }, []
  );

  const columnBoardGrade = [
    { field: 'id', headerName: 'StudentID', width: 150 },
    { field: 'Student', headerName: 'Student', width: 250 },
    { field: 'TotalGrade', headerName: 'Total grade', width: 100, editable: true }
  ];

  const [fileGrade, setFileGrade] = React.useState('');// cho??n file ?????? input 
  const handleChange = (event) => {
    setFileGrade(event.target.value);
  };

  const [fileReturn, setFileReturn] = React.useState('');// cho??n file ?????? return 
  const handleChangeReturn = (event) => {
    setFileReturn(event.target.value);
    //console.log(fileReturn)
  };

  const [fileUnReturn, setFileUnReturn] = React.useState('');// cho??n file ?????? return 
  const handleChangeUnReturn = (event) => {
    setFileUnReturn(event.target.value);
    //console.log(fileUnReturn)
  };

  const chooseGradeFile = [];
  gradeConstructor.map((item) => {
    chooseGradeFile.push(item.name);
    //columnBoardGrade.push({ field: item._id, headerName: item.name + " - " + item.percentage, width: 100, editable: true })
    columnBoardGrade.push({ field: item.name, headerName: item.name + " - " + item.percentage, width: 100, editable: true })
  })
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]); // ??i????m excel

  //For table
  const [RowTable, setRowTable] = useState([]);
  const [RowTableTemplate, setRowTableTemplate] = useState([]);
  const rowBoardGrade = [];
  const rowTemplate = [];
  const fetchDataGrade = async () => {
    if(RowTable.length>0){
    let fakeRow = RowTable

    //console.log(fakeRow)
    const result = await data.forEach(dataItem => {
      fakeRow.forEach(rowBoardGradeItem => {
        if (rowBoardGradeItem.id == dataItem.StudentId) {
          //console.log(rowBoardGradeItem.id + "==" + dataItem.StudentId)
          postStudentGrade(dataItem.StudentId, dataItem.Grade)
          for (let property in rowBoardGradeItem) {
            if (property == fileGrade) {
              rowBoardGradeItem[property] = dataItem.Grade
            }
          }
        }
      });
    })

    fakeRow.forEach(rowBoardGradeItem => {
      let totalGrade = 0;
      let per = 0;
      axios.get(`${apiUrl}/gradeStudent/findGrade/byStudentId/` + rowBoardGradeItem.id)
        .then(gradesOfStudent => {
          console.log(gradesOfStudent);
          for (let i = 0; i < gradesOfStudent.data.length; i++) {
            axios.get(`${apiUrl}/gradeConstructor/byId/` + gradesOfStudent.data[i].idGrade)
              .then(constructorOfGrade => {
                if(constructorOfGrade.data.idClass===classData._id){
                  console.log(constructorOfGrade)
                  totalGrade += gradesOfStudent.data[i].numberGrade * constructorOfGrade.data.percentage
                  per += constructorOfGrade.data.percentage
                  rowBoardGradeItem["TotalGrade"] = totalGrade / per
                  rowBoardGradeItem[constructorOfGrade.data.name] = gradesOfStudent.data[i].numberGrade
                }
              })
              .catch(error=> console.log(error))


          }
        })
        .catch(err =>
          console.log(err)
        )
    })
    
    setRowTable(fakeRow)
  }
  }

  // const fetchDataOnTable = async () => {
  //   const dataload = await studentList.map((item) => {
  const fetchDataOnTable = async () => {
    studentList.map((item) => {
      let points = 0;
      let name = item.Fullname;
      user.map((u) =>
        (item.StudentId === u.studentId)
          ? name = item.Fullname + " (" + u.username + ")"
          : name ,
      )
      gradeOfStudent.map((point) => {
        if (item.StudentId == point.StudentId)
          points = point.numberGrade;
      })
      let objrowBoardGrade = { id: item.StudentId, Student: name, TotalGrade: 0 }
      let objrowTemplate = { id: item.StudentId }
      gradeConstructor.map((i) => {
        // axios.get(`${apiUrl}/gradeStudent/findGrade/find/` + i._id + `/` + item.StudentId)
        //   .then(data => {
        //     objrowBoardGrade[i.name] = data.data.numberGrade;
        //   })
        objrowBoardGrade[i.name] = 0;
      })
      rowBoardGrade.push(objrowBoardGrade)
      rowTemplate.push(objrowTemplate)
    })
    setRowTable(rowBoardGrade);
    setRowTableTemplate(rowTemplate)
    fetchDataGrade()
  };

  useEffect(() => {
    fetchDataOnTable()
    fetchDataGrade()
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

  // handle return table
  const handleReturn = async e => {
    if (fileReturn == "All") {
      axios.put(`${apiUrl}/gradeConstructor/` + classData._id + `/returnAll`)
        .then(response => {
          //console.log(response.data.success)
          if (response.data.success) {
            alert("Return Success")
            fetchItem()
          } else {
            alert("Return fail")
          }
        }).catch(error => alert(error))
    } else {
      axios.put(`${apiUrl}/gradeConstructor/` + fileReturn + `/returnOne`)
        .then(response => {
          //console.log(response.data.success)
          if (response.data.success) {
            alert("Return Success")
            fetchItem()
          } else {
            alert("Return fail")
          }
        }).catch(error => alert(error))
    }
  }

  // handle un return table
  const handleUnReturn = async e => {
    if (fileUnReturn == "All") {
      axios.put(`${apiUrl}/gradeConstructor/` + classData._id + `/unreturnAll`)
        .then(response => {
          //console.log(response.data.success)
          if (response.data.success) {
            alert("Return Success")
            fetchItem()
            // fetchItem()
          } else {
            alert("Return fail")
          }
        }).catch(error => alert(error))
    } else {
      axios.put(`${apiUrl}/gradeConstructor/` + fileUnReturn + `/unreturnOne`)
        .then(response => {
          //console.log(response.data.success)
          if (response.data.success) {
            alert("Return Success")
            fetchItem()
            // fetchItem()
          } else {
            alert("Return fail")
          }
        }).catch(error => alert(error))
    }
  }

  const data1 = [];
  studentList.map(item => {
    data1.push({ StudentId: item.StudentId, Grade: "" })
  })
  data1.push({ StudentId: "", Grade: "" })
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
  const [refreshKeyTotal, setRefreshKeyTotal] = useState(0);
  const [loading, setLoading] = React.useState(false);

  const postStudentGrade = async (StudentId, numberGrade) => {
    const idGradeFind = await fetch(`${apiUrl}/gradeConstructor/find/` + fileGrade);
    const items = await idGradeFind.json();
    const newImport = {
      idGrade: items[0]._id,
      StudentId: StudentId,
      numberGrade: numberGrade,
      status: false
    }
    const database = await fetch(`${apiUrl}/gradeStudent/findGrade/find`, newImport);
    //console.log(database)
    const grade = await database.json();
    if (database) {
      axios.put(`${apiUrl}/gradeStudent/updateGrade/find`, newImport)
        .then(response => {
          if (response.ok) {
            //console.log("import successful");
          }
        })
        .then(data => {
          //console.log(data);
        }
        )
        .catch(error => {
          //console.log(error);
          axios.post(`${apiUrl}/gradeStudent`, newImport)
            .then(response => {
              if (response.ok) {
                //console.log("import successful");
              }
            })
            .then(data => {
              //console.log(data);
            }
            )
            .catch(error => {
              //console.log(error);
            });
        });
    }
  }

  const handleSaveOnTable = e => {
    setRefreshKey(oldKey => oldKey + 1)
  }
  useEffect(() => {
    fetchDataGrade()
    //console.log(RowTable)
  }, [refreshKey])
  // }, [studentList, user, gradeOfStudent, gradeConstructor, refreshKey])

  function ExportToolbar() {
    return (
      <GridToolbarContainer className={gridClasses.toolbarContainer}>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }

  const handleTotalGrades = e => {
    setRefreshKeyTotal(oldKey => oldKey + 1)
  }

  //For table Review
  const [rowsGradeReview, setGradeReview] = useState([]); //Ha??ng cu??a grade Review
  const [dataGradeReview, setDataGradeReview] = useState({}); //L??u d??t g????i cho component
  const { createGradeReviewTeacher, setCreateGradeReviewTeacher } = useLocalContext();

  const handleSaveGradeReview = (d) => {
    setDataGradeReview(d)
    //console.log(dataGradeReview);
    return Promise.resolve(d);
  };

  const fetchGradeReview = async () => {
    let t = []
    await axios.get(`${apiUrl}/gradeReview/${classData._id}/all`)
      .then(
        results => {
          //console.log(results)
          if (results.data.success) {
            results.data.data.forEach(element => {
              t.push(
                createDataGradereview(element.StudentId, element.idGradeCon.name,
                  element.numberGradeOld, element.numberGradeNew, element.messStu,
                  element.idGradeCon, element._id)
              )
            });
          }
        }
      ).catch(
        function (error) {
        }
      )
    setGradeReview(t)
    console.log(rowsGradeReview)
  };
  useEffect(() => {
    fetchGradeReview()
  }, [gradeConstructor, createGradeReviewTeacher]
  );

  //End for table Review

  const divstyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }
  return (
    <div>
      {rowsGradeReview.length > 0 ?
        <div className='divcenter'>
          <div>
            <b>Y??U C????U XEM XE??T LA??I ??I????M </b>
          </div>
          <TableContainer component={Paper} sx={{
            mt: 1
          }}>
            <Table aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">StudentID</StyledTableCell>
                  <StyledTableCell align="center">T??n C????t ??i????m</StyledTableCell>
                  <StyledTableCell align="center">??i????m cu??</StyledTableCell>
                  <StyledTableCell align="center">??i????m m????i</StyledTableCell>
                  <StyledTableCell align="center">Ly?? do</StyledTableCell>
                  <StyledTableCell align="center">Review</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rowsGradeReview.map((row, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell component="th" scope="row">
                      {row.StudentID}
                    </StyledTableCell>
                    <StyledTableCell align="center">{row.GradeName}</StyledTableCell>
                    <StyledTableCell align="center">{row.OldGrade}</StyledTableCell>
                    <StyledTableCell align="center">{row.NewGrade}</StyledTableCell>
                    <StyledTableCell align="center">{row.Why}</StyledTableCell>
                    <StyledTableCell align="center">
                      <Button variant="contained"
                        onClick={() => {
                          handleSaveGradeReview(row)
                            .then((d) => setCreateGradeReviewTeacher(true));
                        }}
                        endIcon={<SendIcon />}>
                        Review
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer> </div>
        : null}
      <Divider />
      <div style={divstyle}>
        <div>
          <Button>
            <ExcelFile
              filename="template Student Grade"
              element={<Button variant="outlined" sx={{ mt: 2, mx: 2 }}><DownloadIcon />Download</Button>}>
              <ExcelSheet data={data1} name="StudentList">
                {
                  filterColumns(data1).map((col) => {
                    return <ExcelColumn label={camelCase(col)} value={col} />
                  })
                }
              </ExcelSheet>
            </ExcelFile>
          </Button>
        </div>
        <div>
          <table id="table-to-xls" class="hide">
            <tbody>
              {/* <th> */}
              {data1.map(item => {
                return (
                  <tr></tr>
                );
              })}
            </tbody>
          </table>
          <FormControl sx={{ m: 1, minWidth: 200 }}>
            <InputLabel id="demo-simple-select-autowidth-label">Choose file grade import</InputLabel>
            <Select
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              value={fileGrade}
              onChange={handleChange}
              width={200}
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

          <input
            type="file"
            size="60"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileUpload}
          />
          <Button onClick={handleSaveOnTable} variant="outlined" sx={{ mt: 2, mx: 2 }}><SaveIcon />Save data</Button>

        </div>
      </div>
      <div style={{ height: 500, width: 500 + gradeConstructor.length * 100, marginInline: '20%' }}>
        <DataGrid
          rows={RowTable}
          columns={columnBoardGrade}
          pageSize={10}
          rowsPerPageOptions={[10]}
          components={{
            Toolbar: ExportToolbar,
          }}
        />
      </div>
      <div style={divstyle}>
        <div>
          <FormControl sx={{ m: 1, minWidth: 200 }}>
            <InputLabel id="choose-file-return-data">Choose return column</InputLabel>
            <Select
              labelId="choose-file-return-data"
              id="demo-simple-select-autowidth"
              value={fileReturn}
              onChange={handleChangeReturn}
              width={200}
              label="Choose return column"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="All">
                <em>All</em>
              </MenuItem>
              {gradeConstructor.map(item => (
                item.returnData ? null
                  : <MenuItem value={item._id}>{item.name}</MenuItem>)
              )}
            </Select>
          </FormControl>
          <Button onClick={handleReturn} variant="contained" sx={{ mt: 2, mx: 2 }}>Return data</Button>
        </div>
        <div>
          <FormControl sx={{ m: 1, minWidth: 200 }}>
            <InputLabel id="choose-file-un-return-data">Choose un return</InputLabel>
            <Select
              labelId="choose-file-un-return-data"
              id="demo-simple-select-autowidth"
              value={fileUnReturn}
              onChange={handleChangeUnReturn}
              width={200}
              label="Choose return column"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="All">
                <em>All</em>
              </MenuItem>
              {gradeConstructor.map(item => (
                item.returnData ? <MenuItem value={item._id}>{item.name}</MenuItem>
                  : null)
              )}
            </Select>
          </FormControl>
          <Button onClick={handleUnReturn} variant="contained" sx={{ mt: 2, mx: 2 }}>Un return data</Button>
        </div>
      </div>
      <CreatereviewTeacher classData={dataGradeReview} />
    </div>
  );
}

export default MainClassGrades;