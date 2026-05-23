// import React, { useEffect, useState, useCallback } from "react";
// import { useParams } from "react-router-dom";
// import { getBookingsByUserApi } from "../../Services/UserApi";
// import Loader from "../../compoents/Loader";
// import toast from "react-hot-toast";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Pagination,
//   Stack,
//   Chip,
// } from "@mui/material";

// export default function UserBookingList() {
//   const { id } = useParams();

//   const [loading, setLoading] = useState(false);

//   const [data, setData] = useState([]);
//   const [stats, setStats] = useState({});

//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(0);

//   // SEARCH
//   const [search, setSearch] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");

//   // FILTERS
//   const [overallStatus, setOverallStatus] = useState("");
//   const [tripStatus, setTripStatus] = useState("");
//   const [paymentStatus, setPaymentStatus] = useState("");
//   const [assignmentStatus, setAssignmentStatus] = useState("");
//   const [bookingType, setBookingType] = useState("");

//   // DATE FILTER
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");

//   const fetchBookings = useCallback(async () => {
//     try {
//       setLoading(true);

//       const result = await getBookingsByUserApi({
//         userId: id,
//         page,
//         rowsPerPage: 10,

//         search: searchQuery,

//         overallStatus,
//         tripStatus,
//         paymentStatus,
//         assignmentStatus,
//         bookingType,

//         startDate,
//         endDate,
//       });

//       if (result?.status) {
//         setData(result?.data || []);
//         setStats(result?.stats || {});
//         setTotalPages(result?.totalPage || 0);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     } finally {
//       setLoading(false);
//     }
//   }, [
//     id,
//     page,
//     searchQuery,
//     overallStatus,
//     tripStatus,
//     paymentStatus,
//     assignmentStatus,
//     bookingType,
//     startDate,
//     endDate,
//   ]);

//   useEffect(() => {
//     fetchBookings();
//   }, [fetchBookings]);

//   const resetFilters = () => {
//     setSearch("");
//     setSearchQuery("");

//     setOverallStatus("");
//     setTripStatus("");
//     setPaymentStatus("");
//     setAssignmentStatus("");
//     setBookingType("");

//     setStartDate("");
//     setEndDate("");

//     setPage(1);
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "completed":
//       case "paid":
//       case "assigned":
//         return "success";

//       case "cancelled":
//         return "error";

//       case "pending":
//       case "pending_payment":
//       case "unassigned":
//         return "warning";

//       default:
//         return "primary";
//     }
//   };

//   // FORMAT TEXT
//   const formatText = (text) => {
//     if (!text) return "-";

//     return text
//       ?.replace(/_/g, " ")
//       ?.replace(/-/g, " ")
//       ?.replace(/\b\w/g, (char) => char.toUpperCase());
//   };

//   if (loading) return <Loader />;

//   return (
//     <div className="w-full p-4 md:p-6 overflow-hidden">

//       {/* FILTERS */}

//       <div className="bg-white shadow rounded-2xl p-4 md:p-5 mb-6">

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

//           {/* SEARCH */}

//           <div className="flex gap-2 sm:col-span-2">

//             <input
//               type="text"
//               placeholder="Search booking..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="border px-4 py-2 rounded-lg w-full outline-none"
//             />

//             <button
//               onClick={() => {
//                 setSearchQuery(search);
//                 setPage(1);
//               }}
//               className="bg-primary text-white px-4 py-2 rounded-lg whitespace-nowrap"
//             >
//               Search
//             </button>

//           </div>

//           {/* RESET */}

//           <div className="flex items-center">

//             <button
//               onClick={resetFilters}
//               className="bg-gray-500 hover:bg-gray-600 text-white text-sm px-3 py-2 rounded-lg w-fit"
//             >
//               Reset
//             </button>

//           </div>

//         </div>

//         {/* FILTER GRID */}

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">

//           {/* OVERALL STATUS */}

