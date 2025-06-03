



// import React, { useState } from 'react';

// const EssayGenerator = () => {
//     // Essay-specific state
//     const [title, setTitle] = useState('');
//     const [purpose, setPurpose] = useState('');
//     const [targetAudience, setTargetAudience] = useState('');
//     const [structure, setStructure] = useState('');
//     const [keyPoints, setKeyPoints] = useState('');
//     const [wordCount, setWordCount] = useState(1000);
//     const [citationStyle, setCitationStyle] = useState('APA');
//     const [tone, setTone] = useState('formal-academic');
//     const [personalOpinion, setPersonalOpinion] = useState('');
//     const [additionalInstructions, setAdditionalInstructions] = useState('');
    
//     // Processing state
//     const [response, setResponse] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [humanizing, setHumanizing] = useState(false);
//     const [progress, setProgress] = useState(0);
//     const [currentChunk, setCurrentChunk] = useState(0);
//     const [totalChunks, setTotalChunks] = useState(0);
//     const [accumulatedText, setAccumulatedText] = useState('');
//     const [isPaused, setIsPaused] = useState(false);
//     const [currentStatus, setCurrentStatus] = useState('');

//     // API configuration
//     const apiUrlE = import.meta.env.VITE_API_BASE_URL;
//     const endpoint = `${apiUrlE}/rewrite`;

//     // API call function
//     const callAPI = async (prompt) => {
//         try {
//             if (!apiUrlE) {
//                 throw new Error('API URL is not configured');
//             }

//             const response = await fetch(endpoint, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     input: prompt,
//                     action: "Write a humanized, 100% unique content that is undetectable by AI"
//                 })
//             });

//             if (!response.ok) {
//                 if (response.status === 404) {
//                     throw new Error(`API endpoint not found: ${endpoint}`);
//                 } else if (response.status === 500) {
//                     throw new Error('Server error. Please try again later.');
//                 } else if (response.status === 429) {
//                     throw new Error('Rate limit exceeded. Please wait before trying again.');
//                 } else {
//                     throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//                 }
//             }

//             const data = await response.json();
//             return data.text || data.modifiedText || data.response || data.content || '';

//         } catch (error) {
//             console.error('Error in API call:', error);
//             setCurrentStatus(`Error: ${error.message}`);
//             throw error;
//         }
//     };

//     // Configuration options
//     const wordCountOptions = [
//         { id: 500, label: '500 words' },
//         { id: 750, label: '750 words' },
//         { id: 1000, label: '1000 words' },
//         { id: 1500, label: '1500 words' },
//         { id: 2000, label: '2000 words' },
//         { id: 2500, label: '2500 words' },
//         { id: 3000, label: '3000 words' }
//     ];

//     const citationStyles = [
//         { id: 'APA', label: 'APA' },
//         { id: 'MLA', label: 'MLA' },
//         { id: 'Chicago', label: 'Chicago' },
//         { id: 'Harvard', label: 'Harvard' }
//     ];

//     const toneOptions = [
//         { id: 'formal-academic', label: 'Formal Academic' },
//         { id: 'analytical', label: 'Analytical' },
//         { id: 'argumentative', label: 'Argumentative' },
//         { id: 'descriptive', label: 'Descriptive' },
//         { id: 'comparative', label: 'Comparative' }
//     ];

//     // Calculate chunks based on word count
//     const calculateChunks = (wordCount) => {
//         const wordsPerChunk = 300;
//         return Math.ceil(wordCount / wordsPerChunk);
//     };

//     // Prepare essay prompt
//     const prepareEssayPrompt = (chunkNumber, totalChunks) => {
//         const basePrompt = `You are an expert academic and editorial writer.
// Write an academic essay based on the details below. Follow all instructions precisely.
// ---
// 📌 Title / Topic:
// "${title}"
// 🎯 Purpose / Intent:
// ${purpose}
// 🎯 Target Audience:
// ${targetAudience}
// 🏗 Structure Requirements:
// ${structure}
// 📚 Key Points to Include:
// ${keyPoints}
// 📌 Word Count:
// ${Math.floor(wordCount / totalChunks)} words (This is part ${chunkNumber} of ${totalChunks})
// 🧾 Citation Style:
// ${citationStyle} (in-text citation only, without a bibliography)
// 🗣 Tone:
// ${tone}
// ✏️ Personal Opinion:
// ${personalOpinion}
// 📝 Additional Instructions:
// ${additionalInstructions}
// ---
// 🎯 Output Guidelines:
// - Make the writing 100% original and human-like
// - Vary sentence structures and use transitions naturally
// - Use high-quality vocabulary appropriate to the audience
// - Do **not** hallucinate facts; only include what is typical/common or user-provided
// - Maintain logical structure and clear flow
// - Use clear paragraphing and formatting
// 📌 IMPORTANT:
// Do not include placeholders like [insert here]. Produce a final, polished piece.
// ${chunkNumber === 1 ? 'Begin with the introduction and first body paragraph.' : 
//   chunkNumber === totalChunks ? 'Continue from previous content and conclude the essay.' : 
//   'Continue from previous content with the next section.'}`;

