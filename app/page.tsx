import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Image as ImageIcon, Trophy, Clock, MapPin, Mail, Phone, Youtube, Play } from "lucide-react";
import { getLatestEvents } from "@/lib/supabase/events";
import { getAnnouncements } from "@/lib/supabase/announcements";
import { getHomepageSettings } from "@/lib/supabase/homepage";
import { getFeaturedYouTubeVideos, getYouTubeWatchUrl } from "@/lib/supabase/youtube";
import { Navbar } from "@/components/navbar";
import { Logo } from "@/components/logo";
import Image from "next/image";
import { ImageLightbox } from "@/components/ui/image-lightbox";

import { getRecentGalleryFolders } from "@/lib/gallery/get-recent-folders";

export default async function HomePage() {
  const events = await getLatestEvents(3);
  const announcements = await getAnnouncements(5);
  const settings = await getHomepageSettings();

  // Fetch recent gallery folders from ImageKit
  const recentGalleryFolders = await getRecentGalleryFolders(6);

  // Fetch only featured YouTube videos
  const featuredVideos = await getFeaturedYouTubeVideos(6);

  const heroTitle = settings.hero_title || "Youth of Christha Jyothi";
  const heroSubtitle = settings.hero_subtitle || "CSI Christha Jyothi Church - Building a vibrant community of faith, fellowship, and service";
  const heroBackgroundImage = settings.hero_background_image;
  const showAnnouncements = settings.announcements_enabled !== "false";

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        {/* Hero Section with Church Name */}
        <section className={`relative min-h-[50vh] md:min-h-[60vh] flex items-center pt-24 md:pt-32 pb-12 md:pb-16 px-4 ${heroBackgroundImage ? '' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'}`}>
          {heroBackgroundImage && (
            <div className="absolute inset-0 z-0">
              <Image
                src={heroBackgroundImage}
                alt="Background"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-white/80" />
            </div>
          )}
          <div className="relative z-10 max-w-7xl mx-auto text-center">

            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-3 md:mb-4 text-gray-900 px-2">
              {heroTitle}
            </h1>
            <p className="text-base sm:text-lg md:text-xl mb-6 md:mb-8 max-w-2xl mx-auto text-gray-700 px-4">
              {heroSubtitle}
            </p>
          </div>
        </section>

        {/* Important Announcements Section - Top Priority */}
        {showAnnouncements && announcements.length > 0 && (
          <section className="bg-primary text-white py-4 md:py-6 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="text-center">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 md:mb-4">Important Announcements</h2>
                <div className="space-y-3">
                  {announcements.slice(0, 3).map((announcement) => (
                    <div key={announcement.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-3 md:p-4 border border-white/20">
                      <h3 className="font-semibold text-base md:text-lg mb-1">{announcement.title}</h3>
                      <p className="text-sm md:text-base text-white/90">{announcement.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Service Times Section - Similar to Bethel AG */}
        {settings.service_times_enabled !== "false" && (
          <section className="py-12 md:py-16 px-4 bg-gray-50">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-1 md:mb-2">JOIN US THIS</h2>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-6 md:mb-8">SUNDAY</h3>
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
                  <div className="text-xs md:text-sm text-gray-600 mb-1 md:mb-2">{settings.service_1_label || "1st Service"}</div>
                  <div className="text-xl md:text-3xl font-bold text-primary">{settings.service_1_time || "8 AM"}</div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
                  <div className="text-xs md:text-sm text-gray-600 mb-1 md:mb-2">{settings.service_2_label || "2nd Service"}</div>
                  <div className="text-xl md:text-3xl font-bold text-primary">{settings.service_2_time || "10:00 AM"}</div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
                  <div className="text-xs md:text-sm text-gray-600 mb-1 md:mb-2">{settings.service_3_label || "3rd Service"}</div>
                  <div className="text-xl md:text-3xl font-bold text-primary">{settings.service_3_time || "12:00 PM"}</div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
                  <div className="text-xs md:text-sm text-gray-600 mb-1 md:mb-2">{settings.service_4_label || "4th Service"}</div>
                  <div className="text-xl md:text-3xl font-bold text-primary">{settings.service_4_time || "6 PM"}</div>
                </div>
              </div>
              <p className="text-sm md:text-base text-gray-600 mt-4 md:mt-6">{settings.service_language || "ALL SERVICES IN ENGLISH"}</p>
            </div>
          </section>
        )}

        {/* Upcoming Events */}
        <section className="py-12 md:py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            {/* Simple Header */}
            <div className="max-w-3xl mx-auto mb-8 bg-orange-50 rounded-lg p-4 md:p-5 text-center">
              <div className="inline-flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-orange-500 rounded-full">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                  UPCOMING EVENTS
                </h2>
              </div>
              <p className="text-xs md:text-sm text-gray-700 mb-3">
                Join us for fellowship, worship, and community
              </p>
              <Button
                asChild
                size="sm"
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 text-sm"
              >
                <Link href="/events">
                  <Calendar className="w-3.5 h-3.5 mr-1.5" />
                  View All Events
                </Link>
              </Button>
            </div>
            {events.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No upcoming events at the moment. Check back soon!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {events.map((event) => (
                  <Card key={event.id} className="hover:shadow-lg transition-shadow border border-gray-200">
                    {event.banner_url && (
                      <ImageLightbox
                        src={event.banner_url}
                        alt={event.title}
                        className="h-48 w-full"
                        imageClassName="object-cover rounded-t-lg"
                      />
                    )}
                    <CardHeader>
                      <div className="flex items-center gap-2 text-primary mb-2">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {new Date(event.date).toLocaleDateString()}
                        </span>
                      </div>
                      <CardTitle className="text-xl text-gray-900">{event.title}</CardTitle>
                      <CardDescription className="line-clamp-2 text-gray-600">
                        {event.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Button asChild variant="outline" className="flex-1">
                          <Link href={`/events/${event.id}`}>View Details</Link>
                        </Button>
                        <Button asChild className="flex-1">
                          <Link href={`/events/${event.id}/register`}>Register</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Gallery Highlights Section */}
        {recentGalleryFolders.length > 0 && (
          <section className="py-12 md:py-16 px-4 bg-gray-50">
            <div className="max-w-7xl mx-auto">
              {/* Simple Header */}
              <div className="max-w-3xl mx-auto mb-8 bg-orange-50 rounded-lg p-4 md:p-5 text-center">
                <div className="inline-flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-orange-500 rounded-full">
                    <ImageIcon className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                    GALLERY HIGHLIGHTS
                  </h2>
                </div>
                <p className="text-xs md:text-sm text-gray-700 mb-3">
                  Capturing moments of faith, fellowship, and celebration
                </p>
                <Button
                  asChild
                  size="sm"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 text-sm"
                >
                  <Link href="/gallery">
                    <ImageIcon className="w-3.5 h-3.5 mr-1.5" />
                    Explore Full Gallery
                  </Link>
                </Button>
              </div>

              {/* Gallery Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {recentGalleryFolders.slice(0, 6).map((folder) => (
                  <Link
                    key={folder.id}
                    href={`/gallery/${encodeURIComponent(folder.name)}`}
                    className="group block relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="relative h-64 md:h-72 w-full">
                      <Image
                        src={folder.coverImage}
                        alt={folder.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white transform transition-transform duration-300 group-hover:translate-y-0">
                        <h3 className="text-lg md:text-xl font-bold mb-2 line-clamp-2">{folder.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-white/90">
                          <ImageIcon className="w-4 h-4" />
                          <span>{folder.count} Photos</span>
                        </div>
                      </div>

                      {/* Hover Effect - View Gallery Button */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white text-primary px-6 py-3 rounded-full font-semibold transform scale-90 group-hover:scale-100 transition-transform duration-300 shadow-xl">
                          View Gallery
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* YouTube Videos Section */}
        {featuredVideos.length > 0 && (
          <section className="py-12 md:py-16 px-4 bg-white">
            <div className="max-w-7xl mx-auto">
              {/* Simple Header */}
              <div className="max-w-3xl mx-auto mb-8 bg-orange-50 rounded-lg p-4 md:p-5 text-center">
                <div className="inline-flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-orange-500 rounded-full">
                    <Youtube className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                    OUR VIDEOS
                  </h2>
                </div>
                <p className="text-xs md:text-sm text-gray-700 mb-3">
                  Watch our worship services, livestreams, and heartfelt song covers
                </p>
                <Button
                  asChild
                  size="sm"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 text-sm"
                >
                  <Link href="/videos">
                    <Play className="w-3.5 h-3.5 mr-1.5" />
                    View All Videos
                  </Link>
                </Button>
              </div>

              {/* Combined Videos Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {featuredVideos.map((video) => (
                  <Card key={video.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                    <div className="relative aspect-video bg-gray-100">
                      <iframe
                        src={`https://www.youtube.com/embed/${video.video_id}`}
                        title={video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                      />
                    </div>
                    <CardHeader className="p-3 md:p-6">
                      <div className="flex items-center gap-2 mb-1 md:mb-2">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${video.video_type === 'livestream'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-purple-100 text-purple-700'
                          }`}>
                          {video.video_type === 'livestream' ? 'Livestream' : 'Song Cover'}
                        </span>
                      </div>
                      <CardTitle className="text-sm md:text-lg line-clamp-2 group-hover:text-primary transition-colors">
                        {video.title}
                      </CardTitle>
                      {video.description && (
                        <CardDescription className="line-clamp-2 text-xs md:text-sm">
                          {video.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}


        {/* Welcome Note Section */}
        <section className="py-12 md:py-16 px-4 relative overflow-hidden">
          {/* Background Image with Overlay */}
          {settings.welcome_note_background_image && (
            <>
              <div className="absolute inset-0 z-0">
                <Image
                  src={settings.welcome_note_background_image}
                  alt="Welcome background"
                  fill
                  className="object-cover"
                  priority={false}
                />
              </div>
              <div className="absolute inset-0 bg-black/40 z-0"></div>
            </>
          )}

          <div className={`max-w-6xl mx-auto relative z-10 ${settings.welcome_note_background_image ? '' : 'bg-gray-50 rounded-2xl p-8 md:p-12'}`}>
            <div className={`grid md:grid-cols-${settings.welcome_note_background_image ? '2' : '1'} gap-8 items-center`}>
              {/* Text Content */}
              <div className={settings.welcome_note_background_image ? 'bg-gray-800/80 backdrop-blur-sm p-6 md:p-8 rounded-xl' : ''}>
                <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6 ${settings.welcome_note_background_image ? 'text-white' : 'text-gray-900'}`}>
                  Welcome Note
                </h2>
                <div className={`prose prose-sm md:prose-lg max-w-none leading-relaxed ${settings.welcome_note_background_image ? 'text-white prose-invert' : 'text-gray-700'}`}>
                  {settings.welcome_note ? (
                    <div className="whitespace-pre-line">
                      {settings.welcome_note.split('\n').map((paragraph, index) => (
                        paragraph.trim() && (
                          <p key={index} className="mb-4">
                            {paragraph}
                          </p>
                        )
                      ))}
                    </div>
                  ) : (
                    <>
                      <p className="mb-4">
                        This life is a beautiful gift of God. Life can get both fair and unfair at times. We find ourselves fighting battles (some meaningful and some meaningless) and believe they are here to stay. Many call life a race and some don't even know why they are running it. In the midst of it all, we pray that God's pure light would lead your way and you would know He truly cares.
                      </p>
                      <p className="mb-4">
                        We pray that God would provide for you the comfort and strength He has promised His children and that you would discover the freedom in trusting the One who will never let you down. The Lord builds both our character and competence for HIS glory in us.
                      </p>
                      <p className="mb-4">
                        God has been gracious and we are here not by our strength but by His faithfulness. He built the Youth of Christha Jyothi brick by brick while we stood lifting our hands in worship. Our prayer is that this family at YCJ would abound in God's love, goodness, and grace. We pray that you would find God in this kingdom to place and time of your life. There is hope and rest in Him for all who are Seeking. We pray you wouldn't miss it.
                      </p>
                    </>
                  )}
                  <p className={`font-semibold mt-6 ${settings.welcome_note_background_image ? 'text-white' : 'text-gray-900'}`}>
                    {settings.welcome_note_signature || "Youth of Christha Jyothi Leadership"}
                  </p>
                </div>
              </div>

              {/* Image placeholder on the right (only visible when background image is set) */}
              {settings.welcome_note_background_image && (
                <div className="hidden md:block">
                  {/* This space is intentionally left for the background image to show through */}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Connect with Us / Contact Section - Dark Theme */}
        <section className="py-16 px-4 bg-black border-t border-gray-800">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              {/* Quick Links */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/events" className="text-gray-300 hover:text-white transition-colors">
                      Events
                    </Link>
                  </li>
                  <li>
                    <Link href="/gallery" className="text-gray-300 hover:text-white transition-colors">
                      Gallery
                    </Link>
                  </li>
                  <li>
                    <Link href="/office-bearers" className="text-gray-300 hover:text-white transition-colors">
                      Office Bearers
                    </Link>
                  </li>
                  <li>
                    <Link href="/register" className="text-gray-300 hover:text-white transition-colors">
                      Register
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Email:</p>
                    <a
                      href={`mailto:${settings.contact_email || "info@ycjchurch.org"}`}
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {settings.contact_email || "info@ycjchurch.org"}
                    </a>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Location:</p>
                    <p className="text-gray-300">
                      {settings.contact_address_line1 || "CSI Christa Jyothi Church"}
                      {settings.contact_address_line2 && (
                        <>
                          <br />
                          {settings.contact_address_line2}
                        </>
                      )}
                    </p>
                  </div>
                  {settings.contact_phone && (
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Phone:</p>
                      <a
                        href={`tel:${settings.contact_phone}`}
                        className="text-gray-300 hover:text-white transition-colors"
                      >
                        {settings.contact_phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Follow Us */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
                <div className="flex flex-wrap gap-4">
                  {settings.social_facebook && (
                    <a
                      href={settings.social_facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1877F2] hover:opacity-80 transition-opacity"
                      aria-label="Facebook"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </a>
                  )}
                  {settings.social_instagram && (
                    <a
                      href={settings.social_instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:opacity-80 transition-opacity"
                      aria-label="Instagram"
                    >
                      <svg className="w-6 h-6" viewBox="0 0 24 24">
                        <defs>
                          <linearGradient id="instagram-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                            <stop offset="0%" style={{ stopColor: '#FD5949', stopOpacity: 1 }} />
                            <stop offset="50%" style={{ stopColor: '#D6249F', stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: '#285AEB', stopOpacity: 1 }} />
                          </linearGradient>
                        </defs>
                        <path fill="url(#instagram-gradient)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </a>
                  )}
                  {settings.social_youtube && (
                    <a
                      href={settings.social_youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#FF0000] hover:opacity-80 transition-opacity"
                      aria-label="YouTube"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                    </a>
                  )}
                  {settings.social_whatsapp && (
                    <a
                      href={settings.social_whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#25D366] hover:opacity-80 transition-opacity"
                      aria-label="WhatsApp"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                    </a>
                  )}
                  {(!settings.social_facebook && !settings.social_instagram && !settings.social_youtube && !settings.social_whatsapp) && (
                    <p className="text-sm text-gray-400">Social media links will appear here</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
