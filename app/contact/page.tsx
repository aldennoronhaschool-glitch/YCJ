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
                {/* Hero Section - Mobile Optimized */}
                <section className="relative pt-24 sm:pt-32 pb-12 sm:pb-16 px-4 sm:px-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 text-gray-900 leading-tight">
                            {settings.hero_title}
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl text-gray-700 px-2">
                            {settings.hero_subtitle}
                        </p>
                    </div>
                </section>

                {/* Bible Verse Section */}
                <section className="py-8 sm:py-12 px-4 sm:px-6 bg-white">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-gray-100 rounded-lg p-6 sm:p-8 md:p-10 text-center">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-700 mb-6">James 5:13-15</h2>
                            <p className="text-gray-800 text-base sm:text-lg md:text-xl leading-relaxed">
                                "Is any one of you in trouble? He should pray. Is anyone happy? Let him sing songs of praise. Is any one of you sick? He should call the elders of the church to pray over him and anoint him with oil in the name of the Lord. And the prayer offered in faith will make the sick person well; the Lord will raise him up…"
                            </p>
                        </div>
                    </div>
                </section>

                {/* Contact Form and Information */}
                <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                            {/* Left Side - Contact Form */}
                            <div className="order-1 md:order-1">
                                <ContactForm />
                            </div>

                            {/* Right Side - Contact Information */}
                            <div className="order-3 md:order-2 space-y-6 md:space-y-8">
                                <div className="bg-gray-50 p-6 sm:p-8 rounded-lg">
                                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Get In Touch</h2>

                                    <div className="space-y-5">
                                        {/* Email */}
                                        <div>
                                            <p className="text-xs sm:text-sm text-gray-500 mb-1 font-medium">Email:</p>
                                            <a
                                                href={`mailto:${settings.email}`}
                                                className="text-base sm:text-lg text-gray-700 hover:text-bethel-red transition-colors break-all"
                                            >
                                                {settings.email}
                                            </a>
                                        </div>

                                        {/* Location/Address */}
                                        <div>
                                            <p className="text-xs sm:text-sm text-gray-500 mb-1 font-medium">Location:</p>
                                            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
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
                                                <p className="text-xs sm:text-sm text-gray-500 mb-1 font-medium">Phone:</p>
                                                <a
                                                    href={`tel:${settings.telephone.replace(/[^0-9+]/g, '')}`}
                                                    className="text-base sm:text-lg text-gray-700 hover:text-bethel-red transition-colors"
                                                >
                                                    {settings.display_telephone}
                                                </a>
                                            </div>
                                        )}

                                        {/* Office Hours */}
                                        <div>
                                            <p className="text-xs sm:text-sm text-gray-500 mb-1 font-medium">Office Hours:</p>
                                            <p className="text-base sm:text-lg text-gray-700">{settings.office_days}</p>
                                            <p className="text-sm sm:text-base text-gray-600">{settings.office_hours}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Google Maps Section - Mobile Optimized */}
                        <div className="mt-12 sm:mt-16 order-2">
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">Find Us</h2>
                            <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden shadow-lg border border-gray-200">
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
                            <div className="text-center mt-4 sm:mt-6">
                                <a
                                    href="https://share.google/OvZ0JfSQIEKXRFIJZ"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-5 sm:px-6 py-2.5 sm:py-3 bg-bethel-red hover:bg-red-700 text-white font-bold rounded-lg transition-colors text-sm sm:text-base"
                                >
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
