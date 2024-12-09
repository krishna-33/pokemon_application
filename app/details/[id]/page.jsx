"use client";

import Loader from "@/components/Loader";
import useFetch from "@/hooks/useFetch";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Details() {
  const { id } = useParams();
  const { data, loading } = useFetch(
    `https://pokeapi.co/api/v2/pokemon/${id}/`
  );
  const [details, setDetails] = useState(null);

  useEffect(() => {
    const DetailObj = {
      name: data?.forms[0]?.name,
      stats: data?.stats.map((item) => item.stat.name),
      abilities: data?.abilities?.map((item) => item.ability.name),
      moves: data?.moves?.map((item) => item.move.name),
      image: data?.sprites?.front_default || data?.sprites?.back_default,
      types: data?.types?.map((item) => item.type.name),
    };
    setDetails(DetailObj);
  }, [data]);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="text-sm text-gray-700 mb-4">
            <Link href="/" className="hover:underline text-blue-500">
              Home
            </Link>
            {" -> "}
            <span>{details?.name}</span>
          </div>

          <div className="rounded-lg shadow-md" style={{ width: 500 }}>
            <div className="flex flex-col items-center justify-center">
              {details?.image && (
                <div style={{ backgroundColor: "#60e2c9" }}>
                  <Image
                    src={details?.image}
                    alt={details?.name}
                    width={500}
                    height={100}
                  />
                </div>
              )}
            </div>
            <div className="bg-yellow-400 p-4  shadow-md">
              <h2 className="text-xl flex justify-left">
                <div className="font-bold mr-2">Name: </div>{" "}
                <div>{details?.name}</div>
              </h2>
              <div className="flex justify-left mt-2">
                <div className="font-bold mr-2">Type: </div>
                {details?.types?.join(",")}
              </div>
              <div className="flex justify-left mt-2">
                <div className="font-bold mr-2">Stats: </div>
                {details?.stats?.join(",")}
              </div>
              <div className="flex justify-left mt-2">
                <div className="font-bold mr-2">Abilities: </div>
                {details?.abilities?.join(",")}
              </div>
              <div className="flex justify-left mt-2">
                <div className="font-bold mr-2">Some Moves: </div>{" "}
                <div className="overflow-x-scroll">
                  {details?.moves?.join(",")}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
