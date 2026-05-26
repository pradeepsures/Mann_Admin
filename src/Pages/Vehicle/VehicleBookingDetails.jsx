import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getVehicleBookingById } from "../../Services/VehicleApi";
import Loader from "../../compoents/Loader";
import Breaker from "../../compoents/Breaker";
import xlsx from "json-as-xlsx";
import toast from "react-hot-toast";

export default function VehicleBookingDetails() {
  const { id } = useParams();

  const [data, setData] = useState([]);
  const [stats, setStats] = useState(null);

  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPage, setTotalPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);

  // FILTERS
  const [filters, setFilters] = useState({
    overallStatus: "",
    tripStatus: "",
    paymentStatus: "",
    assignmentStatus: "",
    bookingType: "",
    startDate: "",
    endDate: "",
    search: "",
  });

  // FORMAT TEXT
  const formatText = (text) => {
    if (!text) return "—";

    return text
      .replace(/[_-]/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // STATUS COLOR
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      case "in_progress":
        return "bg-yellow-100 text-yellow-700";

      case "not_started":
        return "bg-gray-100 text-gray-700";

      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  // FETCH DATA
  const fetchDetails = async () => {
    try {
      setLoading(true);

      const params = {
        ...filters,
        page,
        limit,
      };

      const res = await getVehicleBookingById(id, params);

      if (res?.status) {
        setData(res.data || []);
        setStats(res.stats || null);
        setTotalPage(res.totalPage || 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // API CALL
  useEffect(() => {
    fetchDetails();
  }, [id, page, filters]);

  // HANDLE FILTER CHANGE
  const handleFilterChange = (e) => {
    setPage(1);

    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  // RESET FILTERS
  const resetFilters = () => {
    setPage(1);

    setFilters({
      overallStatus: "",
      tripStatus: "",
      paymentStatus: "",
      assignmentStatus: "",
      bookingType: "",
      startDate: "",
      endDate: "",
      search: "",
    });
  };

  const handleExportExcel = async () => {
    try {
      setIsExporting(true);

      // FETCH ALL DATA
      const params = {
        ...filters,
        page: 1,
        limit: 100000,
      };

      const res = await getVehicleBookingById(id, params);

      if (!res?.status || !res?.data?.length) {
        toast.error("No data found");
        return;
      }

      const excelData = res.data.map((item, index) => ({
        Sr_No: index + 1,

        Booking_Number: item.bookingNumber || "—",

        Booking_Date: item.createdAtIST || "—",

        User_Name: item.user?.name || "—",

        User_Phone: item.user?.phone || "—",

        Driver_Name: item.driver?.name || "Not Assigned",

        Driver_Phone: item.driver?.phone || "—",

        Driver_Rating: item.driver?.rating || "—",

        Pickup_Address: item.pickup?.address || "—",

        Drop_Address: item.dropoff?.address || "—",

        Estimated_Fare: item.estimatedFare || 0,

        Payment_Status: formatText(item.paymentStatus),

        Trip_Status: formatText(item.tripStatus),

        Assignment_Status: formatText(item.assignmentStatus),

        Overall_Status: formatText(item.overallStatus),

        Estimated_KM: item.estimatedKm || "—",

        Estimated_Mins: item.estimatedMins || "—",

        Scheduled_At: item.scheduledAtIST || "—",

        Booking_Type: formatText(item.bookingType),
      }));

      const data = [
        {
          sheet: "Vehicle Bookings",

          columns: Object.keys(excelData[0]).map((key) => ({
            label: key,
            value: key,
          })),

          content: excelData,
        },
      ];

      const settings = {
        fileName: `Vehicle_Bookings_${Date.now()}`,
        extraLength: 3,
        writeOptions: {},
      };

      xlsx(data, settings);

      toast.success("Excel exported successfully");
    } catch (error) {
      console.error(error);
      toast.error("Export failed");
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <Breaker />

        {/* STATS */}
        {stats && (
          <div className="bg-gradient-to-r from-[#03045E] to-[#0077B6] text-white px-5 py-3 rounded-lg flex flex-wrap gap-4 text-sm shadow">
            <span>
              Total: <b>{stats.totalBookings}</b>
            </span>

            <span>
              Not Started: <b>{stats.notStartedCount}</b>
            </span>

            <span>
              Enroute: <b>{stats.driverEnrouteCount}</b>
            </span>

            <span>
              Arrived: <b>{stats.arrivedCount}</b>
            </span>

            <span>
              In Progress: <b>{stats.inProgressCount}</b>
            </span>

            <span>
              On Trip: <b>{stats.onTripCount}</b>
            </span>

            <span>
              Completed: <b>{stats.completedCount}</b>
            </span>

            <span>
              Cancelled: <b>{stats.cancelledCount}</b>
            </span>

            <span>
              Paid: <b>{stats.paidCount}</b>
            </span>

            <span>
              Pending Payment: <b>{stats.pendingPaymentCount}</b>
            </span>
          </div>
        )}
      </div>

      {/* FILTERS */}
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* SEARCH */}
          <input
            type="text"
            name="search"
            placeholder="Search booking/address"
            value={filters.search}
            onChange={handleFilterChange}
            className="border rounded-lg px-3 py-2 outline-none"
          />

          {/* TRIP STATUS */}
          <select
            name="tripStatus"
            value={filters.tripStatus}
            onChange={handleFilterChange}
            className="border rounded-lg px-3 py-2 outline-none"
          >
            <option value="">All Trip Status</option>
            <option value="not_started">Not Started</option>
            <option value="driver_enroute">Driver Enroute</option>
            <option value="arrived">Arrived</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* PAYMENT STATUS */}
          <select
            name="paymentStatus"
            value={filters.paymentStatus}
            onChange={handleFilterChange}
            className="border rounded-lg px-3 py-2 outline-none"
          >
            <option value="">All Payment Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
          </select>

          {/* ASSIGNMENT STATUS */}
          <select
            name="assignmentStatus"
            value={filters.assignmentStatus}
            onChange={handleFilterChange}
            className="border rounded-lg px-3 py-2 outline-none"
          >
            <option value="">All Assignment Status</option>
            <option value="assigned">Assigned</option>
            <option value="unassigned">Unassigned</option>
          </select>

          {/* OVERALL STATUS */}
          <select
            name="overallStatus"
            value={filters.overallStatus}
            onChange={handleFilterChange}
            className="border rounded-lg px-3 py-2 outline-none"
          >
            <option value="">All Overall Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* BOOKING TYPE */}
          <select
            name="bookingType"
            value={filters.bookingType}
            onChange={handleFilterChange}
            className="border rounded-lg px-3 py-2 outline-none"
          >
            <option value="">All Booking Type</option>
            <option value="instant">Instant</option>
            <option value="scheduled">Scheduled</option>
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
        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={resetFilters}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Reset Filters
          </button>

          <button
            onClick={handleExportExcel}
            disabled={isExporting}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow"
          >
            {isExporting ? "Exporting..." : "Export Excel"}
          </button>
        </div>
      </div>

      {/* EMPTY */}
      {!loading && data.length === 0 && (
        <div className="text-center py-20 text-gray-500 bg-white rounded-xl shadow">
          No bookings found
        </div>
      )}

      {/* TABLE */}
      {data.length > 0 && (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            {/* HEADER */}
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Booking</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Driver</th>
                <th className="px-4 py-3">Route</th>
                <th className="px-4 py-3">Fare</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Trip</th>
                <th className="px-4 py-3">Schedule</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody className="divide-y">
              {data.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50 transition">
                  {/* BOOKING */}
                  <td className="px-4 py-3">
                    <div className="font-semibold text-gray-800">
                      {item.bookingNumber}
                    </div>

                    <div className="text-xs text-gray-500">
                      {item.createdAtIST}
                    </div>
                  </td>

                  {/* USER */}
                  <td className="px-4 py-3">
                    <div className="font-medium">{item.user?.name || "—"}</div>

                    <div className="text-xs text-gray-500">
                      {item.user?.phone || "—"}
                    </div>
                  </td>

                  {/* DRIVER */}
                  <td className="px-4 py-3">
                    <div>{item.driver?.name || "Not Assigned"}</div>

                    <div className="text-xs text-gray-500">
                      {item.driver?.phone || ""}
                    </div>

                    {item.driver?.rating && (
                      <div className="text-xs text-yellow-600">
                        ⭐ {item.driver?.rating}
                      </div>
                    )}
                  </td>

                  {/* ROUTE */}
                  <td className="px-4 py-3">
                    <div className="text-xs text-gray-500">From:</div>

                    <div>{item.pickup?.address}</div>

                    <div className="text-xs text-gray-500 mt-1">To:</div>

                    <div>{item.dropoff?.address}</div>
                  </td>

                  {/* FARE */}
                  <td className="px-4 py-3">
                    <div>₹ {item.estimatedFare}</div>
                  </td>

                  {/* PAYMENT */}
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium
                      ${
                        item.paymentStatus === "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {formatText(item.paymentStatus)}
                    </span>
                  </td>

                  {/* TRIP */}
                  <td className="px-4 py-3 text-xs">
                    <div>{item.estimatedKm || "—"} Km</div>

                    <div>{item.estimatedMins || "—"} Mins</div>
                  </td>

                  {/* SCHEDULE */}
                  <td className="px-4 py-3 text-xs">
                    <div>{item.scheduledAtIST || "—"}</div>

                    <div className="text-gray-400 mt-1">
                      {formatText(item.bookingType)}
                    </div>
                  </td>

                  {/* STATUS */}
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        item.tripStatus,
                      )}`}
                    >
                      {formatText(item.tripStatus)}
                    </span>

                    <div className="text-xs text-gray-500 mt-1">
                      {formatText(item.assignmentStatus)}
                    </div>

                    <div className="text-xs text-gray-400 mt-1">
                      {formatText(item.overallStatus)}
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
            className={`px-4 py-2 rounded-lg text-white
            ${page === 1 ? "bg-gray-400 cursor-not-allowed" : "bg-[#03045E]"}`}
          >
            Prev
          </button>

          <span className="font-medium">
            Page {page} of {totalPage}
          </span>

          <button
            disabled={page === totalPage}
            onClick={() => setPage((prev) => prev + 1)}
            className={`px-4 py-2 rounded-lg text-white
            ${
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
