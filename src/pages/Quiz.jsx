import React, { useState } from 'react';
import { data } from '../assets/data';
import { useNavigate } from "react-router-dom";
import supabase from "../Components/Supabase/supabaseClient"; //supabase function

const Quiz = () => {
    const [index, setIndex] = useState(0); 
    const [preferences, setPreferences] = useState([]); // stored user preferences
    const [choice, setChoice] = useState(''); // helps pass the current choice into preferences
    const [buttonString, setButtonString] = useState('Next');
    const [selected, setSelected] = useState(null);
    const navigate = useNavigate();

    const next = () => { //handles nagivate to shopping list and the name of next button
        if (choice === '') {
            return;
        }
        const processedChoice = ['None', 'No preference', 'Not sure'].includes(choice) ? '' : choice; //if choice is not in the list, it will be added to preferences
        setPreferences((prevOptions) => [...prevOptions, processedChoice]); 
        setChoice('');
        if (index === data.length - 2) { 
            setButtonString('Submit');
        } else if (index === data.length - 1) {
            console.log("Preferences:", preferences); //debug, just wanna see what we got so far --jawad
            navigate('/shopping-list');
            return;
        }

        setIndex((prevIndex) => prevIndex + 1);
    };

    const buttonOption = Object.keys(data[index]) 
        .filter((key) => key.startsWith('option') && data[index][key] != null)
        .map((key, i) => (
            <button
                key={i}
                onClick={() => {
                    setChoice(data[index][key]); 
                    setSelected(i); 
                }}
                className={`rounded-full text-cream text-base py-3 w-96 m-2 hover:bg-dark_green
                    ${selected === i ? 'bg-dark_green' : 'bg-green'}`
                }
            >
                {data[index][key]}
            </button>
        ));

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
            </div>

            <div className='text-base p-2'>
                <h3>Selected Options:</h3>
                <ul>
                    {preferences.map((option, i) => (
                        <li key={i}>{option}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Quiz;