//         if (chunkNumber > 1) {
//             return `${basePrompt}\n\nPrevious content context:\n${accumulatedText.slice(-500)}...`;
//         }
        
//         return basePrompt;
//     };

//     // Process chunks
//     const processChunk = async (chunkNum, totalChunks) => {
//         try {
//             setCurrentStatus(`Processing chunk ${chunkNum}/${totalChunks}...`);
//             const prompt = prepareEssayPrompt(chunkNum, totalChunks);
            
//             const chunkText = await callAPI(prompt);

//             setAccumulatedText(prev => {
//                 const newText = prev + (prev ? '\n\n' : '') + chunkText;
//                 setResponse(newText);
//                 return newText;
//             });

//             setProgress(Math.round((chunkNum / totalChunks) * 100));
//             setCurrentChunk(chunkNum);
            
//             return chunkText;
//         } catch (error) {
//             console.error(`Error processing chunk ${chunkNum}:`, error);
//             throw error;
//         }
//     };

//     // Main generation function
//     const generateEssay = async () => {
//         if (!title.trim() || !purpose.trim()) {
//             alert('Please fill in at least the title and purpose fields.');
//             return;
//         }

//         setLoading(true);
//         setProgress(0);
//         setCurrentChunk(0);
//         setAccumulatedText('');
//         setResponse('');
//         setIsPaused(false);
//         setCurrentStatus('Initializing...');

//         const chunks = calculateChunks(wordCount);
//         setTotalChunks(chunks);

//         try {
//             for (let i = 1; i <= chunks; i++) {
//                 // Check for pause
//                 while (isPaused) {
//                     setCurrentStatus('Paused...');
//                     await new Promise(resolve => setTimeout(resolve, 1000));
//                 }

//                 await processChunk(i, chunks);
                
//                 // Add delay between chunks
//                 if (i < chunks) {
//                     setCurrentStatus('Brief pause between chunks...');
//                     await new Promise(resolve => setTimeout(resolve, 1000));
//                 }
//             }
            
//             setCurrentStatus('Essay generation completed!');
//         } catch (error) {
//             console.error('Error generating essay:', error);
//             setResponse('Error generating essay. Please try again.');
//             setCurrentStatus(`Error: ${error.message}`);
//         } finally {
//             setLoading(false);
//             setProgress(100);
//         }
//     };

//     // Humanize entire content
//     const humanizeContent = async () => {
//         if (!response.trim()) {
//             alert('No content to humanize. Please generate an essay first.');
//             return;
//         }

//         setHumanizing(true);
//         setCurrentStatus('Humanizing entire content...');
//         setProgress(0);

//         try {
//             const sections = response.split(/(?=##? )|(?=\n\n)/).filter(section => section.trim());
//             let humanizedContent = '';
            
//             for (let i = 0; i < sections.length; i++) {
//                 if (sections[i].trim()) {
//                     setCurrentStatus(`Humanizing section ${i + 1}/${sections.length}...`);
//                     setProgress(Math.round((i / sections.length) * 100));
                    
//                     const cleanedContent = await callAPI(sections[i].trim());
//                     humanizedContent += (humanizedContent ? '\n\n' : '') + cleanedContent;
                    
//                     if (i < sections.length - 1) {
//                         await new Promise(resolve => setTimeout(resolve, 800));
//                     }
//                 }
//             }
            
//             setResponse(humanizedContent);
//             setAccumulatedText(humanizedContent);
//             setCurrentStatus('Content humanization completed!');
//             setProgress(100);
            
//         } catch (error) {
//             console.error('Error humanizing content:', error);
//             setCurrentStatus(`Humanization error: ${error.message}`);
//         } finally {
//             setHumanizing(false);
//             setTimeout(() => setProgress(0), 2000);
//         }
//     };

//     // Pause/Resume functionality
//     const togglePause = () => {
//         setIsPaused(!isPaused);
//     };

//     // Convert markdown-like formatting to JSX
//     const renderContent = (text) => {
//         if (!text) return null;
        
//         const lines = text.split('\n');
//         const elements = [];
        
//         for (let i = 0; i < lines.length; i++) {
//             const line = lines[i];
            
//             if (line.startsWith('# ')) {
//                 elements.push(<h1 key={i} className="text-3xl font-bold mb-4 text-gray-800">{line.substring(2)}</h1>);
//             } else if (line.startsWith('## ')) {
//                 elements.push(<h2 key={i} className="text-2xl font-semibold mb-3 mt-6 text-gray-700">{line.substring(3)}</h2>);
//             } else if (line.startsWith('### ')) {
//                 elements.push(<h3 key={i} className="text-xl font-medium mb-2 mt-4 text-gray-600">{line.substring(4)}</h3>);
//             } else if (line.trim() === '') {
//                 continue;
//             } else {
//                 elements.push(<p key={i} className="mb-4 text-gray-900 leading-relaxed">{line}</p>);
//             }
//         }
        
//         return elements;
//     };

