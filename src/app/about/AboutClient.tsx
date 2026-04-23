"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import AnimatedSection, {
    AnimatedStagger,
} from "@/components/ui/AnimatedSection";
import { Users, Compass, Heart, Sparkles } from "lucide-react";
import { SITE_NAME } from "@/lib/site-config";

const audience = [
    "Solo travellers wanting company",
    "Young professionals seeking experiences over routine",
    "People new to travelling who want guidance",
    "Anyone who wants to meet new people naturally",
    "Explorers tired of travelling alone",
];

const values = [
    {
        icon: Users,
        title: "Travel With Strangers",
        text: "Our unique concept puts you in carefully curated groups of like-minded explorers. You leave alone and come back with friends.",
    },
    {
        icon: Compass,
        title: "Hassle-Free Planning",
        text: "We handle everything — itinerary, hotels, activities, transfers. You just show up and enjoy the experience.",
    },
    {
        icon: Heart,
        title: "Community First",
        text: "Strong focus on connection and belonging. Every trip is designed to spark real friendships and lasting memories.",
    },
    {
        icon: Sparkles,
        title: "Story-Driven Experiences",
        text: "We don't just plan trips. We create moments that stay with you long after you've returned home.",
    },
];

export default function AboutClient() {
    return (
        <div className="pt-20">
            {/* Hero */}
            <section className="relative h-96 overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1920&q=80"
                    alt={`About ${SITE_NAME}`}
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
                    className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6">
                    <span className="text-gold text-xs tracking-[0.35em] uppercase mb-4 flex items-center gap-3">
                        <span className="w-8 h-px bg-gold" />
                        Our Story
                        <span className="w-8 h-px bg-gold" />
                    </span>
                    <h1 className="font-serif text-5xl md:text-6xl text-white font-semibold">
                        About Us
                    </h1>
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
                            Built for{" "}
                            <span className="italic text-gold">
                                Social
                            </span>{" "}
                            Explorers
                        </h2>
                        <div className="space-y-4 text-obsidian/60 text-lg leading-relaxed">
                            <p>
                                {SITE_NAME} is a travel community built for
                                people who love discovering new places — and
                                meeting new people along the way.
                            </p>
                            <p>
                                If you enjoy meeting people and discovering new
                                places, you&apos;ll fit right in.
                            </p>
                        </div>
                        <ul className="mt-8 space-y-3">
                            {audience.map((item) => (
                                <li key={item} className="flex items-center gap-3 text-obsidian/70 text-sm">
                                    <span className="w-1.5 h-1.5 bg-gold rounded-full shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </AnimatedSection>

                    <AnimatedSection direction="left" delay={0.1}>
                        <div className="relative">
                            <div className="aspect-[4/5] relative overflow-hidden">
                                <Image
                                    src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80"
                                    alt="Group of travellers"
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                            </div>
                            <div className="absolute -bottom-6 -left-6 bg-gold text-white p-8 hidden md:block">
                                <p className="font-serif text-4xl font-semibold">
                                    100%
                                </p>
                                <p className="text-xs tracking-[0.2em] uppercase mt-1 text-white/80">
                                    Social Travel
                                </p>
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
                            Why People Choose Us
                            <span className="w-8 h-px bg-gold" />
                        </span>
                        <h2 className="font-serif text-4xl md:text-5xl text-obsidian">
                            The {SITE_NAME}{" "}
                            <span className="italic text-gold">Difference</span>
                        </h2>
                    </AnimatedSection>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((v, i) => {
                            const Icon = v.icon;
                            return (
                                <AnimatedSection key={v.title} delay={i * 0.1}>
                                    <div className="bg-white p-8 h-full">
                                        <Icon
                                            size={28}
                                            className="text-gold mb-5"
                                        />
                                        <h3 className="font-serif text-xl text-obsidian mb-3">
                                            {v.title}
                                        </h3>
                                        <p className="text-obsidian/50 text-sm leading-relaxed">
                                            {v.text}
                                        </p>
                                    </div>
                                </AnimatedSection>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <AnimatedSection>
                        <h2 className="font-serif text-4xl text-obsidian mb-6">
                            Ready to{" "}
                            <span className="italic text-gold">
                                Explore Together?
                            </span>
                        </h2>
                        <p className="text-obsidian/50 text-lg mb-10">
                            Join a group, pick a destination, and let us handle
                            the rest. No solo planning, no awkward first
                            meetings — just great travel.
                        </p>
                        <Link href="/contact" className="btn-luxury">
                            <span>Get in Touch</span>
                        </Link>
                    </AnimatedSection>
                </div>
            </section>
        </div>
    );
}
