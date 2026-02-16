import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { photos } from '../data/photos';
import './Gallery.css';

// Import assets for home grid (same as in photos.js)
import houseImg from '../assets/abandoned_house.png';
import geminidsImg from '../assets/geminids.png';
import hagarImg from '../assets/hagar.png';
import langzaImg from '../assets/langza.png';
import maceImg from '../assets/mace_new.png';
import milkyImg from '../assets/milkydate2.png';
import pangongImg from '../assets/pangong1.png';
import tsoImg from '../assets/tso1.png';
import cometTeleImg from '../assets/comet-tele.jpeg';
import tsoTrailsImg from '../assets/tso_trails.jpeg';

// photoId = id in photos.js (single source of truth for titles)
const highlightPhotoIds = [3, 1, 6, 17, 4, 7, 5, 11, 9, 16];
const highlightSpans = ['col-2 row-2', '', 'row-2', '', 'col-2', 'row-2', 'row-2', 'row-2', 'row-2', 'col-2'];
const highlightSrcs = [maceImg, langzaImg, milkyImg, geminidsImg, pangongImg, hagarImg, tsoImg, houseImg, cometTeleImg, tsoTrailsImg];

const Gallery = () => {
    const images = useMemo(() => {
        const byId = Object.fromEntries(photos.map(p => [p.id, p]));
        return highlightPhotoIds.map((photoId, i) => {
            const photo = byId[photoId];
            return {
                id: i + 1,
                src: highlightSrcs[i],
                alt: photo ? photo.title : '',
                span: highlightSpans[i],
            };
        });
    }, []);

    return (
        <section className="gallery-v2">
            <div className="gallery-grid-v2">
                {images.map((img, index) => (
                    <motion.div
                        key={img.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className={`gallery-item-v2 ${img.span}`}
                    >
                        <img src={img.src} alt={img.alt} loading="lazy" className={img.id === 10 ? 'image-position-up' : ''} />
                        <div className="gallery-overlay">
                            <span>{img.alt}</span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default Gallery;
