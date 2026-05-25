import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "antd";
import { Select, DatePicker } from "antd";
import Loader from "../../compoents/Loader";
import Breaker from "../../compoents/Breaker";
import { getDriverAttendance } from "../../Services/DriverApi";
import toast from "react-hot-toast";
import xlsx from "json-as-xlsx";

const { Option } = Select;
const { RangePicker } = DatePicker;

/* FORMAT HELPERS */
const formatDateTime = (value) => {
  if (!value) return "N/A";
  if (typeof value === "string" && value.includes(" ")) return value;
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const formatText = (text) => {
  if (!text) return "—";
  return text
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const getStatusColor = (status) => {
  return status === "active"
    ? "bg-yellow-100 text-yellow-700"
    : "bg-green-100 text-green-700";
};

const getValidityColor = (valid) => {
  if (valid === null || valid === undefined) return "bg-gray-100 text-gray-700";
  return valid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";
};

export default function DriverAttendanceList() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [attendance, setAttendance] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPage, setTotalPage] = useState(1);
  const [totalResult, setTotalResult] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  // FILTERS
  const [filters, setFilters] = useState({
    status: "",
    startDate: "",
    endDate: "",
  });

  const fetchAttendance = async () => {
    try {
      setLoading(true);

      const params = { page, limit };

      if (filters.status) params.status = filters.status;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const res = await getDriverAttendance(id, params);

      if (res?.status) {
        setAttendance(res.data || []);
        setTotalPage(res.totalPage || 1);
        setTotalResult(res.totalResult || 0);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch attendance");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setPage(1);
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const resetFilters = () => {
    setPage(1);
    setFilters({
      status: "",
      startDate: "",
      endDate: "",
    });
  };

  useEffect(() => {
    fetchAttendance();
  }, [page, filters]);

  if (loading) return <Loader />;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <Breaker />

        {/* STATS */}
        <div className="bg-gradient-to-r from-[#03045E] to-[#0077B6] text-white px-5 py-3 rounded-lg flex flex-wrap gap-4 text-sm shadow">
          <span>
            Total Records: <b>{totalResult}</b>
          </span>
          <span>|</span>
          <span className="text-green-300">
            Completed:{" "}
            <b>{attendance.filter((a) => a.status === "completed").length}</b>
          </span>
          <span>|</span>
          <span className="text-yellow-300">
            Active:{" "}
            <b>{attendance.filter((a) => a.status === "active").length}</b>
          </span>
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* STATUS */}
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="border rounded-lg px-3 py-2 outline-none"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="auto_closed">Auto Closed</option>
            <option value="invalidated">Invalidated</option>
          </select>

          {/* START DATE */}
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            className="border rounded-lg px-3 py-2 outline-none"
          />

          {/* END DATE */}
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            className="border rounded-lg px-3 py-2 outline-none"
          />
        </div>

        {/* RESET BUTTON */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={resetFilters}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* EMPTY STATE */}
      {!loading && attendance.length === 0 && (
        <div className="text-center py-20 text-gray-500 bg-white rounded-xl shadow">
          No attendance records found
        </div>
      )}

      {/* TABLE */}
      {attendance.length > 0 && (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            {/* HEADER */}
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Driver</th>
                <th className="px-4 py-3">Region</th>
                <th className="px-4 py-3">Punch Region</th>
                <th className="px-4 py-3">Punch In</th>
                <th className="px-4 py-3">Punch Out</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Distance (m)</th>
                <th className="px-4 py-3">Coordinates</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody className="divide-y">
              {attendance.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50 transition">
                  {/* DRIVER */}
                  <td className="px-4 py-3">
                    <div className="font-semibold text-gray-800">
                      {item.driver?.name || "N/A"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.driver?.phone || "N/A"}
                    </div>
                  </td>

                  {/* REGION */}
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-800">
                      {item.region?.name || "N/A"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.region?.state || "N/A"}
                    </div>
                  </td>

                  {/* PUNCH REGION */}
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-800">
                      {item.punchRegion?.name || "N/A"}
                    </div>
                    <div className="text-xs text-gray-600 line-clamp-1">
                      {item.punchRegion?.address || "N/A"}
                    </div>
                  </td>

                  {/* PUNCH IN */}
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-800">
                      {formatDateTime(item.punchInAtIST)}
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded mt-1 inline-block ${getValidityColor(item.punchInValid)}`}
                    >
                      {item.punchInValid ? "Valid" : "Invalid"}
                    </span>
                  </td>

                  {/* PUNCH OUT */}
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-800">
                      {item.punchOutAtIST
                        ? formatDateTime(item.punchOutAtIST)
                        : "N/A"}
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded mt-1 inline-block ${getValidityColor(item.punchOutValid)}`}
                    >
                      {item.punchOutValid === null
                        ? "N/A"
                        : item.punchOutValid
                          ? "Valid"
                          : "Invalid"}
                    </span>
                  </td>

                  {/* DURATION */}
                  <td className="px-4 py-3 text-sm">
                    <div className="font-semibold text-gray-800">
                      {item.totalMinutes ? `${item.totalMinutes} min` : "N/A"}
                    </div>
                  </td>

                  {/* DISTANCE */}
                  <td className="px-4 py-3 text-xs">
                    <div>
                      <span className="text-gray-600">In:</span>{" "}
                      {item.punchInDistanceFromZone ?? "N/A"}m
                    </div>
                    <div>
                      <span className="text-gray-600">Out:</span>{" "}
                      {item.punchOutDistanceFromZone ?? "N/A"}m
                    </div>
                  </td>

                  {/* COORDINATES */}
                  <td className="px-4 py-3 text-xs">
                    <div className="font-mono text-gray-700">
                      <div>
                        In: {item.punchInLocation?.lat?.toFixed(4)},{" "}
                        {item.punchInLocation?.lng?.toFixed(4)}
                      </div>
                      {item.punchOutLocation && (
                        <div>
                          Out: {item.punchOutLocation?.lat?.toFixed(4)},{" "}
                          {item.punchOutLocation?.lng?.toFixed(4)}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* STATUS */}
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        item.status,
                      )}`}
                    >
                      {formatText(item.status)}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">
                      {item.adminOverride ? "Admin Override" : "Normal"}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* PAGINATION */}
      {totalPage > 1 && (
        <div className="flex justify-center items-center gap-3 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            className={`px-4 py-2 rounded-lg text-white ${
              page === 1 ? "bg-gray-400 cursor-not-allowed" : "bg-[#03045E]"
            }`}
          >
            Prev
          </button>

          <span className="font-medium">
            Page {page} of {totalPage}
          </span>

          <button
            disabled={page === totalPage}
            onClick={() => setPage((prev) => prev + 1)}
            className={`px-4 py-2 rounded-lg text-white ${
              page === totalPage
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#0077B6]"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
