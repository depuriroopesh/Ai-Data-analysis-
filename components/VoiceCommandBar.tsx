'use client';

import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Send, Sparkles } from 'lucide-react';

interface VoiceCommandBarProps {
  onExecuteCommand: (command: string) => void;
  isProcessing: boolean;
}

export const VoiceCommandBar: React.FC<VoiceCommandBarProps> = ({
  onExecuteCommand,
  isProcessing,
}) => {
  const [inputCommand, setInputCommand] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      setSpeechSupported(true);
    }
  }, []);

  const handleVoiceListen = () => {
    if (!speechSupported) return;

    const windowWithSpeech = window as any;
    const SpeechRecognition = windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    setIsListening(true);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputCommand(transcript);
      setIsListening(false);
      if (transcript) {
        onExecuteCommand(transcript);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCommand.trim() || isProcessing) return;
    onExecuteCommand(inputCommand.trim());
    setInputCommand('');
  };

  const sampleCommands = [
    'Clean structured dataset and remove missing values',
    'Extract entities and convert document to table',
    'Export cleaned dataset to Excel',
    'Export executive summary to Word',
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4">
      <div className="rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-xl backdrop-blur-md flex flex-col gap-2">
        {/* Input Bar */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 shrink-0">
            <Sparkles className="h-4 w-4" />
          </div>

          <input
            type="text"
            placeholder={
              isListening
                ? 'Listening to your voice command...'
                : 'Type or speak command (e.g., "Clean structured dataset", "Export to Excel")...'
            }
            value={inputCommand}
            onChange={(e) => setInputCommand(e.target.value)}
            disabled={isProcessing}
            className="flex-1 bg-transparent text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden"
          />

          {speechSupported && (
            <button
              type="button"
              onClick={handleVoiceListen}
              className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              title="Speak voice command"
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>
          )}

          <button
            type="submit"
            disabled={!inputCommand.trim() || isProcessing}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 transition-colors shrink-0"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>

        {/* Quick Sample Command Prompts */}
        <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto text-[10px] text-slate-500 font-mono pt-1 border-t border-slate-100">
          <span className="text-slate-400 shrink-0">Quick Commands:</span>
          {sampleCommands.map((cmd, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onExecuteCommand(cmd)}
              className="truncate rounded-md bg-slate-100 px-2 py-0.5 text-slate-700 hover:bg-slate-200 transition-colors shrink-0"
            >
              "{cmd}"
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
