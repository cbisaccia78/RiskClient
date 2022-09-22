import React, {useState, useEffect, useContext} from 'react'
import { Routes, Route, redirect, createBrowserRouter, RouterProvider, Outlet} from 'react-router-dom';
import './App.css';
import HomeScreen from './components/home/Root';

import AuthContext from './store/auth-context';

function App() {
  const authctx = useContext(AuthContext)
  //const GameRoute = !(authctx.isInGame) ? <Redirect to="/"/> : 
  //players={players} />

  return (
    <>
    </>
  )
  
}

export default App;
