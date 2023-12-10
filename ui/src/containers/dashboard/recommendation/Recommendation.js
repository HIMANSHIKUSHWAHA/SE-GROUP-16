// Use these separated cards for the representation here
// Create a script to just populate the database

import React, { useEffect, useState } from "react";
import { ExercisePlanSearch, ExpandableExerciseCard } from "../ExerciseTab/ExercisePlanSearch"
import {VideoSearch, VideoCard} from "../VideoTab/videoSearchTab" 
import { MealPlansSearch, ExpandableMealCard } from "../MealPlansTab/MealPlansTab"

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import data from "./data.json";

export default function Recommendaton (props){
    const [formData, setFormData] = useState({
        goal: '',
        quantity: 0,
        days: 0
    });

    const [videos, setVideos] = useState([]);
    const [mealPlans, setMealPlans] = useState([]);
    const [exercisePlans, setExercisePlans] = useState([]);

    const handleInputChange = (event) => {
        const {name, value} = event.target;

        setFormData((prevData) => {
            return {...prevData, [name]:value};
        });
    }

    const loadRecs = () => {
        let vids = data['videos'];
        setVideos([...vids]);

        let mp = data['meal-plans'];
        setMealPlans([...mp]);

        let ep = data['exercise-plans'];
        setExercisePlans([...ep]);
    }

    useEffect(() => {
        loadRecs();
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        let vids = [];
        let mp = [];
        let ep = [];
        if(formData.goal === "Get Healthy"){
            vids = data['get-healthy']['videos'];
            mp = data['get-healthy']['meal-plans'];
            ep = data['get-healthy']['exercise-plans'];
        }else if(formData.goal === "Loose Weight"){
            vids = data['loose-weight']['videos'];
            mp = data['loose-weight']['meal-plans'];
            ep = data['loose-weight']['exercise-plans'];
        }else if(formData.goal == "Gain Weight"){
            vids = data['gain-weight']['videos'];
            mp = data['gain-weight']['meal-plans'];
            ep = data['gain-weight']['exercise-plans'];
        }

        setVideos([...vids]);
        setMealPlans([...mp]);
        setExercisePlans([...ep]);
        console.log(formData);
    }

    return (
        <Box sx={{ padding: 3 }}>
            <Box display="flex" alignItems="center" sx={{ boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', mb: 4 }}>
                {/* <PlayCircleOutlineIcon sx={{ fontSize: { xs: '2rem', sm: '2.5rem' }, mr: 1 }} /> */}
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        flexGrow: 1,
                        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)'
                    }}
                >
                    Recommendations
                </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={2} mb={4} position="relative" component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            select
                            fullWidth
                            label="Goal"
                            name="goal"
                            value={formData.goal}
                            onChange={handleInputChange}
                            SelectProps={{ native: true, }}
                            variant="outlined"
                        >
                            <option value="" disabled></option>
                            <option value="Get Healthy">Get Healthy</option>
                            <option value="Loose Weight">Loose Weight</option>
                            <option value="Gain Weight">Gain Weight</option>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            name="quantity"
                            required
                            fullWidth
                            id="quantity"
                            label="Quantity"
                            autoFocus
                            type="number"
                            value={formData.quatity}
                            onChange={handleInputChange}
                            // add error handler
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            name="days"
                            required
                            fullWidth
                            id="days"
                            label="Days"
                            autoFocus
                            type="number"
                            value={formData.days}
                            onChange={handleInputChange}
                            // add error handler
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Button type="submit" fullWidth variant="contained">
                            Search
                        </Button>
                    </Grid>
                </Grid>
            </Box>
            <Grid container spacing={2}>
                {videos.map((item, idx) => {
                    return <VideoCard index={idx} result={item}/>
                })}
                {mealPlans.map((item,idx) => {
                    return <ExpandableMealCard mealPlan={item} index={idx} />
                })}
                {exercisePlans.map((item,idx) => {
                    return <ExpandableExerciseCard plan={item} key={idx} />
                })}
            </Grid>
        </Box>
    )
}