import { useState } from "react";
import { Camera, Mic } from "lucide-react";

export default function Page9() {
  const [role, setRole] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [allowAccess, setAllowAccess] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const isReady = role && difficulty && allowAccess && agreeTerms;

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">Take The Interview</h1>

      {/* Select Role */}
      <div className="bg-white/10 border border-gray-600 rounded-lg p-4">
        <label className="block font-semibold mb-2">Select Role</label>
        <select
          className="w-full p-2 rounded border border-gray-500 bg-gray-900 text-white"
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

      {/* Select Difficulty */}
      <div className="bg-white/10 border border-gray-600 rounded-lg p-4">
        <label className="block font-semibold mb-2">Select Difficulty</label>
        <select
          className="w-full p-2 rounded border border-gray-500 bg-gray-900 text-white"
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
      <div className="bg-white/10 border border-gray-600 rounded-lg p-4 space-y-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={allowAccess}
            onChange={(e) => setAllowAccess(e.target.checked)}
          />
          Allowing the application to control Camera and Microphone
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

      {/* Compatibility Check */}
      <div className="bg-white/10 border border-gray-600 rounded-lg p-4 text-center">
        <h3 className="text-lg font-semibold mb-3">Compatibility Check</h3>
        <div className="border-2 border-dashed border-gray-500 rounded-lg h-40 flex flex-col items-center justify-center text-gray-400 mb-4 gap-2">
          <div className="flex items-center gap-2">
            <Camera className="w-6 h-6" /> Camera Preview
          </div>
          <div className="flex items-center gap-2">
            <Mic className="w-6 h-6" /> Microphone Preview
          </div>
        </div>
        <p className="bg-green-100 text-green-700 border border-green-400 rounded p-2 mb-2">
          ✅ Camera is working fine
        </p>
        <p className="bg-red-100 text-red-700 border border-red-400 rounded p-2">
          ❌ Microphone isn’t working properly
        </p>
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-4">
        <button
          disabled={!isReady}
          className={`px-4 py-2 font-semibold rounded text-white ${
            !isReady
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          Start Interview
        </button>
        <button className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded">
          Cancel
        </button>
      </div>
    </main>
  );
}
