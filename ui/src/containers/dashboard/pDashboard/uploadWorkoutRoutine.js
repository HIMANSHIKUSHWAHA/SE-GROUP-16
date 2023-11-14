import React, { useState } from "react";
import { TextField, Grid, Box, Container, CssBaseline, Typography, Avatar, Button, InputLabel, MenuItem, Select, IconButton, Dialog, AppBar, Toolbar} from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import DirectionsRunOutlinedIcon from '@mui/icons-material/DirectionsRunOutlined';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';


const defaultTheme = createTheme();

const FirstPage = (props) => {
    const [buttonVariant, setButtonVariant] = useState(new Array(props.tags_list.length).fill('outlined'));
    
    const addTag = (tag, idx) => {
        let tmp_array = buttonVariant;
        let tmp_tags = props.formData.tags;
        if(tmp_array[idx] === 'outlined'){
            tmp_array[idx] = 'contained';
            tmp_tags.push(tag);
        }else{
            tmp_array[idx] = 'outlined';
            const i = tmp_tags.indexOf(tag);
            tmp_tags.splice(i,1);
        }
        setButtonVariant(tmp_array);
        props.setFormData((prevFormData) => {
            return {...prevFormData, tags: tmp_tags};
        });
    }

    const allTags = props.tags_list.map((tag,idx) => (
        <Grid item xs={12} sm={3}>
            <Button variant={buttonVariant[idx]} size="small" onClick={() => addTag(tag,idx)}>{tag}</Button>
        </Grid>
    ));

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        props.setFormData((prevFormData) => {
            return {...prevFormData, [name]: value};
        });
    }

    const handleClickOnNext = () => {
        let dayList = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        let tmp_array = props.formData.routine;
        for (let i=0; i < dayList.length; i++){
            tmp_array.push({
                day: dayList[i],
                exercises: [{
                    title: '',
                    description: '',
                    referenceVideo: '',
                    reps: null,
                    sets: null
                }]
            });
        }

        props.setFormData((prevFormData) => {
            return {...prevFormData, routine: tmp_array};
        });

        console.log(props.formData);
        props.setPageNumber(2);
    }

    return (
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
                    value={props.formData.title}
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
                    value={props.formData.description}
                    onChange={handleInputChange}
                />
            </Grid>
            <Grid item xs={12} sm={12}>
                <InputLabel id="difficulty_level">Difficulty Level</InputLabel>
                <Select
                    labelId="difficulty_level"
                    name="difficulty_level"
                    id="difficulty_level"
                    value={props.formData.difficulty_level}
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
            <Grid item xs={12}>
                <Button type="" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} onClick={handleClickOnNext}>
                    Next
                </Button>
            </Grid>
        </Grid>
    )
}

