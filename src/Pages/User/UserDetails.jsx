// src/pages/User/UserDetails.jsx

import React, { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import {
  Avatar,
  Chip,
  Divider,
  Button,
} from "@mui/material";

import {
  ArrowLeftIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";

import Loader from "../../compoents/Loader";

import Breaker from "../../compoents/Breaker";

import toast from "react-hot-toast";

import { getSingleUser } from "../../Services/UserApi";

export default function UserDetails() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState(null);

  // ─────────────────────────────────────
  // FETCH USER
  // ─────────────────────────────────────

  const fetchUser = async () => {
    try {
      setLoading(true);

      const result = await getSingleUser(id);

      if (result?.status) {
        setUser(result?.data);
      }
    } catch (error) {
      console.error(error);

      toast.error(error.message || "Failed to fetch user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  // ─────────────────────────────────────
  // LOADING
  // ─────────────────────────────────────

  if (loading) return <Loader />;

  // ─────────────────────────────────────
  // NO USER
  // ─────────────────────────────────────

  if (!user) {
    return (
      <div className="p-10 text-center text-red-500">
        User not found
      </div>
    );
  }

  // ─────────────────────────────────────
  // UI
  // ─────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* BREAKER */}

      <div className="mb-6">
        <Breaker />
      </div>

      {/* TOP BAR */}

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">

        <div className="flex items-center bg-gray-800 text-white rouded-xl">

          <Button
            variant="outlined"
            onClick={() => navigate(-1)}
            startIcon={
              <ArrowLeftIcon className="h-5 w-5 text-white" />
            }
          >
            Back
          </Button>
        </div>
      </div>

      {/* MAIN CARD */}

      <div className="bg-white rounded-2xl shadow-md overflow-hidden">

        {/* HEADER */}

        <div className="bg-gradient-to-r from-[#03045E] via-[#0077B6] to-[#00B4D8] p-8 text-white">

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">

            {/* PROFILE */}

            <Avatar
              src={user?.profilePic}
              alt={user?.name}
              sx={{
                width: 120,
                height: 120,
                border: "4px solid white",
              }}
            />

            {/* INFO */}

            <div className="flex-1">

              <div className="flex flex-wrap items-center gap-3">

                <h2 className="text-3xl font-bold">
                  {user?.name || "N/A"}
                </h2>

                <Chip
                  label={
                    user?.isVerified
                      ? "Verified"
                      : "Unverified"
                  }
                  color={
                    user?.isVerified
                      ? "success"
                      : "error"
                  }
                />
              </div>

              <p className="mt-2 text-blue-100 text-lg">
                {user?.email || "No Email"}
              </p>

              <p className="mt-1 text-blue-100">
                {user?.countryCode}{" "}
                {user?.mobile}
              </p>

              <div className="mt-4 flex flex-wrap gap-3">

                <Chip
                  label={`Gender: ${
                    user?.gender || "N/A"
                  }`}
                  variant="outlined"
                  sx={{
                    color: "white",
                    borderColor: "white",
                  }}
                />

                <Chip
                  label={`City: ${
                    user?.city || "N/A"
                  }`}
                  variant="outlined"
                  sx={{
                    color: "white",
                    borderColor: "white",
                  }}
                />

                <Chip
                  label={`Rating: ${
                    user?.rating || 0
                  } ⭐`}
                  variant="outlined"
                  sx={{
                    color: "white",
                    borderColor: "white",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* BODY */}

        <div className="p-8">

          {/* SECTION */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* PERSONAL INFO */}

            <div>

              <h3 className="text-lg font-semibold text-gray-800 mb-5">
                Personal Information
              </h3>

              <div className="space-y-5">

                <InfoItem
                  label="Full Name"
                  value={user?.name}
                />

                <InfoItem
                  label="Email Address"
                  value={user?.email}
                />

                <InfoItem
                  label="Phone Number"
                  value={`${user?.countryCode} ${user?.mobile}`}
                />

                <InfoItem
                  label="Gender"
                  value={user?.gender}
                />

                <InfoItem
                  label="Date of Birth"
                  value={
                    user?.dob
                      ? new Date(
                          user.dob
                        ).toLocaleDateString()
                      : "N/A"
                  }
                />

                <InfoItem
                  label="City"
                  value={user?.city}
                />
              </div>
            </div>

            {/* ACCOUNT INFO */}

            <div>

              <h3 className="text-lg font-semibold text-gray-800 mb-5">
                Account Information
              </h3>

              <div className="space-y-5">

                <InfoItem
                  label="Wallet Balance"
                  value={`₹ ${user?.walletBalance || 0}`}
                />

                <InfoItem
                  label="Rating"
                  value={`${user?.rating || 0} (${user?.ratingCount || 0} Reviews)`}
                />

                <InfoItem
                  label="Created At"
                  value={
                    user?.createdAt
                      ? new Date(
                          user.createdAt
                        ).toLocaleString()
                      : "N/A"
                  }
                />
              </div>
            </div>
          </div>  
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────
// INFO ITEM COMPONENT
// ─────────────────────────────────────

const InfoItem = ({ label, value }) => {
  return (
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">
        {label}
      </p>

      <p className="text-base font-semibold text-gray-800 break-all">
        {value || "N/A"}
      </p>
    </div>
  );
};