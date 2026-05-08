// import React, { useEffect, useState } from "react";
// import { getAllDeashboard } from "../../Services/DeshboardApi";
// import toast from "react-hot-toast";
// import Loader from "../../compoents/Loader";
// import { useAuth } from "../../auth/AuthContext";

// import {
//   FaUsers,
//   FaUserCheck,
//   FaUserAstronaut,
//   FaStar,
//   FaComments,
//   FaPhoneAlt,
//   FaVideo,
//   FaRupeeSign,
//   FaWallet,
// } from "react-icons/fa";

// const Dashboard = () => {
//   const [data, setData] = useState(null);
//   const { auth } = useAuth();
//   const role = auth?.user?.role?.name;

//   const fetchDashboardStats = async () => {
//     try {
//       const response = await getAllDeashboard({
//         page: 1,
//         rowsPerPage: 10,
//         searchQuery: "",
//       });
//       if (response.status) {
//         setData(response.data);
//       }
//     } catch (error) {
//       toast.error("Failed to load dashboard stats");
//     }
//   };

//   useEffect(() => {
//     fetchDashboardStats();
//   }, []);

//   if (!data)
//     return (
//       <div className="p-6">
//         <Loader />
//       </div>
//     );

//   // USERS
//   const userData = [
//     { title: "Total Users", value: data.totalUsers, icon: <FaUsers /> },
//     { title: "Active Users", value: data.totalActiveUsers, icon: <FaUserCheck /> },
//     { title: "Total Astrologers", value: data.totalAstrologers, icon: <FaUserAstronaut /> },
//     { title: "Active Astrologers", value: data.totalActiveAstrologers, icon: <FaStar /> },
//   ];

//   // SERVICES
//   const serviceData = [
//     { title: "Chat Today", value: data.chatCountToday, icon: <FaComments /> },
//     { title: "Voice Call Today", value: data.voiceCallCountToday, icon: <FaPhoneAlt /> },
//     { title: "Video Call Today", value: data.videoCallCountToday, icon: <FaVideo /> },
//     { title: "Remedies Today", value: data.todayProductCount, icon: <FaStar /> },
//     { title: "Chat This Month", value: data.currentMonthChatCount, icon: <FaComments /> },
//     { title: "Voice Call This Month", value: data.voiceCallCountCurrentMonth, icon: <FaPhoneAlt /> },
//     { title: "Video Call This Month", value: data.currentMonthVideoCallCount, icon: <FaVideo /> },
//     { title: "Remedies This Month", value: data.currentMonthProductCount, icon: <FaStar /> },
//   ];

//   // REVENUE
//   const revenueData = [
//     { title: "Chat Revenue Today", value: `₹${data.todayChatRevenue}`, icon: <FaRupeeSign /> },
//     { title: "Voice Revenue Today", value: `₹${data.todayVoiceCallRevenue}`, icon: <FaRupeeSign /> },
//     { title: "Video Revenue Today", value: `₹${data.todayVideoCallRevenue}`, icon: <FaRupeeSign /> },
//     { title: "Remedies Revenue Today", value: `₹${data.todayProductRevenue}`, icon: <FaRupeeSign /> },
//     { title: "Chat Revenue (Month)", value: `₹${data.currentMonthChatRevenue}`, icon: <FaRupeeSign /> },
//     { title: "Voice Revenue (Month)", value: `₹${data.currentMonthVoiceCallRevenue}`, icon: <FaRupeeSign /> },
//     { title: "Video Revenue (Month)", value: `₹${data.currentMonthVideoCallRevenue}`, icon: <FaRupeeSign /> },
//     { title: "Remedies Revenue (Month)", value: `₹${data.currentMonthProductRevenue}`, icon: <FaRupeeSign /> },
//   ];

