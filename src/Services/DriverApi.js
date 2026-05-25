import toast from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const createDriverApi = async (formData) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${BASE_URL}/api/admin/drivers`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // Do NOT set Content-Type — browser sets multipart/form-data automatically
      },
      body: formData,
    });

    const result = await res.json();
    return result;
  } catch (err) {
    toast.error(err.message || "Something went wrong!");
    throw err;
  }
};



// export const getAllDrivers = async ({ page, rowsPerPage, searchQuery }) => {

//   const token = localStorage.getItem("token");

//   try {

//     let url = `${BASE_URL}/api/admin/drivers?page=${page}&limit=${rowsPerPage}`;

//     // ✅ only add search if exists
//     if (searchQuery) {
//       url += `&search=${searchQuery}`;
//     }

//     const res = await fetch(url, {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     const result = await res.json();
//     return result;

//   } catch (err) {
//     toast.error(err.message || "Failed to fetch drivers");
//     throw err;
//   }
// };

// GET SINGLE DRIVER
export const getAllDrivers = async ({
  page = 1,
  rowsPerPage = 10,
  searchQuery = "",

  // NEW FILTERS
  isVerified,
  region,
  isOnline,
  isPunchedIn,
  isPunchedOut,
  startDate,
  endDate,
  isOnTrip,
  isAssigned,
  isAvailable,
} = {}) => {

  const token = localStorage.getItem("token");

  try {

    // ✅ SAFE QUERY PARAMS
    const params = new URLSearchParams();

    params.append("page", page);
    params.append("limit", rowsPerPage);

    // SEARCH
    if (searchQuery) {
      params.append("search", searchQuery);
    }

    // FILTERS
    if (isVerified !== undefined && isVerified !== "") {
      params.append("isVerified", isVerified);
    }

    if (region) {
      params.append("region", region);
    }

    if (isOnline !== undefined && isOnline !== "") {
      params.append("isOnline", isOnline);
    }

    if (
      isPunchedIn !== undefined &&
      isPunchedIn !== ""
    ) {
      params.append("isPunchedIn", isPunchedIn);
    }

    if (
      isPunchedOut !== undefined &&
      isPunchedOut !== ""
    ) {
      params.append("isPunchedOut", isPunchedOut);
    }

    if (startDate) {
      params.append("startDate", startDate);
    }

    if (endDate) {
      params.append("endDate", endDate);
    }

    if (
      isOnTrip !== undefined &&
      isOnTrip !== ""
    ) {
      params.append("isOnTrip", isOnTrip);
    }

    if (
      isAssigned !== undefined &&
      isAssigned !== ""
    ) {
      params.append("isAssigned", isAssigned);
    }

    if (
      isAvailable !== undefined &&
      isAvailable !== ""
    ) {
      params.append("isAvailable", isAvailable);
    }

    // ✅ FINAL URL
    const url = `${BASE_URL}/api/admin/drivers?${params.toString()}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(
        result.message || "Failed to fetch drivers"
      );
    }

    return result;

  } catch (err) {

    console.error("getAllDrivers Error:", err);

    toast.error(
      err.message || "Failed to fetch drivers"
    );

    throw err;
  }
};


export const getSingleDriver = async (id) => {

  const token = localStorage.getItem("token");

  try {

    const res = await fetch(`${BASE_URL}/api/admin/drivers/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();
    return result;

  } catch (err) {
    toast.error(err.message || "Failed to fetch driver");
    throw err;
  }

};

// UPDATE DRIVER
export const updateDriver = async (id, formData) => {

  const token = localStorage.getItem("token");

  try {

    const res = await fetch(`${BASE_URL}/api/admin/drivers/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();
    return result;

  } catch (err) {
    toast.error(err.message || "Failed to update driver");
    throw err;
  }

};



// DELETE DRIVER
export const deleteDriver = async (id) => {

  const token = localStorage.getItem("token");

  try {

    const res = await fetch(`${BASE_URL}/api/admin/drivers/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();
    return result;

  } catch (err) {
    toast.error(err.message || "Failed to delete driver");
    throw err;
  }

};


// ✅ GET VEHICLE BOOKING DETAILS
// export const getDriverBooking = async (id) => {
//   const token = localStorage.getItem("token");

//   try {
//     const res = await fetch(
//       `${BASE_URL}/api/admin/getDriverBooking/${id}`,
//       {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     const result = await res.json();

//     if (!res.ok) {
//       throw new Error(result.message || "Booking details not found");
//     }

//     return result;

//   } catch (err) {
//     toast.error(err.message || "Error fetching booking details");
//     throw err;
//   }
// };
// ========================== SERVICES / DriverApi.js ==========================

export const getDriverBooking = async (id, params = {}) => {
  const token = localStorage.getItem("token");

  try {
    const query = new URLSearchParams();

    Object.keys(params).forEach((key) => {
      if (
        params[key] !== undefined &&
        params[key] !== null &&
        params[key] !== ""
      ) {
        query.append(key, params[key]);
      }
    });

    const res = await fetch(
      `${BASE_URL}/api/admin/getDriverBooking/${id}?${query.toString()}`,
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
      throw new Error(result.message || "Booking details not found");
    }

    return result;
  } catch (err) {
    toast.error(err.message || "Error fetching booking details");
    throw err;
  }
};

//driver attendence
export const getDriverAttendance = async (driverId, params = {}) => {

  const token = localStorage.getItem("token");

  try {

    const query = new URLSearchParams();

    // ✅ ADD QUERY PARAMS
    Object.keys(params).forEach((key) => {

      if (
        params[key] !== undefined &&
        params[key] !== null &&
        params[key] !== ""
      ) {
        query.append(key, params[key]);
      }

    });

    // ✅ API CALL
    const res = await fetch(
      `${BASE_URL}/api/admin/punches/driver/${driverId}?${query.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = await res.json();

    // ✅ ERROR HANDLE
    if (!res.ok) {
      throw new Error(
        result.message || "Attendance details not found"
      );
    }

    return result;

  } catch (err) {

    console.error("getDriverAttendance Error:", err);

    toast.error(
      err.message || "Error fetching attendance details"
    );

    throw err;
  }
};