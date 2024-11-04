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
      runs.push(new TextRun({ text: boldText, bold: true }));
    } else if (segment.startsWith("<i>")) {
      // Handle italic text
      const italicText = segment.replace(/<i>|<\/i>/g, ""); // Remove <i> tags
      runs.push(new TextRun({ text: italicText, italics: true }));
    } else if (segment === "<br>" || segment === "<br/>" || segment === "<br />") {
      // Handle <br> tag by creating a new line
      runs.push(new TextRun({ text: "\n" }));
    } else {
      // Handle regular text
      runs.push(new TextRun(segment));
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
  let orderedListIndex = 0; // Track the index for ordered lists

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
        }));
      }

      // Handle paragraph blocks
      else if (block.type === 'paragraph') {
        const runs = parseText(text); // Parse text to handle formatting (bold, italic, br)
        documentElements.push(new Paragraph({
          children: runs,
          shading: paragraphStyle.shading, // Apply shading if needed
          spacing: { after: 200 },
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
          }));
        });
      }

      // Handle ordered list blocks
      else if (block.type === 'list' && block.data.style === 'ordered') {
        block.data.items.forEach(item => {
          const runs = parseText(item);
          documentElements.push(new Paragraph({
            children: runs,
            numbering: {
              reference: `num${orderedListIndex}`,
              level: 0,
            },
            spacing: { after: 200 },
          }));
          orderedListIndex++; // Increment the index for ordered lists
        });
      }
    }
  });

  // Create a new Document
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
    saveAs(blob, "Blago.docx"); // File name "output.docx"
    console.log("Word document generated and downloaded successfully!");
  }).catch(error => {
    console.error("Error generating Word document:", error);
  });
};
