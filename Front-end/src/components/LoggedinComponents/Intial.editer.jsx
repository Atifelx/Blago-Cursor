


// //100% working with redux save functions.
// import React, { useRef, useEffect } from 'react';
// import EditorJS from '@editorjs/editorjs';
// import Header from '@editorjs/header';

// import List from '@editorjs/list';
// import Paragraph from '@editorjs/paragraph';
// import Table from '@editorjs/table';
// import CodeTool from '@editorjs/code';
// import Quote from '@editorjs/quote';
// import Delimiter from '@editorjs/delimiter';

// import InlineCode from '@editorjs/inline-code';
// import { selectEditorData } from '../../app/user/userDataSlice';
// import { converttoToEditor } from '../../util/userApi.js';
// import { Button } from 'flowbite-react';
// import { useDispatch, useSelector } from 'react-redux';
// import { FetchData, ClearData } from '../../app/user/userSlice';
// import { selectFetchData } from '../../app/user/userSlice';
// import ConsoleTool from '../LoggedinComponents/customtool/consoletool';
// import { generateWordFromReduxData } from '../../util/generateWordDoc';
// import { AiOutlineClear } from "react-icons/ai";
// import { FaTrash, FaFileImport, FaCopy, FaFileWord } from 'react-icons/fa';

// //import '../../App.css'

// const EditorComponent = () => {
//   const editorInstance = useRef(null);
//   const blocksData = useSelector(selectEditorData); // Get Redux data
//   const dispatch = useDispatch();

//   const editorData = useSelector(selectFetchData);

//   const initializeEditor = (data) => {
//     editorInstance.current = new EditorJS({
//       holder: 'editorjs',
//       tools: {
//         header: {
//           class: Header,
//           inlineToolbar: ['bold', 'italic', 'AIWrite'], // Only show these options
//           config: {
//             placeholder: 'Enter a header',
//             levels: [2, 3, 4], // H2, H3, H4 levels
//             defaultLevel: 3, // Default to H3
//           },
//         },
//         list: {
//           class: List,
//           config: {
//             inlineToolbar: ['bold', 'italic', 'AIWrite'], // Add the custom tool here
//           },
//         },
//         paragraph: {
//           class: Paragraph,
//           inlineToolbar: ['bold', 'italic', 'AIWrite'], // Add the custom tool here
//           config: {
//             preserveBlank: true,
//           },
//         },
//         table: {
//           class: Table,
//         },
//         quote: {
//           class: Quote,
//         },
//         delimiter: Delimiter,
//         inlineCode: InlineCode,
//         AIWrite: ConsoleTool, // Register the custom tool
//         code: CodeTool,
//       },
//       data: data || { blocks: [] }, // Use provided data or empty
//       onReady: () => {
//       },
//       onChange: () => {
//         editorInstance.current.save().then((outputData) => {
//           dispatch(FetchData(outputData));
//         }).catch((error) => {
//           console.log('Saving failed: ', error);
//         });
//       },
//     });
//   };

//   const updateEditorData = (newData) => {
//     if (editorInstance.current) {
//       editorInstance.current.save().then((currentData) => {
//         const currentBlocks = currentData.blocks || [];
//         const newBlocks = newData.blocks || [];

//         // Merge current data with new data from Redux
//         const mergedData = {
//           blocks: [
//             ...currentBlocks,
//             ...newBlocks,
//           ],
//         };

//         // Update Editor.js with the merged data
//         editorInstance.current.render(mergedData).catch((error) => {
//           console.error('Error merging data:', error);
//         });
//       }).catch((error) => {
//         console.error('Error saving current data:', error);
//       });
//     }
//   };

//   useEffect(() => {
//     if (!editorInstance.current) {
//       initializeEditor(editorData);
//     } else {
//       // When blocksData changes, update the editor
//       const updatedEditorData = converttoToEditor(blocksData) || { blocks: [] };
//       // Merge saved data with Redux data before updating
//       if (editorData) {
//         const mergedData = {
//           blocks: [
//             ...(editorData.blocks || []),
//             ...(updatedEditorData.blocks || []),
//           ],
//         };
//         updateEditorData(mergedData); // Check and update if necessary
//       } else {
//         updateEditorData(updatedEditorData); // Only update with Redux data if no saved data
//       }
//     }

