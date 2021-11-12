import { useState, useEffect ,React} from "react";
import { Drawer, MyClass, MainClass } from './components';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useLocalContext } from './context/context';

function App() {
  const { createTabs, setCreateTabs } = useLocalContext();


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
            <MainClass classData={item} />
          </Route>
        ))}

        <Route exact path="/" >
          <div className="App">
            <Drawer/>
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
