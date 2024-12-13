import React from 'react';
import Quiz from './pages/Quiz/Quiz';
import LandingPage from './pages/LandingPage/LandingPage';
import NavBar from './Components/NavBar/NavBar';
import { Route, Routes } from 'react-router-dom';
import Products from './pages/Products';

const App = () => {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/quiz" element={<Quiz/>} />
        <Route path="/products" element={<Products />} />
      </Routes>
    </>
  );
};

export default App;