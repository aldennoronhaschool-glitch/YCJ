import { Navbar } from "@/components/navbar";
import { getContactSettings } from "@/lib/supabase/contact";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export default async function ContactPage() {
    const settings = await getContactSettings();

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
                            <div className="bg-gray-100 p-8 rounded-lg">
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Details</h2>

                                <form className="space-y-6">
                                    {/* First Name */}
                                    <div>
                                        <label htmlFor="firstName" className="block text-sm font-bold text-gray-900 mb-2">
                                            First Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            name="firstName"
                                            required
                                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-bethel-red focus:border-transparent"
                                        />
                                    </div>

                                    {/* Last Name */}
                                    <div>
                                        <label htmlFor="lastName" className="block text-sm font-bold text-gray-900 mb-2">
                                            Last Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            name="lastName"
                                            required
                                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-bethel-red focus:border-transparent"
                                        />
                                    </div>

                                    {/* Gender */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 mb-2">
                                            Gender <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex gap-6">
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="gender"
                                                    value="male"
                                                    className="w-4 h-4 text-bethel-red focus:ring-bethel-red"
                                                />
                                                <span className="ml-2 text-gray-900">Male</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="gender"
                                                    value="female"
                                                    className="w-4 h-4 text-bethel-red focus:ring-bethel-red"
                                                />
                                                <span className="ml-2 text-gray-900">Female</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-bold text-gray-900 mb-2">
                                            Email Address <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            required
                                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-bethel-red focus:border-transparent"
                                        />
                                    </div>

                                    {/* Contact Number */}
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-bold text-gray-900 mb-2">
                                            Contact Number <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex gap-2">
                                            <select className="px-3 py-3 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-bethel-red focus:border-transparent">
                                                <option value="+91">🇮🇳 +91</option>
                                            </select>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                required
                                                placeholder="+91"
                                                className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-bethel-red focus:border-transparent"
                                            />
                                        </div>
                                    </div>

                                    {/* City */}
                                    <div>
                                        <label htmlFor="city" className="block text-sm font-bold text-gray-900 mb-2">
                                            City <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="city"
                                            name="city"
                                            required
                                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-bethel-red focus:border-transparent"
                                        />
                                    </div>

                                    {/* Connection to Church */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 mb-2">
                                            How are you connected to YCJ Church? <span className="text-red-500">*</span>
                                        </label>
                                        <div className="space-y-2">
                                            <label className="flex items-start">
                                                <input
                                                    type="radio"
                                                    name="connection"
                                                    value="member"
                                                    className="w-4 h-4 mt-1 text-bethel-red focus:ring-bethel-red"
                                                />
                                                <span className="ml-2 text-gray-900">Member/Volunteer in this church</span>
                                            </label>
                                            <label className="flex items-start">
                                                <input
                                                    type="radio"
                                                    name="connection"
                                                    value="attending"
                                                    className="w-4 h-4 mt-1 text-bethel-red focus:ring-bethel-red"
                                                />
                                                <span className="ml-2 text-gray-900">Attending YCJ Church regularly</span>
                                            </label>
                                            <label className="flex items-start">
                                                <input
                                                    type="radio"
                                                    name="connection"
                                                    value="online-other"
                                                    className="w-4 h-4 mt-1 text-bethel-red focus:ring-bethel-red"
                                                />
                                                <span className="ml-2 text-gray-900">Attending YCJ's ONLINE Services BUT going to another church</span>
                                            </label>
                                            <label className="flex items-start">
                                                <input
                                                    type="radio"
                                                    name="connection"
                                                    value="online-only"
                                                    className="w-4 h-4 mt-1 text-bethel-red focus:ring-bethel-red"
                                                />
                                                <span className="ml-2 text-gray-900">Attending YCJ's ONLINE Services BUT not going to any church</span>
                                            </label>
                                            <label className="flex items-start">
                                                <input
                                                    type="radio"
                                                    name="connection"
                                                    value="none"
                                                    className="w-4 h-4 mt-1 text-bethel-red focus:ring-bethel-red"
                                                />
                                                <span className="ml-2 text-gray-900">Not attending any church at all</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Message Title */}
                                    <div>
                                        <label htmlFor="messageTitle" className="block text-sm font-bold text-gray-900 mb-2">
                                            Message Title <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="messageTitle"
                                            name="messageTitle"
                                            required
                                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-bethel-red focus:border-transparent"
                                        />
                                    </div>

                                    {/* Message Body */}
                                    <div>
                                        <label htmlFor="message" className="block text-sm font-bold text-gray-900 mb-2">
                                            Message Body (Comments / Questions) <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            required
                                            rows={6}
                                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-bethel-red focus:border-transparent resize-none"
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        className="px-8 py-3 bg-gray-700 hover:bg-gray-800 text-white font-bold rounded transition-colors"
                                    >
                                        Send Message
                                    </button>
                                </form>
                            </div>

                            {/* Right Side - Contact Information */}
                            <div className="space-y-8">
                                {/* Telephone */}
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-2">Telephone:</h3>
                                    <a
                                        href={`tel:${settings.telephone.replace(/[^0-9+]/g, '')}`}
                                        className="text-bethel-red hover:underline text-lg"
                                    >
                                        {settings.telephone}
                                    </a>
                                    <p className="text-gray-600 text-sm mt-1">({settings.telephone_hours})</p>
                                </div>

                                {/* Email */}
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-2">Email:</h3>
                                    <a
                                        href={`mailto:${settings.email}`}
                                        className="text-bethel-red hover:underline"
                                    >
                                        {settings.email}
                                    </a>
                                </div>

                                {/* Office Hours */}
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-2">Office Hours:</h3>
                                    <p className="text-gray-900">{settings.office_days},</p>
                                    <p className="text-gray-600">{settings.office_hours}</p>
                                </div>

                                {/* Address */}
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-2">Address:</h3>
                                    <p className="text-gray-900">{settings.address_line1},</p>
                                    {settings.address_line2 && <p className="text-gray-900">{settings.address_line2}</p>}
                                    {settings.address_line3 && <p className="text-gray-900">{settings.address_line3}</p>}
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
