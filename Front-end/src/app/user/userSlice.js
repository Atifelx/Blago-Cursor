import { createSlice } from '@reduxjs/toolkit'



//redux tool kit implementations 


const initialState = {
  currentUser:null,
  error:null,
  loading:false,
  userExist: false,
  editordata:null,
}

 const userSlice = createSlice({

  name: 'user',
  initialState,


  reducers: {

signinStart:(state)=>{
    state.loading = true;
    state.error=null;
},

signinSuccess:(state,action)=>{
    state.currentUser = action.payload;
    state.loading=false;
    state.error=null;
},
signinFailure:(state,action)=>{
    state.loading = false;
    state.error=action.payload;
    state.currentUser = null;
},

 signout: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    


GuserExist: (state,action) => {
      state.userExist = action.payload;;
    
    },

FetchData: (state,action) => {
      state.editordata = action.payload;
 },
   
 ClearData: (state) => {
  state.editordata = null;
},

  }
});
// Export actions
export const { 
  signinStart, 
  signinSuccess, 
  signinFailure, 
  signout, 
  GuserExist, 
  FetchData ,
  ClearData
} = userSlice.actions;


export const selectCurrentUser = (state) => state.user.currentUser; 
export const selectFetchData = (state) => state.user.editordata; 

export default userSlice.reducer;

