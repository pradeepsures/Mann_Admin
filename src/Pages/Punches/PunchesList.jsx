// import * as React from "react";
// import { useEffect, useState, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { styled } from "@mui/material/styles";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell, { tableCellClasses } from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
// import Paper from "@mui/material/Paper";
// import IconButton from "@mui/material/IconButton";
// import Menu from "@mui/material/Menu";
// import MenuItem from "@mui/material/MenuItem";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import Pagination from "@mui/material/Pagination";
// import Stack from "@mui/material/Stack";
// import toast from "react-hot-toast";
// import { EyeIcon } from "@heroicons/react/24/outline";
// import { motion } from "framer-motion";
// import { Select } from "antd";
// const { Option } = Select;

// import xlsx from "json-as-xlsx";
// import LoderBtn from "../../compoents/LoderBtn";
// import Loader from "../../compoents/Loader";
// import Breaker from "../../compoents/Breaker";

// import { getAllPunches } from "../../Services/PunchesApi";
// import { getAllDrivers } from "../../Services/DriverApi";
// import { getAllPunchRegions } from "../../Services/PunchRegionApi";

// const StyledTableCell = styled(TableCell)(() => ({
//   [`&.${tableCellClasses.head}`]: {
//     background: "linear-gradient(to right, #03045E, #023E8A, #0077B6)",
//     color: "#fff",
//     fontWeight: 600,
//   },
// }));

// export default function PunchList() {
//   const navigate = useNavigate();

//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [drivers, setDrivers] = useState([]);
//   const [regions, setRegions] = useState([]);

//   const [totalPages, setTotalPages] = useState(0);
//   const [totalRecord, setTotalRecord] = useState(0);

//   const [page, setPage] = useState(1);
//   const rowsPerPage = 100;

//   const [isExporting, setIsExporting] = useState(false);

//   const [filters, setFilters] = useState({
//     driver: "",
//     punchRegion: "",
//     status: "",
//     startDate: "",
//     endDate: "",
//     punchStatus: "",
//   });

//   const [localFilters, setLocalFilters] = useState({ ...filters });

//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedRowId, setSelectedRowId] = useState(null);

//   // const formatPunchDate = (dateValue) => {
//   //     if (!dateValue) return "N/A";
//   //     const date = new Date(dateValue);
//   //     if (Number.isNaN(date.getTime())) return dateValue;

//   //     const day = String(date.getDate()).padStart(2, "0");
//   //     const month = String(date.getMonth() + 1).padStart(2, "0");
//   //     const year = String(date.getFullYear()).slice(-2);

//   //     return `${day}-${month}-${year}`;
//   // };

//   const formatPunchDate = (value) => {
//     if (!value) return "";

//     const [date, time] = value.split(" ");
//     if (!date || !time) return value;

//     const [year, month, day] = date.split("-");
//     const [hour, minute] = time.split(":");

//     return `${day}-${month}-${year} ${hour}:${minute}`;
//   };

//   // ✅ FETCH DATA
//   const fetchData = useCallback(async () => {
//     try {
//       setLoading(true);

//       const res = await getAllPunches({
//         page,
//         rowsPerPage,
//         ...filters,
//       });

//       if (res?.status) {
//         const formatted = res.data.map((item) => ({
//           ...item,
//           id: item._id,
//         }));

//         setData(formatted);
//         setTotalPages(res.totalPage);
//         setTotalRecord(res.totalResult);
//       }
//     } catch {
//       toast.error("Failed to fetch punches");
//     } finally {
//       setLoading(false);
//     }
//   }, [page, filters]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   // ✅ FETCH DRIVERS
//   useEffect(() => {
//     const fetchDrivers = async () => {
//       const res = await getAllDrivers({ page: 1, rowsPerPage: 100 });
//       if (res?.status) setDrivers(res.data);
//     };
//     fetchDrivers();
//   }, []);

//   // ✅ FETCH REGIONS
//   useEffect(() => {
//     const fetchRegions = async () => {
//       const res = await getAllPunchRegions({ page: 1, rowsPerPage: 100 });
//       if (res?.status) setRegions(res.data);
//     };
//     fetchRegions();
//   }, []);

