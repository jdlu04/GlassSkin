import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { SignedIn, UserButton, useUser } from "@clerk/clerk-react";

const NavBar = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  return (
    <>
      <div className="h-16 w-screen bg-cream flex items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-4xl">Glass Skin</h1>
          <h1 className="text-4xl text-green">|</h1>
          <div className="flex justify-between gap-6">
            <button className="text-lg" onClick={() => navigate("/")}>
              Home
            </button>
            <button className="text-lg" onClick={() => navigate("/products")}>
              Products
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-2 pr-4">
          <button className="text-lg m-5">shopping list</button>
          <SignedIn>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                },
              }}
            >
              <UserButton.MenuItems>
                {/* <UserButton.Action label="manageAccount" /> */}
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
        </div>
      </div>
      <div className="bg-green h-1 w-screen "> </div>
    </>
  );
};

export default NavBar;
