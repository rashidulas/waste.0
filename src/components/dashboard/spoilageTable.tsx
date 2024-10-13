import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"; // Adjust the import according to your directory structure
import { fetchSpoilage } from "@/lib/actions/predictions.actions"; // Adjust the import according to your directory structure
import { currentUser } from "@clerk/nextjs/server";

// Define a type for the spoilage data
type SpoilageData = {
  item: string; // Item name
  amount: number; // Spoilage amount
  date: string; // Date of spoilage
};

const SpoilageTable = async () => {
  const user = await currentUser(); // Get the current user's ID from Clerk
  const userId = user?.id;

  if (!userId) {
    return (
      <div className="p-4 text-red-500">Error: User not authenticated</div>
    ); // Handle case where userId is not available
  }

  try {
    // Fetch spoilage data
    const spoilageEntries: SpoilageData[] = await fetchSpoilage(userId);

    return (
      <div className="rounded-lg overflow-hidden shadow-md bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="bg-gray-100" style={{ color: "#f87315" }}>
                Item
              </TableHead>
              <TableHead className="bg-gray-100" style={{ color: "#f87315" }}>
                Amount
              </TableHead>
              <TableHead className="bg-gray-100" style={{ color: "#f87315" }}>
                Expiry Date
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {spoilageEntries.length > 0 ? (
              spoilageEntries.map(({ item, amount, date }, index) => (
                <TableRow key={index} className="hover:bg-gray-100">
                  <TableCell className="border-b">{item}</TableCell>
                  <TableCell className="border-b">{amount}</TableCell>
                  <TableCell className="border-b">{date}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  No spoilage data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    );
  } catch (error: any) {
    return <div className="p-4 text-red-500">Error: {error.message}</div>;
  }
};

export default SpoilageTable;
