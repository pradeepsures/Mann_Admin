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
// import Pagination from "@mui/material/Pagination";
// import Stack from "@mui/material/Stack";

// import MoreVertIcon from "@mui/icons-material/MoreVert";

// import {
//   EyeIcon,
//   PencilIcon,
//   TrashIcon,
// } from "@heroicons/react/24/outline";

// import { motion } from "framer-motion";
// import { Modal } from "antd";
// import toast from "react-hot-toast";

// import Loader from "../../compoents/Loader";
// import LoderBtn from "../../compoents/LoderBtn";
// import Breaker from "../../compoents/Breaker";

// import {
//   getAllCorporates,
// } from "../../Services/CorporateApi";

// const StyledTableCell = styled(TableCell)(({ theme }) => ({
//   [`&.${tableCellClasses.head}`]: {
//     background: "linear-gradient(to right, #03045E, #023E8A, #0077B6)",
//     color: "#fff",
//     fontWeight: 600,
//     fontSize: "0.95rem",
//   },

//   [`&.${tableCellClasses.body}`]: {
//     fontSize: "0.9rem",
//     color: "#374151",
//   },
// }));

// export default function CorporateList() {
//   const navigate = useNavigate();

//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [totalPages, setTotalPages] = useState(1);
//   const [totalRecord, setTotalRecord] = useState(0);

//   const [page, setPage] = useState(1);
//   const [rowsPerPage] = useState(10);

//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedRowId, setSelectedRowId] = useState(null);

//   const [isLoading, setIsLoading] = useState(false);

//   // FETCH CORPORATES
//   const fetchCorporates = useCallback(async () => {
//     try {
//       setLoading(true);

//       const result = await getAllCorporates({
//         page,
//         rowsPerPage,
//       });

//       if (result?.status) {
//         const formatted = result.data.map((item) => ({
//           ...item,
//           id: item._id,
//         }));

//         setData(formatted);
//         setTotalPages(result.totalPage || 1);
//         setTotalRecord(result.totalResult || 0);
//       }
//     } catch (err) {
//       toast.error("Failed to fetch corporates");
//     } finally {
//       setLoading(false);
//     }
//   }, [page, rowsPerPage]);

//   useEffect(() => {
//     fetchCorporates();
//   }, [fetchCorporates]);

//   // MENU
//   const handleMenuOpen = (event, id) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedRowId(id);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setSelectedRowId(null);
//   };

//   // PAGINATION
//   const handlePageChange = (event, newPage) => {
//     setPage(newPage);
//   };



//   // ADD CORPORATE
//   const handleAddCorporate = () => {
//     setIsLoading(true);

//     setTimeout(() => {
//       navigate("createCorporate");
//       setIsLoading(false);
//     }, 300);
//   };

//   if (loading) return <Loader />;

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       {/* TOP */}
//       <div className="flex justify-between items-center mb-5">
//         <Breaker />

//         <div className="bg-gradient-to-r from-[#03045E] to-[#0077B6] text-white shadow-md rounded-lg px-4 py-2 text-sm flex items-center gap-3">
//           <span>
//             <span className="opacity-80">Total:</span>{" "}
//             <span className="font-semibold">{totalRecord}</span>
//           </span>
//         </div>
//       </div>

//       {/* HEADER */}
//       <div className="flex justify-between items-center mb-5">
//         <h1 className="text-2xl font-bold text-gray-800">
//           Corporate Management
//         </h1>

//         <motion.button
//           whileTap={{ scale: 0.95 }}
//           onClick={handleAddCorporate}
//           className="bg-primary text-white px-5 py-2 rounded-lg shadow"
//         >
//           {isLoading ? <LoderBtn /> : "Add Corporate"}
//         </motion.button>
//       </div>

//       {/* TABLE */}
//       <TableContainer component={Paper} className="rounded-xl shadow">
//         <Table>
//           <TableHead>
//             <TableRow>
//               <StyledTableCell>S.No</StyledTableCell>

//               <StyledTableCell>PROFILE</StyledTableCell>

//               <StyledTableCell>COMPANY DETAILS</StyledTableCell>

//               <StyledTableCell>CONTACT PERSON</StyledTableCell>

//               <StyledTableCell>ADDRESS</StyledTableCell>

//               <StyledTableCell>STATUS</StyledTableCell>

//               <StyledTableCell align="center">
//                 ACTIONS
//               </StyledTableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {data.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={7} align="center">
//                   No Corporates Found
//                 </TableCell>
//               </TableRow>
//             ) : (
//               data.map((row, index) => (
//                 <TableRow key={row.id}>
//                   {/* SERIAL */}
//                   <TableCell>
//                     {(page - 1) * rowsPerPage + index + 1}
//                   </TableCell>

//                   {/* PROFILE */}
//                   <TableCell>
//                     <img
//                       src={row?.profileImage || "/no-image.png"}
//                       alt="profile"
//                       className="w-14 h-14 rounded-full object-cover border"
//                     />
//                   </TableCell>

//                   {/* DETAILS */}
//                   <TableCell>
//                     <div className="flex flex-col gap-1">
//                       <span className="font-semibold text-gray-800">
//                         {row.companyName}
//                       </span>

