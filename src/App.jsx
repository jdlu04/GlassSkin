import React from "react";
import Quiz from "./pages/Quiz";
import LandingPage from "./pages/LandingPage";
import NavBar from "./Components/NavBar/NavBar";
import { createBrowserRouter, Route, RouterProvider, Routes } from "react-router-dom";
import Products from "./pages/Products";
import AppLayout from "./layouts/AppLayout";
import ShoppingList from "./pages/ShoppingList";


const router = createBrowserRouter([
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
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
