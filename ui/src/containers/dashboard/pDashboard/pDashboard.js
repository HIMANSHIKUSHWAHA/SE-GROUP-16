import React, { useState } from "react";
import Header from "../../header";
import { faVideo, faRunning, faUtensils} from '@fortawesome/free-solid-svg-icons';
import SecondaryNavbar from "../../secondaryNavbar";
import UploadWorkoutVideo from "./uploadWorkoutVideo";
import UploadWorkoutRoutine from "./uploadWorkoutRoutine";
// import UploadMealPlan from "./uploadMealPlan";
import UploadMealPlan from "./mealPlan";


export default function PDashboard() {
    const [activeContent, setActiveContent] = useState('video');
    
    const navbarData = [
        {name: "Upload Workout Videos",
         icon: faVideo,
         content: 'videos'
        },
        {name: "Upload Workout Routine",
         icon: faRunning,
         content: 'workout-routine'
        },
        {name: "Upload Meal Plan",
         icon: faUtensils,
         content: 'meal-plans'
        }
    ]

    // make a get requist and get all the Tags
    const tags_list = ['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4', 'Tag 5', 'Tag 6'];


    return (
        <div>
            <Header auth={true} />
            <SecondaryNavbar data={navbarData} setActiveContent={setActiveContent} />
            <div className="ContentArea">
                {activeContent === 'videos' && <UploadWorkoutVideo tags_list={tags_list}/>}
                {activeContent === 'workout-routine' && <UploadWorkoutRoutine tags_list={tags_list}/>}
                {activeContent === 'meal-plans' && <UploadMealPlan tags_list={tags_list}/>}
            </div>
        </div>
    )
}