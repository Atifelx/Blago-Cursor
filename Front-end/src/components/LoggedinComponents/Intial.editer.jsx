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
import { convertApiResponseToEditorBlocks } from '../../util/ApitoEditot'; // Adjust import path as necessary

const EditorComponent = () => {
  const editorInstance = useRef(null);
  const blocksData = useSelector(selectEditorData);

  const initializeEditor = (data) => {
    if (!editorInstance.current) {
      // Initialize the Editor.js instance only if it hasn't been created yet
      editorInstance.current = new EditorJS({
        holder: 'editorjs',
        tools: {
          header: Header,
          list: List,
          paragraph: {
            class: Paragraph,
            inlineToolbar: true,
          },
          table: Table,
          embed: Embed,
          quote: {
            class: Quote,
            inlineToolbar: true,
          },
          delimiter: Delimiter,
          marker: Marker,
          inlineCode: InlineCode,
        },
        data: data,
        onReady: () => {
          console.log('Editor is ready');

          editorInstance.current.blocks.render(data);
        },
        onChange: () => {
          console.log('Editor content changed!');
        },
      });
    } else {
      // Get the current blocks and the new blocks
      editorInstance.current.save().then((savedData) => {
        const existingBlocks = savedData.blocks || [];
        const newBlocks = data.blocks || [];
  
        // Append new blocks to the existing blocks
        const combinedBlocks = [...existingBlocks, ...newBlocks];
  
        // Instead of clearing, render the new blocks
        editorInstance.current.blocks.render(combinedBlocks);
      }).catch((error) => {
        console.error('Error saving editor data:', error);
      });
    }
  };
  
  

  useEffect(() => {
    // Convert blocksData to the format required by Editor.js
    const editorData = convertApiResponseToEditorBlocks(blocksData);
    
    console.log("edit-kdata data ", editorData);

      initializeEditor(editorData); // Pass editorData to initializeEditor
  

    return () => {
      destroyEditor();
    };


  }, [blocksData]); // Only re-run if blocksData changes

  return (
    <div className="flex flex-1 flex-col w-screen">
      <div
        id="editorjs"  
        className="border border-gray-200 rounded-xl shadow-xl p-4 ml-10 mr-10 mb-5 mt-5 w-screen sm:w-auto max-w-3xl overflow-y-auto justify-evenly"
      ></div>
    </div>
  );
};

export default EditorComponent;
