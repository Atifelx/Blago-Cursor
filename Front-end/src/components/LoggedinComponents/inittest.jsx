import React, { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';

const EditorComponent2 = ({ initialData }) => {
  const editorInstance = useRef(null);

  // Initialize Editor.js when component mounts
  const initializeEditor = () => {
    if (!editorInstance.current) {
      editorInstance.current = new EditorJS({
        holder: 'editorjs', // Id of the container element for the editor
        tools: {
          header: Header, // Basic Header tool
        },
        data: initialData, // Populate with the initial data if available
        onReady: () => {
          console.log('Editor.js is ready');
        },
        onChange: () => {
          console.log('Content changed');
        },
      });
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
  }, [initialData]); // Reinitialize when initialData changes

  return (
    <div>
      <div id="editorjs"></div> {/* The container for the editor */}
    </div>
  );
};

export default EditorComponent2;
