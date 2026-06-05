// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { Select } from "antd";
// const { Option } = Select;

// // const formatDate = (value) => {
// //   if (!value) return "";
// //   const [year, month, day] = value.split("-");
// //   return `${day}-${month}-${year}`;
// // };

// export default function ComplaintFilter({ appliedFilters, onApply, onReset }) {
//   // Local state for editing before applying
//   const [localFilters, setLocalFilters] = useState({ ...appliedFilters });

//   const issueCategories = ["booking", "driver", "payment", "other"];
//   const ticketStatuses = ["open", "in_progress", "resolved", "closed"];
//   const onModels = ["User", "Driver"];

//   // Sync local state when appliedFilters change (e.g., after reset)
//   useEffect(() => {
//     setLocalFilters({ ...appliedFilters });
//   }, [appliedFilters]);

//   const handleChange = (key, value) => {
//     setLocalFilters((prev) => ({ ...prev, [key]: value }));
//   };

//   const handleApply = () => {
//     onApply(localFilters); // Only push changes on Apply
//   };

//   // const handleApply = () => {
//   //   onApply({
//   //     ...localFilters,
//   //     startDate: localFilters.startDateFormatted || "",
//   //     endDate: localFilters.endDateFormatted || "",
//   //   });
//   // };

//   const handleReset = () => {
//     onReset(); // Parent will reset applied filters
//   };

//   return (
//     <div className="bg-white p-5 rounded-xl shadow mb-6">
//       <h3 className="text-lg font-semibold mb-4">Search & Filters</h3>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         {/* SEARCH */}
//         <input
//           type="text"
//           placeholder="Search by Ticket ID / Reporter Name / Email / Phone / Description"
//           className="border p-2 rounded-lg"
//           value={localFilters.searchQuery}
//           onChange={(e) => handleChange("searchQuery", e.target.value)}
//         />


//         {/* START DATE */}
//         {/* <input
//           type={localFilters.startDate ? "date" : "text"}
//           placeholder="Start Date"
//           className="border p-2 rounded-lg"
//           value={localFilters.startDate || ""}
//           onFocus={(e) => (e.target.type = "date")}
//           onBlur={(e) => {
//             if (!e.target.value) e.target.type = "text";
//           }}
//           onChange={(e) => {
//             const raw = e.target.value; // yyyy-mm-dd
//             handleChange("startDate", raw); // UI
//             handleChange("startDateFormatted", formatDate(raw)); // API
//           }}
//         /> */}

//         {/* END DATE */}
//         {/* <input
//           type={localFilters.endDate ? "date" : "text"}
//           placeholder="End Date"
//           className="border p-2 rounded-lg"
//           value={localFilters.endDate || ""}
//           onFocus={(e) => (e.target.type = "date")}
//           onBlur={(e) => {
//             if (!e.target.value) e.target.type = "text";
//           }}
//           onChange={(e) => {
//             const raw = e.target.value;
//             handleChange("endDate", raw);
//             handleChange("endDateFormatted", formatDate(raw));
//           }}
//         /> */}
//         <input
//           type="date"
//           className="border p-2 rounded-lg"
//           value={localFilters.startDate}
//           onChange={(e) => handleChange("startDate", e.target.value)}
//         />
//         <input
//           type="date"
//           className="border p-2 rounded-lg"
//           value={localFilters.endDate}
//           onChange={(e) => handleChange("endDate", e.target.value)}
//         />

//         {/* ISSUE CATEGORY */}
//         <Select
//           showSearch
//           size="large"
//           bordered={false}
//           placeholder="Issue Category"
//           value={localFilters.issueCategory || undefined}
//           onChange={(val) => handleChange("issueCategory", val)}
//           className="border p-2 rounded-lg w-full"
//           filterOption={(input, option) =>
//             option?.children?.toLowerCase().includes(input.toLowerCase())
//           }
//         >
//           {issueCategories.map((c) => (
//             <Option key={c} value={c}>
//               {c.charAt(0).toUpperCase() + c.slice(1)}
//             </Option>
//           ))}
//         </Select>

//         {/* TICKET STATUS */}
//         <Select
//           showSearch
//           size="large"
//           bordered={false}
//           placeholder="Ticket Status"
//           value={localFilters.ticketStatus || undefined}
//           onChange={(val) => handleChange("ticketStatus", val)}
//           className="border p-2 rounded-lg w-full"
//           filterOption={(input, option) =>
//             option?.children?.toLowerCase().includes(input.toLowerCase())
//           }
//         >
//           {ticketStatuses.map((status) => (
//             <Option key={status} value={status}>
//               {status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
//             </Option>
//           ))}
//         </Select>

//         {/* ON MODEL */}
//         <Select
//           showSearch
//           size="large"
//           bordered={false}
//           placeholder="On Model"
//           value={localFilters.onModel || undefined}
//           onChange={(val) => handleChange("onModel", val)}
//           className="border p-2 rounded-lg w-full"
//           filterOption={(input, option) =>
//             option?.children?.toLowerCase().includes(input.toLowerCase())
//           }
//         >
//           {onModels.map((model) => (
//             <Option key={model} value={model}>
//               {model}
//             </Option>
//           ))}
//         </Select>
//       </div>

