import './App.css';
import React, { useState, useEffect } from 'react';
import Navbar from './client/components/Navbar';
import Signup from './client/pages/Signup';
import Rules from './client/pages/Rules';
import Game from './client/pages/Game';
import About from './client/pages/About';
import Login from './client/pages/Login';
import Leaders from './client/pages/Leaders';
import Cookies from 'js-cookie';
import {
  createBrowserRouter,
  RouterProvider,
  Routes,
  Route,
  Link,
} from 'react-router-dom';
function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isInitialCheckDone, setIsInitialCheckDone] = useState(false);
  useEffect(() => {
    const checkLoggedInStatus = () => {
      const loggedIn = Cookies.get('loggedIn');
      console.log(loggedIn);
      if (loggedIn) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
      setIsInitialCheckDone(true);
    };

    checkLoggedInStatus();
  }, []);
  return (
    <div className='App'>
      <Navbar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      <Routes>
        <Route path='/about' element={<About />} />
        <Route
          path='/login'
          element={<Login loggedIn={loggedIn} setLoggedIn={setLoggedIn} />}
        />
        <Route path='/' element={<Game />} />
        <Route path='/rules' element={<Rules />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/leaders' element={<Leaders />} />
      </Routes>
    </div>
  );
}

export default App;
