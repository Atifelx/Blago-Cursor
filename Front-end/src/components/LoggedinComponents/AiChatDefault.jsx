








// // Description: This component is a content generation interface that allows users to create blog posts with various options for content type, length, tone style, and keyword input, plus SEO optimization.

// import React, { useState, useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import { loadData } from '../../app/user/userDataSlice';
// import axios from 'axios';
// import { Copy, Check } from 'lucide-react';

// const apiUrlA = import.meta.env.VITE_API_BASE_URL;

// import { parseResponse } from '../../util/parseresponse';

// const ChatComponent = () => {
//     const [input, setInput] = useState('');
//     const [response, setResponse] = useState('');
//     const [seoOptimizedContent, setSeoOptimizedContent] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [seoLoading, setSeoLoading] = useState(false);
//     const [seoProgress, setSeoProgress] = useState(0);
//     const [contentType, setContentType] = useState('blog-post');
//     const [contentLength, setContentLength] = useState(300);
//     const [toneStyle, setToneStyle] = useState('standard');
//     const [primaryKeyword, setPrimaryKeyword] = useState('');
//     const [secondaryKeyword, setSecondaryKeyword] = useState('');
//     const [showSeoOptimization, setShowSeoOptimization] = useState(false);
//     const [copiedOriginal, setCopiedOriginal] = useState(false);
//     const [copiedSeo, setCopiedSeo] = useState(false);
    
//     const dispatch = useDispatch();

//     const contentTypes = [
//         { id: 'blog-post', label: 'Blog Post' }
//     ];
    
//     const contentLengths = [
//         { id: 100, label: '100 words' },
//         { id: 200, label: '200 words' },
//         { id: 300, label: '300 words' },
//         { id: 500, label: '500 words' },
//         { id: 700, label: '700 words' },
//         { id: 900, label: '900 words' }
//     ];
    
//     const toneStyles = [
//         { id: 'standard', label: 'Standard' },
//         { id: 'active', label: 'Active' },
//         { id: 'storytelling', label: 'Storytelling' },
//         { id: 'professional', label: 'Professional' }
//     ];

//     // Copy functionality
//     const copyToClipboard = async (text, type) => {
//         try {
//             await navigator.clipboard.writeText(text);
//             if (type === 'original') {
//                 setCopiedOriginal(true);
//                 setTimeout(() => setCopiedOriginal(false), 2000);
//             } else {
//                 setCopiedSeo(true);
//                 setTimeout(() => setCopiedSeo(false), 2000);
//             }
//         } catch (err) {
//             console.error('Failed to copy text: ', err);
//             // Fallback for older browsers
//             const textArea = document.createElement('textarea');
//             textArea.value = text;
//             document.body.appendChild(textArea);
//             textArea.select();
//             document.execCommand('copy');
//             document.body.removeChild(textArea);
            
//             if (type === 'original') {
//                 setCopiedOriginal(true);
//                 setTimeout(() => setCopiedOriginal(false), 2000);
//             } else {
//                 setCopiedSeo(true);
//                 setTimeout(() => setCopiedSeo(false), 2000);
//             }
//         }
//     };

//     // Event handlers
//     const handleInputChange = (e) => {
//         setInput(e.target.value);
//     };

//     const handleContentTypeChange = (e) => {
//         setContentType(e.target.value);
//     };
    
//     const handleContentLengthChange = (e) => {
//         setContentLength(Number(e.target.value));
//     };
    
//     const handleToneStyleChange = (e) => {
//         setToneStyle(e.target.value);
//     };

//     const handlePrimaryKeywordChange = (e) => {
//         setPrimaryKeyword(e.target.value);
//     };

//     const handleSecondaryKeywordChange = (e) => {
//         setSecondaryKeyword(e.target.value);
//     };

//     // Content prompt preparation
//     const prepareContentPrompt = (userInput, type, length, tone, primaryKw, secondaryKw) => {
//         const promptPrefix = {
//             'blog-post': 'Craft a detailed and engaging blog post in a relaxed, conversational style—as if you are sharing your thoughts with a curious friend. Let the writing flow naturally with a mix of sentence lengths, a few casual phrases, and occasional imperfections. Include personal reflections, hypothetical situations, or relatable commentary to give the post a human touch. Avoid overly formal language or robotic structure. The final result should feel original, sincere, and indistinguishable from something written entirely by a human.'
//         };
        
//         const toneInstructions = {
//             'standard': 'Use a balanced, neutral tone with a mix of sentence structures.',
//             'active': 'Use active voice, direct statements, and energetic language. Keep it engaging and dynamic.',
//             'storytelling': 'Use narrative techniques, descriptive language, and a conversational flow. Include anecdotes where appropriate.',
//             'professional': 'Use formal language, industry-specific terminology, and structured arguments. Maintain a business-appropriate tone.'
//         };
        
//         const formattingInstructions = 'Use appropriate formatting including bold text for important points, headers for sections, and a compelling title.';
        