//           <select
//             value={overallStatus}
//             onChange={(e) => {
//               setOverallStatus(e.target.value);
//               setPage(1);
//             }}
//             className="border px-4 py-2 rounded-lg outline-none"
//           >
//             <option value="">All Overall Status</option>

//             <option value="pending_payment">
//               Pending Payment
//             </option>

//             <option value="completed">
//               Completed
//             </option>

//             <option value="cancelled">
//               Cancelled
//             </option>
//           </select>

//           {/* TRIP STATUS */}

//           <select
//             value={tripStatus}
//             onChange={(e) => {
//               setTripStatus(e.target.value);
//               setPage(1);
//             }}
//             className="border px-4 py-2 rounded-lg outline-none"
//           >
//             <option value="">All Trip Status</option>

//             <option value="not_started">
//               Not Started
//             </option>

//             <option value="driver_enroute">
//               Driver Enroute
//             </option>

//             <option value="arrived">
//               Arrived
//             </option>

//             <option value="in_progress">
//               In Progress
//             </option>

//             <option value="completed">
//               Completed
//             </option>

//             <option value="cancelled">
//               Cancelled
//             </option>
//           </select>

//           {/* PAYMENT STATUS */}

//           <select
//             value={paymentStatus}
//             onChange={(e) => {
//               setPaymentStatus(e.target.value);
//               setPage(1);
//             }}
//             className="border px-4 py-2 rounded-lg outline-none"
//           >
//             <option value="">All Payment Status</option>

//             <option value="paid">
//               Paid
//             </option>

//             <option value="pending">
//               Pending
//             </option>
//           </select>

//           {/* ASSIGNMENT STATUS */}

//           <select
//             value={assignmentStatus}
//             onChange={(e) => {
//               setAssignmentStatus(e.target.value);
//               setPage(1);
//             }}
//             className="border px-4 py-2 rounded-lg outline-none"
//           >
//             <option value="">All Assignment Status</option>

//             <option value="assigned">
//               Assigned
//             </option>

//             <option value="unassigned">
//               Unassigned
//             </option>
//           </select>

//           {/* BOOKING TYPE */}

//           <select
//             value={bookingType}
//             onChange={(e) => {
//               setBookingType(e.target.value);
//               setPage(1);
//             }}
//             className="border px-4 py-2 rounded-lg outline-none"
//           >
//             <option value="">All Booking Types</option>

//             <option value="one_way">
//               One Way
//             </option>

//             <option value="round_trip">
//               Round Trip
//             </option>

//             <option value="hourly">
//               Hourly
//             </option>
//           </select>

//           {/* START DATE */}

//           <input
//             type="date"
//             value={startDate}
//             onChange={(e) => {
//               setStartDate(e.target.value);
//               setPage(1);
//             }}
//             className="border px-4 py-2 rounded-lg outline-none"
//           />

//           {/* END DATE */}

//           <input
//             type="date"
//             value={endDate}
//             onChange={(e) => {
//               setEndDate(e.target.value);
//               setPage(1);
//             }}
//             className="border px-4 py-2 rounded-lg outline-none"
//           />

//         </div>

//       </div>

//       {/* STATS */}

//       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">

//         <div className="bg-white shadow rounded-xl p-4">
//           <h2 className="font-semibold text-sm text-gray-500">
//             Total
//           </h2>

//           <p className="text-2xl font-bold">
//             {stats?.totalBookings || 0}
//           </p>
//         </div>

//         <div className="bg-white shadow rounded-xl p-4">
//           <h2 className="font-semibold text-sm text-gray-500">
//             Completed
//           </h2>

//           <p className="text-2xl font-bold text-green-600">
//             {stats?.completedCount || 0}
//           </p>
//         </div>

//         <div className="bg-white shadow rounded-xl p-4">
//           <h2 className="font-semibold text-sm text-gray-500">
//             On Trip
//           </h2>

//           <p className="text-2xl font-bold text-blue-600">
//             {stats?.onTripCount || 0}
//           </p>
//         </div>