//   // APPLY FILTER
//   const handleApply = () => {
//     setFilters(localFilters);
//     setPage(1);
//   };

//   // RESET
//   const handleReset = () => {
//     const empty = {
//       driver: "",
//       punchRegion: "",
//       status: "",
//       startDate: "",
//       endDate: "",
//       punchStatus: "",
//     };
//     setLocalFilters(empty);
//     setFilters(empty);
//     setPage(1);
//   };

//   // MENU
//   const handleMenuOpen = (e, id) => {
//     setAnchorEl(e.currentTarget);
//     setSelectedRowId(id);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setSelectedRowId(null);
//   };

//   const handlePageChange = (e, newPage) => {
//     setPage(newPage);
//   };

//   // EXPORT
//   const exportExcel = () => {
//     if (data.length < 1) return toast.error("No data");

//     setIsExporting(true);

//     const exportData = [
//       {
//         sheet: "Punch List",
//         columns: [
//           { label: "Driver Name", value: (r) => r?.driver?.name },
//           { label: "Phone", value: (r) => r?.driver?.phone },
//           { label: "Region", value: (r) => r?.region?.name },
//           { label: "Punch Region", value: (r) => r?.punchRegion?.name },
//           { label: "Status", value: "status" },
//           { label: "Punch In", value: (r) => r?.punchInAt },
//           { label: "Punch Out", value: (r) => r?.punchOutAt },
//           { label: "Total Minutes", value: "totalMinutes" },
//           {
//             label: "Booking Report",
//             value: (r) => {
//               const b = r?.currentBooking?.booking;

//               if (!b) return "No Booking";

//               return `
// Booking No: ${b.bookingNumber}
// Traveller: ${b.travellerName}
// Phone: ${b.travellerPhone}
// Type: ${b.bookingType}
// Status: ${b.tripStatus}
// Pickup: ${b.pickup?.address}
// Dropoff: ${b.dropoff?.address}
// Fare: ${b.estimatedFare}
//     `;
//             },
//           },
//         ],
//         content: data,
//       },
//     ];

//     xlsx(exportData, { fileName: "Punch_List" });

//     setIsExporting(false);
//   };

//   if (loading) return <Loader />;

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <Breaker />

//       {/* FILTER */}
//       <div className="bg-white p-5 rounded-xl shadow mb-6">
//         <h3 className="text-lg font-semibold mb-4">Search & Filters</h3>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {/* DRIVER DROPDOWN */}
//           <Select
//             showSearch
//             placeholder="Select Chauffeur"
//             value={localFilters.driver || undefined}
//             onChange={(val) =>
//               setLocalFilters({ ...localFilters, driver: val })
//             }
//             optionFilterProp="children"
//             className="custom-select"
//             filterOption={(input, option) =>
//               String(option?.children ?? "")
//                 .toLowerCase()
//                 .includes(input.toLowerCase())
//             }
//             // filterOption={(input, option) =>
//             //   option.children.toLowerCase().includes(input.toLowerCase())
//             // }
//           >
//             {drivers.map((d) => (
//               <Option key={d._id} value={d._id}>
//                 {d.name} ({d.phone})
//               </Option>
//             ))}
//           </Select>

//           {/* PUNCH REGION DROPDOWN */}
//           <Select
//             showSearch
//             placeholder="Select Punch Region"
//             value={localFilters.punchRegion || undefined}
//             onChange={(val) =>
//               setLocalFilters({ ...localFilters, punchRegion: val })
//             }
//             optionFilterProp="children"
//             className="custom-select"
//             filterOption={(input, option) =>
//               option.children.toLowerCase().includes(input.toLowerCase())
//             }
//           >
//             {regions.map((r) => (
//               <Option key={r._id} value={r._id}>
//                 {r.name}
//               </Option>
//             ))}
//           </Select>

