import React, { useEffect } from "react";
import Quiz from "./pages/Quiz";
import LandingPage from "./pages/LandingPage";
import NavBar from "./Components/NavBar/NavBar";
import {
  createBrowserRouter,
  Navigate,
  Route,
  RouterProvider,
  Routes,
} from "react-router-dom";
import Products from "./pages/Products";
import AppLayout from "./layouts/AppLayout";
import ShoppingList from "./pages/ShoppingList";
import Test from "./pages/test";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import LoginLayout from "./layouts/LoginLayout";
import { Loader } from "lucide-react";
import { auth } from "./auth/auth";

const router = createBrowserRouter([
  //all redirects within frontend server
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/quiz",
        element: <Quiz />,
      },
      {
        path: "/products",
        element: <Products />,
      },
      {
        path: "/shopping-list",
        element: <ShoppingList />,
      },
      {
        path: "/test",
        element: <Test />,
      },
    ],
  },
  {
    element: <LoginLayout />,
    children: [
      {
        path: "/signup",
        element: (
          <GuestOnly>
            <SignupPage />
          </GuestOnly>
        ),
      },
      {
        path: "/login",
        element: (
          <GuestOnly>
            <LoginPage />
          </GuestOnly>
        ),
      },
    ],
  },
]);

function GuestOnly({ children }) {
  const { authUser} = auth();
  return !authUser ? children : <Navigate to="/" />;
}

function App() {
  const { authUser, checkAuth, isCheckingAuth } = auth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);


  console.log({ authUser });

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return <RouterProvider router={router} />;
}

export default App;
