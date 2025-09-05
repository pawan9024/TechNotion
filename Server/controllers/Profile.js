const { findById } = require("../models/Course");
const Profile = require("../models/Profile");
const User = require("../models/User");
const Course = require("../models/Course")
const CourseProgress = require("../models/CourseProgress")
const {uploadImageToCloudinary} = require("../utils/imageUploader");
const mongoose = require("mongoose")
const { convertSecondsToDuration } = require("../utils/secToDuration")

// exports.updateProfile = async (req,res)=>{
//     try{
//         // get data
//          const {dateOfBirth="", about="", contactNumber, gender} = req.body;
//         // get userId
//         const id = req.user.id;
//         // validation
//         if(!contactNumber || !gender || !id){
//             return res.status(400).json({
//                  success:false,
//                  message:'All fields are required',
//             });
//         }
//         // find profile
//         const userDetails = await User.findById(id);
//         const profileId = userDetails.addtionalDetails;
//         const profileDetails = await Profile.findById(profileId);

//         // update profile
//         profileDetails.dateOfBirth = dateOfBirth;
//         profileDetails.about = about;
//         profileDetails.gender = gender;
//         profileDetails.contactNumber = contactNumber;
//         await profileDetails.save();

//         // return response
//         return res.status(200).json({
//             success:true,
//             message:'Profile Updated Successfully',
//             profileDetails,
//        });
//     }
//     catch(error){
//         return res.status(400).json({
//             success:false,
//             error: error.message,
//        });
//     }
// };




// Delete Account funtion 
// Explore ->>> how can we  schedule this deletion

// exports.updateProfile = async (req, res) => {
//   try {
//     const {
//       firstName = "",
//       lastName = "",
//       dateOfBirth = "",
//       about = "",
//       contactNumber = "",
//       gender = "",
//     } = req.body
//     const id = req.user.id

//     // Find the profile by id
//     const userDetails = await User.findById(id)
//     const profile = await Profile.findById(userDetails.additionalDetails)

//     const user = await User.findByIdAndUpdate(id, {
//       firstName,
//       lastName,
//     })
//     await user.save()

//     // Update the profile fields
//     profile.dateOfBirth = dateOfBirth
//     profile.about = about
//     profile.contactNumber = contactNumber
//     profile.gender = gender

//     // Save the updated profile
//     await profile.save()

//     // Find the updated user details
//     const updatedUserDetails = await User.findById(id)
//       .populate("additionalDetails")
//       .exec()

//     return res.json({
//       success: true,
//       message: "Profile updated successfully",
//       updatedUserDetails,
//     })
//   } catch (error) {
//     console.log(error)
//     return res.status(500).json({
//       success: false,
//       error: error.message,
//     })
//   }
// }
exports.updateProfile = async (req, res) => {
  try {
    const {
      firstName = "",
      lastName = "",
      dateOfBirth = "",
      about = "",
      contactNumber = "",
      gender = "",
    } = req.body
    const id = req.user.id

    // Find the user
    const userDetails = await User.findById(id)

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // If user has no profile yet, create one
    let profile
    if (!userDetails.additionalDetails) {
      profile = await Profile.create({
        dateOfBirth,
        about,
        contactNumber,
        gender,
      })
      userDetails.additionalDetails = profile._id
      userDetails.firstName = firstName
      userDetails.lastName = lastName
      await userDetails.save()
    } else {
      // Update existing profile
      profile = await Profile.findById(userDetails.additionalDetails)
      profile.dateOfBirth = dateOfBirth
      profile.about = about
      profile.contactNumber = contactNumber
      profile.gender = gender
      await profile.save()

      // Update user basic info
      userDetails.firstName = firstName
      userDetails.lastName = lastName
      await userDetails.save()
    }

    // Populate updated user details
    const updatedUserDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec()

    return res.json({
      success: true,
      message: "Profile updated successfully",
      updatedUserDetails,
    })
  } catch (error) {
    console.log("UPDATE_PROFILE ERROR: ", error)
    return res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}


exports.deleteAccount = async (req,res)=>{
    try{
        // get id
        const id = req.user.id;
        // validation
        const userDetails = await User.findById({_id:id});
        if(!userDetails){
            return res.status(404).json({
                success:false,
                message:'User not found',
            });
        }
        // delete profile 
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});
        // TODO: HW unenroll user from all enrolled courses
        // delete user
        await User.findByIdAndDelete({_id:id});
        
        // return response
        return res.status(200).json({
            success:true,
            message:'User Deleted Successfully' ,
        });
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:'User cannot be deleted successfully',
        });
    }
}


 
exports.getAllUserDetails = async (req,res)=>{

    try{
        // get id
        const id = req.user.id;
        // validation and get user details
        const userDetails = await User.findById(id).populate("additionalDetails").exec();
        // return response
        return res.status(200).json({
            success:true,
            message:'User Data fetched successfully',
            data:userDetails,
        });
    }

    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
  
}




exports.updateDisplayPicture = async (req, res) => {
    try {
      const displayPicture = req.files.displayPicture
      const userId = req.user.id
      const image = await uploadImageToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
      )
      console.log(image)
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { image: image.secure_url },
        { new: true }
      )
      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};
  


// exports.getEnrolledCourses = async (req, res) => {
//     try {
//       const userId = req.user.id
//       const userDetails = await User.findOne({
//         _id: userId,
//       })
//         .populate("courses")
//         .exec()
//       if (!userDetails) {
//         return res.status(400).json({
//           success: false,
//           message: `Could not find user with id: ${userDetails}`,
//         })
//       }
//       return res.status(200).json({
//         success: true,
//         data: userDetails.courses,
//       })
//     } catch (error) {
//       return res.status(500).json({
//         success: false,
//         message: error.message,
//       })
//     }
// };

exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id
    let userDetails = await User.findOne({
      _id: userId,
    })
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        },
      })
      .exec()
    userDetails = userDetails.toObject()
    var SubsectionLength = 0
    for (var i = 0; i < userDetails.courses.length; i++) {
      let totalDurationInSeconds = 0
      SubsectionLength = 0
      for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
        totalDurationInSeconds += userDetails.courses[i].courseContent[
          j
        ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
        userDetails.courses[i].totalDuration = convertSecondsToDuration(
          totalDurationInSeconds
        )
        SubsectionLength +=
          userDetails.courses[i].courseContent[j].subSection.length
      }
      let courseProgressCount = await CourseProgress.findOne({
        courseID: userDetails.courses[i]._id,
        userId: userId,
      })
      courseProgressCount = courseProgressCount?.completedVideos.length
      if (SubsectionLength === 0) {
        userDetails.courses[i].progressPercentage = 100
      } else {
        // To make it up to 2 decimal point
        const multiplier = Math.pow(10, 2)
        userDetails.courses[i].progressPercentage =
          Math.round(
            (courseProgressCount / SubsectionLength) * 100 * multiplier
          ) / multiplier
      }
    }

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userDetails}`,
      })
    }
    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.instructorDashboard = async (req, res) => {
  try {
    const courseDetails = await Course.find({ instructor: req.user.id })

    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studentEnrolled.length
      const totalAmountGenerated = totalStudentsEnrolled * course.price

      // Create a new object with the additional fields
      const courseDataWithStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        // Include other course properties as needed
        totalStudentsEnrolled,
        totalAmountGenerated,
      }

      return courseDataWithStats
    })

    res.status(200).json({ courses: courseData })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server Error" })
  }
}









