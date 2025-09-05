import React from 'react'
import { useForm } from 'react-hook-form';
import IconBtn from '../../../../common/IconBtn';
import { useState } from 'react';
import { GoPlusCircle } from "react-icons/go";
import { useDispatch, useSelector } from 'react-redux';
import { GrFormNextLink } from "react-icons/gr";
import NestedView from './NestedView';
import { updateSection } from '../../../../../services/operations/courseDetailsAPI';
import { createSection } from '../../../../../services/operations/courseDetailsAPI';
import { setCourse } from '../../../../../slices/courseSlice';
import { setStep } from '../../../../../slices/courseSlice';
import { setEditCourse } from '../../../../../slices/courseSlice';
import {toast} from 'react-hot-toast';
import { useEffect } from 'react';




const CourseBuilderForm = () => {
     

  const {register,handleSubmit, setValue, formState:{errors}}=useForm();
  const [editSectionName,setEditSectionName]=useState(null);
  const {course}=useSelector((state)=>state.course)
  const dispatch=useDispatch();
  const {token}=useSelector((state)=>state.auth);
  const [loading,setLoading]=useState(false);



  const onSubmit=async (data)=>{
    setLoading(true);
    let result;

    if(editSectionName){
      //we re editing the section name
      result=await updateSection(
        {
          sectionName:data.sectionName,
          sectionId: editSectionName,
          courseId:course._id,

        },token
      )
     
    }

    else{
      result=await createSection({
        sectionName:data.sectionName,
        courseId:course._id,
      },token)
    }
     console.log("create section response:",result)
    //update values
    if(result){
      dispatch(setCourse(result));
      setEditSectionName(null);
      setValue("sectionName","");
    }

    //loading false
    setLoading(false);

  }


  const cancelEdit=()=>{
    setEditSectionName(null);
    setValue("sectionName","");
  }

  const goBack=()=>{
     dispatch(setStep(1));
     dispatch(setEditCourse(true));
  }

  const goToNext=()=>{
    if(course?.courseContent?.length === 0){
      toast.error("please add atleast one section");

      return;
    }

    if(course.courseContent.some((section)=>section.subSection.length === 0)){
      toast.error("Please add atleast one lecturw in each seciton");
      return ;
    }

    //if everything is good
    console.log("next page clicked")
    dispatch(setStep(3));
  }

  const handleChangeEditSectionName=(sectionId,sectionName)=>{

    if(editSectionName === sectionId){
      cancelEdit();
      return;
    }

    setEditSectionName(sectionId);
    setValue("sectionName",sectionName);
  }

  return (
 <div className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="text-2xl font-semibold text-richblack-5">Course Builder</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5" htmlFor="sectionName">
            Section Name <sup className="text-pink-200">*</sup></label>
          <input
          id='sectionName'
          placeholder='Add Section name'
          {...register("sectionName",{required:true})}
          className='w-full form-style '
          />
            {errors.sectionName && (
            <span>Section Name is required</span>
          )}
        </div>

          <div className="flex items-end gap-x-4">
           <IconBtn
            type="Submit"
            text={editSectionName ? "Edit Section Name" : "Create Section"}
            outline={true}
            customClasses={"text-white"} 

           >
      <GoPlusCircle className='text-yellow-50' size={20}/>
           </IconBtn>
           {editSectionName && (
            <button
            type='button'
            onClick={cancelEdit}
            className='text-sm text-richblack-300 underline'
            >
              Cancel Edit
            </button>
           )}
        </div>
       </form>
       
       {course?.courseContent?.length>0 && (
        <NestedView handleChangeEditSectionName={handleChangeEditSectionName}/>
       )}

       <div className='flex justify-end gap-x-3'>
         <button 
         onClick={goBack}
         className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}>
            Back
         </button>

         <IconBtn text="Next" onClick={goToNext()}>
           <GrFormNextLink />
         </IconBtn>
       </div>
       

    </div>
  )
}

export default CourseBuilderForm