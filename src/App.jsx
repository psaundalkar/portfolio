import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import GalleryPage from './pages/GalleryPage';
import CoursePage from './pages/CoursePage';
import ContactPage from './pages/ContactPage';
import './index.css';

function App() {
    useEffect(() => {
        const preventImageContextMenu = (e) => {
            const target = e.target;
            if (target && target.tagName === 'IMG') {
                e.preventDefault();
            }
        };

        const preventImageDrag = (e) => {
            const target = e.target;
            if (target && target.tagName === 'IMG') {
                e.preventDefault();
            }
        };

        document.addEventListener('contextmenu', preventImageContextMenu);
        document.addEventListener('dragstart', preventImageDrag);

        return () => {
            document.removeEventListener('contextmenu', preventImageContextMenu);
            document.removeEventListener('dragstart', preventImageDrag);
        };
    }, []);

    return (
        <Router>
            <div className="app-container">
                <Navbar />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/gallery" element={<GalleryPage />} />
                    <Route path="/course" element={<CoursePage />} />
                    <Route path="/course/:slug" element={<CoursePage />} />
                    <Route path="/contact" element={<ContactPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
