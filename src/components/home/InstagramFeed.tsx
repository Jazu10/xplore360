'use client'

import { useRef, useState, useEffect } from 'react'
import NextImage from 'next/image'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { ExternalLink, Play, Image as ImageIcon, Film, ChevronLeft, ChevronRight } from 'lucide-react'

interface MediaItem {
  _id?: string
  type: 'instagram_post' | 'instagram_reel' | 'uploaded_image' | 'uploaded_video'
  url: string
  thumbnailUrl: string
  caption: string
  instagramUrl?: string
}

const FALLBACK_MEDIA: MediaItem[] = [
  { type: 'instagram_post', url: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&h=600&fit=crop', thumbnailUrl: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&h=600&fit=crop', caption: 'Maldives overwater villa' },
  { type: 'instagram_reel', url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&h=600&fit=crop', thumbnailUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&h=600&fit=crop', caption: 'Bali rice terraces' },
  { type: 'instagram_post', url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=600&fit=crop', thumbnailUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=600&fit=crop', caption: 'Dubai skyline at dusk' },
  { type: 'instagram_reel', url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&h=600&fit=crop', thumbnailUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&h=600&fit=crop', caption: 'Santorini sunset' },
  { type: 'instagram_post', url: 'https://images.unsplash.com/photo-1585136917228-f5bc9a4ced23?w=600&h=600&fit=crop', thumbnailUrl: 'https://images.unsplash.com/photo-1585136917228-f5bc9a4ced23?w=600&h=600&fit=crop', caption: 'Taj Mahal at golden hour' },
  { type: 'instagram_post', url: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=600&h=600&fit=crop', thumbnailUrl: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=600&h=600&fit=crop', caption: 'Morocco medina colours' },
]

function getInstagramEmbedUrl(url: string): string | null {
  const match = url.match(/instagram\.com\/(p|reel)\/([A-Za-z0-9_-]+)/)
  if (!match) return null
  return `https://www.instagram.com/${match[1]}/${match[2]}/embed`
}

const MEDIA_ICON = {
  instagram_reel: Film,
  uploaded_video: Play,
  instagram_post: null,
  uploaded_image: null,
}

