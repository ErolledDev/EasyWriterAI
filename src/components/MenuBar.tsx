import React, { useState, useRef, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { Bold, Italic, List, ListOrdered, Quote, Redo, Strikethrough, Undo, Link as LinkIcon, Highlighter, Wand2, AlignLeft, AlignCenter, AlignRight, AlignJustify, Heading1, Heading2, Heading3, Table as TableIcon, Image as ImageIcon, Youtube as YoutubeIcon, FileDown, Palette, Type, Eraser, Eye, MinusSquare, Underline as UnderlineIcon, Subscript as SubscriptIcon, Superscript as SuperscriptIcon, Code, CodeSquare, PanelLeftClose, PanelLeftOpen, Trash2, Copy, Scissors, Search, ZoomIn, ZoomOut, RotateCcw, Download, FileUp, Printer, Share2, Lock, Unlock, Settings, HelpCircle, ListChecks, Hash, AtSign, Moon, Sun, UnderlineIcon as TextDecoration, FileText, FileJson, File as FilePdf, X, AlertCircle } from 'lucide-react';
import { downloadFile, ExportFormat } from '../lib/export';
import { useTheme } from '../context/ThemeContext';

interface MenuBarProps {
  editor: Editor | null;
  onToggleAI: () => void;
}

const MenuBar: React.FC<MenuBarProps> = ({ editor, onToggleAI }) => {
  const [fontSize, setFontSize] = useState('16px');
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [zoom, setZoom] = useState(100);
  const [showSettings, setShowSettings] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [showAlert, setShowAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  const exportMenuRef = useRef<HTMLDivElement>(null);
  const exportButtonRef = useRef<HTMLButtonElement>(null);
  const linkInputRef = useRef<HTMLInputElement>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        exportMenuRef.current &&
        !exportMenuRef.current.contains(event.target as Node) &&
        !exportButtonRef.current?.contains(event.target as Node)
      ) {
        setShowExportMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (showLinkInput && linkInputRef.current) {
      linkInputRef.current.focus();
    }
  }, [showLinkInput]);

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => setShowAlert(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowExportMenu(false);
      setShowLinkInput(false);
      exportButtonRef.current?.focus();
    }
  };

  if (!editor) {
    return null;
  }

  const showNotification = (message: string, type: 'success' | 'error') => {
    setShowAlert({ message, type });
  };

  const handleFontSizeChange = (size: string) => {
    setFontSize(size);
    editor.chain().focus().setFontSize(size).run();
  };

  const handleCopy = () => {
    const content = editor.getHTML();
    navigator.clipboard.writeText(content).then(() => {
      showNotification('Content copied to clipboard', 'success');
    }).catch(() => {
      showNotification('Failed to copy content', 'error');
    });
  };

  const handleCut = () => {
    const content = editor.getHTML();
    navigator.clipboard.writeText(content).then(() => {
      editor.commands.deleteSelection();
      showNotification('Content cut to clipboard', 'success');
    }).catch(() => {
      showNotification('Failed to cut content', 'error');
    });
  };

  const handleLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    setLinkUrl(previousUrl || '');
    setShowLinkInput(true);
  };

  const applyLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      showNotification('Link added successfully', 'success');
    } else {
      editor.chain().focus().unsetLink().run();
    }
    setShowLinkInput(false);
    setLinkUrl('');
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showNotification('Please select an image file', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          const maxWidth = 800;

          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          editor.chain().focus().setImage({
            src: e.target?.result as string,
            width,
            height,
          }).run();
          showNotification('Image added successfully', 'success');
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleYoutubeEmbed = () => {
    const url = window.prompt('Enter the YouTube video URL:');
    if (url) {
      try {
        const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
        if (videoId) {
          editor.chain().focus().setYoutubeVideo({
            src: `https://www.youtube.com/embed/${videoId}`,
            width: 640,
            height: 480,
          }).run();
          showNotification('YouTube video added successfully', 'success');
        } else {
          showNotification('Invalid YouTube URL', 'error');
        }
      } catch (error) {
        showNotification('Failed to add YouTube video', 'error');
      }
    }
  };

  const handleTableInsert = () => {
    const rows = parseInt(window.prompt('Number of rows:', '3') || '3');
    const cols = parseInt(window.prompt('Number of columns:', '3') || '3');
    
    if (!isNaN(rows) && !isNaN(cols) && rows > 0 && cols > 0) {
      editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
      showNotification('Table inserted successfully', 'success');
    } else {
      showNotification('Invalid table dimensions', 'error');
    }
  };

  const handleDownload = async (format: ExportFormat) => {
    try {
      const content = format === 'pdf' 
        ? document.querySelector('.ProseMirror') as HTMLElement 
        : editor.getHTML();
        
      if (!content) {
        showNotification('No content to export', 'error');
        return;
      }

      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `document_${timestamp}`;
      
      await downloadFile(content, filename, format);
      setShowExportMenu(false);
      showNotification(`Document exported as ${format.toUpperCase()}`, 'success');
    } catch (error) {
      showNotification(`Failed to export as ${format.toUpperCase()}`, 'error');
    }
  };

  const handlePrint = () => {
    const content = editor.getHTML();
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Document</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
                line-height: 1.6;
                padding: 40px;
                max-width: 800px;
                margin: 0 auto;
              }
              img {
                max-width: 100%;
                height: auto;
                display: block;
                margin: 2rem auto;
              }
              pre {
                background: #f5f5f5;
                padding: 15px;
                border-radius: 5px;
                overflow-x: auto;
              }
              blockquote {
                border-left: 3px solid #ccc;
                margin: 0;
                padding-left: 15px;
                color: #666;
              }
              table {
                border-collapse: collapse;
                width: 100%;
                margin: 1rem 0;
              }
              th, td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
              }
              th {
                background-color: #f5f5f5;
              }
              @media print {
                body { padding: 0; }
                @page { margin: 2cm; }
              }
            </style>
          </head>
          <body>${content}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 10, 200));
    document.querySelector('.ProseMirror')?.style.setProperty('zoom', `${zoom + 10}%`);
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 10, 50));
    document.querySelector('.ProseMirror')?.style.setProperty('zoom', `${zoom - 10}%`);
  };

  const handleResetZoom = () => {
    setZoom(100);
    document.querySelector('.ProseMirror')?.style.setProperty('zoom', '100%');
  };

  const handleSearch = () => {
    if (!searchQuery) return;

    const element = document.querySelector('.ProseMirror');
    if (!element) return;

    const text = element.textContent || '';
    const searchRegex = new RegExp(searchQuery, 'gi');
    const matches = text.match(searchRegex);

    if (matches) {
      showNotification(`Found ${matches.length} matches`, 'success');
      // Highlight matches
      const range = window.getSelection()?.getRangeAt(0);
      if (range) {
        range.collapse(true);
      }
    } else {
      showNotification('No matches found', 'error');
    }
  };

  return (
    <div className="sticky top-0 z-50 bg-white dark:bg-[#0D1117] border-b border-gray-200 dark:border-gray-800 p-2 flex flex-wrap gap-1 items-center backdrop-blur-sm bg-opacity-95 transition-colors duration-200">
      {/* Text Formatting */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`toolbar-button ${editor.isActive('bold') ? 'active' : ''}`}
        title="Bold (Ctrl+B)"
      >
        <Bold className="w-5 h-5" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`toolbar-button ${editor.isActive('italic') ? 'active' : ''}`}
        title="Italic (Ctrl+I)"
      >
        <Italic className="w-5 h-5" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`toolbar-button ${editor.isActive('strike') ? 'active' : ''}`}
        title="Strikethrough"
      >
        <Strikethrough className="w-5 h-5" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`toolbar-button ${editor.isActive('underline') ? 'active' : ''}`}
        title="Underline (Ctrl+U)"
      >
        <UnderlineIcon className="w-5 h-5" />
      </button>
      
      <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
      
      {/* Font Controls */}
      <select
        value={fontSize}
        onChange={(e) => handleFontSizeChange(e.target.value)}
        className="toolbar-button bg-transparent text-gray-700 dark:text-gray-300"
        title="Font Size"
      >
        {[12, 14, 16, 18, 20, 24, 28, 32].map(size => (
          <option key={size} value={`${size}px`}>{size}px</option>
        ))}
      </select>
      
      <button
        onClick={() => editor.chain().focus().unsetFontSize().run()}
        className="toolbar-button"
        title="Reset Font Size"
      >
        <Type className="w-5 h-5" />
      </button>
      
      <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
      
      {/* Headings */}
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`toolbar-button ${editor.isActive('heading', { level: 1 }) ? 'active' : ''}`}
        title="Heading 1"
      >
        <Heading1 className="w-5 h-5" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`toolbar-button ${editor.isActive('heading', { level: 2 }) ? 'active' : ''}`}
        title="Heading 2"
      >
        <Heading2 className="w-5 h-5" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`toolbar-button ${editor.isActive('heading', { level: 3 }) ? 'active' : ''}`}
        title="Heading 3"
      >
        <Heading3 className="w-5 h-5" />
      </button>
      
      <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
      
      {/* Lists */}
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`toolbar-button ${editor.isActive('bulletList') ? 'active' : ''}`}
        title="Bullet List"
      >
        <List className="w-5 h-5" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`toolbar-button ${editor.isActive('orderedList') ? 'active' : ''}`}
        title="Ordered List"
      >
        <ListOrdered className="w-5 h-5" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        className={`toolbar-button ${editor.isActive('taskList') ? 'active' : ''}`}
        title="Task List"
      >
        <ListChecks className="w-5 h-5" />
      </button>
      
      <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
      
      {/* Alignment */}
      <button
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={`toolbar-button ${editor.isActive({ textAlign: 'left' }) ? 'active' : ''}`}
        title="Align Left"
      >
        <AlignLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={`toolbar-button ${editor.isActive({ textAlign: 'center' }) ? 'active' : ''}`}
        title="Align Center"
      >
        <AlignCenter className="w-5 h-5" />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={`toolbar-button ${editor.isActive({ textAlign: 'right' }) ? 'active' : ''}`}
        title="Align Right"
      >
        <AlignRight className="w-5 h-5" />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        className={`toolbar-button ${editor.isActive({ textAlign: 'justify' }) ? 'active' : ''}`}
        title="Justify"
      >
        <AlignJustify className="w-5 h-5" />
      </button>
      
      <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
      
      {/* Code */}
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`toolbar-button ${editor.isActive('code') ? 'active' : ''}`}
        title="Inline Code"
      >
        <Code className="w-5 h-5" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`toolbar-button ${editor.isActive('codeBlock') ? 'active' : ''}`}
        title="Code Block"
      >
        <CodeSquare className="w-5 h-5" />
      </button>
      
      <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
      
      {/* Insert */}
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`toolbar-button ${editor.isActive('blockquote') ? 'active' : ''}`}
        title="Quote"
      >
        <Quote className="w-5 h-5" />
      </button>
      <button
        onClick={handleLink}
        className={`toolbar-button ${editor.isActive('link') ? 'active' : ''}`}
        title="Add Link"
      >
        <LinkIcon className="w-5 h-5" />
      </button>
      
      {/* Link Input Dialog */}
      {showLinkInput && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 p-4 bg-white dark:bg-[#161B22] rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
          <div className="flex items-center gap-2">
            <input
              ref={linkInputRef}
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="Enter URL"
              className="px-3 bg-white py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-[#0D1117] dark:text-gray-100"
              onKeyDown={(e) => e.key === 'Enter' && applyLink()}
            />
            <button
              onClick={applyLink}
              className="px-3 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              Apply
            </button>
            <button
              onClick={() => setShowLinkInput(false)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
      
      <label className="toolbar-button cursor-pointer" title="Add Image">
        <ImageIcon className="w-5 h-5" />
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleImageUpload}
        />
      </label>
      <button
        onClick={handleYoutubeEmbed}
        className="toolbar-button"
        title="Add YouTube Video"
      >
        <YoutubeIcon className="w-5 h-5" />
      </button>
      <button
        onClick={handleTableInsert}
        className="toolbar-button"
        title="Insert Table"
      >
        <TableIcon className="w-5 h-5" />
      </button>
      
      <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
      
      {/* Formatting */}
      <button
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={`toolbar-button ${editor.isActive('highlight') ? 'active' : ''}`}
        title="Highlight"
      >
        <Highlighter className="w-5 h-5" />
      </button>
      <button
        onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
        className="toolbar-button"
        title="Clear Formatting"
      >
        <Eraser className="w-5 h-5" />
      </button>
      
      <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
      
      {/* Clipboard */}
      <button onClick={handleCopy} className="toolbar-button" title="Copy">
        <Copy className="w-5 h-5" />
      </button>
      <button onClick={handleCut} className="toolbar-button" title="Cut">
        <Scissors className="w-5 h-5" />
      </button>
      
      <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
      
      {/* View Controls */}
      <button
        onClick={() => setShowSearch(!showSearch)}
        className={`toolbar-button ${showSearch ? 'active' : ''}`}
        title="Search"
      >
        <Search className="w-5 h-5" />
      </button>
      {showSearch && (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search..."
            className="px-3 bg-white py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-[#0D1117] dark:text-gray-100"
          />
          <button
            onClick={handleSearch}
            className="toolbar-button"
            title="Find"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      )}
      <button onClick={handleZoomIn} className="toolbar-button" title="Zoom In">
        <ZoomIn className="w-5 h-5" />
      </button>
      <button onClick={handleZoomOut} className="toolbar-button" title="Zoom Out">
        <ZoomOut className="w-5 h-5" />
      </button>
      <button onClick={handleResetZoom} className="toolbar-button" title="Reset Zoom">
        <RotateCcw className="w-5 h-5" />
      </button>
      
      <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
      
      {/* Export */}
      <div className="relative">
        <button
          ref={exportButtonRef}
          className={`toolbar-button ${showExportMenu ? 'active' : ''}`}
          onClick={() => setShowExportMenu(!showExportMenu)}
          aria-expanded={showExportMenu}
          aria-haspopup="true"
          title="Export"
        >
          <FileDown className="w-5 h-5" />
        </button>
        {showExportMenu && (
          <div
            ref={exportMenuRef}
            className="absolute right-0 mt-2 py-2 w-48 bg-white dark:bg-[#161B22] rounded-md shadow-xl border border-gray-200 dark:border-gray-700"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="export-menu-button"
            onKeyDown={handleKeyDown}
            tabIndex={-1}
          >
            <button
              onClick={() => handleDownload('markdown')}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-800 focus:text-gray-900 dark:focus:text-gray-100"
              role="menuitem"
              tabIndex={0}
            >
              <FileText className="w-4 h-4" />
              Markdown (.md)
            </button>
            <button
              onClick={() => handleDownload('html')}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-800 focus:text-gray-900 dark:focus:text-gray-100"
              role="menuitem"
              tabIndex={0}
            >
              <FileJson className="w-4 h-4" />
              HTML (.html)
            </button>
            <button
              onClick={() => handleDownload('txt')}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-800 focus:text-gray-900 dark:focus:text-gray-100"
              role="menuitem"
              tabIndex={0}
            >
              <FileText className="w-4 h-4" />
              Plain Text (.txt)
            </button>
            <button
              onClick={() => handleDownload('pdf')}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-800 focus:text-gray-900 dark:focus:text-gray-100"
              role="menuitem"
              tabIndex={0}
            >
              <FilePdf className="w-4 h-4" />
              PDF (.pdf)
            </button>
          </div>
        )}
      </div>
      
      <button onClick={handlePrint} className="toolbar-button" title="Print">
        <Printer className="w-5 h-5" />
      </button>
      
      <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
      
      {/* History */}
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className="toolbar-button disabled:opacity-50 disabled:cursor-not-allowed"
        title="Undo"
      >
        <Undo className="w-5 h-5" />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className="toolbar-button disabled:opacity-50 disabled:cursor-not-allowed"
        title="Redo"
      >
        <Redo className="w-5 h-5" />
      </button>

      <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />

      {/* AI Menu Toggle */}
      <button
        onClick={onToggleAI}
        className="toolbar-button"
        title="Toggle AI Assistant"
      >
        <Wand2 className="w-5 h-5" />
      </button>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="toolbar-button"
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {theme === 'dark' ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </button>

      {/* Notification */}
      {showAlert && (
        <div
          className={`fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg transition-all duration-300 ${
            showAlert.type === 'success'
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            {showAlert.type === 'success' ? (
              <div className="w-4 h-4 text-white" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span>{showAlert.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuBar;