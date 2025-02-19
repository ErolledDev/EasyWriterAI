import React, { useState } from 'react';
import { Wand2, Sparkles } from 'lucide-react';
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
    <div className="fixed right-8 top-32 w-72 bg-gradient-to-b from-[#1a1a1a] to-[#0D0D0D] rounded-xl shadow-2xl border border-purple-500/20 z-50 max-h-[80vh] overflow-hidden flex flex-col backdrop-blur-sm">
      <div className="p-4 border-b border-purple-500/20 flex items-center justify-between bg-gradient-to-r from-purple-500/10 to-blue-500/10">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Wand2 className="w-5 h-5 text-purple-400" />
            <Sparkles className="w-3 h-3 text-blue-400 absolute -top-1 -right-1" />
          </div>
          <span className="font-medium bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">AI Assistant</span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-300 transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5"
        >
          ×
        </button>
      </div>
      
      <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-purple-500/20 scrollbar-track-transparent">
        {loading ? (
          <div className="p-6 text-center">
            <div className="relative mx-auto w-12 h-12">
              <div className="absolute top-0 left-0 w-full h-full rounded-full border-2 border-purple-400/20 border-t-purple-400 animate-spin" />
              <Sparkles className="w-4 h-4 text-purple-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="mt-4 text-sm text-gray-400">Generating content with AI...</p>
          </div>
        ) : (
          <div className="p-3 space-y-4">
            {aiActions.map(category => (
              <div key={category.type} className="space-y-2">
                <div className="text-xs font-medium text-purple-400/80 uppercase tracking-wider px-2">
                  {category.type}
                </div>
                <div className="space-y-1">
                  {category.actions.map(action => (
                    <button
                      key={action.key}
                      onClick={() => handleAIAction(action.key)}
                      className="w-full text-left px-3 py-2.5 text-sm rounded-lg transition-all flex items-center gap-2 text-gray-300 hover:text-purple-300 hover:bg-purple-500/10 group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-300" />
                      <span className="w-1 h-1 rounded-full bg-purple-400/40 group-hover:bg-purple-400 transition-colors" />
                      <span className="relative">{action.label}</span>
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