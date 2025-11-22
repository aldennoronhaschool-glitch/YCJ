import { getAllCompetitions } from "@/lib/supabase/competitions";
import { RegistrationForm } from "@/components/registration-form";
import { Navbar } from "@/components/navbar";

export default async function RegisterPage() {
  const competitions = await getAllCompetitions();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Register for Competitions</h1>
          <p className="text-gray-600">Join our exciting competitions and showcase your talents</p>
        </div>

        <RegistrationForm competitions={competitions} />
      </div>
    </div>
    </>
  );
}

