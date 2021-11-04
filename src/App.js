import React from 'react';
import { useState, useEffect } from "react";
import { Drawer, MyClass } from './components';

function App() {
  const [createdClasses, setCreatedClasses] = useState([]);
  const fetchItems = async () => {
    const data = await fetch('//localhost:4000/classroom');
    const items = await data.json();
    console.log(items);
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
    <div className="App">
      <Drawer />
      <ol className="joined">
        {createdClasses.map((item) => (
          <MyClass classData={item} />
        ))}
      </ol>
    </div>
  );
}

export default App;
