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

// Add image compression function
async function compressImage(imageElement: HTMLImageElement): Promise<string> {
  const maxWidth = 1200; // Maximum width for images
  const quality = 0.7; // Image quality (0.1 to 1.0)

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
      } catch (error) {
        console.error('Error processing image:', error);
        // Continue with other images if one fails
        continue;
      }
    }

    // Add margins and styling
    clone.style.padding = '40px';
    clone.style.background = 'white';
    clone.style.color = '#1a1a1a';

    // Fix heading colors
    const headings = clone.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach(heading => {
      heading.style.color = '#1a1a1a';
      heading.style.background = 'none';
      heading.style.backgroundClip = 'initial';
      heading.style.webkitBackgroundClip = 'initial';
      heading.style.webkitTextFillColor = 'initial';
    });

    // Ensure links are visible
    const links = clone.querySelectorAll('a');
    links.forEach(link => {
      link.style.color = '#2563eb';
      link.style.textDecoration = 'underline';
    });

    // Ensure all text is visible
    const allText = clone.querySelectorAll('p, span, li, td, th, blockquote');
    allText.forEach(element => {
      (element as HTMLElement).style.color = '#1a1a1a';
    });

    // Capture with optimized settings
    const canvas = await html2canvas(clone, {
      scale: 1.5, // Reduced from 2 to optimize size
      useCORS: true,
      allowTaint: false,
      logging: false,
      backgroundColor: 'white',
      imageTimeout: 15000, // Increased timeout for image processing
    });

    // Calculate PDF dimensions
    const imgWidth = 595.28; // A4 width in points
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const pdf = new jsPDF({
      orientation: imgHeight > imgWidth ? 'p' : 'l',
      unit: 'pt',
      format: [imgWidth, imgHeight],
      compress: true, // Enable PDF compression
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.7); // Use JPEG with compression
    pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);

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