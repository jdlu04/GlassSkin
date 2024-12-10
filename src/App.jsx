import React from 'react';
import Quiz from './Components/Quiz/Quiz';
import LandingPage from './Components/LandingPage/LandingPage';
import NavBar from './Components/NavBar/NavBar';
import { Route, Routes } from 'react-router-dom';

const App = () => {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/quiz" element={<Quiz/>} />
      </Routes>
    </>
  );
};

export default App;