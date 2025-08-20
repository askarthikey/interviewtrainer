import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import RootLayout from './components/RootLayout';
import Signup from './components/Signup';
import Signin from './components/Signin';
import Dashboard from './components/Dashboard';
import CodeEditor from './components/CodeEditor';
import SpeechToTextDis from './components/SpeechToTextDis';
import Page7 from './pages/Page7.jsx';
import Page9 from './pages/Page9.jsx';

// Component to handle conditional redirect based on auth state
const HomeRedirect = () => {
  const { isSignedIn } = useAuth();
  
  if (isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Navigate to="/signin" replace />;
};

function App() {
  return (
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<RootLayout />}>
              <Route index element={<HomeRedirect />} />
              <Route path="signin" element={<Signin />} />
              <Route path="speech" element={<SpeechToTextDis />} />
              <Route path="/page7" element={<Page7 />} />
              <Route path="/page9" element={<Page9 />} />
              <Route path="dashboard" element={<Dashboard/>} />
              <Route path="code" element={<CodeEditor/>} />
              <Route path="signup" element={<Signup />} />
            </Route>
          </Routes>
        </div>
      </Router>
  );
}

export default App;