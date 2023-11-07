import {React, useState} from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CardActionArea, Collapse } from '@mui/material';
import { getReq } from "../../services/api"
import axios from 'axios';

export default function MediaCard() {

    const headers = {}
    const params = {}
    // const response = getReq("/dashboard/video_cards", headers, params);
    const response = axios.get("/api/v1/dashboard/video_cards").then(response => {return response});
    console.log(response.data);
    const [videos, setVideos] = useState(response.data);  

    // Hard coded just for testing
    // const [videos, setVideos] = useState([
    //     {
    //         title: "Exercise video 1",
    //         description: "Video Description",
    //         image: img1,
    //         expanded: false
    //     },
    //     {
    //         title: "Exercise video 2",
    //         description: "Video Description",
    //         image: img2,
    //         expanded: false
    //     },
    //     {
    //         title: "Exercise video 3",
    //         description: "Video Description",
    //         image: img1,
    //         expanded: false
    //     },
    //     {
    //         title: "Exercise video 4",
    //         description: "Video Description",
    //         image: img2,
    //         expanded: false
    //     },{
    //         title: "Exercise video 5",
    //         description: "Video Description",
    //         image: img1,
    //         expanded: false
    //     },
    //     {
    //         title: "Exercise video 6",
    //         description: "Video Description",
    //         image: img2,
    //         expanded: false
    //     }
    // ]);


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
            {/* <CardMedia
                sx={{ height: 140 }}
                component="img"
                src={video.image}
                title={video.title}
            /> */}
            <iframe width="345" height="315" src={video.Link} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
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
                    {video.Description}
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