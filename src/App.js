import { useState, useEffect, React, useContext } from "react";
import { Tesst, ManagerAccount, MyClass, MainClass, MainClassUser, Header, MainClassClassWork, MainClassGrades, InviteClass, InviteTeacher, InviteClassStudent, MainStudentList, MainClassGradesStu } from './components';
import { BrowserRouter as Router, Switch, Route, useParams, Redirect } from "react-router-dom";
import { useLocalContext } from './context/context';
import { apiUrl } from './context/constants'
import AuthContextProvider from "./context/AuthContext";
import ProtectedRoute from "./components/routing/ProtectedRoute"
import Auth from './components/Auth'
import { AuthContext } from './context/AuthContext'
import ListAccountLocked from "./components/Admin/ListAccountLocked/ListAccountLocked";
import ManagerClasses from "./components/Admin/ManagerClasses/ManagerClasses";
import HeaderAdminAccount from "./components/Admin/HeaderAdminAccount/HeaderAdminAccount";
import HeaderAdminAccountUser from "./components/Admin/HeaderAdminAccountUser/HeaderAdminAccountUser";
import HeaderAdminClassroom from "./components/Admin/HeaderAdminClassroom/HeaderAdminClassroom";
import AdminList from "./components/Admin/AdminList/AdminList";
import CreateAdmin from "./components/Admin/CreateAdmin/CreateAdmin";
import AdminDetail from "./components/Admin/AdminDetail/AdminDetail";
import { io } from "socket.io-client"
function App() {
  //context
  const {
    authState: {
      user,
      isAdmin
    }
  } = useContext(AuthContext)

  //Join Class Dialog
  const { joinClassDialog, setJoinClassDialog } = useLocalContext();
  const { createClassDialog, setCreateClassDialog } = useLocalContext();

  const { loginDialog, setLoginDialog } = useLocalContext();

  //for teacher confirm email
  const { openDialogCofirmInvite, setOpenDialogCofirmInvite } = useLocalContext();
  const { openDialogCofirmInviteStudent, setOpenDialogCofirmInviteStudent } = useLocalContext();

  const { CofirmInvite, setCofirmInvite } = useLocalContext();
  //for student confirm email 

  const [createdClasses, setCreatedClasses] = useState([]);
  const fetchItemsCreate = async () => {
    const data = await fetch(`${apiUrl}/classroom/` + user[0].email);
    const items = await data.json();
    setCreatedClasses(items);
  };

  const [adminList, setAdminList] = useState([]);
  const fetchItemUser = async () => {
    const database = await fetch(`${apiUrl}/user`);
    const items = await database.json();
    items.map(item => {
      // if(item.role){
      adminList.push(item)
      // }
    })
  }

  const [joinedClasses, setJoinedClasses] = useState([]);
  const fetchItemsoJoin = async () => {
    const data = await fetch(`${apiUrl}/classroom/` + user[0].email + `/joined`);
    const items = await data.json();
    setJoinedClasses(items);
  };

  const [classes, setClasses] = useState([]);
  const fetchItemClasses = async () => {
    const data = await fetch(`${apiUrl}/classroom/`);
    const items = await data.json();
    setClasses(items);
  };

  useEffect(() => {

    //   //socket io
    //   const socket = io("http://localhost:5000");
    //   console.log(socket.on("firstEvent",(msg)=>{
    //   console.log(msg)
    // }))
    if (user) {
      fetchItemsCreate();
      fetchItemsoJoin();
      fetchItemUser();
      fetchItemClasses();
    }
  }, [user, joinClassDialog, createClassDialog]
  );

  const { idC, setidC } = useLocalContext();

  function Child() {
    let { idClass } = useParams();
    const a = { idClass };
    setidC(a.idClass);

    useEffect(() => {
      if (user) {
        setOpenDialogCofirmInvite(true);
      }
    }, [user]
    );

    useEffect(() => {
      if (CofirmInvite) {
        setOpenDialogCofirmInvite(false);
        // fetchItemsCreate();
        // fetchItemsoJoin();
        window.location.reload(true);
      }
    }, [CofirmInvite]
    );
    return (
      <div></div>
    );
  }
  function ChildStudent() {
    let { idClass } = useParams();
    const a = { idClass };
    setidC(a.idClass);
    useEffect(() => {
      if (user) {
        setOpenDialogCofirmInviteStudent(true);
      }
    }, [user]
    );

    useEffect(() => {
      if (CofirmInvite) {
        setOpenDialogCofirmInviteStudent(false);
        // fetchItemsCreate();
        // fetchItemsoJoin();
        window.location.reload(true);
      }
    }, [CofirmInvite]
    );
    return (
      <div></div>
    );
  }

  return (
    isAdmin ? (
      <Router>
        <Switch>
          <Route path={`/admin/admin`}>
            <HeaderAdminAccount />
            <AdminList />
          </Route>
          {adminList.map((item, index) => (
            <Route key={item._id} exact path={`/admin/${item._id}/admin`}>
              <HeaderAdminAccount />
              <AdminDetail data={item} />
            </Route>
          ))}
          <Route path={`/admin/adminCreate`}>
            <HeaderAdminAccount />
            <CreateAdmin />
          </Route>
          <Route path={`/admin/user`}>
            <HeaderAdminAccountUser />
            <ManagerAccount />
          </Route>
          <Route path={`/admin/userLock`}>
            <HeaderAdminAccountUser />
            <ListAccountLocked />
          </Route>
          <Route path={`/admin/classroom`}>
            <HeaderAdminClassroom />
            <ManagerClasses />
          </Route>

          {classes.map((item, index) => (
            <Route key={item._id} exact path={`/admin/${item._id}/class`}>
              <HeaderAdminClassroom />
              <MainClass classData={item} ></MainClass>
            </Route>
          ))}
        </Switch>
      </Router>
    ) : (
      <Router>
        <Switch>
          {createdClasses.map((item, index) => (
            <Route key={item._id} exact path={`/${item._id}`}>
              <Header classData={item} />
              <MainClass classData={item} ></MainClass>
            </Route>
          ))}

          {createdClasses.map((item, index) => (
            <Route key={item._id + "people"} exact path={`/${item._id}/people`}>
              <Header classData={item} />
              <MainClassUser classData={item} />
            </Route>
          ))}

          {createdClasses.map((item, index) => (
            <Route key={item._id + "classwork"} exact path={`/${item._id}/classwork`}>
              <Header classData={item} />
              <MainClassClassWork classData={item} />
            </Route>
          ))}
          {createdClasses && createdClasses.map((item, index) => (
            <Route key={item._id + "Grades"} exact path={`/${item._id}/Grades`}>
              <Header classData={item} />
              <MainClassGrades classData={item} />
            </Route>
          ))}
          {createdClasses && createdClasses.map((item, index) => (
            <Route key={item._id + "StudentList"} exact path={`/${item._id}/StudentList`}>
              <Header classData={item} />
              <MainStudentList classData={item} />
            </Route>
          ))}

          {joinedClasses.map((item, index) => (
            <Route key={item._id} exact path={`/${item._id}`}>
              <Header classData={item} />
              <MainClass classData={item} ></MainClass>
            </Route>
          ))}

          {joinedClasses.map((item, index) => (
            <Route key={item._id + "people"} exact path={`/${item._id}/people`}>
              <Header classData={item} />
              <MainClassUser classData={item} />
            </Route>
          ))}

          {joinedClasses.map((item, index) => (
            <Route key={item._id + "classwork"} exact path={`/${item._id}/classwork`}>
              <Header classData={item} />
              <MainClassClassWork classData={item} />
            </Route>
          ))}
          {joinedClasses && joinedClasses.map((item, index) => (
            <Route key={item._id + "Grades"} exact path={`/${item._id}/Grades`}>
              <Header classData={item} />
              <MainClassGrades classData={item} />
            </Route>
          ))}
          {joinedClasses && joinedClasses.map((item, index) => (
            <Route key={item._id + "GradesStu"} exact path={`/${item._id}/GradesStu`}>
              <Header classData={item} />
              <MainClassGradesStu classData={item} />
            </Route>
          ))}

          {joinedClasses && joinedClasses.map((item, index) => (
            <Route key={item._id + "StudentList"} exact path={`/${item._id}/StudentList`}>
              <Header classData={item} />
              <MainStudentList classData={item} />
            </Route>
          ))}

          <Route
            exact
            path='/login'
            render={props => <Auth {...props} authRoute='login' />}
          />
          <Route
            exact
            path='/register'
            render={props => <Auth {...props} authRoute='register' />}
          />

          <ProtectedRoute exact path="/" >
            <div className="App">
              <Header />
              <ol className="joined">
                {createdClasses.map((item) => (
                  <MyClass classData={item} />
                ))}
                {joinedClasses.map((item) => (
                  <MyClass classData={item} />
                ))}
              </ol>
            </div>
          </ProtectedRoute>

          <ProtectedRoute path="/:idClass/invite_teacher">
            <Header />
            <Child />
            <InviteClass />
            {CofirmInvite ? <Redirect to="/" /> : null}
          </ProtectedRoute>

          <ProtectedRoute path="/:idClass/invite_student">
            <Header />
            <ChildStudent />
            <InviteClassStudent />
            {CofirmInvite ? <Redirect to="/" /> : null}
          </ProtectedRoute>
        </Switch>
      </Router>
    )
  );
}

export default App;