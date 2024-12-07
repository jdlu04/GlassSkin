import React, {useState} from "react";
import './Quiz.css';
import {data} from '../../assets/data';

const Quiz = () => {

    let [index, setIndex] = useState(0);
    let [selectedOption, setSelectedOption] = useState([]);
    let [preference, setPreference] = useState(null);

    const next = () => {
    if (index === data.length - 1) {
        setIndex(0);
    } else {
        setIndex(index + 1);
    }
    setPreference(null);
    };

    const handleClick = (option) => {
        setSelectedOption((prevOptions) => [...prevOptions, option]);
    };

    const setAnswer = (option) => {
        setPreference(option);
    };
    
    return (
        <div className='h-screen w-screen bg-yellow-50 bg-opacity-75 text-center text-5xl px-10 py-10'> {/* container for all the components in the quiz*/}
            <h1>Glass Skin</h1>
            <hr />
            <div className='text-4xl p-2 text-neutral-500'>{/* container for the question*/}
                <h2>{data[index].question}</h2> 
            </div>
            <div className='flex flex-col w-1/2 space-y-5 p-5 mx-auto'> {/* container for the buttons*/}
                <button
                    className='buttonOption'
                    onClick={() => setAnswer(data[index].option1)}>{data[index].option1}</button>
                <button
                    className='buttonOption'
                    onClick={() => setAnswer(data[index].option2)}>{data[index].option2}</button>
                <button
                    className='buttonOption'
                    onClick={() => setAnswer(data[index].option3)}>{data[index].option3}</button>
                <button
                    className='buttonOption'
                    onClick={() => setAnswer(data[index].option4)}>{data[index].option4}</button>
            </div>
            <button 
                className='buttonNext'
                onClick={() => {handleClick(preference); next()}}> Next</button>
            
            <div className='text-base p-2'>
                <h3>Selected Options:</h3>
                    {selectedOption.map((option, idx) => (
                        <li key={idx}>{option}</li>
                    ))}
            </div>
        </div>
    );
};
export default Quiz;