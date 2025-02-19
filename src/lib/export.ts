import TurndownService from 'turndown';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  emDelimiter: '_',
});

export function convertToMarkdown(html: string): string {
  return turndownService.turndown(html);
}

export function convertToPlainText(html: string): string {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || '';
}

// Convert external image to base64
async function convertImageToBase64(imageUrl: string): Promise<string> {
  try {
    const response = await fetch(imageUrl, {
      mode: 'cors',
      credentials: 'omit'
    });
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting image:', error);
    return imageUrl; // Return original URL if conversion fails
  }
}

// Add image compression function with improved quality
async function compressImage(imageElement: HTMLImageElement): Promise<string> {
  const maxWidth = 800; // Optimal width for PDF documents
  const quality = 0.85; // Increased quality for better resolution

  // Create a new image to handle cross-origin images
  const img = new Image();
  img.crossOrigin = 'anonymous';
  
  try {
    // Convert external images to base64
    if (!imageElement.src.startsWith('data:')) {
      const base64Url = await convertImageToBase64(imageElement.src);
      img.src = base64Url;
    } else {
      img.src = imageElement.src;
    }

    // Wait for image to load
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });

    const canvas = document.createElement('canvas');
    let width = img.naturalWidth;
    let height = img.naturalHeight;

    // Calculate new dimensions while maintaining aspect ratio
    if (width > maxWidth) {
      height = (height * maxWidth) / width;
      width = maxWidth;
    }

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    // Apply image smoothing for better quality
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Draw and compress image
    ctx.drawImage(img, 0, 0, width, height);
    return canvas.toDataURL('image/jpeg', quality);
  } catch (error) {
    console.error('Error compressing image:', error);
    return imageElement.src; // Return original source if compression fails
  }
}

export async function convertToPDF(editorElement: HTMLElement): Promise<Blob> {
  // Create a clone of the editor element to modify for PDF export
  const clone = editorElement.cloneNode(true) as HTMLElement;
  const tempContainer = document.createElement('div');
  tempContainer.appendChild(clone);
  tempContainer.style.position = 'absolute';
  tempContainer.style.left = '-9999px';
  tempContainer.style.background = 'white';
  document.body.appendChild(tempContainer);

  try {
    // Process all images before PDF generation
    const images = clone.getElementsByTagName('img');
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      try {
        // Skip already processed images
        if (img.src.startsWith('data:image')) continue;
        
        // Set crossOrigin for external images
        img.crossOrigin = 'anonymous';
        
        // Convert and compress image
        const compressedDataUrl = await compressImage(img);
        img.src = compressedDataUrl;
        
        // Apply optimal styling for PDF
        img.style.display = 'block';
        img.style.margin = '2rem auto';
        img.style.height = 'auto';
        img.style.maxWidth = '500px';
        img.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
        img.style.borderRadius = '6px';
      } catch (error) {
        console.error('Error processing image:', error);
        continue;
      }
    }

    // Enhanced styling for PDF
    clone.style.padding = '48px';
    clone.style.background = 'white';
    clone.style.color = '#1a1a1a';
    clone.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
    clone.style.lineHeight = '1.6';

    // Enhance heading styles
    const headings = clone.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach(heading => {
      heading.style.color = '#1a1a1a';
      heading.style.background = 'none';
      heading.style.backgroundClip = 'initial';
      heading.style.webkitBackgroundClip = 'initial';
      heading.style.webkitTextFillColor = 'initial';
      heading.style.marginBottom = '1rem';
      heading.style.fontWeight = 'bold';
    });

    // Enhance link styles
    const links = clone.querySelectorAll('a');
    links.forEach(link => {
      link.style.color = '#2563eb';
      link.style.textDecoration = 'underline';
    });

    // Enhance text styles
    const allText = clone.querySelectorAll('p, span, li, td, th, blockquote');
    allText.forEach(element => {
      (element as HTMLElement).style.color = '#1a1a1a';
      (element as HTMLElement).style.marginBottom = '1rem';
    });

    // Enhance code blocks
    const codeBlocks = clone.querySelectorAll('pre, code');
    codeBlocks.forEach(block => {
      (block as HTMLElement).style.backgroundColor = '#f8f9fa';
      (block as HTMLElement).style.padding = '1rem';
      (block as HTMLElement).style.borderRadius = '4px';
      (block as HTMLElement).style.fontFamily = 'Monaco, Consolas, "Liberation Mono", monospace';
      (block as HTMLElement).style.fontSize = '0.9em';
    });

    // Enhance tables
    const tables = clone.querySelectorAll('table');
    tables.forEach(table => {
      table.style.borderCollapse = 'collapse';
      table.style.width = '100%';
      table.style.marginBottom = '1.5rem';
      
      const cells = table.querySelectorAll('td, th');
      cells.forEach(cell => {
        (cell as HTMLElement).style.border = '1px solid #e2e8f0';
        (cell as HTMLElement).style.padding = '0.75rem';
      });
    });

    // Capture with optimized settings
    const canvas = await html2canvas(clone, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      allowTaint: false,
      logging: false,
      backgroundColor: 'white',
      imageTimeout: 15000,
      onclone: (clonedDoc) => {
        // Additional styling for the cloned document
        const style = clonedDoc.createElement('style');
        style.innerHTML = `
          * { -webkit-print-color-adjust: exact !important; }
          @page { margin: 0; }
        `;
        clonedDoc.head.appendChild(style);
      }
    });

    // Calculate PDF dimensions (A4)
    const imgWidth = 595.28; // A4 width in points
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const pdf = new jsPDF({
      orientation: imgHeight > imgWidth ? 'p' : 'l',
      unit: 'pt',
      format: [imgWidth, imgHeight],
      compress: true,
      hotfixes: ['px_scaling']
    });

    // Add image with improved quality
    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');

    return pdf.output('blob');
  } catch (error) {
    console.error('PDF generation error:', error);
    throw error;
  } finally {
    if (document.body.contains(tempContainer)) {
      document.body.removeChild(tempContainer);
    }
  }
}

export type ExportFormat = 'markdown' | 'html' | 'txt' | 'pdf';

export async function downloadFile(
  content: string | HTMLElement,
  filename: string,
  format: ExportFormat
) {
  let blob: Blob;
  let finalFilename = filename;

  switch (format) {
    case 'markdown':
      if (typeof content === 'string') {
        const markdown = convertToMarkdown(content);
        blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
        finalFilename = filename.endsWith('.md') ? filename : `${filename}.md`;
      } else {
        throw new Error('HTML element provided for markdown conversion');
      }
      break;

    case 'html':
      if (typeof content === 'string') {
        blob = new Blob([content], { type: 'text/html;charset=utf-8' });
        finalFilename = filename.endsWith('.html') ? filename : `${filename}.html`;
      } else {
        throw new Error('HTML element provided for HTML conversion');
      }
      break;

    case 'txt':
      if (typeof content === 'string') {
        const plainText = convertToPlainText(content);
        blob = new Blob([plainText], { type: 'text/plain;charset=utf-8' });
        finalFilename = filename.endsWith('.txt') ? filename : `${filename}.txt`;
      } else {
        throw new Error('HTML element provided for text conversion');
      }
      break;

    case 'pdf':
      if (content instanceof HTMLElement) {
        blob = await convertToPDF(content);
        finalFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
      } else {
        throw new Error('String content provided for PDF conversion');
      }
      break;

    default:
      throw new Error('Unsupported export format');
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = finalFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}