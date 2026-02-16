import React from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import About from '../components/About';
import Gallery from '../components/Gallery';
import Course from '../components/Course';

const HomePage = () => {
    return (
        <>
            <Hero />
            <About />
            <section className="work-heading-section">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="section-title"
                >
                    Gallery Highlights
                </motion.h2>
            </section>
            <Gallery />
            <Course />
        </>
    );
};

export default HomePage;
