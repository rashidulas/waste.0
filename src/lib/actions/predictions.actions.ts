"use server";

import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URL || "";

export async function fetchPredictions(userId: string) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("test"); // Your database name
    const predictionsCollection = database.collection("predictions");

    // Fetch the document for the specific user ID
    const prediction = await predictionsCollection.findOne({
      business: userId,
    });

    if (!prediction) {
      throw new Error(`No predictions found for user ID: ${userId}`);
    }

    return prediction;
  } catch (error) {
    console.error("Error fetching predictions:", error);
    throw error; // Re-throw the error to handle it later
  } finally {
    await client.close();
  }
}

// Function to fetch daily surplus data for a specific user
export async function fetchDailySurplus(userId: string) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("test"); // Your database name
    const predictionsCollection = database.collection("surplus");

    // Fetch the document for the specific user ID
    const prediction = await predictionsCollection.findOne({
      business: userId,
    });

    if (!prediction) {
      throw new Error(`No predictions found for user ID: ${userId}`);
    }

    // Return the dailySurplus data
    return prediction.dailySurplus;
  } catch (error) {
    console.error("Error fetching daily surplus:", error);
    throw error; // Re-throw the error to handle it later
  } finally {
    await client.close();
  }
}
