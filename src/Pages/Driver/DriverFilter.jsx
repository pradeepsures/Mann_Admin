import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Select } from "antd";

import { getAllRegions } from "../../Services/RegionApi";
import { getAllDrivers } from "../../Services/DriverApi";
import { DatePicker } from "antd";
import dayjs from "dayjs";
const { Option } = Select;

export default function DriverFilter({ appliedFilters, onApply, onReset }) {
  const [localFilters, setLocalFilters] = useState({
    ...appliedFilters,
  });

  const [regions, setRegions] = useState([]);
  const [drivers, setDrivers] = useState([]);

  const [regionLoading, setRegionLoading] = useState(false);
  const [driverLoading, setDriverLoading] = useState(false);

  const [driverSearch, setDriverSearch] = useState("");

  useEffect(() => {
    setLocalFilters({ ...appliedFilters });
  }, [appliedFilters]);

  // ✅ Helper to build filter payload
  const buildPayload = (filters) => ({
    searchQuery: filters.searchQuery || "",
    isVerified: filters.isVerified ?? "",
    isOnline: filters.isOnline ?? "",
    isPunchedIn: filters.isPunchedIn ?? "",
    isPunchedOut: filters.isPunchedOut ?? "",
    isOnTrip: filters.isOnTrip ?? "",
    isAssigned: filters.isAssigned ?? "",
    isAvailable: filters.isAvailable ?? "",
    isDeleted: filters.isDeleted ?? "",
    startDate: filters.startDate || "",
    endDate: filters.endDate || "",
    region: filters.region || "",
  });

  // ✅ Auto-apply for dropdowns & date pickers
  const handleChange = (key, value) => {
    setLocalFilters((prev) => {
      const updated = { ...prev, [key]: value };
      // Auto-apply only for non-search fields
      const nonSearchKeys = [
        "isVerified",
        "isOnline",
        "isPunchedIn",
        "isPunchedOut",
        "isOnTrip",
        "isAssigned",
        "isAvailable",
        "isDeleted",
        "region",
        "startDate",
        "endDate",
      ];
      if (nonSearchKeys.includes(key)) {
        onApply(buildPayload(updated));
      }
      return updated;
    });
  };

  // ✅ Search input change — just update state, don't auto-apply
  const handleSearchChange = (value) => {
    setLocalFilters((prev) => ({ ...prev, searchQuery: value }));
  };

  // ✅ Apply on Enter key press
  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      onApply(buildPayload({ ...localFilters }));
    }
  };

  // Regions
  const fetchRegions = async () => {
    setRegionLoading(true);
    try {
      const res = await getAllRegions({ page: 1, rowsPerPage: 100 });
      if (res?.status) setRegions(res.data || []);
    } finally {
      setRegionLoading(false);
    }
  };

  // Drivers
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

  const handleApply = () => {
    onApply(buildPayload(localFilters));
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow mb-6">
      <h3 className="text-xl font-semibold mb-4">Driver Filters</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* SEARCH — Enter to apply */}
        <input
          className="border p-2 rounded-xl"
          placeholder="Search Name / Email / Phone (Press Enter)"
          value={localFilters.searchQuery || ""}
          onChange={(e) => handleSearchChange(e.target.value)}
          // onKeyDown={handleSearchKeyDown}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleApply();
            }
          }}
          // onKeyDown={(e) => {
          //   if (e.key === "Enter") {
          //     handleSearchKeyDown();
          //   }
          // }}
        />

        {/* START DATE */}
        <input
          type="date"
          className="border p-2 rounded-xl"
          value={localFilters.startDate || ""}
          onChange={(e) =>
            setLocalFilters({
              ...localFilters,
              startDate: e.target.value,
            })
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleApply();
            }
          }}
        />

        {/* END DATE */}
        <input
          type="date"
          className="border p-2 rounded-xl"
          value={localFilters.endDate || ""}
          // onChange={(e) => handleChange("endDate", e.target.value)}

          onChange={(e) =>
            setLocalFilters({
              ...localFilters,
              endDate: e.target.value,
            })
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleApply();
            }
          }}
        />

        {/* VERIFIED — auto apply */}
        <select
          className="border p-2 rounded-xl"
          value={localFilters.isVerified || ""}
          onChange={(e) => handleChange("isVerified", e.target.value)}
        >
          <option value="">Verified</option>
          <option value="true">Verified</option>
          <option value="false">Unverified</option>
        </select>

        {/* ON TRIP — auto apply */}
        <select
          className="border p-2 rounded-xl"
          value={localFilters.isOnTrip || ""}
          onChange={(e) => handleChange("isOnTrip", e.target.value)}
        >
          <option value="">On Trip</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>

        {/* ASSIGNED — auto apply */}
        <select
          className="border p-2 rounded-xl"
          value={localFilters.isAssigned || ""}
          onChange={(e) => handleChange("isAssigned", e.target.value)}
        >
          <option value="">Vehicle Assigned</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>

        {/* AVAILABLE — auto apply */}
        <select
          className="border p-2 rounded-xl"
          value={localFilters.isAvailable || ""}
          onChange={(e) => handleChange("isAvailable", e.target.value)}
        >
          <option value="">Available</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>

        {/* DELETED — auto apply */}
        <select
          className="border p-2 rounded-xl"
          value={localFilters.isDeleted || ""}
          onChange={(e) => handleChange("isDeleted", e.target.value)}
        >
          <option value="">Deleted Status</option>
          <option value="false">Active</option>
          <option value="true">Deleted</option>
        </select>

        {/* REGION — auto apply */}
        <Select
          placeholder="Select Region"
          loading={regionLoading}
          value={localFilters.region || undefined}
          onChange={(value) => handleChange("region", value)}
          allowClear
          showSearch
          optionFilterProp="children"
          className="custom-select w-full"
          style={{ width: "100%" }}
        >
          {regions.map((item) => (
            <Option key={item._id} value={item._id}>
              {item.name} ({item.state})
            </Option>
          ))}
        </Select>
        {/* <Select
          placeholder="Select Region"
          loading={regionLoading}
          value={localFilters.region || undefined}
          onChange={(value) => handleChange("region", value)}
          allowClear
          className="w-full"
          style={{ width: "100%" }}
        >
          {regions.map((item) => (
            <Option key={item._id} value={item._id}>
              {item.name} ({item.state})
            </Option>
          ))}
        </Select> */}
      </div>

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
          className="bg-gray-500 text-white px-5 py-2 rounded-xl"
        >
          Reset
        </motion.button>
      </div>
    </div>
  );
}
