import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL;

/* ======================================================
   GET ALL CORPORATES
====================================================== */

export const getAllCorporates = async ({
  page = 1,
  rowsPerPage = 15,
  search = "",
  isApproved = "",
  isActive = "",
  isVerified = "",
  industryType = "",
  startDate = "",
  endDate = "",
}) => {
  const token = localStorage.getItem("token");

  try {
    const queryParams = new URLSearchParams({
      page,
      limit: rowsPerPage,
      search,
    });

    // Optional Filters
    if (isApproved !== "")
      queryParams.append("isApproved", isApproved);

    if (isActive !== "")
      queryParams.append("isActive", isActive);

    if (isVerified !== "")
      queryParams.append("isVerified", isVerified);

    if (industryType)
      queryParams.append("industryType", industryType);

    if (startDate)
      queryParams.append("startDate", startDate);

    if (endDate)
      queryParams.append("endDate", endDate);

    const res = await fetch(
      `${BASE_URL}/api/admin/corporate?${queryParams.toString()}`,
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
      throw new Error(
        result.message || "Failed to fetch corporates"
      );
    }

    return result;
  } catch (err) {
    toast.error(err.message || "Something went wrong!");
    throw new Error(err.message);
  }
};

/* ======================================================
   GET SINGLE CORPORATE
====================================================== */

export const getSingleCorporate = async (id) => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(
      `${BASE_URL}/api/admin/corporate/${id}`,
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
      throw new Error(
        result.message || "Failed to fetch corporate"
      );
    }

    return result;
  } catch (err) {
    toast.error(err.message || "Something went wrong!");
    throw new Error(err.message);
  }
};

/* ======================================================
   UPDATE CORPORATE
====================================================== */

export const updateCorporate = async (
  id,
  data,
  isFormData = false
) => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(
      `${BASE_URL}/api/admin/corporate/${id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          ...(isFormData
            ? {}
            : {
                "Content-Type": "application/json",
              }),
        },
        body: isFormData
          ? data
          : JSON.stringify(data),
      }
    );

    const result = await res.json();

    if (!res.ok) {
      throw new Error(
        result.message || "Failed to update corporate"
      );
    }

    toast.success(
      result.message || "Corporate updated successfully"
    );

    return result;
  } catch (err) {
    toast.error(err.message || "Something went wrong!");
    throw err;
  }
};