export default function InstagramFeed() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [media, setMedia] = useState<MediaItem[]>(FALLBACK_MEDIA)
  const [lightbox, setLightbox] = useState<MediaItem | null>(null)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [view, setView] = useState<'masonry' | 'carousel'>('masonry')

  useEffect(() => {
    fetch('/api/media')
      .then((r) => r.json())
      .then((data: MediaItem[]) => {
        if (Array.isArray(data) && data.length > 0) setMedia(data)
      })
      .catch(() => {})
  }, [])

  const prevSlide = () => setCarouselIndex((i) => (i - 1 + media.length) % media.length)
  const nextSlide = () => setCarouselIndex((i) => (i + 1) % media.length)

  return (
    <section ref={ref} className="py-28 bg-obsidian overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10"
        >
          <div>
            <span className="text-gold text-xs tracking-[0.35em] uppercase font-light flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-gold inline-block" />
              Captured Moments
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-white">
              Follow Our <span className="italic text-gold">Journey</span>
            </h2>
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-sm">
            <button
              onClick={() => setView('masonry')}
              className={`flex items-center gap-2 px-4 py-2 text-xs tracking-widest uppercase transition-all duration-300 ${view === 'masonry' ? 'bg-gold text-white' : 'text-white/40 hover:text-white'}`}
            >
              <ImageIcon size={13} /> Grid
            </button>
            <button
              onClick={() => setView('carousel')}
              className={`flex items-center gap-2 px-4 py-2 text-xs tracking-widest uppercase transition-all duration-300 ${view === 'carousel' ? 'bg-gold text-white' : 'text-white/40 hover:text-white'}`}
            >
              <Film size={13} /> Carousel
            </button>
          </div>
        </motion.div>

        {/* Masonry Grid */}
        <AnimatePresence mode="wait">
          {view === 'masonry' && (
            <motion.div
              key="masonry"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="columns-2 md:columns-3 gap-3 space-y-3"
            >
              {media.map((item, i) => {
                const Icon = MEDIA_ICON[item.type]
                const isTall = i % 5 === 0 || i % 5 === 3
                return (
                  <motion.div
                    key={item._id || i}
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: Math.min(i * 0.07, 0.5), ease: [0.16, 1, 0.3, 1] }}
                    className={`break-inside-avoid relative overflow-hidden cursor-pointer group block mb-3 ${isTall ? 'aspect-[3/4]' : 'aspect-square'}`}
                    onClick={() => setLightbox(item)}
                  >
                    <NextImage
                      src={item.thumbnailUrl}
                      alt={item.caption}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, 33vw"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col items-center justify-center gap-2">
                      {Icon && (
                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <Icon size={18} className="text-white" />
                        </div>
                      )}
                      <p className="text-white text-xs tracking-wide text-center px-4 line-clamp-2">
                        {item.caption}
                      </p>
                    </div>

                    {/* Type badge */}
                    {(item.type === 'instagram_reel' || item.type === 'uploaded_video') && (
                      <div className="absolute top-2 right-2 bg-black/50 rounded-full p-1.5">
                        <Play size={10} className="text-white fill-white" />
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </motion.div>
          )}

          {/* Carousel */}
          {view === 'carousel' && (
            <motion.div
              key="carousel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="relative"
            >
              <div className="relative overflow-hidden aspect-video md:aspect-[16/7] rounded-sm">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={carouselIndex}
                    initial={{ opacity: 0, x: 60 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -60 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0"
                  >
                    <NextImage
                      src={media[carouselIndex]?.thumbnailUrl || ''}
                      alt={media[carouselIndex]?.caption || ''}
                      fill
                      className="object-cover"
                      sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-8">
                      <p className="text-gold text-xs tracking-[0.3em] uppercase mb-1">
                        {media[carouselIndex]?.type?.replace('_', ' ')}
                      </p>
                      <p className="font-serif text-2xl text-white">{media[carouselIndex]?.caption}</p>
                    </div>
                    {media[carouselIndex]?.instagramUrl && (
                      <a
                        href={media[carouselIndex].instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute bottom-6 right-8 flex items-center gap-2 text-white/70 text-sm hover:text-white transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink size={14} /> View on Instagram
                      </a>
                    )}
                  </motion.div>
                </AnimatePresence>

                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-gold transition-colors duration-300"
                >
                  <ChevronLeft size={20} className="text-white" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-gold transition-colors duration-300"
                >
                  <ChevronRight size={20} className="text-white" />
                </button>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
                {media.map((item, i) => (
                  <button
                    key={item._id || i}
                    onClick={() => setCarouselIndex(i)}
                    className={`relative shrink-0 w-20 h-14 overflow-hidden transition-all duration-300 ${i === carouselIndex ? 'ring-2 ring-gold opacity-100' : 'opacity-40 hover:opacity-70'}`}
                  >
                    <NextImage src={item.thumbnailUrl} alt="" fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-lg w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {lightbox.instagramUrl && getInstagramEmbedUrl(lightbox.instagramUrl) ? (
                <iframe
                  src={getInstagramEmbedUrl(lightbox.instagramUrl)!}
                  className="w-full border-0"
                  style={{ minHeight: 560 }}
                  allowFullScreen
                  loading="lazy"
                />
              ) : (
                <NextImage
                  src={lightbox.thumbnailUrl}
                  alt={lightbox.caption}
                  width={900}
                  height={900}
                  className="w-full h-auto object-contain max-h-[75vh]"
                />
              )}
              <div className="p-4 flex items-center justify-between bg-black/60">
                <p className="text-white/80 text-sm">{lightbox.caption}</p>
                <button onClick={() => setLightbox(null)} className="text-white/50 hover:text-white text-sm">
                  ✕ Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