const SecondPage = (props) => {

    const ExerciseDialog = (props) => {

        const [exercise,setExercise] = useState(props.formData.routine[props.idx].exercises[props.e_idx]);

        const handleInputChangeExercise = (event) => {
            const { name, value } = event.target;
            setExercise((prevData) => {
                return {...prevData, [name]: value};
            })
        }

        const handleSave = (idx, e_idx) => {
            let tmp_array = props.formData.routine;
            tmp_array[idx].exercises[e_idx] = exercise;
            props.setFormData((prevFormData) => {
                return {...prevFormData, routine: tmp_array}
            })
            props.handleDialogBox();
        }

        return (
            <Dialog onClose={props.handleDialogBox} open={props.open} fullScreen>
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                        edge="start"
                        color="inherit"
                        onClick={props.handleDialogBox}
                        aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">Add Exercise</Typography>
                        <Button autoFocus color="inherit" onClick={() => handleSave(props.idx, props.e_idx)}>
                            save
                        </Button>
                    </Toolbar>
                </AppBar>
                <Container maxWidth="xs">
                    <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    name='title'
                                    value={exercise.title}
                                    required
                                    fullWidth
                                    label='title'
                                    autoFocus
                                    onChange={(event) => handleInputChangeExercise(event)}
                                />
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
                                    value={exercise.description}
                                    onChange={(event) => handleInputChangeExercise(event)}
                                    // add error handler
                                />
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    autoComplete="link"
                                    name="referenceVideo"
                                    required
                                    fullWidth
                                    id="link"
                                    label="Link"
                                    autoFocus
                                    value={exercise.referenceVideo}
                                    onChange={(event) => handleInputChangeExercise(event)}
                                    // add error handler
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="reps"
                                    name="reps"
                                    required
                                    fullWidth
                                    id="reps"
                                    label="Reps"
                                    autoFocus
                                    type="number"
                                    value={exercise.reps}
                                    onChange={(event) => handleInputChangeExercise(event)}
                                    // add error handler
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="sets"
                                    name="sets"
                                    required
                                    fullWidth
                                    id="sets"
                                    label="Sets"
                                    autoFocus
                                    type="number"
                                    value={exercise.sets}
                                    onChange={(event) => handleInputChangeExercise(event)}
                                    // add error handler
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </Container>
            </Dialog>
       )
    }

    const [dialogBoxStatus, setDialogBoxStatus] = useState(new Array(props.formData.routine.length).fill([false]));
    const handleDialogBox = (idx,e_idx) => {
        console.log(props.formData);
        let tmp_array = [...dialogBoxStatus];
        dialogBoxStatus[idx][e_idx] = !dialogBoxStatus[idx][e_idx];
        setDialogBoxStatus(tmp_array);
    }

    const handleExercises = (idx, aod, e_idx) => {
        let tmp_array = props.formData.routine;
        
        if(aod === 'a'){
            tmp_array[idx].exercises.push({
                title: '',
                description: '',
                referenceVideo: '',
                reps: 0,
                sets: 0
            });
        }else{
            tmp_array[idx].exercises.splice(e_idx,1);
        }

        props.setFormData((prevFormData) => {
            return {...prevFormData, routine: tmp_array};
        })
    }

    const Routine = props.formData.routine.map((day,idx) => {
        const Day_exercises = day.exercises.map((exer,e_idx) => {
            return (
                <Grid item>
                    <Button variant='outlined' onClick={() => handleDialogBox(idx,e_idx)}>
                        {"Exercise "+(e_idx+1)}
                    </Button>
                    {e_idx !== 0 && 
                        <IconButton aria-label="delete" size="small" onClick={() => handleExercises(idx, 'd', e_idx)}>
                            <DeleteIcon fontSize="inherit" />
                        </IconButton>
                    }
                    <ExerciseDialog 
                        open={dialogBoxStatus[idx][e_idx]} 
                        handleDialogBox={() => handleDialogBox(idx, e_idx)}
                        formData={props.formData}
                        setFormData={props.setFormData}
                        idx={idx}
                        e_idx={e_idx}
                    />
                </Grid>
            )
        });

        return (
            <Grid item xs={12} sm={1.7}>
                <Grid item>
                    <InputLabel id="">{day.day}</InputLabel>
                </Grid>
                <Grid container spacing={2}>
                    {Day_exercises}
                    <Grid item xs={12} sm={12}>
                        <IconButton color="secondary" onClick={() => handleExercises(idx, 'a')}>
                            <AddIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            </Grid>
        )
    });


    return (
        <Grid container spacing={3}>
            {Routine}
            <Grid item xs={12} sm={2}>
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                    Upload
                </Button>
            </Grid>
        </Grid>
    );
}


export default function UploadWorkoutRoutine (props) {
    const [formData, setFormData] = useState({
        title: '',
        tags: [],
        description: '',
        difficulty_level: '',
        routine: []
    });

    const [pageNumber, setPageNumber] = useState(1);

    

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
            routine: []
        });

    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <DirectionsRunOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5"> Upload Workout Routine </Typography>
                </Box>
            <CssBaseline />
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Container maxWidth="xs">
                    {pageNumber === 1 && <FirstPage formData={formData} setFormData={setFormData} tags_list={props.tags_list} setPageNumber={setPageNumber}/>}
                </Container>
                {pageNumber === 2 && <SecondPage formData={formData} setFormData={setFormData}/>}
            </Box>
        </ThemeProvider>
    )
}