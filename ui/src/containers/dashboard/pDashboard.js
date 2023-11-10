import React, { useState } from "react";
import Header from "../header";
import { faVideo, faRunning, faUtensils} from '@fortawesome/free-solid-svg-icons';
import SecondaryNavbar from "../secondaryNavbar";
import { TextField, Grid, Box, Container, CssBaseline, Typography, Avatar, Button, InputLabel, MenuItem, Select, IconButton} from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import DirectionsRunOutlinedIcon from '@mui/icons-material/DirectionsRunOutlined';
import AddIcon from '@mui/icons-material/Add';
import RestaurantOutlinedIcon from '@mui/icons-material/RestaurantOutlined';

const defaultTheme = createTheme();

const UploadWorkoutVideo = () => {

    const handleSubmit = () => {

    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <VideocamOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5"> Upload Video </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    autoComplete="title"
                                    name="title"
                                    required
                                    fullWidth
                                    id="title"
                                    label="Title"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} sm={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12}>
                                    <InputLabel id="">Choose tags</InputLabel>
                                </Grid>
                                {/* Make a map to map all the tags */}
                                <Grid item xs={12} sm={3}>
                                    <Button variant="outlined" size="small">Tag 1</Button>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <Button variant="outlined" size="small">Tag 2</Button>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <Button variant="outlined" size="small">Tag 3</Button>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <Button variant="outlined" size="small">Tag 4</Button>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <Button variant="outlined" size="small">Tag 5</Button>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <Button variant="outlined" size="small">Tag 6</Button>
                                </Grid>    
                            </Grid>
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    autoComplete="description"
                                    name="description"
                                    multiline
                                    rows={6}
                                    required
                                    fullWidth
                                    id="description"
                                    label="Description"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    autoComplete="link"
                                    name="link"
                                    required
                                    fullWidth
                                    id="link"
                                    label="Link"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                                    Upload
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    )
}

const UploadWorkoutRoutine = () => {
    const [days, setDays] = useState([{day: 1, exercises: ['']}]);

    const handleSubmit =  () => {

    }

    const handleAddExercise = (idx) => {
            
    }

    const Routine = days.map((day,idx) => {
        const day_exercises = day.exercises.map((exer) => (
            <Grid item xs={12}>
                <TextField
                    autoComplete={exer}
                    name={exer}
                    required
                    fullWidth
                    id={exer}
                    label="Exercise"
                    autoFocus
                />
            </Grid>
        ));

        return (
            <Grid item xs={12}>
                <InputLabel id="">Day {day.day}</InputLabel>
                <Grid container spacing={2}>
                    {day_exercises}
                    <IconButton color="secondary" onClick={() => handleAddExercise(idx)}>
                        <AddIcon />
                    </IconButton>
                </Grid>
            </Grid>
        )
    });

    const handleAddDay = () => {

    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <DirectionsRunOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5"> Upload Workout Routine </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    autoComplete="title"
                                    name="title"
                                    required
                                    fullWidth
                                    id="title"
                                    label="Title"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} sm={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12}>
                                    <InputLabel id="">Choose tags</InputLabel>
                                </Grid>
                                {/* Make a map to map all the tags */}
                                <Grid item xs={12} sm={3}>
                                    <Button variant="outlined" size="small">Tag 1</Button>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <Button variant="outlined" size="small">Tag 2</Button>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <Button variant="outlined" size="small">Tag 3</Button>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <Button variant="outlined" size="small">Tag 4</Button>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <Button variant="outlined" size="small">Tag 5</Button>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <Button variant="outlined" size="small">Tag 6</Button>
                                </Grid>    
                            </Grid>
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    autoComplete="description"
                                    name="description"
                                    multiline
                                    rows={6}
                                    required
                                    fullWidth
                                    id="description"
                                    label="Description"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <InputLabel id="demo-simple-select-label">Difficulty Level</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value=""
                                    label="Age"
                                    onChange=""
                                    fullWidth
                                >
                                    <MenuItem value='beginner'>Beginner</MenuItem>
                                    <MenuItem value='novice'>Novice</MenuItem>
                                    <MenuItem value='intermediate'>Intermediate</MenuItem>
                                    <MenuItem value='hard'>Hard</MenuItem>
                                </Select>
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <Grid container spacing={2}>
                                    {Routine}
                                </Grid>
                                <IconButton color="secondary" onClick={handleAddDay}>
                                    <AddIcon />
                                </IconButton>
                            </Grid>
                            <Grid item xs={12}>
                                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                                    Upload
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    )
}

const UploadMealPlan = () => {

    const [days, setDays] = useState([{day: 1, meals: ['']}]);

    const handleSubmit =  () => {

    }

    const handleAddMeal = (idx) => {
            
    }

    const Routine = days.map((day,idx) => {
        const day_meals = day.meals.map((meal) => (
            <Grid item xs={12}>
                <TextField
                    autoComplete={meal}
                    name={meal}
                    required
                    fullWidth
                    id={meal}
                    label="Meal"
                    autoFocus
                />
            </Grid>
        ));

        return (
            <Grid item xs={12}>
                <InputLabel id="">Day {day.day}</InputLabel>
                <Grid container spacing={2}>
                    {day_meals}
                    <IconButton color="secondary" onClick={() => handleAddMeal(idx)}>
                        <AddIcon />
                    </IconButton>
                </Grid>
            </Grid>
        )
    });

    const handleAddDay = () => {

    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <RestaurantOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5"> Upload Meal Plan </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    autoComplete="title"
                                    name="title"
                                    required
                                    fullWidth
                                    id="title"
                                    label="Title"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} sm={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12}>
                                    <InputLabel id="">Choose tags</InputLabel>
                                </Grid>
                                {/* Make a map to map all the tags */}
                                <Grid item xs={12} sm={3}>
                                    <Button variant="outlined" size="small">Tag 1</Button>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <Button variant="outlined" size="small">Tag 2</Button>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <Button variant="outlined" size="small">Tag 3</Button>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <Button variant="outlined" size="small">Tag 4</Button>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <Button variant="outlined" size="small">Tag 5</Button>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <Button variant="outlined" size="small">Tag 6</Button>
                                </Grid>    
                            </Grid>
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    autoComplete="description"
                                    name="description"
                                    multiline
                                    rows={6}
                                    required
                                    fullWidth
                                    id="description"
                                    label="Description"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <Grid container spacing={2}>
                                    {Routine}
                                </Grid>
                                <IconButton color="secondary" onClick={handleAddDay}>
                                    <AddIcon />
                                </IconButton>
                            </Grid>
                            <Grid item xs={12}>
                                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                                    Upload
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    )
}

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
    return (
        <div>
            <Header auth={true} />
            <SecondaryNavbar data={navbarData} setActiveContent={setActiveContent} />
            <div className="ContentArea">
                {activeContent === 'videos' && <UploadWorkoutVideo />}
                {activeContent === 'workout-routine' && <UploadWorkoutRoutine />}
                {activeContent === 'meal-plans' && <UploadMealPlan />}
            </div>
        </div>
    )
}