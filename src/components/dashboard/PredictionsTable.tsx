import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"; // Adjust the import according to your directory structure
import { fetchPredictions } from "@/lib/actions/predictions.actions"; // Adjust the import according to your directory structure
import { currentUser } from "@clerk/nextjs/server";

// Define a type for the optimal order
type OptimalOrder = {
  [key: string]: number; // Category name as key and amount as value
};

const PredictionsTable = async () => {
  const user = await currentUser(); // Get the current user's ID from Clerk
  const userId = user?.id;

  if (!userId) {
    return <div>Error: User not authenticated</div>; // Handle case where userId is not available
  }

  try {
    // Fetch predictions data
    const predictionData = await fetchPredictions(userId);
    const optimalOrder: OptimalOrder | undefined = predictionData?.optimalOrder;

    // Convert the optimal order object into an array of entries for easy mapping
    const dataEntries = optimalOrder
      ? Object.entries(optimalOrder).map(([category, amount]) => ({
          category,
          amount,
        }))
      : [];

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead style={{ color: "#f87315" }}>Category</TableHead>
            <TableHead style={{ color: "#f87315" }}>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataEntries.length > 0 ? (
            dataEntries.map(({ category, amount }) => (
              <TableRow key={category}>
                <TableCell>{category}</TableCell>
                <TableCell>{amount}</TableCell>{" "}
                {/* Ensure amount is of type number */}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={2}>No data available</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    );
  } catch (error: any) {
    return <div>Error: {error.message}</div>;
  }
};

export default PredictionsTable;
