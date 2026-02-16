import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { photos, categories } from '../data/photos';
import './GalleryPage.css';

const INITIAL_COUNT = 9;
const LOAD_MORE_COUNT = 6;

const GalleryPage = () => {
    const [activeCategory, setActiveCategory] = useState("Landscape");
    const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const loadMoreRef = useRef(null);

    // Filter Logic (exclude Moon card: id 21 or title "Moon")
    const filteredPhotos = useMemo(() => {
        return photos.filter(photo => {
            if (photo.category !== activeCategory) return false;
            if (photo.id === 21 || /^Moon$/i.test(photo.title?.trim?.() ?? photo.title)) return false;
            return true;
        });
    }, [activeCategory]);

    const visiblePhotos = filteredPhotos.slice(0, visibleCount);
    const hasMore = visibleCount < filteredPhotos.length;

    // Infinite scroll: load more when sentinel enters viewport
    const loadMore = useCallback(() => {
        setVisibleCount(prev => Math.min(prev + LOAD_MORE_COUNT, filteredPhotos.length));
    }, [filteredPhotos.length]);

    useEffect(() => {
        if (!hasMore) return;
        const el = loadMoreRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) loadMore();
            },
            { rootMargin: '200px', threshold: 0.1 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [hasMore, loadMore]);

    // Reset visible count when category changes
    useEffect(() => {
        setVisibleCount(INITIAL_COUNT);
    }, [activeCategory]);

    return (
        <div className="gallery-page">
            {/* Hero Banner */}
            <div className="gallery-hero">
                <h1>Cosmic Collection</h1>
                <p>A collection of photons gathered from across the universe.</p>
            </div>

            {/* Filter Bar */}
            <div className="filter-bar">
                {categories.map(cat => (
                    <button
                        key={cat}
                        className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                        onClick={() => setActiveCategory(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Photo Grid - Timelapse / Portrait get section-specific layout */}
            <motion.div
                layout
                className={`photo-grid${activeCategory === 'Timelapse' ? ' photo-grid--timelapse' : ''}${activeCategory === 'Portrait' ? ' photo-grid--portrait' : ''}`}
            >
                <AnimatePresence>
                    {visiblePhotos.map((photo) => {
                        const isTimelapse = photo.category === 'Timelapse';
                        const isPortraitCard = !isTimelapse && (photo.category === 'Portrait' || (photo.orientation === 'portrait'));
                        const isLandscapeVideoCard = !isTimelapse && photo.category === 'Timelapse' && photo.orientation !== 'portrait';
                        const cardClass = [
                            'photo-card',
                            ...(isTimelapse && photo.span ? photo.span.split(/\s+/) : []),
                            isTimelapse && photo.vertical && 'photo-card--vertical',
                            isTimelapse && photo.coverPreview && 'photo-card--cover-preview',
                            !isTimelapse && isPortraitCard && 'photo-card--portrait',
                            !isTimelapse && isLandscapeVideoCard && 'photo-card--landscape-video',
                        ].filter(Boolean).join(' ');
                        return (
                        <motion.div
                            layout
                            key={photo.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                            className={cardClass}
                            onClick={() => setSelectedPhoto(photo)}
                        >
                            {photo.type === 'video' ? (
                                <video src={photo.src} muted loop onMouseOver={e => e.target.play()} onMouseOut={e => e.target.pause()} className="gallery-video-thumb" />
                            ) : (
                                <img src={photo.src} alt={photo.title} loading="lazy" />
                            )}
                            <div className="photo-overlay">
                                <h3>{photo.title}</h3>
                            </div>
                        </motion.div>
                        );
                    })}
                </AnimatePresence>
            </motion.div>

            {/* Sentinel for infinite scroll */}
            {hasMore && <div ref={loadMoreRef} className="infinite-scroll-sentinel" aria-hidden="true" />}

            {/* Lightbox */}
            <AnimatePresence>
                {selectedPhoto && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="lightbox"
                        onClick={() => setSelectedPhoto(null)}
                    >
                        <div className="lightbox-content" onClick={e => e.stopPropagation()}>
                            <button className="close-btn" onClick={() => setSelectedPhoto(null)}>×</button>
                            <div className="lightbox-grid">
                                <div className="lightbox-img-wrapper">
                                    {selectedPhoto.type === 'video' ? (
                                        <video src={selectedPhoto.src} controls autoPlay className="lightbox-video" />
                                    ) : (
                                        <img src={selectedPhoto.src} alt={selectedPhoto.title} />
                                    )}
                                </div>
                                <div className="lightbox-details">
                                    <h2>{selectedPhoto.title}</h2>
                                    <div className="meta-row">
                                        <span className="badge">{selectedPhoto.category}</span>
                                    </div>
                                    <p className="story">{selectedPhoto.story}</p>

                                    <div className="exif-box">
                                        <h4>EXIF Data</h4>
                                        <p><strong>Settings:</strong> {selectedPhoto.exif}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default GalleryPage;
