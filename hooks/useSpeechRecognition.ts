"use client"
import React from "react";
import toast from "react-hot-toast";

const useSpeechRecognition = () => {
  const [isListening, setIsListening] = React.useState<boolean>(false);
  const [speechTranscript, setSpeechTranscript] = React.useState<string>("");
  const [inputValue, setInputValue] = React.useState<string>("");
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const speechRecognition = new window.webkitSpeechRecognition();

  speechRecognition.continuous = true;
  speechRecognition.interimResults = true;
  speechRecognition.lang = "en-US";

  speechRecognition.onstart = () => {
    setIsListening(true);
  };
  speechRecognition.onend = () => {
    setIsListening(false);
  };

  speechRecognition.onerror = (event: SpeechRecognitionEventError) => {
    console.log("transcript error:", event.error);
  };

  speechRecognition.onresult = (event: SpeechRecognitionEvent) => {
    const transcript = Array.from(event.results)
      .map((results: SpeechRecognitionResult) => results[0])
      .map((results: SpeechRecognitionAlternative) => results.transcript)
      .join("");
    setSpeechTranscript(transcript);
    console.log("Transcript:", transcript);
  };

  const startRecording = () => {
    if (isListening) {
      speechRecognition.stop();
      toast.success("Speech recognition disactivated!");
    } else {
      speechRecognition.start();
      toast.success("Speech recognition activated!");
    }
  };

  React.useEffect(() => {
    if (inputRef.current && inputRef.current === document.activeElement) {
      inputRef.current.value = speechTranscript;
      setInputValue(speechTranscript);
    }
  }, [speechTranscript]);

  return { inputRef, startRecording, setInputValue, inputValue, isListening };
};

export default useSpeechRecognition;
