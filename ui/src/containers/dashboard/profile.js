import axios from 'axios';
import { Box, Chip, Stack, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import './profile.css';
const Profile = ({ userId }) => {
    console.log("userId", userId);
    const fetchEntity = async (userId) => {
        try {
            const response = await axios.get(`/api/v1/profile/${userId}`);
            return response.data;
        } catch (err) {
            console.log(err);
        } finally {
            console.log("DONE fetchEntity");
        }
    };
    const entityData = fetchEntity(userId);

    const weight = entityData.weight;
    const height = entityData.height;
    const firstName = entityData.firstName;
    const lastName = entityData.lastName;
    const email = entityData.email;
    const specialization = entityData.specialization;
    const currExercisePlan = entityData.currentExercisePlan;
    //fetch currExercisePlan title by id
    

    const currExercisePlanTitle = entityData.title;    



      
    const PlanChip = styled(Chip)({
        marginRight: '8px',
        marginBottom: '8px',
        '&:last-child': {
          marginRight: 0
        }
    });
      
    const ScrollableBox = styled(Box)({
        overflowX: 'auto',
        '&::-webkit-scrollbar': {
          display: 'none'
        }
    });

    return(
        <div className='user-card'>
                <Stack direction="column" spacing={6} alignItems="center">
                <Avatar sx={{ width: 100, height: 100 }} />
                <label className="title-typography">
                    {firstName} {lastName}
                </label>
                <label className="subtitle-typography">
                    {email}
                </label>
                <label className="info-typography">
                    Specialization: {specialization}
                </label>
                <label className="info-typography">
                    Height: {height}
                </label>
                <label className="info-typography">
                    Weight: {weight}
                </label>

                <label variant="h6" mt={2} mb={1}>
                    Exercise Plans
                </label>
                <label className="info-typography">
                    {currExercisePlanTitle}
                </label>
                </Stack>
        </div>
    );
};

export default Profile;