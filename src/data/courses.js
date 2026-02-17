import exampleMilkywayArch from '../assets/milkyway-arch.webp';
import exampleTsoTrails from '../assets/tso_trails.webp';
import exampleCometTele from '../assets/comet-tele.webp';
import exampleLangza from '../assets/langza.webp';
import exampleAndromeda from '../assets/andromeda.webp';
import examplePerseids from '../assets/perseids.webp';
import exampleAvengers from '../assets/avengers.webp';
import exampleChandratalHandhold from '../assets/chandratal-handhold.webp';

export const courses = {
  masterclass: {
    slug: 'masterclass',
    title: 'Astrophotography Masterclass',
    subtitle: 'Astrophotography Masterclass',
    tagline: '8-Lesson Beginner Course',
    price: 9999,
    currency: 'INR',
    priceLabel: '₹9,999',
    description: 'A complete step-by-step path to go from first night-sky photo to confident astrophotographer. Learn how to plan shoots, choose and use your DSLR gear, capture clean Milky Way, star-trail and timelapse sequences, and build a professional post-processing workflow for print-ready, portfolio-grade images.',
    features: [
      { icon: '📷', title: 'DSLR + Tripod Only', text: 'No fancy gear required. Start with what you have.' },
      { icon: '🌌', title: 'Milky Way Editing', text: 'Professional workflow for popping the galactic core.' },
      { icon: '⏳', title: 'Star Trails & Timelapses', text: 'Capture the movement of time.' },
      { icon: '🔭', title: 'Deep Sky Widefield', text: 'Capture Andromeda and Orion without a telescope.' },
    ],
    examples: [
      { image: exampleMilkywayArch, caption: 'Capturing the grand arch of the Milky Way over the mountains.' },
      { image: exampleTsoTrails, caption: 'The mesmerizing circular motion of stars around Polaris.' },
      { image: exampleCometTele, caption: 'Zooming in on the celestial visitors passing through our solar system.' },
      { image: exampleLangza, caption: 'Ancient structures meeting the timeless beauty of the galactic core.' },
      { image: exampleAndromeda, caption: 'Our neighbor galaxy, captured with just a DSLR and a telephoto lens.' },
      { image: examplePerseids, caption: 'The magic of a meteor shower lighting up the night sky.' }
    ],
    curriculum: [
      {
        id: 1,
        title: 'Lesson 1: Essential DSLR Gear and Tripod Setup',
        objective: 'Optimize basic kit for sharp night shots.',
        topics: [
          'Lenses (kit zoom to wide primes), aperture/ISO basics.',
          'Tripod leveling, remote shutter, battery hacks, camera settings',
          'Infinity focus and Intervalometer',
        ],
        activity: 'Home infinity focus Test',
      },
      {
        id: 2,
        title: 'Lesson 2: Night Sky Planning and Location Scouting',
        objective: 'Find and time perfect shoots.',
        topics: [
          'Milky Way seasons, Bortle maps, moon phases (PhotoPills).',
          'Foreground scouting (beaches, hills) for landscapes.',
          'Twilight and Astronomical twilight',
        ],
        activity: 'Find best time for milky way shoot for specific location',
      },
      {
        id: 3,
        title: 'Lesson 3: Fundamental Landscape Capture Techniques',
        objective: 'Nail exposures and stacking basics.',
        topics: [
          '500 Rule, 10-20 frame stacks for noise-free skies.',
          'Bracketing, light painting foregrounds, histograms.',
          'Calibration frames - Darks, Biases, flats',
          'Stacking Software (Sequator)',
        ],
        activity: 'Shoot + stack a simple landscape.',
      },
      {
        id: 4,
        title: 'Lesson 4: Composition Mastery – Why It Transforms Shots',
        objective: 'Frame pro-level emotional images.',
        topics: [
          'Why it transforms: Guides viewer eye, tells stories, increases print value.',
          'Rule of thirds, leading lines, golden ratio, negative space.',
          'Importance of Foreground',
          'Subject/Person Astrophotography',
        ],
        activity: 'Look at your past shots and explain Composition',
      },
      {
        id: 5,
        title: 'Lesson 5: Complete Post-Processing Workflow – Milky Way Edit',
        objective: 'Master RAW-to-final pipeline.',
        topics: [
          'Stacking',
          'Noise/Gradient reduction',
          'Stars Removal and Minimisation',
          'Photoshop',
        ],
        activity: 'Edit a Raw MilkyWay Image',
      },
      {
        id: 6,
        title: 'Lesson 6: Capture and Edit Star Trails',
        objective: 'Create dynamic swirling skies.',
        topics: [
          'How to find Find Polaris',
          'Best settings to capture Star Trails',
          'Editing - StarStaX stack + foreground blend',
        ],
        activity: 'Edit star trail image',
      },
      {
        id: 7,
        title: 'Lesson 7: Astro Timelapse – Shoot and Edit Motion',
        objective: 'Shoot Milky Way timelapse',
        topics: [
          'Technique to shoot Astro timelapse',
          'Edit: LRTimelapse + Lightroom',
        ],
        activity: 'Assemble 30s timelapse.',
      },
      {
        id: 8,
        title: 'Lesson 8: Shoot and Edit Deep Sky',
        objective: 'Wide-field nebulae on DSLR.',
        topics: [
          'Shoot: Pleiades/Andromeda stacks (50+ frames).',
          'Complete Siril workflow',
          'Background reduction, Stars removal, Histogram Stretch',
        ],
        activity: 'Edit your deep sky target.',
      },
    ],
  },
  mobile: {
    slug: 'mobile',
    title: 'Mobile Astrophotography',
    subtitle: 'Mobile Astrophotography',
    tagline: 'Just your phone. Shoot tonight → post tomorrow.',
    price: 999,
    currency: 'INR',
    priceLabel: '₹999',
    description: 'One focused session to go from first mobile night-sky photo to share-worthy Milky Way and star-trail shots. Learn simple gear setups, three easy capture methods, and a practical Lightroom Mobile workflow so you can shoot, edit, and post from anywhere in the world.',
    features: [
      { icon: '📱', title: 'Just Your Phone', text: 'No paid apps required.' },
      { icon: '🌌', title: 'DSLR-Quality Stacks', text: 'NightCap stacking and iPhone Night Mode for noise-free skies.' },
      { icon: '⚡', title: 'Shoot Tonight', text: 'Shoot tonight → post tomorrow. Viral results guaranteed.' },
      { icon: '🎁', title: 'Bonus Downloads', text: 'Cheat sheet, RAW phone files, and star maps to help you plan dark-sky shoots.' },
    ],
    examples: [
      { image: exampleAvengers, caption: 'Dramatic Milky Way portraits captured with a smartphone.' },
      { image: exampleChandratalHandhold, caption: 'The beauty of high-altitude night skies, captured without a tripod.' }
    ],
    curriculum: [
      {
        id: 1,
        title: 'Mobile Astrophotography: Start to Finish',
        objective: 'Go from zero to shooting and editing Milky Way and star-trail shots on your phone, then sharing and monetizing them.',
        topics: [
          'Why mobile astro works: phone vs DSLR, and the potential of phone shots.',
          'Pocket gear: NightCap Camera (stacking), PhotoPills (Milky Way timing), Lightroom Mobile, wide-angle clip-on lens, and example dark-sky locations.',
          'Planning: Bortle 4+ locations (e.g. Malshej Ghat, Torna Fort), Milky Way position, moon-phase rules, foreground scouting with Google Earth.',
          'Capture: iPhone Night Mode auto-stack, NightCap multi-frame stack for clean skies, and a simple star-trails method.',
          'Editing in Lightroom Mobile: Enhance (AI denoise), exposure, dehaze, HSL and sky gradient, star sharpening, export for Instagram.',
          'Composition: rule of thirds, phone light painting, vertical Reels format, panorama stacks.',
          'Monetize: print sales, growing on Instagram, finding and sharing dark-sky locations, Discord community, pro wallpaper pack.',
          'Bonus: 1-page cheat sheet, practice RAW files, and dark-site planning checklist.',
        ],
        activity: 'Plan one shoot with PhotoPills, capture using at least one method, edit in Lightroom Mobile, and share or list one monetization step you will take.',
      },
    ],
  },
};

export const courseList = [courses.masterclass, courses.mobile];