//                       <span className="text-sm text-gray-500">
//                         {row.email}
//                       </span>

//                       <span className="text-sm text-gray-500">
//                         {row.companyPhone}
//                       </span>

//                       <span className="text-xs text-blue-600">
//                         {row.industryType}
//                       </span>
//                     </div>
//                   </TableCell>

//                   {/* CONTACT */}
//                   <TableCell>
//                     <div className="flex flex-col gap-1">
//                       <span className="font-medium">
//                         {row?.contactPerson?.name || "N/A"}
//                       </span>

//                       <span className="text-sm text-gray-500">
//                         {row?.contactPerson?.phone || "N/A"}
//                       </span>

//                       <span className="text-xs text-gray-500">
//                         {row?.contactPerson?.designation || "N/A"}
//                       </span>
//                     </div>
//                   </TableCell>

//                   {/* ADDRESS */}
//                   <TableCell>
//                     <div className="text-sm text-gray-700">
//                       {row?.companyAddress?.addressLine1},{" "}
//                       {row?.companyAddress?.city},
//                       <br />
//                       {row?.companyAddress?.state} -{" "}
//                       {row?.companyAddress?.pincode}
//                     </div>
//                   </TableCell>

//                   {/* STATUS */}
//                   <TableCell>
//                     <div className="flex flex-col gap-2">
//                       <span
//                         className={`px-3 py-1 rounded-full text-xs font-medium w-fit ${
//                           row.isApproved
//                             ? "bg-green-100 text-green-700"
//                             : "bg-yellow-100 text-yellow-700"
//                         }`}
//                       >
//                         {row.isApproved ? "Approved" : "Pending"}
//                       </span>

//                       <span
//                         className={`px-3 py-1 rounded-full text-xs font-medium w-fit ${
//                           row.isActive
//                             ? "bg-blue-100 text-blue-700"
//                             : "bg-red-100 text-red-700"
//                         }`}
//                       >
//                         {row.isActive ? "Active" : "Inactive"}
//                       </span>
//                     </div>
//                   </TableCell>

//                   {/* ACTIONS */}
//                   <TableCell align="center">
//                     <IconButton
//                       onClick={(e) =>
//                         handleMenuOpen(e, row.id)
//                       }
//                     >
//                       <MoreVertIcon />
//                     </IconButton>

//                     <Menu
//                       anchorEl={anchorEl}
//                       open={
//                         Boolean(anchorEl) &&
//                         selectedRowId === row.id
//                       }
//                       onClose={handleMenuClose}
//                     >
//                       {/* VIEW */}
//                       <MenuItem
//                         onClick={() => {
//                           navigate(`corporateView/${row.id}`);
//                         }}
//                       >
//                         <EyeIcon className="h-5 w-5 text-blue-600 mr-2" />
//                         View
//                       </MenuItem>

//                       {/* EDIT */}
//                       <MenuItem
//                         onClick={() => {
//                           navigate(`updateCorporate/${row.id}`);
//                         }}
//                       >
//                         <PencilIcon className="h-5 w-5 text-green-600 mr-2" />
//                         Edit
//                       </MenuItem>

//                     </Menu>
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
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
//             color="primary"
//           />
//         </Stack>
//       )}
//     </div>
//   );
// }

// CorporateList.jsx

import * as React from "react";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, {
  tableCellClasses,
} from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

import MoreVertIcon from "@mui/icons-material/MoreVert";

import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

import { motion } from "framer-motion";
import { Modal } from "antd";
import toast from "react-hot-toast";

import Loader from "../../compoents/Loader";
import LoderBtn from "../../compoents/LoderBtn";

import CorporateFilter from "./CorporateFilter";

import {
  getAllCorporates,
} from "../../Services/CorporateApi";

import { useAuth } from "../../auth/AuthContext";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    background:
      "linear-gradient(to right, #03045E, #023E8A, #0077B6)",
    color: "#fff",
    fontWeight: 600,
    fontSize: "0.95rem",
  },
}));

