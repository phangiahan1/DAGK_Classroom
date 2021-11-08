//import { Switch } from '@mui/material';
import React from 'react';
import { useState, useEffect } from "react";
//import { Route } from 'react-router';
import { Drawer, MyClass , MainClass} from './components';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  const [createdClasses, setCreatedClasses] = useState([]);
  const fetchItems = async () => {
    const data = await fetch('//localhost:5000/classroom');
    const items = await data.json();
    //console.log(items);
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
            <Drawer />
            <MainClass classData={item}/>
          </Route>
        ))}
        <div className="App">
          <Drawer />
          <ol className="joined">
            {createdClasses.map((item) => (
              <MyClass classData={item} />
            ))}
          </ol>
        </div>
      </Switch>
    </Router>

  );
}

export default App;
