import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import {
  heroBanner,
  weddingCover,
  fashionCover,
  portraitCover,
  directorPortrait,
  studioPrintsAlbums,
} from '../../data/initialData';
import {
  Camera,
  Sparkles,
  ArrowRight,
  Shield,
  Users,
  Award,
  Calendar,
  CheckCircle2,
  Maximize2,
  Mail,
  Phone,
  MapPin,
  Clock,
  Layers,
  Heart,
  ChevronRight,
  Star,
  Download,
  BookOpen,
  Send,
} from 'lucide-react';

interface StudioHomePageProps {
  onOpenAuthModal: () => void;
  onNavigateToShoots: () => void;
  onNavigateToFacilities: () => void;
  onNavigateToClientPortal: () => void;
  onNavigateToAdminDashboard: () => void;
}

export const StudioHomePage: React.FC<StudioHomePageProps> = ({
  onOpenAuthModal,
  onNavigateToShoots,
  onNavigateToFacilities,
  onNavigateToClientPortal,
  onNavigateToAdminDashboard,
}) => {
  const { currentUser } = useStudio();
  const isAdmin = currentUser?.role === 'ADMIN';
  const isClient = currentUser?.role === 'CLIENT';
  const isGuest = !currentUser;
  const [activeCategory, setActiveCategory] = useState<'all' | 'wedding' | 'fashion' | 'portrait' | 'commercial'>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<any | null>(null);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const heroSlides = [
    {
      img: heroBanner,
      tag: 'Grand Infinity Cyclorama Stage 01',
      title: 'Capturing The Extraordinary in Light, Cinema & Emotion',
      subtitle: 'Premier Photography Studio, Acoustic Soundstages & Fine Art Visual Atelier in Mumbai.',
    },
    {
      img: weddingCover,
      tag: 'Royal Heritage Wedding Series',
      title: 'Cinematic Royal Wedding Stories & Fine Art Heirloom Albums',
      subtitle: 'Capturing unforgettable timeless moments across heritage destinations pan-India.',
    },
    {
      img: fashionCover,
      tag: 'High Fashion & Editorial Atelier',
      title: 'Couture Editorial Campaigns & Commercial Visuals',
      subtitle: '100-Megapixel Medium Format precision engineered with Profoto high-speed lighting.',
    },
  ];

  const [activeSlide, setActiveSlide] = useState(0);

  const portfolioItems = [
    {
      id: 'p-1',
      title: 'The Royal Wedding at Lake Palace',
      client: 'Priya & Kabir Sharma',
      category: 'wedding',
      image: weddingCover,
      tag: 'Fine Art Wedding',
      camera: 'Sony FX6 Cine & Hasselblad X2D',
      desc: 'Three days of royal rituals, intimate portraits, and royal palace dusk cinematography.',
    },
    {
      id: 'p-2',
      title: 'Summer Haute Couture Lookbook',
      client: 'Arjun Mehta · Luxe Mode',
      category: 'fashion',
      image: fashionCover,
      tag: 'High Fashion Editorial',
      camera: 'Hasselblad 100MP Medium Format',
      desc: '15 signature looks captured on our white infinity cyclorama with Profoto AirTTL lighting.',
    },
    {
      id: 'p-3',
      title: 'Natural Light Heritage Portraits',
      client: 'Sneha & Rajesh Kapoor',
      category: 'portrait',
      image: portraitCover,
      tag: 'Fine Art Portraiture',
      camera: 'Sony A1 with 85mm f/1.2 GM',
      desc: 'Archival family portrait session utilizing frosted north daylight windows and canvas backdrops.',
    },
    {
      id: 'p-4',
      title: 'Automotive & Cinema Commercial Production',
      client: 'A-S Studio Production Bay',
      category: 'commercial',
      image: heroBanner,
      tag: 'Commercial Studio Soundstage',
      camera: 'DJI Inspire 3 8K ProRes RAW',
      desc: 'Direct roll-in vehicle access and acoustic soundstage bay for commercial TVCs.',
    },
  ];

  const filteredPortfolio =
    activeCategory === 'all'
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === activeCategory);

  const workshops = [
    {
      title: 'Studio Lighting Mastery & Cycloramas',
      duration: '2-Day Intensive',
      spots: 'Limited to 8 Photographers',
      level: 'Intermediate to Advanced',
      desc: 'Hands-on training with Profoto strobe grids, light shapers, negative fill, and editorial color theory.',
      price: '₹24,500',
    },
    {
      title: 'Cinematic Royal Wedding Storytelling',
      duration: '3-Day Immersive',
      spots: 'Limited to 10 Photographers',
      level: 'All Levels',
      desc: 'Mastering unobtrusive photojournalism, low-light framing, luxury couple directing, and ProRes grading.',
      price: '₹32,000',
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50 text-neutral-900 space-y-20 pb-16">
      {/* 1. Hero Section (In the style of Meghan Maloney Photography) */}
      <section className="relative -mt-8 w-full max-w-full min-w-0 min-h-[580px] lg:min-h-[660px] flex items-center justify-center overflow-hidden bg-neutral-950">
        {/* Background Image Carousel with smooth fade */}
        <div className="absolute inset-0">
          <img
            src={heroSlides[activeSlide].img}
            alt={heroSlides[activeSlide].title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center filter brightness-[0.55] transition-all duration-1000 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-neutral-950/60" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 pt-12 pb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-amber-500/30 text-amber-400 text-xs font-mono tracking-wide backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{heroSlides[activeSlide].tag}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-neutral-900 tracking-tight leading-tight max-w-4xl mx-auto">
            {heroSlides[activeSlide].title}
          </h1>

          <p className="text-base sm:text-lg text-neutral-700 max-w-2xl mx-auto leading-relaxed font-light">
            {heroSlides[activeSlide].subtitle}
          </p>

          {/* Call to Actions - Strictly Role Tailored */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            {isClient && (
              <>
                <button
                  onClick={onNavigateToClientPortal}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                >
                  <Users className="w-4 h-4" />
                  <span>Open My Proofing Gallery</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('portfolio-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/90 hover:bg-neutral-800 text-white font-semibold text-xs uppercase tracking-wider border border-neutral-700 transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
                >
                  <span>Explore Studio Portfolio</span>
                </button>
              </>
            )}

            {isGuest && (
              <>
                <button
                  onClick={() => {
                    const el = document.getElementById('portfolio-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                >
                  <span>Explore Studio Portfolio</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onOpenAuthModal}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/90 hover:bg-neutral-800 text-black font-semibold text-xs uppercase tracking-wider border border-amber-500/40 transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
                >
                  <Users className="w-4 h-4" />
                  <span>Client &amp; Staff Login</span>
                </button>
              </>
            )}

            {isAdmin && (
              <>
                <button
                  onClick={onNavigateToAdminDashboard}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                >
                  <Shield className="w-4 h-4" />
                  <span>Studio Operations Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onNavigateToFacilities}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/90 hover:bg-neutral-800 text-white font-semibold text-xs uppercase tracking-wider border border-neutral-700 transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
                >
                  <Camera className="w-4 h-4 text-amber-400" />
                  <span>Studio Stages &amp; Gear</span>
                </button>
              </>
            )}
          </div>

          {/* Slide Indicator Dots */}
          <div className="flex items-center justify-center gap-2.5 pt-6">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`transition-all ${
                  activeSlide === idx
                    ? 'w-8 h-2 rounded-full bg-amber-500'
                    : 'w-2 h-2 rounded-full bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Bottom Specs Ticker */}
        <div className="absolute bottom-0 inset-x-0 bg-neutral-950/90 border-t border-stone-200/80 py-2.5 px-4 hidden md:block">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-neutral-600">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>A-S Studio Production Bays: Stage 01 (Infinity Cyc) · Stage 02 (Daylight Atelier) · Stage 03 (Soundstage)</span>
            </span>
            <span className="font-mono text-amber-400/90">Sony FX6 · Hasselblad 100C · Profoto AirTTL · DGCA 8K Drone</span>
          </div>
        </div>
      </section>

      {/* 2. Core Pillars (Like Meghan Maloney's "Workshops", "Prints", "Galleries") */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="text-xs font-mono uppercase tracking-widest text-amber-400">
            What We Create &amp; Offer
          </h2>
          <p className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
            Craftsmanship in Every Frame
          </p>
          <p className="text-xs sm:text-sm text-neutral-600">
            From premier studio cyclorama rentals to heirloom Italian wedding albums and photography masterclasses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Tailored to Client / Visitor / Admin */}
          {isClient ? (
            <div className="group rounded-2xl bg-white border border-stone-200 hover:border-amber-300 transition-all overflow-hidden flex flex-col justify-between">
              <div className="relative h-52 overflow-hidden">
                <img
                  src={weddingCover}
                  alt="Client Proofing Gallery"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-black/30" />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/70 backdrop-blur-md text-amber-400 font-mono text-[10px] border border-amber-500/30">
                  Client Deliverables
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-neutral-900 tracking-tight group-hover:text-amber-400 transition-colors">
                    My Proofing &amp; Album Selections
                  </h3>
                  <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                    Access your private high-resolution photo gallery, curate shots for your album, and download master cinema files.
                  </p>
                </div>
                <button
                  onClick={onNavigateToClientPortal}
                  className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold rounded-xl transition-colors flex items-center justify-between"
                >
                  <span>Open My Proofing Gallery</span>
                  <ChevronRight className="w-4 h-4 text-neutral-950" />
                </button>
              </div>
            </div>
          ) : isGuest ? (
            <div className="group rounded-2xl bg-white border border-stone-200 hover:border-amber-300 transition-all overflow-hidden flex flex-col justify-between">
              <div className="relative h-52 overflow-hidden">
                <img
                  src={heroBanner}
                  alt="Signature Visual Shoots"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-black/30" />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/70 backdrop-blur-md text-amber-400 font-mono text-[10px] border border-amber-500/30">
                  Featured Portfolio
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-neutral-900 tracking-tight group-hover:text-amber-400 transition-colors">
                    Signature Photography Shoots
                  </h3>
                  <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                    Royal wedding cinematography, high fashion lookbooks, and timeless daylight portraits created with medium-format precision.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const el = document.getElementById('portfolio-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-2.5 px-4 bg-white hover:bg-stone-100 border border-stone-200 text-xs font-semibold text-neutral-800 rounded-xl transition-colors flex items-center justify-between"
                >
                  <span>Browse Portfolio Collections</span>
                  <ChevronRight className="w-4 h-4 text-amber-400" />
                </button>
              </div>
            </div>
          ) : (
            <div className="group rounded-2xl bg-white border border-stone-200 hover:border-amber-300 transition-all overflow-hidden flex flex-col justify-between">
              <div className="relative h-52 overflow-hidden">
                <img
                  src={heroBanner}
                  alt="Studio Soundstages"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-black/30" />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/70 backdrop-blur-md text-amber-400 font-mono text-[10px] border border-amber-500/30">
                  Stage 01 · 02 · 03
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-neutral-900 tracking-tight group-hover:text-amber-400 transition-colors">
                    Studio Stages &amp; Lighting Rental
                  </h3>
                  <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                    3 fully equipped production spaces with 3-wall infinite cycloramas, motorized lighting trusses, and silent acoustic HVAC.
                  </p>
                </div>
                <button
                  onClick={onNavigateToFacilities}
                  className="w-full py-2.5 px-4 bg-white hover:bg-stone-100 border border-stone-200 text-xs font-semibold text-neutral-800 rounded-xl transition-colors flex items-center justify-between"
                >
                  <span>View Stages &amp; Gear Vault</span>
                  <ChevronRight className="w-4 h-4 text-amber-400" />
                </button>
              </div>
            </div>
          )}

          {/* Card 2: Fine Art Prints & Albums */}
          <div className="group rounded-2xl bg-white border border-stone-200 hover:border-amber-300 transition-all overflow-hidden flex flex-col justify-between">
            <div className="relative h-52 overflow-hidden">
              <img
                src={studioPrintsAlbums}
                alt="Fine Art Prints & Heirloom Albums"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-black/30" />
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/70 backdrop-blur-md text-amber-400 font-mono text-[10px] border border-amber-500/30">
                Archival Cotton Paper
              </span>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-lg font-bold text-neutral-900 tracking-tight group-hover:text-amber-400 transition-colors">
                  Heirloom Albums &amp; Museum Prints
                </h3>
                <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                  Handcrafted Italian velvet layflat albums, gallery canvas wraps with museum glazing, and archival pigment prints.
                </p>
              </div>
              <button
                onClick={() => {
                  const el = document.getElementById('albums-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full py-2.5 px-4 bg-white hover:bg-stone-100 border border-stone-200 text-xs font-semibold text-neutral-800 rounded-xl transition-colors flex items-center justify-between"
              >
                <span>Explore Heirloom Prints</span>
                <ChevronRight className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          </div>

          {/* Card 3: Master Workshops */}
          <div className="group rounded-2xl bg-white border border-stone-200 hover:border-amber-300 transition-all overflow-hidden flex flex-col justify-between">
            <div className="relative h-52 overflow-hidden">
              <img
                src={portraitCover}
                alt="Workshops & Masterclasses"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-black/30" />
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/70 backdrop-blur-md text-amber-400 font-mono text-[10px] border border-amber-500/30">
                Small-Group Sessions
              </span>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-lg font-bold text-neutral-900 tracking-tight group-hover:text-amber-400 transition-colors">
                  Studio Workshops &amp; Mentorship
                </h3>
                <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                  Master studio strobe shaping, wedding photojournalism, and post-production color science directly from Vikramaditya Roy.
                </p>
              </div>
              <button
                onClick={() => {
                  const el = document.getElementById('workshops-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full py-2.5 px-4 bg-white hover:bg-stone-100 border border-stone-200 text-xs font-semibold text-neutral-800 rounded-xl transition-colors flex items-center justify-between"
              >
                <span>Browse Upcoming Masterclasses</span>
                <ChevronRight className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Portfolio Galleries (Like Meghan Maloney's NZ Landscapes) */}
      <section id="portfolio-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-amber-400 mb-1">
              Curated Portfolio
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
              Signature Visual Stories
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              Browse through our recent high-fashion campaigns, royal weddings, and daylight portrait series.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Collections' },
              { id: 'wedding', label: 'Weddings' },
              { id: 'fashion', label: 'Fashion & Editorial' },
              { id: 'portrait', label: 'Portraits' },
              { id: 'commercial', label: 'Commercial Soundstage' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeCategory === cat.id
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                    : 'bg-white hover:bg-neutral-800 text-neutral-700 border border-stone-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPortfolio.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedPhoto(item)}
              className="group relative rounded-2xl bg-white border border-stone-200 overflow-hidden cursor-pointer hover:border-amber-300 transition-all shadow-xl"
            >
              <div className="relative h-72 sm:h-80 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-black/30 opacity-90 group-hover:opacity-80 transition-opacity" />
                
                {/* Floating Tags */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded bg-black/70 backdrop-blur-md text-amber-400 font-mono text-[10px] border border-amber-500/30">
                    {item.tag}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-4 h-4 text-amber-400" />
                  </div>
                </div>

                {/* Bottom Overlay Title */}
                <div className="absolute bottom-4 left-4 right-4 space-y-1.5">
                  <h3 className="text-lg font-bold text-neutral-900 tracking-tight group-hover:text-amber-400 transition-colors">
                    {item.title}
                  </h3>
                  <div className="text-xs text-neutral-700 flex items-center justify-between">
                    <span>{item.client}</span>
                    <span className="font-mono text-[11px] text-neutral-600">{item.camera}</span>
                  </div>
                  <p className="text-[11px] text-neutral-600 line-clamp-1">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-8">
          <button
            onClick={onNavigateToShoots}
            className="px-6 py-2.5 rounded-xl bg-white hover:bg-neutral-800 border border-stone-200 text-xs font-semibold text-neutral-800 hover:text-white transition-colors inline-flex items-center gap-2"
          >
            <span>View All Shoots &amp; Photo Proofing Sets</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </section>

      {/* 4. Meet The Lead Director & Master Photographer (Like "Meet Meghan Maloney") */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white border border-stone-200 p-8 sm:p-12 overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Director Portrait */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-stone-200 aspect-[4/5] max-w-md mx-auto">
                <img
                  src={directorPortrait}
                  alt="Vikramaditya Roy - Lead Director"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="font-bold text-base">Vikramaditya Roy</div>
                  <div className="text-xs text-amber-400 font-mono">Master Visualist &amp; Lead Director</div>
                </div>
              </div>
            </div>

            {/* Biography & Studio Ethos */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-amber-400">
                  <Award className="w-4 h-4" />
                  <span>About The Founder &amp; Vision</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
                  Crafting Timeless Heirlooms Through Cinematic Precision
                </h2>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-neutral-700 leading-relaxed font-light">
                <p>
                  Welcome to <strong>A-S Studio</strong>. For over a decade, we have been dedicated to capturing moments that transcend the ordinary—from intimate royal wedding ceremonies across Udaipur and Rajasthan to high-octane editorial campaigns for India's leading fashion ateliers.
                </p>
                <p>
                  Our studio is built around an uncompromising obsession with light and emotional authenticity. Every shoot is captured on medium-format 100MP sensors and cinema cameras, color-graded frame-by-frame, and archived with museum-standard precision.
                </p>
              </div>

              {/* Badges Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="text-lg font-bold text-amber-400">500+</div>
                  <div className="text-[11px] text-neutral-600">Luxury Productions</div>
                </div>
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="text-lg font-bold text-amber-400">3 Bays</div>
                  <div className="text-[11px] text-neutral-600">Custom Soundstages</div>
                </div>
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="text-lg font-bold text-amber-400">100%</div>
                  <div className="text-[11px] text-neutral-600">Delivered On Time</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                {isClient ? (
                  <>
                    <button
                      onClick={onNavigateToClientPortal}
                      className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-2"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Open My Proofing Gallery</span>
                    </button>
                    <button
                      onClick={() => {
                        const el = document.getElementById('contact-section');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-5 py-2.5 rounded-xl bg-white hover:bg-stone-100 border border-stone-200 text-neutral-800 text-xs font-semibold transition-colors"
                    >
                      Inquire with Director
                    </button>
                  </>
                ) : isGuest ? (
                  <>
                    <button
                      onClick={onOpenAuthModal}
                      className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-2"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Client &amp; Staff Login</span>
                    </button>
                    <button
                      onClick={() => {
                        const el = document.getElementById('portfolio-section');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-5 py-2.5 rounded-xl bg-white hover:bg-stone-100 border border-stone-200 text-neutral-800 text-xs font-semibold transition-colors"
                    >
                      View Portfolio Collections
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={onNavigateToAdminDashboard}
                      className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-2"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      <span>Studio Operations</span>
                    </button>
                    <button
                      onClick={onNavigateToFacilities}
                      className="px-5 py-2.5 rounded-xl bg-white hover:bg-stone-100 border border-stone-200 text-neutral-800 text-xs font-semibold transition-colors"
                    >
                      Explore Studio Stages
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Fine Art Prints & Albums Showcase (Like Meghan's Shop & Prints) */}
      <section id="albums-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white border border-stone-200 p-8 sm:p-12 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400">
                <BookOpen className="w-4 h-4" />
                <span>Heirloom Deliverables</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
                Handcrafted Italian Velvet Layflat Albums &amp; Museum Canvas
              </h2>

              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-light">
                Digital files are fleeting, but a fine art album is held for generations. At A-S Studio, all albums are custom designed by our in-house art directors, printed on archival cotton rag paper with non-fading pigment inks, and bound by master bookbinders in Florence, Italy.
              </p>

              <div className="space-y-2.5 text-xs text-neutral-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Florentine Hand-Stitched Layflat Binding with 180° Panoramic Spread</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Archival 310gsm Matte Cotton Rag Paper (Guaranteed 100+ Years Fade Resistant)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Custom Hand-Embossed Monograms &amp; Matching Wooden Presentation Box</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onNavigateToClientPortal}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-2"
                >
                  <span>Select Photos For Your Album</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-stone-200">
                <img
                  src={studioPrintsAlbums}
                  alt="Heirloom Album Presentation"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Workshops & Mentorship (Like Meghan Maloney's Workshops) */}
      <section id="workshops-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="text-xs font-mono uppercase tracking-widest text-amber-400">
            Education &amp; Mentorship
          </h2>
          <p className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
            Small-Group Studio Masterclasses
          </p>
          <p className="text-xs sm:text-sm text-neutral-600">
            Intensive in-studio lighting, camera directing, and workflow workshops for emerging photographers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {workshops.map((ws, i) => (
            <div
              key={i}
              className="p-6 sm:p-8 rounded-2xl bg-white border border-stone-200 hover:border-amber-300 transition-all flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 font-mono border border-amber-500/20">
                    {ws.duration}
                  </span>
                  <span className="text-neutral-600">{ws.spots}</span>
                </div>
                <h3 className="text-xl font-bold text-neutral-900 tracking-tight">
                  {ws.title}
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {ws.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-neutral-600 uppercase tracking-wider">Tuition</div>
                  <div className="text-lg font-bold text-white">{ws.price}</div>
                </div>

                <button
                  onClick={() => {
                    const el = document.getElementById('contact-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  Reserve Seat
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Client Reviews & Social Proof */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="text-xs font-mono uppercase tracking-widest text-amber-400">
            Kind Words
          </h2>
          <p className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
            Client Experiences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-stone-200 space-y-3">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, idx) => (
                <Star key={idx} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <p className="text-xs text-neutral-700 italic leading-relaxed">
              "Vikramaditya and the A-S Studio team captured our wedding at Udaipur with unmatched finesse. The Italian velvet album and the 4K cinematic film made our families weep with joy."
            </p>
            <div className="pt-2 border-t border-stone-200">
              <div className="text-xs font-bold text-neutral-900">Priya &amp; Kabir Sharma</div>
              <div className="text-[10px] text-neutral-600">Royal Destination Wedding, Udaipur</div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-stone-200 space-y-3">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, idx) => (
                <Star key={idx} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <p className="text-xs text-neutral-700 italic leading-relaxed">
              "Stage 01 Cyclorama is hands down the best commercial studio in Mumbai. The lighting grid is effortless, roll-in vehicle access was seamless, and the retouched editorial output was world-class."
            </p>
            <div className="pt-2 border-t border-stone-200">
              <div className="text-xs font-bold text-neutral-900">Arjun Mehta</div>
              <div className="text-[10px] text-neutral-600">Creative Director · Luxe Mode Apparel</div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-stone-200 space-y-3">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, idx) => (
                <Star key={idx} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <p className="text-xs text-neutral-700 italic leading-relaxed">
              "The client portal made photo proofing so simple. My husband and I picked our favorite 80 shots on our iPads, requested edits, and downloaded the high-res masters in minutes."
            </p>
            <div className="pt-2 border-t border-stone-200">
              <div className="text-xs font-bold text-neutral-900">Sneha Kapoor</div>
              <div className="text-[10px] text-neutral-600">Signature Family Fine Art Session</div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Contact & Booking Inquiries */}
      <section id="contact-section" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white border border-stone-200 p-8 sm:p-12 space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-amber-400">
              <Mail className="w-4 h-4" />
              <span>Get In Touch</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
              Book a Studio Shoot or Inquire About Stages
            </h2>
            <p className="text-xs text-neutral-600 max-w-md mx-auto">
              Tell us about your upcoming wedding, commercial campaign, or stage rental dates.
            </p>
          </div>

          {contactSubmitted ? (
            <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="text-sm font-bold text-white">Inquiry Received!</div>
              <p className="text-xs text-neutral-600">
                Thank you. Vikramaditya and the A-S Studio production team will respond within 4 business hours.
              </p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setContactSubmitted(true);
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Radhika Sen"
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="radhika@example.com"
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Service Required</label>
                  <select className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-amber-500">
                    <option>Wedding Photography &amp; Film</option>
                    <option>Fashion &amp; Editorial Campaign</option>
                    <option>Soundstage / Cyclorama Rental</option>
                    <option>Studio Lighting Masterclass</option>
                    <option>Family Fine Art Portrait Session</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 00000"
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Shoot Vision or Questions</label>
                <textarea
                  rows={3}
                  placeholder="Share details about your dates, location, creative concept or preferred stage..."
                  className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10"
              >
                <Send className="w-4 h-4" />
                <span>Send Studio Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Lightbox / Modal for Portfolio Zoom */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-neutral-950/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="max-w-4xl w-full bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-h-[70vh] bg-black">
              <img
                src={selectedPhoto.image}
                alt={selectedPhoto.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain max-h-[70vh]"
              />
            </div>
            <div className="p-6 flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-mono text-amber-400">{selectedPhoto.tag}</div>
                <h3 className="text-lg font-bold text-white mt-0.5">{selectedPhoto.title}</h3>
                <p className="text-xs text-neutral-400 mt-1">{selectedPhoto.desc}</p>
                <div className="text-[11px] text-neutral-400 font-mono mt-2">
                  Captured with: {selectedPhoto.camera}
                </div>
              </div>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
