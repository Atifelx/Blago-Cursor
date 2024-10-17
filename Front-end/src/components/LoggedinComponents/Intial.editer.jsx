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
          inlineToolbar: ['bold', 'italic', 'marker', 'inlineCode'],
        },
        table: {
          class: Table,
          inlineToolbar: true,
        },
        embed: Embed,
        quote: {
          class: Quote,
          inlineToolbar: true,
        },
        delimiter: Delimiter,
        marker: Marker,
        inlineCode: InlineCode,
      },
      data: data || { blocks: [] }, // Use provided data or empty
      onReady: () => {
        console.log('Editor is ready');
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
    <div className="flex flex-1 flex-col w-screen">
    
      <div
        id="editorjs"
        className="border border-gray-200 rounded-xl shadow-xl p-4 ml-10 mr-10 mb-5 mt-5 w-screen sm:w-auto max-w-3xl overflow-y-auto justify-evenly"
      ></div>
     
     <Button
      id="editorjs"
      
      onClick={handleClick}
      className="border border-gray-200 rounded-xl shadow-xl p-2 ml-10 mr-10 mb-5 mt-5 w-36"
    >fetch</Button>


    </div>
    

      
     
  );
};

export default EditorComponent;
