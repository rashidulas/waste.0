import {
  fetchPredictions,
  fetchDailySurplus,
} from "@/lib/actions/predictions.actions"; // Adjust the import according to your directory structure
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const PredictionsComponent = async () => {
  const user = await currentUser(); // Get the current user's ID from Clerk
  const userId = user?.id;
  if (!userId) {
    return <div>Error: User not authenticated</div>; // Handle case where userId is not available
  }

  try {
    // Fetch predictions and daily surplus data
    const prediction = await fetchPredictions(userId);
    const dailySurplus = await fetchDailySurplus(userId);

    return (
      <div>
        <h1>Predictions for {userId}</h1>
        <h2>Optimal Orders</h2>
        <pre>{JSON.stringify(prediction, null, 2)}</pre>

        <h2>Daily Surplus</h2>
        <pre>{JSON.stringify(dailySurplus, null, 2)}</pre>
      </div>
    );
  } catch (error: any) {
    return <div>Error: {error.message}</div>;
  }
};

// Example usage of the component
export default async function Page() {
  return <PredictionsComponent />;
}
