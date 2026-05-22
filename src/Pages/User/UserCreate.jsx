// src/pages/User/CreateUser.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Breaker from "../../compoents/Breaker";
import Loader from "../../compoents/Loader";
import toast from "react-hot-toast";
import { createUserApi } from "../../Services/UserApi";

const CreateUser = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [apiError, setApiError] = useState({});

  const [preview, setPreview] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    gender: "",
    profilePic: "",
    professionalTitle: "",
    countryCode: "+91",
    dob: "",
    city: "",
  });

  // ─────────────────────────────────────
  // HANDLE INPUT
  // ─────────────────────────────────────

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // ─────────────────────────────────────
  // HANDLE FILE
  // ─────────────────────────────────────

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setFormData({
        ...formData,
        profilePic: file,
      });

      setPreview(URL.createObjectURL(file));
    }
  };

  // ─────────────────────────────────────
  // CLEANUP
  // ─────────────────────────────────────

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // ─────────────────────────────────────
  // VALIDATION
  // ─────────────────────────────────────

  const validateForm = () => {
    const errors = {};

    // NAME
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    // MOBILE
    if (!formData.mobile.trim()) {
      errors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      errors.mobile = "Mobile number must be 10 digits";
    }

    // EMAIL
    if (formData.email) {
      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(formData.email)) {
        errors.email = "Please enter valid email";
      }
    }

    setApiError(errors);

    return Object.keys(errors).length === 0;
  };

  // ─────────────────────────────────────
  // SUBMIT
  // ─────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    setApiError({});

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();

      Object.keys(formData).forEach((key) => {
        if (
          formData[key] !== null &&
          formData[key] !== undefined &&
          formData[key] !== ""
        ) {
          formDataToSend.append(
            key,
            formData[key]
          );
        }
      });

      const res = await createUserApi(
        formDataToSend,
        true
      );

      if (res?.status) {
        toast.success(
          "User created successfully!"
        );

        navigate(-1);
      } else {
        toast.error(
          res?.message ||
            "Failed to create user"
        );
      }
    } catch (err) {
      console.error(err);

      toast.error(
        err.message || "Server error"
      );
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────
  // CLEAR
  // ─────────────────────────────────────

  const handleClear = () => {
    setFormData({
      name: "",
      email: "",
      mobile: "",
      gender: "",
      profilePic: "",
      professionalTitle: "",
      countryCode: "+91",
      dob: "",
      city: "",
    });

    setPreview("");

    setApiError({});
  };

  // ─────────────────────────────────────
  // LOADER
  // ─────────────────────────────────────

  if (loading) return <Loader />;

  return (
    <div className="m-3">

      {/* BREAKER */}

      <div className="mb-4">
        <Breaker />
      </div>

      {/* CARD */}

      <div className=" bg-white p-6 w-full rounded-xl shadow-xl">
        {/* FORM */}

        <form onSubmit={handleSubmit}>

             {/* PROFESSIONAL TITLE */}

          <label className="ml-2 mt-5 block">
            Professional Title
          </label>

          <input
            className="w-full h-10 mb-1 border rounded-xl px-4 border-gray-400 text-sm outline-none focus:ring-2 focus:ring-primary"
            type="text"
            name="professionalTitle"
            placeholder="e.g. Doctor, Engineer"
            value={formData.professionalTitle}
            onChange={handleChange}
          />

          {/* NAME */}

          <label className="ml-2 mt-4 block">
            Full Name *
          </label>

          <input
            className="w-full h-10 mb-1 border rounded-xl px-4 border-gray-400 text-sm outline-none focus:ring-2 focus:ring-primary"
            type="text"
            name="name"
            placeholder="Enter full name"
            value={formData.name}
            onChange={handleChange}
          />

          {apiError.name && (
            <p className="text-red-500 text-sm ml-2">
              {apiError.name}
            </p>
          )}

          {/* EMAIL */}

          <label className="ml-2 mt-5 block">
            Email
          </label>

          <input
            className="w-full h-10 mb-1 border rounded-xl px-4 border-gray-400 text-sm outline-none focus:ring-2 focus:ring-primary"
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
          />

          {apiError.email && (
            <p className="text-red-500 text-sm ml-2">
              {apiError.email}
            </p>
          )}

          {/* MOBILE */}

          <label className="ml-2 mt-5 block">
            Mobile Number *
          </label>

          <div className="flex gap-3">

            <input
              className="w-24 h-10 border rounded-xl px-3 border-gray-400 text-sm outline-none"
              type="text"
              name="countryCode"
              value={formData.countryCode}
              onChange={handleChange}
            />

            <input
              className="flex-1 h-10 mb-1 border rounded-xl px-4 border-gray-400 text-sm outline-none focus:ring-2 focus:ring-primary"
              type="text"
              name="mobile"
              maxLength={10}
              placeholder="Enter 10 digit mobile number"
              value={formData.mobile}
              onChange={(e) => {
                const value =
                  e.target.value.replace(
                    /\D/g,
                    ""
                  );

                setFormData({
                  ...formData,
                  mobile: value,
                });
              }}
            />
          </div>

          {apiError.mobile && (
            <p className="text-red-500 text-sm ml-2 mt-1">
              {apiError.mobile}
            </p>
          )}

           {/* DOB */}

          <label className="ml-2 mt-5 block">
            Date of Birth
          </label>

          <input
            className="w-full h-10 mb-1 border rounded-xl px-4 border-gray-400 text-sm outline-none focus:ring-2 focus:ring-primary"
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
          />

          {/* CITY */}

          <label className="ml-2 mt-5 block">
            City
          </label>

          <input
            className="w-full h-10 mb-1 border rounded-xl px-4 border-gray-400 text-sm outline-none focus:ring-2 focus:ring-primary"
            type="text"
            name="city"
            placeholder="Enter city"
            value={formData.city}
            onChange={handleChange}
          />

          {/* GENDER */}

          <label className="ml-2 mt-5 block">
            Gender
          </label>

          <select
            className="w-full h-10 border rounded-xl px-4 border-gray-400 text-sm outline-none focus:ring-2 focus:ring-primary"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">
              Select Gender
            </option>

            <option value="male">
              Male
            </option>

            <option value="female">
              Female
            </option>

            <option value="other">
              Other
            </option>
          </select>

          {/* PROFILE PIC */}

          <label className="ml-2 mt-5 block">
            Profile Picture
          </label>

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="h-24 w-24 object-cover rounded-full mt-3 mb-3 ml-2 border shadow"
            />
          )}

          <label
            htmlFor="profile-upload"
            className="flex items-center justify-center h-10 border border-gray-400 rounded-xl cursor-pointer bg-white hover:bg-gray-100 px-4 text-sm"
          >
            🖼️ Upload Profile Picture
          </label>

          <input
            id="profile-upload"
            type="file"
            name="profilePic"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* BUTTONS */}

          <div className="flex justify-end gap-4 mt-8">

            {/* SUBMIT */}

            <button
              type="submit"
              className="bg-primary text-white py-2 px-6 rounded-2xl hover:scale-105 transition"
            >
              {loading
                ? "Creating..."
                : "Create User"}
            </button>

            {/* CLEAR */}

            <button
              type="button"
              onClick={handleClear}
              className="bg-gray-500 text-white py-2 px-6 rounded-2xl"
            >
              Clear
            </button>

            {/* BACK */}

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="bg-gray-700 text-white py-2 px-6 rounded-2xl"
            >
              Back
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;