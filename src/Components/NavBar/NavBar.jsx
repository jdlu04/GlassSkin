import React, {useState, useRef} from "react";

const NavBar = () => {
    return (
        <div className="h-12 w-screen bg-yellow-50 bg-opacity-75 flex items-center justify-between px-4">
            <div className="flex items-center space-x-4">
                <h1 className="text-4xl">Glass Skin</h1>
                <h1 className="text-4xl text-lime-500">|</h1>
                <button className="text-lg">Join us</button>
                <button className="text-lg">Services</button>
                <button className="text-lg">About</button>
            </div>
            <div className="flex items-center space-x-4">
                <button className="text-lg">shopping cart logo ;-;</button>
                <button className="text-lg">profile pic logo ;-;</button>
            </div>
        </div>
    );
};

export default NavBar;