import type { Metadata } from "next";
import ContactClient from "./ContactClient";
import { SITE_NAME } from "@/lib/site-config";

export const metadata: Metadata = {
    title: "Contact Us",
    description: `Get in touch with ${SITE_NAME}. Speak to our specialists via WhatsApp, phone, or email to plan your perfect luxury holiday.`,
};

export default function ContactPage() {
    return <ContactClient />;
}
