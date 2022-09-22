import boardsvg from './RiskBoard.svg'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import Game, {loader as gameLoader} from './components/risk/Game'
import HomePlayerList from './components/home/HomePlayerList';
import HomeGamesHolder from './components/home/HomeGamesHolder';
import HomeForum from './components/home/HomeForum';
import Root from './components/home/Root';
import NotFoundPage from './components/home/NotFoundPage';
import { Route, redirect } from 'react-router-dom';
import { AuthContextProvider } from './store/auth-context';
import { ThemeContextProvider } from './store/theme-context';

import { createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import RiskMap from './components/risk/RiskMap';
//import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
//
const router = createBrowserRouter(
  createRoutesFromElements(
      <Route path="/" loader = {()=>{}} element={<Root />} errorElement={<NotFoundPage />}>
        <Route path="/" loader={()=>{}} element={<HomeGamesHolder />}/>
        <Route path="players" loader={()=>{}} element={<HomePlayerList />}/>
        <Route path="forum" loader={()=>{}} element={<HomeForum/>}/>
        <Route path="game/:id" loader={gameLoader} element={<Game /> }/>
      </Route>
  )
)
root.render(
  <AuthContextProvider>
    <ThemeContextProvider>
      <RouterProvider router={router} />
    </ThemeContextProvider>
  </AuthContextProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
