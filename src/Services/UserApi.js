// src/services/userService.js

const BASE_URL = import.meta.env.VITE_BASE_URL;
import toast from "react-hot-toast";

// ─────────────────────────────────────────────
// GET ALL USERS
// GET /api/admin/users
// ─────────────────────────────────────────────
export const getAllUsers = async ({
  page = 1,
  rowsPerPage = 10,
  search = "",
  gender = "",
  isVerified = "",
}) => {
  const token = localStorage.getItem("token");

  try {
    const query = new URLSearchParams({
      page,
      limit: rowsPerPage,
      search,
      gender,
      isVerified,
    });

    const res = await fetch(
      `${BASE_URL}/api/admin/users?${query.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to fetch users");
    }

    return result;
  } catch (err) {
    toast.error(err.message || "Something went wrong!");
    throw err;
  }
};

// ─────────────────────────────────────────────
// GET SINGLE USER
// GET /api/admin/users/:id
// ─────────────────────────────────────────────
export const getSingleUser = async (id) => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`${BASE_URL}/api/admin/users/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to fetch user");
    }

    return result;
  } catch (err) {
    toast.error(err.message || "Something went wrong!");
    throw err;
  }
};

// ─────────────────────────────────────────────
// CREATE USER
// POST /api/admin/users
// ─────────────────────────────────────────────
export const createUserApi = async (
  data,
  isFormData = false
) => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`${BASE_URL}/api/admin/users`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        ...(isFormData
          ? {}
          : { "Content-Type": "application/json" }),
      },
      body: isFormData ? data : JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to create user");
    }

    toast.success(result.message || "User created successfully");

    return result;
  } catch (err) {
    toast.error(err.message || "Something went wrong!");
    throw err;
  }
};

// ─────────────────────────────────────────────
// UPDATE USER
// PATCH /api/admin/users/:id
// ─────────────────────────────────────────────
export const updateUserApi = async (
  id,
  data,
  isFormData = false
) => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`${BASE_URL}/api/admin/users/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        ...(isFormData
          ? {}
          : { "Content-Type": "application/json" }),
      },
      body: isFormData ? data : JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to update user");
    }

    toast.success(result.message || "User updated successfully");

    return result;
  } catch (err) {
    toast.error(err.message || "Something went wrong!");
    throw err;
  }
};

// ─────────────────────────────────────────────
// DELETE USER
// DELETE /api/admin/users/:id
// ─────────────────────────────────────────────
export const deleteUserApi = async (id) => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`${BASE_URL}/api/admin/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to delete user");
    }

    toast.success(result.message || "User deleted successfully");

    return result;
  } catch (err) {
    toast.error(err.message || "Something went wrong!");
    throw err;
  }
};

// ─────────────────────────────────────────────
// TOGGLE USER STATUS
// PATCH /api/admin/users/:id/toggle
// ─────────────────────────────────────────────
export const toggleUserStatusApi = async (id) => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(
      `${BASE_URL}/api/admin/users/${id}/toggle`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to toggle user");
    }

    toast.success(result.message || "Status updated successfully");

    return result;
  } catch (err) {
    toast.error(err.message || "Something went wrong!");
    throw err;
  }
};