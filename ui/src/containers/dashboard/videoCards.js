import {React, useState} from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CardActionArea, Collapse } from '@mui/material';
import img1 from "./v1.jpg";
import img2 from "./v2.jpg";

export default function MediaCard() {

    const [videos, setVideos] = useState([
        {
            title: "Exercise video 1",
            description: "Video Description",
            image: img1,
            expanded: false
        },
        {
            title: "Exercise video 2",
            description: "Video Description",
            image: img2,
            expanded: false
        }
    ]);


    const handleExpand = (idx) => {

        const tmp_videos = [...videos];
        tmp_videos[idx] = {
            ...tmp_videos[idx],
            expanded: !tmp_videos[idx].expanded
        };
        setVideos(tmp_videos);

    }

    const dataItems = videos.map((video, idx) => (
        <li key={idx} style={{ display: 'inline-block', margin: '10px' }} >
        <Card sx={{ width: 345 }}>
            <CardActionArea>
            <CardMedia
                sx={{ height: 140 }}
                component="img"
                src={video.image}
                title={video.title}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                {video.title}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small">Share</Button>
                <Button size="small" onClick={() => handleExpand(idx)} >Learn More</Button>
            </CardActions>
            <Collapse in={video.expanded} timeout="auto" unmountOnExit>
                <CardContent>
                <Typography paragraph>
                    {video.description}
                </Typography>
                </CardContent>
            </Collapse>
            </CardActionArea>
        </Card>
        </li>
    ))

  return (
    <div>
        <ul style={{listStyleType: 'none'}}>
            {dataItems}
        </ul>
    </div>
  );
}