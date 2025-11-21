"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Registration } from "@/lib/supabase/registrations";
import { Competition } from "@/lib/supabase/competitions";
import { Download } from "lucide-react";

export function RegistrationsManager({
  initialRegistrations,
  competitions,
}: {
  initialRegistrations: Registration[];
  competitions: Competition[];
}) {
  const [selectedCompetition, setSelectedCompetition] = useState<string>("all");

  const getCompetitionTitle = (competitionId: string) => {
    return competitions.find((c) => c.id === competitionId)?.title || "Unknown";
  };

  const filteredRegistrations =
    selectedCompetition === "all"
      ? initialRegistrations
      : initialRegistrations.filter((r) => r.competition_id === selectedCompetition);

  const handleDownloadCSV = () => {
    const headers = ["Name", "Phone", "Age", "Team Name", "Payment Mode", "Competition", "Date"];
    const rows = filteredRegistrations.map((reg) => [
      reg.name,
      reg.phone,
      reg.age.toString(),
      reg.team_name || "",
      reg.payment_mode || "",
      getCompetitionTitle(reg.competition_id),
      new Date(reg.created_at).toLocaleDateString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `registrations-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>All Registrations</CardTitle>
            <div className="flex gap-4">
              <select
                value={selectedCompetition}
                onChange={(e) => setSelectedCompetition(e.target.value)}
                className="px-4 py-2 border rounded-md"
              >
                <option value="all">All Competitions</option>
                {competitions.map((comp) => (
                  <option key={comp.id} value={comp.id}>
                    {comp.title}
                  </option>
                ))}
              </select>
              <Button onClick={handleDownloadCSV}>
                <Download className="w-4 h-4 mr-2" />
                Download CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredRegistrations.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No registrations found.</p>
          ) : (
            <div className="space-y-4">
              {filteredRegistrations.map((registration) => (
                <Card key={registration.id}>
                  <CardContent className="pt-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Name</p>
                        <p className="text-lg">{registration.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Phone</p>
                        <p className="text-lg">{registration.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Age</p>
                        <p className="text-lg">{registration.age}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Competition</p>
                        <p className="text-lg">{getCompetitionTitle(registration.competition_id)}</p>
                      </div>
                      {registration.team_name && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">Team Name</p>
                          <p className="text-lg">{registration.team_name}</p>
                        </div>
                      )}
                      {registration.payment_mode && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">Payment Mode</p>
                          <p className="text-lg">{registration.payment_mode}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-500">Registered On</p>
                        <p className="text-lg">
                          {new Date(registration.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

