import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button, Spinner, Clipboard, Textarea } from 'flowbite-react';
import { useDispatch } from 'react-redux';
import { loadData } from '../../app/user/userDataSlice';
import axios from 'axios';
const apiUrlA = import.meta.env.VITE_API_BASE_URL;

import { parseResponse } from '../../util/parseresponse';

const ChatComponent = () => {
    const [input, setInput] = useState('');
    const [response, setResponse] = useState(localStorage.getItem('response') || '');
    const [loading, setLoading] = useState(false);
    const [combineString, setCombineString] = useState('');

    const dispatch = useDispatch();

    const codeBlockStyle = {
        backgroundColor: '#282c34',
        borderRadius: '10px',
        padding: '15px',
        overflow: 'auto',
        color: '#abb2bf',
        fontFamily: 'Consolas, monospace',
        fontSize: '12px',
        lineHeight: '1.4',
        textShadow: 'none',
    };

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const fetchData = async () => {
        setLoading(true);

        try {
            const response = await axios.post(`${apiUrlA}/askai`, { input }, {
                headers: { 'Content-Type': 'application/json' },
            });

            setResponse(response.data);
            localStorage.setItem('response', response.data); // Save response to localStorage to prevent data deletion from page refresh
        } catch (error) {
            console.error('Error fetching data:', error);
            setResponse('Error fetching data. Please try again.');
        } finally {
            setLoading(false);
            setInput('');
        }
    };

    // Save response to localStorage every time it changes
    useEffect(() => {
        if (response && response.trim() !== '') {
            localStorage.setItem('response', response);
        }
        dispatch(loadData(response));
    }, [response]);

    return (
        <div className="flex flex-col flex-1 bg-white p-4 rounded-lg lg:h-screen sm:h-auto sm:w-auto overflow-x-auto overflow-y-auto ml-10 mr-10">
            <div className='flex items-center rounded-md p-5'>
                <textarea
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Type your question here."
                    className='flex-1 p-2 bg-gray-200 rounded-xl font-normal from-neutral-700 border-none resize-none outline-none'
                    rows={1}
                    style={{ minHeight: '40px', overflow: 'hidden' }}
                    onInput={(e) => {
                        e.target.style.height = 'auto';  // Reset the height
                        e.target.style.height = `${e.target.scrollHeight}px`;  // Set new height based on scroll height
                    }}
                />
                <button
                    color="light"
                    onClick={fetchData}
                    disabled={loading}
                    className="text-neutral-600 ml-2 rounded-xl p-2 bg-gray-200 hover:text-neutral-900 text-base"
                    pill
                >
                    {loading ? <span className="loading loading-dots loading-lg bg-slate-950"></span> : 'Get Response'}
                </button>
            </div>

            <div className='mt-4 mb-4 p-4 flex flex-col font-light text-neutral-900 mr-5 ml-5 rounded-xl'>
                {parseResponse(response)}
            </div>
        </div>
    );
};

export default ChatComponent;
