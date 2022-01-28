import React from 'react';
import './Home.css'
import {Link} from 'react-router-dom'

function Home(){
  return(
    <div className ="Release">
    <h1> Choose network </h1>
    <div className ="body">
    <Link to="/ReleaseBSC">
    <button> BSC </button>
    </Link>



    <Link to="/ReleaseETH">
    <button id="ETH"> ETH </button>
    </Link>
    </div>
    </div>
      )
}
export default Home;