//     return () => {
//       // Cleanup on unmount
//       if (editorInstance.current) {
//         editorInstance.current.destroy();
//         editorInstance.current = null;
//       }
//     };
//   }, [blocksData]); // Effect runs when blocksData (Redux data) changes

//   const handleClick = () => {
//     const newData = converttoToEditor(blocksData) || { blocks: [] };

//     // Merge with current data in the editor
//     if (editorInstance.current) {
//       editorInstance.current.save().then((currentData) => {
//         const currentBlocks = currentData.blocks || [];

//         // Combine the current blocks with the new data
//         const mergedData = {
//           blocks: [
//             ...currentBlocks,
//             ...newData.blocks,
//           ],
//         };

//         // Render the merged data
//         editorInstance.current.render(mergedData).catch((error) => {
//           console.error('Error merging data on button click:', error);
//         });
//       }).catch((error) => {
//         console.error('Error saving current data on button click:', error);
//       });
//     }
//   };
  
//   const copyContentToClipboard = async () => {
//     if (editorInstance.current) {
//         try {
//             const outputData = await editorInstance.current.save();
//             const content = outputData.blocks
//                 .map(block => {
//                     // Handle paragraph blocks
//                     if (block.type === 'paragraph' && block.data.text.trim()) {
//                         return block.data.text; // Get plain text from paragraph
//                     }
//                     // Handle unordered list blocks
//                     if (block.type === 'list' && block.data.style === 'unordered') {
//                         return block.data.items.map(item => `• ${getListItemText(item)}`).join('\n'); // Bullet points for unordered list
//                     }
//                     // Handle ordered list blocks
//                     if (block.type === 'list' && block.data.style === 'ordered') {
//                         return block.data.items.map((item, index) => `${index + 1}. ${getListItemText(item)}`).join('\n'); // Numbered list for ordered list
//                     }
//                     // Handle header blocks
//                     if (block.type === 'header' && block.data.text.trim()) {
//                         return block.data.text; // Get plain text for headers
//                     }
//                     // Return empty for unhandled types or blocks without content
//                     return ''; 
//                 })
//                 .filter(Boolean) // Filter out empty strings
//                 .join('\n\n'); // Join the remaining content with line breaks

//             // Use the Clipboard API to copy content
//             await navigator.clipboard.writeText(content); // Copy the content to clipboard

//             console.log('Content copied to clipboard!');
//         } catch (error) {
//             console.error('Failed to copy content:', error);
//         }
//     } else {
//         console.warn('Editor instance is not available.');
//     }
//   };

//   // Function to get the text from a list item
//   const getListItemText = (item) => {
//     // Directly return the item since it's already a string
//     return item; // Each item is a string in your structure
//   };

//   const GenerateDoc = () => {
//     generateWordFromReduxData(editorData);
//   }

//   const ClearEditer = (event) => {
//     // Prevent the default action (if this function is triggered by an event)
//     event.preventDefault();

//     dispatch(ClearData(editorData));
//     editorInstance.current.destroy();
//     // editorInstance.current = null;
//     initializeEditor(editorData);
//   };

//   return (
//     <div className="flex flex-col items-center w-full px-4 py-6">
//       <div
//         id="editorjs"
//         className="border border-gray-400 rounded-xl shadow-xl p-4 mb-6 w-full max-w-3xl overflow-y-auto min-h-64"
//       ></div>

//       <div className="flex flex-wrap justify-center gap-4 w-full max-w-3xl">
//         <Button
//           color="gray"
//           onClick={handleClick}
//           className="border border-gray-100 rounded-xl shadow-sm px-4 py-2 text-neutral-600 flex items-center hover:bg-gray-50"
//         >
//           <FaFileImport className="mr-2" />
//           Import from Chat
//         </Button>

//         <Button
//           color="gray"
//           onClick={copyContentToClipboard}
//           className="border border-gray-100 rounded-xl shadow-sm px-4 py-2 text-neutral-600 flex items-center hover:bg-gray-50"
//         >
//           <FaCopy className="mr-2" />
//           Copy to Clipboard
//         </Button>

//         <Button
//           color="gray"
//           onClick={GenerateDoc}
//           className="border border-gray-100 rounded-xl shadow-sm px-4 py-2 text-neutral-600 flex items-center hover:bg-gray-50"
//         >
//           <FaFileWord className="mr-2" />
//           Generate Doc file
//         </Button>