//         let keywordInstructions = '';
//         if (primaryKw.trim() || secondaryKw.trim()) {
//             keywordInstructions = `Use "${primaryKw.trim()}" as the primary keyword and "${secondaryKw.trim()}" as the secondary keyword. Incorporate these keywords naturally throughout the content in a way that feels organic and not forced. The primary keyword should appear in the title and first paragraph.`;
//         }
        
//         const humanizationInstructions = `Make the writing style natural, human-generated, and 100% unique - not AI-generated. Include occasional pauses, personal anecdotes, or reflective thoughts as if a human is writing based on personal experience. Use varied sentence structures with occasional imperfections, conversational phrases, and a natural flow that resembles human writing patterns.`;
        
//         return `${promptPrefix[type] || ''} ${userInput}. The content should be approximately ${length} words long. ${toneInstructions[tone]} ${formattingInstructions} ${keywordInstructions} ${humanizationInstructions}`;
//     };

//     // SEO optimization prompt preparation - UPDATED TO GENERATE SAME FORMAT AS ORIGINAL CONTENT
//     const prepareSeoPrompt = (originalContent, topic, primaryKw) => {
//         return `Rewrite and optimize the following content for SEO while maintaining the same conversational, human-like writing style as the original. Follow these requirements:

// 1. **WRITING STYLE**: Keep the same relaxed, conversational tone as the original content - as if sharing thoughts with a friend
// 2. **OUTPUT FORMAT**: Provide content in the same format as the original (no special markdown formatting, no meta tags, no table of contents)
// 3. **SEO OPTIMIZATION**: 
//    - Use "${primaryKw}" as the primary keyword naturally throughout (1-2% density)
//    - Include primary keyword in title and first paragraph
//    - Use related keywords and synonyms naturally
//    - Optimize paragraph structure for readability
// 4. **CONTENT STRUCTURE**:
//    - Create an engaging, keyword-rich title
//    - Write compelling introduction that hooks readers
//    - Use clear, conversational paragraphs (2-3 sentences each)
//    - Include natural subheadings where appropriate
//    - End with strong conclusion
// 5. **MAINTAIN HUMAN TOUCH**: Keep personal reflections, casual phrases, and natural flow that makes it feel human-written
// 6. **NO TECHNICAL SEO ELEMENTS**: Don't include meta descriptions, table of contents, or technical SEO markup - just optimized, readable content

// Topic: "${topic}"
// Primary Keyword: "${primaryKw}"

// Original content to optimize:
// ${originalContent}

// Please provide the SEO-optimized content in the same natural, conversational format as the original.`;
//     };

//     // Simulate chunked processing with progress updates
//     const simulateChunkedProcessing = (text, callback) => {
//         const chunks = text.split(' ');
//         const totalChunks = chunks.length;
//         let processedChunks = 0;
//         let currentText = '';
        
//         const processChunk = () => {
//             if (processedChunks < totalChunks) {
//                 // Process 3-5 words at a time for realistic streaming effect
//                 const wordsToAdd = Math.min(Math.floor(Math.random() * 3) + 3, totalChunks - processedChunks);
                
//                 for (let i = 0; i < wordsToAdd; i++) {
//                     if (processedChunks < totalChunks) {
//                         currentText += chunks[processedChunks] + ' ';
//                         processedChunks++;
//                     }
//                 }
                
//                 const progress = (processedChunks / totalChunks) * 100;
//                 setSeoProgress(progress);
//                 callback(currentText.trim());
                
//                 // Random delay between 50-150ms for realistic streaming
//                 setTimeout(processChunk, Math.random() * 100 + 50);
//             }
//         };
        
//         processChunk();
//     };

//     // Main API call function
//     const fetchData = async () => {
//         setLoading(true);
//         setResponse('');
//         setSeoOptimizedContent('');
//         setShowSeoOptimization(false);
//         setSeoProgress(0);

//         try {
//             const contentPrompt = prepareContentPrompt(input, contentType, contentLength, toneStyle, primaryKeyword, secondaryKeyword);
            
//             const response = await axios.post(
//                 `${apiUrlA}/rewrite`, 
//                 { 
//                     input: contentPrompt,
//                     action: "Write a humanized, undetectable by AI" 
//                 }, 
//                 {
//                     headers: { 'Content-Type': 'application/json' },
//                 }
//             );
            
//             setResponse(response.data.modifiedText);
//         } catch (error) {
//             console.error('Error fetching data:', error);
//             setResponse('Error fetching data. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     // SEO optimization function - UPDATED TO MATCH ORIGINAL CONTENT RENDERING
//     const optimizeForSeo = async () => {
//         if (!response.trim()) {
//             alert('Please generate content first before optimizing for SEO.');
//             return;
//         }

//         setSeoLoading(true);
//         setSeoProgress(0);
//         setSeoOptimizedContent('');
//         setShowSeoOptimization(true);

//         try {
//             const seoPrompt = prepareSeoPrompt(response, input, primaryKeyword || input);
            