//         <div className="bg-white shadow rounded-xl p-4">
//           <h2 className="font-semibold text-sm text-gray-500">
//             Pending Payment
//           </h2>

//           <p className="text-2xl font-bold text-orange-600">
//             {stats?.pendingPaymentCount || 0}
//           </p>
//         </div>

//         <div className="bg-white shadow rounded-xl p-4">
//           <h2 className="font-semibold text-sm text-gray-500">
//             Paid
//           </h2>

//           <p className="text-2xl font-bold text-green-600">
//             {stats?.paidCount || 0}
//           </p>
//         </div>

//       </div>

//       {/* TABLE */}

//       <div className="w-full overflow-hidden rounded-2xl shadow">

//         <TableContainer
//           component={Paper}
//           sx={{
//             width: "100%",
//             overflowX: "auto",
//           }}
//         >

//           <Table
//             sx={{
//               minWidth: 1200,
//             }}
//           >

//             <TableHead>

//               <TableRow
//                 sx={{
//                   backgroundColor: "#f9fafb",
//                 }}
//               >

//                 <TableCell>
//                   <strong>Booking No</strong>
//                 </TableCell>

//                 <TableCell>
//                   <strong>Traveller</strong>
//                 </TableCell>

//                 <TableCell>
//                   <strong>Phone</strong>
//                 </TableCell>

//                 <TableCell>
//                   <strong>Pickup</strong>
//                 </TableCell>

//                 <TableCell>
//                   <strong>Dropoff</strong>
//                 </TableCell>

//                 <TableCell>
//                   <strong>Segment</strong>
//                 </TableCell>

//                 <TableCell>
//                   <strong>Booking Type</strong>
//                 </TableCell>

//                 <TableCell>
//                   <strong>Fare</strong>
//                 </TableCell>

//                 <TableCell>
//                   <strong>Payment</strong>
//                 </TableCell>

//                 <TableCell>
//                   <strong>Trip</strong>
//                 </TableCell>

//                 <TableCell>
//                   <strong>Assignment</strong>
//                 </TableCell>

//                 <TableCell>
//                   <strong>Overall</strong>
//                 </TableCell>

//                 <TableCell>
//                   <strong>Driver</strong>
//                 </TableCell>

//                 <TableCell>
//                   <strong>Vehicle</strong>
//                 </TableCell>

//                 <TableCell>
//                   <strong>Created</strong>
//                 </TableCell>

//               </TableRow>

//             </TableHead>

//             <TableBody>

//               {data?.length > 0 ? (
//                 data?.map((row) => (

//                   <TableRow
//                     key={row?._id}
//                     hover
//                   >

//                     <TableCell>
//                       <div className="font-semibold whitespace-nowrap">
//                         {row?.bookingNumber}
//                       </div>
//                     </TableCell>

//                     <TableCell>

//                       <div className="min-w-[180px]">

//                         <div className="font-semibold">
//                           {row?.travellerName || "-"}
//                         </div>

//                         <div className="text-sm text-gray-500 break-all">
//                           {row?.travellerEmail || "-"}
//                         </div>

//                       </div>

//                     </TableCell>

//                     <TableCell className="whitespace-nowrap">
//                       {row?.travellerPhone || "-"}
//                     </TableCell>

//                     <TableCell>

//                       <div className="max-w-[220px] break-words text-sm">
//                         {row?.pickup?.address || "-"}
//                       </div>

//                     </TableCell>

//                     <TableCell>

//                       <div className="max-w-[220px] break-words text-sm">
//                         {row?.dropoff?.address || "-"}
//                       </div>

//                     </TableCell>

//                     <TableCell className="whitespace-nowrap">
//                       {row?.segment?.name || "-"}
//                     </TableCell>

//                     <TableCell className="whitespace-nowrap">
//                       {formatText(row?.bookingType)}
//                     </TableCell>

//                     <TableCell className="whitespace-nowrap">

//                       <div className="font-semibold">
//                         ₹{row?.estimatedFare || 0}
//                       </div>

