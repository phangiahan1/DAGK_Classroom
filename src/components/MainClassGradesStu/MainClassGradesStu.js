import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { useLocalContext } from "../../context/context";
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios';
import { useState, useEffect, React, useContext } from 'react';
import { apiUrl } from '../../context/constants';
import { CreatereviewStudent } from "..";

export const MainClassGradesStu = ({ classData }) => {
  //console.log("classData")
  //console.log(classData)
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
  function createData(name, grade, note, button) {
    return { name, grade, note, button };
  }
  //set tab header
  const { createTabs, setCreateTabs } = useLocalContext()
  setCreateTabs(true);
  //tab value
  const { tabValue, setTabValue } = useLocalContext()
  setTabValue(3)

  //context
  const {
    authState: {
      user
    }
  } = useContext(AuthContext)

  //fetch grade constructor
  const [gradeConstructor, setGradeConstructor] = useState([]);
  const fetchGradeConstructor = async () => {
    const data = await fetch(`${apiUrl}/gradeConstructor/` + classData._id);
    const items = await data.json();
    setGradeConstructor(items);
    //console.log(gradeConstructor)
  };

  //fetch grade
  const [rows, setGradeData] = useState([]);
  const [total, setTotal] = useState();
  const [totalHide, setTotalHide] = useState(false);
  const fetchGradeData = async () => {
    let t = []
    let per = 0;
    let tong = 0;
    console.log(gradeConstructor)

    for await (let item of gradeConstructor) {
      //console.log(gradeConstructor)
      await axios.get(`${apiUrl}/gradeStudent/viewGrade/${user[0].studentId}/${item._id}`)
        .then(
          results => {
            if (results.data.success) {
              if (results.data.successRview) {
                t.push(
                  createData(item.name + "(" + item.percentage + ")", results.data.gradeData, "you: "
                    + results.data.messStu + "--teacher: " + results.data.messTea, item._id)
                )
              }else
              t.push(
                createData(item.name + "(" + item.percentage + ")", results.data.gradeData, "-", item._id)
              )
              console.log("Trong for")
              console.log(t)
              per += item.percentage;
              tong += results.data.gradeData * item.percentage;
              setTotal(tong / per)
            }
          }
        ).catch(
          function (error) {
            t.push(
              createData(item.name + "(" + item.percentage + ")", "-", "-", item._id)
            )
            setTotalHide(true)
          }
        )
    }
    setGradeData(t)
  };

  const { createGradeReview, setCreateGradeReview } = useLocalContext();
  const [data, setData] = useState({});

  useEffect(() => {
    fetchGradeConstructor()
  }, []
  );
  useEffect(() => {
    fetchGradeData()
  }, [gradeConstructor, createGradeReview]
  );

  //create profile
  const { setProfileDialog } = useLocalContext();
  const handleProfile = () => {
    setProfileDialog(true);
  }



  const handleSave = (d) => {
    setData(d)
    return Promise.resolve(d);
  };
  return (
    <div className='divcenter'>
      {!user[0].studentId ?
        <>
          "Please mapping StudentID to view grades"
          <Button onClick={handleProfile}>Click here to mapping</Button>
        </>
        : <TableContainer component={Paper} sx={{
          mt: 10
        }}>
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell align="right">Grade</StyledTableCell>
                <StyledTableCell align="right">Note</StyledTableCell>
                <StyledTableCell align="center">Review</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <StyledTableRow key={row.name}>
                  <StyledTableCell component="th" scope="row">
                    {row.name}
                  </StyledTableCell>
                  <StyledTableCell align="right">{row.grade}</StyledTableCell>
                  <StyledTableCell align="right">{row.note}</StyledTableCell>
                  <StyledTableCell align="center">
                    {row.grade === '-' ?
                      <Button variant="contained"
                        onClick={(e) => { alert(row.name) }}
                        endIcon={<SendIcon />}
                        disabled>
                        Review
                      </Button>
                      : row.note === '-' ?
                        <Button variant="contained"
                          onClick={() => {
                            handleSave({ _id: row.button, grade: row.grade, name: row.name })
                              .then((d) => setCreateGradeReview(true));
                          }}
                          endIcon={<SendIcon />}>
                          Review
                        </Button>
                        : <Button variant="contained"
                          onClick={(e) => { alert(row.name) }}
                          endIcon={<SendIcon />}
                          disabled>
                          Review
                        </Button>}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
              <StyledTableRow key="total">
                <StyledTableCell component="th" scope="row">
                  T????ng k????t
                </StyledTableCell>
                {totalHide ? <StyledTableCell align="right">-</StyledTableCell>
                  : <StyledTableCell align="right">{total}</StyledTableCell>}
                <StyledTableCell align="right"></StyledTableCell>
                <StyledTableCell align="center"></StyledTableCell>
              </StyledTableRow>
            </TableBody>
          </Table>
        </TableContainer>
      }
      <CreatereviewStudent classData={data} InfoClass={classData} />
    </div>
  );
}

export default MainClassGradesStu;