//   // WALLET
//   const walletData = [
//     { title: "Wallet Recharges Today", value: data.todayWalletRechargeCount, icon: <FaWallet /> },
//     { title: "Recharge Amount Today", value: `₹${data.todayWalletRechargeAmount}`, icon: <FaRupeeSign /> },
//     { title: "Wallet Recharges (Month)", value: data.currentMonthWalletRechargeCount, icon: <FaWallet /> },
//     { title: "Recharge Amount (Month)", value: `₹${data.currentMonthWalletRechargeAmount}`, icon: <FaRupeeSign /> },
//   ];

//   const renderSection = (title, items, isRevenue = false) => (
//     <div className="mb-12">
//       <h2 className="text-2xl font-bold text-gray-800 mb-6 tracking-wide">
//         {title}
//       </h2>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         {items.map((item, index) => (
//           <div
//             key={index}
//             className={`relative p-6 rounded-2xl shadow-md transition-all duration-300 
//               hover:shadow-2xl hover:-translate-y-1
//               ${
//                 isRevenue
//                   ? "bg-gradient-to-l from-[#5F0099] to-[#9F00FF] text-white"
//                   : "bg-white border border-gray-100"
//               }`}
//           >
//             {!isRevenue && (
//               <div className="absolute top-0 left-0 w-full h-1 rounded-t-2xl bg-gradient-to-l from-[#5F0099] to-[#9F00FF]" />
//             )}

//             <div
//               className={`w-14 h-14 flex items-center justify-center rounded-xl text-xl shadow-lg mb-4
//                 ${
//                   isRevenue
//                     ? "bg-white text-[#5F0099]"
//                     : "bg-gradient-to-l from-[#5F0099] to-[#9F00FF] text-white"
//                 }`}
//             >
//               {item.icon}
//             </div>

//             <h3
//               className={`text-sm font-medium uppercase tracking-wide mb-1 ${
//                 isRevenue ? "text-gray-100" : "text-gray-500"
//               }`}
//             >
//               {item.title}
//             </h3>

//             <p className="text-2xl font-bold">{item.value}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-6">
//       {renderSection("Users", userData)}

//       {role === "admin" && (
//         <>
//           {renderSection("Services", serviceData)}
//           {renderSection("Revenue", revenueData, true)}
//           {renderSection("Wallet", walletData)}
//         </>
//       )}
//     </div>
//   );
// };

// export default Dashboard;

// import React, { useState, useEffect } from "react";
// import Loader from "../../compoents/Loader";
// import toast from "react-hot-toast";
// import {
//   FaUsers,
//   FaUserCheck,
//   FaUserAstronaut,
//   FaStar,
//   FaCar,
//   FaRoad,
//   FaClock,
// } from "react-icons/fa";

// import { getAllDrivers } from "../../Services/DriverApi";
// import { getAllVehicles } from "../../Services/VehicleApi";
// import { getAllBookings } from "../../Services/BookingApi";

// const Dashboard = () => {
//   const [loading, setLoading] = useState(true);
//   const [driverStats, setDriverStats] = useState(null);
//   const [vehicleStats, setVehicleStats] = useState(null);
//   const [bookingStats, setBookingStats] = useState(null);

//   // Fetch all stats on component mount
//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         setLoading(true);

//         // Drivers
//         const driversRes = await getAllDrivers({
//           page: 1,
//           rowsPerPage: 1,
//           searchQuery: "",
//         });
//         setDriverStats(driversRes?.stats || null);

//         // Vehicles
//         const vehiclesRes = await getAllVehicles({
//           page: 1,
//           limit: 1,
//         });
//         setVehicleStats(vehiclesRes?.stats || null);

//         // Bookings / Trips
//         const bookingsRes = await getAllBookings({
//           page: 1,
//           rowsPerPage: 1,
//         });
//         setBookingStats(bookingsRes?.stats || null);
//       } catch (err) {
//         console.error("Dashboard fetch error:", err);
//         toast.error("Failed to load dashboard data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, []);

//   if (loading) {
//     return (
//       <div className="p-6">
//         <Loader />
//       </div>
//     );
//   }

