'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import AnimatedSection, { AnimatedStagger } from '@/components/ui/AnimatedSection'
import { Award, Globe, Heart, Users } from 'lucide-react'

const values = [
  {
    icon: Heart,
    title: 'Passion for Travel',
    text: 'Every team member is a passionate traveller. We recommend only what we have personally experienced and loved.',
  },
  {
    icon: Award,
    title: 'Uncompromising Quality',
    text: 'We maintain the highest standards in every property we recommend and every experience we curate.',
  },
  {
    icon: Users,
    title: 'Personal Service',
    text: 'You will always speak to a real person. Your dedicated specialist builds a relationship with you throughout your journey.',
  },
  {
    icon: Globe,
    title: 'Global Connections',
    text: 'Over a decade of partnerships with the finest hotels, lodges, and operators worldwide gives our clients exclusive access.',
  },
]

export default function AboutClient() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative h-96 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1920&q=80"
          alt="About Raniya Travel"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-obsidian/60" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6"
        >
          <span className="text-gold text-xs tracking-[0.35em] uppercase mb-4 flex items-center gap-3">
            <span className="w-8 h-px bg-gold" />
            Our Story
            <span className="w-8 h-px bg-gold" />
          </span>
          <h1 className="font-serif text-5xl md:text-6xl text-white font-semibold">About Us</h1>
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Story */}
      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <AnimatedSection direction="right">
            <span className="text-gold text-xs tracking-[0.35em] uppercase flex items-center gap-3 mb-6">
              <span className="w-8 h-px bg-gold" />
              Who We Are
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-obsidian mb-6 leading-tight">
              Crafting <span className="italic text-gold">extraordinary</span> journeys since 2014
            </h2>
            <div className="space-y-4 text-obsidian/60 text-lg leading-relaxed">
              <p>
                Raniya Travel was founded with a singular mission: to create travel experiences so perfectly tailored that they become defining chapters in our clients&apos; lives.
              </p>
              <p>
                Based in London, our team of specialist travel designers have personally explored every destination we offer. We don&apos;t sell holidays from brochures — we share places we genuinely love.
              </p>
              <p>
                From the moment you first contact us to the day you return home, you have a dedicated specialist by your side — available 24 hours a day throughout your journey.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection direction="left" delay={0.1}>
            <div className="relative">
              <div className="aspect-[4/5] relative overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80"
                  alt="Travel specialist"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-gold text-white p-8 hidden md:block">
                <p className="font-serif text-4xl font-semibold">10+</p>
                <p className="text-xs tracking-[0.2em] uppercase mt-1 text-white/80">Years of Excellence</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-beige">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <span className="text-gold text-xs tracking-[0.35em] uppercase flex items-center justify-center gap-3 mb-4">
              <span className="w-8 h-px bg-gold" />
              Our Values
              <span className="w-8 h-px bg-gold" />
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-obsidian">
              What <span className="italic text-gold">Drives</span> Us
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => {
              const Icon = v.icon
              return (
                <AnimatedSection key={v.title} delay={i * 0.1}>
                  <div className="bg-white p-8 h-full">
                    <Icon size={28} className="text-gold mb-5" />
                    <h3 className="font-serif text-xl text-obsidian mb-3">{v.title}</h3>
                    <p className="text-obsidian/50 text-sm leading-relaxed">{v.text}</p>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <AnimatedSection>
            <h2 className="font-serif text-4xl text-obsidian mb-6">
              Ready to Plan Your <span className="italic text-gold">Dream Journey?</span>
            </h2>
            <p className="text-obsidian/50 text-lg mb-10">
              Speak to one of our specialists. There&apos;s no obligation — just a conversation about where you want to go.
            </p>
            <Link href="/contact" className="btn-luxury">
              <span>Get in Touch</span>
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
