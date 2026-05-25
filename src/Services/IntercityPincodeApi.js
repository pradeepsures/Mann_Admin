import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// ────────────────────────────────────────────────
// Get All InterCity Pincodes
// ────────────────────────────────────────────────
export const getAllInterCityPincodes = async ({
  page = 1,
  rowsPerPage = 10,
  searchQuery = "",
}) => {
  const token = localStorage.getItem("token");

  try {
    let url = `${BASE_URL}/api/admin/intercityPincodes?page=${page}&limit=${rowsPerPage}`;

    if (searchQuery.trim()) {
      url += `&search=${encodeURIComponent(searchQuery.trim())}`;
    }

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();

    if (!res.ok || !result.status) {
      throw new Error(result.message || "Failed to fetch pincodes");
    }

    return result;
  } catch (err) {
    console.error("Error fetching pincodes:", err);
    toast.error(err.message || "Failed to load pincodes");
    throw err;
  }
};

// ────────────────────────────────────────────────
// Get Single Pincode
// ────────────────────────────────────────────────
export const getInterCityPincodeById = async (id) => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(
      `${BASE_URL}/api/admin/intercityPincodes/${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = await res.json();

    if (!res.ok || !result.status) {
      throw new Error(result.message || "Failed to fetch pincode");
    }

    return result;
  } catch (err) {
    console.error("Error fetching pincode:", err);
    toast.error(err.message || "Failed to load pincode");
    throw err;
  }
};

// ────────────────────────────────────────────────
// Create Pincode
// ────────────────────────────────────────────────
export const createInterCityPincodeApi = async (data) => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`${BASE_URL}/api/admin/intercityPincodes`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok || !result.status) {
      throw new Error(result.message || "Failed to create pincode");
    }

    toast.success("Pincode created successfully!");
    return result;
  } catch (err) {
    console.error("Error creating pincode:", err);
    toast.error(err.message || "Failed to create pincode");
    throw err;
  }
};

// ────────────────────────────────────────────────
// Update Pincode
// ────────────────────────────────────────────────
export const updateInterCityPincodeApi = async (id, data) => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(
      `${BASE_URL}/api/admin/intercityPincodes/${id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const result = await res.json();

    if (!res.ok || !result.status) {
      throw new Error(result.message || "Failed to update pincode");
    }

    toast.success("Pincode updated successfully!");
    return result;
  } catch (err) {
    console.error("Error updating pincode:", err);
    toast.error(err.message || "Failed to update pincode");
    throw err;
  }
};

// ────────────────────────────────────────────────
// Delete Pincode
// ────────────────────────────────────────────────
export const deleteInterCityPincode = async (id) => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(
      `${BASE_URL}/api/admin/intercityPincodes/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = await res.json();

    if (!res.ok || !result.status) {
      throw new Error(result.message || "Failed to delete pincode");
    }

    toast.success("Pincode deleted successfully!");
    return result;
  } catch (err) {
    console.error("Error deleting pincode:", err);
    toast.error(err.message || "Failed to delete pincode");
    throw err;
  }
};

//bulk upload
export const bulkUploadInterCityPincodeApi = async (data) => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(
      `${BASE_URL}/api/admin/bulkUploadpincodes`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const result = await res.json();

    if (!res.ok || !result.status) {
      throw new Error(result.message || "Bulk upload failed");
    }

    toast.success("Bulk upload successful!");

    return result;
  } catch (err) {
    console.error("Error bulk uploading pincodes:", err);

    toast.error(err.message || "Failed to upload pincodes");

    throw err;
  }
};