import React, { useEffect } from 'react';

const JitsiMeetComponent = () => {
    useEffect(() => {
        // Load the JitsiMeetExternalAPI
        const script = document.createElement('script');
        script.src = 'https://8x8.vc/vpaas-magic-cookie-987847ad480f4c0c9711d02b32b4557a/external_api.js';
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            const api = new window.JitsiMeetExternalAPI("8x8.vc", {
                roomName: "vpaas-magic-cookie-987847ad480f4c0c9711d02b32b4557a/SampleAppCleanSealsPickBravely",
                parentNode: document.querySelector('#jaas-container'),
            });
        };

        return () => {
            document.body.removeChild(script);
        }
    }, []);

    return <div id="jaas-container" style={{ height: '100vh', width: '100%' }} />;
};

export default JitsiMeetComponent;