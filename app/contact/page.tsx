import { Navbar } from "@/components/navbar";
import { getContactSettingsPublic } from "@/lib/supabase/contact";
import { ContactForm } from "@/components/contact-form";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ContactPage() {
    const settings = await getContactSettingsPublic();

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-white">
                {/* Hero Section */}
                <section className="relative pt-32 pb-16 px-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gray-900">
                            {settings.hero_title}
                        </h1>
                        <p className="text-xl text-gray-700">
                            {settings.hero_subtitle}
                        </p>
                    </div>
                </section>

                {/* Contact Form and Information */}
                <section className="py-16 px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-12">
                            {/* Left Side - Contact Form */}
                            <ContactForm />

                            {/* Right Side - Contact Information */}
                            <div className="space-y-6">
                                {/* Email */}
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Email:</p>
                                    <a
                                        href={`mailto:${settings.email}`}
                                        className="text-gray-700 hover:text-bethel-red transition-colors"
                                    >
                                        {settings.email}
                                    </a>
                                </div>

                                {/* Location/Address */}
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Location:</p>
                                    <p className="text-gray-700">
                                        {settings.address_line1}
                                        {settings.address_line2 && (
                                            <>
                                                <br />
                                                {settings.address_line2}
                                            </>
                                        )}
                                        {settings.address_line3 && (
                                            <>
                                                <br />
                                                {settings.address_line3}
                                            </>
                                        )}
                                    </p>
                                </div>

                                {/* Phone */}
                                {settings.display_telephone && settings.display_telephone !== 'xxxxxxx' && (
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Phone:</p>
                                        <a
                                            href={`tel:${settings.telephone.replace(/[^0-9+]/g, '')}`}
                                            className="text-gray-700 hover:text-bethel-red transition-colors"
                                        >
                                            {settings.display_telephone}
                                        </a>
                                    </div>
                                )}

                                {/* Office Hours */}
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Office Hours:</p>
                                    <p className="text-gray-700">{settings.office_days}</p>
                                    <p className="text-gray-600 text-sm">{settings.office_hours}</p>
                                </div>
                            </div>
                        </div>

                        {/* Google Maps Section */}
                        <div className="mt-16">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Find Us</h2>
                            <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-lg border border-gray-200">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3882.5351981233052!2d74.74482227484768!3d13.316949687031153!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbcbb1aeeb3f627%3A0xb0256fa3a55b7f48!2sCSI%20Christa%20Jyothi%20Church!5e0!3m2!1sen!2sin!4v1763974625130!5m2!1sen!2sin"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="CSI Christa Jyothi Church Location"
                                />
                            </div>
                            <div className="text-center mt-6">
                                <a
                                    href="https://share.google/OvZ0JfSQIEKXRFIJZ"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-6 py-3 bg-bethel-red hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Get Directions
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
