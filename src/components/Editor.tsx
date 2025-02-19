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
import { useState } from 'react';
import AIMenu from './AIMenu';
import MenuBar from './MenuBar';

const Editor = () => {
  const [showAIMenu, setShowAIMenu] = useState(true);
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
          'prose prose-invert prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none p-8 min-h-[calc(100vh-13rem)] bg-white dark:bg-[#0D1117] text-gray-900 dark:text-gray-100 transition-colors duration-200',
      },
    },
    onUpdate: ({ editor }) => {
      setCharacterCount(editor.storage.characterCount.characters());
    },
  });

  return (
    <div className="w-full bg-white dark:bg-[#1D1D1D] shadow-xl border-t border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
      <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-[#2D2D2D] sticky bottom-0 transition-colors duration-200">
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