import { useState, useEffect, React } from "react";
import { MyClass, MainClass, MainClassUser, Header, MainClassClassWork, MainClassMarks } from './components';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useLocalContext } from './context/context';

function App() {
  //tabs value render
  const { createTabs, setCreateTabs } = useLocalContext();
  const { tabValue, setTabValue } = useLocalContext();


  const [createdClasses, setCreatedClasses] = useState([]);
  const fetchItems = async () => {
    const data = await fetch('//localhost:5000/classroom');
    const items = await data.json();
    setCreatedClasses(items);
  };
  // useEffect(() => {
  //   fetchItems();
  // },[]
  // );
  useEffect(() => {
    fetchItems();
  }
  );
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

        <Route exact path="/" >
          <div className="App">
            <Header />
            <ol className="joined">
              {createdClasses.map((item) => (
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
