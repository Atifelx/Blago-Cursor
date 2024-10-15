import React, { useRef, useEffect, useState ,useMemo} from 'react';
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
import {selectEditorData } from '../../app/user/userDataSlice';

import { convertApiResponseToEditorBlocks } from '../../util/ApitoEditot'; // Adjust import path as necessary




const EditorComponent = () => {
  const editorInstance = useRef(null);

    const blocksData = useSelector(selectEditorData);

 // Convert blocksData to the format required by Editor.js
 //const editorData = convertApiResponseToEditorBlocks(blocksData);

 const editorData = useMemo(() => convertApiResponseToEditorBlocks(blocksData), [blocksData]);


 const initializeEditor = () => {
  if (editorInstance.current) {
      return; // Prevent re-initialization
  }
  
  try {
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
          data: editorData,
          onReady: () => {
              console.log('Editor is ready');
          },
          onChange: () => {
              console.log('Editor content changed!');
          },
      });
  } catch (error) {
      console.error('EditorJS initialization error:', error);
  }
};





  // Clean up Editor.js instance on component unmount
  const destroyEditor = () => {
    if (editorInstance.current) {
      editorInstance.current.destroy();
      editorInstance.current = null;
    }
  };

  useEffect(() => {
  
    initializeEditor();

    return () => {
        destroyEditor();
    };
}, [blocksData]);


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
