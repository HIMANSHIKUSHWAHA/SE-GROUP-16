import React, { useState, useContext, useEffect } from "react";
import Header from "../header";
import { faVideo, faRunning, faUtensils, faDumbbell, faCalendarCheck, faCamera, faUser } from '@fortawesome/free-solid-svg-icons';
import CalendarView from "./CalendarViewComponent/CalendarView";
import {VideoSearch, VideoCard} from "./VideoTab/videoSearchTab";
import { ExercisePlanSearch, ExerciseCard } from "./ExerciseTab/ExercisePlanSearch";
import ProfessionalSearch from "./ProfessionalsTab/professionalSearchTab";
import MessagingWindow from "./MessagingWindow/MessagingWindow";
import LiveSessions from "./LiveSessionsTab/LiveSessions";
import { MealPlansSearch, MealCard } from "./MealPlansTab/MealPlansTab";
import Recommendaton from "./recommendation/Recommendation";
import { UserContext } from "../../context";


// Content Area Component
const ContentArea = ({ activeContent }) => {
  return (
    <div className="ContentArea">
      {activeContent === 'videos' && <VideoSearch />}
      {activeContent === 'routines' && <CalendarView />}
      {activeContent === 'professionals' && <ProfessionalSearch />}
      {activeContent === 'workout-programs' && <ExercisePlanSearch />}
      {activeContent === 'meal-plans' && <MealPlansSearch />}
      {activeContent === 'livesessions' && <LiveSessions />}
      {activeContent === 'recommendation' && <Recommendaton />}
    </div>
  )
};

// Dashboard Component
const Dashboard = () => {
  const [activeContent, setActiveContent] = useState("videos");
  const { user } = useContext(UserContext);

  useEffect(() => {
    console.log("-----", activeContent);
  }, []);

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
      name: "Recommendations",
      icon: faDumbbell,
      content: 'recommendation'
    },
    {
      name: "Routines",
      icon: faCalendarCheck,
      content: 'routines'
    },
    {
      name: "Professionals",
      icon: faUser,
      content: 'professionals'
    },
    {
      name: "Live Sessions",
      icon: faCamera,
      content: 'livesessions'
    }
  ]


  return (
    <div>
      <Header auth={true} navbarData={navbarData} setActiveContent={setActiveContent} activeContent={activeContent} />
      <ContentArea activeContent={activeContent} />
      <MessagingWindow />
    </div>
  );
};

export default Dashboard;