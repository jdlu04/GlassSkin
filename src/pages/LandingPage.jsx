import React, { useEffect, useState } from "react";
import makeupSpread from "../assets/Images/makeupSpread.jpg";
import "../Components/Animations/Animations.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignIn,
  useUser,
} from "@clerk/clerk-react";
import { Button } from "@/Components/ui/button"; // should probably use this
import supabase from "../Components/Supabase/supabaseClient"; //calling my supabase function
import Recommended from "@/Components/Recommended/Recommended";
import { auth } from "@/auth/auth";
import { Loader } from "lucide-react";

const LandingPage = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [search, setSearch] = useSearchParams();

  const { user } = useUser();

  const { checkAuth, authUser, isCheckingAuth } = auth();

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
          const response = await fetch(
            "http://localhost:5000/api/auth/sync_user",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id: user.id,
                primaryEmailAddress: user.primaryEmailAddress.emailAddress,
                createdAt: user.createdAt,
                firstName: user.firstName,
                lastName: user.lastName,
              }),
            }
          );

          if (!response.ok) {
            throw new Error("Failed to add user");
          }

          const result = await response.json();
          console.log(result.message);
          checkAuth();
        } catch (error) {
          console.error("Error adding user:", error);
        }
      }
    };

    addUserToDatabase();
  }, [user]);

  useEffect(() => {
    const checkPreferences = async () => {
      if (user) {
        //console.log("User ID:", user.id);
        const { data, error } = await supabase
          .from("user_preferences")
          .select("preferences")
          .eq("id", user.id)
          .single();
        //console.log("Preferences data:", data.id);
        if (error) {
          console.error("Error fetching preferences:", error);
          navigate("/quiz"); //if error, navigate to quiz, lol
          return;
        }

        if (data && (!data.preferences || data.preferences.length === 0)) {
          navigate("/quiz"); //funky way of checking if user has preferences
        }
      }
    };

    checkPreferences();
  }, [user, navigate]);

  // const handleOverlayClick = (e) => {
  //   if (e.target === e.currentTarget) {
  //     setShowSignIn(false);
  //     setSearch({});
  //   }
  // };

  return (
    <>
      <main>
        <div className="h-screen w-screen bg-cream flex flex-col">
          <div className="min-h-75 w-screen bg-green">
            <div className="text-center py-20 px-10 text-8xl">
              <h1 className="fade-in">Curated for your look</h1>
              <h1 className="text-5xl p-2 text-dark_green py-10 fade-in">
                Express your inner beauty
              </h1>
            </div>
          </div>
          {!authUser && (
            <div className="text-center py-10">
              <button
                className="bg-neutral-800 hover:bg-neutral-950  text-6xl text-cream rounded-full py-8 px-14"
                onClick={() => navigate("/signup")}
              >
                Join Today
              </button>
              <div className="p-5">
                <h1>Already have an account?</h1>
                <button onClick={() => navigate("/login")}>Sign in</button>
              </div>
            </div>
          )}
          {authUser && (
            <Recommended />
          )}
          {/* 
          <SignedOut>
            <div className="text-center py-10">
              <button className='bg-neutral-800 hover:bg-neutral-950  text-6xl text-cream rounded-full py-8 px-14'
                    onClick={() => navigate('/signup')}>
                    Join Today
                </button>
              <div className="p-5">
                <h1>Already have an account?</h1>
                <button onClick={() => navigate('/login')}>Sign in</button>
              </div>
            </div>
          </SignedOut> */}
          {/* <SignedIn>
            <Recommended />
          </SignedIn> */}
        </div>
        <div className="h-screen w-screen relative z-0 justify-between flex items-center  bg-white">
          <div className="h-screen w-4/5 relative z-10">
            <h1 className="text-6xl m-14">About Us</h1>
            <h2 className="text-2xl bg-gray-50 m-14 p-10 pulse-animation2">
              Introducing Glass Skin, the ultimate product for beauty beginners
              seeking their perfect glow. Whether you're just stepping into the
              world of skincare and makeup or want a straightforward solution,
              Glass Skin takes the guesswork out of finding the right products
              for your desired look.
              <br></br>
              <br></br>
              Designed with simplicity and elegance in mind, Glass Skin analyzes
              your preferences—whether you’re aiming for a dewy, radiant
              complexion, a matte finish, or something in between—and offers
              curated recommendations tailored to your unique style. Start your
              beauty journey with confidence, knowing that each product we
              suggest will help you achieve that coveted “glass skin” finish
              effortlessly.
              <br></br>
              <br></br>
              Your look, your way—made easy with Glass Skin.
            </h2>
          </div>
          <img className="relative z-10 m-10" src={makeupSpread}></img>
        </div>
      </main>
    </>
  );
};

export default LandingPage;
