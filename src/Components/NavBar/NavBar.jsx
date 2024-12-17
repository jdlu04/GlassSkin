import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SignedIn, UserButton, useUser } from "@clerk/clerk-react";
import Quiz from './../../pages/Quiz';
import { LogOut, User } from "lucide-react";
import { auth } from "@/auth/auth";

const NavBar = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const { logout, authUser } = auth();

  return (
    <>
      <div className="h-16 w-screen bg-cream flex items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-4xl">
            Glass Skin
          </Link>
          <h1 className="text-4xl text-green">|</h1>
          <div className="flex justify-between gap-6">
            <button className="text-lg" onClick={() => navigate("/")}>
              Home
            </button>
            <button className="text-lg" onClick={() => navigate("/products")}>
              Products
            </button>
            <button className="text-lg" onClick={() => navigate("/quiz")}>
              Quiz
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-2 pr-4 gap-5">
          <Link to="/shopping-list" className="text-lg">
            shopping list
          </Link>

          {authUser && (
            <>
              <Link to={"/profile"} className={`btn btn-sm gap-2 flex`}>
                <User className="size-5" />
                <span className="hidden sm:inline">Profile</span>
              </Link>

              <button className="flex gap-2 items-center" onClick={logout}>
                <LogOut className="size-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>

              <SignedIn>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10",
                    },
                  }}
                ></UserButton>
              </SignedIn>
            </>
          )}
        </div>
      </div>
      <div className="bg-green h-1 w-screen "> </div>
    </>
  );
};

export default NavBar;
