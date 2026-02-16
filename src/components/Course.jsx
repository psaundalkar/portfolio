import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { courseList } from '../data/courses';
import './Course.css';

const Course = () => {
    return (
        <section className="course-v2" id="courses">
            <div className="course-container-v2 course-two-cards">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="course-section-head"
                >
                    <h2>Courses</h2>
                    <p>
                        From DSLR masterclass to mobile astrophotography—learn to capture the night sky at your level.
                    </p>
                </motion.div>

                <div className="course-cards-row">
                    {courseList.map((course, index) => (
                        <motion.div
                            key={course.slug}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="course-card-v2 course-card-link-wrap"
                        >
                            <Link to={`/course/${course.slug}`} className="course-card-link">
                                {course.slug === 'masterclass' && (
                                    <div className="card-badge">Most Popular</div>
                                )}
                                <h3>{course.title}</h3>
                                <p className="course-card-desc">{course.description}</p>
                                <div className="price-v2">{course.priceLabel}</div>
                                <span className="guarantee-text">
                                    {course.price ? 'Lifetime access + Updates' : 'Curriculum in development'}
                                </span>
                                <span className="btn-enroll-v2">View Course</span>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Course;
