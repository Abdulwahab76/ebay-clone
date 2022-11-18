import React, { useState } from "react";
import {
  ChevronDownIcon,
  BellIcon,
  ShoppingCartIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { NavTag } from "../utils/NavTags";
import { useAddress, useDisconnect, useMetamask } from "@thirdweb-dev/react";
import Link from "next/link";
type Props = {};

const Header = ({}: Props) => {
  const connectWithMetaMask = useMetamask();
  const disconnect = useDisconnect();
  const address = useAddress();

  return (
    <div className="max-w-6xl xl:mx-auto  px-2">
      {/* nav */}
      <nav className="flex items-center justify-between p-3">
        <div className="flex space-x-4 items-center text-sm">
          {address ? (
            <button onClick={disconnect} className="connectWallet">
              Hi
              {address.slice(0, 4) + "..." + address.slice(address.length - 4)}
            </button>
          ) : (
            <button onClick={connectWithMetaMask} className="connectWallet">
              Connect your wallet
            </button>
          )}

          <p className="headerLink">Daily Deals</p>
          <p className="headerLink">Help & Contact</p>
        </div>
        <div className="flex text-sm space-x-4 items-center ">
          <p className="headerLink">Ship to</p>
          <p className="headerLink">Sell</p>
          <p className="headerLink">WatchList</p>
          <Link href="/addItem">
            <p className="headerLink hover:link">
              Add to inventory <ChevronDownIcon className="h-5 w-5" />
            </p>
          </Link>
          <BellIcon className="h-5 w-5" />
          <ShoppingCartIcon className="h-5 w-5" />
        </div>
      </nav>

      <hr className="mt-1" />

      {/* section */}
      <section className="flex items-center py-3 space-x-2">
        <div className="flex-shrink-0 h-14 w-14 sm:w-28 md:w-44 cursor-pointer">
          <Link href="/">
            <Image
              alt="ebay-logo"
              sizes="100vh"
              width={100}
              height={100}
              className="h-full w-full object-contain"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/EBay_logo.svg/2560px-EBay_logo.svg.png"
            />
          </Link>
        </div>
        <button className="hidden  w-20 md:inline-flex items-center">
          <p>Shop by Category</p>
          <ChevronDownIcon className="h-5 w-5 flex-shrink-0" />
        </button>
        <div className="flex md:px-2 py-2 border-2 flex-1  space-x-3 items-center px-2 h-10  border-black">
          <MagnifyingGlassIcon className="h-5 text-gray-400" />
          <input
            type="text"
            className="outline-none"
            placeholder="Search for anything"
          />
        </div>

        <button className="hidden sm:inline bg-blue-600 px-4 md:px-8 py-2 border-2 border-blue-600 text-white">
          Search
        </button>
        <Link href="/create">
          <button className="border-2 border-blue-600 px-4 md:px-8 py-2 cursor-pointer text-blue-600 hover:bg-blue-600/50 hover:text-white">
            List Item
          </button>
        </Link>
      </section>
      <hr />
      <section className="flex flex-wrap space-x-3 whitespace-nowrap items-center justify-center md:text-sm py-2">
        {/* <p className="link">Home</p>
            <p className="link">Electronics</p>
            <p className="link">Computers</p>
            <p className="link hidden sm:inline">Video Games</p> */}

        {NavTag.map((item, ind) => (
          <p className={item.className} key={ind}>
            {item.name}
          </p>
        ))}
      </section>
   
    </div>
  );
};
export default Header;
