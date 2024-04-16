interface SpeechRecognitionEvent {
  readonly results: SpeechRecognitionResultList;
  readonly resultIndex: number;
  readonly interpretation: any;
}

interface SpeechRecognitionEventError extends Error {
  readonly error: SpeechRecognitionError;
}

interface SpeechRecognitionError {
  readonly error: string;
  readonly message: string;
}

interface SpeechRecognitionResult {
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}
