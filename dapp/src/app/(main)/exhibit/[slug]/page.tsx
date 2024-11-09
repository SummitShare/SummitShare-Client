'use client';
import SummitShareCanvas from '@/app/components/3DCanvas/3dCanvas';
import { data } from "./data"
import Buttons from '@/app/components/button/Butons';
import { X } from 'lucide-react';
import React, { useState } from 'react';

import { useRouter } from 'next/navigation';

// Fetch the data based on the slug
const getData = (slug: string) => {
   return data.find(
      (item) => item.title.toLowerCase().replace(/ /g, '-') === slug
   );
};

interface PageProps {
   params: { slug: string };
}

const Page = ({ params }: { params: { slug: string } }) => {
   const router = useRouter();
   const [currentIndex, setCurrentIndex] = useState(() =>
      data.findIndex(
         (item) => item.title.toLowerCase().replace(/ /g, '-') === params.slug
      )
   );

   const figure = data[currentIndex];

   if (!figure) {
      return <div>Figure not found</div>;
   }

   const handleBack = () => {
      if (currentIndex > 0) {
         setCurrentIndex(currentIndex - 1);
         window.scrollTo(0, 0);
      }
   };

   const handleNext = () => {
      if (currentIndex < data.length - 1) {
         setCurrentIndex(currentIndex + 1);
         window.scrollTo(0, 0);
      }
   };

   const handleClose = () => {
      router.push('/exhibit');
   };

   return (
      <div className="space-y-12 mx-6 my-28 lg:mx-[15%] relative">
         <button
            onClick={handleClose}
            className="absolute top-[-20px] right-0 text-brown-500 hover:text-brown-700"
            aria-label="Close and return to exhibit"
         >
            <X size={24} />
         </button>

         <h2>{figure.title}</h2>
         <article className="space-y-8 md:space-y-0 md:grid md:grid-cols-2 gap-6 w-full">
            <SummitShareCanvas>{figure.object_URL}</SummitShareCanvas>

            <ul className="flex flex-col gap-3">
               <h2>About the {figure.object_name}</h2>
               {figure.Object_description.map((desc, index) => (
                  <li key={index}>
                     <p>{desc}</p>
                  </li>
               ))}
            </ul>
         </article>

         <ul className="space-y-3">
            <h2>Biography</h2>
            <ul className="space-y-3">
               <li>
                  <ul className="space-y-4 ">
                     {figure.figure_details.map((desc, index) => (
                        <li key={index}>
                           <p className="text-primary-100">{desc}</p>
                        </li>
                     ))}
                  </ul>
               </li>
            </ul>
            {figure.figure_biography.map((bio, index) => (
               <li key={index}>
                  <p>{bio}</p>
               </li>
            ))}
         </ul>

         <div className="space-y-3">
            <h2>References</h2>
            <ul className="space-y-2">
               {figure.figure_references.map((refArray, index) => (
                  <li key={index}>
                     {refArray.map((ref, subIndex) => (
                        <a
                           key={subIndex}
                           href={ref}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="inline-block bg-white text-gray-800 border border-gray-300 rounded-full px-3 py-1 text-sm font-medium shadow-sm"
                        >
                           {ref}
                        </a>
                     ))}
                  </li>
               ))}
            </ul>
         </div>

         <div className="w-full rounded-[8px] bg-primary-50 space-y-4 px-[45px] py-6">
            <div className="space-y-2">
               <h3>Was this page informative?</h3>
               <p>Those who walked before us and those to come.</p>
            </div>

            <div className="flex flex-row gap-4">
               <div className="w-[73px]">
                  <Buttons type="primary" size="small">
                     Yes
                  </Buttons>
               </div>
               <div className="w-[73px]">
                  <Buttons type="secondary" size="small">
                     No
                  </Buttons>
               </div>
            </div>
         </div>

         <div className="space-y-4 md:flex md:flex-row md:gap-4 md:space-y-0">
            <Buttons
               type="secondary"
               active={currentIndex > 0}
               onClick={handleBack}
               disabled={currentIndex === 0}
            >
               Back
            </Buttons>
            <Buttons
               type="primary"
               active={currentIndex < data.length - 1}
               onClick={handleNext}
               disabled={currentIndex === data.length - 1}
            >
               Next
            </Buttons>
         </div>
      </div>
   );
};

export default Page;