//             const seoResponse = await axios.post(
//                 `${apiUrlA}/rewrite`, 
//                 { 
//                     input: seoPrompt,
//                     action: "Optimize for SEO while maintaining conversational style and format" 
//                 }, 
//                 {
//                     headers: { 'Content-Type': 'application/json' },
//                     timeout: 30000 // 30 second timeout
//                 }
//             );
            
//             if (seoResponse.data && seoResponse.data.modifiedText) {
//                 // Simulate chunked processing for better UX
//                 simulateChunkedProcessing(seoResponse.data.modifiedText, (chunkedText) => {
//                     setSeoOptimizedContent(chunkedText);
//                 });
//             } else {
//                 throw new Error('Invalid response format from SEO optimization');
//             }
            
//         } catch (error) {
//             console.error('Error optimizing for SEO:', error);
//             let errorMessage = 'Error optimizing content for SEO. ';
            
//             if (error.code === 'ECONNABORTED') {
//                 errorMessage += 'Request timed out. Please try again.';
//             } else if (error.response) {
//                 errorMessage += `Server responded with error: ${error.response.status}`;
//             } else if (error.request) {
//                 errorMessage += 'No response from server. Please check your connection.';
//             } else {
//                 errorMessage += 'Please try again.';
//             }
            
//             setSeoOptimizedContent(errorMessage);
//             setSeoProgress(100); // Set to complete even on error
//         } finally {
//             setSeoLoading(false);
//         }
//     };

//     // Effects
//     useEffect(() => {
//         if (response && response.trim() !== '') {
//             dispatch(loadData(response));
//         }
//     }, [response, dispatch]);

//     useEffect(() => {
//         if (seoOptimizedContent && seoOptimizedContent.trim() !== '') {
//             dispatch(loadData(seoOptimizedContent));
//         }
//     }, [seoOptimizedContent, dispatch]);

//     return (
//         <div className="flex flex-col flex-1 bg-white p-4 rounded-lg lg:h-screen sm:h-auto sm:w-auto overflow-x-auto overflow-y-auto ml-10 mr-10">
//             {/* Header */}
//             <div className="flex mb-4 border-b">
//                 <div className="py-2 px-4 border-b-2 border-blue-500 text-blue-500 font-medium">
//                     Content Generation & SEO Optimization
//                 </div>
//             </div>
            
//             {/* Input Area */}
//             <div className='flex flex-col items-center rounded-md p-5'>
//                 <div className="w-full mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
//                     <div>
//                         <label htmlFor="content-type" className="block mb-2 text-sm font-medium text-gray-700">
//                             Content Type
//                         </label>
//                         <select
//                             id="content-type"
//                             value={contentType}
//                             onChange={handleContentTypeChange}
//                             className="bg-gray-200 border-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
//                         >
//                             {contentTypes.map((type) => (
//                                 <option key={type.id} value={type.id}>
//                                     {type.label}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>
                    
//                     <div>
//                         <label htmlFor="content-length" className="block mb-2 text-sm font-medium text-gray-700">
//                             Content Length
//                         </label>
//                         <select
//                             id="content-length"
//                             value={contentLength}
//                             onChange={handleContentLengthChange}
//                             className="bg-gray-200 border-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
//                         >
//                             {contentLengths.map((length) => (
//                                 <option key={length.id} value={length.id}>
//                                     {length.label}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>
                    
//                     <div>
//                         <label htmlFor="tone-style" className="block mb-2 text-sm font-medium text-gray-700">
//                             Tone Style
//                         </label>
//                         <select
//                             id="tone-style"
//                             value={toneStyle}
//                             onChange={handleToneStyleChange}
//                             className="bg-gray-200 border-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
//                         >
//                             {toneStyles.map((tone) => (
//                                 <option key={tone.id} value={tone.id}>
//                                     {tone.label}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>
                    
//                     <div>
//                         <label htmlFor="primary-keyword" className="block mb-2 text-sm font-medium text-gray-700">
//                             Primary Keyword
//                         </label>
//                         <input
//                             type="text"
//                             id="primary-keyword"
//                             value={primaryKeyword}
//                             onChange={handlePrimaryKeywordChange}
//                             placeholder="Enter primary keyword"
//                             className="bg-gray-200 border-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
//                         />
//                     </div>
                    
//                     <div>
//                         <label htmlFor="secondary-keyword" className="block mb-2 text-sm font-medium text-gray-700">
//                             Secondary Keyword
//                         </label>
//                         <input
//                             type="text"
//                             id="secondary-keyword"
//                             value={secondaryKeyword}
//                             onChange={handleSecondaryKeywordChange}
//                             placeholder="Enter secondary keyword"
//                             className="bg-gray-200 border-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
//                         />
//                     </div>
//                 </div>
                
//                 <textarea
//                     value={input}
//                     onChange={handleInputChange}
//                     placeholder={`Enter topic for your ${contentType.replace('-', ' ')}`}
//                     className='w-full p-2 bg-gray-200 rounded-xl font-normal from-neutral-700 border-none resize-none outline-none'
//                     rows={1}
//                     style={{ minHeight: '40px', overflow: 'hidden' }}
//                     onInput={(e) => {
//                         e.target.style.height = 'auto';
//                         e.target.style.height = `${e.target.scrollHeight}px`;
//                     }}
//                 />
                
