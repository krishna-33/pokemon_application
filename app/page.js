'use client';

import React, { useEffect, useState } from 'react';
import Loader from '@/components/Loader';
import Image from 'next/image';
import Link from 'next/link';
import useFetchData from '@/hooks/useFetch';

export default function Home() {
  const [types, setTypes] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedUrl, setSelectedUrl] = useState('');
  const [pokemons, setPokemons] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const {data, loading} = useFetchData('https://pokeapi.co/api/v2/type')
  useEffect(() => {
    const fetchType = () => {
      if(data?.results){
        setTypes(data.results);
      }
    }
    fetchType();
  }, [data]);

  const fetchPokemons = async () => {
    try{
    setIsLoading(true);
    let result = [];
    const res = await fetch(
      selectedUrl ? selectedUrl : 'https://pokeapi.co/api/v2/pokemon'
    );
    const data = await res.json();
    result = data.results;

    if (selectedUrl) {
      result = data.pokemon.map((item) => ({
        name: item.pokemon.name,
        url: item.pokemon.url,
      }));
    }
    const pokemonPromises = result.map((item) =>
      fetch(item.url).then((res) => res.json())
    );
    Promise.all(pokemonPromises).then((pokrmonData) => {
      const pokemonList = pokrmonData.map((pokemon) => {
        return {
        name: pokemon.name,
        id: pokemon.location_area_encounters.split("/")[pokemon.location_area_encounters.split("/").length - 2],
        image:
          pokemon.sprites?.front_default || pokemon.sprites?.back_default || '',
      }
    });
      setPokemons(pokemonList);
      setIsLoading(false);
    });
  }
  catch(err){
    console.log(err);
    setIsLoading(false);
  }
  };
  useEffect(() => {
    fetchPokemons();
  }, [selectedUrl]);

  const handleSearch = () => {
    if (search) {
      setIsLoading(true);
      const filterData = pokemons.filter((pokemon) =>
        pokemon.name.includes(search)
      );
      setPokemons(filterData);
      setIsLoading(false);
    } else {
      fetchPokemons();
    }
  };
  return (
    <>
      <div className={`container mx-auto p-4 ${loading || isloading ? "min-h-screen flex justify-center items-center" : ""}`}>
        {
          loading || isloading ? <Loader />
           :
        <>
        <select
          className="w-full px-3 py-2 rounded-md shadow-sm"
          value={selectedType}
          onChange={(e) => {
            setSelectedType(e.target.value);
            const selectType = types.find(
              (type) => type.name === e.target.value
            );
            setSelectedUrl(selectType.url);
          }}
        >
          <>
            <option value="">Select Type</option>
            {types.map((type) => (
              <option key={type.name} value={type.name}>
                {type.name}
              </option>
            ))}
          </>
        </select>
        <div className="flex items-center space-x-0 pt-3">
          <div className="relative w-80">
            <input
              type="text"
              placeholder="Search..."
              className="p-2 pl-10 w-full border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0z"
              />
            </svg>
          </div>

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-3 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-5">
          {pokemons.map((pokemon, index) => (
            
            <div key={pokemon.name + index} className="max-w-sm rounded overflow-hidden shadow-lg">
               <div className='flex justify-center'>
               <Image
                src={pokemon.image}
                alt={pokemon.name}
                width={200}
                height={200}
              />
              </div>
            <div className='bg-gray-100'>
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">{pokemon.name}</div>
            </div>
            <div className="px-6 pt-8 pb-2">
            <Link
                  href={`/details/${pokemon.id}`}
                  className="hover:underline text-blue-500"
                >
                  Details →
                </Link>
            </div>
            </div>
        </div>
          ))}
        </div>
        </> }
      </div>
     
    </>
  );
}
