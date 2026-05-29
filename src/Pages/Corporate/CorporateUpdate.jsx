import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Switch } from "antd";
import toast from "react-hot-toast";

import Breaker from "../../compoents/Breaker";
import Loader from "../../compoents/Loader";

import {
  getSingleCorporate,
  updateCorporate,
} from "../../Services/CorporateApi";

const industryOptions = [
  "IT",
  "Manufacturing",
  "Logistics",
  "Retail",
  "Healthcare",
  "Education",
  "Finance",
  "E-commerce",
  "Automotive",
  "Others",
];

const UpdateCorporate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const [apiError, setApiError] = useState({});

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    companyName: "",
    gstNumber: "",
    panNumber: "",
    companyPhone: "",
    website: "",
    industryType: "",

    isApproved: false,
    isActive: false,
    isVerified: false,

    companyAddress: {
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
    },

    contactPerson: {
      name: "",
      phone: "",
      designation: "",
    },
  });

  const [preview, setPreview] = useState("");
  const [existingImage, setExistingImage] = useState("");

  /* ======================================================
      FETCH SINGLE CORPORATE
  ====================================================== */

  useEffect(() => {
    const fetchCorporate = async () => {
      try {
        setPageLoading(true);

        const res = await getSingleCorporate(id);

        if (res?.status && res?.data) {
          const corporate = res.data;

          setFormData({
            userName: corporate.userName || "",
            email: corporate.email || "",
            companyName: corporate.companyName || "",
            gstNumber: corporate.gstNumber || "",
            panNumber: corporate.panNumber || "",
            companyPhone: corporate.companyPhone || "",
            website: corporate.website || "",
            industryType: corporate.industryType || "",

            isApproved: corporate.isApproved || false,
            isActive: corporate.isActive || false,
            isVerified: corporate.isVerified || false,

            companyAddress: {
              addressLine1:
                corporate.companyAddress?.addressLine1 || "",
              addressLine2:
                corporate.companyAddress?.addressLine2 || "",
              city: corporate.companyAddress?.city || "",
              state: corporate.companyAddress?.state || "",
              pincode:
                corporate.companyAddress?.pincode || "",
              country:
                corporate.companyAddress?.country || "",
            },

            contactPerson: {
              name: corporate.contactPerson?.name || "",
              phone: corporate.contactPerson?.phone || "",
              designation:
                corporate.contactPerson?.designation || "",
            },
          });

          setExistingImage(corporate.profileImage || "");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch corporate");
      } finally {
        setPageLoading(false);
      }
    };

    fetchCorporate();
  }, [id]);

  /* ======================================================
      HANDLE CHANGE
  ====================================================== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      companyAddress: {
        ...prev.companyAddress,
        [name]: value,
      },
    }));
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      contactPerson: {
        ...prev.contactPerson,
        [name]: value,
      },
    }));
  };

  /* ======================================================
      FILE CHANGE
  ====================================================== */

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setPreview(URL.createObjectURL(file));

      setFormData((prev) => ({
        ...prev,
        profileImage: file,
      }));
    }
  };

  /* ======================================================
      SUBMIT
  ====================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setApiError({});

    try {
      const errors = {};

      if (!formData.userName.trim()) {
        errors.userName = "User name is required";
      }

      if (!formData.email.trim()) {
        errors.email = "Email is required";
      }

      if (!formData.companyName.trim()) {
        errors.companyName = "Company name is required";
      }

      if (Object.keys(errors).length > 0) {
        setApiError(errors);
        setLoading(false);
        return;
      }

      const formDataToSend = new FormData();

      formDataToSend.append(
        "userName",
        formData.userName
      );

      formDataToSend.append("email", formData.email);

      formDataToSend.append(
        "companyName",
        formData.companyName
      );

      formDataToSend.append(
        "gstNumber",
        formData.gstNumber
      );

      formDataToSend.append(
        "panNumber",
        formData.panNumber
      );

      formDataToSend.append(
        "companyPhone",
        formData.companyPhone
      );

      formDataToSend.append(
        "website",
        formData.website
      );

      formDataToSend.append(
        "industryType",
        formData.industryType
      );

      formDataToSend.append(
        "isApproved",
        formData.isApproved
      );

      formDataToSend.append(
        "isActive",
        formData.isActive
      );

      formDataToSend.append(
        "isVerified",
        formData.isVerified
      );

      // ADDRESS
      formDataToSend.append(
        "companyAddress[addressLine1]",
        formData.companyAddress.addressLine1
      );

      formDataToSend.append(
        "companyAddress[addressLine2]",
        formData.companyAddress.addressLine2
      );

      formDataToSend.append(
        "companyAddress[city]",
        formData.companyAddress.city
      );

      formDataToSend.append(
        "companyAddress[state]",
        formData.companyAddress.state
      );

      formDataToSend.append(
        "companyAddress[pincode]",
        formData.companyAddress.pincode
      );

      formDataToSend.append(
        "companyAddress[country]",
        formData.companyAddress.country
      );

      // CONTACT PERSON
      formDataToSend.append(
        "contactPerson[name]",
        formData.contactPerson.name
      );

      formDataToSend.append(
        "contactPerson[phone]",
        formData.contactPerson.phone
      );

      formDataToSend.append(
        "contactPerson[designation]",
        formData.contactPerson.designation
      );

      // IMAGE
      if (formData.profileImage instanceof File) {
        formDataToSend.append(
          "profileImage",
          formData.profileImage
        );
      }

      const res = await updateCorporate(
        id,
        formDataToSend,
        true
      );

      if (res?.status) {
        toast.success("Corporate updated successfully");
        navigate(-1);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error?.message || "Failed to update corporate"
      );
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading || loading) return <Loader />;

  return (
    <div className="m-3">
      <div className="mb-4">
        <Breaker />
      </div>

      <div className="ml-5 mt-8 bg-white p-6 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold mb-6">
          Update Corporate
        </h2>

        <form onSubmit={handleSubmit}>
          {/* USER NAME */}
          <label className="block mb-2 ml-1">
            User Name *
          </label>

          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            placeholder="Enter user name"
            className="w-full h-11 border rounded-xl px-4"
          />

          {apiError.userName && (
            <p className="text-red-500 text-sm mt-1">
              {apiError.userName}
            </p>
          )}

          {/* EMAIL */}
          <label className="block mb-2 mt-5 ml-1">
            Email *
          </label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            className="w-full h-11 border rounded-xl px-4"
          />

          {/* COMPANY NAME */}
          <label className="block mb-2 mt-5 ml-1">
            Company Name *
          </label>

          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Enter company name"
            className="w-full h-11 border rounded-xl px-4"
          />

          {/* GST */}
          <label className="block mb-2 mt-5 ml-1">
            GST Number
          </label>

          <input
            type="text"
            name="gstNumber"
            value={formData.gstNumber}
            onChange={handleChange}
            placeholder="Enter GST number"
            className="w-full h-11 border rounded-xl px-4"
          />

          {/* PAN */}
          <label className="block mb-2 mt-5 ml-1">
            PAN Number
          </label>

          <input
            type="text"
            name="panNumber"
            value={formData.panNumber}
            onChange={handleChange}
            placeholder="Enter PAN number"
            className="w-full h-11 border rounded-xl px-4"
          />

          {/* PHONE */}
          <label className="block mb-2 mt-5 ml-1">
            Company Phone
          </label>

          <input
            type="text"
            name="companyPhone"
            value={formData.companyPhone}
            onChange={handleChange}
            placeholder="Enter company phone"
            className="w-full h-11 border rounded-xl px-4"
          />

          {/* WEBSITE */}
          <label className="block mb-2 mt-5 ml-1">
            Website
          </label>

          <input
            type="text"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="Enter website"
            className="w-full h-11 border rounded-xl px-4"
          />

          {/* INDUSTRY */}
          <label className="block mb-2 mt-5 ml-1">
            Industry Type
          </label>

          <select
            name="industryType"
            value={formData.industryType}
            onChange={handleChange}
            className="w-full h-11 border rounded-xl px-4"
          >
            <option value="">
              Select Industry Type
            </option>

            {industryOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          {/* PROFILE IMAGE */}
          <label className="block mb-2 mt-5 ml-1">
            Profile Image
          </label>

          {(preview || existingImage) && (
            <img
              src={preview || existingImage}
              alt="Corporate"
              className="w-24 h-24 object-cover rounded-xl border mb-3"
            />
          )}

          <label
            htmlFor="profileImage"
            className="h-11 border rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-100"
          >
            Upload / Replace Profile Image
          </label>

          <input
            id="profileImage"
            type="file"
            name="profileImage"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* ADDRESS SECTION */}
          <h3 className="text-xl font-semibold mt-8 mb-4">
            Company Address
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="addressLine1"
              value={
                formData.companyAddress.addressLine1
              }
              onChange={handleAddressChange}
              placeholder="Address Line 1"
              className="h-11 border rounded-xl px-4"
            />

            <input
              type="text"
              name="addressLine2"
              value={
                formData.companyAddress.addressLine2
              }
              onChange={handleAddressChange}
              placeholder="Address Line 2"
              className="h-11 border rounded-xl px-4"
            />

            <input
              type="text"
              name="city"
              value={formData.companyAddress.city}
              onChange={handleAddressChange}
              placeholder="City"
              className="h-11 border rounded-xl px-4"
            />

            <input
              type="text"
              name="state"
              value={formData.companyAddress.state}
              onChange={handleAddressChange}
              placeholder="State"
              className="h-11 border rounded-xl px-4"
            />

            <input
              type="text"
              name="pincode"
              value={
                formData.companyAddress.pincode
              }
              onChange={handleAddressChange}
              placeholder="Pincode"
              className="h-11 border rounded-xl px-4"
            />

            <input
              type="text"
              name="country"
              value={
                formData.companyAddress.country
              }
              onChange={handleAddressChange}
              placeholder="Country"
              className="h-11 border rounded-xl px-4"
            />
          </div>

          {/* CONTACT PERSON */}
          <h3 className="text-xl font-semibold mt-8 mb-4">
            Contact Person
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              name="name"
              value={formData.contactPerson.name}
              onChange={handleContactChange}
              placeholder="Contact Person Name"
              className="h-11 border rounded-xl px-4"
            />

            <input
              type="text"
              name="phone"
              value={formData.contactPerson.phone}
              onChange={handleContactChange}
              placeholder="Contact Phone"
              className="h-11 border rounded-xl px-4"
            />

            <input
              type="text"
              name="designation"
              value={
                formData.contactPerson.designation
              }
              onChange={handleContactChange}
              placeholder="Designation"
              className="h-11 border rounded-xl px-4"
            />
          </div>

          {/* STATUS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div>
              <label className="block mb-2">
                Is Approved
              </label>

              <Switch
                checked={formData.isApproved}
                onChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    isApproved: checked,
                  }))
                }
                checkedChildren="Yes"
                unCheckedChildren="No"
              />
            </div>

            <div>
              <label className="block mb-2">
                Is Active
              </label>

              <Switch
                checked={formData.isActive}
                onChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    isActive: checked,
                  }))
                }
                checkedChildren="Active"
                unCheckedChildren="Inactive"
              />
            </div>

            <div>
              <label className="block mb-2">
                Is Verified
              </label>

              <Switch
                checked={formData.isVerified}
                onChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    isVerified: checked,
                  }))
                }
                checkedChildren="Verified"
                unCheckedChildren="No"
              />
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-4 mt-10">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="bg-gray-500 text-white px-6 py-3 rounded-2xl"
            >
              Back
            </button>

            <button
              type="submit"
              className="bg-primary text-white px-6 py-3 rounded-2xl hover:scale-105 transition-all duration-300"
            >
              Update Corporate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateCorporate;