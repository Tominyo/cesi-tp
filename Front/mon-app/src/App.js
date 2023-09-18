import React, { useState } from "react"
import logo from './logo.svg';
import './App.css';
import HomeScreen from './views/HomeScreen';
import LoginScreen from './views/LoginScreen'

function App() {
  const [currentPage, setCurrentPage] = useState("/");

  const router = () => {
    switch(currentPage)
    {
      case "/":
        return <HomeScreen setCurrentPage={setCurrentPage}/>;
        break;

      case "/Login":
        return <LoginScreen setCurrentPage={setCurrentPage}/>;
        break;

      default:
        return <HomeScreen setCurrentPage={setCurrentPage}/>;
    }
  }

  return (
    router()
  );
}

export default App;
