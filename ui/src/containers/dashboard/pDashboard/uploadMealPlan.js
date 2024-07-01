import React, { useEffect, useState } from "react";
import { TextField, Grid, Box, Container, CssBaseline, Typography, Avatar, Button, InputLabel, MenuItem, Select, IconButton, Dialog, AppBar, Toolbar} from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import DirectionsRunOutlinedIcon from '@mui/icons-material/DirectionsRunOutlined';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { postReq } from "../../../services/api";

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
            <Grid item xs={12}>
                <Button type="" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} onClick={handleClickOnNext}>
                    Next
                </Button>
            </Grid>
        </Grid>
    )
}

const SecondPage = (props) => {
    
    const [mondayMeals, setMondayMeals] = useState({
        day: 'Monday',
        meals: {
            calories: 0,
            proteins: 0,
            carbs: 0,
            fats: 0,
            waterIntake: 0,
            breakfast: {
                calories: 0,
                carbs: 0,
                fats: 0,
                proteins: 0,
                mealItems: []
            },
            lunch: {
                calories: 0,
                carbs: 0,
                fats: 0,
                proteins: 0,
                mealItems: []
            },
            dinner: {
                calories: 0,
                carbs: 0,
                fats: 0,
                proteins: 0,
                mealItems: []
            }
        }
    })
    const [tuesdayMeals, setTuesdayMeals] = useState({
        day: 'Tuesday',
        meals: {
            calories: 0,
            proteins: 0,
            carbs: 0,
            fats: 0,
            waterIntake: 0,
            breakfast: {
                calories: 0,
                carbs: 0,
                fats: 0,
                proteins: 0,
                mealItems: []
            },
            lunch: {
                calories: 0,
                carbs: 0,
                fats: 0,
                proteins: 0,
                mealItems: []
            },
            dinner: {
                calories: 0,
                carbs: 0,
                fats: 0,
                proteins: 0,
                mealItems: []
            }
        }
    })
    const [wednesdayMeals, setWednesdayMeals] = useState({
        day: 'Wednesday',
        meals: {
            calories: 0,
            proteins: 0,
            carbs: 0,
            fats: 0,
            waterIntake: 0,
            breakfast: {
                calories: 0,
                carbs: 0,
                fats: 0,
                proteins: 0,
                mealItems: []
            },
            lunch: {
                calories: 0,
                carbs: 0,
                fats: 0,
                proteins: 0,
                mealItems: []
            },
            dinner: {
                calories: 0,
                carbs: 0,
                fats: 0,
                proteins: 0,
                mealItems: []
            }
        }
    })
    const [thursdayMeals, setThursdayMeals] = useState({
        day: 'Thursday',
        meals: {
            calories: 0,
            proteins: 0,
            carbs: 0,
            fats: 0,
            waterIntake: 0,
            breakfast: {
                calories: 0,
                carbs: 0,
                fats: 0,
                proteins: 0,
                mealItems: []
            },
            lunch: {
                calories: 0,
                carbs: 0,
                fats: 0,
                proteins: 0,
                mealItems: []
            },
            dinner: {
                calories: 0,
                carbs: 0,
                fats: 0,
                proteins: 0,
                mealItems: []
            }
        }
    })
    const [fridayMeals, setFridayMeals] = useState({
        day: 'Friday',
        meals: {
            calories: 0,
            proteins: 0,
            carbs: 0,
            fats: 0,
            waterIntake: 0,
            breakfast: {
                calories: 0,
                carbs: 0,
                fats: 0,
                proteins: 0,
                mealItems: []
            },
            lunch: {
                calories: 0,
                carbs: 0,
                fats: 0,
                proteins: 0,
                mealItems: []
            },
            dinner: {
                calories: 0,
                carbs: 0,
                fats: 0,
                proteins: 0,
                mealItems: []
            }
        }
    })
    const [saturdayMeals, setSaturdayMeals] = useState({
        day: 'Saturday',
        meals: {
            calories: 0,
            proteins: 0,
            carbs: 0,
            fats: 0,
            waterIntake: 0,
            breakfast: {
                calories: 0,
                carbs: 0,
                fats: 0,
                proteins: 0,
                mealItems: []
            },
            lunch: {
                calories: 0,
                carbs: 0,
                fats: 0,
                proteins: 0,
                mealItems: []
            },
            dinner: {
                calories: 0,
                carbs: 0,
                fats: 0,
                proteins: 0,
                mealItems: []
            }
        }
    })
    const [sundayMeals, setSundayMeals] = useState({
        day: 'Sunday',
        meals: {
            calories: 0,
            proteins: 0,
            carbs: 0,
            fats: 0,
            waterIntake: 0,
            breakfast: {
                calories: 0,
                carbs: 0,
                fats: 0,
                proteins: 0,
                mealItems: []
            },
            lunch: {
                calories: 0,
                carbs: 0,
                fats: 0,
                proteins: 0,
                mealItems: []
            },
            dinner: {
                calories: 0,
                carbs: 0,
                fats: 0,
                proteins: 0,
                mealItems: []
            }
        }
    })

    const MealDialog = (props) => {
        const [mealPlan,setMealPlan] = useState({
            calories: 0,
            carbs: 0,
            fats: 0,
            proteins: 0,
            mealItems: ['']
        })

        const handleChange = (event) => {
            const {name,value} = event.target;
            setMealPlan((prevMealPlan) => {
                return {...prevMealPlan, [name]:value};
            });
        }

        const handleClose = () => {
            props.handleDialog(props.i,props.j);
        }

        const handleSave = () => {
            let tmp_mp = props.mealPlan;
            if(props.j === 0){
                tmp_mp.meals.breakfast = mealPlan;
            }else if(props.j === 1){
                tmp_mp.meals.lunch = mealPlan;
            }else{
                tmp_mp.meals.dinner = mealPlan;
            }

            props.setMealPlan(tmp_mp);

            let tmp_formData = props.formData;
            for(let i=0;i<tmp_formData.routine.length;i++){
                if(tmp_formData.routine[i].day === props.mealPlan.day){
                    tmp_formData.routine.splice(i,1);
                    break;
                }
            }

            tmp_formData.routine.push(props.mealPlan);
            props.setFormData(tmp_formData);
            props.handleDialog(props.i,props.j);
        }
        
        const handleAddItem = () => {
            let tmp_mealItems = mealPlan.mealItems;
            tmp_mealItems.push('');
            setMealPlan((prevMealPlan) => {
                return {...prevMealPlan, mealItems: tmp_mealItems}
            });
        }

        const handleDelItem = (idx) => {
            let tmp_mealItems = mealPlan.mealItems;
            tmp_mealItems.splice(idx,1);
            setMealPlan((prevMealPlan) => {
                return {...prevMealPlan, mealItems: tmp_mealItems}
            });
        }

        const handleItemChange = (idx, event) => {
            let tmp_mealItems = mealPlan.mealItems;
            tmp_mealItems[idx] =  event.target.value;
            setMealPlan((prevMealPlan) => {
                return {...prevMealPlan, mealItems: tmp_mealItems}
            });
        }

        const MealItems = mealPlan.mealItems.map((val, idx) => {
            return (
                <Grid item xs={12} sm={12}>
                    <TextField
                        name={'item'+idx}
                        value={mealPlan.mealItems[idx]}
                        required
                        fullWidth
                        label='Item'
                        autoFocus
                        onChange={(event) => handleItemChange(idx, event)}
                    />
                    <IconButton aria-label="delete" size="small" onClick={handleDelItem}>
                        <DeleteIcon fontSize="inherit" />
                    </IconButton>
                </Grid>
            )
        })

        return (
            <Dialog onClose={handleClose} open={props.open} fullScreen>
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleClose}
                        aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">Add Meal Plan</Typography>
                        <Button autoFocus color="inherit" onClick={handleSave}>
                            save
                        </Button>
                    </Toolbar>
                </AppBar>

                <Container maxWidth="xs">
                    <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="calories"
                                    name="calories"
                                    required
                                    fullWidth
                                    id="calories"
                                    label="Calories"
                                    autoFocus
                                    type="number"
                                    value={mealPlan.calories}
                                    onChange={handleChange}
                                    // add error handler
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="carbs"
                                    name="carbs"
                                    required
                                    fullWidth
                                    id="carbs"
                                    label="Carbs"
                                    autoFocus
                                    type="number"
                                    value={mealPlan.carbs}
                                    onChange={handleChange}
                                    // add error handler
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="fats"
                                    name="fats"
                                    required
                                    fullWidth
                                    id="fats"
                                    label="Fats"
                                    autoFocus
                                    type="number"
                                    value={mealPlan.fats}
                                    onChange={handleChange}
                                    // add error handler
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="proteins"
                                    name="proteins"
                                    required
                                    fullWidth
                                    id="proteins"
                                    label="Proteins"
                                    autoFocus
                                    type="number"
                                    value={mealPlan.proteins}
                                    onChange={handleChange}
                                    // add error handler
                                />
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <Grid container spacing={2}>
                                    {MealItems}
                                    <IconButton color="secondary" onClick={handleAddItem}>
                                        <AddIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </Container>
            </Dialog>
        )
    }

    const [dialogOpen, setDialog] = useState([[false,false,false],[false,false,false],[false,false,false],[false,false,false],[false,false,false],[false,false,false],[false,false,false]]);
    
    const handleDialog = (i,j) => {
        let tmp_dialog = dialogOpen;
        tmp_dialog[i][j] = !tmp_dialog[i][j];
        setDialog([...tmp_dialog]);
    }

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={1.7}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12}>
                        Monday
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <Button variant='outlined' onClick={() => handleDialog(0,0)}>
                            Breakfast
                        </Button>
                        <MealDialog
                            open={dialogOpen[0][0]}
                            i={0}
                            j={0}
                            handleDialog={handleDialog}
                            mealPlan={mondayMeals}
                            setMealPlan={setMondayMeals}
                            formData={props.formData}
                            setFormData={props.setFormData}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <Button variant='outlined' onClick={() => handleDialog(0,1)}>
                            Lunch
                        </Button>
                        <MealDialog
                            open={dialogOpen[0][1]}
                            i={0}
                            j={1}
                            handleDialog={handleDialog}
                            mealPlan={mondayMeals}
                            setMealPlan={setMondayMeals}
                            formData={props.formData}
                            setFormData={props.setFormData}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <Button variant='outlined' onClick={() => handleDialog(0,2)}>
                            Dinner
                        </Button>
                        <MealDialog
                            open={dialogOpen[0][2]}
                            i={0}
                            j={2}
                            handleDialog={handleDialog}
                            mealPlan={mondayMeals}
                            setMealPlan={setMondayMeals}
                            formData={props.formData}
                            setFormData={props.setFormData}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={1.7}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12}>
                        Tuesday
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <Button variant='outlined' onClick={() => handleDialog(1,0)}>
                            Breakfast
                        </Button>
                        <MealDialog
                            open={dialogOpen[1][0]}
                            i={1}
                            j={0}
                            handleDialog={handleDialog}
                            mealPlan={tuesdayMeals}
                            setMealPlan={setTuesdayMeals}
                            formData={props.formData}
                            setFormData={props.setFormData}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <Button variant='outlined' onClick={() => handleDialog(1,1)}>
                            Lunch
                        </Button>
                        <MealDialog
                            open={dialogOpen[1][1]}
                            i={1}
                            j={1}
                            handleDialog={handleDialog}
                            mealPlan={tuesdayMeals}
                            setMealPlan={setTuesdayMeals}
                            formData={props.formData}
                            setFormData={props.setFormData}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <Button variant='outlined' onClick={() => handleDialog(1,2)}>
                            Dinner
                        </Button>
                        <MealDialog
                            open={dialogOpen[1][2]}
                            i={1}
                            j={2}
                            handleDialog={handleDialog}
                            mealPlan={tuesdayMeals}
                            setMealPlan={setTuesdayMeals}
                            formData={props.formData}
                            setFormData={props.setFormData}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={1.7}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12}>
                        Wednesday
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <Button variant='outlined' onClick={() => handleDialog(2,0)}>
                            Breakfast
                        </Button>
                        <MealDialog
                            open={dialogOpen[2][0]}
                            i={2}
                            j={0}
                            handleDialog={handleDialog}
                            mealPlan={wednesdayMeals}
                            setMealPlan={setWednesdayMeals}
                            formData={props.formData}
                            setFormData={props.setFormData}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <Button variant='outlined' onClick={() => handleDialog(2,1)}>
                            Lunch
                        </Button>
                        <MealDialog
                            open={dialogOpen[2][1]}
                            i={2}
                            j={1}
                            handleDialog={handleDialog}
                            mealPlan={wednesdayMeals}
                            setMealPlan={setWednesdayMeals}
                            formData={props.formData}
                            setFormData={props.setFormData}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <Button variant='outlined' onClick={() => handleDialog(2,2)}>
                            Dinner
                        </Button>
                        <MealDialog
                            open={dialogOpen[2][2]}
                            i={2}
                            j={2}
                            handleDialog={handleDialog}
                            mealPlan={wednesdayMeals}
                            setMealPlan={setWednesdayMeals}
                            formData={props.formData}
                            setFormData={props.setFormData}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={1.7}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12}>
                        Thursday
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <Button variant='outlined' onClick={() => handleDialog(3,0)}>
                            Breakfast
                        </Button>
                        <MealDialog
                            open={dialogOpen[3][0]}
                            i={3}
                            j={0}
                            handleDialog={handleDialog}
                            mealPlan={thursdayMeals}
                            setMealPlan={setThursdayMeals}
                            formData={props.formData}
                            setFormData={props.setFormData}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <Button variant='outlined' onClick={() => handleDialog(3,1)}>
                            Lunch
                        </Button>
                        <MealDialog
                            open={dialogOpen[3][1]}
                            i={3}
                            j={1}
                            handleDialog={handleDialog}
                            mealPlan={thursdayMeals}
                            setMealPlan={setThursdayMeals}
                            formData={props.formData}
                            setFormData={props.setFormData}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <Button variant='outlined' onClick={() => handleDialog(3,2)}>
                            Dinner
                        </Button>
                        <MealDialog
                            open={dialogOpen[3][2]}
                            i={3}
                            j={2}
                            handleDialog={handleDialog}
                            mealPlan={thursdayMeals}
                            setMealPlan={setThursdayMeals}
                            formData={props.formData}
                            setFormData={props.setFormData}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={1.7}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12}>
                        Friday
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <Button variant='outlined' onClick={() => handleDialog(4,0)}>
                            Breakfast
                        </Button>
                        <MealDialog
                            open={dialogOpen[4][0]}
                            i={4}
                            j={0}
                            handleDialog={handleDialog}
                            mealPlan={fridayMeals}
                            setMealPlan={setFridayMeals}
                            formData={props.formData}
                            setFormData={props.setFormData}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <Button variant='outlined' onClick={() => handleDialog(4,1)}>
                            Lunch
                        </Button>
                        <MealDialog
                            open={dialogOpen[4][1]}
                            i={4}
                            j={1}
                            handleDialog={handleDialog}
                            mealPlan={fridayMeals}
                            setMealPlan={setFridayMeals}
                            formData={props.formData}
                            setFormData={props.setFormData}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <Button variant='outlined' onClick={() => handleDialog(4,2)}>
                            Dinner
                        </Button>
                        <MealDialog
                            open={dialogOpen[4][2]}
                            i={4}
                            j={2}
                            handleDialog={handleDialog}
                            mealPlan={fridayMeals}
                            setMealPlan={setFridayMeals}
                            formData={props.formData}
                            setFormData={props.setFormData}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={1.7}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12}>
                        Saturday
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <Button variant='outlined' onClick={() => handleDialog(5,0)}>
                            Breakfast
                        </Button>
                        <MealDialog
                            open={dialogOpen[5][0]}
                            i={5}
                            j={0}
                            handleDialog={handleDialog}
                            mealPlan={saturdayMeals}
                            setMealPlan={setSaturdayMeals}
                            formData={props.formData}
                            setFormData={props.setFormData}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <Button variant='outlined' onClick={() => handleDialog(5,1)}>
                            Lunch
                        </Button>
                        <MealDialog
                            open={dialogOpen[5][1]}
                            i={5}
                            j={1}
                            handleDialog={handleDialog}
                            mealPlan={saturdayMeals}
                            setMealPlan={setSaturdayMeals}
                            formData={props.formData}
                            setFormData={props.setFormData}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <Button variant='outlined' onClick={() => handleDialog(5,2)}>
                            Dinner
                        </Button>
                        <MealDialog
                            open={dialogOpen[5][2]}
                            i={5}
                            j={2}
                            handleDialog={handleDialog}
                            mealPlan={saturdayMeals}
                            setMealPlan={setSaturdayMeals}
                            formData={props.formData}
                            setFormData={props.setFormData}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={1.7}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12}>
                        Sunday
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <Button variant='outlined' onClick={() => handleDialog(6,0)}>
                            Breakfast
                        </Button>
                        <MealDialog
                            open={dialogOpen[6][0]}
                            i={6}
                            j={0}
                            handleDialog={handleDialog}
                            mealPlan={sundayMeals}
                            setMealPlan={setSundayMeals}
                            formData={props.formData}
                            setFormData={props.setFormData}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <Button variant='outlined' onClick={() => handleDialog(6,1)}>
                            Lunch
                        </Button>
                        <MealDialog
                            open={dialogOpen[6][1]}
                            i={6}
                            j={1}
                            handleDialog={handleDialog}
                            mealPlan={sundayMeals}
                            setMealPlan={setSundayMeals}
                            formData={props.formData}
                            setFormData={props.setFormData}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <Button variant='outlined' onClick={() => handleDialog(6,2)}>
                            Dinner
                        </Button>
                        <MealDialog
                            open={dialogOpen[6][2]}
                            i={6}
                            j={2}
                            handleDialog={handleDialog}
                            mealPlan={sundayMeals}
                            setMealPlan={setSundayMeals}
                            formData={props.formData}
                            setFormData={props.setFormData}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={2}>
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                    Upload
                </Button>
            </Grid>
        </Grid>
    );
}

export default function UploadMealPlan (props) {
    const [formData, setFormData] = useState({
        title: '',
        tags: [],
        description: '',
        routine: []
    });

    const [pageNumber, setPageNumber] = useState(1);

    

    const handleSubmit =  async (event) => {
        event.preventDefault();
        console.log(formData);

        // Do input validation and then send the data to the backend!!
        // Maybe a success message

        const header = {};
        const response = await postReq('/upload/meal-plan',header,formData);
        console.log(response);

        setFormData({
            title: '',
            tags: [],
            description: '',
            routine: []
        });

    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <DirectionsRunOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5"> Upload Meal Plan </Typography>
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