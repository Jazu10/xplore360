"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";

interface SiteSettings {
    siteName: string;
    logoUrl?: string;
    phone: string;
    whatsapp: string;
}

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/packages", label: "Packages" },
    { href: "/camps", label: "Camps" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [settings, setSettings] = useState<SiteSettings>({
        siteName: siteConfig.siteName,
        logoUrl: siteConfig.logoUrl,
        phone: siteConfig.phone,
        whatsapp: siteConfig.whatsapp,
    });
    const pathname = usePathname();
    const isHome = pathname === "/";

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const fetchSettings = () => {
        fetch("/api/settings", { cache: "no-store" })
            .then((r) => r.json())
            .then((data) => {
                if (data && !data.error) setSettings(data);
            })
            .catch(() => {});
    };

    useEffect(() => {
        fetchSettings();
        window.addEventListener("settingsUpdated", fetchSettings);
        return () => window.removeEventListener("settingsUpdated", fetchSettings);
    }, []);

    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [menuOpen]);

    const navBg =
        scrolled || !isHome
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-black/5"
            : "bg-transparent";

    const textColor = scrolled || !isHome ? "text-obsidian" : "text-white";

    return (
        <>
            <motion.nav
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
                    navBg,
                )}>
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <Link
                            href="/"
                            className="flex items-center gap-3 group">
                            {settings.logoUrl ? (
                                <div className="relative h-12 w-auto">
                                    <Image
                                        src={settings.logoUrl}
                                        alt={settings.siteName}
                                        height={48}
                                        width={180}
                                        className="h-12 w-auto object-contain"
                                        style={{
                                            filter: scrolled || !isHome
                                                ? "none"
                                                : "drop-shadow(0 1px 3px rgba(0,0,0,0.5))",
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className="flex flex-col leading-none">
                                    <span
                                        className={cn(
                                            "font-serif text-2xl font-semibold tracking-tight transition-colors duration-300",
                                            textColor,
                                        )}>
                                        {settings.siteName}
                                    </span>
                                    <span
                                        className={cn(
                                            "text-[9px] tracking-[0.4em] uppercase font-light transition-colors duration-300",
                                            scrolled || !isHome
                                                ? "text-gold"
                                                : "text-gold-light",
                                        )}>
                                        Discover·Connect·Wander
                                    </span>
                                </div>
                            )}
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center gap-10">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "animated-underline text-sm tracking-widest uppercase font-light transition-colors duration-300",
                                        textColor,
                                        pathname === link.href &&
                                            "after:w-full",
                                    )}>
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {/* CTA */}
                        <div className="flex items-center gap-4">
                            <a
                                href={`tel:${settings.phone}`}
                                className={cn(
                                    "hidden md:flex items-center gap-2 text-sm font-medium transition-colors duration-300",
                                    scrolled || !isHome
                                        ? "text-gold hover:text-gold-dark"
                                        : "text-white/90 hover:text-white",
                                )}>
                                <Phone size={14} />
                                <span className="tracking-wide">
                                    {settings.phone}
                                </span>
                            </a>

                            <Link
                                href="/packages"
                                className={cn(
                                    "hidden md:inline-flex items-center gap-2 px-6 py-3 text-xs tracking-widest uppercase font-medium overflow-hidden relative group",
                                    scrolled || !isHome
                                        ? "bg-gold text-white"
                                        : "border border-white/40 text-white hover:bg-white/10",
                                )}>
                                Book Now
                            </Link>

                            <button
                                onClick={() => setMenuOpen(!menuOpen)}
                                className={cn(
                                    "md:hidden p-2 transition-colors duration-300",
                                    textColor,
                                )}
                                aria-label="Toggle menu">
                                {menuOpen ? (
                                    <X size={22} />
                                ) : (
                                    <Menu size={22} />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed inset-0 z-40 bg-obsidian flex flex-col">
                        <div className="flex-1 flex flex-col justify-center px-8 pt-24">
                            <div className="space-y-8">
                                {navLinks.map((link, i) => (
                                    <motion.div
                                        key={link.href}
                                        initial={{ opacity: 0, x: -30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                            delay: i * 0.08,
                                            duration: 0.5,
                                        }}>
                                        <Link
                                            href={link.href}
                                            className="block font-serif text-4xl text-white hover:text-gold transition-colors duration-300">
                                            {link.label}
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="mt-16 pt-8 border-t border-white/10 space-y-4">
                                <a
                                    href={`tel:${settings.phone}`}
                                    className="flex items-center gap-3 text-gold text-lg">
                                    <Phone size={16} />
                                    {settings.phone}
                                </a>
                                <Link
                                    href="/packages"
                                    className="inline-flex items-center justify-center gap-2 w-full bg-gold text-white py-4 text-sm tracking-widest uppercase font-medium">
                                    Book Now
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
