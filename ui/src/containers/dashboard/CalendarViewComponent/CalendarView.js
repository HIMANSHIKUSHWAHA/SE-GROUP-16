import React, { useEffect, useState } from 'react';
import {
    Container,
    Grid,
    CardContent,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getReq } from '../../../services/api';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const generateWeekDates = (today) => {
    const currentDayIndex = today.getDay() || 7; // Make Sunday index 7
    return daysOfWeek.map((day, index) => {
        const difference = index + 1 - currentDayIndex;
        const dayDate = new Date(today);
        dayDate.setDate(today.getDate() + difference);
        return {
            day,
            date: dayDate.getDate(),
            month: dayDate.getMonth() + 1,
        };
    });
};

// BASE CARD FOR EVENTS
const TaskCard = ({ title, content }) => (
    <Accordion sx={{ marginBottom: 2 }}>
        <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
        >
            <Typography variant="h6">{title}</Typography>
        </AccordionSummary>
        <AccordionDetails>
            <CardContent>
                {content}
            </CardContent>
        </AccordionDetails>
    </Accordion>
);

// COLUMN FOR EACH DAY OF CALENDAR
const DayColumn = ({ day, date, month, isToday, dayData }) => {
    const meals = dayData?.meals;
    const exercises = dayData?.exercises?.exercises;

    return (
        <Grid
            item
            key={day}
            xs
            style={{
                minWidth: '150px',
                backgroundColor: isToday ? '#f8d7da' : 'transparent',
                borderRadius: '10px',
                padding: '10px',
            }}
        >
            <Typography
                variant="h6"
                align="center"
                style={{
                    backgroundColor: '#4a90e2',
                    color: '#ffffff',
                    padding: '10px',
                    borderRadius: '5px',
                    marginBottom: '20px',
                }}
            >
                {day} <br /> {month}/{date}
            </Typography>

            {/* Sleep Data */}
            <TaskCard
                title="Sleep"
                content={
                    <Typography variant="body2">
                        Start Time: {dayData.sleep.startTime} <br />
                        End Time: {dayData.sleep.endTime} <br />
                        Total Hours: {dayData.sleep.totalHours}
                    </Typography>
                }
            />

            {/* Meal Plan Data */}
            {meals && (
                <TaskCard
                    title="Meal Plan"
                    content={
                        <>
                            <Typography variant="body2">
                                <strong>Breakfast:</strong> {meals.breakfast.mealItems.join(', ')} <br />
                                Calories: {meals.breakfast.calories} | Carbs: {meals.breakfast.carbs} | Proteins: {meals.breakfast.proteins} | Fats: {meals.breakfast.fats}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Lunch:</strong> {meals.lunch.mealItems.join(', ')} <br />
                                Calories: {meals.lunch.calories} | Carbs: {meals.lunch.carbs} | Proteins: {meals.lunch.proteins} | Fats: {meals.lunch.fats}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Dinner:</strong> {meals.dinner.mealItems.join(', ')} <br />
                                Calories: {meals.dinner.calories} | Carbs: {meals.dinner.carbs} | Proteins: {meals.dinner.proteins} | Fats: {meals.dinner.fats}
                            </Typography>
                            <Typography variant="body2">
                                Total Daily Intake: Calories: {meals.calories} | Carbs: {meals.carbs} | Proteins: {meals.proteins} | Fats: {meals.fats}
                            </Typography>
                        </>
                    }
                />
            )}

            {/* Exercise Plan Data */}
            {exercises && exercises.length > 0 ? (
                <TaskCard
                    title="Exercises"
                    content={
                        <ul>
                            {exercises.map((exercise, index) => (
                                <li key={index}>
                                    <strong>{exercise.title}</strong> <br />
                                    Description: {exercise.description} <br />
                                    Reps: {exercise.reps} | Sets: {exercise.sets} <br />
                                    Reference Video: <a href={exercise.referenceVideo} target="_blank">Watch Here</a>
                                </li>
                            ))}
                        </ul>
                    }
                />
            ) : (
                <Typography variant="body2">No Exercises Planned</Typography>
            )}
        </Grid>
    );
};

// WEEKLY CALENDAR COMPONENT
const WeeklyCalendar = () => {
    const today = new Date();
    const weekDates = generateWeekDates(today);
    const [calendarData, setCalendarData] = useState({});

    useEffect(() => {
        const userId = localStorage.getItem("UserId");
        const params = { userId: userId };
        const headers = {};
        getReq('/dashboard/calendar_data', headers, params)
            .then(response => {
                setCalendarData(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the calendar data!", error);
            });
    }, []);

    return (
        <Container style={{ backgroundColor: '#E0F7FA', padding: '40px', borderRadius: '10px', maxWidth: '90%' }}>
            {Object.keys(calendarData).length > 0 ? (
                <Grid container spacing={4} justifyContent="center" style={{ overflowX: 'auto' }}>
                    {weekDates.map(({ day, date, month }, index) => (
                        <DayColumn
                            key={day}
                            day={day}
                            date={date}
                            month={month}
                            isToday={today.getDate() === date && today.getMonth() + 1 === month}
                            dayData={calendarData[day]}
                        />
                    ))}
                </Grid>
            ) : (
                <Typography variant="h6" align="center">Loading...</Typography>
            )}
        </Container>
    );
};

export default WeeklyCalendar;