//     return (
//         <div className="flex flex-col flex-1 bg-white p-4 rounded-lg lg:h-screen sm:h-auto sm:w-auto overflow-x-auto overflow-y-auto ml-10 mr-10">
//             {/* Header */}
//             <div className="flex mb-4 border-b">
//                 <div className="py-2 px-4 border-b-2 border-blue-500 text-blue-500 font-medium">
//                     Academic Essay Generator
//                 </div>
//                 {!apiUrlE && (
//                     <div className="ml-auto py-2 px-4 bg-red-100 text-red-800 text-sm rounded">
//                         API URL not configured - Check .env file
//                     </div>
//                 )}
//             </div>
            
//             {/* Status indicator */}
//             {currentStatus && (
//                 <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
//                     <p className="text-sm text-blue-700">{currentStatus}</p>
//                 </div>
//             )}
            
//             {/* Input Form */}
//             <div className='flex flex-col items-center rounded-md p-5'>
//                 <div className="w-full mb-4 space-y-4">
//                     {/* Title */}
//                     <div>
//                         <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-700">
//                             📌 Title / Topic *
//                         </label>
//                         <input
//                             type="text"
//                             id="title"
//                             value={title}
//                             onChange={(e) => setTitle(e.target.value)}
//                             placeholder="Enter your essay title or topic"
//                             className="bg-gray-200 border-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
//                         />
//                     </div>

//                     {/* Purpose */}
//                     <div>
//                         <label htmlFor="purpose" className="block mb-2 text-sm font-medium text-gray-700">
//                             🎯 Purpose / Intent *
//                         </label>
//                         <input
//                             type="text"
//                             id="purpose"
//                             value={purpose}
//                             onChange={(e) => setPurpose(e.target.value)}
//                             placeholder="e.g., To critically analyze, To compare and contrast, To argue..."
//                             className="bg-gray-200 border-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
//                         />
//                     </div>

//                     {/* Target Audience */}
//                     <div>
//                         <label htmlFor="audience" className="block mb-2 text-sm font-medium text-gray-700">
//                             🎯 Target Audience
//                         </label>
//                         <input
//                             type="text"
//                             id="audience"
//                             value={targetAudience}
//                             onChange={(e) => setTargetAudience(e.target.value)}
//                             placeholder="e.g., University-level academic readers, High school students..."
//                             className="bg-gray-200 border-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
//                         />
//                     </div>

//                     {/* Structure */}
//                     <div>
//                         <label htmlFor="structure" className="block mb-2 text-sm font-medium text-gray-700">
//                             🏗 Structure Requirements
//                         </label>
//                         <input
//                             type="text"
//                             id="structure"
//                             value={structure}
//                             onChange={(e) => setStructure(e.target.value)}
//                             placeholder="e.g., Standard 5-paragraph essay, 4-paragraph argumentative essay..."
//                             className="bg-gray-200 border-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
//                         />
//                     </div>

//                     {/* Key Points */}
//                     <div>
//                         <label htmlFor="key-points" className="block mb-2 text-sm font-medium text-gray-700">
//                             📚 Key Points to Include
//                         </label>
//                         <textarea
//                             id="key-points"
//                             value={keyPoints}
//                             onChange={(e) => setKeyPoints(e.target.value)}
//                             placeholder="Enter key points separated by lines or bullet points"
//                             rows={3}
//                             className="bg-gray-200 border-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
//                         />
//                     </div>

//                     {/* Configuration Grid */}
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//                         {/* Word Count */}
//                         <div>
//                             <label htmlFor="word-count" className="block mb-2 text-sm font-medium text-gray-700">
//                                 📌 Word Count
//                             </label>
//                             <select
//                                 id="word-count"
//                                 value={wordCount}
//                                 onChange={(e) => setWordCount(Number(e.target.value))}
//                                 className="bg-gray-200 border-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
//                             >
//                                 {wordCountOptions.map((option) => (
//                                     <option key={option.id} value={option.id}>
//                                         {option.label}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>

//                         {/* Citation Style */}
//                         <div>
//                             <label htmlFor="citation" className="block mb-2 text-sm font-medium text-gray-700">
//                                 🧾 Citation Style
//                             </label>
//                             <select
//                                 id="citation"
//                                 value={citationStyle}
//                                 onChange={(e) => setCitationStyle(e.target.value)}
//                                 className="bg-gray-200 border-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
//                             >
//                                 {citationStyles.map((style) => (
//                                     <option key={style.id} value={style.id}>
//                                         {style.label}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>

//                         {/* Tone */}
//                         <div>
//                             <label htmlFor="tone" className="block mb-2 text-sm font-medium text-gray-700">
//                                 🗣 Tone
//                             </label>
//                             <select
//                                 id="tone"
//                                 value={tone}
//                                 onChange={(e) => setTone(e.target.value)}
//                                 className="bg-gray-200 border-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
//                             >
//                                 {toneOptions.map((toneOption) => (
//                                     <option key={toneOption.id} value={toneOption.id}>
//                                         {toneOption.label}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                     </div>