//                 <div className="flex gap-3 w-full mt-3">
//                     <button
//                         onClick={fetchData}
//                         disabled={loading}
//                         className="text-neutral-600 flex-1 rounded-xl p-2 bg-gray-200 hover:text-neutral-900 hover:bg-gray-300 text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                         {loading ? 
//                             <span className="loading loading-dots loading-lg bg-slate-950"></span> : 
//                             `Generate ${contentType.replace('-', ' ')} (${contentLength} words, ${toneStyle} tone)`
//                         }
//                     </button>
                    
//                     {response && (
//                         <button
//                             onClick={optimizeForSeo}
//                             disabled={seoLoading || !response.trim()}
//                             className="text-white flex-1 rounded-xl p-2 bg-blue-500 hover:bg-blue-600 text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                             {seoLoading ? 'Optimizing for SEO...' : 'Optimize for SEO'}
//                         </button>
//                     )}
//                 </div>
//             </div>

//             {/* Original Content Response Area */}
//             {response && (
//                 <div className='relative mt-4 mb-4 p-4 flex flex-col font-light text-neutral-900 mr-5 ml-5 rounded-xl bg-gray-50'>
//                     <div className="flex items-center justify-between mb-3">
//                         <h3 className="text-lg font-semibold text-gray-800">Generated Content</h3>
//                         <button
//                             onClick={() => copyToClipboard(response, 'original')}
//                             className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
//                         >
//                             {copiedOriginal ? (
//                                 <>
//                                     <Check size={16} className="text-green-600" />
//                                     <span className="text-green-600">Copied!</span>
//                                 </>
//                             ) : (
//                                 <>
//                                     <Copy size={16} />
//                                     <span>Copy</span>
//                                 </>
//                             )}
//                         </button>
//                     </div>
//                     <div>
//                         {parseResponse(response)}
//                     </div>
//                 </div>
//             )}

//             {/* SEO Optimization Progress and Content - UPDATED TO MATCH GENERATED CONTENT STYLING */}
//             {showSeoOptimization && (
//                 <div className='relative mt-4 mb-4 p-4 flex flex-col font-light text-neutral-900 mr-5 ml-5 rounded-xl bg-gray-50'>
//                     <div className="flex items-center justify-between mb-3">
//                         <h3 className="text-lg font-semibold text-gray-800">SEO Optimized Content</h3>
//                         <div className="flex items-center gap-3">
//                             {seoLoading && (
//                                 <div className="flex items-center gap-2 text-gray-600">
//                                     <span className="text-sm">Processing...</span>
//                                     <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
//                                 </div>
//                             )}
//                             {seoOptimizedContent && !seoLoading && (
//                                 <button
//                                     onClick={() => copyToClipboard(seoOptimizedContent, 'seo')}
//                                     className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
//                                 >
//                                     {copiedSeo ? (
//                                         <>
//                                             <Check size={16} className="text-green-600" />
//                                             <span className="text-green-600">Copied!</span>
//                                         </>
//                                     ) : (
//                                         <>
//                                             <Copy size={16} />
//                                             <span>Copy</span>
//                                         </>
//                                     )}
//                                 </button>
//                             )}
//                         </div>
//                     </div>
                    
//                     {/* Progress Bar */}
//                     {seoLoading && (
//                         <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
//                             <div 
//                                 className="bg-gray-600 h-2 rounded-full transition-all duration-300 ease-out"
//                                 style={{ width: `${seoProgress}%` }}
//                             ></div>
//                         </div>
//                     )}
                    
//                     {/* SEO Optimized Content - NOW USING SAME parseResponse AS GENERATED CONTENT */}
//                     {seoOptimizedContent && (
//                         <div>
//                             {parseResponse(seoOptimizedContent)}
//                         </div>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ChatComponent;













































// Description: This component is a content generation interface that allows users to create blog posts with various options for content type, length, tone style, and keyword input, plus SEO optimization.

import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadData } from '../../app/user/userDataSlice';
import axios from 'axios';
import { Copy, Check } from 'lucide-react';

const apiUrlA = import.meta.env.VITE_API_BASE_URL;

import { parseResponse } from '../../util/parseresponse';

