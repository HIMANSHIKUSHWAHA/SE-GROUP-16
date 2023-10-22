import React from 'react';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';

export default function ProfessionalSignup({ formData, setFormData }) {
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="Specialization"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    variant="outlined"
                />
            </Grid>
        </>
    );
}