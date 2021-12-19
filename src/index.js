import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ContextProvider } from './context/context';
import AuthContextProvider from "./context/AuthContext";


ReactDOM.render(
  <AuthContextProvider>
    <ContextProvider>
      <App />
    </ContextProvider>
  </AuthContextProvider>
  , document.getElementById('root')
);
