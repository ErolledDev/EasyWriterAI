import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Typography from '@tiptap/extension-typography';
import Underline from '@tiptap/extension-underline';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import FontFamily from '@tiptap/extension-font-family';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import HardBreak from '@tiptap/extension-hard-break';
import History from '@tiptap/extension-history';
import Strike from '@tiptap/extension-strike';
import ListItem from '@tiptap/extension-list-item';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Mention from '@tiptap/extension-mention';
import CharacterCount from '@tiptap/extension-character-count';
import { FontSize } from '../lib/extensions/fontSize';
import {
  Bold, Italic, List, ListOrdered, Quote, Redo, Strikethrough, Undo,
  Link as LinkIcon, Highlighter, Wand2, AlignLeft, AlignCenter, AlignRight,
  AlignJustify, Heading1, Heading2, Heading3, Table as TableIcon,
  Image as ImageIcon, Youtube as YoutubeIcon, FileDown, Palette, Type,
  Eraser, Eye, MinusSquare, Underline as UnderlineIcon,
  Subscript as SubscriptIcon, Superscript as SuperscriptIcon,
  Code, CodeSquare, PanelLeftClose, PanelLeftOpen, Trash2,
  Copy, Scissors, Search, ZoomIn, ZoomOut, RotateCcw, Download,
  FileUp, Printer, Share2, Lock, Unlock, Settings, HelpCircle,
  ListChecks, Hash, AtSign, ChevronUp
} from 'lucide-react';
import { useState, useCallback, useRef, useEffect } from 'react';
import AIMenu from './AIMenu';
import { convertToMarkdown, downloadFile } from '../lib/export';

const Tooltip = ({ children, text }: { children: React.ReactNode; text: string }) => {
  return (
    <div className="group relative">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
        {text}
      </div>
    </div>
  );
};

