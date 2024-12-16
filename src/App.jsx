import React from "react";
import Quiz from "./pages/Quiz";
import LandingPage from "./pages/LandingPage";
import NavBar from "./Components/NavBar/NavBar";
import { createBrowserRouter, Route, RouterProvider, Routes } from "react-router-dom";
import Products from "./pages/Products";
import AppLayout from "./layouts/AppLayout";
import ShoppingList from "./pages/ShoppingList";
import Test from "./pages/test";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import LoginLayout from "./layouts/LoginLayout";

const router = createBrowserRouter([ //all redirects within frontend server
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: (
          <LandingPage />
        ),
      },
      {
        path: "/quiz",
        element: (
          <Quiz />
        ),
      },
      {
        path: "/products",
        element: (
          <Products />
        ),
      },
      {
        path: "/shopping-list",
        element: (
          <ShoppingList />
        ),
      },
      {
        path: "/test",
        element: (
          <Test/>
        ),
      },
    ],
  },
  {
    element: <LoginLayout />,
    children: [
      {
        path: "/signup",
        element: (
          <SignupPage />
        ),
      },
      {
        path: "/login",
        element: (
          <LoginPage />
        ),
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
