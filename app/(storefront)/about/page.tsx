import Image from 'next/image';
import Link from 'next/link';
import { Heart, Award, Users, Leaf } from 'lucide-react';

export const metadata = {
    title: 'About Us | L.Roshan Lal Ji',
    description: 'Learn about our heritage of authentic Indian sweets and our commitment to quality.',
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-cream-50">
            {/* Hero Section */}
            <div className="bg-maroon-gradient text-cream-50 py-16">
                <div className="section-container">
                    <h1 className="font-display font-bold text-4xl sm:text-5xl mb-4">About L.Roshan Lal Ji</h1>
                    <p className="text-cream-200 text-lg max-w-2xl">
                        A family mithai shop from Kasganj, serving fresh sweets and namkeen since 1942.
                    </p>
                </div>
            </div>

            {/* Heritage Section */}
            <section className="section-container py-16 space-y-12">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="font-display font-bold text-3xl text-maroon-900 mb-6">Our Story Since 1942</h2>
                        <p className="text-maroon-600 text-lg leading-relaxed mb-4">
                            Roshan Lal Ji Sweets started around <strong>1942</strong> with <strong>Shri Roshan Lal Ji</strong>. What began from a small cart gradually became the shop families know today.
                        </p>
                        <p className="text-maroon-600 text-lg leading-relaxed">
                            The first generation built the foundation on quality and honest service. The second generation, led by <strong>Shri Kailash Chand Ji</strong>, expanded the business. Today we continue the same traditional recipes and standards.
                        </p>
                    </div>
                    <div className="relative w-full h-80 rounded-2xl overflow-hidden shadow-warm-lg">
                        <Image
                            src="/main.jpg"
                            alt="Roshan Lal Sweets legacy"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>

                {/* Heritage Gallery */}
                <div className="mt-16">
                    <h3 className="font-display font-bold text-2xl text-maroon-900 mb-8 text-center">Our Journey Through Time</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { src: '/images/heritage/1_shop_early_1940s.jpg', alt: 'Early shop, 1940s' },
                            { src: '/images/heritage/2_family_working_1940s.jpg', alt: 'Family working together, 1940s' },
                            { src: '/images/heritage/3_business_1940s.jpg', alt: 'Business operations, 1940s' },
                            { src: '/images/heritage/4_storefront_growing.jpg', alt: 'Growing storefront' },
                        ].map((img, i) => (
                            <div key={i} className="relative w-full h-48 rounded-xl overflow-hidden shadow-warm-sm">
                                <Image
                                    src={img.src}
                                    alt={img.alt}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>
                    <p className="text-center text-maroon-600 text-sm mt-4 italic">
                        Historical photographs from our founding era—a testament to our enduring legacy since 1942.
                    </p>
                </div>
            </section>

            {/* Values Section */}
            <section className="bg-white py-16 border-y border-cream-200">
                <div className="section-container">
                    <h2 className="font-display font-bold text-3xl text-maroon-900 mb-12 text-center">Our Values</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                icon: Heart,
                                title: 'Made with Love',
                                description: 'Every sweet is prepared with passion and dedication to excellence.',
                            },
                            {
                                icon: Award,
                                title: 'Premium Quality',
                                description: 'We use only the finest ingredients sourced from trusted suppliers.',
                            },
                            {
                                icon: Leaf,
                                title: 'Natural & Fresh',
                                description: 'No artificial colors or preservatives—just pure, wholesome goodness.',
                            },
                            {
                                icon: Users,
                                title: 'Customer First',
                                description: 'Your satisfaction is our priority, every single day.',
                            },
                        ].map((value, i) => (
                            <div key={i} className="bg-cream-50 p-6 rounded-2xl text-center">
                                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-saffron-gradient text-white flex items-center justify-center">
                                    <value.icon size={24} />
                                </div>
                                <h3 className="font-semibold text-maroon-900 mb-2">{value.title}</h3>
                                <p className="text-sm text-maroon-600">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="section-container py-16">
                <div className="max-w-3xl mx-auto">
                    <h2 className="font-display font-bold text-3xl text-maroon-900 mb-8 text-center">Why Choose Us?</h2>
                    <ul className="space-y-4">
                        {[
                            'Handcrafted with traditional recipes passed down through generations',
                            'Fresh ingredients sourced daily from local suppliers',
                            'Hygienic preparation in FSSAI-certified kitchens',
                            'Wide variety of sweets for all occasions and preferences',
                            'Fast delivery and excellent customer service',
                            'Customizable orders for events and celebrations',
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-4">
                                <div className="shrink-0 w-6 h-6 rounded-full bg-saffron-500 text-white flex items-center justify-center text-sm font-bold mt-0.5">
                                    ✓
                                </div>
                                <p className="text-maroon-700 text-lg">{item}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        </div>
    );
}
