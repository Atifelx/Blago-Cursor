// src/app/user/ebookMemorySlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    // Basic Information
    basicInfo: {
        topic: '',
        targetAudience: '',
        endGoal: '',
        toneStyle: '',
        referenceUrl: '',
        wordCount: 5000,
        pageCount: 10
    },
    
    // Chapter Configuration
    chapterConfig: {
        numChapters: 5,
        aiGenerateChapters: true,
        chapterTitles: [],
        includeSummary: true,
        includeDiscussionQuestions: true,
        includeResources: true,
        includeAuthorBio: true
    },
    
    // Chapter Details
    chapterDetails: [],
    
    // Processing States
    processingStates: {
        currentFormStep: 'basic',
        scrapedContent: '',
        ebookOutline: '',
        analysisComplete: false,
        deepAnalysis: ''
    },
    
    // Generated Content
    generatedContent: {
        ebookChapters: [],
        ebookData: null,
        totalWordCount: 0,
        generationComplete: false
    },
    
    // Memory Metadata
    memoryMetadata: {
        createdAt: null,
        lastUpdated: null,
        version: '1.0.0'
    }
};

const ebookMemorySlice = createSlice({
    name: 'ebookMemory',
    initialState,
    reducers: {
        // Basic Info Actions
        updateBasicInfo: (state, action) => {
            state.basicInfo = { ...state.basicInfo, ...action.payload };
            state.memoryMetadata.lastUpdated = new Date().toISOString();
        },
        
        // Chapter Config Actions
        updateChapterConfig: (state, action) => {
            state.chapterConfig = { ...state.chapterConfig, ...action.payload };
            state.memoryMetadata.lastUpdated = new Date().toISOString();
        },
        
        // Chapter Details Actions
        updateChapterDetails: (state, action) => {
            state.chapterDetails = action.payload;
            state.memoryMetadata.lastUpdated = new Date().toISOString();
        },
        
        // Processing States Actions
        updateProcessingStates: (state, action) => {
            state.processingStates = { ...state.processingStates, ...action.payload };
            state.memoryMetadata.lastUpdated = new Date().toISOString();
        },
        
        // Generated Content Actions
        updateGeneratedContent: (state, action) => {
            state.generatedContent = { ...state.generatedContent, ...action.payload };
            state.memoryMetadata.lastUpdated = new Date().toISOString();
        },
        
        // Deep Analysis Actions
        setDeepAnalysis: (state, action) => {
            state.processingStates.deepAnalysis = action.payload;
            state.processingStates.analysisComplete = true;
            state.memoryMetadata.lastUpdated = new Date().toISOString();
        },
        
        // Memory Management Actions
        initializeMemory: (state, action) => {
            const savedData = action.payload;
            if (savedData) {
                return { ...savedData, memoryMetadata: { ...savedData.memoryMetadata, lastUpdated: new Date().toISOString() } };
            }
            return { ...initialState, memoryMetadata: { ...initialState.memoryMetadata, createdAt: new Date().toISOString() } };
        },
        
        clearMemory: (state) => {
            return { ...initialState, memoryMetadata: { ...initialState.memoryMetadata, createdAt: new Date().toISOString() } };
        },
        
        // Form Step Navigation
        setFormStep: (state, action) => {
            state.processingStates.currentFormStep = action.payload;
            state.memoryMetadata.lastUpdated = new Date().toISOString();
        },
        
        // Save All Data at Once
        saveAllEbookData: (state, action) => {
            const { basicInfo, chapterConfig, chapterDetails, processingStates } = action.payload;
            state.basicInfo = { ...state.basicInfo, ...basicInfo };
            state.chapterConfig = { ...state.chapterConfig, ...chapterConfig };
            state.chapterDetails = chapterDetails || [];
            state.processingStates = { ...state.processingStates, ...processingStates };
            state.memoryMetadata.lastUpdated = new Date().toISOString();
        }
    }
});

export default ebookMemorySlice.reducer;

export const {
    updateBasicInfo,
    updateChapterConfig,
    updateChapterDetails,
    updateProcessingStates,
    updateGeneratedContent,
    setDeepAnalysis,
    initializeMemory,
    clearMemory,
    setFormStep,
    saveAllEbookData
} = ebookMemorySlice.actions;

// Selectors
export const selectEbookMemory = (state) => state.ebookMemory;
export const selectBasicInfo = (state) => state.ebookMemory.basicInfo;
export const selectChapterConfig = (state) => state.ebookMemory.chapterConfig;
export const selectChapterDetails = (state) => state.ebookMemory.chapterDetails;
export const selectProcessingStates = (state) => state.ebookMemory.processingStates;
export const selectGeneratedContent = (state) => state.ebookMemory.generatedContent;
export const selectDeepAnalysis = (state) => state.ebookMemory.processingStates.deepAnalysis;
export const selectIsAnalysisComplete = (state) => state.ebookMemory.processingStates.analysisComplete;
