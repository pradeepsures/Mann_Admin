// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { Select } from "antd";

// import { getAllDrivers } from "../../Services/DriverApi";
// import { getAllSegment } from "../../Services/SegmentApi";

// const { Option } = Select;

// export default function VehicleFilter({ appliedFilters, onApply, onReset }) {
//   const [localFilters, setLocalFilters] = useState({
//     ...appliedFilters,
//   });

//   const [drivers, setDrivers] = useState([]);
//   const [segments, setSegments] = useState([]);

//   const [driverLoading, setDriverLoading] = useState(false);
//   const [segmentLoading, setSegmentLoading] = useState(false);

//   useEffect(() => {
//     setLocalFilters({ ...appliedFilters });
//   }, [appliedFilters]);

//   const handleChange = (key, value) => {
//     setLocalFilters((prev) => ({
//       ...prev,
//       [key]: value,
//     }));
//   };

//   // FETCH DRIVERS
//   const fetchDrivers = async () => {
//     setDriverLoading(true);

//     try {
//       const res = await getAllDrivers({
//         page: 1,
//         rowsPerPage: 100,
//       });

//       if (res?.status) {
//         setDrivers(res.data || []);
//       }
//     } finally {
//       setDriverLoading(false);
//     }
//   };

//   // FETCH SEGMENTS
//   const fetchSegments = async () => {
//     setSegmentLoading(true);

//     try {
//       const res = await getAllSegment({
//         page: 1,
//         rowsPerPage: 100,
//       });

//       if (res?.status) {
//         setSegments(res.data || []);
//       }
//     } finally {
//       setSegmentLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDrivers();
//     fetchSegments();
//   }, []);

//   const handleApply = () => {
//     onApply({
//       search: localFilters.search || "",

//       driverId: localFilters.driverId || "",
//       segmentId: localFilters.segmentId || "",

//       brand: localFilters.brand || "",
//       fuelType: localFilters.fuelType || "",

//       isActive: localFilters.isActive || "",
//       isOnTrip: localFilters.isOnTrip || "",
//       isAvailable: localFilters.isAvailable || "",
//       isAssigned: localFilters.isAssigned || "",
//     });
//   };

//   return (
//     <div className="bg-white p-5 rounded-xl shadow mb-6">
//       <h3 className="text-xl font-semibold mb-4">Vehicle Filters</h3>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         {/* SEARCH */}
//         <input
//           className="border p-2 rounded-xl"
//           placeholder="Search number/model"
//           value={localFilters.search || ""}
//           onChange={(e) => handleChange("search", e.target.value)}
//         />

//         {/* DRIVER */}
//         {/* <Select
//           showSearch
//           placeholder="Select Driver"
//           value={localFilters.driverId || undefined}
//           onChange={(val) => handleChange("driverId", val)}
//           loading={driverLoading}
//           allowClear
//         >
//           {drivers.map((d) => (
//             <Option key={d._id} value={d._id}>
//               {d.name} | {d.phone}
//             </Option>
//           ))}
//         </Select> */}
//         <Select
//           showSearch
//           placeholder="Select Driver"
//           value={localFilters.driverId || undefined}
//           onChange={(val) => handleChange("driverId", val)}
//           loading={driverLoading}
//           allowClear
//           className="custom-select w-full"
//           optionFilterProp="children"
//           filterOption={(input, option) =>
//             (option?.children ?? "").toLowerCase().includes(input.toLowerCase())
//           }
//         >
//           {drivers.map((d) => (
//             <Option key={d._id} value={d._id}>
//               {`${d.name} | ${d.phone}`}
//             </Option>
//           ))}
//         </Select>

