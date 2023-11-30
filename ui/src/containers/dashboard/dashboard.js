import React, { useState } from "react";
import Header from "../header";
import {
    faVideo,
    faRunning,
    faUtensils,
    faDumbbell,
    faCalendarCheck,
    faUser,
    faCamera
} from '@fortawesome/free-solid-svg-icons';
import CalendarView from "./CalendarViewComponent/CalendarView";
import SecondaryNavbar from "../secondaryNavbar";
import VideoSearch from "./VideoTab/videoSearchTab";
import ProfessionalSearch from "./ProfessionalsTab/professionalSearchTab";
import MessagingWindow from "./MessagingWindow/MessagingWindow";
import LiveSessions from "./LiveSessionsTab/LiveSessions";
import MealPlansTab from "./MealPlansTab/MealPlansTab";
import ExercisePlanSearch from "./ExerciseTab/ExercisePlanSearch";
// Content Area Component
const ContentArea = ({ activeContent }) => (
    <div className="ContentArea">
        {activeContent === 'videos' && <VideoSearch />}
        {activeContent === 'routines' && <CalendarView />}
        {activeContent === 'professionals' && <ProfessionalSearch />}
        {activeContent === 'workout-programs' && <ExercisePlanSearch/>}
        {activeContent === 'meal-plans' && <MealPlansTab/>}
        {activeContent === 'messages' && <p>messaging data</p>}
        {activeContent === 'livesessions' && <LiveSessions/>}
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
    {name: "Routines",
     icon: faCalendarCheck,
     content: 'routines'
    },
      {name: "Professionals",
      icon: faUser,
      content: 'professionals'
    },
      {name: "Live Sessions",
      icon: faCamera,
      content: 'livesessions'}
  ]
  return (
    <div>
      <Header auth={true} />
      <SecondaryNavbar data={navbarData} setActiveContent={setActiveContent}/>
      <ContentArea activeContent={activeContent} />
        <MessagingWindow />
    </div>
  );
};

export default Dashboard;