//         <Button
//           color="gray"
//           onClick={ClearEditer}
//           title="Press 2 times to clear"
//           className="border border-gray-100 rounded-xl shadow-sm px-4 py-2 text-neutral-600 flex items-center hover:bg-gray-50"
//         >
//           <AiOutlineClear className="mr-2" />
//           Clear the Editor
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default EditorComponent;



//--------------------------------------------------------------

import React, { useRef, useEffect, useState } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';

import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import Table from '@editorjs/table';
import CodeTool from '@editorjs/code';
import Quote from '@editorjs/quote';
import Delimiter from '@editorjs/delimiter';

import InlineCode from '@editorjs/inline-code';
import { selectEditorData } from '../../app/user/userDataSlice';
import { converttoToEditor } from '../../util/userApi.js';
import { Button, Modal, TextInput, Label, Alert } from 'flowbite-react';
import { useDispatch, useSelector } from 'react-redux';
import { FetchData, ClearData } from '../../app/user/userSlice';
import { selectFetchData } from '../../app/user/userSlice';
import ConsoleTool from '../LoggedinComponents/customtool/consoletool';
import { generateWordFromReduxData } from '../../util/generateWordDoc';
import { AiOutlineClear } from "react-icons/ai";
import { FaTrash, FaFileImport, FaCopy, FaFileWord, FaWordpress, FaUser, FaLock, FaCheck } from 'react-icons/fa';
import axios from 'axios';

