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
import { getAllUsers } from "../../Services/UserApi";
import { TiUserDelete } from "react-icons/ti";
import { useNavigate } from "react-router-dom";


const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [driverStats, setDriverStats] = useState(null);
  const [vehicleStats, setVehicleStats] = useState(null);
  const [bookingStats, setBookingStats] = useState(null);
  const [userStats, setUserstats] = useState(null);

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

        const userRes = await getAllUsers({
          page: 1,
          limit: 1,
        });
        setUserstats(userRes?.stats || null);
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

  // ✅ User
  const userData = [
    {
      title: "Total Users",
      value: userStats?.totalUsers || 0,
      icon: <FaUsers />,
      path: "/home/user",
    },
    {
      title: "Today Registerd Users",
      value: userStats?.todayRegisteredUsers || 0,
      icon: <FaUserCheck />,
      // path: "/home/user",
      path: "/home/user?filter=today",
    },
    {
      title: "This Month Registerd User",
      value: userStats?.monthlyRegisteredUsers || 0,
      icon: <FaUserAstronaut />,
      // path: "/home/user",
      path: "/home/user?filter=month",
    },
    {
      title: "On Trip User",
      value: userStats?.totalOnTripUsers || 0,
      icon: <TiUserDelete />,
      // path: "/home/user",
      path: "/home/user?filter=ontrip",
    },
  ];

  // ✅ Trips
  const tripData = [
    {
      title: "Total Trips",
      value: bookingStats?.totalBookings || 0,
      icon: <FaRoad />,
      path: "/home/booking",
    },
    {
      title: "Active Trips",
      value: bookingStats?.activeTripCount || 0,
      icon: <FaRoad />,
      // path: "/home/booking",
      path: "/home/booking?filter=active",
    },
    {
      title: "Completed",
      value: bookingStats?.completedCount || 0,
      icon: <FaUserCheck />,
      // path: "/home/booking",
      path: "/home/booking?filter=completed",
    },
    {
      title: "Cancelled",
      value: bookingStats?.cancelledCount || 0,
      icon: <FaUserAstronaut />,
      // path: "/home/booking",
      path: "/home/booking?filter=cancelled",
    },
  ];

  // ✅ Drivers
  const driverData = [
    {
      title: "Total Chauffeur",
      value: driverStats?.total || 0,
      icon: <FaUsers />,
      path: "/home/driver",
    },
    {
      title: "Verified Chauffeur",
      value: driverStats?.verifiedCount || 0,
      icon: <FaUserCheck />,
      // paht: "/home/driver",
          path: "/home/driver?isVerified=true",
    },
    {
      title: "Unverified Chauffeur",
      value: driverStats?.unverifiedCount || 0,
      icon: <FaUserAstronaut />,
      // paht: "/home/driver",
        path: "/home/driver?isVerified=false",
    },
    {
      title: "Online Chauffeur",
      value: driverStats?.onlineCount || 0,
      icon: <FaStar />,
      // paht: "/home/driver",
        path: "/home/driver?isOnline=true",
    },
  ];

  // ✅ Vehicles
  const vehicleData = [
    {
      title: "Total Vehicles",
      value: vehicleStats?.total || 0,
      icon: <FaCar />,
      path: "/home/vehicle",
    },
    {
      title: "Active Vehicles",
      value: vehicleStats?.activeCount || 0,
      icon: <FaCar />,
      // path: "/home/vehicle",
          path: "/home/vehicle?isActive=true",
    },
    {
      title: "On Trip Vehicles",
      value: vehicleStats?.onTripCount || 0,
      icon: <FaCar />,
      // path: "/home/vehicle",
      path: "/home/vehicle?isOnTrip=true"
       
    },
    {
      title: "Available Vehicles",
      value: vehicleStats?.availableCount || 0,
      icon: <FaCar />,
      // path: "/home/vehicle",
          path: "/home/vehicle?isAvailable=true",
    },
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

            <h3
              onClick={() => navigate(item.path)}
              className="text-sm font-medium uppercase tracking-wide mb-1 text-blue-100 cursor-pointer"
            >
              {item.title}
            </h3>

            <p
              onClick={() => navigate(item.path)}
              className="text-3xl font-bold cursor-pointer"
            >
              {item.value}
            </p>

            {/* <h3 className="text-sm font-medium uppercase tracking-wide mb-1 text-blue-100">
              {item.title}
            </h3>

            <p className="text-3xl font-bold">{item.value}</p> */}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* ✅ ORDER FIXED */}
      {renderSection("Users", userData)}
      {renderSection("Trips", tripData)}
      {renderSection("Chauffeur", driverData)}
      {renderSection("Vehicles", vehicleData)}
    </div>
  );
};

export default Dashboard;
