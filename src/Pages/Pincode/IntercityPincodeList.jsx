import * as React from "react";
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
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
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

import { Modal, Form, Input, Button } from "antd";

import toast from "react-hot-toast";

import Breaker from "../../compoents/Breaker";
import Loader from "../../compoents/Loader";

import {
  getAllInterCityPincodes,
  createInterCityPincodeApi,
  updateInterCityPincodeApi,
  deleteInterCityPincode,
  getInterCityPincodeById,
  bulkUploadInterCityPincodeApi,
} from "../../Services/IntercityPincodeApi";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    background: "linear-gradient(to right, #03045E, #023E8A, #0077B6)",
    color: theme.palette.common.white,
    fontWeight: 600,
    fontSize: "0.95rem",
    padding: "12px 16px",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: "0.9rem",
    color: "#374151",
    padding: "12px 16px",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "#f9fafb",
  },
  "&:hover": {
    backgroundColor: "#f1f5f9",
  },
}));

export default function InterCityPincodeList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);

  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);

  // Create Modal
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();

  // Edit Modal
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editForm] = Form.useForm();

  const [editingData, setEditingData] = useState(null);

  const [bulkModalVisible, setBulkModalVisible] = useState(false);

  const [bulkPincodes, setBulkPincodes] = useState([""]);

  // ────────────────────────────────────────────────
  // Fetch Data
  // ────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const result = await getAllInterCityPincodes({
        page,
        rowsPerPage,
        searchQuery,
      });

      if (result?.status) {
        setData(result.data || []);
        setTotalPages(result.totalPage || 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ────────────────────────────────────────────────
  // Search
  // ────────────────────────────────────────────────
  const handleSearch = () => {
    setSearchQuery(search);
    setPage(1);
  };

  // ────────────────────────────────────────────────
  // Menu
  // ────────────────────────────────────────────────
  const handleMenuOpen = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedRowId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRowId(null);
  };

  // ────────────────────────────────────────────────
  // Create
  // ────────────────────────────────────────────────
  const openCreateModal = () => {
    createForm.resetFields();
    setCreateModalVisible(true);
  };

  const handleCreate = async (values) => {
    try {
      const res = await createInterCityPincodeApi({
        pincode: Number(values.pincode),
      });

      if (res?.status) {
        toast.success("Created successfully");
        setCreateModalVisible(false);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addMorePincodeField = () => {
    setBulkPincodes([...bulkPincodes, ""]);
  };

  const removePincodeField = (index) => {
    const updated = [...bulkPincodes];
    updated.splice(index, 1);
    setBulkPincodes(updated);
  };

  const updatePincodeValue = (index, value) => {
    const updated = [...bulkPincodes];
    updated[index] = value;
    setBulkPincodes(updated);
  };

  const handleBulkUpload = async () => {
    try {
      const cleaned = bulkPincodes.map((p) => p.trim()).filter((p) => p !== "");

      if (cleaned.length === 0) {
        return toast.error("Please enter at least one pincode");
      }

      const res = await bulkUploadInterCityPincodeApi({
        pincodes: cleaned,
      });

      if (res?.status) {
        toast.success("Bulk upload successful");

        setBulkModalVisible(false);

        setBulkPincodes([""]);

        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ────────────────────────────────────────────────
  // Edit
  // ────────────────────────────────────────────────
  const openEditModal = async (id) => {
    try {
      const res = await getInterCityPincodeById(id);

      if (res?.status) {
        setEditingData(res.data);

        editForm.setFieldsValue({
          pincode: res.data.pincode,
        });

        setEditModalVisible(true);
      }
    } catch (err) {
      console.error(err);
    }

    handleMenuClose();
  };

  const handleUpdate = async (values) => {
    try {
      const res = await updateInterCityPincodeApi(editingData._id, {
        pincode: Number(values.pincode),
      });

      if (res?.status) {
        toast.success("Updated successfully");
        setEditModalVisible(false);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ────────────────────────────────────────────────
  // Delete
  // ────────────────────────────────────────────────
  const deleteHandler = (id) => {
    Modal.confirm({
      title: "Delete Pincode",
      content: "Are you sure?",
      okText: "Delete",
      okType: "danger",

      onOk: async () => {
        try {
          const res = await deleteInterCityPincode(id);

          if (res?.status) {
            toast.success("Deleted successfully");
            fetchData();
          }
        } catch (err) {
          console.error(err);
        }
      },
    });

    handleMenuClose();
  };

  // ────────────────────────────────────────────────
  // Pagination
  // ────────────────────────────────────────────────
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Breaker />

        <div className="mt-4 text-sm text-gray-600 flex items-center gap-2">
          <Link to="/dashboard">Dashboard</Link>

          <span>/</span>

          <span className="font-medium text-gray-800">
            InterCity Pincode List
          </span>
        </div>
      </div>

      {/* Top */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search pincode..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-96 px-4 py-2.5 border border-gray-200 rounded-lg"
          />

          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg"
          >
            Search
          </button>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setBulkModalVisible(true)}
            className="bg-green-600 text-white px-5 py-2.5 rounded-lg"
          >
            Bulk Upload
          </button>

          <button
            onClick={openCreateModal}
            className="bg-primary text-white px-5 py-2.5 rounded-lg"
          >
            Add Pincode
          </button>
        </div>

        {/* <button
          onClick={openCreateModal}
          className="bg-primary text-white px-5 py-2.5 rounded-lg"
        >
          Add Pincode
        </button> */}
      </div>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>S.No</StyledTableCell>
              <StyledTableCell>Pincode</StyledTableCell>
              <StyledTableCell>Created At</StyledTableCell>
              <StyledTableCell align="center">Actions</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.length === 0 ? (
              <StyledTableRow>
                <StyledTableCell colSpan={4} align="center">
                  No Data Found
                </StyledTableCell>
              </StyledTableRow>
            ) : (
              data.map((row, index) => (
                <StyledTableRow key={row._id}>
                  <StyledTableCell>
                    {(page - 1) * rowsPerPage + index + 1}
                  </StyledTableCell>

                  <StyledTableCell>{row.pincode}</StyledTableCell>

                  <StyledTableCell>
                    {new Date(row.date).toLocaleDateString("en-IN")}
                  </StyledTableCell>

                  <StyledTableCell align="center">
                    <IconButton onClick={(e) => handleMenuOpen(e, row._id)}>
                      <MoreVertIcon />
                    </IconButton>

                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl) && selectedRowId === row._id}
                      onClose={handleMenuClose}
                    >
                      <MenuItem onClick={() => openEditModal(row._id)}>
                        <PencilIcon className="h-5 w-5 text-green-600 mr-2" />
                        Edit
                      </MenuItem>

                      <MenuItem onClick={() => deleteHandler(row._id)}>
                        <TrashIcon className="h-5 w-5 text-red-600 mr-2" />
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

      {/* Create Modal */}
      <Modal
        title="Create Pincode"
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        footer={null}
      >
        <Form form={createForm} layout="vertical" onFinish={handleCreate}>
          <Form.Item
            name="pincode"
            label="Pincode"
            rules={[{ required: true, message: "Pincode required" }]}
          >
            <Input placeholder="Enter pincode" maxLength={6} />
          </Form.Item>

          <div className="flex justify-end gap-3">
            <Button onClick={() => setCreateModalVisible(false)}>Cancel</Button>

            <Button type="primary" htmlType="submit">
              Create
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Edit Pincode"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
      >
        <Form form={editForm} layout="vertical" onFinish={handleUpdate}>
          <Form.Item
            name="pincode"
            label="Pincode"
            rules={[{ required: true, message: "Pincode required" }]}
          >
            <Input placeholder="Enter pincode" maxLength={6} />
          </Form.Item>

          <div className="flex justify-end gap-3">
            <Button onClick={() => setEditModalVisible(false)}>Cancel</Button>

            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </div>
        </Form>
      </Modal>

      <Modal
        title="Bulk Upload Pincodes"
        open={bulkModalVisible}
        onCancel={() => setBulkModalVisible(false)}
        footer={null}
      >
        <div className="space-y-4">
          {bulkPincodes.map((pin, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="Enter pincode"
                maxLength={6}
                value={pin}
                onChange={(e) => updatePincodeValue(index, e.target.value)}
              />

              {bulkPincodes.length > 1 && (
                <Button danger onClick={() => removePincodeField(index)}>
                  Remove
                </Button>
              )}
            </div>
          ))}

          <Button type="dashed" block onClick={addMorePincodeField}>
            + Add More
          </Button>

          <div className="flex justify-end gap-3 mt-4">
            <Button onClick={() => setBulkModalVisible(false)}>Cancel</Button>

            <Button type="primary" onClick={handleBulkUpload}>
              Upload
            </Button>
          </div>
        </div>
      </Modal>

      {/* Pagination */}
      {totalPages > 1 && (
        <Stack spacing={2} alignItems="center" marginTop={6}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Stack>
      )}
    </div>
  );
}
