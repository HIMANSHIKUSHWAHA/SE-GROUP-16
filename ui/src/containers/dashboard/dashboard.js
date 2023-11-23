import React, { useState } from "react";
import Header from "../header";
import { faVideo, faRunning, faUtensils, faDumbbell, faCalendarCheck, faUser } from '@fortawesome/free-solid-svg-icons';
import CalendarView from "./CalendarViewComponent/CalendarView";
import SecondaryNavbar from "../secondaryNavbar";
import VideoSearch from "./VideoTab/videoSearchTab";
import ProfessionalSearch from "./ProfessionalsTab/professionalSearchTab";

// Content Area Component
const ContentArea = ({ activeContent }) => (
    <div className="ContentArea">
        {activeContent === 'videos' && <VideoSearch />}
        {activeContent === 'routines' && <CalendarView />}
        {activeContent === 'professionals' && <ProfessionalSearch />}
        {activeContent === 'workout-programs' && <p>workout programs data</p>}
        {activeContent === 'meal-plans' && <p>meal plans data</p>}
        {activeContent === 'custom-workouts' && <p>custom workouts data</p>}
        {activeContent === 'messages' && <p>messaging data</p>}
    </div>
);

// Dashboard Component
const Dashboard = () => {
  const [activeContent, setActiveContent] = useState('videos'); // Default content

  const navbarData = [
    {name: "Workout Videos",
     icon: faVideo,
     content: 'videos'
    },
    {name: "Workout Programs",
     icon: faRunning,
     content: 'workout-programs'
    },
    {name: "Meal Plans",
     icon: faUtensils,
     content: 'meal-plans'
    },
    {name: "Custom Workouts",
     icon: faDumbbell,
     content: 'workout-programs'
    },
    {name: "Routines",
     icon: faCalendarCheck,
     content: 'routines'
    },
      {name: "Professionals",
      icon: faUser,
      content: 'professionals'
    },
  ]
  return (
    <div>
      <Header auth={true} />
      <SecondaryNavbar data={navbarData} setActiveContent={setActiveContent}/>
      <ContentArea activeContent={activeContent} />
    </div>
  );
};

export default Dashboard;