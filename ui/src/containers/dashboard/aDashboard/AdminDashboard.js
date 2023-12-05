// import React, { useState } from 'react';
// import Header from '../../header';
// //import { faCheckCircle, faTimesCircle, faTachometerAlt } from '@fortawesome/free-solid-svg-icons';
// import SecondaryNavbar from '../../secondaryNavbar';
// import ApproveContent from './ApproveContent';
// // import ManageUsers from './ManageUsers';
// import AdminMetrics from './AdminMetrics'; // Import AdminMetrics

// export default function AdminDashboard() {
//     const [activeContent, setActiveContent] = useState('approve');

//     const navbarData = [
//         {
//             name: "Approve Content",
//             icon: faCheckCircle,
//             content: 'approve'
//         },
//         // {
//         //     name: "Manage Users",
//         //     icon: faTimesCircle,
//         //     content: 'users'
//         // },
//         {
//             name: "Admin Metrics", // Updated name and icon
//             icon: faTachometerAlt, // Icon for metrics
//             content: 'metrics' // Content identifier
//         }
//         // Removed the ViewAnalytics entry
//     ];

//     // Function to handle navbar changes
//     const handleNavbarChange = (content) => {
//         setActiveContent(content);
//     };

//     return (
//         <div>
//             <Header auth={true} />
//             <SecondaryNavbar data={navbarData} setActiveContent={handleNavbarChange} />
//             <div className="ContentArea">
//                 {activeContent === 'approve' && <ApproveContent />}
//                 {/* {activeContent === 'users' && <ManageUsers />} */}
//                 {activeContent === 'metrics' && <AdminMetrics />} {/* Using AdminMetrics */}
//             </div>
//         </div>
//     );
// }


import React, { useState } from 'react';
import Header from '../../header';
import { faCheckCircle, faTachometerAlt } from '@fortawesome/free-solid-svg-icons';
import SecondaryNavbar from '../../secondaryNavbar';
import ApproveContent from './ApproveContent';
import AdminMetrics from './AdminMetrics';
import 'C:/Users/HIMANSHI KUSHWAHA/SE-GROUP-16/ui/src/App.css'; // Import app.css

export default function AdminDashboard() {
    const [activeContent, setActiveContent] = useState('approve');

    const navbarData = [
        {
            name: "Approve Content",
            icon: faCheckCircle,
            content: 'approve'
        },
        {
            name: "Admin Metrics",
            icon: faTachometerAlt,
            content: 'metrics'
        }
    ];

    const handleNavbarChange = (content) => {
        setActiveContent(content);
    };

    return (
        <div className="App"> {/* Use the App class for overall styling */}
            <Header auth={true} />
            <SecondaryNavbar data={navbarData} setActiveContent={handleNavbarChange} />
            <div className="ContentArea">
                {activeContent === 'approve' && <ApproveContent />}
                {activeContent === 'metrics' && <AdminMetrics />}
            </div>
        </div>
    );
}