//                     {/* Personal Opinion */}
//                     <div>
//                         <label htmlFor="opinion" className="block mb-2 text-sm font-medium text-gray-700">
//                             ✏️ Personal Opinion
//                         </label>
//                         <textarea
//                             id="opinion"
//                             value={personalOpinion}
//                             onChange={(e) => setPersonalOpinion(e.target.value)}
//                             placeholder="Include your personal stance or opinion on the topic"
//                             rows={2}
//                             className="bg-gray-200 border-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
//                         />
//                     </div>

//                     {/* Additional Instructions */}
//                     <div>
//                         <label htmlFor="instructions" className="block mb-2 text-sm font-medium text-gray-700">
//                             📝 Additional Instructions
//                         </label>
//                         <textarea
//                             id="instructions"
//                             value={additionalInstructions}
//                             onChange={(e) => setAdditionalInstructions(e.target.value)}
//                             placeholder="Any additional requirements or special instructions"
//                             rows={2}
//                             className="bg-gray-200 border-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
//                         />
//                     </div>
//                 </div>
                
//                 {/* Progress Bar */}
//                 {(loading || humanizing) && (
//                     <div className="w-full mb-4">
//                         <div className="flex justify-between text-sm text-gray-600 mb-1">
//                             <span>{currentStatus}</span>
//                             <span>{progress}%</span>
//                         </div>
//                         <div className="w-full bg-gray-200 rounded-full h-2">
//                             <div 
//                                 className={`h-2 rounded-full transition-all duration-300 ${humanizing ? 'bg-green-500' : 'bg-blue-500'}`}
//                                 style={{ width: `${progress}%` }}
//                             ></div>
//                         </div>
//                         {isPaused && (
//                             <div className="text-yellow-600 text-sm mt-1">⏸️ Processing paused</div>
//                         )}
//                     </div>
//                 )}

//                 {/* Generate Button */}
//                 <div className="flex gap-2 w-full">
//                     <button
//                         onClick={generateEssay}
//                         disabled={loading || humanizing || !apiUrlE}
//                         className="text-neutral-600 flex-1 rounded-xl p-3 bg-gray-200 hover:text-neutral-900 hover:bg-gray-300 text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                         {loading ? 
//                             `Generating Essay... (${progress}%)` : 
//                             `Generate Academic Essay (${wordCount} words, ${tone})`
//                         }
//                     </button>
                    
//                     {loading && (
//                         <button
//                             onClick={togglePause}
//                             className="px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl transition-colors"
//                         >
//                             {isPaused ? '▶️' : '⏸️'}
//                         </button>
//                     )}
//                 </div>

//                 {/* Humanize Button */}
//                 {response && !loading && (
//                     <div className="w-full mt-3">
//                         <button
//                             onClick={humanizeContent}
//                             disabled={humanizing || !apiUrlE}
//                             className="w-full text-white rounded-xl p-3 bg-green-500 hover:bg-green-600 text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                             {humanizing ? 'Humanizing Content...' : '🧑‍💼 Humanize Entire Content'}
//                         </button>
//                         <p className="text-sm text-gray-600 mt-1 text-center">
//                             Add personal touch and natural language patterns to make content 100% authentic
//                         </p>
//                     </div>
//                 )}
//             </div>

//             {/* Response Area */}
//             <div className='mt-4 mb-4 p-6 flex flex-col font-light text-neutral-900 mr-5 ml-5 rounded-xl bg-gray-50 border'>
//                 {response ? (
//                     <div className="prose max-w-none">
//                         {renderContent(response)}
//                     </div>
//                 ) : (
//                     <div className="text-gray-500 text-center py-8">
//                         <div className="text-lg mb-2">📝 Ready to Generate</div>
//                         <p>Fill in the essay requirements above and click "Generate Academic Essay" to begin.</p>
//                         <p className="text-sm mt-2">
//                             {apiUrlE ? 
//                                 'Content will automatically be humanized during generation for authenticity.' :
//                                 'Please configure VITE_API_BASE_URL in your .env file to enable API functionality.'
//                             }
//                         </p>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default EssayGenerator;






























import React, { useState } from 'react';
import { Copy, Check, Trash2 } from 'lucide-react';

