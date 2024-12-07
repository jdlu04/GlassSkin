import React from 'react';
import Quiz from './Components/Quiz/Quiz';
import LandingPage from './Components/LandingPage/LandingPage';
import NavBar from './Components/NavBar/NavBar';
const App = () => {
  return (
    <>
      <NavBar />
      <LandingPage />
      <Quiz />
    </>
  );
};
export default App;