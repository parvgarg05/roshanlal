import type { Metadata } from 'next';
import { MapPin, Mail, Phone } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Contact Us | L.Roshan Lal Ji',
    description: 'Get in touch with L.Roshan Lal Ji Sweets for orders and support.',
};

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-cream-50">
            <div className="bg-maroon-gradient text-cream-50 py-16">
                <div className="section-container">
                    <h1 className="font-display font-bold text-4xl sm:text-5xl mb-4">Contact Us</h1>
                    <p className="text-cream-200 text-lg max-w-2xl">
                        We&apos;re here to help with orders, delivery questions, and bulk booking inquiries.
                    </p>
                </div>
            </div>

            <section className="section-container py-12 md:py-16">
                <div className="max-w-3xl mx-auto bg-white border border-cream-200 rounded-2xl shadow-warm-sm p-6 md:p-8">
                    <h2 className="font-display font-bold text-2xl text-maroon-900 mb-6">Office Details</h2>

                    <ul className="space-y-5">
                        <li className="flex items-start gap-3 text-maroon-700">
                            <MapPin size={20} className="text-saffron-500 shrink-0 mt-0.5" />
                            <address className="not-italic leading-relaxed">
                                Circular Road, Malgodam Crossing
                                <br />
                                Nadrai Gate, Uttar Pradesh 207123
                            </address>
                        </li>

                        <li className="flex items-center gap-3 text-maroon-700">
                            <Phone size={20} className="text-saffron-500 shrink-0" />
                            <a href="tel:+917055513961" className="hover:text-saffron-600 transition-colors">
                                +91 70555 13961
                            </a>
                        </li>

                        <li className="flex items-center gap-3 text-maroon-700">
                            <Mail size={20} className="text-saffron-500 shrink-0" />
                            <a href="mailto:info@roshanlaljisweets.com" className="hover:text-saffron-600 transition-colors">
                                info@roshanlaljisweets.com
                            </a>
                        </li>
                    </ul>
                </div>
            </section>
        </div>
    );
}
