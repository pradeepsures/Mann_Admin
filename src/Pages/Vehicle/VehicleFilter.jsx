import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Select } from "antd";

import { getAllDrivers } from "../../Services/DriverApi";
import { getAllSegment } from "../../Services/SegmentApi";

const { Option } = Select;

export default function VehicleFilter({ appliedFilters, onApply, onReset }) {
  const [localFilters, setLocalFilters] = useState({
    ...appliedFilters,
  });

  const [drivers, setDrivers] = useState([]);
  const [segments, setSegments] = useState([]);

  const [driverLoading, setDriverLoading] = useState(false);
  const [segmentLoading, setSegmentLoading] = useState(false);

  useEffect(() => {
    setLocalFilters({ ...appliedFilters });
  }, [appliedFilters]);

  const handleChange = (key, value) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // FETCH DRIVERS
  const fetchDrivers = async () => {
    setDriverLoading(true);

    try {
      const res = await getAllDrivers({
        page: 1,
        rowsPerPage: 100,
      });

      if (res?.status) {
        setDrivers(res.data || []);
      }
    } finally {
      setDriverLoading(false);
    }
  };

  // FETCH SEGMENTS
  const fetchSegments = async () => {
    setSegmentLoading(true);

    try {
      const res = await getAllSegment({
        page: 1,
        rowsPerPage: 100,
      });

      if (res?.status) {
        setSegments(res.data || []);
      }
    } finally {
      setSegmentLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
    fetchSegments();
  }, []);

  const handleApply = () => {
    onApply({
      search: localFilters.search || "",

      driverId: localFilters.driverId || "",
      segmentId: localFilters.segmentId || "",

      brand: localFilters.brand || "",
      fuelType: localFilters.fuelType || "",

      isActive: localFilters.isActive || "",
      isOnTrip: localFilters.isOnTrip || "",
      isAvailable: localFilters.isAvailable || "",
    });
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow mb-6">
      <h3 className="text-xl font-semibold mb-4">Vehicle Filters</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* SEARCH */}
        <input
          className="border p-2 rounded-xl"
          placeholder="Search number/model"
          value={localFilters.search || ""}
          onChange={(e) => handleChange("search", e.target.value)}
        />

        {/* DRIVER */}
        {/* <Select
          showSearch
          placeholder="Select Driver"
          value={localFilters.driverId || undefined}
          onChange={(val) => handleChange("driverId", val)}
          loading={driverLoading}
          allowClear
        >
          {drivers.map((d) => (
            <Option key={d._id} value={d._id}>
              {d.name} | {d.phone}
            </Option>
          ))}
        </Select> */}
        <Select
          showSearch
          placeholder="Select Driver"
          value={localFilters.driverId || undefined}
          onChange={(val) => handleChange("driverId", val)}
          loading={driverLoading}
          allowClear
          className="custom-select w-full"
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.children ?? "").toLowerCase().includes(input.toLowerCase())
          }
        >
          {drivers.map((d) => (
            <Option key={d._id} value={d._id}>
              {`${d.name} | ${d.phone}`}
            </Option>
          ))}
        </Select>

        {/* SEGMENT */}
        <Select
          showSearch
          placeholder="Select Segment"
          value={localFilters.segmentId || undefined}
          onChange={(val) => handleChange("segmentId", val)}
          loading={segmentLoading}
          allowClear
          className="custom-select w-full"
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.children ?? "").toLowerCase().includes(input.toLowerCase())
          }
        >
          {segments.map((s) => (
            <Option key={s._id} value={s._id}>
              {s.name}
            </Option>
          ))}
        </Select>
        {/* <Select
          showSearch
          placeholder="Select Segment"
          value={localFilters.segmentId || undefined}
          onChange={(val) => handleChange("segmentId", val)}
          loading={segmentLoading}
          allowClear
        >
          {segments.map((s) => (
            <Option key={s._id} value={s._id}>
              {s.name}
            </Option>
          ))}
        </Select> */}

        {/* BRAND */}
        <input
          className="border p-2 rounded-xl"
          placeholder="Brand"
          value={localFilters.brand || ""}
          onChange={(e) => handleChange("brand", e.target.value)}
        />

        {/* FUEL TYPE */}
        <select
          className="border p-2 rounded-xl"
          value={localFilters.fuelType || ""}
          onChange={(e) => handleChange("fuelType", e.target.value)}
        >
          <option value="">Fuel Type</option>
          <option value="petrol">Petrol</option>
          <option value="diesel">Diesel</option>
          <option value="cng">CNG</option>
          <option value="electric">Electric</option>
        </select>

        {/* ACTIVE */}
        <select
          className="border p-2 rounded-xl"
          value={localFilters.isActive || ""}
          onChange={(e) => handleChange("isActive", e.target.value)}
        >
          <option value="">Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
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
          className="bg-gray-400 text-white px-5 py-2 rounded-xl"
        >
          Reset
        </motion.button>
      </div>
    </div>
  );
}
