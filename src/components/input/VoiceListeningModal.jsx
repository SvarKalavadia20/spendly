import React, { useEffect, useCallback } from 'react';
import { Mic, MicOff, X, Sparkles, Check, ArrowRight } from 'lucide-react';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';

export function VoiceListeningModal({ isOpen, onClose, onTranscriptComplete }) {
  const handleResult = useCallback((finalText) => {
    onTranscriptComplete(finalText);
  }, [onTranscriptComplete]);

  const { 
    isListening, 
    transcript, 
    errorMessage, 
    startListening, 
    stopListening,
    finishAndSubmit
  } = useSpeechRecognition({
    onResult: handleResult
  });

  useEffect(() => {
    if (isOpen) {
      startListening();
    } else {
      stopListening();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in p-0 sm:p-4">
      <div className="w-full max-w-sm bg-[#121622] rounded-t-[32px] sm:rounded-[32px] p-6 text-center border border-slate-800 shadow-2xl animate-modal-up">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Voice Expense Assistant
          </span>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Pulsing Mic Visualizer */}
        <div className="my-6 relative flex justify-center items-center">
          {isListening && (
            <>
              <div className="w-24 h-24 rounded-full bg-indigo-500/20 animate-ping absolute" />
              <div className="w-32 h-32 rounded-full bg-indigo-500/10 animate-pulse absolute" />
            </>
          )}
          <button
            type="button"
            onClick={isListening ? finishAndSubmit : startListening}
            className={`relative w-20 h-20 rounded-full flex items-center justify-center text-white transition-all shadow-xl ${
              isListening
                ? 'bg-indigo-600 shadow-[0_0_25px_rgba(99,102,241,0.5)] scale-105'
                : 'bg-slate-800'
            }`}
          >
            {isListening ? (
              <Mic className="w-8 h-8 animate-pulse" />
            ) : (
              <MicOff className="w-8 h-8 text-slate-400" />
            )}
          </button>
        </div>

        {/* Status text */}
        <h3 className="text-base font-extrabold text-white">
          {isListening ? 'Listening... Speak now' : 'Ready'}
        </h3>

        {/* Show live words while speaking */}
        {transcript ? (
          <div className="mt-4 p-3.5 bg-[#181F2E] border border-indigo-500/40 rounded-2xl">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Heard</span>
            <p className="text-sm font-bold text-indigo-300 italic">"{transcript}"</p>
          </div>
        ) : (
          <p className="text-xs text-slate-400 mt-2">
            Try saying: <br />
            <span className="font-semibold text-slate-200">"500 rupees at Zomato"</span>
          </p>
        )}

        {errorMessage && (
          <div className="mt-4 p-3 bg-rose-950/40 border border-rose-900 rounded-2xl text-xs font-medium text-rose-300">
            {errorMessage}
          </div>
        )}

        {/* Action Button: Tap when done speaking */}
        <div className="mt-6 space-y-2">
          {transcript ? (
            <button
              type="button"
              onClick={finishAndSubmit}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-600/30 active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Done & Process Expense</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              className="w-full py-2.5 bg-[#181F2E] hover:bg-[#20293D] text-slate-300 rounded-2xl text-xs font-semibold border border-slate-800 transition"
            >
              {isListening ? 'Stop' : 'Start Speaking'}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}