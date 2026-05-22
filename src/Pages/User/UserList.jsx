// src/pages/User/UserList.jsx

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
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import Switch from "@mui/material/Switch";

import MoreVertIcon from "@mui/icons-material/MoreVert";

import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

import { motion } from "framer-motion";

import toast from "react-hot-toast";

import { Modal } from "antd";

import AOS from "aos";
import "aos/dist/aos.css";

import Breaker from "../../compoents/Breaker";
import Loader from "../../compoents/Loader";
import LoderBtn from "../../compoents/LoderBtn";

import {
  getAllUsers,
  deleteUserApi,
  toggleUserStatusApi,
} from "../../Services/UserApi";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    background:
      "linear-gradient(90deg, #03045E 0%, #0077B6 50%, #00B4D8 100%)",
    color: theme.palette.common.white,
    fontWeight: 600,
    fontSize: "0.95rem",
    padding: "14px 16px",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },

  [`&.${tableCellClasses.body}`]: {
    fontSize: "0.92rem",
    color: "#374151",
    padding: "14px 16px",
  },
}));

const StyledTableRow = styled(TableRow)(() => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "#f9fafb",
  },

  "&:hover": {
    backgroundColor: "#f1f5f9",
    transition: "0.2s ease",
  },

  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function UserList() {
  const navigate = useNavigate();

  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);

  const [rowsPerPage] = useState(10);

  const [totalPages, setTotalPages] = useState(0);

  const [totalRecord, setTotalRecord] = useState(0);

  const [search, setSearch] = useState("");

  const [searchQuery, setSearchQuery] = useState("");

  const [gender, setGender] = useState("");

  const [isVerified, setIsVerified] = useState("");

  const [anchorEl, setAnchorEl] = useState(null);

  const [selectedRowId, setSelectedRowId] = useState(null);

  const [btnLoading, setBtnLoading] = useState(false);

  // ─────────────────────────────────────
  // FETCH USERS
  // ─────────────────────────────────────

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);

      const result = await getAllUsers({
        page,
        rowsPerPage,
        search: searchQuery,
        gender,
        isVerified,
      });

      if (result?.status) {
        setData(result?.data || []);

        setTotalPages(result?.totalPage || 0);

        setTotalRecord(result?.totalResult || 0);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchQuery, gender, isVerified]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  // ─────────────────────────────────────
  // PAGINATION
  // ─────────────────────────────────────

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // ─────────────────────────────────────
  // MENU
  // ─────────────────────────────────────

  const handleMenuOpen = (event, id) => {
    setAnchorEl(event.currentTarget);

    setSelectedRowId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);

    setSelectedRowId(null);
  };

  // ─────────────────────────────────────
  // DELETE USER
  // ─────────────────────────────────────

  const deleteHandler = (id) => {
    Modal.confirm({
      title: "Delete User",

      content:
        "Are you sure you want to delete this user?",

      okText: "Delete",

      okType: "danger",

      cancelText: "Cancel",

      onOk: async () => {
        try {
          setLoading(true);

          const result = await deleteUserApi(id);

          if (result?.status) {
            toast.success(result?.message);

            fetchUsers();
          }
        } catch (error) {
          toast.error(error.message);
        } finally {
          setLoading(false);
        }
      },
    });

    handleMenuClose();
  };

  // ─────────────────────────────────────
  // TOGGLE STATUS
  // ─────────────────────────────────────

  const toggleStatus = async (id) => {
    try {
      const result = await toggleUserStatusApi(id);

      if (result?.status) {
        toast.success(result?.message);

        fetchUsers();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ─────────────────────────────────────
  // CREATE USER
  // ─────────────────────────────────────

  const handleCreate = () => {
    setBtnLoading(true);

    setTimeout(() => {
      navigate("/home/users/create");

      setBtnLoading(false);
    }, 400);
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* BREAKER */}

      <div className="mb-6">
        <Breaker />
      </div>

      {/* HEADER */}

      <div className="flex flex-col lg:flex-row justify-between gap-5 mb-8">

        {/* SEARCH + FILTER */}

        <div className="flex flex-wrap items-center gap-4">

          {/* SEARCH */}

          <input
            type="text"
            placeholder="Search by name/email/mobile"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-80 px-4 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={() => {
              setSearchQuery(search);

              setPage(1);
            }}
            className="bg-primary text-white px-5 py-2.5 rounded-lg"
          >
            Search
          </button>

          {/* GENDER FILTER */}

          <select
            value={gender}
            onChange={(e) => {
              setGender(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2.5 border rounded-lg"
          >
            <option value="">All Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          {/* VERIFIED FILTER */}

          <select
            value={isVerified}
            onChange={(e) => {
              setIsVerified(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2.5 border rounded-lg"
          >
            <option value="">All Status</option>
            <option value="true">Verified</option>
            <option value="false">Unverified</option>
          </select>
        </div>

        {/* CREATE BUTTON */}

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleCreate}
          className="bg-primary text-white px-5 py-2.5 rounded-lg font-medium shadow"
        >
          {btnLoading ? (
            <span className="flex items-center gap-2">
              <LoderBtn />
              Creating...
            </span>
          ) : (
            "Create User"
          )}
        </motion.button>
      </div>

      {/* TABLE */}

      <TableContainer
        component={Paper}
        className="rounded-xl shadow-lg overflow-hidden"
      >
        <Table sx={{ minWidth: 900 }}>

          {/* HEAD */}

          <TableHead>
            <TableRow>
              <StyledTableCell>S.No</StyledTableCell>

              <StyledTableCell>User</StyledTableCell>

              <StyledTableCell>Details</StyledTableCell>

              <StyledTableCell>Gender</StyledTableCell>

              <StyledTableCell>Status</StyledTableCell>

              <StyledTableCell align="center">
                Actions
              </StyledTableCell>
            </TableRow>
          </TableHead>

          {/* BODY */}

          <TableBody>

            {data.length === 0 ? (
              <StyledTableRow>
                <StyledTableCell
                  colSpan={6}
                  align="center"
                  className="py-10"
                >
                  No Users Found
                </StyledTableCell>
              </StyledTableRow>
            ) : (
              data.map((row, index) => (
                <StyledTableRow key={row._id}>

                  {/* SERIAL */}

                  <StyledTableCell>
                    {(page - 1) * rowsPerPage + index + 1}
                  </StyledTableCell>

                  {/* USER */}

                  <StyledTableCell>

                    <div className="flex items-center gap-3">

                      <Avatar
                        src={row?.profilePic}
                        alt={row?.name}
                        sx={{
                          width: 50,
                          height: 50,
                        }}
                      />
                    </div>
                  </StyledTableCell>

                  {/* DETAILS */}

                  <StyledTableCell>

                    <div className="space-y-1">

                      <p className="text-sm">
                        <p className="text-sm">
                        <span className="font-semibold">
                          Name:
                        </span>{" "}
                        {row?.name || "N/A"}
                      </p>
                        <span className="font-semibold">
                          Email:
                        </span>{" "}
                        {row?.email || "N/A"}
                      </p>

                      <p className="text-sm">
                        <span className="font-semibold">
                          Phone:
                        </span>{" "}
                        {row?.countryCode} {row?.mobile}
                      </p>
                    </div>
                  </StyledTableCell>

                  {/* GENDER */}

                  <StyledTableCell>
                    {row?.gender || "N/A"}
                  </StyledTableCell>

                  {/* STATUS */}

                  <StyledTableCell>

                    <div className="flex items-center gap-2">

                      <Switch
                        checked={row?.isVerified}
                        onChange={() =>
                          toggleStatus(row?._id)
                        }
                      />

                      <span
                        className={`text-sm font-medium ${
                          row?.isVerified
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        {row?.isVerified
                          ? "Verified"
                          : "Unverified"}
                      </span>
                    </div>
                  </StyledTableCell>

                  {/* ACTIONS */}

                  <StyledTableCell align="center">

                    <Tooltip title="Actions">

                      <IconButton
                        onClick={(e) =>
                          handleMenuOpen(e, row._id)
                        }
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Tooltip>

                    <Menu
                      anchorEl={anchorEl}
                      open={
                        Boolean(anchorEl) &&
                        selectedRowId === row._id
                      }
                      onClose={handleMenuClose}
                    >

                      {/* VIEW */}

                      <MenuItem
                        onClick={() => {
                          navigate(
                            `/home/users/view/${row._id}`
                          );

                          handleMenuClose();
                        }}
                      >
                        <EyeIcon className="h-5 w-5 text-blue-500 mr-2" />
                        View
                      </MenuItem>

                      {/* EDIT */}

                      <MenuItem
                        onClick={() => {
                          navigate(
                            `/home/users/edit/${row._id}`
                          );

                          handleMenuClose();
                        }}
                      >
                        <PencilIcon className="h-5 w-5 text-green-500 mr-2" />
                        Edit
                      </MenuItem>

                      {/* DELETE */}

                      <MenuItem
                        onClick={() =>
                          deleteHandler(row._id)
                        }
                      >
                        <TrashIcon className="h-5 w-5 text-red-500 mr-2" />
                        Delete
                      </MenuItem>
                    </Menu>
                  </StyledTableCell>
                </StyledTableRow>
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
          marginTop={5}
        >
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            variant="outlined"
            color="primary"
          />
        </Stack>
      )}
    </div>
  );
}