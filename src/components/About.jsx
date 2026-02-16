import React from 'react';
import { motion } from 'framer-motion';
import './About.css';
import headshotPlaceholder from '../assets/potrait.webp';

const About = () => {
    return (
        <section className="about-section">
            <div className="about-container">
                {/* Left Column: Headshot */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="about-image-wrapper"
                >
                    <div className="about-image-inner">
                        <img src={headshotPlaceholder} alt="Prashant Saundalkar" className="about-headshot" />
                        <div className="image-accent"></div>
                    </div>

                    <div className="experience-highlights">
                        <div className="exp-item">
                            <span className="exp-label">Astronomy</span>
                            <span className="exp-value">8 Years</span>
                        </div>
                        <div className="exp-divider"></div>
                        <div className="exp-item">
                            <span className="exp-label">Astrophotography</span>
                            <span className="exp-value">4 Years</span>
                        </div>
                    </div>
                </motion.div>

                {/* Right Column: Content */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="about-content"
                >
                    <h2 className="about-headline">Prashant Saundalkar</h2>
                    <h3 className="about-subhead">Astrophotographer & Amateur Astronomer</h3>

                    <div className="about-bio">
                        <p>
                            I’ve always believed that the night sky isn’t just something we look at, it’s something we’re deeply connected to. Every star, every nebula, every distant galaxy is a reminder that we’re all made of the same cosmic dust.
                        </p>
                        <p>
                            My journey into astrophotography began with simple curiosity, a desire to capture what can’t be seen with the naked eye. What started as a late-night hobby under the faint glow of my first camera turned into a lifelong pursuit to document the universe from Earth’s most remote and beautiful corners. From the tranquil peaks of the Himalayas to the still reflections of Pangong Lake, I’ve spent countless nights chasing the Milky Way, waiting for meteors, and capturing the silent poetry of the cosmos.
                        </p>
                        <p>
                            Through my lens, I aim to bridge art and science, to make the infinite feel intimate. Each image is more than a photograph; it’s a window into time, light, and wonder.
                        </p>
                        <p>
                            Whether it’s the first glow of the Orion, the trails of a rare comet over the mountains, or the timeless arc of our galaxy, I hope my work inspires you to look up, pause, and remember, we are all made of stardust.
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default About;
