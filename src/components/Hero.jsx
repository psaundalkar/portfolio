import React from 'react';
import { motion } from 'framer-motion';
import pangongImg from '../assets/pangong1.webp';
import './Hero.css';

const Hero = () => {
    return (
        <section className="hero-v2">
            {/* Background Image Container */}
            <div className="hero-bg-container">
                <img
                    src={pangongImg}
                    alt="Milky Way over Pangong Lake"
                    className="hero-bg-img"
                />
                <div className="hero-overlay"></div>
            </div>

            {/* Content */}
            <div className="hero-content">
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="hero-title"
                >
                    The Art of Astrophotography
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="hero-subtitle"
                >
                    Capturing the Cosmos | Chasing the Milkyway
                </motion.p>
            </div>

            {/* Stats Row */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="stats-container"
            >
                <div className="stat-item">
                    <span className="stat-num">500+</span>
                    <span className="stat-label">Hours Under Stars</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                    <span className="stat-num">100+</span>
                    <span className="stat-label">Images</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                    <span className="stat-num">30+</span>
                    <span className="stat-label">Timelapses</span>
                </div>
            </motion.div>
        </section>
    );
};

export default Hero;
