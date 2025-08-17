import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Page7 from './pages/Page7.jsx';
import Page9 from './pages/Page9.jsx';

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* default route goes to Page 7 */}
        <Route path="/" element={<Navigate to="/page7" replace />} />
        <Route path="/page7" element={<Page7 />} />
        <Route path="/page9" element={<Page9 />} />
        <Route path="*" element={<h1 style={{ padding: '2rem' }}>404 - Not Found</h1>} />
      </Routes>
    </>
  );
}
