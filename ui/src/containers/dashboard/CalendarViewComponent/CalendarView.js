import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Grid,
    Card,
    CardContent,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Button,
    Box
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EventNoteIcon from '@mui/icons-material/EventNote'; // Example icon for calendar
import { getReq } from '../../../services/api';
import { UserContext } from '../../../context';


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
const TaskCard = ({ title, content, session }) => {
    const navigate = useNavigate();
    let isJoinTime = false;
    // console.log("Session:", session);

    if (session) {
        const now = new Date();
        const startTime = new Date(session.date);
        const durationInMilliseconds = session.duration * 60000;
        const endTime = new Date(startTime.getTime() + durationInMilliseconds);
        isJoinTime = now >= new Date(startTime.getTime() - 15 * 60000) && now <= endTime;
        console.log(startTime, endTime);
    }

    const handleStartSession = () => {
        navigate('/meet'); // Adjust this route as needed
    };

    return (
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
                    {isJoinTime && session && (
                        <Button variant="contained" color="primary" onClick={handleStartSession}>
                            Join Session
                        </Button>
                    )}
                </CardContent>
            </AccordionDetails>
        </Accordion>
    );
};
// COLUMN FOR EACH DAY OF CALENDAR
const DayColumn = ({ day, date, month, isToday, dayData, events }) => {
    const meals = dayData?.meals;
    const exercises = dayData?.exercises?.exercises;
    const sleep = dayData?.sleep;

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

            {events && events.length > 0 && (
                events.map((event, index) => (
                    <TaskCard
                        key={index}
                        title={event.title}
                        content={
                            <Typography variant="body2">
                                Description: {event.description} <br />
                                Date: {new Date(event.date).toLocaleString()} <br />
                                Tags: {event.tags.join(', ')}
                            </Typography>
                        }
                        session={event}
                    />
                ))
            )}

            {/* Sleep Data */}

            <TaskCard
                title="Sleep"
                content={
                    <Typography variant="body2">
                        Start Time: {sleep.startTime} <br />
                        End Time: {sleep.endTime} <br />
                        Total Hours: {sleep.totalHours}
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
    const [events, setEvents] = useState({});
    const { user } = useContext(UserContext);

    useEffect(() => {
        const params = { userId: user.id, role: user.role };
        const headers = {};
        getReq('/dashboard/calendar_data', headers, params)
            .then(response => {

                setCalendarData(response.data.data);
                setEvents(response.data.events);
                console.log("Events Data:", response.data.events);
            })
            .catch(error => {
                console.error("There was an error fetching the calendar data!", error);
            });
    }, [user.id, user.role]);

    return (
        <Container style={{ backgroundColor: '#E0F7FA', padding: '40px', borderRadius: '10px', maxWidth: '90%' }}>
            <Box display="flex" alignItems="center" sx={{ mb: 4 }}>
                <EventNoteIcon sx={{ fontSize: { xs: '2rem', sm: '2.5rem' }, mr: 1 }} />
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        flexGrow: 1,
                        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)'
                    }}
                >
                    Weekly Calendar
                </Typography>
            </Box>

            {Object.keys(calendarData).length > 0 ? (
                <Grid container spacing={4} justifyContent="center" style={{ overflowX: 'auto' }}>
                    {weekDates.map(({ day, date, month }, index) => {
                        const formattedDate = `${new Date().getFullYear()}-${month.toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`;
                        const eventsForDay = events.filter(event => {
                            const eventDate = new Date(event.date).toISOString().split('T')[0];
                            return eventDate === formattedDate;
                        });
                        console.log(events[0], "   ", eventsForDay);
                        return (
                            <DayColumn
                                key={day}
                                day={day}
                                date={date}
                                month={month}
                                isToday={today.getDate() === date && today.getMonth() + 1 === month}
                                dayData={calendarData[day]}
                                events={eventsForDay}
                            />
                        )
                    })}
                </Grid>
            ) : (
                <Typography variant="h6" align="center">Loading...</Typography>
            )}
        </Container>
    );
};

export default WeeklyCalendar;