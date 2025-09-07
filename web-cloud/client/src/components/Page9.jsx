import { useState, useRef } from "react";

export default function Page9() {
  const [role, setRole] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [allowAccess, setAllowAccess] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const [stream, setStream] = useState(null);

  const videoRef = useRef(null);
  const isReady = role && difficulty && allowAccess && agreeTerms;

  const startRecording = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;

      const mediaRecorder = new MediaRecorder(mediaStream);
      let chunks = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const formData = new FormData();
        formData.append("file", blob, "interview.webm");
        formData.append("role", role);           // add role
        formData.append("difficulty", difficulty); // add difficulty

        await fetch("http://localhost:5000/api/recordings", {
          method: "POST",
          body: formData,
        });

        chunks = [];
        mediaStream.getTracks().forEach((track) => track.stop());
        setStream(null);
        alert("Recording uploaded successfully!");
      };

      mediaRecorder.start();
      setRecorder(mediaRecorder);
    } catch (err) {
      console.error("Error starting recording:", err);
    }
  };

  const stopRecording = () => {
    if (recorder) {
      recorder.stop();
      setRecorder(null);
    }
  };

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6 font-sans">
      <h1 className="text-3xl font-bold text-center">Take The Interview</h1>

      {/* Role */}
      <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
        <label className="block font-semibold mb-2">Select Role</label>
        <select
          className="w-full p-2 rounded border border-gray-400"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">Select</option>
          <option value="frontend">Frontend Developer</option>
          <option value="backend">Backend Developer</option>
          <option value="fullstack">Full Stack Engineer</option>
          <option value="data-scientist">Data Scientist</option>
        </select>
      </div>

      {/* Difficulty */}
      <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
        <label className="block font-semibold mb-2">Select Difficulty</label>
        <select
          className="w-full p-2 rounded border border-gray-400"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="">Select</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      {/* Checkboxes */}
      <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 space-y-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={allowAccess}
            onChange={(e) => setAllowAccess(e.target.checked)}
          />
          Allow Camera & Microphone
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
          />
          I Agree to Terms & Conditions
        </label>
      </div>

      {/* Video Preview */}
      {stream && (
        <div className="border-2 border-dashed border-gray-400 rounded-lg h-60 flex items-center justify-center">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover rounded"
          />
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-center gap-4">
        {!recorder ? (
          <button
            disabled={!isReady}
            onClick={startRecording}
            className={`px-4 py-2 font-semibold rounded text-white ${
              !isReady
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            Start Interview
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded"
          >
            End Interview
          </button>
        )}
        <button className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded">
          Cancel
        </button>
      </div>
    </main>
  );
}