const EssayGenerator = () => {
    // Essay-specific state
    const [title, setTitle] = useState('');
    const [purpose, setPurpose] = useState('');
    const [targetAudience, setTargetAudience] = useState('');
    const [structure, setStructure] = useState('');
    const [keyPoints, setKeyPoints] = useState('');
    const [wordCount, setWordCount] = useState(1000);
    const [citationStyle, setCitationStyle] = useState('APA');
    const [tone, setTone] = useState('formal-academic');
    const [personalOpinion, setPersonalOpinion] = useState('');
    const [additionalInstructions, setAdditionalInstructions] = useState('');
    
    // Processing state
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [humanizing, setHumanizing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentChunk, setCurrentChunk] = useState(0);
    const [totalChunks, setTotalChunks] = useState(0);
    const [accumulatedText, setAccumulatedText] = useState('');
    const [isPaused, setIsPaused] = useState(false);
    const [currentStatus, setCurrentStatus] = useState('');
    const [copied, setCopied] = useState(false);

    // API configuration
    const apiUrlE = import.meta.env.VITE_API_BASE_URL;
    const endpoint = `${apiUrlE}/rewrite`;

    // Enhanced API call with better error handling and delays
    const callAPI = async (prompt) => {
        const maxRetries = 3;
        const baseDelay = 2000; // 2 seconds base delay
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                if (!apiUrlE) {
                    throw new Error('API URL is not configured');
                }

                // Add delay before each API call to prevent exhaustion
                if (attempt > 1) {
                    setCurrentStatus(`Retrying... (attempt ${attempt}/${maxRetries})`);
                    await new Promise(resolve => setTimeout(resolve, baseDelay * attempt));
                }

                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        input: prompt,
                        action: "Generate content that mimics authentic human writing, including personal insights, minor flaws, and varied sentence structures."
                    })
                });

                if (!response.ok) {
                    if (response.status === 429) {
                        // Rate limit - wait longer
                        await new Promise(resolve => setTimeout(resolve, baseDelay * 2));
                        continue;
                    }
                    throw new Error(getErrorMessage(response.status, response.statusText));
                }

                const data = await response.json();
                const result = data.text || data.modifiedText || data.response || data.content || '';
                
                // Add delay after successful call to prevent API exhaustion
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                return result;

            } catch (error) {
                console.error(`API call attempt ${attempt} failed:`, error);
                
                if (attempt === maxRetries) {
                    setCurrentStatus(`Error after ${maxRetries} attempts: ${error.message}`);
                    throw error;
                }
                
                // Wait before retry
                await new Promise(resolve => setTimeout(resolve, baseDelay * attempt));
            }
        }
    };

    // Helper function for error messages
    const getErrorMessage = (status, statusText) => {
        const errorMessages = {
            404: `API endpoint not found: ${endpoint}`,
            500: 'Server error. Please try again later.',
            429: 'Rate limit exceeded. Please wait before trying again.',
        };
        return errorMessages[status] || `HTTP ${status}: ${statusText}`;
    };

    // Clean text from ChatGPT-like responses and markup
    const cleanText = (text) => {
        if (!text) return '';
        
        // Remove ChatGPT-like intro phrases and meta commentary
        const cleanPatterns = [
            /^(Okay,|Alright,|Sure,|I'll|Let me|Here's|This is).+?(?=\n\n|\. [A-Z])/gim,
            /I'm going to attempt.+?(?=\n\n|\. [A-Z])/gim,
            /This is a tough challenge.+?(?=\n\n|\. [A-Z])/gim,
            /I'll focus on.+?(?=\n\n|\. [A-Z])/gim,
            /### .+?\n/g, // Remove markdown headers that are meta commentary
            /^.+?sidesteps typical AI detection.+?(?=\n\n)/gim,
            /^.+?feels authentically human.+?(?=\n\n)/gim,
        ];

        let cleaned = text;
        cleanPatterns.forEach(pattern => {
            cleaned = cleaned.replace(pattern, '');
        });

        // Preserve markup formatting
        cleaned = cleaned.trim();
        return cleaned;
    };

    // Configuration options (unchanged)
    const wordCountOptions = [
        { id: 500, label: '500 words' },
        { id: 750, label: '750 words' },
        { id: 1000, label: '1000 words' },
        { id: 1500, label: '1500 words' },
        { id: 2000, label: '2000 words' },
        { id: 2500, label: '2500 words' },
        { id: 3000, label: '3000 words' }
    ];

    const citationStyles = [
        { id: 'APA', label: 'APA' },
        { id: 'MLA', label: 'MLA' },
        { id: 'Chicago', label: 'Chicago' },
        { id: 'Harvard', label: 'Harvard' }
    ];

    const toneOptions = [
        { id: 'formal-academic', label: 'Formal Academic' },
        { id: 'analytical', label: 'Analytical' },
        { id: 'argumentative', label: 'Argumentative' },
        { id: 'descriptive', label: 'Descriptive' },
        { id: 'comparative', label: 'Comparative' }
    ];

    // Calculate chunks based on word count
    const calculateChunks = (wordCount) => {
        const wordsPerChunk = 350; // Slightly larger chunks for better API efficiency
        return Math.ceil(wordCount / wordsPerChunk);
    };

    // Prepare essay prompt (unchanged logic)
    const prepareEssayPrompt = (chunkNumber, totalChunks) => {
        const basePrompt = `You are an expert academic and editorial writer.
Write an academic essay based on the details below. Follow all instructions precisely.
---
📌 Title / Topic:
"${title}"
🎯 Purpose / Intent:
${purpose}
🎯 Target Audience:
${targetAudience}
🏗 Structure Requirements:
${structure}
📚 Key Points to Include:
${keyPoints}
📌 Word Count:
${Math.floor(wordCount / totalChunks)} words (This is part ${chunkNumber} of ${totalChunks})
🧾 Citation Style:
${citationStyle} (in-text citation only, without a bibliography)
🗣 Tone:
${tone}
✏️ Personal Opinion:
${personalOpinion}
📝 Additional Instructions:
${additionalInstructions}
---
🎯 Output Guidelines:
- Make the writing 100% original and human-like
-Produce content that feels spontaneous and real, as if someone were thinking out loud or journaling privately.
- Vary sentence structures and use transitions naturally
- Use high-quality vocabulary appropriate to the audience
- Do **not** hallucinate facts; only include what is typical/common or user-provided
- Maintain logical structure and clear flow
- Use clear paragraphing and formatting
📌 IMPORTANT:
Do not include placeholders like [insert here]. Produce a final, polished piece.
${chunkNumber === 1 ? 'Begin with the introduction and first body paragraph.' : 
  chunkNumber === totalChunks ? 'Continue from previous content and conclude the essay.' : 
  'Continue from previous content with the next section.'}`;

        if (chunkNumber > 1) {
            return `${basePrompt}\n\nPrevious content context:\n${accumulatedText.slice(-500)}...`;
        }
        
        return basePrompt;
    };

    // Process chunks with better API handling
    const processChunk = async (chunkNum, totalChunks) => {
        try {
            setCurrentStatus(`Processing chunk ${chunkNum}/${totalChunks}...`);
            const prompt = prepareEssayPrompt(chunkNum, totalChunks);
            
            const chunkText = await callAPI(prompt);
            const cleanedChunk = cleanText(chunkText);

            setAccumulatedText(prev => {
                const newText = prev + (prev ? '\n\n' : '') + cleanedChunk;
                setResponse(newText);
                return newText;
            });

            setProgress(Math.round((chunkNum / totalChunks) * 100));
            setCurrentChunk(chunkNum);
            
            return cleanedChunk;
        } catch (error) {
            console.error(`Error processing chunk ${chunkNum}:`, error);
            throw error;
        }
    };

    // Main generation function (improved with better error handling)
    const generateEssay = async () => {
        if (!title.trim() || !purpose.trim()) {
            alert('Please fill in at least the title and purpose fields.');
            return;
        }

        setLoading(true);
        setProgress(0);
        setCurrentChunk(0);
        setAccumulatedText('');
        setResponse('');
        setIsPaused(false);
        setCurrentStatus('Initializing...');

        const chunks = calculateChunks(wordCount);
        setTotalChunks(chunks);

        try {
            for (let i = 1; i <= chunks; i++) {
                // Check for pause
                while (isPaused) {
                    setCurrentStatus('Paused...');
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }

                await processChunk(i, chunks);
                
                // Add longer delay between chunks to prevent API exhaustion
                if (i < chunks) {
                    setCurrentStatus('Resting between chunks...');
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
            }
            
            setCurrentStatus('Essay generation completed!');
        } catch (error) {
            console.error('Error generating essay:', error);
            setResponse('Error generating essay. Please try again.');
            setCurrentStatus(`Error: ${error.message}`);
        } finally {
            setLoading(false);
            setProgress(100);
        }
    };

    // Enhanced humanize content function - paragraph by paragraph
    const humanizeContent = async () => {
        if (!response.trim()) {
            alert('No content to humanize. Please generate an essay first.');
            return;
        }

        setHumanizing(true);
        setCurrentStatus('Humanizing content paragraph by paragraph...');
        setProgress(0);

        try {
            // Split content into paragraphs while preserving intent structure
            const paragraphs = response.split(/\n\n+/).filter(para => para.trim().length > 20);
            let humanizedContent = '';
            
            for (let i = 0; i < paragraphs.length; i++) {
                const paragraph = paragraphs[i].trim();
                if (paragraph) {
                    setCurrentStatus(`Humanizing paragraph ${i + 1}/${paragraphs.length}...`);
                    setProgress(Math.round((i / paragraphs.length) * 100));
                    
                    // Enhanced humanization prompt to preserve intent
                    const humanizePrompt = `Rewrite this paragraph to sound more natural and human while keeping the EXACT same meaning and intent. Make it sound conversational but maintain academic substance. Keep all key points and arguments intact:

"${paragraph}"

Requirements:
- Keep the same core message and intent
- Use simpler, more natural language
- Maintain paragraph structure and flow
- Preserve any important academic concepts
- Make it sound like natural human writing`;
                    
                    const humanizedParagraph = await callAPI(humanizePrompt);
                    const cleanedParagraph = cleanText(humanizedParagraph);
                    humanizedContent += (humanizedContent ? '\n\n' : '') + cleanedParagraph;
                    
                    // Update response in real-time so user can see progress
                    setResponse(humanizedContent + (i < paragraphs.length - 1 ? '\n\n[Processing remaining paragraphs...]' : ''));
                    
                    // Longer delay between humanization calls
                    if (i < paragraphs.length - 1) {
                        await new Promise(resolve => setTimeout(resolve, 2500));
                    }
                }
            }
            
            setResponse(humanizedContent);
            setAccumulatedText(humanizedContent);
            setCurrentStatus('Paragraph-by-paragraph humanization completed!');
            setProgress(100);
            
        } catch (error) {
            console.error('Error humanizing content:', error);
            setCurrentStatus(`Humanization error: ${error.message}`);
        } finally {
            setHumanizing(false);
            setTimeout(() => setProgress(0), 2000);
        }
    };

    // Copy functionality
    const copyToClipboard = async () => {
        try {
            // Create a clean text version without HTML tags
            const textToCopy = response.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, '');
            await navigator.clipboard.writeText(textToCopy);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    // Clear functionality
    const clearContent = () => {
        setResponse('');
        setAccumulatedText('');
        setProgress(0);
        setCurrentStatus('');
    };

    // Pause/Resume functionality (unchanged)
    const togglePause = () => {
        setIsPaused(!isPaused);
    };

    // Enhanced content rendering with rich text formatting
    const renderContent = (text) => {
        if (!text) return null;
        
        // Convert markdown-style formatting to HTML
        let processedText = text
            // Bold text
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            // Italic text
            .replace(/\*([^*]+)\*/g, '<em>$1</em>')
            // Code blocks
            .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>')
            // Headers
            .replace(/^### (.+)$/gm, '<h3 class="text-xl font-semibold mb-3 mt-6 text-gray-800">$1</h3>')
            .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold mb-4 mt-8 text-gray-800">$1</h2>')
            .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold mb-6 mt-8 text-gray-900">$1</h1>')
            // Blockquotes
            .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 italic my-4">$1</blockquote>');

        // Split into paragraphs and render
        const lines = processedText.split('\n');
        const elements = [];
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            if (line === '') {
                continue;
            } else if (line.includes('<h1') || line.includes('<h2') || line.includes('<h3') || line.includes('<blockquote')) {
                // Render HTML elements directly
                elements.push(
                    <div key={i} dangerouslySetInnerHTML={{ __html: line }} />
                );
            } else {
                // Regular paragraphs with rich text formatting
                elements.push(
                    <p key={i} className="mb-4 text-gray-900 leading-relaxed text-justify" 
                       dangerouslySetInnerHTML={{ __html: line }} />
                );
            }
        }
        
        return elements;
    };

    return (
        <div className="flex flex-col flex-1 bg-white p-4 rounded-lg lg:h-screen sm:h-auto sm:w-auto overflow-x-auto overflow-y-auto ml-10 mr-10">
            {/* Header */}
            <div className="flex mb-4 border-b">
                <div className="py-2 px-4 border-b-2 border-blue-500 text-blue-500 font-medium">
                    Academic Essay Generator
                </div>
                {!apiUrlE && (
                    <div className="ml-auto py-2 px-4 bg-red-100 text-red-800 text-sm rounded">
                        API URL not configured - Check .env file
                    </div>
                )}
            </div>
            
            {/* Status indicator */}
            {currentStatus && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700">{currentStatus}</p>
                </div>
            )}
            
            {/* Input Form */}
            <div className='flex flex-col items-center rounded-md p-5'>
                <div className="w-full mb-4 space-y-4">
                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-700">
                            📌 Title / Topic *
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter your essay title or topic"
                            className="bg-gray-200 border-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        />
                    </div>

                    {/* Purpose */}
                    <div>
                        <label htmlFor="purpose" className="block mb-2 text-sm font-medium text-gray-700">
                            🎯 Purpose / Intent *
                        </label>
                        <input
                            type="text"
                            id="purpose"
                            value={purpose}
                            onChange={(e) => setPurpose(e.target.value)}
                            placeholder="e.g., To critically analyze, To compare and contrast, To argue..."
                            className="bg-gray-200 border-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        />
                    </div>

                    {/* Target Audience */}
                    <div>
                        <label htmlFor="audience" className="block mb-2 text-sm font-medium text-gray-700">
                            🎯 Target Audience
                        </label>
                        <input
                            type="text"
                            id="audience"
                            value={targetAudience}
                            onChange={(e) => setTargetAudience(e.target.value)}
                            placeholder="e.g., University-level academic readers, High school students..."
                            className="bg-gray-200 border-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        />
                    </div>

                    {/* Structure */}
                    <div>
                        <label htmlFor="structure" className="block mb-2 text-sm font-medium text-gray-700">
                            🏗 Structure Requirements
                        </label>
                        <input
                            type="text"
                            id="structure"
                            value={structure}
                            onChange={(e) => setStructure(e.target.value)}
                            placeholder="e.g., Standard 5-paragraph essay, 4-paragraph argumentative essay..."
                            className="bg-gray-200 border-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        />
                    </div>

                    {/* Key Points */}
                    <div>
                        <label htmlFor="key-points" className="block mb-2 text-sm font-medium text-gray-700">
                            📚 Key Points to Include
                        </label>
                        <textarea
                            id="key-points"
                            value={keyPoints}
                            onChange={(e) => setKeyPoints(e.target.value)}
                            placeholder="Enter key points separated by lines or bullet points"
                            rows={3}
                            className="bg-gray-200 border-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        />
                    </div>

                    {/* Configuration Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {/* Word Count */}
                        <div>
                            <label htmlFor="word-count" className="block mb-2 text-sm font-medium text-gray-700">
                                📌 Word Count
                            </label>
                            <select
                                id="word-count"
                                value={wordCount}
                                onChange={(e) => setWordCount(Number(e.target.value))}
                                className="bg-gray-200 border-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            >
                                {wordCountOptions.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Citation Style */}
                        <div>
                            <label htmlFor="citation" className="block mb-2 text-sm font-medium text-gray-700">
                                🧾 Citation Style
                            </label>
                            <select
                                id="citation"
                                value={citationStyle}
                                onChange={(e) => setCitationStyle(e.target.value)}
                                className="bg-gray-200 border-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            >
                                {citationStyles.map((style) => (
                                    <option key={style.id} value={style.id}>
                                        {style.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Tone */}
                        <div>
                            <label htmlFor="tone" className="block mb-2 text-sm font-medium text-gray-700">
                                🗣 Tone
                            </label>
                            <select
                                id="tone"
                                value={tone}
                                onChange={(e) => setTone(e.target.value)}
                                className="bg-gray-200 border-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            >
                                {toneOptions.map((toneOption) => (
                                    <option key={toneOption.id} value={toneOption.id}>
                                        {toneOption.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Personal Opinion */}
                    <div>
                        <label htmlFor="opinion" className="block mb-2 text-sm font-medium text-gray-700">
                            ✏️ Personal Opinion
                        </label>
                        <textarea
                            id="opinion"
                            value={personalOpinion}
                            onChange={(e) => setPersonalOpinion(e.target.value)}
                            placeholder="Include your personal stance or opinion on the topic"
                            rows={2}
                            className="bg-gray-200 border-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        />
                    </div>

                    {/* Additional Instructions */}
                    <div>
                        <label htmlFor="instructions" className="block mb-2 text-sm font-medium text-gray-700">
                            📝 Additional Instructions
                        </label>
                        <textarea
                            id="instructions"
                            value={additionalInstructions}
                            onChange={(e) => setAdditionalInstructions(e.target.value)}
                            placeholder="Any additional requirements or special instructions"
                            rows={2}
                            className="bg-gray-200 border-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        />
                    </div>
                </div>
                
                {/* Progress Bar */}
                {(loading || humanizing) && (
                    <div className="w-full mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>{currentStatus}</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                                className={`h-2 rounded-full transition-all duration-300 ${humanizing ? 'bg-green-500' : 'bg-blue-500'}`}
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        {isPaused && (
                            <div className="text-yellow-600 text-sm mt-1">⏸️ Processing paused</div>
                        )}
                    </div>
                )}

                {/* Generate Button */}
                <div className="flex gap-2 w-full">
                    <button
                        onClick={generateEssay}
                        disabled={loading || humanizing || !apiUrlE}
                        className="text-neutral-600 flex-1 rounded-xl p-3 bg-gray-200 hover:text-neutral-900 hover:bg-gray-300 text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 
                            `Generating Essay... (${progress}%)` : 
                            `Generate Academic Essay (${wordCount} words, ${tone})`
                        }
                    </button>
                    
                    {loading && (
                        <button
                            onClick={togglePause}
                            className="px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl transition-colors"
                        >
                            {isPaused ? '▶️' : '⏸️'}
                        </button>
                    )}
                </div>

                {/* Humanize Button */}
                {response && !loading && (
                    <div className="w-full mt-3">
                        <button
                            onClick={humanizeContent}
                            disabled={humanizing || !apiUrlE}
                            className="w-full text-white rounded-xl p-3 bg-green-500 hover:bg-green-600 text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {humanizing ? 'Humanizing Content...' : '🧑‍💼 Humanize Content (Paragraph by Paragraph)'}
                        </button>
                        <p className="text-sm text-gray-600 mt-1 text-center">
                            Transform each paragraph while preserving the original intent and meaning
                        </p>
                    </div>
                )}
            </div>

            {/* Response Area */}
            <div className='mt-4 mb-4 p-6 flex flex-col font-light text-neutral-900 mr-5 ml-5 rounded-xl bg-gray-50 border relative'>
                {/* Action Buttons */}
                {response && (
                    <div className="absolute top-4 right-4 flex gap-2">
                        <button
                            onClick={copyToClipboard}
                            className="p-2 bg-white hover:bg-gray-100 rounded-lg border shadow-sm transition-colors"
                            title="Copy content"
                        >
                            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-600" />}
                        </button>
                        <button
                            onClick={clearContent}
                            className="p-2 bg-white hover:bg-gray-100 rounded-lg border shadow-sm transition-colors"
                            title="Clear content"
                        >
                            <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                    </div>
                )}
                
                {response ? (
                    <div className="prose prose-lg max-w-none">
                        {renderContent(response)}
                    </div>
                ) : (
                    <div className="text-gray-500 text-center py-8">
                        <div className="text-lg mb-2">📝 Ready to Generate</div>
                        <p>Fill in the essay requirements above and click "Generate Academic Essay" to begin.</p>
                        <p className="text-sm mt-2">
                            {apiUrlE ? 
                                'Content will automatically be humanized during generation for authenticity.' :
                                'Please configure VITE_API_BASE_URL in your .env file to enable API functionality.'
                            }
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EssayGenerator;