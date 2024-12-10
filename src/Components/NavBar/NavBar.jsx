import React, {useState, useRef} from "react";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
    const navigate = useNavigate();

    return (
        <>
        <div className="h-12 w-screen bg-cream flex items-center justify-between px-4">
            <div className="flex items-center space-x-4">
                <h1 className="text-4xl">Glass Skin</h1>
                <h1 className="text-4xl text-green">|</h1>
                <button className="text-lg"
                    onClick={() => navigate('/')}>
                    Home</button>
            </div>
            <div className="flex items-center space-x-4">
                <button className="text-lg m-5">shopping list</button>
            </div>
        </div>
        <div className="bg-green h-1 w-screen "> </div>
        </>
    );
};

export default NavBar;