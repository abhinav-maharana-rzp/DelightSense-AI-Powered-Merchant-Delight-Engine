import React, { useState, useRef } from 'react';
import axios from 'axios';
import { FaMicrophone, FaStop, FaSpinner } from 'react-icons/fa';

const VoiceAssistant = () => {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  let ffmpegRef = null;

const loadFFmpeg = async () => {
  if (!ffmpegRef) {
    const { createFFmpeg, fetchFile } = await import('@ffmpeg/ffmpeg');
    ffmpegRef = createFFmpeg({ log: true });
    await ffmpegRef.load();
  }
};


  // Start recording audio
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await convertAudioToWav(audioBlob);
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      alert('Microphone access denied or not supported.');
      console.error(err);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  // Convert audio to .wav format using ffmpeg.wasm
  const convertAudioToWav = async (audioBlob) => {
    await loadFFmpeg();
    const audioBuffer = await audioBlob.arrayBuffer();
    const audioFileName = 'input.webm';

    // Write audio file to ffmpeg's virtual file system
    await ffmpegRef.current.FS('writeFile', audioFileName, new Uint8Array(audioBuffer));

    // Convert to .wav format
    await ffmpegRef.current.run('-i', audioFileName, 'output.wav');

    // Read the converted .wav file from the virtual file system
    const data = ffmpegRef.current.FS('readFile', 'output.wav');
    const wavBlob = new Blob([data.buffer], { type: 'audio/wav' });

    await sendAudio(wavBlob);
  };

  // Send audio to backend
  const sendAudio = async (audioBlob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.wav');

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5001/nlp/voice-assistant', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.transcript) {
        setTranscript(res.data.transcript);
      }
      if (res.data.response) {
        setResponse(res.data.response);
      }
    } catch (err) {
      console.error('Voice assistant error:', err);
      setResponse('❌ Error processing voice input.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 w-full mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
        🎙️ Voice Assistant
      </h2>

      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={startRecording}
          disabled={recording}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-white transition ${
            recording
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-red-500 hover:bg-red-600'
          }`}
        >
          <FaMicrophone /> Start
        </button>

        <button
          onClick={stopRecording}
          disabled={!recording}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-white transition ${
            !recording
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gray-700 hover:bg-black'
          }`}
        >
          <FaStop /> Stop
        </button>

        {loading && (
          <div className="flex items-center gap-2 text-gray-600 animate-pulse">
            <FaSpinner className="animate-spin" />
            Processing...
          </div>
        )}
      </div>

      {transcript && (
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-1 font-medium">🗣️ Transcript:</p>
          <p className="bg-gray-100 rounded p-3 text-gray-700">{transcript}</p>
        </div>
      )}

      {response && (
        <div className="mb-2">
          <p className="text-sm text-gray-500 mb-1 font-medium">🤖 Assistant Response:</p>
          <p className="bg-blue-50 rounded p-3 text-gray-800">{response}</p>
        </div>
      )}
    </div>
  );
};

export default VoiceAssistant;
