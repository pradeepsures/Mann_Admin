import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Select } from "antd";

import { getAllRegions } from "../../Services/RegionApi";
import { getAllDrivers } from "../../Services/DriverApi";

const { Option } = Select;

export default function DriverFilter({ appliedFilters, onApply, onReset }) {
  const [localFilters, setLocalFilters] = useState({ ...appliedFilters });

  const [regions, setRegions] = useState([]);
  const [drivers, setDrivers] = useState([]);

  const [regionLoading, setRegionLoading] = useState(false);
  const [driverLoading, setDriverLoading] = useState(false);

  const [driverSearch, setDriverSearch] = useState("");

  // sync parent
  useEffect(() => {
    setLocalFilters({ ...appliedFilters });
  }, [appliedFilters]);

  const handleChange = (key, value) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  // ───────── REGIONS ─────────
  const fetchRegions = async () => {
    setRegionLoading(true);
    try {
      const res = await getAllRegions({ page: 1, rowsPerPage: 100 });
      if (res?.status) setRegions(res.data || []);
    } finally {
      setRegionLoading(false);
    }
  };

  // ───────── DRIVERS (dropdown search support) ─────────
  const fetchDrivers = async (search = "") => {
    setDriverLoading(true);
    try {
      const res = await getAllDrivers({
        page: 1,
        rowsPerPage: 50,
        searchQuery: search,
      });

      if (res?.status) setDrivers(res.data || []);
    } finally {
      setDriverLoading(false);
    }
  };

  useEffect(() => {
    fetchRegions();
    fetchDrivers();
  }, []);

  useEffect(() => {
    fetchDrivers(driverSearch);
  }, [driverSearch]);

  // ───────── APPLY ─────────
  const handleApply = () => {
    const cleaned = { ...localFilters };

    onApply({
      searchQuery: cleaned.search || "",
      isVerified: cleaned.isVerified || "",
      isOnline: cleaned.isOnline || "",
      region: cleaned.region || "",

      isPunchedIn: cleaned.isPunchedIn || "",
      isPunchedOut: cleaned.isPunchedOut || "",
      isOnTrip: cleaned.isOnTrip || "",
      isAssigned: cleaned.isAssigned || "",
      isAvailable: cleaned.isAvailable || "",

      startDate: cleaned.startDate || "",
      endDate: cleaned.endDate || "",
    });
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow mb-6">
      <h3 className="text-xl font-semibold mb-4">Driver Filters</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* SEARCH */}
        <input
          className="border p-2 rounded-xl"
          placeholder="Search name / email / phone"
          value={localFilters.search || ""}
          onChange={(e) => handleChange("search", e.target.value)}
        />

        {/* REGION */}
        {/* <Select
          showSearch
          placeholder="Region"
          value={localFilters.region || undefined}
          onChange={(val) => handleChange("region", val)}
          loading={regionLoading}
        >
          {regions.map((r) => (
            <Option key={r._id} value={r._id}>
              {r.name}
            </Option>
          ))}
        </Select> */}

        {/* VERIFIED */}
        <select
          className="border p-2 rounded-xl"
          value={localFilters.isVerified || ""}
          onChange={(e) => handleChange("isVerified", e.target.value)}
        >
          <option value="">Verified</option>
          <option value="true">Verified</option>
          <option value="false">Unverified</option>
        </select>

        {/* ONLINE */}
        <select
          className="border p-2 rounded-xl"
          value={localFilters.isOnline || ""}
          onChange={(e) => handleChange("isOnline", e.target.value)}
        >
          <option value="">Online Status</option>
          <option value="true">Online</option>
          <option value="false">Offline</option>
        </select>

        {/* PUNCHED IN */}
        <select
          className="border p-2 rounded-xl"
          value={localFilters.isPunchedIn || ""}
          onChange={(e) => handleChange("isPunchedIn", e.target.value)}
        >
          <option value="">Punched In</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>

        {/* ON TRIP */}
        <select
          className="border p-2 rounded-xl"
          value={localFilters.isOnTrip || ""}
          onChange={(e) => handleChange("isOnTrip", e.target.value)}
        >
          <option value="">On Trip</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>

        {/* ASSIGNED */}
        <select
          className="border p-2 rounded-xl"
          value={localFilters.isAssigned || ""}
          onChange={(e) => handleChange("isAssigned", e.target.value)}
        >
          <option value="">Assigned</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>

        {/* AVAILABLE */}
        <select
          className="border p-2 rounded-xl"
          value={localFilters.isAvailable || ""}
          onChange={(e) => handleChange("isAvailable", e.target.value)}
        >
          <option value="">Available</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>

        {/* DATE FILTERS */}
        <input
          type="date"
          className="border p-2 rounded-xl"
          value={localFilters.startDate || ""}
          onChange={(e) => handleChange("startDate", e.target.value)}
        />

        <input
          type="date"
          className="border p-2 rounded-xl"
          value={localFilters.endDate || ""}
          onChange={(e) => handleChange("endDate", e.target.value)}
        />
      </div>

      {/* BUTTONS */}
      <div className="flex gap-3 mt-5">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleApply}
          className="bg-primary text-white px-5 py-2 rounded-xl"
        >
          Apply Filters
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onReset}
          className="bg-gray-400 text-white px-5 py-2 rounded-xl"
        >
          Reset
        </motion.button>
      </div>
    </div>
  );
}