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
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import toast from "react-hot-toast";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { Modal } from "antd";
import xlsx from "json-as-xlsx";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";

import Loader from "../../compoents/Loader";
import LoderBtn from "../../compoents/LoderBtn";
import Breaker from "../../compoents/Breaker";

import {
  getAllDrivers,
  deleteDriver,
  toggleDriverDeleteStatus,
} from "../../Services/DriverApi";
import { useAuth } from "../../auth/AuthContext";
import DriverFilter from "./DriverFilter";
import { useLocation } from "react-router-dom";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    background: "linear-gradient(to right, #03045E, #023E8A, #0077B6)",
    color: "#fff",
    fontWeight: 600,
    fontSize: "0.95rem",
  },
}));

export default function DriverList() {
  const { hasPermission } = useAuth();
  const location = useLocation();
  const SECTION = "Driver";
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecord, setTotalRecord] = useState(0);

  // const [searchQuery, setSearchQuery] = useState("");
  // const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(100);

  const [isExporting, setIsExporting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({});
  const navigate = useNavigate();

  // const fetchDrivers = useCallback(async () => {
  //   try {
  //     setLoading(true);

  //     const result = await getAllDrivers({
  //       page,
  //       rowsPerPage,
  //       // searchQuery,
  //         ...filters,
  //     });

  //     if (result?.status) {
  //       const formatted = result.data.map((item) => ({
  //         ...item,
  //         id: item._id,
  //       }));

  //       setData(formatted);
  //       setTotalPages(result.totalPage);
  //       setTotalRecord(result.totalResult);
  //       setStats(result.stats || null);
  //     }
  //   } catch (err) {
  //     toast.error("Error fetching drivers");
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [page, rowsPerPage, searchQuery]);
  const fetchDrivers = useCallback(async () => {
    try {
      setLoading(true);

      const result = await getAllDrivers({
        page,
        rowsPerPage,
        ...filters,
      });

      if (result?.status) {
        setData(result.data.map((i) => ({ ...i, id: i._id })));
        setTotalPages(result.totalPage);
        setTotalRecord(result.totalResult);
        setStats(result.stats || null);
      }
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, filters]);

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  //   useEffect(() => {
  //   const params = new URLSearchParams(location.search);

  //   const initialFilters = {
  //     isVerified: params.get("isVerified") || "",
  //     isOnline: params.get("isOnline") || "",
  //     isOnTrip: params.get("isOnTrip") || "",
  //     isAvailable: params.get("isAvailable") || "",
  //   };

  //   setFilters(initialFilters);
  //   setPage(1);
  // }, [location.search]);
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    // const initialFilters = {
    //   isVerified: params.get("isVerified") ?? "",
    //   isOnline: params.get("isOnline") ?? "",
    //   isOnTrip: params.get("isOnTrip") ?? "",
    //   isAvailable: params.get("isAvailable") ?? "",
    //   isDeleted: params.get("isDeleted") ?? "",
    // };
    const initialFilters = {
      searchQuery: params.get("searchQuery") ?? "",
      isVerified: params.get("isVerified") ?? "",
      isOnline: params.get("isOnline") ?? "",
      isOnTrip: params.get("isOnTrip") ?? "",
      isAvailable: params.get("isAvailable") ?? "",
      isDeleted: params.get("isDeleted") ?? "",
    };
    setFilters(initialFilters);
    setPage(1);
  }, [location.search]);

  const handleApplyFilters = (f) => {
    setPage(1);

    const cleaned = {
      ...f,
      isVerified: f.isVerified || "",
      isOnline: f.isOnline || "",
      isOnTrip: f.isOnTrip || "",
      isAssigned: f.isAssigned || "",
      isAvailable: f.isAvailable || "",
      isPunchedIn: f.isPunchedIn || "",
      isPunchedOut: f.isPunchedOut || "",
      isDeleted: f.isDeleted || "",
    };

    setFilters(cleaned);
  };

  const handleResetFilters = () => {
    setFilters({});
    setPage(1);
  };

  const handleMenuOpen = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedRowId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRowId(null);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const deleteHandler = (id) => {
    handleMenuClose();
    Modal.confirm({
      title: "Delete Chauffeur",
      content: "Are you sure you want to delete this Chauffeur?",
      okType: "danger",

      onOk: async () => {
        try {
          const result = await deleteDriver(id);

          if (result?.status) {
            toast.success("Chauffeur deleted");
            fetchDrivers();
          }
        } catch (err) {
          toast.error("Error deleting Chauffeur");
        }
      },
    });
  };

  const handleAddDriver = () => {
    setIsLoading(true);

    setTimeout(() => {
      navigate("createDriver");
      setIsLoading(false);
    }, 300);
  };

  //handle toggle delete status (soft delete)
  const handleToggleDelete = async (id) => {
    handleMenuClose();
    try {
      const res = await toggleDriverDeleteStatus(id);

      if (res?.status) {
        toast.success(res.message || "Status updated");
        fetchDrivers(); // refresh list
      }
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const exportExcel = async () => {
    if (data.length < 1) {
      return toast.error("Driver list empty");
    }

    setIsExporting(true);

    const settings = {
      fileName: "Chauffeur_Master",
    };

    const exportData = [
      {
        sheet: "Chauffeur Master", // columns: [
        //     { label: "Name", value: "name" },
        //     { label: "Email", value: "email" },
        //     { label: "Phone", value: "phone" },
        //     { label: "Region", value: (row) => row?.region?.name },
        //     { label: "Online", value: (row) => row?.isOnline ? "Yes" : "No" },
        //     { label: "Verified", value: (row) => row?.isVerified ? "Yes" : "No" },
        //     { label: "Total Rides", value: "totalRides" },
        // ],
        columns: [
          {
            label: "Full Name",
            value: (row) =>
              [row.name, row.midName, row.lastName].filter(Boolean).join(" "),
          },
          { label: "Email", value: "email" },
          { label: "Phone", value: "phone" },
          { label: "Alternate Phone", value: "alternatePhone" },
          { label: "Gender", value: "gender" },
          { label: "City", value: "city" },
          { label: "State", value: "state" },
          { label: "Pincode", value: "pincode" },
          { label: "Region", value: (row) => row?.region?.name || "N/A" },
          {
            label: "Punch Region",
            value: (row) => row?.punchRegion?.name || "N/A",
          },

          { label: "Permanent Address", value: "permanentAddress" },
          { label: "Current Address", value: "currentAddress" },

          // License Details
          { label: "License Number", value: "licenseNumber" },
          {
            label: "License Expiry",
            value: (row) =>
              row?.licenseExpiry
                ? new Date(row.licenseExpiry).toLocaleDateString()
                : "N/A",
          },

          { label: "Aadhaar Number", value: "adhaarNumber" },
          { label: "PAN Number", value: "panNumber" },
          {
            label: "Police Verification Expiry",
            value: (row) =>
              row?.policeVerificationExpiry
                ? new Date(row.policeVerificationExpiry).toLocaleDateString()
                : "N/A",
          },

          // Joining / Leaving
          {
            label: "Date Of Joining",
            value: (row) =>
              row?.dateOfJoining
                ? new Date(row.dateOfJoining).toLocaleDateString()
                : "N/A",
          },
          {
            label: "Date Of Leaving",
            value: (row) =>
              row?.dateOfLeaving
                ? new Date(row.dateOfLeaving).toLocaleDateString()
                : "N/A",
          },
          { label: "Leaving Reason", value: "dateOfLeavingReason" },

          // Medical Certificate
          {
            label: "Medical Cert Issue",
            value: (row) =>
              row?.medicalCertificateIssue
                ? new Date(row.medicalCertificateIssue).toLocaleDateString()
                : "N/A",
          },
          {
            label: "Medical Cert Expiry",
            value: (row) =>
              row?.medicalCertificateExpiry
                ? new Date(row.medicalCertificateExpiry).toLocaleDateString()
                : "N/A",
          },
          {
            label: "Medical Cert Photo",
            value: (row) =>
              row?.medicalCertificatePhoto ? "Available" : "No Photo",
          },

          // Status Fields
          {
            label: "Verified",
            value: (row) => (row?.isVerified ? "Yes" : "No"),
          },
          {
            label: "Online",
            value: (row) => (row?.isOnline ? "Yes" : "No"),
          },
          {
            label: "Available",
            value: (row) => (row?.isAvailable ? "Yes" : "No"),
          },
          {
            label: "On Trip",
            value: (row) => (row?.isOnTrip ? "Yes" : "No"),
          },
          {
            label: "Assigned",
            value: (row) => (row?.isAssigned ? "Yes" : "No"),
          },
          {
            label: "Punched In",
            value: (row) => (row?.isPunchedIn ? "Yes" : "No"),
          },
          {
            label: "Punched Out",
            value: (row) => (row?.isPunchedOut ? "Yes" : "No"),
          },
          {
            label: "Deleted",
            value: (row) => (row?.isDeleted ? "Yes" : "No"),
          },

          { label: "Grade", value: "grade" },
          { label: "Rating", value: "rating" },
          { label: "Rating Count", value: "ratingCount" },
          { label: "Total Rides", value: "totalRides" },

          { label: "Device Type", value: "deviceType" },
          {
            label: "First User",
            value: (row) => (row?.firstUser ? "Yes" : "No"),
          },

          {
            label: "Created At",
            value: (row) => new Date(row.createdAt).toLocaleString(),
          },
        ],
        content: data,
      },
    ];

    try {
      xlsx(exportData, settings);
      toast.success("Excel exported");
    } catch {
      toast.error("Export failed");
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        {/* LEFT */}
        <Breaker />

        {/* RIGHT */}
        {stats && (
          <div className="bg-gradient-to-r from-[#03045E] to-[#0077B6] text-white shadow-md rounded-lg px-4 py-2 text-sm flex items-center gap-3 flex-wrap">
            <span>
              <span className="opacity-80">Total:</span>{" "}
              <span className="font-semibold">{stats.total}</span>
            </span>

            <span className="opacity-50">|</span>

            <span>
              <span className="opacity-80">Verified:</span>{" "}
              <span className="font-semibold text-green-300">
                {stats.verifiedCount}
              </span>
            </span>

            <span className="opacity-50">|</span>

            <span>
              <span className="opacity-80">Unverified:</span>{" "}
              <span className="font-semibold text-red-300">
                {stats.unverifiedCount}
              </span>
            </span>

            <span className="opacity-50">|</span>

            <span>
              <span className="opacity-80">Online:</span>{" "}
              <span className="font-semibold text-blue-300">
                {stats.onlineCount}
              </span>
            </span>

            <span className="opacity-50">|</span>

            <span>
              <span className="opacity-80">PunchedIn:</span>{" "}
              <span className="font-semibold text-blue-300">
                {stats.punchedInCount}
              </span>
            </span>

            <span className="opacity-50">|</span>

            <span>
              <span className="opacity-80">PunchedOut:</span>{" "}
              <span className="font-semibold text-blue-300">
                {stats.punchedOutCount}
              </span>
            </span>

            <span className="opacity-50">|</span>

            <span>
              <span className="opacity-80">Available:</span>{" "}
              <span className="font-semibold text-blue-300">
                {stats.availableCount}
              </span>
            </span>

            <span className="opacity-50">|</span>

            <span>
              <span className="opacity-80">On Trip:</span>{" "}
              <span className="font-semibold text-yellow-300">
                {stats.onTripCount}
              </span>
            </span>

            <span className="opacity-50">|</span>

            <span>
              <span className="opacity-80">Assigned:</span>{" "}
              <span className="font-semibold text-purple-300">
                {stats.assignedCount}
              </span>
            </span>

            <span className="opacity-50">|</span>

            <span>
              <span className="opacity-80">UnAssigned:</span>{" "}
              <span className="font-semibold text-purple-300">
                {stats.unAssignedCount}
              </span>
            </span>
          </div>
        )}
      </div>

      {/* TOP BAR */}

      {/* ✅ ADD FILTER HERE */}
      <DriverFilter
        appliedFilters={filters}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
      />

      {/* main */}
      <div className="flex justify-between items-center mb-4">
        {/* LEFT SIDE HEADING */}
        <h1 className="text-2xl font-bold text-gray-800">Driver Management</h1>

        {/* RIGHT SIDE BUTTONS */}
        <div className="flex gap-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={exportExcel}
            className="bg-green-600 text-white px-5 py-2 rounded-lg"
          >
            {isExporting ? <LoderBtn /> : "Export Excel"}
          </motion.button>

          {hasPermission(SECTION, "create") && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAddDriver}
              className="bg-primary text-white px-5 py-2 rounded-lg"
            >
              {isLoading ? <LoderBtn /> : "Add Chauffeur"}
            </motion.button>
          )}
        </div>
      </div>
      {/* <div className="flex justify-between items-center mb-8">
        <div className="flex gap-4 justyfy-end">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={exportExcel}
            className="bg-green-600 text-white px-5 py-2 rounded-lg"
          >
            {isExporting ? <LoderBtn /> : "Export Excel"}
          </motion.button>


          {hasPermission(SECTION, "create") && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAddDriver}
              className="bg-primary text-white px-5 py-2 rounded-lg"
            >
              {isLoading ? <LoderBtn /> : "Add Chauffeur"}
            </motion.button>
          )}
        </div>
      </div> */}

      {/* TABLE */}

      {/* Replace your existing table with this updated version */}

      <TableContainer component={Paper} className="rounded-xl shadow">
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>S.No</StyledTableCell>
              <StyledTableCell>PROFILE</StyledTableCell>
              <StyledTableCell>DETAILS</StyledTableCell>
              <StyledTableCell>TRIP & ATTENDANCE</StyledTableCell>
              <StyledTableCell>REGION</StyledTableCell>
              <StyledTableCell>ADDRESS</StyledTableCell>

              {/* New: License Column Added */}
              <StyledTableCell>LICENSE</StyledTableCell>

              <StyledTableCell>DOCUMENTS</StyledTableCell>
              <StyledTableCell>VEHICLE</StyledTableCell>
              <StyledTableCell>JOINING / LEAVING</StyledTableCell>
              <StyledTableCell>MEDICAL CERT</StyledTableCell>
              <StyledTableCell>STATUS</StyledTableCell>
              <StyledTableCell align="center">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={13} align="center">
                  No Drivers Found
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, index) => (
                <TableRow key={row.id} hover>
                  <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>

                  {/* PROFILE */}
                  <TableCell>
                    <img
                      src={row?.profilePic || "/no-image.png"}
                      alt="profile"
                      className="w-12 h-12 rounded-full object-cover border"
                    />
                  </TableCell>

                  {/* DETAILS */}
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-gray-800">
                        {[row.name, row.midName, row.lastName]
                          .filter(Boolean)
                          .join(" ")}
                      </span>
                      <span className="text-sm text-gray-500">{row.email}</span>
                      <span className="text-sm text-gray-500">{row.phone}</span>
                    </div>
                  </TableCell>

                  {/* TRIP & ATTENDANCE */}
                  <TableCell>
                    <div className="flex flex-col gap-2">
                      <MenuItem
                        onClick={() => navigate(`driverBookingView/${row.id}`)}
                      >
                        <EyeIcon className="h-5 w-5 text-blue-600 mr-2" /> Trips
                      </MenuItem>
                      <MenuItem
                        onClick={() => navigate(`driverAttendance/${row.id}`)}
                      >
                        <CalendarDaysIcon className="h-5 w-5 text-green-600 mr-2" />{" "}
                        Attendance
                      </MenuItem>
                    </div>
                  </TableCell>

                  <TableCell>{row?.region?.name || "N/A"}</TableCell>

                  <TableCell>
                    <div className="text-sm">
                      {row.permanentAddress || "N/A"}
                    </div>
                  </TableCell>

                  {/* ==================== LICENSE COLUMN ==================== */}
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-semibold text-gray-700">
                        {row.licenseNumber || "N/A"}
                      </div>
                      {row.licenseExpiry && (
                        <div className="text-xs text-gray-500 mt-1">
                          Exp:{" "}
                          {new Date(row.licenseExpiry).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  {/* ======================================================= */}

                  {/* DOCUMENTS */}
                  <TableCell>
                    <div className="text-xs space-y-1">
                      <div>
                        <strong>Aadhaar:</strong> {row.adhaarNumber || "N/A"}
                      </div>
                      <div>
                        <strong>PAN:</strong> {row.panNumber || "N/A"}
                      </div>
                    </div>
                  </TableCell>

                  {/* VEHICLE */}
                  <TableCell>
                    {row.vehicles?.length > 0 ? (
                      row.vehicles.map((v) => (
                        <div key={v._id} className="text-sm">
                          {v.brand} - {v.carNumber}
                        </div>
                      ))
                    ) : (
                      <span className="text-gray-400">No Vehicle</span>
                    )}
                  </TableCell>

                  {/* JOINING / LEAVING */}
                  <TableCell>
                    <div className="text-sm space-y-1">
                      <div>
                        Joined:{" "}
                        {row.dateOfJoining
                          ? new Date(row.dateOfJoining).toLocaleDateString()
                          : "N/A"}
                      </div>
                      {row.dateOfLeaving && (
                        <div className="text-red-600">
                          Left:{" "}
                          {new Date(row.dateOfLeaving).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </TableCell>

                  {/* MEDICAL CERT */}
                  <TableCell>
                    <div className="text-sm space-y-1">
                      <div>
                        Issue:{" "}
                        {row.medicalCertificateIssue
                          ? new Date(
                              row.medicalCertificateIssue,
                            ).toLocaleDateString()
                          : "N/A"}
                      </div>
                      <div>
                        Expiry:{" "}
                        {row.medicalCertificateExpiry
                          ? new Date(
                              row.medicalCertificateExpiry,
                            ).toLocaleDateString()
                          : "N/A"}
                      </div>
                    </div>
                  </TableCell>

                  {/* STATUS */}
                  <TableCell>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${row.isVerified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                    >
                      {row.isVerified ? "Verified" : "Pending"}
                    </span>
                  </TableCell>

                  {/* ACTIONS */}
                  <TableCell align="center">
                    <IconButton onClick={(e) => handleMenuOpen(e, row.id)}>
                      <MoreVertIcon />
                    </IconButton>
                    {/* Your Menu remains same */}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            navigate(`driverView/${selectedRowId}`);
            handleMenuClose();
          }}
        >
          <EyeIcon className="h-5 w-5 text-blue-600 mr-2" />
          View
        </MenuItem>

        <MenuItem
          onClick={() => {
            navigate(`updateDriver/${selectedRowId}`);
            handleMenuClose();
          }}
        >
          <PencilIcon className="h-5 w-5 text-green-600 mr-2" />
          Edit
        </MenuItem>

        <MenuItem onClick={() => deleteHandler(selectedRowId)}>
          <TrashIcon className="h-5 w-5 text-red-600 mr-2" />
          Delete
        </MenuItem>
      </Menu>

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
