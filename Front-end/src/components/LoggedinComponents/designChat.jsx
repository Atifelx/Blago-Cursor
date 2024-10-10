// import React from 'react'
// import React, { useState } from 'react';
// import { Button, FloatingLabel } from "flowbite-react";
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';



// function designChat() {

//     const [input, setInput] = useState('');
//     const [response, setResponse] = useState('');
//     const [loading, setLoading] = useState(false);

//     const handleInputChange = (e) => {
//         setInput(e.target.value);
//     };

//     const fetchData = async () => {
//         setLoading(true);
//         try {
//             const res = await fetch('http://localhost:3000/api/askai', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ input }),
//             });

//             if (!res.ok) {
//                 throw new Error('Network response was not ok');
//             }

//             const data = await res.json();
//             setResponse(data);
//         } catch (error) {
//             console.error('Error fetching data:', error);
//             setResponse('Error fetching data. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };


//     const parseResponse = (text) => {
//         const lines = text.split('\n');
//         const result = [];
//         let inCodeBlock = false;
//         let codeBlockContent = '';

//         lines.forEach((line, index) => {
//             // Header parsing
//             if (line.startsWith('###### ')) {
//                 result.push(<h6 key={index}>{line.slice(7)}</h6>);
//             } else if (line.startsWith('##### ')) {
//                 result.push(<h5 key={index}>{line.slice(6)}</h5>);
//             } else if (line.startsWith('#### ')) {
//                 result.push(<h4 key={index}>{line.slice(5)}</h4>);
//             } else if (line.startsWith('### ')) {
//                 result.push(<h3 key={index}>{line.slice(4)}</h3>);
//             } else if (line.startsWith('## ')) {
//                 result.push(<h2 key={index}>{line.slice(3)}</h2>);
//             } else if (line.startsWith('# ')) {
//                 result.push(<h1 key={index}>{line.slice(2)}</h1>);
//             }
//             // Bold and italic parsing
//             else if (line.includes('**') && line.includes('**')) {
//                 const parts = line.split(/\*\*(.*?)\*\*/g);
//                 result.push(
//                     <p key={index}>
//                         {parts.map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part))}
//                     </p>
//                 );
//             } else if (line.includes('*') && line.includes('*')) {
//                 const parts = line.split(/\*(.*?)\*/g);
//                 result.push(
//                     <p key={index}>
//                         {parts.map((part, i) => (i % 2 === 1 ? <em key={i}>{part}</em> : part))}
//                     </p>
//                 );
//             }
//             // List and ordered list parsing
//             else if (/^\d+\./.test(line)) {
//                 result.push(<li key={index}>{line.slice(line.indexOf('.') + 1).trim()}</li>);
//             } else if (line.startsWith('- ') || line.startsWith('* ')) {
//                 result.push(<li key={index}>{line.slice(2).trim()}</li>);
//             }
//             // Code block parsing
//             else if (line.startsWith('```')) {
//                 if (inCodeBlock) {
//                     // End the current code block
//                     result.push(
//                         <SyntaxHighlighter 
//                             key={index} 
//                             language="javascript ,python , php , html , css" // Specify the language you want to highlight
//                             style={prism} // Choose your preferred style
//                         >
//                             {codeBlockContent.trim()}
//                         </SyntaxHighlighter>
//                     );
//                     inCodeBlock = false; // Exit code block mode
//                     codeBlockContent = ''; // Reset content
//                 } else {
//                     // Start a new code block
//                     inCodeBlock = true; // Enter code block mode
//                 }
//             } else if (inCodeBlock) {
//                 // Append line to code block content if in code block
//                 codeBlockContent += line + '\n';
//             }
//             // Blockquote parsing
//             else if (line.startsWith('> ')) {
//                 result.push(<blockquote key={index} className="border-l-4 pl-4 italic">{line.slice(2).trim()}</blockquote>);
//             } else {
//                 result.push(<p key={index}>{line}</p>); // Default case for normal text
//             }
//         });

//         return result;
//         };





//   return (
//     <div>
//       <FloatingLabel variant="filled" label="Label" />
//     </div>
//   )
// }

// export default designChat