//                       <div className="text-xs text-gray-500">
//                         {row?.estimatedKm || 0} KM
//                       </div>

//                     </TableCell>

//                     <TableCell className="whitespace-nowrap">

//                       <Chip
//                         label={formatText(row?.paymentStatus)}
//                         color={getStatusColor(row?.paymentStatus)}
//                         size="small"
//                       />

//                     </TableCell>

//                     <TableCell className="whitespace-nowrap">

//                       <Chip
//                         label={formatText(row?.tripStatus)}
//                         color={getStatusColor(row?.tripStatus)}
//                         size="small"
//                       />

//                     </TableCell>

//                     <TableCell className="whitespace-nowrap">

//                       <Chip
//                         label={formatText(row?.assignmentStatus)}
//                         color={getStatusColor(row?.assignmentStatus)}
//                         size="small"
//                       />

//                     </TableCell>

//                     <TableCell className="whitespace-nowrap">

//                       <Chip
//                         label={formatText(row?.overallStatus)}
//                         color={getStatusColor(row?.overallStatus)}
//                         size="small"
//                       />

//                     </TableCell>

//                     <TableCell>

//                       {row?.driver ? (
//                         <div className="min-w-[150px]">

//                           <div className="font-semibold">
//                             {row?.driver?.name}
//                           </div>

//                           <div className="text-sm text-gray-500">
//                             {row?.driver?.phone}
//                           </div>

//                         </div>
//                       ) : (
//                         "-"
//                       )}

//                     </TableCell>

//                     <TableCell className="whitespace-nowrap">
//                       {row?.vehicle?.vehicleNumber || "-"}
//                     </TableCell>

//                     <TableCell className="whitespace-nowrap text-sm">
//                       {row?.createdAtIST || "-"}
//                     </TableCell>

//                   </TableRow>
//                 ))
//               ) : (
//                 <TableRow>

//                   <TableCell
//                     colSpan={15}
//                     align="center"
//                   >
//                     No Bookings Found
//                   </TableCell>

//                 </TableRow>
//               )}

//             </TableBody>

//           </Table>

//         </TableContainer>

//       </div>

//       {/* PAGINATION */}

//       <Stack
//         spacing={2}
//         mt={4}
//         alignItems="center"
//       >

//         <Pagination
//           count={totalPages}
//           page={page}
//           onChange={(e, value) => setPage(value)}
//           color="primary"
//         />

//       </Stack>

//     </div>
//   );
// }

import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getBookingsByUserApi } from "../../Services/UserApi";
import Loader from "../../compoents/Loader";
import toast from "react-hot-toast";
import Breaker from "../../compoents/Breaker";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Stack,
  Chip,
} from "@mui/material";

