// src/app/user/userDataSlice.js
import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    editorData: {
        time: 0,  // Optionally track the time the data was loaded
        blocks: [],  // This is where Editor.js stores the structured content
        version: "2.22.2",  // Version of Editor.js data format (you can adjust based on your Editor.js version)
      },
};

const userArticleSlice = createSlice({
  name: 'userArticle',
  initialState,





  reducers: {
    

    loadData: (state, action) => {

    state.editorData = action.payload; // Replace the entire editorData with new payload






},

    },



    clearData: (state) => {
   
        state.editorData = {
            time: 0,
            blocks: [],  // Reset blocks to an empty array
            version: "2.22.2",  // Keep the version
          };
  },

});



//export const selectEditorData = (state) => state.userArticle.editorData;

export default userArticleSlice.reducer;

export const { loadData, clearData } = userArticleSlice.actions;



export const selectEditorData = (state) => state.userArticle; // Adjust based on your state structure
