import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// ✅ GET ALL RATINGS (ADMIN)
export const getAllRatings = async ({ page = 1, limit = 10 } = {}) => {
  const token = localStorage.getItem("token");

  try {
    let url = `${BASE_URL}/api/admin/ratings?page=${page}&limit=${limit}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to fetch ratings");
    }

    return result;
  } catch (err) {
    toast.error(err.message || "Something went wrong while fetching ratings!");
    throw err;
  }
};