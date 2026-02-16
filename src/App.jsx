import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import GalleryPage from './pages/GalleryPage';
import CoursePage from './pages/CoursePage';
import ContactPage from './pages/ContactPage';
import './index.css';

function App() {
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
