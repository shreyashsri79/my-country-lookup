import React from 'react';
import Image from "next/image";
import hero_bg from "../assets/hero_bg.jpg";
import SearchBar from './SearchBar';


const Hero = () => {
  

  return (
    <div className="relative h-[75vh] w-screen">
      {/* Background Image */}
      <Image 
        src={hero_bg} 
        alt="Hero Background" 
        className="absolute top-0 left-0 w-full h-full object-cover blur-sm"
      />
      
      

      {/* Content */}
      <div className="relative flex flex-col items-center justify-center h-full w-full text-center">
        <h1 className="text-4xl sm:text-6xl font-bold text-white drop-shadow-lg ">
          Explore Countries
        </h1>
        
        <div className='py-10'>
          <SearchBar  />
        </div>
      </div>
    </div>
  );
}

export default Hero;
