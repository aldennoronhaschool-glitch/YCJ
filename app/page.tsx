import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Image as ImageIcon, Trophy } from "lucide-react";
import { getLatestEvents } from "@/lib/supabase/events";
import { getAnnouncements } from "@/lib/supabase/announcements";
import { getHomepageSettings } from "@/lib/supabase/homepage";
import { Navbar } from "@/components/navbar";
import Image from "next/image";

export default async function HomePage() {
  const events = await getLatestEvents(3);
  const announcements = await getAnnouncements(3);
  const settings = await getHomepageSettings();

  const heroTitle = settings.hero_title || "Youth of Christha Jyothi";
  const heroSubtitle = settings.hero_subtitle || "CSI Christha Jyothi Church - Building a vibrant community of faith, fellowship, and service";
  const heroBackgroundImage = settings.hero_background_image;
  const heroBackgroundColor = settings.hero_background_color || "from-blue-50 via-indigo-50 to-purple-50";
  const showAnnouncements = settings.announcements_enabled !== "false";

  return (
    <>
      <Navbar />
      <div className="min-h-screen">
      {/* Hero Section */}
      <section className={`relative py-20 px-4 ${heroBackgroundImage ? '' : `bg-gradient-to-br ${heroBackgroundColor}`}`}>
        {heroBackgroundImage && (
          <div className="absolute inset-0 z-0">
            <Image
              src={heroBackgroundImage}
              alt="Background"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>
        )}
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
              <span className="text-4xl">✟</span>
            </div>
          </div>
          <h1 className={`text-5xl md:text-6xl font-bold mb-4 ${heroBackgroundImage ? 'text-white' : 'text-gray-900'}`}>
            {heroTitle}
          </h1>
          <p className={`text-xl mb-8 max-w-2xl mx-auto ${heroBackgroundImage ? 'text-white' : 'text-gray-600'}`}>
            {heroSubtitle}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/events">View Events</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8">
              <Link href="/register">Register for Competitions</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Latest Events */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Latest Events</h2>
            <p className="text-gray-600">Join us for upcoming gatherings and activities</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2 text-primary mb-2">
                    <Calendar className="w-5 h-5" />
                    <span className="text-sm font-medium">
                      {new Date(event.date).toLocaleDateString()}
                    </span>
                  </div>
                  <CardTitle>{event.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
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
          <div className="text-center mt-8">
            <Button asChild variant="outline">
              <Link href="/events">View All Events</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Announcements */}
      {showAnnouncements && announcements.length > 0 && (
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Announcements</h2>
              <p className="text-gray-600">Stay updated with the latest news</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {announcements.map((announcement) => (
                <Card key={announcement.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{announcement.title}</CardTitle>
                    <CardDescription>
                      {new Date(announcement.created_at).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{announcement.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Quick Links */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>Events</CardTitle>
                <CardDescription>View all upcoming events and activities</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href="/events">Explore Events</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>Gallery</CardTitle>
                <CardDescription>Browse photos from past events</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href="/gallery">View Gallery</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>Office Bearers</CardTitle>
                <CardDescription>Meet the leaders serving our church</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href="/office-bearers">View Office Bearers</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Trophy className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>Competitions</CardTitle>
                <CardDescription>Register for upcoming competitions</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href="/register">Register Now</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}

