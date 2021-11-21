import { useState, useEffect, React } from "react";
import { MyClass, MainClass, MainClassUser, Header, MainClassClassWork, MainClassMarks, InviteClass, InviteTeacher } from './components';
import { BrowserRouter as Router, Switch, Route, useParams, Redirect  } from "react-router-dom";
import { useLocalContext } from './context/context';

function App() {

  const { loginDialog, setLoginDialog } = useLocalContext();
  //tabs value render
  const { createTabs, setCreateTabs } = useLocalContext();
  const { tabValue, setTabValue } = useLocalContext();
  const { openDialogCofirmInvite, setOpenDialogCofirmInvite } = useLocalContext();
  const { CofirmInvite, setCofirmInvite } = useLocalContext();

  const [tokenData, setTokenData] = useState(
    localStorage.getItem('tokenData')
      ? JSON.parse(localStorage.getItem('tokenData'))
      : null
  );
  const [loginData, setLoginData] = useState(
    localStorage.getItem('loginData')
      ? JSON.parse(localStorage.getItem('loginData'))
      : null
  );

  function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  };

  // console.log("tokenData:" + tokenData);
  // console.log("loginData:" + loginData.email);

  const [createdClasses, setCreatedClasses] = useState([]);
  const fetchItemsCreate = async () => {
    let email;
    if (loginData) email = loginData.email;
    if (tokenData) email = parseJwt(tokenData).email;
    const data = await fetch('//localhost:5000/classroom/' + email);
    //const data = await fetch('//localhost:5000/classroom/phanhan2261@gmail.com');
    const items = await data.json();
    setCreatedClasses(items);
  };

  const [joinedClasses, setJoinedClasses] = useState([]);
  const fetchItemsoJoin = async () => {
    let email;
    if (loginData) email = loginData.email;
    if (tokenData) email = parseJwt(tokenData).email;
    const data = await fetch('//localhost:5000/classroom/' + email + '/joined');
    const items = await data.json();
    setJoinedClasses(items);
  };
  useEffect(() => {
    if (loginData) {
      fetchItemsCreate();
      fetchItemsoJoin();
    }
  }, [loginData]
  );
  useEffect(() => {
    if (tokenData) {
      fetchItemsCreate();
      fetchItemsoJoin();
    }
  }, [tokenData]
  );


  const {idC, setidC} = useLocalContext();

  function Child() {
    let { idClass } = useParams();
    const a = { idClass };
    setidC(a.idClass);
    setLoginDialog(true);
    useEffect(() => {
      if (tokenData) {
        setLoginDialog(false);
        setOpenDialogCofirmInvite(true);

      }
    }, [tokenData]
    );
    useEffect(() => {
      if (loginData) {
        setLoginDialog(false);
        setOpenDialogCofirmInvite(true);

      }
    }, [loginData]
    );
    useEffect(() => {
      if (CofirmInvite) {
        setOpenDialogCofirmInvite(false);
      }
    }, [CofirmInvite]
    );
    return (
      <div>
        {/* <h3>ID: {idC}</h3> */}
      </div>
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
        {createdClasses.map((item, index) => (
          <Route key={index} exact path={`/${item._id}/marks`}>
            <Header classData={item} />
            <MainClassMarks classData={item} />
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
        {joinedClasses.map((item, index) => (
          <Route key={index} exact path={`/${item._id}/marks`}>
            <Header classData={item} />
            <MainClassMarks classData={item} />
          </Route>
        ))}

        <Route exact path="/" >
          <div className="App">
            <Header />
            {loginData || tokenData ? <ol className="joined">
              {createdClasses.map((item) => (
                <MyClass classData={item} />
              ))}
              {joinedClasses.map((item) => (
                <MyClass classData={item} />
              ))}
            </ol> : <h1>Login to use app</h1>}

          </div>
        </Route>

        <Route path="/:idClass/invite_teacher">
          <Header />
          <Child />
          <InviteClass/>
          {CofirmInvite? <Redirect to="/"/> : null}
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