//         {/* SEGMENT */}
//         <Select
//           showSearch
//           placeholder="Select Segment"
//           value={localFilters.segmentId || undefined}
//           onChange={(val) => handleChange("segmentId", val)}
//           loading={segmentLoading}
//           allowClear
//           className="custom-select w-full"
//           optionFilterProp="children"
//           filterOption={(input, option) =>
//             (option?.children ?? "").toLowerCase().includes(input.toLowerCase())
//           }
//         >
//           {segments.map((s) => (
//             <Option key={s._id} value={s._id}>
//               {s.name}
//             </Option>
//           ))}
//         </Select>
//         {/* <Select
//           showSearch
//           placeholder="Select Segment"
//           value={localFilters.segmentId || undefined}
//           onChange={(val) => handleChange("segmentId", val)}
//           loading={segmentLoading}
//           allowClear
//         >
//           {segments.map((s) => (
//             <Option key={s._id} value={s._id}>
//               {s.name}
//             </Option>
//           ))}
//         </Select> */}

//         {/* BRAND */}
//         <input
//           className="border p-2 rounded-xl"
//           placeholder="Brand"
//           value={localFilters.brand || ""}
//           onChange={(e) => handleChange("brand", e.target.value)}
//         />

//         {/* FUEL TYPE */}
//         <select
//           className="border p-2 rounded-xl"
//           value={localFilters.fuelType || ""}
//           onChange={(e) => handleChange("fuelType", e.target.value)}
//         >
//           <option value="">Fuel Type</option>
//           <option value="petrol">Petrol</option>
//           <option value="diesel">Diesel</option>
//           <option value="cng">CNG</option>
//           <option value="electric">Electric</option>
//         </select>

//         {/* ACTIVE */}
//         <select
//           className="border p-2 rounded-xl"
//           value={localFilters.isActive || ""}
//           onChange={(e) => handleChange("isActive", e.target.value)}
//         >
//           <option value="">Status</option>
//           <option value="true">Active</option>
//           <option value="false">Inactive</option>
//         </select>

//         {/* ON TRIP */}
//         <select
//           className="border p-2 rounded-xl"
//           value={localFilters.isOnTrip || ""}
//           onChange={(e) => handleChange("isOnTrip", e.target.value)}
//         >
//           <option value="">On Trip</option>
//           <option value="true">Yes</option>
//           <option value="false">No</option>
//         </select>

//         {/* AVAILABLE */}
//         <select
//           className="border p-2 rounded-xl"
//           value={localFilters.isAvailable || ""}
//           onChange={(e) => handleChange("isAvailable", e.target.value)}
//         >
//           <option value="">Available</option>
//           <option value="true">Yes</option>
//           <option value="false">No</option>
//         </select>

//         {/* ASSIGNED */}
//         <select
//           className="border p-2 rounded-xl"
//           value={localFilters.isAssigned || ""}
//           onChange={(e) => handleChange("isAssigned", e.target.value)}
//         >
//           <option value="">Assigned</option>
//           <option value="true">Yes</option>
//           <option value="false">No</option>
//         </select>
//       </div>

//       <div className="flex gap-3 mt-5">
//         <motion.button
//           whileTap={{ scale: 0.95 }}
//           onClick={handleApply}
//           className="bg-primary text-white px-5 py-2 rounded-xl"
//         >
//           Apply Filters
//         </motion.button>