//           {/* STATUS */}
//           {/* <select
//             className="border p-2 rounded-2xl"
//             value={localFilters.status}
//             onChange={(e) =>
//               setLocalFilters({ ...localFilters, status: e.target.value })
//             }
//           >
//             <option value="">All Status</option>
//             <option value="completed">Completed</option>
//             <option value="pending">Pending</option>
//           </select> */}

//           {/* PUNCh STATUS */}
//           <select
//             className="border p-2 rounded-2xl"
//             value={localFilters.punchStatus}
//             onChange={(e) =>
//               setLocalFilters({ ...localFilters, punchStatus: e.target.value })
//             }
//           >
//             <option value="">All Status</option>
//             <option value="active">Active</option>
//             <option value="completed">Completed</option>
//             <option value="not_punched">Not Punched</option>
//           </select>

//           {/* DATE */}
//           <input
//             type={localFilters.startDate ? "date" : "text"}
//             placeholder="Start Date"
//             className="border p-2 rounded-2xl"
//             value={localFilters.startDate}
//             onFocus={(e) => (e.target.type = "date")}
//             onBlur={(e) => {
//               if (!e.target.value) e.target.type = "text";
//             }}
//             onChange={(e) =>
//               setLocalFilters({ ...localFilters, startDate: e.target.value })
//             }
//           />

//           <input
//             type={localFilters.endDate ? "date" : "text"}
//             placeholder="End Date"
//             className="border p-2 rounded-2xl"
//             value={localFilters.endDate}
//             onFocus={(e) => (e.target.type = "date")}
//             onBlur={(e) => {
//               if (!e.target.value) e.target.type = "text";
//             }}
//             onChange={(e) =>
//               setLocalFilters({ ...localFilters, endDate: e.target.value })
//             }
//           />
//         </div>

//         <div className="flex gap-3 mt-5">
//           <motion.button
//             onClick={handleApply}
//             className="bg-primary text-white px-5 py-2 rounded-lg"
//           >
//             Apply Filters
//           </motion.button>

//           <motion.button
//             onClick={handleReset}
//             className="bg-gray-400 text-white px-5 py-2 rounded-lg"
//           >
//             Reset
//           </motion.button>
//         </div>
//       </div>

//       {/* ACTION */}
//       <div className="flex justify-end gap-4 mb-6">
//         <motion.button
//           onClick={exportExcel}
//           className="bg-green-600 text-white px-5 py-2 rounded-lg"
//         >
//           {isExporting ? <LoderBtn /> : "Export Excel"}
//         </motion.button>
//       </div>

//       {/* TABLE */}
//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <StyledTableCell>S.No</StyledTableCell>
//               <StyledTableCell>CHAUFFEUR</StyledTableCell>
//               <StyledTableCell>REGION</StyledTableCell>
//               <StyledTableCell>PUNCH REGION</StyledTableCell>
//               <StyledTableCell>STATUS</StyledTableCell>
//               <StyledTableCell>PUNCH IN</StyledTableCell>
//               <StyledTableCell>BOOKING DETAILS</StyledTableCell>
//               <StyledTableCell>PUNCH OUT</StyledTableCell>
//               <StyledTableCell align="center">ACTIONS</StyledTableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {data.map((row, index) => (
//               <TableRow key={row.id}>
//                 <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>

//                 {/* <TableCell>{row?.driver?.name}</TableCell> */}
//                 <TableCell>
//                   <div>
//                     <div className="font-medium text-gray-800">
//                       {row?.driver?.name || "-"}
//                     </div>

//                     <div className="text-xs text-blue-600">
//                       📞 {row?.driver?.phone || "-"}
//                     </div>

//                     <div className="text-xs text-purple-600">
//                       Grade: {row?.driver?.grade || "-"}
//                     </div>
//                   </div>
//                 </TableCell>
//                 <TableCell>{row?.region?.name}</TableCell>
//                 <TableCell>{row?.punchRegion?.name}</TableCell>

//                 <TableCell>
//                   <span
//                     className={`px-2 py-1 rounded text-sm ${
//                       row.status === "completed"
//                         ? "bg-green-100 text-green-700"
//                         : "bg-yellow-100 text-yellow-700"
//                     }`}
//                   >
//                     {row.status}
//                   </span>
//                 </TableCell>

