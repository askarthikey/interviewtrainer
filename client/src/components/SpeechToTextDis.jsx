import React, { useState, useRef, useEffect } from 'react';

const SpeechToTextDis = () => {
  const [activeTab, setActiveTab] = useState('question');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [timeSpent, setTimeSpent] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [leftPanelWidth, setLeftPanelWidth] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [submissionHistory, setSubmissionHistory] = useState([]);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [microphonePermission, setMicrophonePermission] = useState('prompt');
  
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const containerRef = useRef(null);

  // Check speech recognition support
  useEffect(() => {
    const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    setSpeechSupported(isSupported);
    
    if (isSupported) {
      // Check microphone permission
      navigator.mediaDevices?.getUserMedia({ audio: true })
        .then(() => setMicrophonePermission('granted'))
        .catch(() => setMicrophonePermission('denied'));
    }
  }, []);

  // Timer functionality
  useEffect(() => {
    if (isTimerActive) {
      timerRef.current = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isTimerActive]);

  // Speech Recognition setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.maxAlternatives = 1;

      recognitionRef.current.onstart = () => {
        console.log('Speech recognition started');
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event) => {
        console.log('🎤 onresult called with', event.results.length, 'results');
        
        let combinedTranscript = '';
        let latestInterim = '';
        
        // Simple approach - get all text
        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i];
          const transcript = result[0].transcript;
          
          console.log(`🎤 Result ${i}: "${transcript}" isFinal: ${result.isFinal}`);
          
          if (result.isFinal) {
            combinedTranscript += transcript + ' ';
          } else {
            latestInterim = transcript;
          }
        }
        
        // Direct state updates
        if (combinedTranscript.trim()) {
          console.log('🎤 Setting final transcript:', combinedTranscript);
          setFinalTranscript(prev => prev + combinedTranscript);
          setInterimTranscript('');
        } else if (latestInterim.trim()) {
          console.log('🎤 Setting interim transcript:', latestInterim);
          setInterimTranscript(latestInterim);
        }
        
        // Force re-render by logging current state
        console.log('🎤 State after update - Final:', finalTranscript, 'Interim:', interimTranscript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error, event);
        
        // Handle different error types
        if (event.error === 'not-allowed') {
          alert('❌ Microphone access denied. Please allow microphone permissions and try again.');
          setIsListening(false);
        } else if (event.error === 'no-speech') {
          console.log('No speech detected, continuing to listen...');
          // Don't stop listening for no-speech errors, just continue
        } else if (event.error === 'audio-capture') {
          alert('❌ No microphone found. Please connect a microphone and try again.');
          setIsListening(false);
        } else if (event.error === 'network') {
          console.log('Network error, restarting...');
          // Try to restart automatically for network errors
          setTimeout(() => {
            if (isListening && recognitionRef.current) {
              try {
                recognitionRef.current.start();
              } catch (e) {
                console.error('Failed to restart recognition:', e);
                setIsListening(false);
              }
            }
          }, 1000);
        } else {
          console.error('Other speech recognition error:', event.error);
          setIsListening(false);
        }
      };

      recognitionRef.current.onend = () => {
        console.log('Speech recognition ended, isListening:', isListening);
        
        // If we're supposed to be listening, restart the recognition
        if (isListening) {
          console.log('Restarting speech recognition...');
          setTimeout(() => {
            if (isListening && recognitionRef.current) {
              try {
                recognitionRef.current.start();
              } catch (error) {
                console.error('Failed to restart recognition:', error);
                setIsListening(false);
              }
            }
          }, 100);
        } else {
          setIsListening(false);
        }
      };
    } else {
      console.error('Speech recognition not supported');
    }
  }, []); // Empty dependency array - only run once

  // Update word count
  useEffect(() => {
    const words = finalTranscript.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [finalTranscript]);

  // Handle horizontal resizing
  const handleMouseDown = (e) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    
    if (newWidth >= 20 && newWidth <= 80) {
      setLeftPanelWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleListening = () => {
    console.log('Toggle listening called, current state:', isListening);
    
    if (!recognitionRef.current) {
      alert('❌ Speech recognition not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (isListening) {
      console.log('Stopping speech recognition...');
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
      setIsListening(false);
    } else {
      console.log('Starting speech recognition...');
      
      // Request microphone permission first
      navigator.mediaDevices?.getUserMedia({ audio: true })
        .then(() => {
          console.log('Microphone permission granted, starting recognition...');
          setMicrophonePermission('granted');
          
          try {
            // Clear any previous transcripts when starting fresh
            setInterimTranscript('');
            
            // Make sure recognition is not already running
            if (recognitionRef.current.abort) {
              recognitionRef.current.abort();
            }
            
            // Small delay to ensure clean start
            setTimeout(() => {
              try {
                recognitionRef.current.start();
                console.log('Speech recognition start() called');
                // Don't set isListening here - let onstart handle it
                
                if (!isTimerActive) {
                  setIsTimerActive(true);
                }
              } catch (startError) {
                console.error('Error in recognition.start():', startError);
                setIsListening(false);
                
                if (startError.name === 'InvalidStateError') {
                  alert('❌ Speech recognition is already running. Please wait a moment and try again.');
                } else {
                  alert('❌ Error starting speech recognition: ' + startError.message);
                }
              }
            }, 100);
            
          } catch (error) {
            console.error('Error preparing speech recognition:', error);
            setIsListening(false);
            alert('❌ Error starting speech recognition. Please refresh the page and try again.');
          }
        })
        .catch((error) => {
          console.error('Microphone permission denied:', error);
          setMicrophonePermission('denied');
          alert('❌ Microphone access is required for speech recognition. Please allow microphone permissions and try again.');
        });
    }
  };

  const testTranscript = () => {
    console.log('🧪 Testing transcript display...');
    setFinalTranscript('This is a test transcript to verify the UI is working correctly. ');
    setInterimTranscript('This is interim text...');
    setWordCount(10);
    setConfidence(0.95);
  };

  const clearTranscript = () => {
    setFinalTranscript('');
    setInterimTranscript('');
    setWordCount(0);
    setConfidence(0);
  };

  const startTimer = () => setIsTimerActive(true);
  const pauseTimer = () => setIsTimerActive(false);
  const resetTimer = () => {
    setIsTimerActive(false);
    setTimeSpent(0);
  };

  const submitResponse = () => {
    if (!finalTranscript.trim()) {
      alert('Please provide a response before submitting.');
      return;
    }

    const submission = {
      id: Date.now(),
      response: finalTranscript,
      wordCount,
      timeSpent,
      confidence,
      timestamp: new Date().toISOString(),
    };

    setSubmissionHistory(prev => [submission, ...prev]);
    setShowSubmissionModal(true);
  };

  const interviewQuestion = {
    id: 1,
    category: "Behavioral",
    difficulty: "Medium",
    title: "Tell me about a challenging project you worked on",
    description: "Describe a project that presented significant challenges and how you overcame them. Focus on your problem-solving approach, the obstacles you faced, and the final outcome.",
    keyPoints: [
      "Describe the project context and your role",
      "Explain the specific challenges you encountered", 
      "Detail your approach to solving these challenges",
      "Share the outcome and what you learned",
      "Reflect on how this experience has shaped your approach to future projects"
    ],
    tips: [
      "Use the STAR method (Situation, Task, Action, Result)",
      "Be specific about your contributions",
      "Focus on your problem-solving process",
      "Mention measurable outcomes when possible",
      "Show growth and learning from the experience"
    ],
    timeLimit: "3-5 minutes recommended"
  };

  const getDifficultyColor = (diff) => {
    switch(diff) {
      case 'Easy': return 'text-green-600 bg-green-50';
      case 'Medium': return 'text-orange-600 bg-orange-50';  
      case 'Hard': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div ref={containerRef} className="h-screen bg-white flex relative">
      {/* Left Panel - Question */}
      <div 
        className="border-r border-gray-200 flex flex-col transition-all duration-200"
        style={{ width: `${leftPanelWidth}%` }}
      >
        {/* Question Header */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {interviewQuestion.title}
              </h1>
              <div className="flex items-center space-x-4 text-sm">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(interviewQuestion.difficulty)}`}>
                  {interviewQuestion.difficulty}
                </span>
                <span className="text-gray-600">{interviewQuestion.category}</span>
                <span className="text-gray-600">{interviewQuestion.timeLimit}</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-4">
            {['Question', 'Tips', 'Examples', 'History'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.toLowerCase()
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'question' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Question Description</h3>
                <p className="text-gray-700 leading-relaxed">{interviewQuestion.description}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Key Points to Address</h3>
                <ul className="space-y-2">
                  {interviewQuestion.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-500 mr-2 text-sm">•</span>
                      <span className="text-gray-700 text-sm">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="font-medium text-blue-900 mb-1">💡 Remember:</div>
                <div className="text-blue-800 text-sm">Take your time to think before speaking. Structure your response and speak clearly.</div>
              </div>
            </div>
          )}

          {activeTab === 'tips' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 mb-3">Interview Tips</h3>
              {interviewQuestion.tips.map((tip, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700 text-sm">{tip}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'examples' && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-2">💼</div>
              <div className="text-gray-500">Example responses coming soon...</div>
            </div>
          )}

          {activeTab === 'history' && (
            <div>
              {submissionHistory.length > 0 ? (
                <div className="space-y-3">
                  {submissionHistory.map((submission) => (
                    <div key={submission.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium text-gray-900">
                          Submission {new Date(submission.timestamp).toLocaleDateString()}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTime(submission.timeSpent)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-3">
                        {submission.response.substring(0, 150)}...
                      </p>
                      <div className="mt-2 text-xs text-gray-500">
                        {submission.wordCount} words • Confidence: {Math.round(submission.confidence * 100)}%
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-2">📊</div>
                  <div className="text-gray-500">Your responses will appear here...</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Horizontal Resizer */}
      <div
        className={`w-1 bg-gray-200 hover:bg-gray-300 cursor-ew-resize flex-shrink-0 relative group ${
          isDragging ? 'bg-blue-400' : ''
        }`}
        onMouseDown={handleMouseDown}
      >
        <div className="absolute inset-y-0 -left-1 -right-1 group-hover:bg-gray-300 group-hover:bg-opacity-50 transition-colors">
          <div className="h-full flex items-center justify-center">
            <div className="w-1 h-8 bg-gray-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        </div>
      </div>

      {/* Right Panel - Speech to Text */}
      <div 
        className="flex-1 flex flex-col bg-gray-50"
        style={{ width: `${100 - leftPanelWidth}%` }}
      >
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="font-semibold text-gray-900">Speech Response</h2>
              
              {/* Timer Display */}
              <div className="flex items-center space-x-2">
                <div className={`px-3 py-1 rounded-lg text-sm font-mono ${
                  timeSpent > 300 ? 'bg-red-100 text-red-800' : 
                  timeSpent > 180 ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-gray-100 text-gray-800'
                }`}>
                  ⏱️ {formatTime(timeSpent)}
                </div>
                <button
                  onClick={isTimerActive ? pauseTimer : startTimer}
                  className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs transition-colors"
                >
                  {isTimerActive ? 'Pause' : 'Start'}
                </button>
                <button
                  onClick={resetTimer}
                  className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs transition-colors"
                >
                  Reset
                </button>
              </div>

              {/* Stats */}
              <div className="text-sm text-gray-600 flex items-center space-x-4">
                <span>Words: {wordCount}</span>
                <span>Confidence: {Math.round(confidence * 100)}%</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  speechSupported 
                    ? microphonePermission === 'granted' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {speechSupported 
                    ? microphonePermission === 'granted' 
                      ? '✓ Ready' 
                      : '⚠ Mic Access'
                    : '✗ Not Supported'
                  }
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={clearTranscript}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear
              </button>
              <button
                onClick={toggleListening}
                disabled={!speechSupported}
                className={`px-4 py-2 text-sm rounded-lg transition-colors font-medium flex items-center space-x-2 ${
                  !speechSupported 
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : isListening 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
                title={!speechSupported ? 'Speech recognition not supported in this browser' : ''}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                </svg>
                <span>
                  {!speechSupported 
                    ? 'Not Supported' 
                    : isListening 
                      ? 'Stop Recording' 
                      : 'Start Recording'
                  }
                </span>
              </button>
              <button
                onClick={submitResponse}
                className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
              >
                Submit Response
              </button>
            </div>
          </div>
        </div>

        {/* Speech Display Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {/* Status Indicator */}
            {isListening && (
              <div className="mb-4 flex items-center justify-center">
                <div className="flex items-center space-x-3 px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-red-700 text-sm font-medium">Recording in progress...</span>
                  <div className="flex space-x-1">
                    <div className="w-1 h-4 bg-red-400 rounded-full animate-pulse" style={{animationDelay: '0s'}}></div>
                    <div className="w-1 h-4 bg-red-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-1 h-4 bg-red-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              </div>
            )}

            {/* Transcript Display */}
            <div className="bg-white rounded-lg border border-gray-200 min-h-96 p-6">
              {!speechSupported && (
                <div className="text-center py-8 mb-6 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="text-yellow-600 mb-2">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-yellow-800 mb-2">Speech Recognition Not Supported</h3>
                  <p className="text-yellow-700 text-sm mb-4">
                    Your browser doesn't support speech recognition. Please use one of the following browsers:
                  </p>
                  <div className="flex justify-center space-x-4 text-sm">
                    <span className="bg-white px-3 py-1 rounded-full text-yellow-800">Chrome</span>
                    <span className="bg-white px-3 py-1 rounded-full text-yellow-800">Edge</span>
                    <span className="bg-white px-3 py-1 rounded-full text-yellow-800">Safari</span>
                  </div>
                </div>
              )}
              
              <div className="prose prose-lg max-w-none">
                {finalTranscript || interimTranscript ? (
                  <>
                    <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                      {finalTranscript}
                      {interimTranscript && (
                        <span className="text-gray-400 italic">{interimTranscript}</span>
                      )}
                      <span className="animate-pulse">|</span>
                    </p>
                  </>
                ) : (
                  <div className="text-center py-16">
                    <div className="text-gray-400 mb-4">
                      <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to record your response</h3>
                    <p className="text-gray-500 mb-4">Click "Start Recording" to begin speaking. Your words will appear here in real-time.</p>
                    {microphonePermission === 'denied' && (
                      <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 inline-block">
                        ⚠️ Microphone access denied. Please allow microphone permissions and refresh the page.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            {finalTranscript && (
              <div className="mt-4 flex justify-center space-x-4">
                <button 
                  onClick={() => navigator.clipboard.writeText(finalTranscript)}
                  className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                >
                  📋 Copy Text
                </button>
                <button 
                  onClick={() => {
                    const utterance = new SpeechSynthesisUtterance(finalTranscript);
                    speechSynthesis.speak(utterance);
                  }}
                  className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                >
                  🔊 Play Back
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submission Modal */}
      {showSubmissionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Response Submitted!</h3>
              <p className="text-gray-600 mb-4">
                Your interview response has been recorded successfully.
              </p>
              <div className="text-sm text-gray-500 mb-4 space-y-1">
                <div>Time spent: {formatTime(timeSpent)}</div>
                <div>Word count: {wordCount} words</div>
                <div>Confidence: {Math.round(confidence * 100)}%</div>
              </div>
              <button
                onClick={() => setShowSubmissionModal(false)}
                className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Continue Practice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeechToTextDis;
