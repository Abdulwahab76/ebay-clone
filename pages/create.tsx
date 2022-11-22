import React, { useState } from "react";
import Header from "../components/Header";
import {
  useAddress,
  useContract,
  MediaRenderer,
  useNetwork,
  useNetworkMismatch,
  useOwnedNFTs,
  useCreateAuctionListing,
  useCreateDirectListing,
  useDisconnect,
  useMetamask,
} from "@thirdweb-dev/react";

import { NFT, NATIVE_TOKENS, NATIVE_TOKEN_ADDRESS } from "@thirdweb-dev/sdk";
import network from "../utils/network";
import { useRouter } from "next/router";
const Create = () => {
  const disconnect = useDisconnect();
  const address = useAddress();

  const { contract } = useContract(
    process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
    "marketplace"
  );
  const [selectedNft, setSelectedNft] = useState<NFT>();
  const { contract: collectionContract } = useContract(
    process.env.NEXT_PUBLIC_COLLECTION_CONTRACT,
    "nft-collection"
  );
  const networkMistMatch = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();

  const {
    mutate: createDirectListing,
    isLoading,
    error,
  } = useCreateDirectListing(contract);


  const {
    mutate: createAuctionListing,
    isLoading: isLoadingDirect,
    error: errorDirect,
  } = useCreateAuctionListing(contract);

  const ownedNfts = useOwnedNFTs(collectionContract, address);
  console.log(ownedNfts);
  const router = useRouter();

  const handleCreateListing = async (e: any) => {
    e.preventDefault();
    if (networkMistMatch) {
      switchNetwork && switchNetwork(network);
      return;
    }
    if (!selectedNft) return;

    const target = e.target as typeof e.target & {
      elements: { listingType: { value: string }; price: { value: string } };
    };

    const { listingType, price } = target.elements;
    console.log("===>", listingType.value);

    if (listingType.value === "directListing") {
      createDirectListing(
        {
          assetContractAddress: process.env.NEXT_PUBLIC_COLLECTION_CONTRACT,
          tokenId: selectedNft.metadata.id,
          currencyContractAddress: NATIVE_TOKEN_ADDRESS,
          listingDurationInSeconds: 60 * 60 * 24 * 7,
          startTimestamp: new Date(),
          quantity: 1,
          buyoutPricePerToken: price.value,
        },
        {
          onSuccess(data, variable, context) {
            console.log("success", data, variable, context);
            router.push("/");
          },
          onError(error, variable, context) {
            console.log("success", error, variable, context);
          },
        }
      );
      console.log("yes work");
    }
    if (listingType.value === "auctionListing") {
      createAuctionListing({
        assetContractAddress: process.env.NEXT_PUBLIC_COLLECTION_CONTRACT,
        buyoutPricePerToken: price.value,
        quantity: 1,
        reservePricePerToken: 0,
        tokenId: selectedNft.metadata.id,
        currencyContractAddress: NATIVE_TOKEN_ADDRESS,
        listingDurationInSeconds: 60 * 60 * 24 * 7,
        startTimestamp: new Date(),
      });
    }
  };

  return (
    <div>
      <Header />

      <main className="max-w-6xl mx-auto p-10 pt-2">
        <h1 className="text-4xl font-bold">List an Item</h1>
        <h2 className="text-xl font-semibold pt-3">
          Select an Item you would like to Sell
        </h2>
        <hr className="mb-2" />
        <p>Below you will find the NFT's you own in your wallet</p>
        <div className="flex overflow-x-auto space-x-3">
          {ownedNfts?.data?.length > 0 ? (
            ownedNfts?.data?.map((nft) => (
              <div
                className={`flex flex-col space-y-2  mt-3 card min-w-fit  border 2 bg-gray-100 ${
                  nft.metadata.id === selectedNft?.metadata.id
                    ? "border-blue-500"
                    : "border-none"
                }`}
                key={nft.metadata.id}
                onClick={() => setSelectedNft(nft)}
              >
                <MediaRenderer
                  className="h-48 w-48 rounded-lg"
                  src={nft.metadata.image}
                />
                <p className="text-lg truncate font-bold">
                  {nft.metadata.name}
                </p>
                <p className="text-xs truncate">{nft.metadata.description}</p>
              </div>
            ))
          ) : (
            <span className="font-light text-lg py-2">
              Connect your{" "}
              <span className="cursor-pointer hover:btn-outline px-2 py-1 rounded-md text-white bg-blue-500 border text-lg">
                MetaMask
              </span>{" "}
              wallet.{" "}
            </span>
          )}
        </div>
        {selectedNft && (
          <form onSubmit={handleCreateListing}>
            <div className="flex flex-col p-10 ">
              <div className="grid grid-cols-2 gap-5">
                <label className="border-r font-light">
                  Direct Listing / Fixed price
                </label>
                <input
                  className="ml-auto w-6 h-6"
                  value="directListing"
                  type="radio"
                  name="listingType"
                />
                <label className="border-r font-light">Auction</label>
                <input
                  className="ml-auto w-6 h-6"
                  value="auctionListing"
                  type="radio"
                  name="listingType"
                />

                <label className="border-r font-light">Price</label>
                <input
                  type="text"
                  name="price"
                  placeholder="0.05"
                  className="bg-gray-100 p-5"
                />
              </div>
              <button
                className="bg-blue-600 text-white rounded-lg p-4 mt-8 "
                type="submit"
              >
                Create Listing
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
};

export default Create;