const ChatComponent = () => {
    const [input, setInput] = useState('');
    const [response, setResponse] = useState('');
    const [seoOptimizedContent, setSeoOptimizedContent] = useState('');
    const [seoMetaDescription, setSeoMetaDescription] = useState('');
    const [seoTableOfContents, setSeoTableOfContents] = useState('');
    const [loading, setLoading] = useState(false);
    const [seoLoading, setSeoLoading] = useState(false);
    const [seoProgress, setSeoProgress] = useState(0);
    const [contentType, setContentType] = useState('blog-post');
    const [contentLength, setContentLength] = useState(300);
    const [toneStyle, setToneStyle] = useState('standard');
    const [primaryKeyword, setPrimaryKeyword] = useState('');
    const [secondaryKeyword, setSecondaryKeyword] = useState('');
    const [showSeoOptimization, setShowSeoOptimization] = useState(false);
    const [copiedOriginal, setCopiedOriginal] = useState(false);
    const [copiedSeo, setCopiedSeo] = useState(false);
    const [copiedMeta, setCopiedMeta] = useState(false);
    const [copiedToc, setCopiedToc] = useState(false);
    
    const dispatch = useDispatch();

    const contentTypes = [
        { id: 'blog-post', label: 'Blog Post' }
    ];
    
    const contentLengths = [
        { id: 100, label: '100 words' },
        { id: 200, label: '200 words' },
        { id: 300, label: '300 words' },
        { id: 500, label: '500 words' },
        { id: 700, label: '700 words' },
        { id: 900, label: '900 words' },
        { id: 1200, label: '1200 words' },
        { id: 1500, label: '1500 words' }
    ];
    
    const toneStyles = [
        { id: 'standard', label: 'Standard' },
        { id: 'active', label: 'Active' },
        { id: 'storytelling', label: 'Storytelling' },
        { id: 'professional', label: 'Professional' }
    ];

    // Copy functionality
    const copyToClipboard = async (text, type) => {
        try {
            await navigator.clipboard.writeText(text);
            if (type === 'original') {
                setCopiedOriginal(true);
                setTimeout(() => setCopiedOriginal(false), 2000);
            } else if (type === 'seo') {
                setCopiedSeo(true);
                setTimeout(() => setCopiedSeo(false), 2000);
            } else if (type === 'meta') {
                setCopiedMeta(true);
                setTimeout(() => setCopiedMeta(false), 2000);
            } else if (type === 'toc') {
                setCopiedToc(true);
                setTimeout(() => setCopiedToc(false), 2000);
            }
        } catch (err) {
            console.error('Failed to copy text: ', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            if (type === 'original') {
                setCopiedOriginal(true);
                setTimeout(() => setCopiedOriginal(false), 2000);
            } else if (type === 'seo') {
                setCopiedSeo(true);
                setTimeout(() => setCopiedSeo(false), 2000);
            } else if (type === 'meta') {
                setCopiedMeta(true);
                setTimeout(() => setCopiedMeta(false), 2000);
            } else if (type === 'toc') {
                setCopiedToc(true);
                setTimeout(() => setCopiedToc(false), 2000);
            }
        }
    };

    // Event handlers
    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleContentTypeChange = (e) => {
        setContentType(e.target.value);
    };
    
    const handleContentLengthChange = (e) => {
        setContentLength(Number(e.target.value));
    };
    
    const handleToneStyleChange = (e) => {
        setToneStyle(e.target.value);
    };

    const handlePrimaryKeywordChange = (e) => {
        setPrimaryKeyword(e.target.value);
    };

    const handleSecondaryKeywordChange = (e) => {
        setSecondaryKeyword(e.target.value);
    };

    // Content prompt preparation
    const prepareContentPrompt = (userInput, type, length, tone, primaryKw, secondaryKw) => {
        const promptPrefix = {
            'blog-post': 'Craft a detailed and engaging blog post in a relaxed, conversational style—as if you are sharing your thoughts with a curious friend. Let the writing flow naturally with a mix of sentence lengths, a few casual phrases, and occasional imperfections. Include personal reflections, hypothetical situations, or relatable commentary to give the post a human touch. Avoid overly formal language or robotic structure. The final result should feel original, sincere, and indistinguishable from something written entirely by a human.'
        };
        
        const toneInstructions = {
            'standard': 'Use a balanced, neutral tone with a mix of sentence structures.',
            'active': 'Use active voice, direct statements, and energetic language. Keep it engaging and dynamic.',
            'storytelling': 'Use narrative techniques, descriptive language, and a conversational flow. Include anecdotes where appropriate.',
            'professional': 'Use formal language, industry-specific terminology, and structured arguments. Maintain a business-appropriate tone.'
        };
        
        const formattingInstructions = 'Use appropriate formatting including bold text for important points, headers for sections, and a compelling title.';
        
        let keywordInstructions = '';
        if (primaryKw.trim() || secondaryKw.trim()) {
            keywordInstructions = `Use "${primaryKw.trim()}" as the primary keyword and "${secondaryKw.trim()}" as the secondary keyword. Incorporate these keywords naturally throughout the content in a way that feels organic and not forced. The primary keyword should appear in the title and first paragraph.`;
        }
        
        const humanizationInstructions = `Make the writing style natural, human-generated, and 100% unique - not AI-generated. Include occasional pauses, personal anecdotes, or reflective thoughts as if a human is writing based on personal experience. Use varied sentence structures with occasional imperfections, conversational phrases, and a natural flow that resembles human writing patterns.`;
        
        return `${promptPrefix[type] || ''} ${userInput}. The content should be approximately ${length} words long. ${toneInstructions[tone]} ${formattingInstructions} ${keywordInstructions} ${humanizationInstructions}`;
    };

    // SEO optimization prompt preparation - UPDATED TO GENERATE SAME FORMAT AS ORIGINAL CONTENT
    const prepareSeoPrompt = (originalContent, topic, primaryKw) => {
        return `Rewrite and optimize the following content for SEO while maintaining the same conversational, human-like writing style as the original. Follow these requirements:

1. **WRITING STYLE**: Keep the same relaxed, conversational tone as the original content - as if sharing thoughts with a friend
2. **OUTPUT FORMAT**: Provide content in the same format as the original (no special markdown formatting, no meta tags, no table of contents)
3. **SEO OPTIMIZATION**: 
   - Use "${primaryKw}" as the primary keyword naturally throughout (1-2% density)
   - Include primary keyword in title and first paragraph
   - Use related keywords and synonyms naturally
   - Optimize paragraph structure for readability
4. **CONTENT STRUCTURE**:
   - Create an engaging, keyword-rich title
   - Write compelling introduction that hooks readers
   - Use clear, conversational paragraphs (2-3 sentences each)
   - Include natural subheadings where appropriate
   - End with strong conclusion
5. **MAINTAIN HUMAN TOUCH**: Keep personal reflections, casual phrases, and natural flow that makes it feel human-written
6. **NO TECHNICAL SEO ELEMENTS**: Don't include meta descriptions, table of contents, or technical SEO markup - just optimized, readable content

Topic: "${topic}"
Primary Keyword: "${primaryKw}"

Original content to optimize:
${originalContent}

Please provide the SEO-optimized content in the same natural, conversational format as the original.`;
    };

    // Meta description prompt
    const prepareMetaPrompt = (content, primaryKw) => {
        return `Create an engaging meta description for the following content. Requirements:
- 150-160 characters maximum
- Include the primary keyword "${primaryKw}" naturally
- Write in active voice that encourages clicks
- Make it compelling and descriptive
- Don't use quotation marks around the description

Content: ${content.substring(0, 500)}...`;
    };

    // Table of contents prompt
    const prepareTocPrompt = (content) => {
        return `Create a clean table of contents for the following content. Requirements:
- Extract main headings and subheadings
- Use simple numbered format (1., 2., 3., etc.)
- Keep it concise and scannable
- Only include major sections, not every minor point
- Format as a simple list without extra formatting

Content: ${content}`;
    };

    // Simulate chunked processing with progress updates
    const simulateChunkedProcessing = (text, callback) => {
        const chunks = text.split(' ');
        const totalChunks = chunks.length;
        let processedChunks = 0;
        let currentText = '';
        
        const processChunk = () => {
            if (processedChunks < totalChunks) {
                // Process 3-5 words at a time for realistic streaming effect
                const wordsToAdd = Math.min(Math.floor(Math.random() * 3) + 3, totalChunks - processedChunks);
                
                for (let i = 0; i < wordsToAdd; i++) {
                    if (processedChunks < totalChunks) {
                        currentText += chunks[processedChunks] + ' ';
                        processedChunks++;
                    }
                }
                
                const progress = (processedChunks / totalChunks) * 100;
                setSeoProgress(progress);
                callback(currentText.trim());
                
                // Random delay between 50-150ms for realistic streaming
                setTimeout(processChunk, Math.random() * 100 + 50);
            }
        };
        
        processChunk();
    };

    // Main API call function
    const fetchData = async () => {
        setLoading(true);
        setResponse('');
        setSeoOptimizedContent('');
        setSeoMetaDescription('');
        setSeoTableOfContents('');
        setShowSeoOptimization(false);
        setSeoProgress(0);

        try {
            const contentPrompt = prepareContentPrompt(input, contentType, contentLength, toneStyle, primaryKeyword, secondaryKeyword);
            
            const response = await axios.post(
                `${apiUrlA}/rewrite`, 
                { 
                    input: contentPrompt,
                    action: "Write a humanized, undetectable by AI" 
                }, 
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            
            setResponse(response.data.modifiedText);
        } catch (error) {
            console.error('Error fetching data:', error);
            setResponse('Error fetching data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // SEO optimization function - UPDATED TO MATCH ORIGINAL CONTENT RENDERING
    const optimizeForSeo = async () => {
        if (!response.trim()) {
            alert('Please generate content first before optimizing for SEO.');
            return;
        }

        setSeoLoading(true);
        setSeoProgress(0);
        setSeoOptimizedContent('');
        setSeoMetaDescription('');
        setSeoTableOfContents('');
        setShowSeoOptimization(true);

        try {
            // Generate SEO optimized content
            const seoPrompt = prepareSeoPrompt(response, input, primaryKeyword || input);
            
            const seoResponse = await axios.post(
                `${apiUrlA}/rewrite`, 
                { 
                    input: seoPrompt,
                    action: "Optimize for SEO while maintaining conversational style and format" 
                }, 
                {
                    headers: { 'Content-Type': 'application/json' },
                    timeout: 30000 // 30 second timeout
                }
            );
            
            if (seoResponse.data && seoResponse.data.modifiedText) {
                // Simulate chunked processing for better UX
                simulateChunkedProcessing(seoResponse.data.modifiedText, (chunkedText) => {
                    setSeoOptimizedContent(chunkedText);
                });

                // Generate meta description
                const metaPrompt = prepareMetaPrompt(seoResponse.data.modifiedText, primaryKeyword || input);
                const metaResponse = await axios.post(
                    `${apiUrlA}/rewrite`, 
                    { 
                        input: metaPrompt,
                        action: "Create SEO meta description" 
                    }, 
                    {
                        headers: { 'Content-Type': 'application/json' },
                        timeout: 15000
                    }
                );
                
                if (metaResponse.data && metaResponse.data.modifiedText) {
                    setSeoMetaDescription(metaResponse.data.modifiedText);
                }

                // Generate table of contents
                const tocPrompt = prepareTocPrompt(seoResponse.data.modifiedText);
                const tocResponse = await axios.post(
                    `${apiUrlA}/rewrite`, 
                    { 
                        input: tocPrompt,
                        action: "Create table of contents" 
                    }, 
                    {
                        headers: { 'Content-Type': 'application/json' },
                        timeout: 15000
                    }
                );
                
                if (tocResponse.data && tocResponse.data.modifiedText) {
                    setSeoTableOfContents(tocResponse.data.modifiedText);
                }
            } else {
                throw new Error('Invalid response format from SEO optimization');
            }
            
        } catch (error) {
            console.error('Error optimizing for SEO:', error);
            let errorMessage = 'Error optimizing content for SEO. ';
            
            if (error.code === 'ECONNABORTED') {
                errorMessage += 'Request timed out. Please try again.';
            } else if (error.response) {
                errorMessage += `Server responded with error: ${error.response.status}`;
            } else if (error.request) {
                errorMessage += 'No response from server. Please check your connection.';
            } else {
                errorMessage += 'Please try again.';
            }
            
            setSeoOptimizedContent(errorMessage);
            setSeoProgress(100); // Set to complete even on error
        } finally {
            setSeoLoading(false);
        }
    };

    // Effects
    useEffect(() => {
        if (response && response.trim() !== '') {
            dispatch(loadData(response));
        }
    }, [response, dispatch]);

    useEffect(() => {
        if (seoOptimizedContent && seoOptimizedContent.trim() !== '') {
            dispatch(loadData(seoOptimizedContent));
        }
    }, [seoOptimizedContent, dispatch]);

    return (
        <div className="flex flex-col flex-1 bg-white p-4 rounded-lg lg:h-screen sm:h-auto sm:w-auto overflow-x-auto overflow-y-auto ml-10 mr-10">
            {/* Header */}
            <div className="flex mb-4 border-b">
                <div className="py-2 px-4 border-b-2 border-blue-500 text-blue-500 font-medium">
                    Content Generation & SEO Optimization
                </div>
            </div>
            
            {/* Input Area */}
            <div className='flex flex-col items-center rounded-md p-5'>
                <div className="w-full mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                        <label htmlFor="content-type" className="block mb-2 text-sm font-medium text-gray-700">
                            Content Type
                        </label>
                        <select
                            id="content-type"
                            value={contentType}
                            onChange={handleContentTypeChange}
                            className="bg-gray-200 border-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        >
                            {contentTypes.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div>
                        <label htmlFor="content-length" className="block mb-2 text-sm font-medium text-gray-700">
                            Content Length
                        </label>
                        <select
                            id="content-length"
                            value={contentLength}
                            onChange={handleContentLengthChange}
                            className="bg-gray-200 border-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        >
                            {contentLengths.map((length) => (
                                <option key={length.id} value={length.id}>
                                    {length.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div>
                        <label htmlFor="tone-style" className="block mb-2 text-sm font-medium text-gray-700">
                            Tone Style
                        </label>
                        <select
                            id="tone-style"
                            value={toneStyle}
                            onChange={handleToneStyleChange}
                            className="bg-gray-200 border-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        >
                            {toneStyles.map((tone) => (
                                <option key={tone.id} value={tone.id}>
                                    {tone.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div>
                        <label htmlFor="primary-keyword" className="block mb-2 text-sm font-medium text-gray-700">
                            Primary Keyword
                        </label>
                        <input
                            type="text"
                            id="primary-keyword"
                            value={primaryKeyword}
                            onChange={handlePrimaryKeywordChange}
                            placeholder="Enter primary keyword"
                            className="bg-gray-200 border-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="secondary-keyword" className="block mb-2 text-sm font-medium text-gray-700">
                            Secondary Keyword
                        </label>
                        <input
                            type="text"
                            id="secondary-keyword"
                            value={secondaryKeyword}
                            onChange={handleSecondaryKeywordChange}
                            placeholder="Enter secondary keyword"
                            className="bg-gray-200 border-none text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        />
                    </div>
                </div>
                
                <textarea
                    value={input}
                    onChange={handleInputChange}
                    placeholder={`Enter topic for your ${contentType.replace('-', ' ')}`}
                    className='w-full p-2 bg-gray-200 rounded-xl font-normal from-neutral-700 border-none resize-none outline-none'
                    rows={1}
                    style={{ minHeight: '40px', overflow: 'hidden' }}
                    onInput={(e) => {
                        e.target.style.height = 'auto';
                        e.target.style.height = `${e.target.scrollHeight}px`;
                    }}
                />
                
                <div className="flex gap-3 w-full mt-3">
                    <button
                        onClick={fetchData}
                        disabled={loading}
                        className="text-neutral-600 flex-1 rounded-xl p-2 bg-gray-200 hover:text-neutral-900 hover:bg-gray-300 text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 
                            <span className="loading loading-dots loading-lg bg-slate-950"></span> : 
                            `Generate ${contentType.replace('-', ' ')} (${contentLength} words, ${toneStyle} tone)`
                        }
                    </button>
                    
                    {response && (
                        <button
                            onClick={optimizeForSeo}
                            disabled={seoLoading || !response.trim()}
                            className="text-white flex-1 rounded-xl p-2 bg-blue-500 hover:bg-blue-600 text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {seoLoading ? 'Optimizing for SEO...' : 'Optimize for SEO'}
                        </button>
                    )}
                </div>
            </div>

            {/* SEO Progress Bar - Moved above Generated Content */}
            {seoLoading && (
                <div className="mx-5 mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">SEO Optimization Progress</span>
                        <span className="text-sm text-gray-600">{Math.round(seoProgress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${seoProgress}%` }}
                        ></div>
                    </div>
                </div>
            )}

            {/* Original Content Response Area */}
            {response && (
                <div className='relative mt-4 mb-4 p-4 flex flex-col font-light text-neutral-900 mr-5 ml-5 rounded-xl bg-gray-50'>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-800">Generated Content</h3>
                        <button
                            onClick={() => copyToClipboard(response, 'original')}
                            className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                        >
                            {copiedOriginal ? (
                                <>
                                    <Check size={16} className="text-green-600" />
                                    <span className="text-green-600">Copied!</span>
                                </>
                            ) : (
                                <>
                                    <Copy size={16} />
                                    <span>Copy</span>
                                </>
                            )}
                        </button>
                    </div>
                    <div>
                        {parseResponse(response)}
                    </div>
                </div>
            )}

            {/* Meta Description and Table of Contents - New sections above SEO Optimized Content */}
            {showSeoOptimization && (seoMetaDescription || seoTableOfContents) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mx-5 mb-4">
                    {/* Meta Description */}
                    {seoMetaDescription && (
                        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-md font-semibold text-blue-800">Meta Description</h4>
                                <button
                                    onClick={() => copyToClipboard(seoMetaDescription, 'meta')}
                                    className="flex items-center gap-2 px-2 py-1 text-xs bg-blue-200 hover:bg-blue-300 rounded-lg transition-colors"
                                >
                                    {copiedMeta ? (
                                        <>
                                            <Check size={14} className="text-green-600" />
                                            <span className="text-green-600">Copied!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy size={14} />
                                            <span>Copy</span>
                                        </>
                                    )}
                                </button>
                            </div>
                            <div className="text-sm text-gray-700 leading-relaxed">
                                {seoMetaDescription}
                            </div>
                        </div>
                    )}

                    {/* Table of Contents */}
                    {seoTableOfContents && (
                        <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-md font-semibold text-green-800">Table of Contents</h4>
                                <button
                                    onClick={() => copyToClipboard(seoTableOfContents, 'toc')}
                                    className="flex items-center gap-2 px-2 py-1 text-xs bg-green-200 hover:bg-green-300 rounded-lg transition-colors"
                                >
                                    {copiedToc ? (
                                        <>
                                            <Check size={14} className="text-green-600" />
                                            <span className="text-green-600">Copied!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy size={14} />
                                            <span>Copy</span>
                                        </>
                                    )}
                                </button>
                            </div>
                            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                                {seoTableOfContents}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* SEO Optimized Content */}
            {showSeoOptimization && seoOptimizedContent && (
                <div className='relative mt-4 mb-4 p-4 flex flex-col font-light text-neutral-900 mr-5 ml-5 rounded-xl bg-gray-50'>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-800">SEO Optimized Content</h3>
                        <button
                            onClick={() => copyToClipboard(seoOptimizedContent, 'seo')}
                            className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                        >
                            {copiedSeo ? (
                                <>
                                    <Check size={16} className="text-green-600" />
                                    <span className="text-green-600">Copied!</span>
                                </>
                            ) : (
                                <>
                                    <Copy size={16} />
                                    <span>Copy</span>
                                </>
                            )}
                        </button>
                    </div>
                    
                    <div>
                        {parseResponse(seoOptimizedContent)}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatComponent;