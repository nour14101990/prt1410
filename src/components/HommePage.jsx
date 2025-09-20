import React, { useState, useEffect, useCallback, memo, useRef } from "react";
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, ExternalLink, Instagram, Sparkles } from "lucide-react";
import TriangulatedNetwork from './TriangulatedNetwork';
import CursorPointer from "./CursorPointer";

const Homme = () =>{
return (
<>  
 <motion.div
          className="fixed inset-0 bg-[#030014]">
<div className="relative min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-4xl mx-auto">
<motion.div className="text-center mb-6 sm:mb-8 md:mb-12">
  <div className="space-y-4"> 
    <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold">
      <div className="mb-2 sm:mb-4">
        <span data-aos="fade-right" data-aos-delay="200" className="inline-block px-2 bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
          Welcome
        </span>{' '}
        <span data-aos="fade-right" data-aos-delay="400" className="inline-block px-2 bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
          To
        </span>{' '}
        <span data-aos="fade-right" data-aos-delay="600" className="inline-block px-2 bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
          My
        </span>
      </div>
      <div>
        <span data-aos="fade-up" data-aos-delay="800" className="inline-block px-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Portfolio
        </span>{' '}
        <span data-aos="fade-up" data-aos-delay="1000" className="inline-block px-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Website
        </span>
      </div>
    </h1>

   
  </div>

 
</motion.div>
</div>
</div></motion.div>
</>
);
};

export default memo(Homme);