//   // Drivers Cards
//   const driverData = [
//     { title: "Total Drivers", value: driverStats?.total || 0, icon: <FaUsers /> },
//     { title: "Verified Drivers", value: driverStats?.verifiedCount || 0, icon: <FaUserCheck /> },
//     { title: "Unverified Drivers", value: driverStats?.unverifiedCount || 0, icon: <FaUserAstronaut /> },
//     { title: "Online Drivers", value: driverStats?.onlineCount || 0, icon: <FaStar /> },
//     // { title: "Punched In", value: driverStats?.punchedInCount || 0, icon: <FaClock /> },
//     // { title: "Punched Out", value: driverStats?.punchedOutCount || 0, icon: <FaClock /> },
//     // { title: "Available Drivers", value: driverStats?.availableCount || 0, icon: <FaUserCheck /> },
//     // { title: "On Trip", value: driverStats?.onTripCount || 0, icon: <FaRoad /> },
//     // { title: "Assigned", value: driverStats?.assignedCount || 0, icon: <FaUserCheck /> },
//     // { title: "Unassigned", value: driverStats?.unassignedCount || 0, icon: <FaUsers /> },
//   ];

//   // Vehicles Cards
//   const vehicleData = [
//     { title: "Total Vehicles", value: vehicleStats?.total || 0, icon: <FaCar /> },
//     { title: "Active Vehicles", value: vehicleStats?.activeCount || 0, icon: <FaCar /> },
//     { title: "Inactive Vehicles", value: vehicleStats?.inactiveCount || 0, icon: <FaCar /> },
//     // { title: "On Trip Vehicles", value: vehicleStats?.onTripCount || 0, icon: <FaRoad /> },
//     { title: "Available Vehicles", value: vehicleStats?.availableCount || 0, icon: <FaCar /> },
//   ];

//   // Trips / Bookings Cards
//   const tripData = [
//   { title: "Total Trips", value: bookingStats?.totalBookings || 0,  icon: <FaRoad /> },
//   { title: "Active Trips", value: bookingStats?.activeTripCount || 0, icon: <FaRoad /> },
//   { title: "Completed", value: bookingStats?.completedCount || 0, icon: <FaUserCheck /> },
//   { title: "Cancelled", value: bookingStats?.cancelledCount || 0, icon: <FaUserAstronaut />},
//   // { title: "Assigned", value: bookingStats?.assignedCount || 0, icon: <FaUserCheck /> },
//   // { title: "Unassigned", value: bookingStats?.unassignedCount || 0, icon: <FaUsers />},
//   // { title: "Pending Payment", value: bookingStats?.pendingPaymentCount || 0, icon: <FaClock />},
// ];


//   const renderSection = (title, items, isBlue = false) => (
//     <div className="mb-12">
//       <h2 className="text-2xl font-bold text-gray-900 mb-6 tracking-wide">
//         {title}
//       </h2>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         {items.map((item, index) => (
//           <div
//             key={index}
//             className={`relative p-6 rounded-2xl shadow-md transition-all duration-300 
//               hover:shadow-2xl hover:-translate-y-1
//               ${
//                 isBlue
//                   ? "bg-[#03045E] text-white"
//                   : "bg-white border border-gray-100"
//               }`}
//           >
//             {!isBlue && (
//               <div className="absolute top-0 left-0 w-full h-1 rounded-t-2xl bg-[#03045E]" />
//             )}

//             <div
//               className={`w-14 h-14 flex items-center justify-center rounded-xl text-xl shadow-lg mb-4
//                 ${
//                   isBlue
//                     ? "bg-white text-[#03045E]"
//                     : "bg-[#03045E] text-white"
//                 }`}
//             >
//               {item.icon}
//             </div>

//             <h3
//               className={`text-sm font-medium uppercase tracking-wide mb-1 ${
//                 isBlue ? "text-blue-100" : "text-gray-500"
//               }`}
//             >
//               {item.title}
//             </h3>

