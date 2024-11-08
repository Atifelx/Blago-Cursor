//100% working with redux save functions.
import React, { useRef, useEffect } from 'react';
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
import { Button } from 'flowbite-react';
import { useDispatch ,useSelector } from 'react-redux';
 import {FetchData ,ClearData} from '../../app/user/userSlice';
 import {selectFetchData} from '../../app/user/userSlice';
 import ConsoleTool from '../LoggedinComponents/customtool/consoletool';
 import { generateWordFromReduxData } from '../../util/generateWordDoc';
 import { AiOutlineClear } from "react-icons/ai";
 import { FaTrash , FaFileImport , FaCopy ,FaFileWord} from 'react-icons/fa';



 import '../../App.css'



const EditorComponent = () => {
  const editorInstance = useRef(null);
  const blocksData = useSelector(selectEditorData); // Get Redux data
  const dispatch = useDispatch();

  const editorData = useSelector(selectFetchData);

  const initializeEditor = (data) => {
    editorInstance.current = new EditorJS({
      holder: 'editorjs',
      tools: {


        header: {
          class: Header,
          inlineToolbar: ['bold', 'italic', 'AIWrite'], // Only show these options
          config: {
            placeholder: 'Enter a header',
            levels: [2, 3, 4], // H2, H3, H4 levels
            defaultLevel: 3, // Default to H3
          },



           },

        list: {
          class: List,
          config: {
     
            inlineToolbar: ['bold', 'italic', 'AIWrite'], // Add the custom tool here
          },
        },
        paragraph: {
          class: Paragraph,
          inlineToolbar: ['bold', 'italic', 'AIWrite'], // Add the custom tool here

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
        AIWrite: ConsoleTool, // Register the custom tool
      
        code: CodeTool,

      },
    


      data: data || { blocks: [] }, // Use provided data or empty
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

}


const ClearEditer = (event) => {
  // Prevent the default action (if this function is triggered by an event)
  event.preventDefault();

  dispatch(ClearData(editorData));
  editorInstance.current.destroy();
  // editorInstance.current = null;
  initializeEditor(editorData);
};





  

  return (
    <div className="flex flex-1 flex-col-reverse">


    <div
      id="editorjs"
      className="border border-gray-400 rounded-xl shadow-xl p-4 ml-10 mr-10 mb-2 mt-2 w-screen sm:w-auto max-w-3xl overflow-y-auto justify-evenly relative sm:min-w-40" // Added 'relative' class
    > </div>

    <div className='flex flex-row'>

      <div>

    <Button
    color="gray"
        onClick={handleClick}
        className="border border-gray-50 rounded-xl shadow-sm p-0 mr-10 mb-2 ml-10 mt-5 justify-evenly relative text-neutral-500" // Positioned the button
      >
       <FaFileImport className="mr-2 text-base" style={{ verticalAlign: 'middle' }} /> {/* Adjust icon size and vertical alignment */}

        Import from Chat
      </Button>

      </div>


<div>
      <Button
    color="gray"
    onClick={copyContentToClipboard}
    className="border border-gray-50 rounded-xl shadow-sm p-0 mr-10 mb-2 ml-10 mt-5 justify-evenly relative text-neutral-500"
>
<FaCopy className="mr-2 text-base" style={{ verticalAlign: 'middle' }} /> {/* Adjust icon size and vertical alignment */}
    Copy to Clipboard
</Button>
</div>



<div>
      <Button
    color="gray"
    onClick={GenerateDoc}
    className="border border-gray-50 rounded-xl shadow-sm p-0 mr-10 mb-2 ml-10 mt-5 justify-evenly relative text-neutral-500"
>
<FaFileWord className="mr-2 text-base" style={{ verticalAlign: 'middle' }} /> {/* Adjust icon size and vertical alignment */}
    Generate Doc file
</Button>
</div>







<Button
    color="gray"
    onClick={ClearEditer}
    label="Press 2 times to clear"
    className="border border-gray-50 rounded-xl shadow-sm p-1 mr-10 mb-2 ml-10 mt-5 flex items-center text-sm h-10 text-neutral-500" // Fixed height for better alignment
>
    <AiOutlineClear className="mr-2 text-base" style={{ verticalAlign: 'middle' }} /> {/* Adjust icon size and vertical alignment */}
    Clear the Editor
</Button>







</div>

  </div>
);
};
export default EditorComponent;