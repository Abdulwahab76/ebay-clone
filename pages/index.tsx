import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Header from "../components/Header";
import {
  useActiveListings,
  useContract,
  MediaRenderer,
} from "@thirdweb-dev/react";
import { ListingType } from "@thirdweb-dev/sdk";
import { BanknotesIcon, ClockIcon } from "@heroicons/react/24/outline";
const Home: NextPage = () => {
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
    "marketplace"
  );

  const { data: listings, isLoading: loadingListings } =
    useActiveListings(contract);
  console.log("===", listings);
  return (
    <div>
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-2">
        {loadingListings ? (
          <p className="text-center animate-pulse text-blue-500">
            Loading Listings...
          </p>
        ) : (
          <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mx-auto">
            {listings?.map((listing) => (
              <div
                className="flex items-center flex-col card hover:scale-105 transition-all duration-150 ease-in-out"
                key={listing.id}
              >
                <div className="flex-1  flex flex-col items-center">
                  <MediaRenderer className="w-44" src={listing.asset.image} />
                </div>

                <div className="pt-2 flex flex-col justify-around w-full space-y-4">
                  <div>
                    <h2>{listing.asset.name}</h2>
                    <hr className="w-44" />
                    <p className="truncate text-sm mt-2 text-gray-600">
                      {listing.asset.description}
                    </p>
                  </div>

                  <p className="space-x-2">
                    <span className="font-bold mr-1 mt-0">
                      {listing.buyoutCurrencyValuePerToken.displayValue}
                    </span>
                    {listing.buyoutCurrencyValuePerToken.symbol}
                  </p>
                  <div
                    className={`flex p-2 
                      text-xs border w-fit md:mx-0  ml-auto md:ml-auto  rounded-lg text-white ${
                      listing.type === ListingType.Direct
                        ? "bg-blue-500 "
                        : "bg-red-500"
                    }`}
                  >
                    <p>
                      {listing.type === ListingType.Direct
                        ? "Buy Now"
                        : "Auction"}
                    </p>
                    {listing.type === ListingType.Direct ? (
                      <BanknotesIcon className="h-4" />
                    ) : (
                      <ClockIcon className="h-4" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