//       {/* BUTTONS */}
//       <div className="flex gap-3 mt-5">
//         <motion.button
//           whileTap={{ scale: 0.95 }}
//           onClick={handleApply}
//           className="bg-primary text-white px-5 py-2 rounded-lg"
//         >
//           Apply Filters
//         </motion.button>
//         <motion.button
//           whileTap={{ scale: 0.95 }}
//           onClick={handleReset}
//           className="bg-gray-400 text-white px-5 py-2 rounded-lg"
//         >
//           Reset
//         </motion.button>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Select } from "antd";
import { DatePicker } from "antd";
import customParseFormat from "dayjs/plugin/customParseFormat";
const { Option } = Select;
import dayjs from "dayjs";
export default function ComplaintFilter({
  appliedFilters,
  onApply,
  onReset,
}) {
  const [localFilters, setLocalFilters] = useState({
    searchQuery: "",
    startDate: "",
    endDate: "",
    issueCategory: "",
    ticketStatus: "",
    onModel: "",
    ...appliedFilters,
  });
 
  const issueCategories = ["booking", "driver", "payment", "other"];
  const ticketStatuses = ["open", "in_progress", "resolved", "closed"];
  const onModels = ["User", "Driver"];
 
  useEffect(() => {
    setLocalFilters({
      searchQuery: "",
      startDate: "",
      endDate: "",
      issueCategory: "",
      ticketStatus: "",
      onModel: "",
      ...appliedFilters,
    });
  }, [appliedFilters]);
 
  const handleChange = (key, value) => {
    const updatedFilters = {
      ...localFilters,
      [key]: value,
    };
 
    setLocalFilters(updatedFilters);
 
    // Auto apply for dropdowns and dates
    if (
      key === "issueCategory" ||
      key === "ticketStatus" ||
      key === "onModel"
      // key === "startDate" ||
      // key === "endDate"
    ) {
      onApply(updatedFilters);
    }
  };
 
  const handleApply = () => {
    onApply(localFilters);
  };
 
  const handleReset = () => {
    setLocalFilters({
      searchQuery: "",
      startDate: "",
      endDate: "",
      issueCategory: "",
      ticketStatus: "",
      onModel: "",
    });
 
    onReset();
  };
 
  return (
    <div className="bg-white p-5 rounded-xl shadow mb-6">
      <h3 className="text-lg font-semibold mb-4">
        Search & Filters
      </h3>
 
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search by Ticket ID / Reporter Name / Email / Phone / Description"
          className="border p-2 rounded-lg"
          value={localFilters.searchQuery || ""}
          onChange={(e) =>
            handleChange("searchQuery", e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onApply({
                ...localFilters,
                searchQuery: e.target.value,
              });
            }
          }}
        />
 
        {/* START DATE */}
        <input
          type="date"
          className="border p-2 rounded-lg"
          value={localFilters.startDate || ""}
          onChange={(e) =>
            handleChange("startDate", e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onApply(localFilters);
            }
          }}
        />
 
     
        <input
          type="date"
          className="border p-2 rounded-lg"
          value={localFilters.endDate || ""}
          onChange={(e) =>
            handleChange("endDate", e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onApply(localFilters);
            }
          }}
        />
        {/* <DatePicker
          className="w-full"
          format="DD-MM-YYYY"
          placeholder="Start Date"
          value={
            localFilters.startDate
              ? dayjs(localFilters.startDate, "YYYY-MM-DD")
              : null
          }
          onChange={(date) => {
            handleChange(
              "startDate",
              date ? date.format("YYYY-MM-DD") : ""
            );
          }}
        />
        <DatePicker
          className="w-full"
          format="DD-MM-YYYY"
          placeholder="End Date"
          value={
            localFilters.endDate
              ? dayjs(localFilters.endDate, "YYYY-MM-DD")
              : null
          }
          onChange={(date) => {
            handleChange(
              "endDate",
              date ? date.format("YYYY-MM-DD") : ""
            );
          }}
        /> */}
        {/* ISSUE CATEGORY */}
        <Select
          showSearch
          size="large"
          bordered={false}
          placeholder="Issue Category"
          allowClear
          value={localFilters.issueCategory || undefined}
          onChange={(value) =>
            handleChange("issueCategory", value || "")
          }
          className="border rounded-lg w-full"
          filterOption={(input, option) =>
            option?.children
              ?.toLowerCase()
              .includes(input.toLowerCase())
          }
        >
          {issueCategories.map((item) => (
            <Option key={item} value={item}>
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </Option>
          ))}
        </Select>
 
        {/* TICKET STATUS */}
        <Select
          showSearch
          size="large"
          bordered={false}
          placeholder="Ticket Status"
          allowClear
          value={localFilters.ticketStatus || undefined}
          onChange={(value) =>
            handleChange("ticketStatus", value || "")
          }
          className="border rounded-lg w-full"
          filterOption={(input, option) =>
            option?.children
              ?.toLowerCase()
              .includes(input.toLowerCase())
          }
        >
          {ticketStatuses.map((status) => (
            <Option key={status} value={status}>
              {status
                .replace("_", " ")
                .replace(/\b\w/g, (l) => l.toUpperCase())}
            </Option>
          ))}
        </Select>
 
        {/* ON MODEL */}
        <Select
          showSearch
          size="large"
          bordered={false}
          placeholder="On Model"
          allowClear
          value={localFilters.onModel || undefined}
          onChange={(value) =>
            handleChange("onModel", value || "")
          }
          className="border rounded-lg w-full"
          filterOption={(input, option) =>
            option?.children
              ?.toLowerCase()
              .includes(input.toLowerCase())
          }
        >
          {onModels.map((model) => (
            <Option key={model} value={model}>
              {model}
            </Option>
          ))}
        </Select>
      </div>
 
      <div className="flex gap-3 mt-5">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleApply}
          className="bg-primary text-white px-5 py-2 rounded-lg"
        >
          Apply Filters
        </motion.button>
 
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleReset}
          className="bg-gray-500 text-white px-5 py-2 rounded-lg"
        >
          Reset
        </motion.button>
      </div>
    </div>
  );
}