const EditorComponent = () => {
  const editorInstance = useRef(null);
  const blocksData = useSelector(selectEditorData);
  const dispatch = useDispatch();
  const editorData = useSelector(selectFetchData);
  
  // WordPress state
  const [wpModalOpen, setWpModalOpen] = useState(false);
  const [wpAuthStage, setWpAuthStage] = useState(1); // 1 = login, 2 = post details
  const [wpSiteUrl, setWpSiteUrl] = useState('');
  const [wpUsername, setWpUsername] = useState('');
  const [wpPassword, setWpPassword] = useState('');
  const [isWpAuthenticated, setIsWpAuthenticated] = useState(false);
  const [wpAuthError, setWpAuthError] = useState(null);
  const [wpAuthStatus, setWpAuthStatus] = useState('idle'); // idle, loading, success, error
  
  // WordPress post details
  const [wpTitle, setWpTitle] = useState('');
  const [wpCategory, setWpCategory] = useState('');
  const [wpTags, setWpTags] = useState('');
  const [wpStatus, setWpStatus] = useState('draft');
  const [wpExcerpt, setWpExcerpt] = useState('');
  const [wpFeaturedImage, setWpFeaturedImage] = useState('');
  const [wpSeoTitle, setWpSeoTitle] = useState('');
  const [wpSeoDescription, setWpSeoDescription] = useState('');
  const [wpSeoKeywords, setWpSeoKeywords] = useState('');
  const [wpPrimaryKeyword, setWpPrimaryKeyword] = useState('');
  const [wpSecondaryKeywords, setWpSecondaryKeywords] = useState('');
  const [wpPosting, setWpPosting] = useState(false);
  const [wpPostResult, setWpPostResult] = useState(null);
  const [wpCategories, setWpCategories] = useState([]);

  const initializeEditor = (data) => {
    editorInstance.current = new EditorJS({
      holder: 'editorjs',
      tools: {
        header: {
          class: Header,
          inlineToolbar: ['bold', 'italic', 'AIWrite'],
          config: {
            placeholder: 'Enter a header',
            levels: [2, 3, 4],
            defaultLevel: 3,
          },
        },
        list: {
          class: List,
          config: {
            inlineToolbar: ['bold', 'italic', 'AIWrite'],
          },
        },
        paragraph: {
          class: Paragraph,
          inlineToolbar: ['bold', 'italic', 'AIWrite'],
          config: {
            preserveBlank: true,
          },
        },
        table: {
          class: Table,
        },
        quote: {
          class: Quote,
        },
        delimiter: Delimiter,
        inlineCode: InlineCode,
        AIWrite: ConsoleTool,
        code: CodeTool,
      },
      data: data || { blocks: [] },
      onReady: () => {
      },
      onChange: () => {
        editorInstance.current.save().then((outputData) => {
          dispatch(FetchData(outputData));
        }).catch((error) => {
          console.log('Saving failed: ', error);
        });
      },
    });
  };

  const updateEditorData = (newData) => {
    if (editorInstance.current) {
      editorInstance.current.save().then((currentData) => {
        const currentBlocks = currentData.blocks || [];
        const newBlocks = newData.blocks || [];

        // Merge current data with new data from Redux
        const mergedData = {
          blocks: [
            ...currentBlocks,
            ...newBlocks,
          ],
        };

        // Update Editor.js with the merged data
        editorInstance.current.render(mergedData).catch((error) => {
          console.error('Error merging data:', error);
        });
      }).catch((error) => {
        console.error('Error saving current data:', error);
      });
    }
  };

  useEffect(() => {
    if (!editorInstance.current) {
      initializeEditor(editorData);
    } else {
      // When blocksData changes, update the editor
      const updatedEditorData = converttoToEditor(blocksData) || { blocks: [] };
      // Merge saved data with Redux data before updating
      if (editorData) {
        const mergedData = {
          blocks: [
            ...(editorData.blocks || []),
            ...(updatedEditorData.blocks || []),
          ],
        };
        updateEditorData(mergedData); // Check and update if necessary
      } else {
        updateEditorData(updatedEditorData); // Only update with Redux data if no saved data
      }
    }

    return () => {
      // Cleanup on unmount
      if (editorInstance.current) {
        editorInstance.current.destroy();
        editorInstance.current = null;
      }
    };
  }, [blocksData]); // Effect runs when blocksData (Redux data) changes

  const handleClick = () => {
    const newData = converttoToEditor(blocksData) || { blocks: [] };

    // Merge with current data in the editor
    if (editorInstance.current) {
      editorInstance.current.save().then((currentData) => {
        const currentBlocks = currentData.blocks || [];

        // Combine the current blocks with the new data
        const mergedData = {
          blocks: [
            ...currentBlocks,
            ...newData.blocks,
          ],
        };

        // Render the merged data
        editorInstance.current.render(mergedData).catch((error) => {
          console.error('Error merging data on button click:', error);
        });
      }).catch((error) => {
        console.error('Error saving current data on button click:', error);
      });
    }
  };
  
  const copyContentToClipboard = async () => {
    if (editorInstance.current) {
        try {
            const outputData = await editorInstance.current.save();
            const content = outputData.blocks
                .map(block => {
                    // Handle paragraph blocks
                    if (block.type === 'paragraph' && block.data.text.trim()) {
                        return block.data.text; // Get plain text from paragraph
                    }
                    // Handle unordered list blocks
                    if (block.type === 'list' && block.data.style === 'unordered') {
                        return block.data.items.map(item => `• ${getListItemText(item)}`).join('\n'); // Bullet points for unordered list
                    }
                    // Handle ordered list blocks
                    if (block.type === 'list' && block.data.style === 'ordered') {
                        return block.data.items.map((item, index) => `${index + 1}. ${getListItemText(item)}`).join('\n'); // Numbered list for ordered list
                    }
                    // Handle header blocks
                    if (block.type === 'header' && block.data.text.trim()) {
                        return block.data.text; // Get plain text for headers
                    }
                    // Return empty for unhandled types or blocks without content
                    return ''; 
                })
                .filter(Boolean) // Filter out empty strings
                .join('\n\n'); // Join the remaining content with line breaks

            // Use the Clipboard API to copy content
            await navigator.clipboard.writeText(content); // Copy the content to clipboard

            console.log('Content copied to clipboard!');
        } catch (error) {
            console.error('Failed to copy content:', error);
        }
    } else {
        console.warn('Editor instance is not available.');
    }
  };

  // Function to get the text from a list item
  const getListItemText = (item) => {
    // Directly return the item since it's already a string
    return item; // Each item is a string in your structure
  };

  const GenerateDoc = () => {
    generateWordFromReduxData(editorData);
  };

  const ClearEditer = (event) => {
    // Prevent the default action (if this function is triggered by an event)
    event.preventDefault();

    dispatch(ClearData(editorData));
    editorInstance.current.destroy();
    // editorInstance.current = null;
    initializeEditor(editorData);
  };

  // Function to convert editor content to HTML for WordPress
  const convertEditorToHTML = async () => {
    if (!editorInstance.current) return '';
    
    try {
      const outputData = await editorInstance.current.save();
      let htmlContent = '';
      
      for (const block of outputData.blocks) {
        switch (block.type) {
          case 'paragraph':
            htmlContent += `<p>${block.data.text}</p>`;
            break;
          case 'header':
            const headerLevel = block.data.level;
            htmlContent += `<h${headerLevel}>${block.data.text}</h${headerLevel}>`;
            break;
          case 'list':
            const listType = block.data.style === 'ordered' ? 'ol' : 'ul';
            htmlContent += `<${listType}>`;
            block.data.items.forEach(item => {
              htmlContent += `<li>${item}</li>`;
            });
            htmlContent += `</${listType}>`;
            break;
          case 'quote':
            htmlContent += `<blockquote>${block.data.text}</blockquote>`;
            break;
          case 'delimiter':
            htmlContent += '<hr>';
            break;
          case 'code':
            htmlContent += `<pre><code>${block.data.code}</code></pre>`;
            break;
          case 'table':
            htmlContent += '<table border="1" cellpadding="5">';
            block.data.content.forEach(row => {
              htmlContent += '<tr>';
              row.forEach(cell => {
                htmlContent += `<td>${cell}</td>`;
              });
              htmlContent += '</tr>';
            });
            htmlContent += '</table>';
            break;
          // Add more cases as needed
        }
      }
      
      return htmlContent;
    } catch (error) {
      console.error('Error converting editor content to HTML:', error);
      return '';
    }
  };

  // WordPress Authentication
  const authenticateWordPress = async () => {
    setWpAuthStatus('loading');
    setWpAuthError(null);
    
    try {
      // Format the URL correctly
      const formattedUrl = wpSiteUrl.replace(/\/$/, '');
      
      // Test endpoint to verify credentials
      const wpApiUrl = `${formattedUrl}/wp-json/wp/v2/users/me`;
      
      // Create basic auth header
      const authString = `${wpUsername}:${wpPassword}`;
      const authHeader = `Basic ${btoa(authString)}`;
      
      // Make authentication request
      const response = await axios.get(wpApiUrl, {
        headers: {
          'Authorization': authHeader
        }
      });
      
      if (response.status === 200) {
        setIsWpAuthenticated(true);
        setWpAuthStage(2);
        setWpAuthStatus('success');
        
        // Fetch categories for dropdown
        fetchWpCategories(formattedUrl, authHeader);
      }
    } catch (error) {
      console.error('WordPress authentication failed:', error);
      setWpAuthError('Authentication failed. Please check your credentials and site URL.');
      setWpAuthStatus('error');
      setIsWpAuthenticated(false);
    }
  };
  
  // Fetch WordPress categories
  const fetchWpCategories = async (siteUrl, authHeader) => {
    try {
      const categoriesUrl = `${siteUrl}/wp-json/wp/v2/categories?per_page=100`;
      const response = await axios.get(categoriesUrl, {
        headers: {
          'Authorization': authHeader
        }
      });
      
      if (response.status === 200) {
        setWpCategories(response.data);
      }
    } catch (error) {
      console.error('Error fetching WordPress categories:', error);
    }
  };

  // Function to post to WordPress
  const postToWordPress = async () => {
    setWpPosting(true);
    setWpPostResult(null);
    
    try {
      const htmlContent = await convertEditorToHTML();
      if (!htmlContent) {
        throw new Error('No content to post');
      }
      
      // Create the authentication header
      const authString = `${wpUsername}:${wpPassword}`;
      const authHeader = `Basic ${btoa(authString)}`;
      
      // Prepare tags as array if provided
      const tags = wpTags.trim() ? wpTags.split(',').map(tag => tag.trim()) : [];
      
      // Prepare categories as array if provided
      const categories = wpCategory ? [parseInt(wpCategory)] : [];
      
      // Create post object for WordPress
      const postData = {
        title: wpTitle,
        content: htmlContent,
        status: wpStatus,
        format: 'standard',
        excerpt: wpExcerpt
      };
      
      // Add categories and tags if provided
      if (categories.length > 0) postData.categories = categories;
      if (tags.length > 0) postData.tags = tags;
      
      // Add Yoast SEO meta if available (requires Yoast REST API)
      if (wpSeoTitle || wpSeoDescription || wpSeoKeywords) {
        postData.meta = {
          yoast_wpseo_title: wpSeoTitle,
          yoast_wpseo_metadesc: wpSeoDescription,
          yoast_wpseo_focuskw: wpPrimaryKeyword,
          yoast_wpseo_keywordsynonyms: wpSecondaryKeywords
        };
      }
      
      // Construct WordPress REST API endpoint
      const wpApiUrl = `${wpSiteUrl.replace(/\/$/, '')}/wp-json/wp/v2/posts`;
      
      // Make API request to WordPress
      const response = await axios.post(wpApiUrl, postData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader
        }
      });
      
      setWpPostResult({
        success: true,
        message: `Post "${wpTitle}" published successfully!`,
        postUrl: response.data.link,
        postId: response.data.id
      });
      
    } catch (error) {
      console.error('Error posting to WordPress:', error);
      setWpPostResult({
        success: false,
        message: `Error posting to WordPress: ${error.response?.data?.message || error.message || 'Unknown error'}`
      });
    } finally {
      setWpPosting(false);
    }
  };

  // Reset WordPress modal
  const resetWpModal = () => {
    setWpModalOpen(false);
    setWpAuthStage(1);
    setIsWpAuthenticated(false);
    setWpAuthError(null);
    setWpAuthStatus('idle');
    setWpPostResult(null);
  };

  // Go back to authentication stage
  const goBackToAuth = () => {
    setWpAuthStage(1);
    setIsWpAuthenticated(false);
  };

  return (
    <div className="flex flex-col items-center w-full px-4 py-6">
      {/* Top toolbar buttons */}
      <div className="flex justify-between mb-4 w-full max-w-3xl">
        <div className="flex space-x-2 w-full justify-between">
          <Button
            color="gray"
            onClick={handleClick}
            className="border border-gray-100 rounded-lg shadow-sm px-3 py-1.5 text-sm text-neutral-600 flex items-center hover:bg-gray-50"
          >
            <FaFileImport className="mr-1" />
            Import
          </Button>

          <Button
            color="gray"
            onClick={copyContentToClipboard}
            className="border border-gray-100 rounded-lg shadow-sm px-3 py-1.5 text-sm text-neutral-600 flex items-center hover:bg-gray-50"
          >
            <FaCopy className="mr-1" />
            Copy
          </Button>

          <Button
            color="gray"
            onClick={GenerateDoc}
            className="border border-gray-100 rounded-lg shadow-sm px-3 py-1.5 text-sm text-neutral-600 flex items-center hover:bg-gray-50"
          >
            <FaFileWord className="mr-1" />
            Doc
          </Button>

          <Button
            color="gray"
            onClick={() => setWpModalOpen(true)}
            className="border border-gray-100 rounded-lg shadow-sm px-3 py-1.5 text-sm text-neutral-600 flex items-center hover:bg-gray-50"
          >
            <FaWordpress className="mr-1" />
            WordPress
          </Button>

          <Button
            color="gray"
            onClick={ClearEditer}
            title="Clear editor content"
            className="border border-gray-100 rounded-lg shadow-sm px-3 py-1.5 text-sm text-neutral-600 flex items-center hover:bg-gray-50"
          >
            <AiOutlineClear className="mr-1" />
            Clear
          </Button>
        </div>
      </div>

      {/* Editor container */}
      <div
        id="editorjs"
        className="border border-gray-400 rounded-xl shadow-xl p-4 mb-6 w-full max-w-3xl overflow-y-auto min-h-64"
      ></div>

      {/* WordPress Publishing Modal */}
      <Modal
        show={wpModalOpen}
        onClose={resetWpModal}
        dismissible
        size="lg"
      >
        <Modal.Header>
          {wpAuthStage === 1 ? 'WordPress Authentication' : 'Post to WordPress'}
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            {wpPostResult ? (
              // Result display
              <div className={`p-4 rounded-lg ${wpPostResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                <p className="font-medium">{wpPostResult.message}</p>
                {wpPostResult.success && wpPostResult.postUrl && (
                  <div className="mt-2">
                    <a 
                      href={wpPostResult.postUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Post
                    </a>
                  </div>
                )}
              </div>
            ) : wpAuthStage === 1 ? (
              // Authentication stage
              <div className="space-y-4">
                <div>
                  <Label htmlFor="wp-site-url" value="WordPress Site URL" />
                  <TextInput
                    id="wp-site-url"
                    placeholder="https://your-wordpress-site.com"
                    value={wpSiteUrl}
                    onChange={(e) => setWpSiteUrl(e.target.value)}
                    required
                    icon={FaWordpress}
                  />
                  <p className="text-xs text-gray-500 mt-1">Include http:// or https:// and no trailing slash</p>
                </div>
                
                <div>
                  <Label htmlFor="wp-username" value="Username" />
                  <TextInput
                    id="wp-username"
                    placeholder="WordPress username"
                    value={wpUsername}
                    onChange={(e) => setWpUsername(e.target.value)}
                    required
                    icon={FaUser}
                  />
                </div>
                
                <div>
                  <Label htmlFor="wp-password" value="Password or Application Password" />
                  <TextInput
                    id="wp-password"
                    type="password"
                    placeholder="WordPress password"
                    value={wpPassword}
                    onChange={(e) => setWpPassword(e.target.value)}
                    required
                    icon={FaLock}
                  />
                  <p className="text-xs text-gray-500 mt-1">For better security, use Application Passwords from your WordPress dashboard</p>
                </div>

                {wpAuthStatus === 'error' && wpAuthError && (
                  <Alert color="failure">
                    <span className="font-medium">Authentication Error:</span> {wpAuthError}
                  </Alert>
                )}
              </div>
            ) : (
              // Post details stage
              <div className="space-y-4">
                <div className="bg-green-50 text-green-800 p-3 rounded-lg flex items-center mb-4">
                  <FaCheck className="mr-2" />
                  <span>Successfully authenticated with WordPress</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="wp-title" value="Post Title" />
                    <TextInput
                      id="wp-title"
                      placeholder="Enter post title"
                      value={wpTitle}
                      onChange={(e) => setWpTitle(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="wp-status" value="Post Status" />
                    <select
                      id="wp-status"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      value={wpStatus}
                      onChange={(e) => setWpStatus(e.target.value)}
                    >
                      <option value="draft">Draft</option>
                      <option value="publish">Publish</option>
                      <option value="pending">Pending Review</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="wp-category" value="Category" />
                    <select
                      id="wp-category"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      value={wpCategory}
                      onChange={(e) => setWpCategory(e.target.value)}
                    >
                      <option value="">Select Category</option>
                      {wpCategories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="wp-tags" value="Tags (comma separated)" />
                  <TextInput
                    id="wp-tags"
                    placeholder="tag1, tag2, tag3"
                    value={wpTags}
                    onChange={(e) => setWpTags(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="wp-excerpt" value="Excerpt (optional)" />
                  <textarea
                    id="wp-excerpt"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Brief excerpt for this post"
                    value={wpExcerpt}
                    onChange={(e) => setWpExcerpt(e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-medium text-gray-900 mb-2">SEO Settings</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="wp-seo-title" value="SEO Title" />
                      <TextInput
                        id="wp-seo-title"
                        placeholder="SEO Title (if different from post title)"
                        value={wpSeoTitle}
                        onChange={(e) => setWpSeoTitle(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="wp-seo-description" value="Meta Description" />
                      <textarea
                        id="wp-seo-description"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder="Meta description for search engines"
                        value={wpSeoDescription}
                        onChange={(e) => setWpSeoDescription(e.target.value)}
                        rows={2}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="wp-primary-keyword" value="Primary Keyword" />
                      <TextInput
                        id="wp-primary-keyword"
                        placeholder="Main keyword for this post"
                        value={wpPrimaryKeyword}
                        onChange={(e) => setWpPrimaryKeyword(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="wp-secondary-keywords" value="Secondary Keywords (comma separated)" />
                      <TextInput
                        id="wp-secondary-keywords"
                        placeholder="keyword1, keyword2, keyword3"
                        value={wpSecondaryKeywords}
                        onChange={(e) => setWpSecondaryKeywords(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          {wpPostResult ? (
            <Button color="gray" onClick={resetWpModal}>
              Close
            </Button>
          ) : wpAuthStage === 1 ? (
            <>
              <Button color="gray" onClick={resetWpModal}>
                Cancel
              </Button>
              <Button 
                onClick={authenticateWordPress}
                disabled={wpAuthStatus === 'loading' || !wpSiteUrl || !wpUsername || !wpPassword}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {wpAuthStatus === 'loading' ? 'Authenticating...' : 'Connect to WordPress'}
              </Button>
            </>
          ) : (
            <>
              <Button color="gray" onClick={goBackToAuth}>
                Back to Login
              </Button>
              <Button color="gray" onClick={resetWpModal}>
                Cancel
              </Button>
              <Button 
                onClick={postToWordPress}
                disabled={wpPosting || !wpTitle}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {wpPosting ? 'Publishing...' : 'Publish to WordPress'}
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EditorComponent;