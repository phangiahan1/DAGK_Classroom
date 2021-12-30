import { useState, useEffect, React, useContext } from "react";
import { Tesst, MyClass, MainClass, MainClassUser, Header, MainClassClassWork, MainClassGrades, InviteClass, InviteTeacher, InviteClassStudent, MainStudentList, MainClassGradesStu  } from './components';
import { BrowserRouter as Router, Switch, Route, useParams, Redirect } from "react-router-dom";
import { useLocalContext } from './context/context';
import { apiUrl } from './context/constants'
import AuthContextProvider from "./context/AuthContext";
import ProtectedRoute from "./components/routing/ProtectedRoute"
import Auth from './components/Auth'
import { AuthContext } from './context/AuthContext'

function App() {
  //context
  const {
    authState: {
      user
    }
  } = useContext(AuthContext)

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
    //console.log(createdClasses)
  };

  const [joinedClasses, setJoinedClasses] = useState([]);
  const fetchItemsoJoin = async () => {
    const data = await fetch(`${apiUrl}/classroom/` + user[0].email + `/joined`);
    const items = await data.json();
    setJoinedClasses(items);
    //console.log(joinedClasses)
  };
  useEffect(() => {
    if (user) {
      fetchItemsCreate();
      fetchItemsoJoin();
    }
  }, [user]
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
    <Router>
      <Switch>
        {createdClasses.map((item, index) => (
          <Route key={index} exact path={`/${item._id}`}>
            <Header classData={item} />
            <MainClass classData={item} ></MainClass>
          </Route>
        ))}

        {createdClasses.map((item, index) => (
          <Route key={index} exact path={`/${item._id}/people`}>
            <Header classData={item} />
            <MainClassUser classData={item} />
          </Route>
        ))}

        {createdClasses.map((item, index) => (
          <Route key={index} exact path={`/${item._id}/classwork`}>
            <Header classData={item} />
            <MainClassClassWork classData={item} />
          </Route>
        ))}
        {createdClasses && createdClasses.map((item, index) => (
          <Route key={index} exact path={`/${item._id}/Grades`}>
            <Header classData={item} />
            <MainClassGrades classData={item} />
          </Route>
        ))}
        {createdClasses && createdClasses.map((item, index) => (
          <Route key={index} exact path={`/${item._id}/StudentList`}>
            <Header classData={item} />
            <MainStudentList classData={item} />
          </Route>
        ))}

        {joinedClasses.map((item, index) => (
          <Route key={index} exact path={`/${item._id}`}>
            <Header classData={item} />
            <MainClass classData={item} ></MainClass>
          </Route>
        ))}

        {joinedClasses.map((item, index) => (
          <Route key={index} exact path={`/${item._id}/people`}>
            <Header classData={item} />
            <MainClassUser classData={item} />
          </Route>
        ))}

        {joinedClasses.map((item, index) => (
          <Route key={index} exact path={`/${item._id}/classwork`}>
            <Header classData={item} />
            <MainClassClassWork classData={item} />
          </Route>
        ))}
        {joinedClasses && joinedClasses.map((item, index) => (
          <Route key={index} exact path={`/${item._id}/Grades`}>
            <Header classData={item} />
            <MainClassGrades classData={item} />
          </Route>
        ))}
        {joinedClasses && joinedClasses.map((item, index) => (
          <Route key={index} exact path={`/${item._id}/GradesStu`}>
            <Header classData={item} />
            <MainClassGradesStu classData={item} />
          </Route>
        ))}

        {joinedClasses && joinedClasses.map((item, index) => (
          <Route key={index} exact path={`/${item._id}/StudentList`}>
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
  );
}

export default App;