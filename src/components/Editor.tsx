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
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo,
  Strikethrough,
  Undo,
  Link as LinkIcon,
  Highlighter,
  Wand2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Heading1,
  Heading2,
  Table as TableIcon,
  Image as ImageIcon,
  Youtube as YoutubeIcon,
  FileDown,
  Palette,
  Type,
  Eraser,
  Eye,
} from 'lucide-react';
import { useState } from 'react';
import AIMenu from './AIMenu';
import { convertToMarkdown, downloadFile } from '../lib/export';

const MenuBar = ({ editor }: { editor: any }) => {
  const [showAIMenu, setShowAIMenu] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt('Enter URL');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
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
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const handleExport = (format: 'markdown' | 'html' | 'text') => {
    const content = format === 'html' 
      ? editor.getHTML()
      : format === 'markdown'
        ? convertToMarkdown(editor.getHTML())
        : editor.getText();
    
    downloadFile(content, `document.${format === 'text' ? 'txt' : format}`);
  };

  return (
    <div className="border-b border-gray-200">
      <div className="p-2 flex flex-wrap gap-1 border-b border-gray-200">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive('bold') ? 'bg-gray-100' : ''
          }`}
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive('italic') ? 'bg-gray-100' : ''
          }`}
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive('strike') ? 'bg-gray-100' : ''
          }`}
        >
          <Strikethrough className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive('heading', { level: 1 }) ? 'bg-gray-100' : ''
          }`}
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive('heading', { level: 2 }) ? 'bg-gray-100' : ''
          }`}
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive({ textAlign: 'left' }) ? 'bg-gray-100' : ''
          }`}
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive({ textAlign: 'center' }) ? 'bg-gray-100' : ''
          }`}
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive({ textAlign: 'right' }) ? 'bg-gray-100' : ''
          }`}
        >
          <AlignRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive({ textAlign: 'justify' }) ? 'bg-gray-100' : ''
          }`}
        >
          <AlignJustify className="w-4 h-4" />
        </button>
      </div>

      <div className="p-2 flex flex-wrap gap-1">
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive('bulletList') ? 'bg-gray-100' : ''
          }`}
        >
          <List className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive('orderedList') ? 'bg-gray-100' : ''
          }`}
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive('blockquote') ? 'bg-gray-100' : ''
          }`}
        >
          <Quote className="w-4 h-4" />
        </button>
        <button
          onClick={addLink}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive('link') ? 'bg-gray-100' : ''
          }`}
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        <button
          onClick={insertTable}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive('table') ? 'bg-gray-100' : ''
          }`}
        >
          <TableIcon className="w-4 h-4" />
        </button>
        <button
          onClick={addImage}
          className="p-2 rounded hover:bg-gray-100"
        >
          <ImageIcon className="w-4 h-4" />
        </button>
        <button
          onClick={addYoutubeVideo}
          className="p-2 rounded hover:bg-gray-100"
        >
          <YoutubeIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive('highlight') ? 'bg-gray-100' : ''
          }`}
        >
          <Highlighter className="w-4 h-4" />
        </button>
        <div className="relative">
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="p-2 rounded hover:bg-gray-100"
          >
            <Palette className="w-4 h-4" />
          </button>
          {showColorPicker && (
            <div className="absolute top-full left-0 mt-1 p-2 bg-white rounded-lg shadow-lg border border-gray-200 grid grid-cols-5 gap-1">
              {['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#808080', '#800000', '#008000'].map(color => (
                <button
                  key={color}
                  onClick={() => {
                    editor.chain().focus().setColor(color).run();
                    setShowColorPicker(false);
                  }}
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          )}
        </div>
        <button
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          className="p-2 rounded hover:bg-gray-100"
          title="Clear formatting"
        >
          <Eraser className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().undo().run()}
          className="p-2 rounded hover:bg-gray-100"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          className="p-2 rounded hover:bg-gray-100"
        >
          <Redo className="w-4 h-4" />
        </button>
        
        <div className="relative ml-auto">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`p-2 rounded hover:bg-gray-100 ${
              showPreview ? 'bg-gray-100' : ''
            }`}
            title="Preview"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowAIMenu(!showAIMenu)}
            className={`p-2 rounded hover:bg-purple-100 ${
              showAIMenu ? 'bg-purple-100' : ''
            }`}
            title="AI Writing Assistant"
          >
            <Wand2 className="w-4 h-4 text-purple-600" />
          </button>
        </div>

        <div className="relative group">
          <button
            className="p-2 rounded hover:bg-gray-100"
            title="Export"
          >
            <FileDown className="w-4 h-4" />
          </button>
          <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 hidden group-hover:block">
            <button
              onClick={() => handleExport('markdown')}
              className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
            >
              Export as Markdown
            </button>
            <button
              onClick={() => handleExport('html')}
              className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
            >
              Export as HTML
            </button>
            <button
              onClick={() => handleExport('text')}
              className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
            >
              Export as Text
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Editor() {
  const [showAIMenu, setShowAIMenu] = useState(false);
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight,
      Link,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Image,
      Youtube,
      TextStyle,
      Color,
      Typography,
      Placeholder.configure({
        placeholder: 'Write something amazing...',
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none p-4 min-h-[200px]',
      },
    },
    onFocus: () => {
      setShowAIMenu(true);
    },
  });

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
      <AIMenu
        editor={editor}
        isOpen={showAIMenu}
        onClose={() => setShowAIMenu(false)}
      />
    </div>
  );
}