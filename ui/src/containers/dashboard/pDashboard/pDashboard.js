import React, { useState } from "react";
import Header from "../../header";
import { faVideo, faRunning, faUtensils, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import UploadWorkoutVideo from "./uploadWorkoutVideo";
import UploadWorkoutRoutine from "./uploadWorkoutRoutine";
import UploadMealPlan from "./uploadMealPlan";
import PCalendar from "./pCalendar"


export default function PDashboard() {
    const [activeContent, setActiveContent] = useState('video');

    // console.log("THIS IS THE PROFESSIONAL DASHBOARD");
    const navbarData = [
        {
            name: "Upload Workout Videos",
            icon: faVideo,
            content: 'videos'
        },
        {
            name: "Upload Workout Routine",
            icon: faRunning,
            content: 'workout-routine'
        },
        {
            name: "Upload Meal Plan",
            icon: faUtensils,
            content: 'meal-plans'
        },
        {
            name: "Calendar", // Add calendar to the navbar
            icon: faCalendarAlt, // Use calendar icon
            content: 'calendar' // This should match the activeContent check
        }
    ]

    // make a get requist and get all the Tags
    const tags_list = ['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4', 'Tag 5', 'Tag 6'];


    return (
        <div>
            <Header auth={true} navbarData={navbarData} setActiveContent={setActiveContent} showMenu={true} />
            <div className="ContentArea">
                {activeContent === 'videos' && <UploadWorkoutVideo tags_list={tags_list} />}
                {activeContent === 'workout-routine' && <UploadWorkoutRoutine tags_list={tags_list} />}
                {activeContent === 'meal-plans' && <UploadMealPlan tags_list={tags_list} />}
                {activeContent === 'calendar' && <PCalendar />}
            </div>
        </div>
    )
}