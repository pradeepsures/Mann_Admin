import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getVehicleById, updateVehicle } from "../../Services/VehicleApi";
import { getAllDrivers } from "../../Services/DriverApi";
import { getAllSegment } from "../../Services/SegmentApi";
import { Select, Switch } from "antd";
import Breaker from "../../compoents/Breaker";

const { Option } = Select;

const UpdateVehicle = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState({});

  const [drivers, setDrivers] = useState([]);
  const [segments, setSegments] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    driver: "",
    segment: "",
    brand: "",
    model: "",
    fuelType: "diesel",
    year: "",
    color: "",
    carNumber: "",
    bootSpace: "",
    certificateNumber: "",
    certificateExpiry: "",
    insuranceExpiry: "",
    pollutionExpiry: "",
    rcExpeiry: "",
    rcIssueDate: "",
    capacity: "",
    isActive: true,
    carImage: [],
    documentImage: [],
    certificatePhoto: null, // only for new file object
    rcFrontPhoto: null,      // only for new file object
    rcBackPhoto: null,       // only for new file object
  });

  const [previews, setPreviews] = useState({
    certificatePhoto: "",
    rcFrontPhoto: "",
    rcBackPhoto: "",
    carImage: [],
    documentImage: [],
  });

  // ================= FETCH SINGLE VEHICLE =================
  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const vehicle = await getVehicleById(id);
        const data = vehicle.data;

        setFormData({
          driver: data.driver?._id || "",
          segment: data.segment?._id || "",
          brand: data.brand || "",
          model: data.model || "",
          fuelType: data.fuelType || "diesel",
          year: data.year || "",
          color: data.color || "",
          carNumber: data.carNumber || "",
          bootSpace: data.bootSpace || "",
          certificateNumber: data.certificateNumber || "",
          certificateExpiry: data.certificateExpiry ? data.certificateExpiry.split("T")[0] : "",
          insuranceExpiry: data.insuranceExpiry ? data.insuranceExpiry.split("T")[0] : "",
          pollutionExpiry: data.pollutionExpiry ? data.pollutionExpiry.split("T")[0] : "",
          rcExpeiry: data.rcExpeiry ? data.rcExpeiry.split("T")[0] : "",
          rcIssueDate: data.rcIssueDate ? data.rcIssueDate.split("T")[0] : "",
          insuranceNumber: data.insuranceNumber || "",
          pollutionNumber: data.pollutionNumber || "",
          fitnessNumber: data.fitnessNumber || "",
          permitNumber: data.permitNumber || "",
          insureanceIssueDate: data.insuranceIssueDate ? data.insuranceIssueDate.split("T")[0] : "",
          pollutionStartDate: data.pollutionStartDate ? data.pollutionStartDate.split("T")[0] : "",
          pollutionExpiryDate: data.pollutionExpiryDate ? data.pollutionExpiryDate.split("T")[0] : "",
          fitnessStartDate: data.fitnessStartDate ? data.fitnessStartDate.split("T")[0] : "",
          fitnessExpiryDate: data.fitnessExpiryDate ? data.fitnessExpiryDate.split("T")[0] : "",
          permitStartDate: data.permitStartDate ? data.permitStartDate.split("T")[0] : "",
          permitExpiryDate: data.permitExpiryDate ? data.permitExpiryDate.split("T")[0] : "",
          capacity: data.capacity || "",
          isActive: data.isActive !== false,
          carImage: data.carImage ? [...data.carImage] : [],
          documentImage: data.documentImage ? [...data.documentImage] : [],
          certificatePhoto: null,
          rcFrontPhoto: null,
          rcBackPhoto: null,
        });

        // ✅ PREVIEW existing images from API
        setPreviews({
          certificatePhoto: data.certificatePhoto || "",
          rcFrontPhoto: data.rcFrontPhoto || "",
          rcBackPhoto: data.rcBackPhoto || "",
          carImage: data.carImage ? [...data.carImage] : [],
          documentImage: data.documentImage ? [...data.documentImage] : [],
        });
      } catch (err) {
        toast.error("Failed to load vehicle details");
        navigate("/vehicle");
      }
    };

    if (id) fetchVehicle();
  }, [id, navigate]);

  // ================= FETCH DRIVERS & SEGMENTS =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const driversRes = await getAllDrivers({
          page: 1,
          rowsPerPage: 50,
          searchQuery: "",
        });
        const segmentsRes = await getAllSegment({
          page: 1,
          rowsPerPage: 50,
        });

        setDrivers(driversRes?.data || []);
        setSegments(segmentsRes?.data || []);
      } catch (err) {
        toast.error("Failed to load data");
      }
    };

    fetchData();
  }, []);

  // ================= FORM INPUT CHANGES =================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log("Field changed:", name, "Value:", value);
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ================= FILE HANDLER WITH PREVIEW =================
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files?.[0];

    if (!file) return;

    // Single image fields
    if (["certificatePhoto", "rcFrontPhoto", "rcBackPhoto"].includes(name)) {
      const url = URL.createObjectURL(file);
      setPreviews((prev) => ({ ...prev, [name]: url }));
      setFormData((prev) => ({ ...prev, [name]: file }));
      return;
    }

    // Multiple image fields (carImage, documentImage)
    const newFiles = Array.from(files);
    const newUrls = newFiles.map((f) => URL.createObjectURL(f));

    setPreviews((prev) => ({
      ...prev,
      [name]: (prev[name] || []).concat(newUrls),
    }));

    setFormData((prev) => ({
      ...prev,
      [name]: (prev[name] || []).concat(newFiles),
    }));
  };

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      Object.values(previews).forEach((item) => {
        if (Array.isArray(item)) {
          item.forEach((url) => {
            if (url && url.startsWith("blob:")) URL.revokeObjectURL(url);
          });
        } else if (item && item.startsWith("blob:")) {
          URL.revokeObjectURL(item);
        }
      });
    };
  }, [previews]);

  // ================= FRONTEND VALIDATION =================
  const validateForm = () => {
    const errors = {};
    // if (!formData.driver) errors.driver = "Driver is required.";
    // if (!formData.segment) errors.segment = "Segment is required.";
    if (!formData.brand) errors.brand = "Brand is required.";
    if (!formData.model) errors.model = "Model is required.";
    if (!formData.year) errors.year = "Year is required.";
    if (!formData.carNumber) errors.carNumber = "Car number is required.";

    setApiError(errors);
    return Object.keys(errors).length === 0;
  };

  // ================= SUBMIT (UPDATE VEHICLE) =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Update submit clicked, current formData:", formData);
    setApiError({});
    setLoading(true);

    if (!validateForm()) {
      console.log("Validation failed");
      setLoading(false);
      return;
    }

    try {
      console.log("Validation passed, creating FormData");
      const data = new FormData();

      // Append all simple text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (
          value !== "" &&
          value !== null &&
          value !== undefined &&
          typeof value !== "object" &&
          !Array.isArray(value)
        ) {
          data.append(key, value);
        }
      });

      // New uploads (file objects, not old URLs)
      // ✅ separate old + new
      const newCarImages = formData.carImage.filter((img) => img instanceof File);
      const oldCarImages = formData.carImage.filter((img) => typeof img === "string");

      // ✅ send old images (VERY IMPORTANT)
      oldCarImages.forEach((img) => {
        data.append("existingCarImage", img);
      });

      // ✅ send new images
      newCarImages.forEach((file) => {
        data.append("carImage", file);
      });
      // if (formData.carImage.length > 0 && formData.carImage[0] instanceof File) {
      //   formData.carImage.forEach((file) => {
      //     data.append("carImage", file);
      //   });
      // }
      if (formData.documentImage.length > 0 && formData.documentImage[0] instanceof File) {
        formData.documentImage.forEach((file) => {
          data.append("documentImage", file);
        });
      }

      if (formData.certificatePhoto) data.append("certificatePhoto", formData.certificatePhoto);
      if (formData.rcFrontPhoto) data.append("rcFrontPhoto", formData.rcFrontPhoto);
      if (formData.rcBackPhoto) data.append("rcBackPhoto", formData.rcBackPhoto);

      const res = await updateVehicle({ id, data });

      if (res?.status) {
        toast.success("Vehicle Updated Successfully");
        navigate(-1);
      } else {
        const errMsg = res?.message || "Failed to update vehicle";
        toast.error(errMsg);
      }
    } catch (err) {
      console.error("Error updating vehicle:", err);
      toast.error("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-20">
        <div className="animate-spin w-6 h-6 border-2 border-t-transparent border-purple-600 rounded-full mr-2" />
        <span>Please wait...</span>
      </div>
    );
  }

  return (
    <div className="m-3">
            <Breaker />
      <div className="ml-5 mt-8 bg-white p-6 max-w-9xl rounded-xl shadow-xl">
        <form onSubmit={handleSubmit}>
          {/* DRIVER */}
          <label className="ml-2 mt-4 font-normal block">Driver *</label>
          <Select
            showSearch
            placeholder="Select chauffer"
            value={formData.driver || undefined}
            className="w-full h-10 mb-3 border rounded-xl"
            onChange={(val) => setFormData((prev) => ({ ...prev, driver: val }))}
            filterOption={(input, option) =>
              option?.children?.toLowerCase().includes(input.toLowerCase())
            }
          >
            {drivers.map((d) => (
              <Option key={d._id} value={d._id}>
                {`${d.name} | ${d.phone} | ${d.email}`}
              </Option>
            ))}
          </Select>
          {apiError.driver && <p className="text-red-500 text-sm ml-2">{apiError.driver}</p>}

          {/* SEGMENT */}
          <label className="ml-2 mt-5 font-normal block">Segment *</label>
          <Select
            showSearch
            placeholder="Select segment"
            value={formData.segment || undefined}
            className="w-full h-10 mb-3 border rounded-xl"
            onChange={(val) => {
              const seg = segments.find((s) => s._id === val);
              setFormData((prev) => ({
                ...prev,
                segment: val,
                capacity: seg?.maxCapacity || "",
              }));
            }}
            filterOption={(input, option) =>
              option?.children?.toLowerCase().includes(input.toLowerCase())
            }
          >
            {segments.map((s) => (
              <Option key={s._id} value={s._id}>
                {`${s.name} `}
              </Option>
            ))}
          </Select>
          {apiError.segment && <p className="text-red-500 text-sm ml-2">{apiError.segment}</p>}

          {/* BASIC FIELDS */}
          {/* {["Vehicle Brand", "Vehicle Model", "fuel Type", "Manufacturer Year", "Vehicle Number", "color", "bootSpace (Lr)", "Capacity (Seater)", "Certificate Number"].map(
            (name) => (
              <div key={name}>
                <label className="ml-2 mt-5 font-normal block capitalize">{name}</label>
                <input
                  type={name === "year" ? "number" : "text"}
                  name={name}
                  value={formData[name] || ""}
                  onChange={handleChange}
                  className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
                  placeholder={`Enter ${name}`}
                />
                {apiError[name] && <p className="text-red-500 text-sm ml-2">{apiError[name]}</p>}
              </div>
            )
          )} */}
          {[
            { label: "Vehicle Brand *", key: "brand", type: "text" },
            { label: "Vehicle Model *", key: "model", type: "text" },
            { label: "Fuel Type *", key: "fuelType", type: "select" },
            { label: "Manufacturer Year *", key: "year", type: "number" },
            { label: "Vehicle Number *", key: "carNumber", type: "text" },
            { label: "Color", key: "color", type: "text" },
            { label: "Boot Space (Lr)", key: "bootSpace", type: "text" },
            { label: "Capacity (Seater)", key: "capacity", type: "number" },
            { label: "Rc Number", key: "certificateNumber", type: "text" },
            { label: "Insurance Number", key: "insuranceNumber", type: "text" },
            { label: "Pollution Number", key: "pollutionNumber", type: "text" },
            { label: "fitness Number", key: "fitnessNumber", type: "text" },
            { label: " All India Permit Number", key: "permitNumber", type: "text" },
          ].map(({ label, key, type }) => (
            <div key={key}>
              <label className="ml-2 mt-5 font-normal block">{label}</label>

              {/* ✅ FUEL TYPE DROPDOWN */}
              {type === "select" ? (
                <select
                  name={key}
                  value={formData[key] || ""}
                  onChange={handleChange}
                  className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
                >
                  <option value="">Select Fuel Type</option>
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                </select>
              ) : (
                <input
                  type={type}
                  name={key}
                  value={formData[key] || ""}
                  onChange={handleChange}
                  className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
                  placeholder={`Enter ${label}`}
                />
              )}

              {apiError[key] && (
                <p className="text-red-500 text-sm ml-2">{apiError[key]}</p>
              )}
            </div>
          ))}

          {/* DATE FIELDS */}
          {[
            // { label: "Certificate Expiry", key: "certificateExpiry" },
            { label: "RC Issue Date", key: "rcIssueDate" },
            { label: "Insurance Expiry", key: "insuranceExpiry" },
            { label: "Pollution Expiry", key: "pollutionExpiry" },
            { label: "RC Expiry", key: "rcExpeiry" },
            { label: "Insurance Issue Date", key: "insuranceIssueDate" },
            { label: "Pollution Start Date", key: "pollutionStartDate" },
            { label: "Pollution Expiry Date", key: "pollutionExpiryDate" },
            { label: "Fitness Start Date", key: "fitnessStartDate" },
            { label: "Fitness Expiry Date", key: "fitnessExpiryDate" },
            { label: "Permit Start Date", key: "permitStartDate" },
            { label: "Permit Expiry Date", key: "permitExpiryDate" },

          ].map(({ label, key }) => (
            <div key={key}>
              <label className="ml-2 mt-5 font-normal block">{label}</label>
              <input
                type="date"
                name={key}
                value={formData[key] || ""}
                onChange={handleChange}
                className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
              />
              {apiError[key] && <p className="text-red-500 text-sm ml-2">{apiError[key]}</p>}
            </div>
          ))}

          {/* STATUS - ACTIVE */}
          <div className="mt-8">
            <label className="ml-2 font-normal block">Active</label>
            <Switch
              checked={formData.isActive}
              onChange={(checked) => setFormData((prev) => ({ ...prev, isActive: checked }))}
              checkedChildren="Yes"
              unCheckedChildren="No"
              size="default"
            />
          </div>

          {/* CERTIFICATE PHOTO */}
          <label className="ml-2 mt-5 font-normal block">Certificate Photo</label>
          {previews.certificatePhoto && (
            <img
              src={previews.certificatePhoto}
              alt="Certificate"
              className="h-16 w-24 object-cover rounded border border-gray-300 ml-2 mt-2"
            />
          )}
          <label
            htmlFor="certificate-upload"
            className="ml-2 mt-2 flex items-center justify-center h-10 border border-gray-500 rounded-xl cursor-pointer bg-white hover:bg-gray-100 transition-colors px-4"
          >
            🖼️ Upload New Certificate Photo
          </label>
          <input
            id="certificate-upload"
            className="hidden"
            type="file"
            name="certificatePhoto"
            accept="image/*"
            onChange={handleFileChange}
          />

          {/* RC FRONT PHOTO */}
          <label className="ml-2 mt-5 font-normal block">RC Front Photo</label>
          {previews.rcFrontPhoto && (
            <img
              src={previews.rcFrontPhoto}
              alt="RC Front"
              className="h-16 w-24 object-cover rounded border border-gray-300 ml-2 mt-2"
            />
          )}
          <label
            htmlFor="rc-front-upload"
            className="ml-2 mt-2 flex items-center justify-center h-10 border border-gray-500 rounded-xl cursor-pointer bg-white hover:bg-gray-100 transition-colors px-4"
          >
            🖼️ Upload New RC Front Photo
          </label>
          <input
            id="rc-front-upload"
            className="hidden"
            type="file"
            name="rcFrontPhoto"
            accept="image/*"
            onChange={handleFileChange}
          />

          {/* RC BACK PHOTO */}
          <label className="ml-2 mt-5 font-normal block">RC Back Photo</label>
          {previews.rcBackPhoto && (
            <img
              src={previews.rcBackPhoto}
              alt="RC Back"
              className="h-16 w-24 object-cover rounded border border-gray-300 ml-2 mt-2"
            />
          )}
          <label
            htmlFor="rc-back-upload"
            className="ml-2 mt-2 flex items-center justify-center h-10 border border-gray-500 rounded-xl cursor-pointer bg-white hover:bg-gray-100 transition-colors px-4"
          >
            🖼️ Upload New RC Back Photo
          </label>
          <input
            id="rc-back-upload"
            className="hidden"
            type="file"
            name="rcBackPhoto"
            accept="image/*"
            onChange={handleFileChange}
          />

          {/* CAR IMAGES (existing + new) */}
          <label className="ml-2 mt-5 font-normal block">Vehicle Images</label>
          <div className="flex gap-2 flex-wrap ml-2 mt-2">
            {previews.carImage.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Car ${i}`}
                className="h-16 w-24 object-cover rounded border border-gray-300"
              />
            ))}
          </div>
          <label
            htmlFor="car-images-upload"
            className="ml-2 mt-2 flex items-center justify-center h-10 border border-gray-500 rounded-xl cursor-pointer bg-white hover:bg-gray-100 transition-colors px-4"
          >
            🖼️ Upload New Vehicle Images
          </label>
          <input
            id="car-images-upload"
            className="hidden"
            type="file"
            name="carImage"
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />

          {/* DOCUMENT IMAGES (existing + new) */}
          <label className="ml-2 mt-5 font-normal block">Miscellaneous Documents</label>
          <div className="flex gap-2 flex-wrap ml-2 mt-2">
            {previews.documentImage.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Document ${i}`}
                className="h-16 w-24 object-cover rounded border border-gray-300"
              />
            ))}
          </div>
          <label
            htmlFor="document-images-upload"
            className="ml-2 mt-2 flex items-center justify-center h-10 border border-gray-500 rounded-xl cursor-pointer bg-white hover:bg-gray-100 transition-colors px-4"
          >
            🖼️ Upload New Document Images
          </label>
          <input
            id="document-images-upload"
            className="hidden"
            type="file"
            name="documentImage"
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />

          {/* SUBMIT BUTTON */}
          <div className="flex justify-end items-center gap-4 mt-8">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-white hover:scale-105 active:scale-95 transition-transform duration-500 py-3 px-6 rounded-2xl"
            >
              {loading ? "Updating..." : "Update Vehicle"}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="bg-gray-500 text-white py-3 px-6 rounded-2xl hover:bg-gray-600 transition-colors"
            >
              Back
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default UpdateVehicle;
