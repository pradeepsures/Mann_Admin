
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { getDriverBooking } from "../../Services/DriverApi";
// import Loader from "../../compoents/Loader";
// import Breaker from "../../compoents/Breaker";

// export default function DriverBookingDetails() {
//   const { id } = useParams();

//   const [data, setData] = useState([]);
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const fetchDetails = async () => {
//     try {
//       setLoading(true);
//       const res = await getDriverBooking(id);

//       if (res?.status) {
//         setData(res.data || []);
//         setStats(res.stats || null);
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDetails();
//   }, [id]);

//   if (loading) return <Loader />;

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       {/* HEADER */}
//       <div className="flex justify-between items-center mb-6">
//         <Breaker />

//         {/* STATS */}
//         {stats && (
//           <div className="bg-gradient-to-r from-[#03045E] to-[#0077B6] text-white px-4 py-2 rounded-lg flex flex-wrap gap-4 text-sm shadow">
//             <span>Total: <b>{stats.totalBookings}</b></span>
//             <span>On Trip: <b>{stats.onTripCount}</b></span>
//             <span>Completed: <b>{stats.completedCount}</b></span>
//             <span>Cancelled: <b>{stats.cancelledCount}</b></span>
//             <span>Pending: <b>{stats.pendingPaymentCount}</b></span>
//           </div>
//         )}
//       </div>

//       {/* NO DATA */}
//       {!loading && data.length === 0 && (
//         <div className="text-center py-20 text-gray-500 text-lg bg-white rounded-xl shadow">
//           No bookings found
//         </div>
//       )}

//       {/* TABLE */}
//       <div className="bg-white rounded-xl shadow overflow-x-auto">
//         <table className="min-w-full text-sm">

//           {/* HEADER */}
//           <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
//             <tr>
//               <th className="px-4 py-3 text-left">Booking</th>
//               <th className="px-4 py-3 text-left">User</th>
//               <th className="px-4 py-3 text-left">Vehicle</th>
//               <th className="px-4 py-3 text-left">Route</th>
//               <th className="px-4 py-3 text-left">Fare</th>
//               <th className="px-4 py-3 text-left">Trip</th>
//               <th className="px-4 py-3 text-left">Status</th>
//               <th className="px-4 py-3 text-left">Timeline</th>
//             </tr>
//           </thead>

//           {/* BODY */}
//           <tbody className="divide-y">

//             {data.map((item) => (
//               <tr key={item._id} className="hover:bg-gray-50">

//                 {/* BOOKING */}
//                 <td className="px-4 py-3">
//                   <div className="font-semibold text-gray-800">
//                     {item.bookingNumber}
//                   </div>
//                   <div className="text-xs text-gray-500">
//                     {item.createdAtIST}
//                   </div>
//                 </td>

//                 {/* USER */}
//                 <td className="px-4 py-3">
//                   <div className="font-medium">{item.user?.name}</div>
//                 </td>

//                 {/* VEHICLE */}
//                 <td className="px-4 py-3">
//                   <div className="font-medium">
//                     {item.vehicle?.brand} {item.vehicle?.model}
//                   </div>
//                   <div className="text-xs text-gray-500">
//                     {item.vehicle?.carNumber}
//                   </div>
//                   <div className="text-xs text-gray-400 capitalize">
//                     {item.vehicle?.fuelType} / {item.vehicle?.color}
//                   </div>
//                 </td>

//                 {/* ROUTE */}
//                 <td className="px-4 py-3">
//                   <div className="text-xs text-gray-500">From:</div>
//                   <div className="text-sm">{item.pickup?.address}</div>

//                   <div className="text-xs text-gray-500 mt-1">To:</div>
//                   <div className="text-sm">{item.dropoff?.address}</div>
//                 </td>

//                 {/* FARE */}
//                 <td className="px-4 py-3">
//                   <div>₹ {item.estimatedFare}</div>
//                   {/* <div className="text-xs text-gray-500">
//                     Final: ₹ {item.fareBreakup?.final?.totalFare || 0}
//                   </div> */}
//                 </td>

//                 {/* TRIP */}
//                 <td className="px-4 py-3">
//                   <div className="text-sm">
//                     {item.estimatedKm || 0} km
//                   </div>
//                   <div className="text-xs text-gray-500">
//                     {item.estimatedMins || 0} mins
//                   </div>
//                 </td>

//                 {/* STATUS */}
//                 <td className="px-4 py-3">
//                   <div
//                     className={`inline-block px-2 py-1 rounded-full text-xs font-semibold capitalize
//                     ${
//                       item.tripStatus === "completed"
//                         ? "bg-green-100 text-green-700"
//                         : item.tripStatus === "in_progress"
//                         ? "bg-yellow-100 text-yellow-700"
//                         : item.tripStatus === "cancelled"
//                         ? "bg-red-100 text-red-700"
//                         : "bg-blue-100 text-blue-700"
//                     }`}
//                   >
//                     {item.tripStatus.replace("_", " ")}
//                   </div>

//                   <div className="text-xs text-gray-500 mt-1 capitalize">
//                     {item.paymentStatus} | {item.assignmentStatus}
//                   </div>
//                 </td>

//                 {/* TIMELINE */}
//                 <td className="px-4 py-3 text-xs text-gray-500">
//                   <div>Sch: {item.scheduledAtIST || "—"}</div>
//                   <div>Start: {item.tripStartAtIST || "—"}</div>
//                   <div>End: {item.tripEndAtIST || "—"}</div>
//                 </td>

//               </tr>
//             ))}

//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// ========================== PAGE / DriverBookingDetails.jsx ==========================

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDriverBooking } from "../../Services/DriverApi";
import Loader from "../../compoents/Loader";
import Breaker from "../../compoents/Breaker";

