// app/ui/audio-uploader.tsx

'use client';

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function AudioUploader() {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log("Dropped files:", acceptedFiles);
    //
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "audio/mpeg": [".mp3"],
      "audio/wav": [".wav"],
      "audio/x-m4a": [".m4a"],
    },
    maxSize: 25 * 1024 * 1024, // 25MB
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
          <p className="text-blue-600">Drop the files here...</p>
        ) : (
          <>
            <p className="text-gray-600">Drag and drop an audio file here, or click to select</p>
            <p className="text-sm text-gray-500">Supported formats: MP3, WAV, M4A (max 25MB)</p>
          </>
        )}
      </div>
    </div>
  );
}
