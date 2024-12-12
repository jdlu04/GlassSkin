import React, { useEffect, useState } from "react";
import "./LandingPage.css";
import makeupSpread from "../../assets/Images/makeupSpread.jpg";
import "../../Components/Animations/Animations.css";
import cat from "../../assets/Images/cat.png";
import makeupKit from "../../assets/Images/makeupKit.png";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignIn,
  useUser,
} from "@clerk/clerk-react";
import { Button } from "@/Components/ui/button";

const LandingPage = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [search, setSearch] = useSearchParams();

  const { user } = useUser();

  const navigate = useNavigate();

  useEffect(() => {
    if (search.get("signin")) {
      setShowSignIn(true);
    }
  }, [search]);

  useEffect(() => {
    const addUserToDatabase = async () => {
      if (user) {
        try {
          const response = await fetch('http://localhost:5000/api/add_user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: user.id,
              primaryEmailAddress: user.primaryEmailAddress.emailAddress,
              createdAt: user.createdAt,
              firstName: user.firstName,
              lastName: user.lastName,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to add user');
          }

          const result = await response.json();
          console.log(result.message);
        } catch (error) {
          console.error('Error adding user:', error);
        }
      }
    };

    addUserToDatabase();
  }, [user]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowSignIn(false);
      setSearch({});
    }
  };

  return (
    <>
      <main>
        <div className="h-screen w-screen bg-cream flex flex-col">
          {/*<img className="bounce"src={cat}></img>*/}
          <div className="min-h-75 w-screen bg-green">
            <div className="text-center py-20 px-10 text-8xl">
              <h1 className="fade-in">Curated for your look</h1>
              <h1 className="text-5xl p-2 text-dark_green py-10 fade-in">
                Express your inner beauty
              </h1>
            </div>
          </div>
          <SignedOut>
            <div className="text-center py-10">
              <button
                className="button bounce"
                onClick={() => navigate("/quiz")}
              >
                Join Today
              </button>
              <div className="p-5">
                <h1>Already have an account?</h1>
                <button onClick={() => setShowSignIn(true)}>Sign in</button>
              </div>
            </div>
          </SignedOut>
          <SignedIn>
            <div className="flex h-full justify-center items-center">Your Recommended Kits</div>
          </SignedIn>
        </div>
        <div className="h-screen w-screen relative z-0 justify-between flex items-center  bg-white">
          <div className="h-screen w-4/5 relative z-10">
            <h1 className="text-8xl m-14">About Us</h1>
            <h2 className="text-4xl bg-gray-50 m-14 p-10 pulse-animation2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </h2>
          </div>
          <img className="relative z-10 m-10" src={makeupSpread}></img>
        </div>
      </main>

      {showSignIn && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={handleOverlayClick}
        >
          <SignIn
            signUpForceRedirectUrl="/onboarding"
            fallbackRedirectUrl="/onboarding"
          />
        </div>
      )}
    </>
  );
};

export default LandingPage;
