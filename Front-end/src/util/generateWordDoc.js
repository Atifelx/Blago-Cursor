// utils/generateWordDoc.js updated

import { Document, Packer, Paragraph, TextRun, HeadingLevel, ShadingType } from "docx";
import { saveAs } from 'file-saver'; // For downloading the document

// Utility function to parse text for formatting
const parseText = (text) => {
  const runs = [];

  // Split text into segments based on <b>, <i>, and <br> tags
  const segments = text.split(/(<b>.*?<\/b>|<i>.*?<\/i>|<br\s*\/?>)/g).filter(Boolean);

  segments.forEach(segment => {
    if (segment.startsWith("<b>")) {
      // Handle bold text
      const boldText = segment.replace(/<b>|<\/b>/g, ""); // Remove <b> tags
      runs.push(new TextRun({ text: boldText, bold: true, font: "Arial" }));
    } else if (segment.startsWith("<i>")) {
      // Handle italic text
      const italicText = segment.replace(/<i>|<\/i>/g, ""); // Remove <i> tags
      runs.push(new TextRun({ text: italicText, italics: true, font: "Arial" }));
    } else if (segment === "<br>" || segment === "<br/>" || segment === "<br />") {
      // Handle <br> tag by creating a new line
      runs.push(new TextRun({ text: "\n", font: "Arial" }));
    } else {
      // Handle regular text
      runs.push(new TextRun({ text: segment, font: "Arial" }));
    }
  });

  return runs;
};

// Utility function to generate and download Word document in the browser
export const generateWordFromReduxData = (editerdata) => {
  // Check if editerdata has a valid "blocks" array
  if (!editerdata || !Array.isArray(editerdata.blocks)) {
    console.error("Invalid editerdata: Expected an object with a 'blocks' array.");
    return;
  }

  // Initialize an array to hold document elements
  const documentElements = [];

  // Iterate through the blocks and handle different types
  editerdata.blocks.forEach(block => {
    if (block.data) {
      const text = block.data.text ? block.data.text.trim() : "";

      // Handle special styling for text starting with '''
      const isSpecialText = text.startsWith("'''");
      const paragraphStyle = isSpecialText ? {
        shading: {
          fill: "D3D3D3", // Light grey background
          type: ShadingType.CLEAR, // No border
        },
      } : {};

      // Handle header blocks
      if (block.type === 'header') {
        documentElements.push(new Paragraph({
          text: text,
          heading: HeadingLevel[`HEADING_${block.data.level}`],
          spacing: { after: 200 },
          font: "Arial", // Set global font to Arial
        }));
      }

      // Handle paragraph blocks
      else if (block.type === 'paragraph') {
        const runs = parseText(text); // Parse text to handle formatting (bold, italic, br)
        documentElements.push(new Paragraph({
          children: runs,
          shading: paragraphStyle.shading, // Apply shading if needed
          spacing: { after: 200 },
          font: "Arial", // Set global font to Arial
        }));
      }

      // Handle unordered list blocks
      else if (block.type === 'list' && block.data.style === 'unordered') {
        block.data.items.forEach(item => {
          const runs = parseText(item);
          documentElements.push(new Paragraph({
            children: runs,
            bullet: { level: 0 },
            spacing: { after: 200 },
            font: "Arial", // Set global font to Arial
          }));
        });
      }

      // Handle ordered list blocks (appear as unordered)
      else if (block.type === 'list' && block.data.style === 'ordered') {
        block.data.items.forEach(item => {
          const runs = parseText(item);
          documentElements.push(new Paragraph({
            children: runs,
            bullet: { level: 0 }, // Make ordered list appear as bullet list
            spacing: { after: 200 },
            font: "Arial", // Set global font to Arial
          }));
        });
      }
    }
  });

  // Create a new Document with Arial font globally
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: documentElements,
      }
    ]
  });

  // Generate the Word document as a Blob in the browser
  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, "Blago.docx"); // File name "Blago.docx"
    console.log("Word document generated and downloaded successfully!");
  }).catch(error => {
    console.error("Error generating Word document:", error);
  });
};
