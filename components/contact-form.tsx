'use client';

import { useState, FormEvent, useRef } from 'react';

interface ContactFormProps {
    onSuccess?: () => void;
}

export function ContactForm({ onSuccess }: ContactFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage(null);

        const formData = new FormData(e.currentTarget);
        const data = {
            first_name: formData.get('firstName') as string,
            last_name: formData.get('lastName') as string,
            gender: formData.get('gender') as string,
            email: formData.get('email') as string,
            phone: formData.get('phone') as string,
            city: formData.get('city') as string,
            connection: formData.get('connection') as string,
            message_title: formData.get('messageTitle') as string,
            message_body: formData.get('message') as string,
        };

        try {
            const response = await fetch('/api/contact/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to submit form');
            }

            setMessage({
                type: 'success',
                text: result.message || 'Thank you for contacting us! We\'ll get back to you soon.'
            });

            // Reset form safely using ref
            if (formRef.current) {
                formRef.current.reset();
            }

            if (onSuccess) {
                onSuccess();
            }

        } catch (error: any) {
            setMessage({
                type: 'error',
                text: error.message || 'Something went wrong. Please try again.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-gray-100 p-8 rounded-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Details</h2>

            {message && (
                <div className={`mb-6 p-4 rounded-lg ${message.type === 'success'
                    ? 'bg-green-100 border border-green-400 text-green-700'
                    : 'bg-red-100 border border-red-400 text-red-700'
                    }`}>
                    <p className="font-medium">{message.text}</p>
                </div>
            )}

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
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
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-bethel-red focus:border-transparent disabled:opacity-50"
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
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-bethel-red focus:border-transparent disabled:opacity-50"
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
                                required
                                disabled={isSubmitting}
                                className="w-4 h-4 text-bethel-red focus:ring-bethel-red"
                            />
                            <span className="ml-2 text-gray-900">Male</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="gender"
                                value="female"
                                required
                                disabled={isSubmitting}
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
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-bethel-red focus:border-transparent disabled:opacity-50"
                    />
                </div>

                {/* Contact Number */}
                <div>
                    <label htmlFor="phone" className="block text-sm font-bold text-gray-900 mb-2">
                        Contact Number <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                        <select
                            disabled={isSubmitting}
                            className="px-3 py-3 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-bethel-red focus:border-transparent disabled:opacity-50"
                        >
                            <option value="+91">🇮🇳 +91</option>
                        </select>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            required
                            disabled={isSubmitting}
                            placeholder="1234567890"
                            pattern="[0-9]{10}"
                            title="Please enter a 10-digit phone number"
                            className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-bethel-red focus:border-transparent disabled:opacity-50"
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
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-bethel-red focus:border-transparent disabled:opacity-50"
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
                                required
                                disabled={isSubmitting}
                                className="w-4 h-4 mt-1 text-bethel-red focus:ring-bethel-red"
                            />
                            <span className="ml-2 text-gray-900">Member/Volunteer in this church</span>
                        </label>
                        <label className="flex items-start">
                            <input
                                type="radio"
                                name="connection"
                                value="attending"
                                required
                                disabled={isSubmitting}
                                className="w-4 h-4 mt-1 text-bethel-red focus:ring-bethel-red"
                            />
                            <span className="ml-2 text-gray-900">Attending YCJ Church regularly</span>
                        </label>
                        <label className="flex items-start">
                            <input
                                type="radio"
                                name="connection"
                                value="online-other"
                                required
                                disabled={isSubmitting}
                                className="w-4 h-4 mt-1 text-bethel-red focus:ring-bethel-red"
                            />
                            <span className="ml-2 text-gray-900">Attending YCJ's ONLINE Services BUT going to another church</span>
                        </label>
                        <label className="flex items-start">
                            <input
                                type="radio"
                                name="connection"
                                value="online-only"
                                required
                                disabled={isSubmitting}
                                className="w-4 h-4 mt-1 text-bethel-red focus:ring-bethel-red"
                            />
                            <span className="ml-2 text-gray-900">Attending YCJ's ONLINE Services BUT not going to any church</span>
                        </label>
                        <label className="flex items-start">
                            <input
                                type="radio"
                                name="connection"
                                value="none"
                                required
                                disabled={isSubmitting}
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
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-bethel-red focus:border-transparent disabled:opacity-50"
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
                        disabled={isSubmitting}
                        rows={6}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-bethel-red focus:border-transparent resize-none disabled:opacity-50"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-gray-700 hover:bg-gray-800 text-white font-bold rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
            </form>
        </div>
    );
}
