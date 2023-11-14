import React, { useState } from "react";
import { TextField, Grid, Box, Container, CssBaseline, Typography, Avatar, Button, InputLabel } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';

const defaultTheme = createTheme();

export default function UploadWorkoutVideo (props) {
    const [formData, setFormData] = useState({
        title: '',
        tags: [],
        description: '',
        link: ''
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
            <Button variant={buttonVariant[idx]} size="small" onClick={() => addTag(tag, idx)}>{tag}</Button>
        </Grid>
    ));

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => {
            return {...prevFormData, [name]: value};
        });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(formData);

        // Do input validation and then send the data to the backend!!
        // Maybe a success message

        setFormData({
            title: '',
            tags: [],
            description: '',
            link: ''
        });
        setButtonVariant(new Array(props.tags_list.length).fill('outlined'));
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
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    // add error handler
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
                                    // add error handler
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
                                    value={formData.link}
                                    onChange={handleInputChange}
                                    // add error handler
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