export default function CorporateList() {
  const { hasPermission } = useAuth();

  const navigate = useNavigate();

  const SECTION = "Corporate";

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);

  const [totalPages, setTotalPages] = useState(0);
  const [totalRecord, setTotalRecord] = useState(0);

  const [filters, setFilters] = useState({});

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRowId, setSelectedRowId] =
    useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const fetchCorporates = useCallback(async () => {
    try {
      setLoading(true);

      const result = await getAllCorporates({
        page,
        rowsPerPage,
        ...filters,
      });

      if (result?.status) {
        setData(
          result.data.map((item) => ({
            ...item,
            id: item._id,
          }))
        );

        setTotalPages(result.totalPage);
        setTotalRecord(result.totalResult);
      }
    } catch (err) {
      toast.error("Error fetching corporates");
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, filters]);

  useEffect(() => {
    fetchCorporates();
  }, [fetchCorporates]);

  const handleApplyFilters = (f) => {
    setPage(1);
    setFilters(f);
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

 
  const handleAddCorporate = () => {
    setIsLoading(true);

    setTimeout(() => {
      navigate("createCorporate");
      setIsLoading(false);
    }, 300);
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* FILTER */}
      <CorporateFilter
        appliedFilters={filters}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
      />

      {/* TOP */}
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold text-gray-800">
          Corporate Management
        </h1>

        {hasPermission(SECTION, "create") && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAddCorporate}
            className="bg-primary text-white px-5 py-2 rounded-lg"
          >
            {isLoading ? (
              <LoderBtn />
            ) : (
              "Add Corporate"
            )}
          </motion.button>
        )}
      </div>

      {/* TABLE */}
      <TableContainer
        component={Paper}
        className="rounded-xl shadow"
      >
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>S.No</StyledTableCell>

              <StyledTableCell>
                COMPANY
              </StyledTableCell>

              <StyledTableCell>
                CONTACT PERSON
              </StyledTableCell>

              <StyledTableCell>
                INDUSTRY
              </StyledTableCell>

              <StyledTableCell>
                ADDRESS
              </StyledTableCell>

              <StyledTableCell>
                STATUS
              </StyledTableCell>

              <StyledTableCell align="center">
                Actions
              </StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  align="center"
                >
                  No Corporates Found
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, index) => (
                <TableRow key={row.id}>
                  {/* SNO */}
                  <TableCell>
                    {(page - 1) * rowsPerPage +
                      index +
                      1}
                  </TableCell>

                  {/* COMPANY */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          row?.profileImage ||
                          "/no-image.png"
                        }
                        alt="company"
                        className="w-12 h-12 rounded-full object-cover border"
                      />

                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-800">
                          {row.companyName}
                        </span>

                        <span className="text-sm text-gray-500">
                          {row.email}
                        </span>

                        <span className="text-sm text-gray-500">
                          {row.companyPhone}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* CONTACT PERSON */}
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {row?.contactPerson?.name ||
                          "N/A"}
                      </span>

                      <span className="text-sm text-gray-500">
                        {
                          row?.contactPerson
                            ?.designation
                        }
                      </span>

                      <span className="text-sm text-gray-500">
                        {
                          row?.contactPerson?.phone
                        }
                      </span>
                    </div>
                  </TableCell>

                  {/* INDUSTRY */}
                  <TableCell>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                      {row.industryType || "N/A"}
                    </span>
                  </TableCell>

                  {/* ADDRESS */}
                  <TableCell>
                    <div className="text-sm text-gray-700 max-w-xs">
                      {
                        row?.companyAddress
                          ?.addressLine1
                      }
                      ,{" "}
                      {
                        row?.companyAddress
                          ?.addressLine2
                      }
                      <br />
                      {row?.companyAddress?.city},{" "}
                      {row?.companyAddress?.state}
                      <br />
                      {
                        row?.companyAddress
                          ?.country
                      }{" "}
                      -{" "}
                      {
                        row?.companyAddress
                          ?.pincode
                      }
                    </div>
                  </TableCell>

                  {/* STATUS */}
                  <TableCell>
                    <div className="flex flex-col gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium w-fit ${
                          row.isApproved
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {row.isApproved
                          ? "Approved"
                          : "Pending"}
                      </span>

                      {/* <span
                        className={`px-3 py-1 rounded-full text-xs font-medium w-fit ${
                          row.isActive
                            ? "bg-blue-100 text-blue-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {row.isActive
                          ? "Active"
                          : "Inactive"}
                      </span> */}
                    </div>
                  </TableCell>

                  {/* ACTION */}
                  <TableCell align="center">
                    <IconButton
                      onClick={(e) =>
                        handleMenuOpen(e, row.id)
                      }
                    >
                      <MoreVertIcon />
                    </IconButton>

                    <Menu
                      anchorEl={anchorEl}
                      open={
                        Boolean(anchorEl) &&
                        selectedRowId === row.id
                      }
                      onClose={handleMenuClose}
                    >
                      {hasPermission(
                        SECTION,
                        "read"
                      ) && (
                        <MenuItem
                          onClick={() =>
                            navigate(
                              `view/${row.id}`
                            )
                          }
                        >
                          <EyeIcon className="h-5 w-5 text-blue-600 mr-2" />
                          View
                        </MenuItem>
                      )}

                      {hasPermission(
                        SECTION,
                        "update"
                      ) && (
                        <MenuItem
                          onClick={() =>
                            navigate(
                              `edit/${row.id}`
                            )
                          }
                        >
                          <PencilIcon className="h-5 w-5 text-green-600 mr-2" />
                          Edit
                        </MenuItem>
                      )}

                      {/* {hasPermission(
                        SECTION,
                        "delete"
                      ) && (
                        <MenuItem
                          onClick={() =>
                            deleteHandler(row.id)
                          }
                        >
                          <TrashIcon className="h-5 w-5 text-red-600 mr-2" />
                          Delete
                        </MenuItem>
                      )} */}
                    </Menu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* PAGINATION */}
      {totalRecord > rowsPerPage && (
        <Stack
          spacing={2}
          alignItems="center"
          mt={6}
        >
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