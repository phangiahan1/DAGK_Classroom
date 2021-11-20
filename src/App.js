import { useState, useEffect, React } from "react";
import { MyClass, MainClass, MainClassUser, Header, MainClassClassWork, MainClassMarks } from './components';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useLocalContext } from './context/context';

function App() {
  //tabs value render
  const { createTabs, setCreateTabs } = useLocalContext();
  const { tabValue, setTabValue } = useLocalContext();

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

  // console.log("tokenData:" + tokenData);
  // console.log("loginData:" + loginData.email);

  const [createdClasses, setCreatedClasses] = useState([]);
  const fetchItemsCreate = async () => {
    const data = await fetch('//localhost:5000/classroom/' + loginData.email);
    //const data = await fetch('//localhost:5000/classroom/phanhan2261@gmail.com');
    const items = await data.json();
    setCreatedClasses(items);
  };

  const [joinedClasses, setJoinedClasses] = useState([]);
  const fetchItemsoJoin = async () => {
    const data = await fetch('//localhost:5000/classroom/' + loginData.email + '/joined');
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
  // useEffect(() => {
  //   fetchItems();
  // }
  //);


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
            <ol className="joined">
              {createdClasses.map((item) => (
                <MyClass classData={item} />
              ))}
              {joinedClasses.map((item) => (
                <MyClass classData={item} />
              ))}
            </ol>
          </div>
        </Route>

      </Switch>
    </Router>

  );
}

export default App;
