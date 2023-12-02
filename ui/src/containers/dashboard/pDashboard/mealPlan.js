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

    const Routine = props.formData.routine.map((day,idx) => {
        
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

export default function UploadMealPlan (props) {
    const [formData, setFormData] = useState({
        title: '',
        tags: [],
        description: '',
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