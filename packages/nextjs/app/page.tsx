"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { ArrowPathIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [counter, setCounter] = useState(0);

  // Read the user's recorded counter from the blockchain
  const { data: recordedCounter, refetch } = useScaffoldReadContract({
    contractName: "YourContract",
    functionName: "getUserCounter",
    args: [connectedAddress],
  });

  // Write function to record counter on-chain
  const { writeContractAsync: recordCounter } = useScaffoldWriteContract("YourContract");

  const handleIncrement = () => {
    setCounter(prev => prev + 1);
  };

  const handleDecrement = () => {
    setCounter(prev => Math.max(0, prev - 1));
  };

  const handleReset = () => {
    setCounter(0);
  };

  const handleRecordOnChain = async () => {
    try {
      await recordCounter({
        functionName: "recordCounter",
        args: [BigInt(counter)],
      });
      // Refetch the recorded counter after recording
      setTimeout(() => refetch(), 2000);
    } catch (error) {
      console.error("Error recording counter:", error);
    }
  };

  return (
    <>
      <div className="flex items-center flex-col grow pt-10">
        <div className="px-5 w-full max-w-2xl">
          <h1 className="text-center mb-8">
            <span className="block text-4xl font-bold mb-2">Counter App</span>
            <span className="block text-xl text-base-content/70">Record Your Counter On-Chain</span>
          </h1>

          <div className="flex justify-center items-center space-x-2 flex-col mb-8">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>

          {/* Counter Card */}
          <div className="card bg-base-100 shadow-xl mb-6">
            <div className="card-body items-center text-center">
              <h2 className="card-title text-2xl mb-4">Your Counter</h2>

              {/* Counter Display */}
              <div className="text-8xl font-bold text-primary mb-8 min-w-[200px]">{counter}</div>

              {/* Counter Controls */}
              <div className="flex gap-4 mb-6">
                <button className="btn btn-circle btn-lg btn-primary" onClick={handleDecrement}>
                  <MinusIcon className="h-8 w-8" />
                </button>

                <button className="btn btn-circle btn-lg btn-secondary" onClick={handleReset}>
                  <ArrowPathIcon className="h-8 w-8" />
                </button>

                <button className="btn btn-circle btn-lg btn-primary" onClick={handleIncrement}>
                  <PlusIcon className="h-8 w-8" />
                </button>
              </div>

              {/* Record Button */}
              <button
                className="btn btn-accent btn-wide btn-lg"
                onClick={handleRecordOnChain}
                disabled={!connectedAddress}
              >
                📝 Record on Blockchain
              </button>

              {!connectedAddress && (
                <p className="text-sm text-warning mt-2">Please connect your wallet to record on-chain</p>
              )}
            </div>
          </div>

          {/* Recorded Counter Display */}
          {connectedAddress && (
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body items-center text-center">
                <h3 className="card-title text-xl">Your Recorded Counter</h3>
                <div className="text-5xl font-bold text-secondary mt-2">{recordedCounter?.toString() || "0"}</div>
                <p className="text-sm text-base-content/70 mt-2">This value is stored permanently on the blockchain</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
