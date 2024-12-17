import React, { useState } from 'react';
import { data } from '../assets/data';
import { useNavigate } from "react-router-dom";
import supabase from "../Components/Supabase/supabaseClient"; //supabase function
import { useUser } from "@clerk/clerk-react";

const Quiz = () => {
    const [index, setIndex] = useState(0);  
    const [choice, setChoice] = useState(''); // helps pass the current choice into preferences
    const [buttonString, setButtonString] = useState('Next');
    const [selected, setSelected] = useState(null);
    const navigate = useNavigate();
    const [preferences, setPreferences] = useState([]); //initialize preferences as an empty array
    const { user } = useUser();
    const next = () => { //handles the next button
        if (choice === '') {
            return;
        }

        //map the question to the key in the preferences object
        const questionKeyMap = {
            0: 'product_type',
            1: 'product_tags',
            2: 'brand',
            3: 'price_less_than',
            4: 'rating_greater_than'
        };

        if (index === 3 && selected === 2) {
            questionKeyMap[3] = 'price_greater_than';
        }

        setPreferences((prevPreferences) => [
            ...prevPreferences,
            { [questionKeyMap[index]]: choice }
        ]);

        if (index === data.length - 1) {
            sendPreferences();
            navigate('/products');
            return;
        }

        setSelected(null);
        setChoice('');
        if (index === data.length - 2) { 
            setButtonString('Submit');
        }

        setIndex((prevIndex) => prevIndex + 1);
    };

    const sendPreferences = async () => {
        try {
            console.log("Preferences to be uploaded:", preferences); //debug for preferences
            const { error } = await supabase
                .from('user_preferences')
                .upsert({ id: user.id, preferences: preferences });

            if (error) {
                console.error("Error uploading preferences:", error);
            } else {
                console.log("Preferences uploaded successfully");
            }
        } catch (error) {
            console.error("Error uploading preferences:", error);
        }
    };
//note to judy: the code below is the quiz component that will be displayed on the frontend. if you wanna add conditionals to change whats shown as the question to what gets passed as a parameter, its here
    const buttonOption = Object.keys(data[index])
        .filter((key) => key.startsWith('option') && data[index][key] != null)
        .map((key, i) => {
            let displayText = data[index][key];
            let value = data[index][key];
            
            if (value === "No preference"){ //if the value is no preference, set the value to null
                value = null;
            }

            if (index === 3) { // If the current question is the price question
                if (i === 0) {
                    value = '10';
                } else if (i === 1) {

                    value = '30';
                } else if (i === 2) {

                    value = '30';
                }
            }
            if (index===4){ //if the current question is the rating question
                if (i===3){
                    value = '1';
                }
                else if (i===2){
                    value = '2';
                }
                else if (i===1){
                    value = '3';
                }
                else if (i===0){
                    value = '4';
                }};

            return (
                <button
                    key={i}
                    onClick={() => {
                        setChoice(value);
                        setSelected(i);
                    }}
                    className={`rounded-full text-cream text-base py-3 w-96 m-2 hover:bg-dark_green
                        ${selected === i ? 'bg-dark_green' : 'bg-green'}`}
                >
                    {displayText}
                </button>
            );
        });
    return (
        <div className='h-screen w-screen bg-cream text-center text-5xl px-10 py-10'>
            <h1>Glass Skin</h1>
            <div className='text-4xl p-2 text-dark_green'>
                <h2>{data[index].question}</h2>
            </div>
            <div className='flex flex-col w-1/2 space-y-5 p-5 mx-auto'>
                <div>{buttonOption}</div>
                <div>
                    <button 
                        onClick={next}
                        className='bg-neutral-800 hover:bg-black text-cream p-2 text-2xl rounded-full w-48'
                    >
                       {buttonString}
                    </button>
                </div>
                {/*
                <div>
                    <h3>Debugging</h3>
                    <pre>{JSON.stringify(preferences, null, 2)}</pre>
                </div>
                */}
            </div>
        </div>
    );
};

export default Quiz;