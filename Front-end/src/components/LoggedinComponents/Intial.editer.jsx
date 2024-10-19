import React, { useRef, useEffect } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import Table from '@editorjs/table';
import Embed from '@editorjs/embed';
import Quote from '@editorjs/quote';
import Delimiter from '@editorjs/delimiter';
import Marker from '@editorjs/marker';
import InlineCode from '@editorjs/inline-code';
import { useSelector } from 'react-redux';
import { selectEditorData } from '../../app/user/userDataSlice';
import { converttoToEditor } from '../../util/userApi.js';
import { Button } from 'flowbite-react';
// import AIWriteTool from './customtool/AIWriteTool'; // Adjust the path as necessary



const EditorComponent = () => {
  const editorInstance = useRef(null);
  const blocksData = useSelector(selectEditorData); // Get Redux data

  const initializeEditor = (data) => {
    editorInstance.current = new EditorJS({
      holder: 'editorjs',
      tools: {
        header: {
          class: Header,
          inlineToolbar: true,
           },

        list: {
          class: List,
          inlineToolbar: true,
        },
        paragraph: {
          class: Paragraph,
          inlineToolbar: true,
        },

        // aiWrite: {
        //   class: AIWriteTool, // Add your custom AI Write tool here
        // inlineToolbar: true,

        // },

        table: {
          class: Table,
        },
        embed: Embed,
        quote: {
          class: Quote,
    
        },
        delimiter: Delimiter,
        marker: Marker,
        inlineCode: InlineCode,
      },
      data: data || { blocks: [] }, // Use provided data or empty
      onReady: () => {
        console.log('Editor is ready');
        // this.api = editorInstance.current.api; // Store API after editor is ready
        // Now you can create your tools here or call functions to initialize them
        // Render initial data if available
  
      },
      onChange: () => {
        editorInstance.current.save().then((outputData) => {
          console.log('Data saved: ', outputData);
          // Save the current editor data to localStorage
          localStorage.setItem('editorData', JSON.stringify(outputData));
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
    // Retrieve saved data from localStorage
    const savedData = localStorage.getItem('editorData');
    const parsedData = savedData ? JSON.parse(savedData) : null;

    if (!editorInstance.current) {
      // First time initializing the editor
      initializeEditor(parsedData);
    } else {
      // When blocksData changes, update the editor
      const updatedEditorData = converttoToEditor(blocksData) || { blocks: [] };
      // Merge saved data with Redux data before updating
      if (parsedData) {
        const mergedData = {
          blocks: [
            ...(parsedData.blocks || []),
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
  
  

  return (
    <div className="flex flex-col-reverse  w-screen">


    <div
      id="editorjs"
      className="border border-gray-200 rounded-xl shadow-xl p-4 ml-10 mr-10 mb-2 mt-2 w-screen sm:w-auto max-w-3xl overflow-y-auto justify-evenly relative" // Added 'relative' class
    > </div>

    <div>

    <Button
    color="gray"
        onClick={handleClick}
        className="border border-gray-50 rounded-xl shadow-sm p-0 mr-10 mb-2 ml-10 mt-5 justify-evenly relative text-neutral-500" // Positioned the button
      >
      
        Import from Chat
      </Button>

      </div>

  </div>
);
};
export default EditorComponent;
