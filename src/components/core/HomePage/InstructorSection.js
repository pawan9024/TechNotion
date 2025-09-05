import React from "react";
import Instructor from "../../../assets/Images/Instructor2.png"
import HighlightText from "../HomePage/HighlightText"
import CTAButton from "../HomePage/Button"
import {FaArrowRight} from 'react-icons/fa'

const InstructorSection = ()=>{
    return (
        <div className="mt-16">
            <div className="flex flex-row gap-20 items-center">
             
             <div className="w-[50%] shadow-[0_0_20px_0] shadow-[#FC6767] rounded overflow-hidden">
                <img 
                src={Instructor}
                alt="Instructorimage"
                className="shadow-white"/>
             </div>

             <div className="w-[50%] flex flex-col gap-10">
                <div className="text-4xl font-semibold w-[50%]">
                    Become an
                    <HighlightText text={ " Instructor"}/>
                </div>
                <p className="font-medium text-[16px] w-[80%] text-richblack-300">
                    Instructor from around the world teach millions of student on StudyNotion.
                    We provide the tools and skills to teach what you love.
                </p>

                  <div className="w-fit">
                     
                  <CTAButton active={true} linkto={"/signup"}>
                <div className="flex flex-row gap-2 items-center">
                       Start Learning Today
                       <FaArrowRight/>
                </div>

                </CTAButton>


                  </div>
                

             </div>


            </div>
        </div>
    )
}

export default InstructorSection