//                 <TableCell>
//                   {/* {formatPunchDate(row?.punchInAtIST)} */}
//                   <div className="text-xs text-green-600">
//                     Punch In:{" "}
//                     {row?.punchInAt
//                       ? new Date(row.punchInAt).toLocaleString()
//                       : "-"}
//                   </div>
//                 </TableCell>

//                 <TableCell>
//                   {row?.currentBooking?.booking ? (
//                     <div className="space-y-1 text-xs">
//                       <div className="font-semibold text-blue-700">
//                         {row.currentBooking.booking.bookingNumber}
//                       </div>

//                       <div className="font-medium">
//                         {row.currentBooking.booking.travellerName}
//                       </div>

//                       <div className="text-gray-600">
//                         📞 {row.currentBooking.booking.travellerPhone}
//                       </div>

//                       <div className="text-indigo-600">
//                         {row.currentBooking.booking.bookingType
//                           ?.replaceAll("_", " ")
//                           ?.toUpperCase()}
//                       </div>

//                       <span
//                         className={`inline-block px-2 py-1 rounded text-[10px]
//           ${
//             row.currentBooking.booking.tripStatus === "completed"
//               ? "bg-green-100 text-green-700"
//               : row.currentBooking.booking.tripStatus === "arrived"
//                 ? "bg-blue-100 text-blue-700"
//                 : "bg-yellow-100 text-yellow-700"
//           }
//         `}
//                       >
//                         {row.currentBooking.booking.tripStatus?.replaceAll(
//                           "_",
//                           " ",
//                         )}
//                       </span>

//                       <div className="text-gray-500 truncate max-w-[250px]">
//                         📍 {row.currentBooking.booking.pickup?.address}
//                       </div>

//                       <div className="text-gray-500 truncate max-w-[250px]">
//                         🏁 {row.currentBooking.booking.dropoff?.address}
//                       </div>
//                       <div className="text-gray-600">
//                         Fare {row.currentBooking.booking.estimatedFare}
//                       </div>
//                     </div>
//                   ) : (
//                     <span className="text-green-600 font-medium">
//                       No Booking
//                     </span>
//                   )}
//                 </TableCell>

//                 <TableCell>
//                   {row?.punchOutAt ? formatPunchDate(row.punchOutAt) : "N/A"}
//                 </TableCell>

//                 <TableCell align="center">
//                   <IconButton onClick={(e) => handleMenuOpen(e, row.id)}>
//                     <MoreVertIcon />
//                   </IconButton>

//                   <Menu
//                     anchorEl={anchorEl}
//                     open={Boolean(anchorEl) && selectedRowId === row.id}
//                     onClose={handleMenuClose}
//                   >
//                     <MenuItem onClick={() => navigate(`view/${row._id}`)}>
//                       <EyeIcon className="h-5 w-5 text-blue-600 mr-2" />
//                       View
//                     </MenuItem>
//                   </Menu>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* PAGINATION */}
//       {totalRecord > rowsPerPage && (
//         <Stack spacing={2} alignItems="center" mt={6}>
//           <Pagination
//             count={totalPages}
//             page={page}
//             onChange={handlePageChange}
//           />
//         </Stack>
//       )}
//     </div>
//   );
// }

import * as React from "react";

import { useEffect, useState, useCallback } from "react";

import { useNavigate } from "react-router-dom";

import { styled } from "@mui/material/styles";

import Table from "@mui/material/Table";

import TableBody from "@mui/material/TableBody";

import TableCell, { tableCellClasses } from "@mui/material/TableCell";

import TableContainer from "@mui/material/TableContainer";

import TableHead from "@mui/material/TableHead";

import TableRow from "@mui/material/TableRow";

import Paper from "@mui/material/Paper";

import IconButton from "@mui/material/IconButton";

import Pagination from "@mui/material/Pagination";

import Stack from "@mui/material/Stack";

import toast from "react-hot-toast";

import { EyeIcon } from "@heroicons/react/24/outline";

import { motion } from "framer-motion";

