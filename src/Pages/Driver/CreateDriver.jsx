import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Breaker from "../../compoents/Breaker";
import { createDriverApi } from "../../Services/DriverApi";
import { getAllRegions } from "../../Services/RegionApi";
import Loader from "../../compoents/Loader";
import toast from "react-hot-toast";
import { Select, Switch } from "antd";
const { Option } = Select;

const DEFAULT_REGION_ID = "6a041b845a5ee14acc6f9de1";

const validateName = (value) => {
  return /^[A-Za-z\s]+$/.test(value);
};

const CreateDriver = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState({});

  // Regions from API
  const [regions, setRegions] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    midName: "",
    lastName: "",
    email: "",
    phone: "",
    alternatePhone: "",
    permanentAddress: "",
    currentAddress: "",
    licenseNumber: "",
    licenseExpiry: "",
    adhaarNumber: "",
    panNumber: "",
    policeVerificationExpiry: "",
    dateOfJoining: "",
    dateOfLeaving: "",
    dateOfLeavingReason: "",
    medicalCertificateIssue: "",
    medicalCertificateExpiry: "",
    medicalCertificatePhoto: "",
    isVerified: false,
    isOnline: false,
    isAvailable: false,
    region: DEFAULT_REGION_ID,
    state: "",
    city: "",
    pincode: "",
    grade: "A",
  });

  // File previews
  const [previews, setPreviews] = useState({
    profilePic: "",
    licensePhoto: "",
    adhaarFrontPhoto: "",
    adhaarBackPhoto: "",
    panFrontPhoto: "",
    panBackPhoto: "",
    policeVerificationPhoto: "",
    medicalCertificatePhoto: "",
  });

  // Fetch regions
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const res = await getAllRegions({ page: 1, rowsPerPage: 100 });
        if (res?.status) {
          setRegions(res.data || []);
        }
      } catch (err) {
        toast.error("Failed to load regions");
      }
    };
    fetchRegions();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      setPreviews((prev) => ({ ...prev, [name]: URL.createObjectURL(file) }));
      setFormData((prev) => ({ ...prev, [name]: file }));
    }
  };

  const renderPreviewFile = (field, altText) => {
    const file = formData[field];
    if (!file) return null;

    if (file.type === "application/pdf") {
      return (
        <div className="mt-2 mb-2 ml-2 p-3 border rounded bg-gray-100 text-sm text-gray-700">
          📄 {file.name}
        </div>
      );
    }

    return (
      <img
        src={previews[field]}
        alt={altText}
        className="h-16 w-24 object-cover rounded mt-2 mb-2 ml-2 border border-gray-300"
      />
    );
  };

  useEffect(() => {
    return () => {
      Object.values(previews).forEach((url) => {
        if (url && url.startsWith("blob:")) URL.revokeObjectURL(url);
      });
    };
  }, [previews]);

  const handleClear = () => {
    setFormData({
      name: "",
      midName: "",
      lastName: "",
      email: "",
      phone: "",
      alternatePhone: "",
      permanentAddress: "",
      currentAddress: "",
      licenseNumber: "",
      licenseExpiry: "",
      adhaarNumber: "",
      panNumber: "",
      policeVerificationExpiry: "",
      dateOfJoining: "",
      dateOfLeaving: "",
      dateOfLeavingReason: "",
      medicalCertificateIssue: "",
      medicalCertificateExpiry: "",
      medicalCertificatePhoto: "",
      isVerified: false,
      isOnline: false,
      isAvailable: false,
      region: DEFAULT_REGION_ID,
      state: "",
      city: "",
      pincode: "",
      grade: "A",
    });

    setPreviews({
      profilePic: "",
      licensePhoto: "",
      licenseBackPhoto: "",
      adhaarFrontPhoto: "",
      adhaarBackPhoto: "",
      panFrontPhoto: "",
      panBackPhoto: "",
      policeVerificationPhoto: "",
      medicalCertificatePhoto: "",
    });

    setApiError({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setApiError({});

    const errors = {};
    if (!formData.name.trim()) {
      errors.name = "First name is required";
    } else if (!/^[A-Za-z\s]+$/.test(formData.name.trim())) {
      errors.name = "First name can contain only letters";
    }

    if (formData.midName && !/^[A-Za-z\s]+$/.test(formData.midName.trim())) {
      errors.midName = "Middle name can contain only letters";
    }

    if (formData.lastName && !/^[A-Za-z\s]+$/.test(formData.lastName.trim())) {
      errors.lastName = "Last name can contain only letters";
    }
    if (!formData.name.trim()) errors.name = "Name is required.";
    if (!formData.phone) {
      errors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      errors.phone = "Phone number must be 10 digits";
    }
    // if (!formData.email.trim()) errors.email = "Email is required.";
    if (!formData.email.trim()) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = "Enter a valid email address (e.g. Ashwani@Manntours.com)";
    }
    if (formData.adhaarNumber && !/^\d{12}$/.test(formData.adhaarNumber)) {
      errors.adhaarNumber = "Aadhaar number must be exactly 12 digits";
    }

    const pan = (formData.panNumber || "").trim().toUpperCase();

    if (formData.panNumber?.trim()) {
      const pan = formData.panNumber.trim().toUpperCase();
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

      if (!panRegex.test(pan)) {
        errors.panNumber = "Invalid PAN format (e.g. ABCDE1234F)";
      }
    }
    if (formData.pincode) {
      const pin = formData.pincode.trim();
      const pinRegex = /^[1-9][0-9]{5}$/;

      if (!pinRegex.test(pin)) {
        errors.pincode =
          "Invalid PIN code (must be 6 digits, not starting with 0)";
      }
    }

    // if (Object.keys(errors).length > 0) {
    //   setApiError(errors);
    //   setLoading(false);
    //   return;
    // }
    if (Object.keys(errors).length > 0) {
      setApiError(errors);

      // Show first validation error in toast
      toast.error(Object.values(errors)[0]);

      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();

      Object.keys(formData).forEach((key) => {
        if (
          formData[key] !== null &&
          formData[key] !== undefined &&
          typeof formData[key] !== "object"
        ) {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (formData.profilePic)
        formDataToSend.append("profilePic", formData.profilePic);
      if (formData.licensePhoto)
        formDataToSend.append("licensePhoto", formData.licensePhoto);
      if (formData.licenseBackPhoto)
        formDataToSend.append("licenseBackPhoto", formData.licenseBackPhoto);
      if (formData.adhaarFrontPhoto)
        formDataToSend.append("adhaarFrontPhoto", formData.adhaarFrontPhoto);
      if (formData.adhaarBackPhoto)
        formDataToSend.append("adhaarBackPhoto", formData.adhaarBackPhoto);
      if (formData.panFrontPhoto)
        formDataToSend.append("panFrontPhoto", formData.panFrontPhoto);
      if (formData.panBackPhoto)
        formDataToSend.append("panBackPhoto", formData.panBackPhoto);
      if (formData.policeVerificationPhoto)
        formDataToSend.append(
          "policeVerificationPhoto",
          formData.policeVerificationPhoto,
        );
      if (formData.medicalCertificatePhoto)
        formDataToSend.append(
          "medicalCertificatePhoto",
          formData.medicalCertificatePhoto,
        );

      const res = await createDriverApi(formDataToSend);

      if (res?.status) {
        toast.success("Chauffeur created successfully!");
        navigate(-1);
      } else {
        const errorMsg = res?.message || "Failed to create chauffeur";
        toast.error(errorMsg);
      }
    } catch (error) {
      const errMsg =
        error?.response?.data?.message || error?.message || "Server error";
      console.error("Error creating chauffeur:", error);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="m-3">
      <div className="mb-4">
        <Breaker />
      </div>

      <div className="ml-5 mt-8 bg-white p-6 max-w-9xl rounded-xl shadow-xl">
        <form onSubmit={handleSubmit}>
          {/* Personal Info */}
          <label className="ml-2 mt-4 font-normal block">First Name *</label>
          <input
            className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
            type="text"
            name="name"
            placeholder="Enter full name"
            value={formData.name}
            // onChange={handleChange}
            onChange={(e) => {
              const value = e.target.value;

              if (value === "" || /^[A-Za-z\s]+$/.test(value)) {
                setFormData({ ...formData, name: value });
              } else {
                toast.error("First Name accepts letters only");
              }
            }}
          />
          {apiError.name && (
            <p className="text-red-500 text-sm ml-2">{apiError.name}</p>
          )}

          {/* middle name */}
          <label className="ml-2 mt-5 font-normal block">Middle Name</label>
          <input
            className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
            type="text"
            name="midName"
            placeholder="Enter middle name (optional)"
            value={formData.midName}
            // onChange={handleChange}
            onChange={(e) => {
              const value = e.target.value;

              if (value === "" || /^[A-Za-z\s]+$/.test(value)) {
                setFormData({ ...formData, midName: value });
              } else {
                toast.error("Middle Name accepts letters only");
              }
            }}
          />

          {/* last name */}
          <label className="ml-2 mt-5 font-normal block">Last Name</label>
          <input
            className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
            type="text"
            name="lastName"
            placeholder="Enter Last Name (optional)"
            value={formData.lastName}
            // onChange={handleChange}
            onChange={(e) => {
              const value = e.target.value;

              if (value === "" || /^[A-Za-z\s]+$/.test(value)) {
                setFormData({ ...formData, lastName: value });
              } else {
                toast.error("Last Name accepts letters only");
              }
            }}
          />

          <label className="ml-2 mt-5 font-normal block">Email *</label>
          <input
            className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
          />

          <label className="ml-2 mt-5 font-normal block">Phone Number *</label>
          <input
            className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
            type="tel"
            name="phone"
            placeholder="Enter phone number"
            value={formData.phone}
            maxLength={10}
            inputMode="numeric"
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, ""); // remove letters
              setFormData({ ...formData, phone: value });
            }}
          />

          {apiError.phone && (
            <p className="text-red-500 text-sm ml-2">{apiError.phone}</p>
          )}

          <label className="ml-2 mt-5 font-normal block">Alternate Phone</label>
          <input
            className={`w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500 ${apiError.alternatePhone ? "border-red-500" : "border-gray-500"
              }`}
            type="tel"
            name="alternatePhone"
            placeholder="Alternate phone (optional)"
            value={formData.alternatePhone}
            maxLength={10}
            inputMode="numeric"
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, ""); // remove non-digits
              setFormData({ ...formData, alternatePhone: value });
            }}
          />
          {apiError.alternatePhone && (
            <p className="text-red-500 text-sm ml-2">
              {apiError.alternatePhone}
            </p>
          )}

          {/* <label className="ml-2 mt-5 font-normal block">Region *</label>
                    <Select
                        value={formData.region}
                        onChange={(val) => setFormData({ ...formData, region: val })}
                        className="w-full h-10 mb-1 border rounded-xl"
                        placeholder="Select Region"
                        showSearch
                        optionFilterProp="children"
                    >
                        {regions.map((r) => (
                            <Option key={r._id} value={r._id}>
                                {r.name} ({r.state})
                            </Option>
                        ))}
                    </Select>
                    {apiError.region && <p className="text-red-500 text-sm ml-2">{apiError.region}</p>}
                       */}
          {/* state */}
          <label className="ml-2 mt-5 font-normal block">State</label>
          <input
            className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
            type="text"
            name="state"
            placeholder="Enter state"
            value={formData.state}
            onChange={handleChange}
          />

          {/* city */}
          <label className="ml-2 mt-5 font-normal block">City</label>
          <input
            className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
            type="text"
            name="city"
            placeholder="Enter city"
            value={formData.city}
            onChange={handleChange}
          />

          {/* pincode */}

          <label className="ml-2 mt-5 font-normal block">Pincode</label>
          <input
            className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
            type="text"
            name="pincode"
            placeholder="Enter pincode"
            value={formData.pincode}
            // onChange={handleChange}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");

              if (value.length <= 6) {
                setFormData({ ...formData, pincode: value });
              }
            }}
          />
          {apiError.pincode && (
            <p className="text-red-500 text-sm ml-2">{apiError.pincode}</p>
          )}

          {/* grade */}
          <label className="ml-2 mt-5 font-normal block">Grade</label>
          <Select
            value={formData.grade}
            onChange={(val) => setFormData({ ...formData, grade: val })}
            className="w-full h-10 mb-1 border rounded-xl"
          >
            <Option value="A">A</Option>
            <Option value="B">B</Option>
            <Option value="C">C</Option>
            <Option value="D">D</Option>
          </Select>

          {/* Addresses */}
          <label className="ml-2 mt-5 font-normal block">
            Permanent Address
          </label>
          <textarea
            className="w-full h-20 mb-1 border rounded-xl pl-4 pt-2 border-gray-500 resize-none"
            name="permanentAddress"
            placeholder="Permanent address"
            value={formData.permanentAddress}
            onChange={handleChange}
          />

          <label className="ml-2 mt-5 font-normal block">Current Address</label>
          <textarea
            className="w-full h-20 mb-1 border rounded-xl pl-4 pt-2 border-gray-500 resize-none"
            name="currentAddress"
            placeholder="Current address"
            value={formData.currentAddress}
            onChange={handleChange}
          />

          {/* License */}
          <label className="ml-2 mt-5 font-normal block">
            License Number *
          </label>
          <input
            className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
            type="text"
            name="licenseNumber"
            placeholder="Enter license number"
            value={formData.licenseNumber}
            onChange={handleChange}
          />
          {apiError.licenseNumber && (
            <p className="text-red-500 text-sm ml-2">
              {apiError.licenseNumber}
            </p>
          )}

          <label className="ml-2 mt-5 font-normal block">License Expiry</label>
          <input
            className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
            type="date"
            name="licenseExpiry"
            value={formData.licenseExpiry}
            onChange={handleChange}
          />

          <label className="ml-2 mt-5 font-normal block">
            License Front Photo
          </label>
          {renderPreviewFile("licensePhoto", "License Preview")}
          <label
            htmlFor="license-upload"
            className="flex items-center justify-center h-10 border border-gray-500 rounded-xl cursor-pointer bg-white hover:bg-gray-100 transition-colors px-4"
          >
            � Upload License Photo or PDF
          </label>
          <input
            id="license-upload"
            className="hidden"
            type="file"
            name="licensePhoto"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
          />
          {apiError.licensePhoto && (
            <p className="text-red-500 text-sm ml-2">{apiError.licensePhoto}</p>
          )}

          <label className="ml-2 mt-5 font-normal block">
            License Back Photo
          </label>
          {renderPreviewFile("licenseBackPhoto", "License Back Preview")}
          <label
            htmlFor="license-back-upload"
            className="flex items-center justify-center h-10 border border-gray-500 rounded-xl cursor-pointer bg-white hover:bg-gray-100 transition-colors px-4"
          >
            � Upload License Back Photo or PDF
          </label>
          <input
            id="license-back-upload"
            className="hidden"
            type="file"
            name="licenseBackPhoto"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
          />
          {apiError.licenseBackPhoto && (
            <p className="text-red-500 text-sm ml-2">
              {apiError.licenseBackPhoto}
            </p>
          )}

          {/* Aadhaar */}
          <label className="ml-2 mt-5 font-normal block">Aadhaar Number</label>
          <input
            className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
            type="text"
            name="adhaarNumber"
            placeholder="Enter Aadhaar number"
            maxLength={12}
            inputMode="numeric"
            value={formData.adhaarNumber}
            onChange={(e) => {
              const value = e.target.value;

              if (value === "" || /^\d*$/.test(value)) {
                setFormData({ ...formData, adhaarNumber: value });
              } else {
                toast.error("Aadhaar Number accepts digits only");
              }
            }}
          // onChange={handleChange}
          // onChange={(e) => {
          //   const value = e.target.value.replace(/\D/g, ""); // allow only digits
          //   setFormData({ ...formData, adhaarNumber: value });
          // }}
          />
          {apiError.adhaarNumber && (
            <p className="text-red-500 text-sm ml-2">{apiError.adhaarNumber}</p>
          )}

          <label className="ml-2 mt-5 font-normal block">
            Aadhaar Front Photo
          </label>
          {renderPreviewFile("adhaarFrontPhoto", "Aadhaar Front")}
          <label
            htmlFor="adhaar-front-upload"
            className="flex items-center justify-center h-10 border border-gray-500 rounded-xl cursor-pointer bg-white hover:bg-gray-100 transition-colors px-4"
          >
            � Upload Aadhaar Front Photo or PDF
          </label>
          <input
            id="adhaar-front-upload"
            className="hidden"
            type="file"
            name="adhaarFrontPhoto"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
          />
          {apiError.adhaarFrontPhoto && (
            <p className="text-red-500 text-sm ml-2">
              {apiError.adhaarFrontPhoto}
            </p>
          )}

          <label className="ml-2 mt-5 font-normal block">
            Aadhaar Back Photo
          </label>
          {renderPreviewFile("adhaarBackPhoto", "Aadhaar Back")}
          <label
            htmlFor="adhaar-back-upload"
            className="flex items-center justify-center h-10 border border-gray-500 rounded-xl cursor-pointer bg-white hover:bg-gray-100 transition-colors px-4"
          >
            � Upload Aadhaar Back Photo or PDF
          </label>
          <input
            id="adhaar-back-upload"
            className="hidden"
            type="file"
            name="adhaarBackPhoto"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
          />
          {apiError.adhaarBackPhoto && (
            <p className="text-red-500 text-sm ml-2">
              {apiError.adhaarBackPhoto}
            </p>
          )}

          {/* PAN */}
          <label className="ml-2 mt-5 font-normal block">PAN Number</label>
          <input
            className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
            type="text"
            name="panNumber"
            placeholder="Enter PAN number"
            value={formData.panNumber}
            // onChange={handleChange}
            onChange={(e) => {
              const value = e.target.value.toUpperCase();

              if (value === "" || /^[A-Z0-9]*$/.test(value)) {
                setFormData({ ...formData, panNumber: value });
              } else {
                toast.error("Only letters and numbers allowed in PAN");
              }
            }}
          />
          {apiError.panNumber && (
            <p className="text-red-500 text-sm ml-2">{apiError.panNumber}</p>
          )}

          <label className="ml-2 mt-5 font-normal block">PAN Front Photo</label>
          {renderPreviewFile("panFrontPhoto", "PAN Front")}
          <label
            htmlFor="pan-front-upload"
            className="flex items-center justify-center h-10 border border-gray-500 rounded-xl cursor-pointer bg-white hover:bg-gray-100 transition-colors px-4"
          >
            📎 Upload PAN Front Photo or PDF
          </label>
          <input
            id="pan-front-upload"
            className="hidden"
            type="file"
            name="panFrontPhoto"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
          />
          {apiError.panFrontPhoto && (
            <p className="text-red-500 text-sm ml-2">
              {apiError.panFrontPhoto}
            </p>
          )}

          <label className="ml-2 mt-5 font-normal block">PAN Back Photo</label>
          {renderPreviewFile("panBackPhoto", "PAN Back")}
          <label
            htmlFor="pan-back-upload"
            className="flex items-center justify-center h-10 border border-gray-500 rounded-xl cursor-pointer bg-white hover:bg-gray-100 transition-colors px-4"
          >
            📎 Upload PAN Back Photo or PDF
          </label>
          <input
            id="pan-back-upload"
            className="hidden"
            type="file"
            name="panBackPhoto"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
          />
          {apiError.panBackPhoto && (
            <p className="text-red-500 text-sm ml-2">{apiError.panBackPhoto}</p>
          )}

          {/* Police Verification */}
          <label className="ml-2 mt-5 font-normal block">
            Police Verification Expiry
          </label>
          <input
            className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
            type="date"
            name="policeVerificationExpiry"
            value={formData.policeVerificationExpiry}
            onChange={handleChange}
          />

          <label className="ml-2 mt-5 font-normal block">
            Police Verification Photo
          </label>
          {renderPreviewFile("policeVerificationPhoto", "Police Verification")}
          <label
            htmlFor="police-upload"
            className="flex items-center justify-center h-10 border border-gray-500 rounded-xl cursor-pointer bg-white hover:bg-gray-100 transition-colors px-4"
          >
            📎 Upload Police Verification Photo or PDF
          </label>
          <input
            id="police-upload"
            className="hidden"
            type="file"
            name="policeVerificationPhoto"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
          />

          <label className="ml-2 mt-5 font-normal block">
            Date of Joining
          </label>
          <input
            className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
            type="date"
            name="dateOfJoining"
            value={formData.dateOfJoining}
            onChange={handleChange}
          />

          <label className="ml-2 mt-5 font-normal block">
            Date of Leaving
          </label>
          <input
            className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
            type="date"
            name="dateOfLeaving"
            value={formData.dateOfLeaving}
            onChange={handleChange}
          />

          <label className="ml-2 mt-5 font-normal block">
            Leaving Reason
          </label>
          <textarea
            className="w-full h-20 mb-1 border rounded-xl pl-4 pt-2 border-gray-500 resize-none"
            name="dateOfLeavingReason"
            placeholder="Enter reason for leaving"
            value={formData.dateOfLeavingReason}
            onChange={handleChange}
          />

          <label className="ml-2 mt-5 font-normal block">
            Medical Certificate Issue
          </label>
          <input
            className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
            type="date"
            name="medicalCertificateIssue"
            value={formData.medicalCertificateIssue}
            onChange={handleChange}
          />

          <label className="ml-2 mt-5 font-normal block">
            Medical Certificate Expiry
          </label>
          <input
            className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
            type="date"
            name="medicalCertificateExpiry"
            value={formData.medicalCertificateExpiry}
            onChange={handleChange}
          />

          <label className="ml-2 mt-5 font-normal block">
            Medical Certificate Photo
          </label>
          {renderPreviewFile("medicalCertificatePhoto", "Medical Certificate")}
          <label
            htmlFor="medical-certificate-upload"
            className="flex items-center justify-center h-10 border border-gray-500 rounded-xl cursor-pointer bg-white hover:bg-gray-100 transition-colors px-4"
          >
            📎 Upload Medical Certificate Photo or PDF
          </label>
          <input
            id="medical-certificate-upload"
            className="hidden"
            type="file"
            name="medicalCertificatePhoto"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
          />

          {/* Profile Picture */}
          <label className="ml-2 mt-5 font-normal block">Profile Picture</label>
          {renderPreviewFile("profilePic", "Profile Preview")}
          <label
            htmlFor="profile-upload"
            className="flex items-center justify-center h-10 border border-gray-500 rounded-xl cursor-pointer bg-white hover:bg-gray-100 transition-colors px-4"
          >
            📎 Upload Profile Picture
          </label>
          <input
            id="profile-upload"
            className="hidden"
            type="file"
            name="profilePic"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
          />
          {apiError.profilePic && (
            <p className="text-red-500 text-sm ml-2">{apiError.profilePic}</p>
          )}

          {/* Status Toggles - Small & Professional */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="ml-2 font-normal block">Is Verified</label>
              <Switch
                checked={formData.isVerified}
                onChange={(checked) =>
                  setFormData({ ...formData, isVerified: checked })
                }
                checkedChildren="Yes"
                unCheckedChildren="No"
                size="default" // normal/small size
              />
              {apiError.isVerified && (
                <p className="text-red-500 text-sm ml-2">
                  {apiError.isVerified}
                </p>
              )}
            </div>

            <div>
              <label className="ml-2 font-normal block">Is Online</label>
              <Switch
                checked={formData.isOnline}
                onChange={(checked) =>
                  setFormData({ ...formData, isOnline: checked })
                }
                checkedChildren="Online"
                unCheckedChildren="Offline"
                size="default"
              />
              {apiError.isOnline && (
                <p className="text-red-500 text-sm ml-2">{apiError.isOnline}</p>
              )}
            </div>

            <div>
              <label className="ml-2 font-normal block">Is Available</label>
              <Switch
                checked={formData.isAvailable}
                onChange={(checked) =>
                  setFormData({ ...formData, isAvailable: checked })
                }
                checkedChildren="Available"
                unCheckedChildren="Busy"
                size="default"
              />
              {apiError.isAvailable && (
                <p className="text-red-500 text-sm ml-2">
                  {apiError.isAvailable}
                </p>
              )}
            </div>
          </div>

          {/* Submit */}

          <div className="flex justify-end gap-4 mt-8">
            {/* CLEAR */}
            <button
              type="button"
              onClick={handleClear}
              className=" bg-gray-500 text-white py-2 px-6 rounded-2xl"
            >
              Clear
            </button>

            {/* BACK */}
            <button
              type="button"
              onClick={() => navigate(-1)}
              className=" bg-gray-500 text-white  py-2 px-6 rounded-2xl"
            >
              Back
            </button>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-white py-2 px-6 rounded-2xl"
            >
              {loading ? "Creating..." : "Create Chauffeur"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDriver;