//             <p className="text-3xl font-bold">{item.value}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
//       {renderSection("Drivers", driverData)}
//       {renderSection("Vehicles", vehicleData)}
//       {renderSection("Trips", tripData, true)}
//     </div>
//   );
// };

// export default Dashboard;

import React, { useState, useEffect } from "react";
import Loader from "../../compoents/Loader";
import toast from "react-hot-toast";
import {
  FaUsers,
  FaUserCheck,
  FaUserAstronaut,
  FaStar,
  FaCar,
  FaRoad,
} from "react-icons/fa";

import { getAllDrivers } from "../../Services/DriverApi";
import { getAllVehicles } from "../../Services/VehicleApi";
import { getAllBookings } from "../../Services/BookingApi";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [driverStats, setDriverStats] = useState(null);
  const [vehicleStats, setVehicleStats] = useState(null);
  const [bookingStats, setBookingStats] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const driversRes = await getAllDrivers({
          page: 1,
          rowsPerPage: 1,
          searchQuery: "",
        });
        setDriverStats(driversRes?.stats || null);

        const vehiclesRes = await getAllVehicles({
          page: 1,
          limit: 1,
        });
        setVehicleStats(vehiclesRes?.stats || null);

        const bookingsRes = await getAllBookings({
          page: 1,
          rowsPerPage: 1,
        });
        setBookingStats(bookingsRes?.stats || null);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <Loader />
      </div>
    );
  }

  // ✅ Trips FIRST
  const tripData = [
    { title: "Total Trips", value: bookingStats?.totalBookings || 0, icon: <FaRoad /> },
    { title: "Active Trips", value: bookingStats?.activeTripCount || 0, icon: <FaRoad /> },
    { title: "Completed", value: bookingStats?.completedCount || 0, icon: <FaUserCheck /> },
    { title: "Cancelled", value: bookingStats?.cancelledCount || 0, icon: <FaUserAstronaut /> },
  ];

  // ✅ Drivers SECOND
  const driverData = [
    { title: "Total Chauffeur", value: driverStats?.total || 0, icon: <FaUsers /> },
    { title: "Verified Chauffeur", value: driverStats?.verifiedCount || 0, icon: <FaUserCheck /> },
    { title: "Unverified Chauffeur", value: driverStats?.unverifiedCount || 0, icon: <FaUserAstronaut /> },
    { title: "Online Chauffeur", value: driverStats?.onlineCount || 0, icon: <FaStar /> },
  ];

  // ✅ Vehicles THIRD
  const vehicleData = [
    { title: "Total Vehicles", value: vehicleStats?.total || 0, icon: <FaCar /> },
    { title: "Active Vehicles", value: vehicleStats?.activeCount || 0, icon: <FaCar /> },
    { title: "Inactive Vehicles", value: vehicleStats?.inactiveCount || 0, icon: <FaCar /> },
    { title: "Available Vehicles", value: vehicleStats?.availableCount || 0, icon: <FaCar /> },
  ];

  // ✅ SAME STYLE FOR ALL (BLUE CARDS)
  const renderSection = (title, items) => (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 tracking-wide">
        {title}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item, index) => (
          <div
            key={index}
            className="relative p-6 rounded-2xl shadow-md transition-all duration-300 
              hover:shadow-2xl hover:-translate-y-1
              bg-[#03045E] text-white"
          >
            <div className="w-14 h-14 flex items-center justify-center rounded-xl text-xl shadow-lg mb-4 bg-white text-[#03045E]">
              {item.icon}
            </div>

            <h3 className="text-sm font-medium uppercase tracking-wide mb-1 text-blue-100">
              {item.title}
            </h3>

            <p className="text-3xl font-bold">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      
      {/* ✅ ORDER FIXED */}
      {renderSection("Trips", tripData)}
      {renderSection("Chauffeur", driverData)}
      {renderSection("Vehicles", vehicleData)}

    </div>
  );
};

export default Dashboard;