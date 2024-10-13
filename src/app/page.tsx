import Image from "next/image";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="bg-white shadow-sm w-full px-8 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-black">waste.0</div>
        <SignedOut>
          <SignInButton>
            <button className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
          <CSVUploadForm />
        </SignedIn>
      </header>

      <MaxWidthWrapper className="mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center">
        <div className="mx-auto mb-4 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-gray-200 bg-white px-7 py-2 shadow-md backdrop-blur transition-all hover:border-gray-300 hover:bg-white/50">
          <p className="text-sm font-semibold text-gray-700">
            Save food resources with AI!
          </p>
        </div>
        <h1 className="max-w-4xl text-5xl font-bold md:text-6xl lg:text-7xl">
        Reduce Food Waste with <span className="text-orange-600">waste.0</span>
        </h1>

        <p className="mt-5 max-w-prose text-zinc-700 sm:text-lg">
        Connect your grocery shop inventory with our AI to predict daily orders and avoid surplus food waste. Notify charities about soon-to-expire food to donate before it gets wasted.
        </p>

        <section >
        {/* Button for logged-out users */}
        <SignedOut>
          <SignInButton>
            <button
              className="mt-5 py-3 px-6 bg-orange-400 text-white rounded-lg text-lg font-semibold shadow-lg hover:bg-orange-800 hover:shadow-orange-300 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 flex items-center justify-center"
            >
              Sign In
            </button>
          </SignInButton>
        </SignedOut>

        {/* Button for logged-in users */}
        <SignedIn>
          <Link href="/dashboard" passHref>
            <button
              className="mt-5 py-3 px-6 bg-orange-400 text-white rounded-lg text-lg font-semibold shadow-lg hover:bg-orange-800 hover:shadow-orange-300 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 flex items-center justify-center"
            >
              Get Started
            </button>
          </Link>
        </SignedIn>
      </section>
      </MaxWidthWrapper> 

      <div className="relative isolate">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative right-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#34d399] to-[#60a5fa] opacity-30 sm:right-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>

        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mt-16 flow-root sm:mt-24">
            <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
            <h2 className="text-3xl font-bold flex flex-auto justify-center text-black">How it Works</h2>
            <ol className="my-8 space-y-4 pt-8 md:flex md:space-x-12 md:space-y-0">
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-medium text-blue-600">Step 1</span>
              <span className="text-xl font-semibold">Sign up for LegalAI</span>
              <span className="mt-2 text-zinc-700">
                Sign up easily with{" "}
                <span className="font-bold">PropelAuth</span> and start
                analyzing your legal documents right away.
              </span>
            </div>
          </li>
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-medium text-blue-600">Step 2</span>
              <span className="text-xl font-semibold">
                Upload your PDF file
              </span>
              <span className="mt-2 text-zinc-700">
                Simply drag and drop your document, and our AI will begin
                analyzing it for risks, inconsistencies, and ambiguities.
              </span>
            </div>
          </li>
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-medium text-blue-600">Step 3</span>
              <span className="text-xl font-semibold">
                Review the AI's analysis
              </span>
              <span className="mt-2 text-zinc-700">
                Receive detailed insights and recommendations, helping you
                ensure compliance and accuracy. Save time and reduce legal risks
                instantly.
              </span>
            </div>
          </li>
        </ol>
            </div>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%-13rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-36rem)] sm:w-[72.1875rem]"
          />
        </div>
      </div>
    </div>
  );
}
