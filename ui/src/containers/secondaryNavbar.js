import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo, faRunning, faUtensils, faDumbbell, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';

export default function SecondaryNavbar(props) {

    const navbarData = props.data.map((dt) => (
        <button onClick={() => props.setActiveContent(dt.content)}>
            <div className="icon-container">
            <FontAwesomeIcon icon={dt.icon} size="1x" />
            <div>{dt.name}</div>
            </div>
        </button>
    ));

    return (
        <div className="SecondaryNavbar">
            {navbarData}
        </div>
    )
}