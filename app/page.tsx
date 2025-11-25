import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Image as ImageIcon, Trophy, Clock, MapPin, Mail, Phone } from "lucide-react";
import { getLatestEvents } from "@/lib/supabase/events";
import { getAnnouncements } from "@/lib/supabase/announcements";
import { getHomepageSettings } from "@/lib/supabase/homepage";
import { getRecentGalleryFolders } from "@/lib/supabase/gallery";
import { Navbar } from "@/components/navbar";
import { Logo } from "@/components/logo";
import Image from "next/image";
import { ImageLightbox } from "@/components/ui/image-lightbox";

export default async function HomePage() {
  const events = await getLatestEvents(3);
  const announcements = await getAnnouncements(5);
  const settings = await getHomepageSettings();

  // Fetch recent gallery folders from ImageKit
  let recentGalleryFolders: any[] = [];
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/imagekit/recent-folders?limit=4`, {
      cache: 'no-store'
    });
    if (response.ok) {
      const data = await response.json();
      recentGalleryFolders = data.folders || [];
    }
  } catch (error) {
    console.error("Error fetching gallery folders:", error);
  }

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
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">UPCOMING EVENTS</h2>
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
                      <Button asChild variant="outline" className="w-full">
                        <Link href={`/events/${event.id}`}>View Details</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            <div className="text-center mt-8">
              <Button asChild>
                <Link href="/events">View All Events</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Recent Gallery Updates */}
        {recentGalleryFolders.length > 0 && (
          <section className="py-12 md:py-16 px-4 bg-gray-50">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-8 md:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">RECENT GALLERY</h2>
                <p className="text-sm md:text-base text-gray-600">Browse our latest photos from recent events</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {recentGalleryFolders.map((folder) => (
                  <Link
                    key={folder.id}
                    href={`/gallery/${encodeURIComponent(folder.name)}`}
                    className="group block"
                  >
                    <div className="relative h-48 sm:h-56 md:h-64 w-full overflow-hidden rounded-lg shadow-md">
                      <Image
                        src={folder.coverImage}
                        alt={folder.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />
                      <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 text-white">
                        <h3 className="text-base md:text-lg font-bold mb-1 line-clamp-1">{folder.name}</h3>
                        <p className="text-xs md:text-sm text-white/80">{folder.count} Photos</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="text-center mt-8">
                <Button asChild variant="outline">
                  <Link href="/gallery">View Full Gallery</Link>
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* Quick Links Section */}
        <section className="py-12 md:py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">Quick Links</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <Card className="text-center hover:shadow-lg transition-shadow border border-gray-200">
                <CardHeader className="pb-3 md:pb-6">
                  <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-2 md:mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                  </div>
                  <CardTitle className="text-base md:text-lg">Events</CardTitle>
                  <CardDescription className="text-xs md:text-sm">View all upcoming events</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href="/events">Explore Events</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow border border-gray-200">
                <CardHeader className="pb-3 md:pb-6">
                  <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-2 md:mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                  </div>
                  <CardTitle className="text-base md:text-lg">Gallery</CardTitle>
                  <CardDescription className="text-xs md:text-sm">Browse photos from events</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href="/gallery">View Gallery</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow border border-gray-200">
                <CardHeader className="pb-3 md:pb-6">
                  <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-2 md:mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                  </div>
                  <CardTitle className="text-base md:text-lg">Office Bearers</CardTitle>
                  <CardDescription className="text-xs md:text-sm">Meet our leaders</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href="/office-bearers">View Office Bearers</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow border border-gray-200">
                <CardHeader className="pb-3 md:pb-6">
                  <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-2 md:mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <Trophy className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                  </div>
                  <CardTitle className="text-base md:text-lg">Competitions</CardTitle>
                  <CardDescription className="text-xs md:text-sm">Register for competitions</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href="/register">Register Now</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Welcome Note Section */}
        <section className="py-12 md:py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-6 text-center">Welcome Note</h2>
            <div className="prose prose-sm md:prose-lg max-w-none text-gray-700 leading-relaxed">
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
              <p className="font-semibold text-gray-900 mt-6">
                {settings.welcome_note_signature || "Youth of Christha Jyothi Leadership"}
              </p>
            </div>
          </div>
        </section>

        {/* Connect with Us / Contact Section - ACSA Style */}
        <section className="py-16 px-4 bg-gray-50 border-t">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              {/* Quick Links */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/" className="text-gray-600 hover:text-primary transition-colors">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/events" className="text-gray-600 hover:text-primary transition-colors">
                      Events
                    </Link>
                  </li>
                  <li>
                    <Link href="/gallery" className="text-gray-600 hover:text-primary transition-colors">
                      Gallery
                    </Link>
                  </li>
                  <li>
                    <Link href="/office-bearers" className="text-gray-600 hover:text-primary transition-colors">
                      Office Bearers
                    </Link>
                  </li>
                  <li>
                    <Link href="/register" className="text-gray-600 hover:text-primary transition-colors">
                      Register
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email:</p>
                    <a
                      href={`mailto:${settings.contact_email || "info@ycjchurch.org"}`}
                      className="text-gray-700 hover:text-primary transition-colors"
                    >
                      {settings.contact_email || "info@ycjchurch.org"}
                    </a>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Location:</p>
                    <p className="text-gray-700">
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
                      <p className="text-sm text-gray-500 mb-1">Phone:</p>
                      <a
                        href={`tel:${settings.contact_phone}`}
                        className="text-gray-700 hover:text-primary transition-colors"
                      >
                        {settings.contact_phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Follow Us */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Follow Us</h3>
                <div className="flex flex-wrap gap-4">
                  {settings.social_facebook && (
                    <a
                      href={settings.social_facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-primary transition-colors"
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
                      className="text-gray-600 hover:text-primary transition-colors"
                      aria-label="Instagram"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </a>
                  )}
                  {settings.social_youtube && (
                    <a
                      href={settings.social_youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-primary transition-colors"
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
                      className="text-gray-600 hover:text-primary transition-colors"
                      aria-label="WhatsApp"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                    </a>
                  )}
                  {(!settings.social_facebook && !settings.social_instagram && !settings.social_youtube && !settings.social_whatsapp) && (
                    <p className="text-sm text-gray-500">Social media links will appear here</p>
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
