import React, { useState } from 'react';
import { data } from '../assets/data';
import { useNavigate } from "react-router-dom";
import supabase from "../Components/Supabase/supabaseClient"; //supabase function

const Quiz = () => {
    const [index, setIndex] = useState(0);  
    const [choice, setChoice] = useState(''); // helps pass the current choice into preferences
    const [buttonString, setButtonString] = useState('Next');
    const [selected, setSelected] = useState(null);
    const navigate = useNavigate();
    const [preferences, setPreferences] = useState({
        question1: '',
        question2: '',
        question3: '',
        question4: '',
        question5: null

    }); 

    const next = () => { //handles the next button
        if (choice === '') {
            return;
        }
        setPreferences((prevPreferences) => ({
            ...prevPreferences,
            [`question${index + 1}`]: choice, 
        }));
        if (index === data.length - 1) {
            sendPreferences();
            navigate('/shopping-list')
            return;
        }
        setSelected(null)
        setChoice('');
        if (index === data.length - 2) { 
            setButtonString('Submit');
        }
        setIndex(index + 1);
    };
    const sendPreferences = async () => {
        const response = await fetch('http://127.0.0.1:5000/api/recommended_kit', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(preferences),
        });
        const data = await response.json();
        console.log(data)
    }

    const buttonOption = Object.keys(data[index]) //  makes a button per option in data
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