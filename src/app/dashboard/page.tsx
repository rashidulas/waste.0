import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { connectToDB } from "@/lib/mongoose";
import Business from "@/lib/models/business.model";
import Charity from "@/lib/models/charity.model";
import Image from "next/image";
import { BarChartComponent } from "@/components/charts/BarChart";
import SurplusComponent from "@/components/dashboard/surplus"; // Add this line
import PredictionsTable from "@/components/dashboard/PredictionsTable";
import SpoilageTable from "@/components/dashboard/spoilageTable"; // Add this line
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

// Fetch user data and determine if the user is a charity
async function fetchUserData(userEmail: string) {
  await connectToDB();

  const business = await Business.findOne({ email: userEmail });
  const charity = await Charity.findOne({ email: userEmail });

  // If the user is a charity, fetch all businesses
  let allBusinesses = null;
  if (charity) {
    allBusinesses = await Business.find(); // Get all businesses
  }

  // Return user data and all businesses (if user is a charity)
  return {
    userData: business || charity || null,
    isCharity: !!charity,
    allBusinesses,
  };
}

// Main component rendering the Streamlit app and sidebar
async function StreamlitAppWithSidebar() {
  const user = await currentUser();
  if (!user) return null;

  const userEmail = user?.emailAddresses[0]?.emailAddress;
  const profileImageUrl = "/assets/profile.jpg";

  // Fetch user data and check if the user is a charity
  const { userData, isCharity, allBusinesses } = await fetchUserData(userEmail);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="shadow-sm px-8 py-4 flex justify-between items-center bg-white">
        <div className="text-2xl font-bold text-black">Dashboard</div>
        <div>
          <SignedOut>
            <SignInButton>
              <button className="px-6 py-2 bg-orange-500 text-black rounded hover:bg-orange-600">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </header>

      {/* Content section */}
      <div className="flex-1 w-full bg-gray-50 p-4">
        {/* Flexbox to separate the components */}
        <div className="flex justify-between space-x-4 mb-8">
          {/* Left component */}
          <div className="flex-1 bg-white rounded-lg shadow p-4">
            <SurplusComponent />
          </div>

          {/* Right component */}
          <div className="flex-1 max-w-lg bg-white rounded-lg shadow p-4">
            <PredictionsTable />
          </div>
        </div>

        {/* Spoilage table */}
        <div className="bg-white rounded-lg shadow p-4 max-w-lg mx-auto mb-8">
          <SpoilageTable />
        </div>

        {/* Iframe - Positioned at the end, takes full width, but auto height */}
        <div className="w-full">
          <iframe
            src="http://localhost:8501" // Replace with your Streamlit app URL
            className="w-full h-[80vh] border-none" // 50vh height, or adjust as needed
            title="Streamlit App"
          />
        </div>
      </div>
    </div>
  );
}

export default StreamlitAppWithSidebar;
