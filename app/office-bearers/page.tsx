import Image from "next/image";
import { getOfficeBearers } from "@/lib/supabase/officeBearers";
import { Navbar } from "@/components/navbar";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function OfficeBearersPage() {
  const bearers = await getOfficeBearers();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Office Bearers
            </h1>
            <p className="text-gray-600">
              Meet the leaders serving in YCJ and CSI Christha Jyothi Church
            </p>
          </div>

          {bearers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                Office bearers will be updated soon.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {bearers.map((bearer) => (
                <div
                  key={bearer.id}
                  className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow border border-gray-200"
                >
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-4 bg-gray-100">
                    {bearer.photo_url ? (
                      <Image
                        src={bearer.photo_url}
                        alt={bearer.name}
                        width={96}
                        height={96}
                        className="w-24 h-24 object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 flex items-center justify-center text-gray-400 text-3xl">
                        {bearer.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {bearer.name}
                  </h2>
                  <p className="text-sm text-primary font-medium mt-1">
                    {bearer.role}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}


