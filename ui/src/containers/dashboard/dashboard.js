import React, { useState } from "react";
import Header from "../header";
import FilterSearchSection from "../searchbar";
import { faVideo, faRunning, faUtensils, faDumbbell, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';
import CalendarView from "./CalendarViewComponent/CalendarView";
import MediaCard from "./videoCards";
import SecondaryNavbar from "../secondaryNavbar";


// Content Area Component
const ContentArea = ({ activeContent }) => (
  <div className="ContentArea">
    {activeContent === 'videos' && <MediaCard />}
    {activeContent === 'routines' && <CalendarView />}
    {activeContent === 'workout-programs' && <p>workout programs data</p>}
    {activeContent === 'meal-plans' && <p>meal plans data</p>}
    {activeContent === 'custom-workouts' && <p>custom workouts data</p>}
  </div>
);

// Dashboard Component
const Dashboard = () => {
  const [activeContent, setActiveContent] = useState('videos'); // Default content

  const navbarData = [
    {
      name: "Workout Videos",
      icon: faVideo,
      content: 'videos'
    },
    {
      name: "Workout Programs",
      icon: faRunning,
      content: 'workout-programs'
    },
    {
      name: "Meal Plans",
      icon: faUtensils,
      content: 'meal-plans'
    },
    {
      name: "Custom Workouts",
      icon: faDumbbell,
      content: 'workout-programs'
    },
    {
      name: "Routines",
      icon: faCalendarCheck,
      content: 'routines'
    }
  ]
  return (
    <div>
      <Header auth={true} navbarData={navbarData} setActiveContent={setActiveContent} />
      <FilterSearchSection />
      <ContentArea activeContent={activeContent} />
    </div>
  );
};

export default Dashboard;