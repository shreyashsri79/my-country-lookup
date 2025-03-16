"use client"
import React, { useState, useEffect } from 'react';
import dice from "../assets/dice.png";
import Image from 'next/image';

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selected, setSelected] = useState(-1);
    const [suggested, setSuggested] = useState<string[]>([]);
    const [countries, setCountries] = useState<string[]>([]);
    const [inputChanged, setInputChanged] = useState(true); 

 
    useEffect(() => {
        async function fetchCountries() {
            try {
                const res = await fetch("https://restcountries.com/v3.1/all");
                const json: { name: { common: string } }[] = await res.json();  // Define type
                const countryNames = json.map((country) => country.name.common);
                setCountries(countryNames);
            } catch (error) {
                console.error("Error fetching country list:", error);
            }
        }
        fetchCountries();
    }, []);
    

    useEffect(() => {
        if (inputChanged && searchTerm.trim() !== "") {
            const filteredData = countries.filter((item) =>
                item.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setSuggested(filteredData.slice(0, 5)); 
        }
    }, [searchTerm, countries, inputChanged]);


    function randomCountry() {
        return countries.length ? countries[Math.floor(Math.random() * countries.length)] : "";
    }

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "ArrowDown") {
            setSelected((prev) => {
                const newSelected = Math.min(prev + 1, suggested.length - 1);
                setSearchTerm(suggested[newSelected] || searchTerm);
                setInputChanged(false); 
                return newSelected;
            });
        }
        if (e.key === "ArrowUp") {
            setSelected((prev) => {
                const newSelected = Math.max(prev - 1, 0);
                setSearchTerm(suggested[newSelected] || searchTerm);
                setInputChanged(false); 
                return newSelected;
            });
        }
        if (e.key === "Enter" && searchTerm.trim() !== "") {
            window.location.href = `/${searchTerm}`;
        }
    };

    return (
        <div className='flex-wrap'>
            <div className="flex items-center gap-4 mt-6">
                <input
                    type="text"
                    placeholder='Country Name'
                    className='sm:w-lg w-xs p-5 bg-amber-50 rounded-xl opacity-50 text-black'
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setSelected(-1);
                        setInputChanged(true); 
                    }}
                    onKeyDown={handleKeyDown}
                />
                <button
                    className="p-3 bg-white/80 hover:bg-white transition rounded-lg shadow-lg opacity-50"
                    onClick={async () => {
                        const random = randomCountry();
                        if (random) {
                            window.location.href = `/${random}`;
                        }
                    }}
                >
                    <Image src={dice} alt="Random Country" className="w-8 h-8" />
                </button>
            </div>

            <ul className="w-xs sm:w-lg mt-2 bg-amber-50 rounded-xl opacity-50 text-black">
                {suggested.map((item, index) => (
                    <li key={index} className={`p-4 hover:bg-gray-100 rounded-xl ${index === selected ? 'bg-gray-200' : ''}`}>
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SearchBar;
