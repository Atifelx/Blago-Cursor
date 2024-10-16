
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


  const blocksData = useSelector(selectEditorData);  // actual data from redux 

  const editorData = convertApiResponseToEditorBlocks(blocksData) || [];






  const initializeEditor = (data) => {
    if (!editorInstance.current) {
      // Initialize the Editor.js instance
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
        data: data || [],
        onReady: () => {
          console.log('Editor is ready');
        },
        onChange: () => {
          console.log('Editor content changed!');
        },
      });
    }
  };

  const updateEditorData = (data) => {
    if (editorInstance.current) {
      editorInstance.current.render(data);
    }
  };




  const destroyEditor = () => {
    if (editorInstance.current) {
      editorInstance.current.destroy();
      editorInstance.current = null; // Reset reference after destroying the editor
      console.log('Editor instance destroyed');
    }
  };
  


  useEffect(() => {
 

    // Initialize the editor only if it hasn't been initialized
    if (!editorInstance.current) {
      initializeEditor(editorData);
    } else {
      updateEditorData(editorData); // Update the content if the editor is already initialized
    }

    return () => {
      // Clean up Editor.js instance when the component unmounts
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