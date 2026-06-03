import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Breaker from "../../compoents/Breaker";
import Loader from "../../compoents/Loader";
import toast from "react-hot-toast";

import { getPunchById } from "../../Services/PunchesApi";

const formatText = (text) => {
  if (!text) return "N/A";

  return text.replace(/[_-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

const PunchView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getPunchById(id);
      if (res?.status) {
        setData(res.data);
      } else {
        setError(res?.message || "Failed to fetch punch details");
        toast.error(res?.message || "Failed to fetch punch details");
      }
    } catch (err) {
      const errorMsg = err.message || "Failed to fetch punch details";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  const show = (val) => val || "N/A";

  return (
    <div className="m-3">
      <Breaker />

      <div className="mt-6 bg-white p-6 rounded-2xl shadow-xl w-full">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Punch Details</h2>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
          >
            Back
          </button>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p className="font-semibold">Error</p>
            <p>{error}</p>
            <p className="text-sm mt-2">Punch ID: {id}</p>
          </div>
        )}

        {data ? (
          <div className="space-y-6">
            {/* 🔹 PUNCH DETAILS */}
            <div className="bg-gray-50 p-5 rounded-xl border">
              <h3 className="font-semibold mb-4 text-gray-700">
                Punch Details
              </h3>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium">{show(data.status)}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Total Minutes</p>
                  <p>{show(data.totalMinutes)}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Admin Override</p>
                  <p>{data.adminOverride ? "Yes" : "No"}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Punch In Time</p>
                  <p>{show(data.punchInAtIST)}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Punch Out Time</p>
                  <p>{show(data.punchOutAtIST)}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Punch In Valid</p>
                  <p>{data.punchInValid ? "Valid" : "Invalid"}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Punch Out Valid</p>
                  <p>{data.punchOutValid ? "Valid" : "Invalid"}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">In Distance</p>
                  <p>{show(data.punchInDistanceFromZone)} m</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Out Distance</p>
                  <p>{show(data.punchOutDistanceFromZone)} m</p>
                </div>
              </div>

              {/* LOCATION */}
              <div className="grid md:grid-cols-2 gap-4 mt-5">
                <div>
                  <p className="text-sm text-gray-500">Punch In Location</p>
                  <p>
                    Lat: {show(data?.punchInLocation?.lat)} <br />
                    Lng: {show(data?.punchInLocation?.lng)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Punch Out Location</p>
                  <p>
                    Lat: {show(data?.punchOutLocation?.lat)} <br />
                    Lng: {show(data?.punchOutLocation?.lng)}
                  </p>
                </div>
              </div>
            </div>

            {/* 🔹 DRIVER DETAILS */}
            <div className="bg-blue-50 p-5 rounded-xl border">
              <h3 className="font-semibold mb-4 text-blue-700">
                Driver Details
              </h3>

              <div className="grid md:grid-cols-3 gap-4 items-center">
                <div>
                  <p className="text-gray-500 text-sm">Name</p>
                  <p className="font-medium">{show(data?.driver?.name)}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Phone</p>
                  <p className="font-medium">{show(data?.driver?.phone)}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Profile</p>
                  {data?.driver?.profilePic ? (
                    <img
                      src={data.driver.profilePic}
                      alt="driver"
                      className="w-16 h-16 rounded-full object-cover border"
                    />
                  ) : (
                    <p>N/A</p>
                  )}
                </div>
              </div>
            </div>

            {/* 🔹 CURRENT BOOKING DETAILS */}
            {data?.currentBooking?.booking && (
              <div className="bg-orange-50 p-5 rounded-xl border">
                <h3 className="font-semibold mb-4 text-orange-700">
                  Current Booking Details
                </h3>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Booking Number</p>
                    <p className="font-medium">
                      {show(data.currentBooking.booking.bookingNumber)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Traveller Name</p>
                    <p className="font-medium">
                      {show(data.currentBooking.booking.travellerName)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Traveller Phone</p>
                    <p className="font-medium">
                      {show(data.currentBooking.booking.travellerPhone)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Booking Type</p>
                    <p>{formatText(data.currentBooking.booking.bookingType)}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Trip Status</p>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                      {formatText(data.currentBooking.booking.tripStatus)}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Assignment Status</p>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                      {formatText(data.currentBooking.booking.assignmentStatus)}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Overall Status</p>
                    <p>
                      {formatText(data.currentBooking.booking.overallStatus)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Estimated Fare</p>
                    <p className="font-semibold text-green-600">
                      ₹ {data.currentBooking.booking.estimatedFare || 0}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Scheduled At</p>
                    <p>
                      {data.currentBooking.booking.scheduledAt
                        ? new Date(
                            data.currentBooking.booking.scheduledAt,
                          ).toLocaleString()
                        : "N/A"}
                    </p>
                  </div>
                </div>

                {/* Pickup & Drop */}
                <div className="grid md:grid-cols-2 gap-4 mt-5">
                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-semibold text-green-700 mb-2">
                      Pickup Details
                    </h4>

                    <p className="text-sm text-gray-500">Address</p>
                    <p>{show(data.currentBooking.booking.pickup?.address)}</p>

                    <div className="mt-2 text-xs text-gray-600">
                      Lat: {show(data.currentBooking.booking.pickup?.lat)}
                      <br />
                      Lng: {show(data.currentBooking.booking.pickup?.lng)}
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-semibold text-red-700 mb-2">
                      Drop Details
                    </h4>

                    <p className="text-sm text-gray-500">Address</p>
                    <p>{show(data.currentBooking.booking.dropoff?.address)}</p>

                    <div className="mt-2 text-xs text-gray-600">
                      Lat: {show(data.currentBooking.booking.dropoff?.lat)}
                      <br />
                      Lng: {show(data.currentBooking.booking.dropoff?.lng)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 🔹 REGION & PUNCH REGION */}
            <div className="bg-green-50 p-5 rounded-xl border">
              <h3 className="font-semibold mb-4 text-green-700">
                Region Details
              </h3>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Region Name</p>
                  <p className="font-medium">{show(data?.region?.name)}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">State</p>
                  <p className="font-medium">{show(data?.region?.state)}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Punch Region</p>
                  <p className="font-medium">{show(data?.punchRegion?.name)}</p>
                </div>

                <div className="md:col-span-3">
                  <p className="text-sm text-gray-500">Address</p>
                  <p>{show(data?.punchRegion?.address)}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Center Lat</p>
                  <p>{show(data?.punchRegion?.centerLat)}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Center Lng</p>
                  <p>{show(data?.punchRegion?.centerLng)}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Radius</p>
                  <p>{show(data?.punchRegion?.radiusMeters)} m</p>
                </div>
              </div>
            </div>
          </div>
        ) : !error ? (
          <p className="text-center text-gray-500 py-8">No Data Found</p>
        ) : null}
      </div>
    </div>
  );
};

export default PunchView;
