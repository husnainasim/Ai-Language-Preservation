import { getLanguageInsights } from "@/actions/dashboard";
import DashboardView from "./_component/dashboard-view";
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";

async function DashboardPage() {
  const { isOnboarded } = await getUserOnboardingStatus();

  // If not onboarded, redirect to onboarding page
  if (!isOnboarded) {
    redirect("/onboarding");
  }

  const insights = await getLanguageInsights();

  // Ensure the data is serializable
  const serializedInsights = insights
    ? {
        ...insights,
        lastUpdated: insights.lastUpdated.toISOString(),
        nextUpdate: insights.nextUpdate.toISOString(),
      }
    : null;

  return (
    <div className="container mx-auto">
      <DashboardView insights={serializedInsights} />
    </div>
  );
}

export default DashboardPage;
