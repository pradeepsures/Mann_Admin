// CorporateFilter.jsx

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CorporateFilter({
  appliedFilters,
  onApply,
  onReset,
}) {
  const [localFilters, setLocalFilters] = useState({
    ...appliedFilters,
  });

  useEffect(() => {
    setLocalFilters({ ...appliedFilters });
  }, [appliedFilters]);

  const handleChange = (key, value) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleApply = () => {
    onApply({
      search: localFilters.search || "",
      isApproved: localFilters.isApproved || "",
      isActive: localFilters.isActive || "",
      isVerified: localFilters.isVerified || "",
      industryType: localFilters.industryType || "",
      startDate: localFilters.startDate || "",
      endDate: localFilters.endDate || "",
    });
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow mb-6">
      <h3 className="text-xl font-semibold mb-4">
        Corporate Filters
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* SEARCH */}
        <input
          className="border p-2 rounded-xl"
          placeholder="Search company / email / username"
          value={localFilters.search || ""}
          onChange={(e) =>
            handleChange("search", e.target.value)
          }
        />

        {/* INDUSTRY */}
        {/* INDUSTRY TYPE */}
        <select
          className="border p-2 rounded-xl"
          value={localFilters.industryType || ""}
          onChange={(e) =>
            handleChange("industryType", e.target.value)
          }
        >
          <option value="">Select Industry Type</option>

          <option value="IT">IT</option>

          <option value="Manufacturing">
            Manufacturing
          </option>

          <option value="Logistics">
            Logistics
          </option>

          <option value="Retail">
            Retail
          </option>

          <option value="Healthcare">
            Healthcare
          </option>

          <option value="Education">
            Education
          </option>

          <option value="Finance">
            Finance
          </option>

          <option value="E-commerce">
            E-commerce
          </option>

          <option value="Automotive">
            Automotive
          </option>

          <option value="Others">
            Others
          </option>
        </select>
        {/* <input
          className="border p-2 rounded-xl"
          placeholder="Industry Type"
          value={localFilters.industryType || ""}
          onChange={(e) =>
            handleChange("industryType", e.target.value)
          }
        /> */}

        {/* APPROVED */}
        <select
          className="border p-2 rounded-xl"
          value={localFilters.isApproved || ""}
          onChange={(e) =>
            handleChange("isApproved", e.target.value)
          }
        >
          <option value="">Approval Status</option>
          <option value="true">Approved</option>
          <option value="false">Pending</option>
        </select>

        {/* ACTIVE */}
        <select
          className="border p-2 rounded-xl"
          value={localFilters.isActive || ""}
          onChange={(e) =>
            handleChange("isActive", e.target.value)
          }
        >
          <option value="">Active Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>

        {/* VERIFIED */}
        <select
          className="border p-2 rounded-xl"
          value={localFilters.isVerified || ""}
          onChange={(e) =>
            handleChange("isVerified", e.target.value)
          }
        >
          <option value="">Verification Status</option>
          <option value="true">Verified</option>
          <option value="false">Unverified</option>
        </select>

        {/* START DATE */}
        <input
          type="date"
          className="border p-2 rounded-xl"
          value={localFilters.startDate || ""}
          onChange={(e) =>
            handleChange("startDate", e.target.value)
          }
        />

        {/* END DATE */}
        <input
          type="date"
          className="border p-2 rounded-xl"
          value={localFilters.endDate || ""}
          onChange={(e) =>
            handleChange("endDate", e.target.value)
          }
        />
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