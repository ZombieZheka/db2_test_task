// app/ui/audio-uploader.tsx

'use client';

import {
  useState,
  useCallback
} from "react";
// import ReactModal from 'react-modal';
import Popup from "@/app/ui/popup";
import { useDropzone } from "react-dropzone";

export default function AudioUploader() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);

    const validAudioFile = acceptedFiles.find((file) => file.type.startsWith("audio/"));

    if (!validAudioFile) {
      setError("Будь ласка, завантажте тільки один аудіо-файл!");
      return;
    }

    if (validAudioFile.size > 25 * 1024 * 1024) {
      setError("Файл перевищує допустимий розмір у 25MB.");
      return;
    }

    setAudioFile(validAudioFile);
  }, []);

  const handleProcess = async () => {
    if (!audioFile) {
      setError("Файл не вибрано!");
      return;
    }

    try {
      let response = await fetch("/api/transcripts", {
        method: "GET"
      });
      let data = await response.json();
      const transcriptsCount = data.transcripts.length;

      if (transcriptsCount >= 2) {
        setIsPopupOpen(true);
        return;
      }

      const formData = new FormData();
      formData.append("file", audioFile);
  
      // await fetch("/api/openai/transcribe", {
      response = await fetch("/api/openai/transcribe", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Сталася помилка під час транскрипції.");
        console.error("Error:", errorData);
        return;
      }
  
      data = await response.json();
      const {
        transcript: {
          text,
          language,
          duration,
          words
        }
      } = data;
      console.log("Transcription result:", data);
      console.log("\ttext:", text);
      console.log("\language:", language);
      console.log("\duration:", duration);
      console.log("\words:", words.length);
    } catch (err) {
      console.error("Error processing file:", err);
      setError("Не вдалося обробити файл. Спробуйте ще раз.");
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "audio/mpeg": [".mp3"],
      "audio/wav": [".wav"],
      "audio/x-m4a": [".m4a"],
    },
    maxSize: 25 * 1024 * 1024, // 25MB
    multiple: false, // Дозволяємо завантажувати тільки один файл
  });

  return (
    <div className="flex flex-col items-center justify-center px-3 py-10 bg-gray-50 rounded">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Audio Transcription</h1>
      <div
        {...getRootProps()}
        className={`w-96 h-48 px-6 py-8 text-center bg-white border-2 ${
          isDragActive ? "border-blue-500 bg-blue-50" : "border-dashed border-gray-300"
        } rounded-lg cursor-pointer transition hover:bg-gray-100 flex flex-col justify-center items-center`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-blue-600">Drop the file here...</p>
        ) : (
          <>
            <p className="text-gray-600">Drag and drop an audio file here, or click to select</p>
            <p className="text-sm text-gray-500">Supported formats: MP3, WAV, M4A (max 25MB)</p>
          </>
        )}
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      {audioFile && (
        <div className="mt-4 w-full">
          <div className="flex items-center justify-between p-2 text-sm border-b">
            <span className="text-gray-400">{audioFile.name}</span>
            <span className="text-gray-500">{(audioFile.size / 1024 / 1024).toFixed(2)} MB</span>
          </div>
          <button
            onClick={handleProcess}
            className="px-4 py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Process Transcript
          </button>
        </div>
      )}
      <Popup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        message="Ви перевищили ліміт транскрипцій! Покращте свій тарифний план для збільшення ліміту."
      />
    </div>
  );
}
