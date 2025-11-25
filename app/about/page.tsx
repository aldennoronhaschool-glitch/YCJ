import { Navbar } from "@/components/navbar";
import { getAboutSectionsPublic } from "@/lib/supabase/about";
import Image from "next/image";

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
    let sections = await getAboutSectionsPublic();

    // Fallback content if database is not set up yet
    if (sections.length === 0) {
        sections = [
            {
                id: "temp-hero",
                section_key: "hero",
                title: "About Us",
                content: "Welcome to Youth of Christha Jyothi",
                image_url: null,
                order_index: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
            {
                id: "temp-mission",
                section_key: "mission",
                title: "Our Mission",
                content: "To build a vibrant community of faith, fellowship, and service among the youth of CSI Christha Jyothi Church.",
                image_url: null,
                order_index: 1,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
            {
                id: "temp-vision",
                section_key: "vision",
                title: "Our Vision",
                content: "Empowering young people to grow in their faith and make a positive impact in their communities.",
                image_url: null,
                order_index: 2,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
        ];
    }

    const heroSection = sections.find((s) => s.section_key === "hero");
    const otherSections = sections.filter((s) => s.section_key !== "hero");

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-white">
                {/* Hero Section */}
                <section className="relative pt-32 pb-16 px-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                    {heroSection?.image_url && (
                        <div className="absolute inset-0 z-0">
                            <Image
                                src={heroSection.image_url}
                                alt="About Us"
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-white/80" />
                        </div>
                    )}
                    <div className="relative z-10 max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gray-900">
                            {heroSection?.title || "About Us"}
                        </h1>
                        {heroSection?.content && (
                            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
                                {heroSection.content}
                            </p>
                        )}
                    </div>
                </section>

                {/* Content Sections */}
                <section className="py-16 px-4">
                    <div className="max-w-5xl mx-auto space-y-16">
                        {otherSections.map((section, index) => (
                            <div
                                key={section.id}
                                className={`flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                                    } gap-8 items-center`}
                            >
                                {section.image_url && (
                                    <div className="w-full md:w-1/2">
                                        <div className="relative h-64 md:h-96 rounded-lg overflow-hidden shadow-lg">
                                            <Image
                                                src={section.image_url}
                                                alt={section.title || ""}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </div>
                                )}
                                <div className={`w-full ${section.image_url ? "md:w-1/2" : ""}`}>
                                    {section.title && (
                                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                            {section.title}
                                        </h2>
                                    )}
                                    {section.content && (
                                        <div className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                                            {section.content}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </>
    );
}
