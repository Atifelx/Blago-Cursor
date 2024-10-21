//100% working with redux save functions.
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
import { selectEditorData } from '../../app/user/userDataSlice';
import { converttoToEditor } from '../../util/userApi.js';
import { Button } from 'flowbite-react';
import { useDispatch ,useSelector } from 'react-redux';
 import {FetchData } from '../../app/user/userSlice';
 import {selectFetchData} from '../../app/user/userSlice';
 import ConsoleTool from '../LoggedinComponents/customtool/consoletool';

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
          inlineToolbar: true,
          config: {
            placeholder: 'Enter a header',
            levels: [2, 3, 4],
            defaultLevel: 3
          },


           },

        list: {
          class: List,
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
        embed: Embed,
        quote: {
          class: Quote,
    
        },
        delimiter: Delimiter,
        marker: Marker,
        inlineCode: InlineCode,
        AIWrite: ConsoleTool, // Register the custom tool

      },
      data: data || { blocks: [] }, // Use provided data or empty
      onReady: () => {
     
  
      },
      onChange: () => {
        editorInstance.current.save().then((outputData) => {


          dispatch(FetchData(outputData));

          console.log(outputData);

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