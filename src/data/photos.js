// Landscape (images)
import langzaImg from '../assets/langza.png';
import cometTsuImg from '../assets/comet-tsu.jpeg';
import maceImg from '../assets/mace_new.png';
import pangongImg from '../assets/pangong1.png';
import milkywayArchImg from '../assets/milkyway-arch.jpg';
import nubraImg from '../assets/nubra.png';

// Portrait (images)
import tsoImg from '../assets/tso1.png';
import milkyImg from '../assets/milkydate2.png';
import hagarImg from '../assets/hagar.png';
import cometVerticalImg from '../assets/comet-vertical.jpeg';
import cometTeleImg from '../assets/comet-tele.jpeg';
import cb14Img from '../assets/CB-14.jpeg';
import houseImg from '../assets/abandoned_house.png';

// Deep Sky (images)
import andromedaImg from '../assets/andromeda.jpeg';
import orionImg from '../assets/orion.jpeg';

// Star Trails (images)
import pangongTrailImg from '../assets/pangong_trail.jpeg';
import shantiTsupaImg from '../assets/shanti_tsupa.jpeg';
import tsoTrailsImg from '../assets/tso_trails.jpeg';

// Meteor Shower (images)
import geminidsImg from '../assets/geminids.png';
import perseidsImg from '../assets/perseids.jpeg';

export const photos = [
    // ——— Landscape ———
    { id: 1, src: langzaImg, title: "Langza Buddha", category: "Landscape", type: "image", exif: "ISO 3200 | f/1.8 | 10 sec", gear: "Sony A7III, 20mm G", story: "The Langza Buddha statue in Spiti Valley, standing silent under the star-filled Himalayan sky." },
    { id: 2, src: cometTsuImg, title: "Comet Tsuchinshan", category: "Landscape", type: "image", exif: "ISO 3200 | f/1.8 | 10 sec", gear: "Sony A7III, 16-35mm GM", story: "Comet Tsuchinshan–Atlas above the high-altitude landscape." },
    { id: 3, src: maceImg, title: "MACE Telescope", category: "Landscape", type: "image", exif: "ISO 3200 | f/1.8 | 10 sec", gear: "Canon 6D, Rokinon 14mm", story: "The MACE telescope at Hanle Dark Sky Reserve, with the night sky and stars filling the frame." },
    { id: 4, src: pangongImg, title: "Milky Way over Pangong", category: "Landscape", type: "image", exif: "ISO 3200 | f/1.8 | 10 sec", gear: "Sony A7III, 16-35mm GM", story: "The Milky Way rising over Pangong Lake and the Changthang plateau at 4,250 metres." },
    { id: 19, src: milkywayArchImg, title: "Milkyway Arch", category: "Landscape", type: "image", exif: "ISO 3200 | f/1.8 | 10 sec", gear: "—", story: "The Milky Way arching across the night sky over the landscape." },
    { id: 20, src: nubraImg, title: "Nubra Valley", category: "Landscape", type: "image", exif: "ISO 3200 | f/1.8 | 10 sec", gear: "—", story: "The night sky and stars over Nubra Valley in Ladakh, with the landscape stretching into the frame." },

    // ——— Portrait ———
    { id: 5, src: tsoImg, title: "Tso Moriri", category: "Portrait", type: "image", exif: "ISO 3200 | f/1.8 | 10 sec", gear: "Canon 6D, 24-70mm", story: "Tso Moriri Lake in Ladakh, with the night sky reflected in its still waters." },
    { id: 6, src: milkyImg, title: "MilkyDate", category: "Portrait", type: "image", exif: "ISO 3200 | f/1.8 | 10 sec", gear: "Nikon D850, 14-24mm", story: "MilkyDate—the Milky Way arching over the landscape in a single memorable frame." },
    { id: 7, src: hagarImg, title: "Hagar", category: "Portrait", type: "image", exif: "ISO 3200 | f/1.8 | 10 sec", gear: "ZWO 1600MM, RedCat 51", story: "The Hagar nebula region in a portrait frame, revealing structure and depth in the night sky." },
    { id: 8, src: cometVerticalImg, title: "Comet Tsuchinshan", category: "Portrait", type: "image", exif: "ISO 3200 | f/1.8 | 10 sec", gear: "Canon 6D, 50mm", story: "Comet Tsuchinshan in a vertical frame, rising through the night sky." },
    { id: 9, src: cometTeleImg, title: "Manali", category: "Portrait", type: "image", exif: "ISO 3200 | f/1.8 | 10 sec", gear: "Canon 6D, 200mm", story: "A night-sky capture from Manali—stars and the landscape of the Himalayas." },
    { id: 10, src: cb14Img, title: "Chandratal", category: "Portrait", type: "image", exif: "ISO 3200 | f/1.8 | 10 sec", gear: "RedCat 51", story: "Chandratal, the Moon Lake—high-altitude waters and the night sky in a portrait frame." },
    { id: 11, src: houseImg, title: "MilkyHouse", category: "Portrait", type: "image", exif: "ISO 3200 | f/1.8 | 10 sec", gear: "Sony A7sIII, 14mm GM", story: "MilkyHouse—a structure under the Milky Way, with the galaxy arching over the frame." },

    // ——— Deep Sky ———
    { id: 12, src: andromedaImg, title: "Andromeda Galaxy", category: "Deep Sky", type: "image", exif: "ISO 3200 | f/1.8 | 10 sec", gear: "RedCat 51", story: "The Andromeda Galaxy, our nearest large galactic neighbor, in a sea of stars." },
    { id: 13, src: orionImg, title: "Orion Nebula", category: "Deep Sky", type: "image", exif: "ISO 3200 | f/1.8 | 10 sec", gear: "RedCat 51", story: "The Orion Nebula—a stellar nursery glowing in the winter sky." },

    // ——— Star Trails ———
    { id: 14, src: pangongTrailImg, title: "Pangong Star Trails", category: "Star Trails", type: "image", exif: "ISO 3200 | f/1.8 | 10 sec", gear: "Sony A7III, 16-35mm", story: "Circumpolar star trails over Pangong Lake." },
    { id: 15, src: shantiTsupaImg, title: "Shanti Tsupa Trails", category: "Star Trails", type: "image", exif: "ISO 3200 | f/1.8 | 10 sec", gear: "Canon 6D, 24mm", story: "Star trails above the high-altitude landscape." },
    { id: 16, src: tsoTrailsImg, title: "Tso Moriri Star Trails", category: "Star Trails", type: "image", exif: "ISO 3200 | f/1.8 | 10 sec", gear: "Sony A7III, 14mm", story: "Hours of rotation captured over Tso Moriri." },

    // ——— Meteor Shower ———
    { id: 17, src: geminidsImg, title: "Geminids Shower", category: "Meteor Shower", type: "image", exif: "ISO 3200 | f/1.8 | 10 sec", gear: "Canon 5D MkIV, 24mm", story: "Over 100 meteors captured during the peak of the Geminids meteor shower." },
    { id: 18, src: perseidsImg, title: "Perseids Shower", category: "Meteor Shower", type: "image", exif: "ISO 3200 | f/1.8 | 10 sec", gear: "Sony A7III, 20mm", story: "The annual Perseids meteor shower lighting up the summer night." },

];

export const categories = ["Landscape", "Portrait", "Deep Sky", "Star Trails", "Meteor Shower", "Timelapse"];