const MenuBar = ({ editor }: { editor: any }) => {
  const [showAIMenu, setShowAIMenu] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontSize, setShowFontSize] = useState(false);
  const [showFontFamily, setShowFontFamily] = useState(false);
  const [isFullWidth, setIsFullWidth] = useState(true);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!editor) return null;

  const handleCopy = () => {
    const text = editor.state.selection.empty
      ? editor.getText()
      : editor.state.doc.textBetween(
          editor.state.selection.from,
          editor.state.selection.to
        );
    navigator.clipboard.writeText(text);
  };

  const handleCut = () => {
    handleCopy();
    if (!editor.state.selection.empty) {
      editor.commands.deleteSelection();
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
              body { font-family: Arial, sans-serif; padding: 20px; }
              img { max-width: 100%; height: auto; }
            </style>
          </head>
          <body>${content}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleSearch = () => {
    const searchTerm = searchInputRef.current?.value;
    if (!searchTerm) return;

    const text = editor.getText();
    const regex = new RegExp(searchTerm, 'gi');
    let match;
    const positions: number[] = [];

    while ((match = regex.exec(text)) !== null) {
      positions.push(match.index);
    }

    editor.commands.unsetHighlight();
    positions.forEach(pos => {
      editor.commands.setTextSelection({ from: pos, to: pos + searchTerm.length });
      editor.commands.setHighlight();
    });
  };

  const addLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL', previousUrl);
    
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().unsetLink().run();
      return;
    }

    editor.chain().focus().setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt('Enter image URL');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addYoutubeVideo = () => {
    const url = window.prompt('Enter YouTube video URL');
    if (url) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run();
    }
  };

  const insertTable = () => {
    const rows = window.prompt('Number of rows:', '3');
    const cols = window.prompt('Number of columns:', '3');
    
    if (rows && cols) {
      editor.chain().focus().insertTable({ 
        rows: parseInt(rows), 
        cols: parseInt(cols), 
        withHeaderRow: true 
      }).run();
    }
  };

  const handleExport = (format: 'markdown' | 'html' | 'text') => {
    const content = format === 'html' 
      ? editor.getHTML()
      : format === 'markdown'
        ? convertToMarkdown(editor.getHTML())
        : editor.getText();
    
    downloadFile(content, `document.${format === 'text' ? 'txt' : format}`);
  };

  const clearContent = () => {
    if (window.confirm('Are you sure you want to clear all content?')) {
      editor.chain().focus().clearContent().run();
    }
  };

  const handleZoom = (direction: 'in' | 'out') => {
    const newZoom = direction === 'in' ? zoom + 10 : zoom - 10;
    setZoom(Math.max(50, Math.min(200, newZoom)));
    const editorElement = document.querySelector('.ProseMirror');
    if (editorElement) {
      (editorElement as HTMLElement).style.transform = `scale(${newZoom / 100})`;
      (editorElement as HTMLElement).style.transformOrigin = 'top left';
    }
  };

  return (
    <div ref={toolbarRef} className="sticky top-0 z-50 bg-[#0D1117] border-b border-gray-700 shadow-lg">
      {/* Main Toolbar */}
      <div className="p-2 flex flex-wrap gap-2 border-b border-gray-700">
        {/* File Operations */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-700">
          <Tooltip text="New Document">
            <button
              onClick={clearContent}
              className="p-2 rounded hover:bg-purple-500/20 text-gray-400 hover:text-purple-300 transition-all duration-200"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip text="Import File">
            <button className="p-2 rounded hover:bg-purple-500/20 text-gray-400 hover:text-purple-300 transition-all duration-200">
              <FileUp className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip text="Export">
            <div className="relative group">
              <button className="p-2 rounded hover:bg-purple-500/20 text-gray-400 hover:text-purple-300 transition-all duration-200">
                <FileDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 mt-1 bg-[#161B22] rounded-lg shadow-lg border border-gray-700 hidden group-hover:block z-50">
                <button
                  onClick={() => handleExport('markdown')}
                  className="block w-full px-4 py-2 text-sm text-left text-gray-300 hover:bg-purple-500/20 hover:text-purple-300 transition-all duration-200"
                >
                  Export as Markdown
                </button>
                <button
                  onClick={() => handleExport('html')}
                  className="block w-full px-4 py-2 text-sm text-left text-gray-300 hover:bg-purple-500/20 hover:text-purple-300 transition-all duration-200"
                >
                  Export as HTML
                </button>
                <button
                  onClick={() => handleExport('text')}
                  className="block w-full px-4 py-2 text-sm text-left text-gray-300 hover:bg-purple-500/20 hover:text-purple-300 transition-all duration-200"
                >
                  Export as Text
                </button>
              </div>
            </div>
          </Tooltip>
        </div>

        {/* Edit Operations */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-700">
          <Tooltip text="Copy">
            <button
              onClick={handleCopy}
              className="p-2 rounded hover:bg-purple-500/20 text-gray-400 hover:text-purple-300 transition-all duration-200"
            >
              <Copy className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip text="Cut">
            <button
              onClick={handleCut}
              className="p-2 rounded hover:bg-purple-500/20 text-gray-400 hover:text-purple-300 transition-all duration-200"
            >
              <Scissors className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>

        {/* Text Style */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-700">
          <Tooltip text="Bold">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-2 rounded hover:bg-purple-500/20 text-gray-400 hover:text-purple-300 transition-all duration-200 ${
                editor.isActive('bold') ? 'bg-purple-500/20 text-purple-300' : ''
              }`}
            >
              <Bold className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip text="Italic">
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-2 rounded hover:bg-purple-500/20 text-gray-400 hover:text-purple-300 transition-all duration-200 ${
                editor.isActive('italic') ? 'bg-purple-500/20 text-purple-300' : ''
              }`}
            >
              <Italic className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip text="Underline">
            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`p-2 rounded hover:bg-purple-500/20 text-gray-400 hover:text-purple-300 transition-all duration-200 ${
                editor.isActive('underline') ? 'bg-purple-500/20 text-purple-300' : ''
              }`}
            >
              <UnderlineIcon className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip text="Strikethrough">
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`p-2 rounded hover:bg-purple-500/20 text-gray-400 hover:text-purple-300 transition-all duration-200 ${
                editor.isActive('strike') ? 'bg-purple-500/20 text-purple-300' : ''
              }`}
            >
              <Strikethrough className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>

        {/* Font Controls */}
        <div className="flex items-center gap-2 pr-2 border-r border-gray-700">
          <div className="relative">
            <Tooltip text="Font Family">
              <button
                onClick={() => setShowFontFamily(!showFontFamily)}
                className="p-2 rounded hover:bg-purple-500/20 text-gray-400 hover:text-purple-300 transition-all duration-200 flex items-center gap-1 min-w-[120px]"
              >
                <Type className="w-4 h-4" />
                <span className="text-sm">Font Family</span>
              </button>
            </Tooltip>
            {showFontFamily && (
              <div className="absolute top-full left-0 mt-1 p-2 bg-[#161B22] rounded-lg shadow-lg border border-gray-700 z-50 w-48 max-h-60 overflow-y-auto scrollbar-thin">
                {FONT_FAMILIES.map(font => (
                  <button
                    key={font}
                    onClick={() => {
                      editor.chain().focus().setFontFamily(font).run();
                      setShowFontFamily(false);
                    }}
                    className="block w-full text-left px-2 py-1 text-sm text-gray-300 hover:bg-purple-500/20 hover:text-purple-300 rounded transition-all duration-200"
                    style={{ fontFamily: font }}
                  >
                    {font}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <Tooltip text="Font Size">
              <button
                onClick={() => setShowFontSize(!showFontSize)}
                className="p-2 rounded hover:bg-purple-500/20 text-gray-400 hover:text-purple-300 transition-all duration-200 flex items-center gap-1 min-w-[100px]"
              >
                <span className="text-sm">Font Size</span>
              </button>
            </Tooltip>
            {showFontSize && (
              <div className="absolute top-full left-0 mt-1 p-2 bg-[#161B22] rounded-lg shadow-lg border border-gray-700 z-50 w-32 max-h-60 overflow-y-auto scrollbar-thin">
                {FONT_SIZES.map(size => (
                  <button
                    key={size}
                    onClick={() => {
                      editor.chain().focus().setFontSize(size).run();
                      setShowFontSize(false);
                    }}
                    className="block w-full text-left px-2 py-1 text-sm text-gray-300 hover:bg-purple-500/20 hover:text-purple-300 rounded transition-all duration-200"
                    style={{ fontSize: size }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <Tooltip text="Text Color">
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="p-2 rounded hover:bg-purple-500/20 text-gray-400 hover:text-purple-300 transition-all duration-200"
              >
                <Palette className="w-4 h-4" />
              </button>
            </Tooltip>
            {showColorPicker && (
              <div className="absolute top-full left-0 mt-1 p-2 bg-[#161B22] rounded-lg shadow-lg border border-gray-700 z-50 w-56">
                <div className="grid grid-cols-8 gap-1">
                  {[
                    '#000000', '#434343', '#666666', '#999999', '#B7B7B7', '#CCCCCC', '#D9D9D9', '#FFFFFF',
                    '#FF0000', '#FF9C00', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#9C00FF', '#FF00FF',
                    '#F44E3B', '#FE9200', '#FCDC00', '#DBDF00', '#A4DD00', '#68CCCA', '#73D8FF', '#AEA1FF',
                    '#FDA1FF', '#333333', '#808080', '#cccccc', '#D33115', '#E27300', '#FCC400', '#B0BC00'
                  ].map(color => (
                    <button
                      key={color}
                      onClick={() => {
                        editor.chain().focus().setColor(color).run();
                        setShowColorPicker(false);
                      }}
                      className="w-6 h-6 rounded border border-gray-600 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-700">
          <Tooltip text="Zoom In">
            <button
              onClick={() => handleZoom('in')}
              className="p-2 rounded hover:bg-purple-500/20 text-gray-400 hover:text-purple-300 transition-all duration-200"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip text="Zoom Out">
            <button
              onClick={() => handleZoom('out')}
              className="p-2 rounded hover:bg-purple-500/20 text-gray-400 hover:text-purple-300 transition-all duration-200"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </Tooltip>
          <span className="text-sm text-gray-400">{zoom}%</span>
        </div>

        {/* Search */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-700">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search..."
            className="px-2 py-1 text-sm border border-gray-700 rounded bg-[#161B22] text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 placeholder-gray-500"
          />
          <Tooltip text="Search">
            <button
              onClick={handleSearch}
              className="p-2 rounded hover:bg-purple-500/20 text-gray-400 hover:text-purple-300 transition-all duration-200"
            >
              <Search className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>

        {/* Right-aligned tools */}
        <div className="flex items-center gap-2 ml-auto">
          <Tooltip text="Print">
            <button
              onClick={handlePrint}
              className="p-2 rounded hover:bg-purple-500/20 text-gray-400 hover:text-purple-300 transition-all duration-200"
            >
              <Printer className="w-4 h-4" />
            </button>
          </Tooltip>

          <Tooltip text="Share">
            <button className="p-2 rounded hover:bg-purple-500/20 text-gray-400 hover:text-purple-300 transition-all duration-200">
              <Share2 className="w-4 h-4" />
            </button>
          </Tooltip>

          <Tooltip text={isReadOnly ? "Unlock Editing" : "Lock Editing"}>
            <button
              onClick={() => {
                setIsReadOnly(!isReadOnly);
                editor.setEditable(!isReadOnly);
              }}
              className="p-2 rounded hover:bg-purple-500/20 text-gray-400 hover:text-purple-300 transition-all duration-200"
            >
              {isReadOnly ? (
                <Lock className="w-4 h-4" />
              ) : (
                <Unlock className="w-4 h-4" />
              )}
            </button>
          </Tooltip>

          <Tooltip text="Settings">
            <button className="p-2 rounded hover:bg-purple-500/20 text-gray-400 hover:text-purple-300 transition-all duration-200">
              <Settings className="w-4 h-4" />
            </button>
          </Tooltip>

          <Tooltip text="Help">
            <button className="p-2 rounded hover:bg-purple-500/20 text-gray-400 hover:text-purple-300 transition-all duration-200">
              <HelpCircle className="w-4 h-4" />
            </button>
          </Tooltip>

          <Tooltip text="AI Assistant">
            <button
              onClick={() => setShowAIMenu(!showAIMenu)}
              className={`p-2 rounded hover:bg-purple-500/20 transition-all duration-200 ${
                showAIMenu ? 'bg-purple-500/20 text-purple-300' : 'text-gray-400 hover:text-purple-300'
              }`}
            >
              <Wand2 className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Secondary Toolbar */}
      <div className="p-2 flex flex-wrap gap-2">
        {/* Lists and Quotes */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-700">
          <Tooltip text="Bullet List">
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-2 rounded hover:bg-purple-500/20 text-gray-400 hover:text-purple-300 transition-all duration-200 ${
                editor.isActive('bulletList') ? 'bg-purple-500/20 text-purple-300' : ''
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip text="Numbered List">
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-2 rounded hover:bg-purple-500/20 text-gray-400 hover:text-purple-300 transition-all duration-200 ${
                editor.isActive('orderedList') ? 'bg-purple-500/20 text-purple-300' : ''
              }`}
            >
              <ListOrdered className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip text="Quote">
            <button
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`p-2 rounded hover:bg-purple-500/20 text-gray-400 hover:text-purple-300 transition-all duration-200 ${
                editor.isActive('blockquote') ? 'bg-purple-500/20 text-purple-300' : ''
              }`}
            >
              <Quote className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>

        {/* Script Controls */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-700">
          <Tooltip text="Subscript">
            <button
              onClick={() => editor.chain().focus().toggleSubscript().run()}
              className={`p-2 rounded hover:bg-purple-500/20 text-gray-400 hover:text-purple-300 transition-all duration-200 ${
                editor.isActive('subscript') ? 'bg-purple-500/20 text-purple-300' : ''
              }`}
            >
              <SubscriptIcon className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip text="Superscript">
            <button
              onClick={() => editor.chain().focus().toggleSuperscript().run()}
              className={`p-2 rounded hover:bg-purple-500/20 text-gray-400 hover:text-purple-300 transition-all duration-200 ${
                editor.isActive('superscript') ? 'bg-purple-500/20 text-purple-300' : ''
              }`}
            >
              <SuperscriptIcon className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>

        {/* Code */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-700">
          <Tooltip text="Inline Code">
            <button
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={`p-2 rounded hover:bg-purple-500/20 text-gray-400 hover:text-purple-300 transition-all duration-200 ${
                editor.isActive('code') ? 'bg-purple-500/20 text-purple-300' : ''
              }`}
            >
              <Code className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip text="Code Block">
            <button
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={`p-2 rounded hover:bg-purple-500/20 text-gray-400 hover:text-purple-300 transition-all duration-200 ${
                editor.isActive('codeBlock') ? 'bg-purple-500/20 text-purple-300' : ''
              }`}
            >
              <CodeSquare className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>

        {/* Insert Tools */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-700">
          <Tooltip text="Insert Link">
            <button
              onClick={addLink}
              className={`p-2 rounded hover:bg-purple-500/20 text-gray-400 hover:text-purple-300 transition-all duration-200 ${
                editor.isActive('link') ? 'bg-purple-500/20 text-purple-300' : ''
              }`}
            >
              <LinkIcon className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip text="Insert Table">
            <button
              onClick={insertTable}
              className={`p-2 rounded hover:bg-purple-500/20 text-gray-400 hover:text-purple-300 transition-all duration-200 ${
                editor.isActive('table') ? 'bg-purple-500/20 text-purple-300' : ''
              }`}
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip text="Insert Image">
            <button
              onClick={addImage}
              className="p-2 rounded hover:bg-purple-500/20 text-gray-400 hover:text-purple-300 transition-all duration-200"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip text="Insert YouTube Video">
            <button
              onClick={addYoutubeVideo}
              className="p-2 rounded hover:bg-purple-500/20 text-gray-400 hover:text-purple-300 transition-all duration-200"
            >
              <YoutubeIcon className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip text="Insert Horizontal Rule">
            <button
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              className="p-2 rounded hover:bg-purple-500/20 text-gray-400 hover:text-purple-300 transition-all duration-200"
            >
              <MinusSquare className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>

        {/* Formatting Tools */}
        <div className="flex items-center gap-1">
          <Tooltip text="Highlight">
            <button
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              className={`p-2 rounded hover:bg-purple-500/20 text-gray-400 hover:text-purple-300 transition-all duration-200 ${
                editor.isActive('highlight') ? 'bg-purple-500/20 text-purple-300' : ''
              }`}
            >
              <Highlighter className="w-4 h-4" />
            </button>
          </Tooltip>
           Continuing the Editor.tsx file content exactly where we left off:

          <Tooltip text="Clear Formatting">
            <button
              onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
              className="p-2 rounded hover:bg-purple-500/20 text-gray-400 hover:text-purple-300 transition-all duration-200"
            >
              <Eraser className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-full shadow-lg transition-all duration-200 z-50 backdrop-blur-sm border border-purple-500/20"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

const FONT_SIZES = [
  '8px', '9px', '10px', '11px', '12px', '14px', '16px', '18px', '20px', 
  '22px', '24px', '26px', '28px', '36px', '48px', '72px'
];

const FONT_FAMILIES = [
  'Arial', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana',
  'Helvetica', 'Tahoma', 'Trebuchet MS', 'Impact', 'Comic Sans MS'
];

const Editor = () => {
  const [showAIMenu, setShowAIMenu] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  
  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      HardBreak,
      History,
      StarterKit.configure({
        document: false,
        paragraph: false,
        text: false,
        hardBreak: false,
        history: false,
      }),
      Highlight,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-400 hover:text-blue-300',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full rounded-lg shadow-md',
        },
      }),
      Youtube.configure({
        width: 640,
        height: 480,
        HTMLAttributes: {
          class: 'w-full aspect-video rounded-lg shadow-md',
        },
      }),
      TextStyle,
      Color,
      Typography,
      Underline,
      Subscript,
      Superscript,
      FontFamily,
      FontSize,
      Strike,
      ListItem,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Mention.configure({
        HTMLAttributes: {
          class: 'mention',
        },
        suggestion: {
          items: query => {
            return [
              'Sarah Johnson',
              'Michael Brown',
              'Emily Davis',
              'David Wilson',
              'Lisa Anderson',
            ].filter(item => item.toLowerCase().startsWith(query.toLowerCase())).slice(0, 5);
          },
        },
      }),
      CharacterCount.configure({
        limit: 10000,
      }),
      Placeholder.configure({
        placeholder: 'Write something amazing...',
      }),
    ],
    editorProps: {
      attributes: {
        class:
          'prose prose-invert prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none p-4 min-h-[200px]',
      },
    },
    onUpdate: ({ editor }) => {
      setCharacterCount(editor.storage.characterCount.characters());
    },
    onFocus: () => {
      setShowAIMenu(true);
    },
  });

  return (
    <div className="w-full mx-auto bg-[#1D1D1D] rounded-lg shadow-xl overflow-hidden border border-gray-700">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
      <div className="px-4 py-2 border-t border-gray-700 flex justify-between items-center text-sm text-gray-400 bg-[#2D2D2D]">
        <div>
          Characters: {characterCount}
          {editor?.storage.characterCount.limit && (
            <span> / {editor.storage.characterCount.limit()}</span>
          )}
        </div>
        <div>
          Words: {editor?.storage.characterCount.words()}
        </div>
      </div>
      <AIMenu
        editor={editor}
        isOpen={showAIMenu}
        onClose={() => setShowAIMenu(false)}
      />
    </div>
  );
};

export default Editor;