import React from 'react'
import './App.css';
import Release from './Release'
import ReleaseETH from './ReleaseETH'
import Home from './Home'
import {Routes,Route,Links} from 'react-router-dom';
import DocumentMeta from 'react-document-meta';

const meta = {
  title: 'Release App',
  description: 'Release your vesting tokens here!',
  canonical: 'https://invest.zam.io/',
  meta: {
      charset: 'utf-8',
      name: {
          keywords: 'zam,release,app,eth,bsc'
      }
  }  

  function App() {
    return (
      <Routes>
  
      <Route path = "/" element={<Home/>}/>
      <Route path = "/ReleaseBSC" element={<Release/>}/>
      <Route path = "/ReleaseETH" element={<ReleaseETH/>}/>
  
  
      </Routes>
    );
  }
  
  
export default App;
