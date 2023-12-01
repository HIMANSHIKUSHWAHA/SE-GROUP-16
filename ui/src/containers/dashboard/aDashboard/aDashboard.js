import React, { useState } from "react";
import Header from "../../header";
import { faCheckCircle, faTimesCircle, faChartBar } from '@fortawesome/free-solid-svg-icons';
import SecondaryNavbar from "../../secondaryNavbar";
import ApproveContent from "./approveContent";
import ManageUsers from "./manageUsers";
import ViewAnalytics from "./viewAnalytics";

export default function AdminDashboard() {
    const [activeContent, setActiveContent] = useState('approve');

    const navbarData = [
        {
            name: "Approve Content",
            icon: faCheckCircle,
            content: 'approve'
        },
        {
            name: "Manage Users",
            icon: faTimesCircle,
            content: 'users'
        },
        {
            name: "View Analytics",
            icon: faChartBar,
            content: 'analytics'
        }
    ]

    // Optionally, fetch additional data needed for the admin dashboard here

    return (
        <div>
            <Header auth={true} />
            <SecondaryNavbar data={navbarData} setActiveContent={setActiveContent} />
            <div className="ContentArea">
                {activeContent === 'approve' && <ApproveContent />}
                {activeContent === 'users' && <ManageUsers />}
                {activeContent === 'analytics' && <ViewAnalytics />}
            </div>
        </div>
    )
}
