import React from 'react';
import { motion } from 'framer-motion';
import './ContactPage.css';

const PHONE = '9930108404';
const WHATSAPP_URL = `https://wa.me/91${PHONE}`;
const INSTAGRAM_HANDLE = 'guy.with.dslr';
const INSTAGRAM_URL = `https://instagram.com/${INSTAGRAM_HANDLE}`;

const ContactPage = () => {
    return (
        <div className="contact-page">
            <header className="contact-hero">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    Get in Touch
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="contact-subtitle"
                >
                    For courses, collaborations, or just to say hello.
                </motion.p>
            </header>

            <section className="contact-links">
                <motion.a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-card contact-whatsapp"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <span className="contact-icon" aria-hidden>📱</span>
                    <h2>WhatsApp / Call</h2>
                    <p className="contact-value">{PHONE}</p>
                    <span className="contact-cta">Chat or call →</span>
                </motion.a>

                <motion.a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-card contact-instagram"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <span className="contact-icon" aria-hidden>📷</span>
                    <h2>Instagram</h2>
                    <p className="contact-value">@{INSTAGRAM_HANDLE}</p>
                    <span className="contact-cta">Follow or DM →</span>
                </motion.a>
            </section>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="contact-note"
            >
                Prefer a call? Use the same number 9930108404
            </motion.p>
        </div>
    );
};

export default ContactPage;