//         <motion.button
//           whileTap={{ scale: 0.95 }}
//           onClick={onReset}
//           className="bg-gray-400 text-white px-5 py-2 rounded-xl"
//         >
//           Reset
//         </motion.button>
//       </div>
//     </div>
//   );
// }

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

  const fetchDrivers = async () => {
    setDriverLoading(true);
    try {
      const res = await getAllDrivers({ page: 1, rowsPerPage: 100 });
      if (res?.status) setDrivers(res.data || []);
    } finally {
      setDriverLoading(false);
    }
  };

  const fetchSegments = async () => {
    setSegmentLoading(true);
    try {
      const res = await getAllSegment({ page: 1, rowsPerPage: 100 });
      if (res?.status) setSegments(res.data || []);
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
      isAssigned: localFilters.isAssigned || "",
    });
  };

  // 🔥 LABEL HELPERS
  const getDriverLabel = (id) => {
    const d = drivers.find((x) => x._id === id);
    return d ? `${d.name} | ${d.phone}` : "";
  };

  const getSegmentLabel = (id) => {
    const s = segments.find((x) => x._id === id);
    return s ? s.name : "";
  };

  const statusLabel = (val) =>
    val === "true" ? "Active" : val === "false" ? "Inactive" : "";

  const getStatusLabel = (val) => {
    if (val === "true") return "Status - Active";
    if (val === "false") return "Status - Inactive";
    return "";
  };

  const yesNoLabel = (val) =>
    val === "true" ? "Yes" : val === "false" ? "No" : "";

  return (
    <div className="bg-white p-5 rounded-xl shadow mb-6">
      <h3 className="text-xl font-semibold mb-4">Vehicle Filters</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* SEARCH (label style) */}
        <input
          className="border p-2 rounded-xl"
          placeholder="Search number/model"
          value={localFilters.search ? `Search - ${localFilters.search}` : ""}
          onChange={(e) =>
            handleChange("search", e.target.value.replace("Search - ", ""))
          }
        />

        {/* DRIVER (label inside select) */}
        <Select
          showSearch
          labelInValue
          placeholder="Driver"
          value={
            localFilters.driverId
              ? {
                  value: localFilters.driverId,
                  label: `Driver - ${getDriverLabel(localFilters.driverId)}`,
                }
              : undefined
          }
          onChange={(val) => handleChange("driverId", val?.value)}
          loading={driverLoading}
          allowClear
          className="custom-select w-full"
          optionFilterProp="children"
        >
          {drivers.map((d) => (
            <Option key={d._id} value={d._id}>
              {`${d.name} | ${d.phone}`}
            </Option>
          ))}
        </Select>
        {/* <Select
          showSearch
          placeholder="Driver"
          value={
            localFilters.driverId
              ? `${getDriverLabel(localFilters.driverId)}`
              : undefined
          }
          onChange={(val) => handleChange("driverId", val)}
          loading={driverLoading}
          allowClear
          className="custom-select w-full"
          optionFilterProp="children"
        >
          {drivers.map((d) => (
            <Option key={d._id} value={d._id}>
              {`${d.name} | ${d.phone}`}
            </Option>
          ))}
        </Select> */}

        {/* SEGMENT */}
        <Select
          showSearch
          placeholder="Segment"
          value={
            localFilters.segmentId
              ? `Segment - ${getSegmentLabel(localFilters.segmentId)}`
              : undefined
          }
          onChange={(val) => handleChange("segmentId", val)}
          loading={segmentLoading}
          allowClear
          className="custom-select w-full"
          optionFilterProp="children"
        >
          {segments.map((s) => (
            <Option key={s._id} value={s._id}>
              {s.name}
            </Option>
          ))}
        </Select>

        {/* BRAND */}
        <input
          className="border p-2 rounded-xl"
          placeholder="Brand"
          value={localFilters.brand ? `Brand - ${localFilters.brand}` : ""}
          onChange={(e) =>
            handleChange("brand", e.target.value.replace("Brand - ", ""))
          }
        />

        {/* FUEL */}
        <Select
          showSearch
          placeholder="Fuel Type"
          value={
            localFilters.fuelType
              ? `Fuel - ${localFilters.fuelType.charAt(0).toUpperCase() + localFilters.fuelType.slice(1)}`
              : undefined
          }
          onChange={(val) => handleChange("fuelType", val)}
          allowClear
          className="custom-select w-full"
        >
          <Option value="petrol">Petrol</Option>
          <Option value="diesel">Diesel</Option>
          <Option value="cng">CNG</Option>
          <Option value="electric">Electric</Option>
        </Select>
        {/* <select
          className="border p-2 rounded-xl"
          value={localFilters.fuelType || ""}
          onChange={(e) => handleChange("fuelType", e.target.value)}
        >
          <option value="">
            {localFilters.fuelType
              ? `Fuel - ${localFilters.fuelType}`
              : "Fuel Type"}
          </option>
          <option value="petrol">Petrol</option>
          <option value="diesel">Diesel</option>
          <option value="cng">CNG</option>
          <option value="electric">Electric</option>
        </select> */}

        {/* ACTIVE */}
        <div className="flex flex-col">
          <Select
            showSearch
            placeholder="Status"
            value={
              localFilters.isActive
                ? `Status - ${statusLabel(localFilters.isActive)}`
                : undefined
            }
            onChange={(val) => handleChange("isActive", val)}
            allowClear
            className="custom-select w-full"
          >
            <Option value="true">Active</Option>
            <Option value="false">Inactive</Option>
          </Select>

          {/* {localFilters.isActive && (
            <span className="text-xs text-gray-600 mt-1">
              {getStatusLabel(localFilters.isActive)}
            </span>
          )} */}
        </div>
        {/* <select
          className="border p-2 rounded-xl"
          value={localFilters.isActive || ""}
          onChange={(e) => handleChange("isActive", e.target.value)}
        >
          <option value="">
            {localFilters.isActive
              ? `Status - ${statusLabel(localFilters.isActive)}`
              : "Status"}
          </option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select> */}

        {/* ON TRIP */}
        {/* <select
          className="border p-2 rounded-xl"
          value={localFilters.isOnTrip || ""}
          onChange={(e) => handleChange("isOnTrip", e.target.value)}
        >
          <option value="">
            {localFilters.isOnTrip
              ? `On Trip - ${yesNoLabel(localFilters.isOnTrip)}`
              : "On Trip"}
          </option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select> */}
        <Select
          showSearch
          placeholder="On Trip"
          value={
            localFilters.isOnTrip
              ? `On Trip - ${localFilters.isOnTrip === "true" ? "Yes" : "No"}`
              : undefined
          }
          onChange={(val) => handleChange("isOnTrip", val)}
          allowClear
          className="custom-select w-full"
        >
          <Option value="true">Yes</Option>
          <Option value="false">No</Option>
        </Select>

        {/* AVAILABLE */}
        <Select
          showSearch
          placeholder="Available"
          value={
            localFilters.isAvailable
              ? `Available - ${localFilters.isAvailable === "true" ? "Yes" : "No"}`
              : undefined
          }
          onChange={(val) => handleChange("isAvailable", val)}
          allowClear
          className="custom-select w-full"
        >
          <Option value="true">Yes</Option>
          <Option value="false">No</Option>
        </Select>
        {/* <select
          className="border p-2 rounded-xl"
          value={localFilters.isAvailable || ""}
          onChange={(e) => handleChange("isAvailable", e.target.value)}
        >
          <option value="">
            {localFilters.isAvailable
              ? `Available - ${yesNoLabel(localFilters.isAvailable)}`
              : "Available"}
          </option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select> */}

        {/* ASSIGNED */}
        <Select
          showSearch
          placeholder="Assigned"
          value={
            localFilters.isAssigned
              ? `Assigned - ${localFilters.isAssigned === "true" ? "Yes" : "No"}`
              : undefined
          }
          onChange={(val) => handleChange("isAssigned", val)}
          allowClear
          className="custom-select w-full"
        >
          <Option value="true">Yes</Option>
          <Option value="false">No</Option>
        </Select>
        {/* <select
          className="border p-2 rounded-xl"
          value={localFilters.isAssigned || ""}
          onChange={(e) => handleChange("isAssigned", e.target.value)}
        >
          <option value="">
            {localFilters.isAssigned
              ? `Assigned - ${yesNoLabel(localFilters.isAssigned)}`
              : "Assigned"}
          </option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select> */}
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