export default function UserBookingList() {
  const { id } = useParams();

  const [loading, setLoading] = useState(false);

  const [data, setData] = useState([]);
  const [stats, setStats] = useState({});

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // SEARCH
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // FILTERS
  const [overallStatus, setOverallStatus] = useState("");
  const [tripStatus, setTripStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [assignmentStatus, setAssignmentStatus] = useState("");
  const [bookingType, setBookingType] = useState("");

  // DATE FILTER
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);

      const result = await getBookingsByUserApi({
        userId: id,
        page,
        rowsPerPage: 10,

        search: searchQuery,

        overallStatus,
        tripStatus,
        paymentStatus,
        assignmentStatus,
        bookingType,

        startDate,
        endDate,
      });

      if (result?.status) {
        setData(result?.data || []);
        setStats(result?.stats || {});
        setTotalPages(result?.totalPage || 0);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [
    id,
    page,
    searchQuery,
    overallStatus,
    tripStatus,
    paymentStatus,
    assignmentStatus,
    bookingType,
    startDate,
    endDate,
  ]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const resetFilters = () => {
    setSearch("");
    setSearchQuery("");

    setOverallStatus("");
    setTripStatus("");
    setPaymentStatus("");
    setAssignmentStatus("");
    setBookingType("");

    setStartDate("");
    setEndDate("");

    setPage(1);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
      case "paid":
      case "assigned":
        return "success";

      case "cancelled":
        return "error";

      case "pending":
      case "pending_payment":
      case "unassigned":
        return "warning";

      default:
        return "primary";
    }
  };

  // FORMAT TEXT
  const formatText = (text) => {
    if (!text) return "-";

    return text
      ?.replace(/_/g, " ")
      ?.replace(/-/g, " ")
      ?.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  if (loading) return <Loader />;

  return (
    <div className="w-full max-w-full p-3 md:p-5 overflow-hidden">
      <div className="mb-4">
        <Breaker />
      </div>
      {/* STATS */}

      {stats && (
        <div className="bg-gradient-to-r from-[#03045E] to-[#0077B6] text-white shadow-md rounded-2xl px-4 py-3 mb-5 text-sm flex items-center gap-3 flex-wrap">
          <span>
            <span className="opacity-80">Total:</span>{" "}
            <span className="font-semibold">{stats?.totalBookings || 0}</span>
          </span>

          <span className="opacity-40">|</span>

          <span>
            <span className="opacity-80">Not Started:</span>{" "}
            <span className="font-semibold text-cyan-300">
              {stats?.notStartedCount || 0}
            </span>
          </span>

          <span className="opacity-40">|</span>

          <span>
            <span className="opacity-80">Driver Enroute:</span>{" "}
            <span className="font-semibold text-blue-300">
              {stats?.driverEnrouteCount || 0}
            </span>
          </span>

          <span className="opacity-40">|</span>

          <span>
            <span className="opacity-80">Arrived:</span>{" "}
            <span className="font-semibold text-indigo-300">
              {stats?.arrivedCount || 0}
            </span>
          </span>

          <span className="opacity-40">|</span>

          <span>
            <span className="opacity-80">In Progress:</span>{" "}
            <span className="font-semibold text-yellow-300">
              {stats?.inProgressCount || 0}
            </span>
          </span>

          <span className="opacity-40">|</span>

          <span>
            <span className="opacity-80">On Trip:</span>{" "}
            <span className="font-semibold text-orange-300">
              {stats?.onTripCount || 0}
            </span>
          </span>

          <span className="opacity-40">|</span>

          <span>
            <span className="opacity-80">Completed:</span>{" "}
            <span className="font-semibold text-green-300">
              {stats?.completedCount || 0}
            </span>
          </span>

          <span className="opacity-40">|</span>

          <span>
            <span className="opacity-80">Cancelled:</span>{" "}
            <span className="font-semibold text-red-300">
              {stats?.cancelledCount || 0}
            </span>
          </span>

          <span className="opacity-40">|</span>

          <span>
            <span className="opacity-80">Paid:</span>{" "}
            <span className="font-semibold text-green-200">
              {stats?.paidCount || 0}
            </span>
          </span>

          <span className="opacity-40">|</span>

          <span>
            <span className="opacity-80">Pending Payment:</span>{" "}
            <span className="font-semibold text-orange-200">
              {stats?.pendingPaymentCount || 0}
            </span>
          </span>
        </div>
      )}
      {/* FILTER SECTION */}


      <div className="bg-white shadow rounded-2xl p-4 mb-5">
        {/* SEARCH + RESET */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div className="md:col-span-2 flex gap-2">
            <input
              type="text"
              placeholder="Search By Booking/Pickup/Drop"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 px-4 py-2 rounded-lg w-full outline-none"
            />

            <button
              onClick={() => {
                setSearchQuery(search);
                setPage(1);
              }}
              className="bg-primary text-white px-5 rounded-lg whitespace-nowrap"
            >
              Search
            </button>
          </div>

          <div className="flex justify-start md:justify-end">
            <button
              onClick={resetFilters}
              className="bg-gray-500 hover:bg-gray-600 text-white text-sm px-4 py-2 rounded-lg"
            >
              Reset
            </button>
          </div>
        </div>

        {/* FILTERS */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* OVERALL STATUS */}

          <select
            value={overallStatus}
            onChange={(e) => {
              setOverallStatus(e.target.value);
              setPage(1);
            }}
            className="border border-gray-300 px-4 py-2 rounded-lg outline-none"
          >
            <option value="">All Overall Status</option>
            <option value="pending_payment">Pending Payment</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* TRIP STATUS */}

          <select
            value={tripStatus}
            onChange={(e) => {
              setTripStatus(e.target.value);
              setPage(1);
            }}
            className="border border-gray-300 px-4 py-2 rounded-lg outline-none"
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
            value={paymentStatus}
            onChange={(e) => {
              setPaymentStatus(e.target.value);
              setPage(1);
            }}
            className="border border-gray-300 px-4 py-2 rounded-lg outline-none"
          >
            <option value="">All Payment Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
          </select>

          {/* ASSIGNMENT STATUS */}

          <select
            value={assignmentStatus}
            onChange={(e) => {
              setAssignmentStatus(e.target.value);
              setPage(1);
            }}
            className="border border-gray-300 px-4 py-2 rounded-lg outline-none"
          >
            <option value="">All Assignment Status</option>
            <option value="assigned">Assigned</option>
            <option value="unassigned">Unassigned</option>
          </select>

          {/* BOOKING TYPE */}

          <select
            value={bookingType}
            onChange={(e) => {
              setBookingType(e.target.value);
              setPage(1);
            }}
            className="border border-gray-300 px-4 py-2 rounded-lg outline-none"
          >
            <option value="">All Booking Types</option>
            <option value="one_way">One Way</option>
            <option value="round_trip">Round Trip</option>
            <option value="hourly">Hourly</option>
          </select>

          {/* START DATE */}

          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setPage(1);
            }}
            className="border border-gray-300 px-4 py-2 rounded-lg outline-none"
          />

          {/* END DATE */}

          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setPage(1);
            }}
            className="border border-gray-300 px-4 py-2 rounded-lg outline-none"
          />
        </div>
      </div>

      {/* STATS */}

      

      {/* <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-5">
        <div className="bg-white shadow rounded-xl p-4">
          <h2 className="text-sm text-gray-500 font-medium">Total</h2>

          <p className="text-2xl font-bold">{stats?.totalBookings || 0}</p>
        </div>

        <div className="bg-white shadow rounded-xl p-4">
          <h2 className="text-sm text-gray-500 font-medium">Completed</h2>

          <p className="text-2xl font-bold text-green-600">
            {stats?.completedCount || 0}
          </p>
        </div>

        <div className="bg-white shadow rounded-xl p-4">
          <h2 className="text-sm text-gray-500 font-medium">On Trip</h2>

          <p className="text-2xl font-bold text-blue-600">
            {stats?.onTripCount || 0}
          </p>
        </div>

        <div className="bg-white shadow rounded-xl p-4">
          <h2 className="text-sm text-gray-500 font-medium">Pending Payment</h2>

          <p className="text-2xl font-bold text-orange-600">
            {stats?.pendingPaymentCount || 0}
          </p>
        </div>

        <div className="bg-white shadow rounded-xl p-4">
          <h2 className="text-sm text-gray-500 font-medium">Paid</h2>

          <p className="text-2xl font-bold text-green-600">
            {stats?.paidCount || 0}
          </p>
        </div>
      </div> */}

      {/* TABLE */}

      <div className="w-full bg-white rounded-2xl shadow overflow-hidden">
        <TableContainer
          component={Paper}
          sx={{
            width: "100%",
            overflowX: "hidden",
            boxShadow: "none",
          }}
        >
          <Table
            sx={{
              width: "100%",
              tableLayout: "fixed",
            }}
          >
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: "#f9fafb",
                }}
              >
                <TableCell width="10%">
                  <strong>Booking</strong>
                </TableCell>

                <TableCell width="18%">
                  <strong>Traveller</strong>
                </TableCell>

                <TableCell width="22%">
                  <strong>Pickup / Drop</strong>
                </TableCell>

                <TableCell width="8%">
                  <strong>Type</strong>
                </TableCell>

                <TableCell width="8%">
                  <strong>Fare</strong>
                </TableCell>

                <TableCell width="10%">
                  <strong>Status</strong>
                </TableCell>

                <TableCell width="12%">
                  <strong>Driver</strong>
                </TableCell>

                <TableCell width="12%">
                  <strong>Vehicle / Date</strong>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {data?.length > 0 ? (
                data?.map((row) => (
                  <TableRow key={row?._id} hover>
                    {/* BOOKING */}

                    <TableCell>
                      <div className="font-semibold text-sm break-words">
                        {row?.bookingNumber || "-"}
                      </div>

                      <div className="text-xs text-gray-500 mt-1">
                        {formatText(row?.segment?.name)}
                      </div>
                    </TableCell>

                    {/* TRAVELLER */}

                    <TableCell>
                      <div className="font-semibold text-sm break-words">
                        {row?.travellerName || "-"}
                      </div>

                      <div className="text-xs text-gray-500 break-all">
                        {row?.travellerEmail || "-"}
                      </div>

                      <div className="text-xs text-gray-500">
                        {row?.travellerPhone || "-"}
                      </div>
                    </TableCell>

                    {/* PICKUP + DROPOFF */}

                    <TableCell>
                      <div className="text-xs font-medium text-green-600 mb-1">
                        Pickup
                      </div>

                      <div className="text-sm break-words mb-2">
                        {row?.pickup?.address || "-"}
                      </div>

                      <div className="text-xs font-medium text-red-500 mb-1">
                        Drop
                      </div>

                      <div className="text-sm break-words">
                        {row?.dropoff?.address || "-"}
                      </div>
                    </TableCell>

                    {/* TYPE */}

                    <TableCell>
                      <div className="text-sm">
                        {formatText(row?.bookingType)}
                      </div>
                    </TableCell>

                    {/* FARE */}

                    <TableCell>
                      <div className="font-semibold text-sm">
                        ₹{row?.estimatedFare || 0}
                      </div>

                      <div className="text-xs text-gray-500">
                        {row?.estimatedKm || 0} KM
                      </div>
                    </TableCell>

                    {/* STATUS */}

                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Chip
                          label={formatText(row?.paymentStatus)}
                          color={getStatusColor(row?.paymentStatus)}
                          size="small"
                        />

                        <Chip
                          label={formatText(row?.tripStatus)}
                          color={getStatusColor(row?.tripStatus)}
                          size="small"
                        />

                        <Chip
                          label={formatText(row?.overallStatus)}
                          color={getStatusColor(row?.overallStatus)}
                          size="small"
                        />
                      </div>
                    </TableCell>

                    {/* DRIVER */}

                    <TableCell>
                      {row?.driver ? (
                        <>
                          <div className="font-semibold text-sm break-words">
                            {row?.driver?.name}
                          </div>

                          <div className="text-xs text-gray-500">
                            {row?.driver?.phone}
                          </div>

                          <div className="mt-1">
                            <Chip
                              label={formatText(row?.assignmentStatus)}
                              color={getStatusColor(row?.assignmentStatus)}
                              size="small"
                            />
                          </div>
                        </>
                      ) : (
                        <div className="text-sm">-</div>
                      )}
                    </TableCell>

                    {/* VEHICLE + DATE */}

                    <TableCell>
                      <div className="font-semibold text-sm break-words">
                        {row?.vehicle?.vehicleNumber || "-"}
                      </div>

                      <div className="text-xs text-gray-500 mt-1 break-words">
                        {row?.createdAtIST || "-"}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No Bookings Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* PAGINATION */}

      <Stack spacing={2} mt={4} alignItems="center">
        <Pagination
          count={totalPages}
          page={page}
          onChange={(e, value) => setPage(value)}
          color="primary"
        />
      </Stack>
    </div>
  );
}