export default function DriverBookingDetails() {
  const { id } = useParams();

  const [data, setData] = useState([]);
  const [stats, setStats] = useState(null);

  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPage, setTotalPage] = useState(1);

  // FILTERS
  const [filters, setFilters] = useState({
    overallStatus: "",
    tripStatus: "",
    paymentStatus: "",
    assignmentStatus: "",
    bookingType: "",
    startDate: "",
    endDate: "",
    search: "",
  });

  // FORMAT FUNCTION
  const formatText = (text) => {
    if (!text) return "—";

    return text
      .replace(/[_-]/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // FETCH DATA
  const fetchDetails = async () => {
    try {
      setLoading(true);

      const params = {
        ...filters,
        page,
        limit,
      };

      const res = await getDriverBooking(id, params);

      if (res?.status) {
        setData(res.data || []);
        setStats(res.stats || null);
        setTotalPage(res.totalPage || 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // API CALL
  useEffect(() => {
    fetchDetails();
  }, [id, page, filters]);

  // HANDLE FILTER CHANGE
  const handleFilterChange = (e) => {
    setPage(1);

    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  // RESET FILTERS
  const resetFilters = () => {
    setPage(1);

    setFilters({
      overallStatus: "",
      tripStatus: "",
      paymentStatus: "",
      assignmentStatus: "",
      bookingType: "",
      startDate: "",
      endDate: "",
      search: "",
    });
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <Breaker />

        {/* STATS */}
        {stats && (
          <div className="bg-gradient-to-r from-[#03045E] to-[#0077B6] text-white px-4 py-3 rounded-lg flex flex-wrap gap-4 text-sm shadow">
            <span>Total: <b>{stats.totalBookings}</b></span>

            <span>Not Started: <b>{stats.notStartedCount}</b></span>

            <span>Enroute: <b>{stats.driverEnrouteCount}</b></span>

            <span>Arrived: <b>{stats.arrivedCount}</b></span>

            <span>In Progress: <b>{stats.inProgressCount}</b></span>

            <span>On Trip: <b>{stats.onTripCount}</b></span>

            <span>Completed: <b>{stats.completedCount}</b></span>

            <span>Cancelled: <b>{stats.cancelledCount}</b></span>

            <span>Paid: <b>{stats.paidCount}</b></span>

            <span>Pending Payment: <b>{stats.pendingPaymentCount}</b></span>
          </div>
        )}
      </div>

      {/* FILTERS */}
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* SEARCH */}
          <input
            type="text"
            name="search"
            placeholder="Search booking/address"
            value={filters.search}
            onChange={handleFilterChange}
            className="border rounded-lg px-3 py-2 outline-none"
          />

          {/* TRIP STATUS */}
          <select
            name="tripStatus"
            value={filters.tripStatus}
            onChange={handleFilterChange}
            className="border rounded-lg px-3 py-2 outline-none"
          >
            <option value="">All Trip Status</option>
            <option value="not_started">Not Started</option>
            <option value="driver_enroute">Driver Enroute</option>
            <option value="arrived">Arrived</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* PAYMENT STATUS */}
          <select
            name="paymentStatus"
            value={filters.paymentStatus}
            onChange={handleFilterChange}
            className="border rounded-lg px-3 py-2 outline-none"
          >
            <option value="">All Payment Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
          </select>

          {/* ASSIGNMENT STATUS */}
          <select
            name="assignmentStatus"
            value={filters.assignmentStatus}
            onChange={handleFilterChange}
            className="border rounded-lg px-3 py-2 outline-none"
          >
            <option value="">All Assignment Status</option>
            <option value="assigned">Assigned</option>
            <option value="unassigned">Unassigned</option>
          </select>

          {/* OVERALL STATUS */}
          <select
            name="overallStatus"
            value={filters.overallStatus}
            onChange={handleFilterChange}
            className="border rounded-lg px-3 py-2 outline-none"
          >
            <option value="">All Overall Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* BOOKING TYPE */}
          <select
            name="bookingType"
            value={filters.bookingType}
            onChange={handleFilterChange}
            className="border rounded-lg px-3 py-2 outline-none"
          >
            <option value="">All Booking Type</option>
            <option value="instant">Instant</option>
            <option value="scheduled">Scheduled</option>
          </select>

          {/* START DATE */}
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            className="border rounded-lg px-3 py-2 outline-none"
          />

          {/* END DATE */}
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            className="border rounded-lg px-3 py-2 outline-none"
          />
        </div>

        {/* RESET */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={resetFilters}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* NO DATA */}
      {!loading && data.length === 0 && (
        <div className="text-center py-20 text-gray-500 text-lg bg-white rounded-xl shadow">
          No bookings found
        </div>
      )}

      {/* TABLE */}
      {data.length > 0 && (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="min-w-full text-sm">

            {/* HEADER */}
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">Booking</th>
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Vehicle</th>
                <th className="px-4 py-3 text-left">Route</th>
                <th className="px-4 py-3 text-left">Fare</th>
                <th className="px-4 py-3 text-left">Trip</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Timeline</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody className="divide-y">

              {data.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">

                  {/* BOOKING */}
                  <td className="px-4 py-3">
                    <div className="font-semibold text-gray-800">
                      {item.bookingNumber}
                    </div>

                    <div className="text-xs text-gray-500">
                      {item.createdAtIST}
                    </div>
                  </td>

                  {/* USER */}
                  <td className="px-4 py-3">
                    <div className="font-medium">
                      {item.user?.name || "—"}
                    </div>

                    <div className="text-xs text-gray-500">
                      {item.user?.phone || "—"}
                    </div>
                  </td>

                  {/* VEHICLE */}
                  <td className="px-4 py-3">
                    <div className="font-medium">
                      {item.vehicle?.brand} {item.vehicle?.model}
                    </div>

                    <div className="text-xs text-gray-500">
                      {item.vehicle?.carNumber}
                    </div>

                    <div className="text-xs text-gray-400 capitalize">
                      {item.vehicle?.fuelType} / {item.vehicle?.color}
                    </div>
                  </td>

                  {/* ROUTE */}
                  <td className="px-4 py-3">
                    <div className="text-xs text-gray-500">From:</div>

                    <div className="text-sm">
                      {item.pickup?.address}
                    </div>

                    <div className="text-xs text-gray-500 mt-1">To:</div>

                    <div className="text-sm">
                      {item.dropoff?.address}
                    </div>
                  </td>

                  {/* FARE */}
                  <td className="px-4 py-3">
                    <div>₹ {item.estimatedFare}</div>
                  </td>

                  {/* TRIP */}
                  <td className="px-4 py-3">
                    <div className="text-sm">
                      {item.estimatedKm || 0} Km
                    </div>

                    <div className="text-xs text-gray-500">
                      {item.estimatedMins || 0} Mins
                    </div>
                  </td>

                  {/* STATUS */}
                  <td className="px-4 py-3">
                    <div
                      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold
                      ${
                        item.tripStatus === "completed"
                          ? "bg-green-100 text-green-700"
                          : item.tripStatus === "in_progress"
                          ? "bg-yellow-100 text-yellow-700"
                          : item.tripStatus === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {formatText(item.tripStatus)}
                    </div>

                    <div className="text-xs text-gray-500 mt-1">
                      {formatText(item.paymentStatus)} |{" "}
                      {formatText(item.assignmentStatus)}
                    </div>
                  </td>

                  {/* TIMELINE */}
                  <td className="px-4 py-3 text-xs text-gray-500">
                    <div>
                      Sch: {item.scheduledAtIST || "—"}
                    </div>

                    <div>
                      Start: {item.tripStartAtIST || "—"}
                    </div>

                    <div>
                      End: {item.tripEndAtIST || "—"}
                    </div>
                  </td>

                </tr>
              ))}

            </tbody>
          </table>
        </div>
      )}

      {/* PAGINATION */}
      {totalPage > 1 && (
        <div className="flex justify-center items-center gap-3 mt-6">

          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            className={`px-4 py-2 rounded-lg text-white
            ${
              page === 1
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#03045E]"
            }`}
          >
            Prev
          </button>

          <span className="font-medium">
            Page {page} of {totalPage}
          </span>

          <button
            disabled={page === totalPage}
            onClick={() => setPage((prev) => prev + 1)}
            className={`px-4 py-2 rounded-lg text-white
            ${
              page === totalPage
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#0077B6]"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}