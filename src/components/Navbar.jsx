import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (menuOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = '';
        return () => { document.body.style.overflow = ''; };
    }, [menuOpen]);

    const closeMenu = () => setMenuOpen(false);

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${menuOpen ? 'menu-open' : ''}`}>
            <div className="nav-container">
                <NavLink to="/" className="nav-logo" onClick={closeMenu} />
                <button
                    type="button"
                    className="nav-toggle"
                    aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <span className="nav-toggle-bar" />
                    <span className="nav-toggle-bar" />
                    <span className="nav-toggle-bar" />
                </button>
                <div className="nav-links">
                    <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={closeMenu}>
                        Home
                    </NavLink>
                    <NavLink to="/gallery" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={closeMenu}>
                        Gallery
                    </NavLink>
                    <NavLink to="/course" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={closeMenu}>
                        Courses
                    </NavLink>
                    <NavLink to="/contact" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={closeMenu}>
                        Contact
                    </NavLink>
                </div>
            </div>
            {/* Mobile backdrop: closes menu when tapping outside the drawer */}
            {menuOpen && <div className="nav-backdrop" onClick={closeMenu} aria-hidden="true" />}
        </nav>
    );
};

export default Navbar;
