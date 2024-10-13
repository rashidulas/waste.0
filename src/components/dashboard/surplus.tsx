import { fetchDailySurplus } from "@/lib/actions/predictions.actions"; // Adjust the import according to your directory structure
import { currentUser } from "@clerk/nextjs/server";
import { BarChartComponent } from "@/components/charts/BarChart"; // Adjust the import as needed

const SurplusComponent = async () => {
  const user = await currentUser(); // Get the current user's ID from Clerk
  const userId = user?.id;
  if (!userId) {
    return <div>Error: User not authenticated</div>; // Handle case where userId is not available
  }

  try {
    // Fetch predictions and daily surplus data
    const dailySurplus = await fetchDailySurplus(userId);

    return (
      <div>
        {/* Pass the daily surplus data to the BarChartComponent */}
        {dailySurplus && <BarChartComponent dailySurplus={dailySurplus} />}
      </div>
    );
  } catch (error: any) {
    return <div>Error: {error.message}</div>;
  }
};

// Export SurplusComponent directly
export default SurplusComponent;
