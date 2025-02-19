import React, { useState } from 'react';
import { Wand2 } from 'lucide-react';
import { generateAIResponse, aiActions } from '../lib/gemini';
import { Editor } from '@tiptap/react';

interface AIMenuProps {
  editor: Editor;
  isOpen: boolean;
  onClose: () => void;
}

export default function AIMenu({ editor, isOpen, onClose }: AIMenuProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const selectedText = editor.state.selection.empty
    ? editor.getText()
    : editor.state.doc.textBetween(
        editor.state.selection.from,
        editor.state.selection.to
      );

  const handleAIAction = async (actionKey: string) => {
    if (!selectedText.trim()) return;

    try {
      setLoading(true);
      const result = await generateAIResponse(selectedText, actionKey as any);
      
      if (editor.state.selection.empty) {
        editor.commands.setContent(result);
      } else {
        editor.commands.deleteSelection();
        editor.commands.insertContent(result);
      }
      
      onClose();
    } catch (error) {
      console.error('AI generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed right-8 top-32 w-64 bg-[#1D1D1D] rounded-lg shadow-xl border border-gray-700 z-50 max-h-[80vh] overflow-hidden flex flex-col">
      <div className="p-3 border-b border-gray-700 flex items-center justify-between bg-[#2D2D2D]">
        <div className="flex items-center gap-2">
          <Wand2 className="w-4 h-4 text-purple-400" />
          <span className="font-medium text-purple-400">AI Assistant</span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-300"
        >
          ×
        </button>
      </div>
      
      <div className="overflow-y-auto flex-1">
        {loading ? (
          <div className="p-4 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-400">Generating content...</p>
          </div>
        ) : (
          <div className="p-2">
            {aiActions.map(category => (
              <div key={category.type} className="mb-4">
                <div className="text-xs font-medium text-purple-400 uppercase tracking-wider mb-2 px-2">
                  {category.type}
                </div>
                <div className="space-y-1">
                  {category.actions.map(action => (
                    <button
                      key={action.key}
                      onClick={() => handleAIAction(action.key)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-[#2D2D2D] rounded transition-colors flex items-center gap-2 text-gray-300 hover:text-purple-400"
                    >
                      <span className="w-1 h-1 rounded-full bg-purple-400"></span>
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}