import { Select } from "antd";

const { Option } = Select;

import { TiPhone } from "react-icons/ti";

import xlsx from "json-as-xlsx";

import LoderBtn from "../../compoents/LoderBtn";

import Loader from "../../compoents/Loader";

import Breaker from "../../compoents/Breaker";

import { getAllPunches } from "../../Services/PunchesApi";

import { getAllDrivers } from "../../Services/DriverApi";

import { getAllPunchRegions } from "../../Services/PunchRegionApi";

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    background: "linear-gradient(to right, #03045E, #023E8A, #0077B6)",

    color: "#fff",

    fontWeight: 600,
  },
}));

const EMPTY_FILTERS = {
  driver: "",

  punchRegion: "",

  status: "",

  startDate: "",

  endDate: "",

  punchStatus: "",
};

export default function PunchList() {
  const navigate = useNavigate();

  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(false);

  const [drivers, setDrivers] = useState([]);

  const [regions, setRegions] = useState([]);

  const [totalPages, setTotalPages] = useState(0);

  const [totalRecord, setTotalRecord] = useState(0);

  const [page, setPage] = useState(1);

  const rowsPerPage = 100;

  const [isExporting, setIsExporting] = useState(false);

  const [filters, setFilters] = useState({ ...EMPTY_FILTERS });

  const [localFilters, setLocalFilters] = useState({ ...EMPTY_FILTERS });

  const [stats, setStats] = useState({
    totalDrivers: 0,

    punchedIn: 0,

    currentlyPunchedIn: 0,

    punchedOut: 0,

    notPunchedToday: 0,
  });

  const formatPunchDate = (value) => {
    if (!value) return "";

    const [date, time] = value.split(" ");

    if (!date || !time) return value;

    const [year, month, day] = date.split("-");

    const [hour, minute] = time.split(":");

    return `${day}-${month}-${year} ${hour}:${minute}`;
  };

  // ✅ FETCH DATA

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const res = await getAllPunches({ page, rowsPerPage, ...filters });

      if (res?.status) {
        setData(res.data.map((item) => ({ ...item, id: item._id })));

        setTotalPages(res.totalPage);

        setTotalRecord(res.totalResult);

        setStats(
          res.stats || {
            totalDrivers: 0,

            punchedIn: 0,

            currentlyPunchedIn: 0,

            punchedOut: 0,

            notPunchedToday: 0,
          },
        );
      }
    } catch (error) {
      console.error(error);

      toast.error("Failed to fetch punches");
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ✅ FETCH DRIVERS

  useEffect(() => {
    const fetchDrivers = async () => {
      const res = await getAllDrivers({ page: 1, rowsPerPage: 100 });

      if (res?.status) setDrivers(res.data);
    };

    fetchDrivers();
  }, []);

  // ✅ FETCH REGIONS

  useEffect(() => {
    const fetchRegions = async () => {
      const res = await getAllPunchRegions({ page: 1, rowsPerPage: 100 });

      if (res?.status) setRegions(res.data);
    };

    fetchRegions();
  }, []);

  // ✅ FIXED: accepts updated filters directly to avoid stale state

  const handleApply = (filtersToApply = localFilters) => {
    setFilters({ ...filtersToApply });

    setPage(1);
  };

  // ✅ Helper: update localFilters + immediately apply (for dropdowns & dates)

  const applyInstant = (key, value) => {
    const updated = { ...localFilters, [key]: value };

    setLocalFilters(updated);

    handleApply(updated);
  };

  // RESET

  const handleReset = () => {
    setLocalFilters({ ...EMPTY_FILTERS });

    setFilters({ ...EMPTY_FILTERS });

    setPage(1);
  };

  const handlePageChange = (e, newPage) => setPage(newPage);

  // EXPORT

  const exportExcel = () => {
    if (data.length < 1) return toast.error("No data");

    setIsExporting(true);

    const exportData = [
      {
        sheet: "Punch List",

        columns: [
          { label: "Driver Name", value: (r) => r?.driver?.name },

          { label: "Phone", value: (r) => r?.driver?.phone },

          { label: "Region", value: (r) => r?.region?.name },

          { label: "Punch Region", value: (r) => r?.punchRegion?.name },

          { label: "Status", value: "status" },

          { label: "Punch In", value: (r) => r?.punchInAtIST },

          { label: "Punch Out", value: (r) => r?.punchOutAtIST },

          { label: "Total Minutes", value: "totalMinutes" },
        ],

        content: data,
      },
    ];

    xlsx(exportData, { fileName: "Chauffeur_Master" });

    setIsExporting(false);
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Breaker />

      {/* STATS */}
      <div className="flex justify-end mb-4">
        <div className="bg-[#003B8E] text-white px-4 py-2 rounded-lg shadow flex flex-wrap gap-3 text-sm font-medium">
          <span>
            Total Drivers:{" "}
            <span className="text-yellow-300">{stats.totalDrivers}</span>
          </span>
          <span>|</span>
          <span>
            Punched In:{" "}
            <span className="text-yellow-300">{stats.punchedIn}</span>
          </span>
          <span>|</span>
          <span>
            Active:{" "}
            <span className="text-yellow-300">{stats.currentlyPunchedIn}</span>
          </span>
          <span>|</span>
          <span>
            Punched Out:{" "}
            <span className="text-yellow-300">{stats.punchedOut}</span>
          </span>
          <span>|</span>
          <span>
            Not Punched:{" "}
            <span className="text-yellow-300">{stats.notPunchedToday}</span>
          </span>
        </div>
      </div>

      {/* FILTER */}
      <div className="bg-white p-5 rounded-xl shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">Search & Filters</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* DRIVER DROPDOWN — auto apply */}
          <Select
            showSearch
            placeholder="Select Chauffeur"
            value={localFilters.driver || undefined}
            onChange={(val) => applyInstant("driver", val ?? "")}
            optionFilterProp="children"
            className="custom-select"
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
            allowClear
          >
            {drivers.map((d) => (
              <Option key={d._id} value={d._id}>
                {d.name} ({d.phone})
              </Option>
            ))}
          </Select>

          {/* PUNCH REGION DROPDOWN — auto apply */}
          <Select
            showSearch
            placeholder="Select Punch Region"
            value={localFilters.punchRegion || undefined}
            onChange={(val) => applyInstant("punchRegion", val ?? "")}
            optionFilterProp="children"
            className="custom-select"
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
            allowClear
          >
            {regions.map((r) => (
              <Option key={r._id} value={r._id}>
                {r.name}
              </Option>
            ))}
          </Select>

          {/* PUNCH STATUS — auto apply */}
          <select
            className="border p-2 rounded-2xl"
            value={localFilters.punchStatus}
            onChange={(e) => applyInstant("punchStatus", e.target.value)}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="not_punched">Not Punched</option>
          </select>

          {/* START DATE — auto apply */}
          <input
            type={localFilters.startDate ? "date" : "text"}
            placeholder="Start Date"
            className="border p-2 rounded-2xl"
            value={localFilters.startDate}
            onFocus={(e) => (e.target.type = "date")}
            onBlur={(e) => {
              if (!e.target.value) e.target.type = "text";
            }}
            // onChange={(e) => applyInstant("startDate", e.target.value)}
            onChange={(e) =>
              setLocalFilters({
                ...localFilters,
                startDate: e.target.value,
              })
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleApply();
              }
            }}
          />

          {/* END DATE — auto apply */}
          <input
            type={localFilters.endDate ? "date" : "text"}
            placeholder="End Date"
            className="border p-2 rounded-2xl"
            value={localFilters.endDate}
            onFocus={(e) => (e.target.type = "date")}
            onBlur={(e) => {
              if (!e.target.value) e.target.type = "text";
            }}
            // onChange={(e) => applyInstant("endDate", e.target.value)}
            onChange={(e) =>
              setLocalFilters({
                ...localFilters,
                endDate: e.target.value,
              })
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleApply();
              }
            }}
          />
        </div>

        <div className="flex gap-3 mt-5">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => handleApply(localFilters)}
            className="bg-primary text-white px-5 py-2 rounded-lg"
          >
            Apply Filters
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleReset}
            className="bg-gray-400 text-white px-5 py-2 rounded-lg"
          >
            Reset
          </motion.button>
        </div>
      </div>

      {/* ACTION */}
      <div className="flex justify-end gap-4 mb-6">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={exportExcel}
          className="bg-green-600 text-white px-5 py-2 rounded-lg"
        >
          {isExporting ? <LoderBtn /> : "Export Excel"}
        </motion.button>
      </div>

      {/* TABLE */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>S.No</StyledTableCell>
              <StyledTableCell>CHAUFFEUR</StyledTableCell>
              <StyledTableCell>REGION</StyledTableCell>
              <StyledTableCell>PUNCH REGION</StyledTableCell>
              <StyledTableCell>STATUS</StyledTableCell>
              <StyledTableCell>PUNCH IN</StyledTableCell>
              <StyledTableCell>BOOKING DETAILS</StyledTableCell>
              <StyledTableCell>PUNCH OUT</StyledTableCell>
              <StyledTableCell align="center">ACTIONS</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>

                <TableCell>
                  <div>
                    <div className="font-medium text-gray-800">
                      {row?.driver?.name || "-"}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-blue-600">
                      <TiPhone className="text-sm" />

                      {row?.driver?.phone || "-"}
                    </div>
                    <div className="text-xs text-purple-600">
                      Grade: {row?.driver?.grade || "-"}
                    </div>
                  </div>
                </TableCell>

                <TableCell>{row?.region?.name}</TableCell>
                <TableCell>{row?.punchRegion?.name}</TableCell>

                <TableCell>
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      row.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {row.status}
                  </span>
                </TableCell>

                <TableCell>
                  <div className="text-xs text-green-600">
                    Punch In:{" "}
                    {row?.punchInAt
                      ? new Date(row.punchInAt).toLocaleString()
                      : "-"}
                  </div>
                </TableCell>

                <TableCell>
                  {row?.currentBooking?.booking ? (
                    <div className="space-y-1 text-xs">
                      <div className="font-semibold text-blue-700">
                        {row.currentBooking.booking.bookingNumber}
                      </div>
                      <div className="font-medium">
                        {row.currentBooking.booking.travellerName}
                      </div>
                      <div className="text-gray-600">
                        📞 {row.currentBooking.booking.travellerPhone}
                      </div>
                      <div className="text-indigo-600">
                        {row.currentBooking.booking.bookingType

                          ?.replaceAll("_", " ")

                          ?.toUpperCase()}
                      </div>
                      <span
                        className={`inline-block px-2 py-1 rounded text-[10px] ${
                          row.currentBooking.booking.tripStatus === "completed"
                            ? "bg-green-100 text-green-700"
                            : row.currentBooking.booking.tripStatus ===
                                "arrived"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {row.currentBooking.booking.tripStatus?.replaceAll(
                          "_",
                          " ",
                        )}
                      </span>
                      <div className="text-gray-500 truncate max-w-[250px]">
                        📍 {row.currentBooking.booking.pickup?.address}
                      </div>
                      <div className="text-gray-500 truncate max-w-[250px]">
                        🏁 {row.currentBooking.booking.dropoff?.address}
                      </div>
                      <div className="text-gray-600">
                        Fare {row.currentBooking.booking.estimatedFare}
                      </div>
                    </div>
                  ) : (
                    <span className="text-green-600 font-medium">
                      No Booking
                    </span>
                  )}
                </TableCell>

                <TableCell>
                  {row?.punchOutAtIST
                    ? formatPunchDate(row.punchOutAtIST)
                    : "_"}
                </TableCell>

                <TableCell align="center">
                  <IconButton
                    onClick={() => navigate(`view/${row._id}`)}
                    title="View"
                  >
                    <EyeIcon className="h-5 w-5 text-blue-600" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* PAGINATION */}

      {totalRecord > rowsPerPage && (
        <Stack spacing={2} alignItems="center" mt={6}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
          />
        </Stack>
      )}
    </div>
  );
}
