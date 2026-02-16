import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getAssetUrl, assetPaths } from '../data/assetUrls';
import { courses, courseList } from '../data/courses';
import EnrollmentModal from '../components/EnrollmentModal';
import './CoursePage.css';

const CoursePage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const course = slug && courses[slug] ? courses[slug] : null;
    const [expandedLesson, setExpandedLesson] = useState(null);
    const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);

    const toggleLesson = (id) => {
        setExpandedLesson(expandedLesson === id ? null : id);
    };

    // Course listing when no slug or invalid slug
    if (!course) {
        return (
            <div className="course-page-content">
                <header className="course-hero course-hero-listing">
                    <div className="course-hero-content">
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            Choose Your Course
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="course-subtitle"
                        >
                            From DSLR masterclass to mobile—start at your level.
                        </motion.p>
                    </div>
                </header>
                <section className="course-listing-cards">
                    <div className="course-listing-grid">
                        {courseList.map((c) => (
                            <motion.div
                                key={c.slug}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                className="course-listing-card"
                            >
                                <h3>{c.title}</h3>
                                <p>{c.description}</p>
                                <div className="course-listing-price">{c.priceLabel}</div>
                                <Link to={`/course/${c.slug}`} className="btn-enroll-hero">
                                    View Course
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="course-page-content">
            <header className="course-hero">
                <div className="course-hero-content">
                    <motion.button
                        type="button"
                        className="course-back-link"
                        onClick={() => navigate('/course')}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        ← All courses
                    </motion.button>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        {course.subtitle}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="course-subtitle"
                    >
                        {course.tagline}
                    </motion.p>

                    {course.slug === 'masterclass' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="video-container"
                        >
                            <div className="video-placeholder">
                                <video
                                    src={getAssetUrl(assetPaths.langzaVid)}
                                    controls
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                        </motion.div>
                    )}
                    <motion.button
                        type="button"
                        onClick={() => course.price && setShowEnrollmentModal(true)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn-enroll-hero"
                    >
                        Enroll Now{course.price ? ` – ${course.priceLabel}` : ''}
                    </motion.button>
                </div>
            </header>

            <section className="course-features">
                <div className="features-grid">
                    {course.features.map((f) => (
                        <div key={f.title} className="feature-card">
                            <span className="icon">{f.icon}</span>
                            <h3>{f.title}</h3>
                            <p>{f.text}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="course-curriculum">
                <h2>Course Curriculum</h2>
                <div className="accordion-container">
                    {course.curriculum.map((lesson) => (
                        <div key={lesson.id} className="accordion-item">
                            <button
                                className={`accordion-header ${expandedLesson === lesson.id ? 'active' : ''}`}
                                onClick={() => toggleLesson(lesson.id)}
                            >
                                {lesson.title}
                                <span className="accordion-icon">{expandedLesson === lesson.id ? '−' : '+'}</span>
                            </button>
                            <AnimatePresence>
                                {expandedLesson === lesson.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="accordion-content"
                                    >
                                        <p className="accordion-objective"><strong>Objective:</strong> {lesson.objective}</p>
                                        <div className="accordion-topics">
                                            <strong>Topics:</strong>
                                            <ul>
                                                {lesson.topics.map((t, i) => (
                                                    <li key={i}>{t}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <p className="accordion-activity"><strong>Activity:</strong> {lesson.activity}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </section>

            <section className="course-pricing" id="pricing">
                <div className="pricing-card-large">
                    <h3>{course.title}</h3>
                    <div className="price-tag">
                        {course.priceLabel}
                        {course.price && <span className="period"> one-time</span>}
                    </div>
                    <ul>
                        <li>✅ Instant access to all {course.curriculum.length} lessons</li>
                        {course.slug === 'masterclass' && (
                            <>
                                <li>✅ Bonus: RAW files for practice</li>
                                <li>✅ Private Discord community access</li>
                            </>
                        )}
                        <li>✅ Lifetime updates</li>
                    </ul>
                    <button
                        type="button"
                        className="btn-buy-stripe"
                        disabled={!course.price}
                        onClick={() => course.price && setShowEnrollmentModal(true)}
                    >
                        {course.price ? 'Enroll Now' : 'Coming Soon'}
                    </button>
                    {course.price && <p className="guarantee">30-Day Money-Back Guarantee</p>}
                </div>
            </section>

            {showEnrollmentModal && course?.price && (
                <EnrollmentModal
                    course={course}
                    onClose={() => setShowEnrollmentModal(false)}
                />
            )}
        </div>
    );
};

export default CoursePage;
