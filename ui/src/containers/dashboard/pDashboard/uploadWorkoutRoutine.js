import React, { useState } from "react";
import { TextField, Grid, Box, Container, CssBaseline, Typography, Avatar, Button, InputLabel, MenuItem, Select, IconButton} from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import DirectionsRunOutlinedIcon from '@mui/icons-material/DirectionsRunOutlined';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const defaultTheme = createTheme();

export default function UploadWorkoutRoutine (props) {
    const [formData, setFormData] = useState({
        title: '',
        tags: [],
        description: '',
        difficulty_level: '',
        routine: [{day: 1, exercises: ['']}]
    });

    const [buttonVariant, setButtonVariant] = useState(new Array(props.tags_list.length).fill('outlined'));
    
    const addTag = (tag, idx) => {
        let tmp_array = buttonVariant;
        let tmp_tags = formData.tags;
        if(tmp_array[idx] === 'outlined'){
            tmp_array[idx] = 'contained';
            tmp_tags.push(tag);
        }else{
            tmp_array[idx] = 'outlined';
            const i = tmp_tags.indexOf(tag);
            tmp_tags.splice(i,1);
        }
        setButtonVariant(tmp_array);
        setFormData((prevFormData) => {
            return {...prevFormData, tags: tmp_tags};
        });
    }

    const allTags = props.tags_list.map((tag,idx) => (
        <Grid item xs={12} sm={3}>
            <Button variant={buttonVariant[idx]} size="small" onClick={() => addTag(tag,idx)}>{tag}</Button>
        </Grid>
    ));

    const handleExercises = (idx, aod, e_idx) => {
        if(aod === 'a'){
            let tmp_routine = formData.routine;
            tmp_routine[idx].exercises.push('');
            setFormData((prevFormData) => {
                return {...prevFormData, routine: tmp_routine};
            })
        }else{
            let tmp_routine = formData.routine;
            tmp_routine[idx].exercises.splice(e_idx,1);
            setFormData((prevFormData) => {
                return {...prevFormData, routine: tmp_routine};
            })
        }
    }

    const handleInputChangeExercise = (idx, e_idx, event) => {
        let tmp_routine = formData.routine;
        tmp_routine[idx].exercises[e_idx] = event.target.value;
        setFormData((prevFormData) => {
            return {...prevFormData, routine: tmp_routine};
        })
    }

    const handleDays = (aod, idx) => {
        if(aod === 'a'){
            let tmp_routine = formData.routine;
            tmp_routine.push({day: tmp_routine.length+1, exercises: ['']});
            setFormData((prevFormData) => {
                return {...prevFormData, routine: tmp_routine};
            });
        }else{
            let tmp_routine = formData.routine;
            tmp_routine.splice(idx,1);
            setFormData((prevFormData) => {
                return {...prevFormData, routine: tmp_routine};
            });
        }
    }

    const Routine = formData.routine.map((day,idx) => {
        const day_exercises = day.exercises.map((exer,e_idx) => (
            <Grid item xs={12}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={10}>
                        <TextField
                            autoComplete={exer}
                            name={exer}
                            value={formData.routine[idx].exercises[e_idx]}
                            required
                            fullWidth
                            id={exer}
                            label={"Exercise "+(e_idx+1)}
                            autoFocus
                            onChange={(event) => handleInputChangeExercise(idx, e_idx, event)}
                        />
                    </Grid>
                    {e_idx !== 0 && 
                    <Grid item xs={12} sm={2}>
                        <IconButton aria-label="delete" size="small" onClick={() => handleExercises(idx, 'd', e_idx)}>
                            <DeleteIcon fontSize="inherit" />
                        </IconButton>
                    </Grid>}
                </Grid>
            </Grid>
        ));

        return (
            <Grid item xs={12}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={2}>
                        <InputLabel id="">Day {day.day}</InputLabel>
                    </Grid>
                    <Grid item xs={12} sm={10}>
                        {idx !== 0 &&
                        <IconButton aria-label="delete" size="small" onClick={() => handleDays('d', idx)}>
                            <DeleteIcon fontSize="inherit" />
                        </IconButton>}
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    {day_exercises}
                    <IconButton color="secondary" onClick={() => handleExercises(idx, 'a')}>
                        <AddIcon />
                    </IconButton>
                </Grid>
            </Grid>
        )
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => {
            return {...prevFormData, [name]: value};
        });
    }

    const handleSubmit =  (event) => {
        event.preventDefault();
        console.log(formData);

        // Do input validation and then send the data to the backend!!
        // Maybe a success message

        setFormData({
            title: '',
            tags: [],
            description: '',
            difficulty_level: '',
            routine: [{day: 1, exercises: ['']}]
        });

        setButtonVariant(new Array(props.tags_list.length).fill('outlined'));
    };

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
                                    value={formData.title}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12}>
                                    <InputLabel id="">Choose tags</InputLabel>
                                </Grid>
                                {allTags}
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
                                    value={formData.description}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <InputLabel id="demo-simple-select-label">Difficulty Level</InputLabel>
                                <Select
                                    labelId="difficulty_level"
                                    name="difficulty_level"
                                    id="difficulty_level"
                                    value={formData.difficulty_level}
                                    label="Difficulty Level"
                                    onChange={handleInputChange}
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
                                <IconButton color="secondary" onClick={() => handleDays('a')}>
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