import { useState, useRef, useCallback, useEffect } from 'react';

export function useSpeechRecognition({ onResult, onError }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const recognitionRef = useRef(null);
  const latestTranscriptRef = useRef('');
  const silenceTimerRef = useRef(null);
  const onResultRef = useRef(onResult);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  const stopListening = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsListening(false);
  }, []);

  const finishAndSubmit = useCallback(() => {
    const text = latestTranscriptRef.current.trim();
    stopListening();
    if (text && onResultRef.current) {
      onResultRef.current(text);
    }
  }, [stopListening]);

  const startListening = useCallback(() => {
    setTranscript('');
    latestTranscriptRef.current = '';
    setErrorMessage('');

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMessage('Speech recognition is not supported in this browser.');
      return;
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-IN'; // Works for Indian & global English

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMessage('');
      };

      recognition.onresult = (event) => {
        let fullTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          fullTranscript += event.results[i][0].transcript + ' ';
        }

        const cleanText = fullTranscript.trim();
        if (cleanText) {
          setTranscript(cleanText);
          latestTranscriptRef.current = cleanText;

          // Reset silence timer on every spoken word
          if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = setTimeout(() => {
            if (latestTranscriptRef.current.trim()) {
              finishAndSubmit();
            }
          }, 1500); // 1.5s pause after speaking triggers auto-submit
        }
      };

      recognition.onerror = (event) => {
        if (event.error === 'no-speech') return; // Ignore silent pause
        setIsListening(false);

        if (event.error === 'not-allowed') {
          setErrorMessage('Microphone blocked. Allow mic access in your browser settings.');
        } else if (event.error === 'network') {
          setErrorMessage('Network error. If using Brave, enable Google services in settings.');
        } else {
          setErrorMessage(`Mic error: ${event.error}`);
        }

        if (onErrorRef.current) onErrorRef.current(event.error);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      setIsListening(false);
      setErrorMessage('Failed to start voice listener.');
    }
  }, [finishAndSubmit]);

  useEffect(() => {
    return () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
    };
  }, []);

  return {
    isListening,
    transcript,
    errorMessage,
    startListening,
    stopListening,
    finishAndSubmit,
  };
}