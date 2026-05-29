// CorporateView.jsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  BuildingOffice2Icon,
  UserIcon,
  GlobeAltIcon,
  PhoneIcon,
  EnvelopeIcon,
  IdentificationIcon,
  MapPinIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";

import Loader from "../../compoents/Loader";

import { getSingleCorporate } from "../../Services/CorporateApi";

export default function CorporateView() {
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  // FIRST LETTER CAPITAL
  const capitalize = (value) => {
    if (!value) return "N/A";

    return value
      .toString()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const fetchCorporate = async () => {
    try {
      setLoading(true);

      const result = await getSingleCorporate(id);

      if (result?.status) {
        setData(result.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCorporate();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* TOP CARD */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          {/* IMAGE */}
          <img
            src={data?.profileImage || "/no-image.png"}
            alt="profile"
            className="w-36 h-36 rounded-2xl object-cover border-4 border-blue-100"
          />

          {/* DETAILS */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {capitalize(data?.companyName)}
            </h1>

            <p className="text-gray-500 mb-1">
              {capitalize(data?.userName)}
            </p>

            <div className="flex flex-wrap gap-3 mt-4">
              <span
                className={`px-4 py-1 rounded-full text-sm font-medium ${
                  data?.isApproved
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {data?.isApproved
                  ? "Approved"
                  : "Pending"}
              </span>

              <span
                className={`px-4 py-1 rounded-full text-sm font-medium ${
                  data?.isActive
                    ? "bg-blue-100 text-blue-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {data?.isActive
                  ? "Active"
                  : "Inactive"}
              </span>

              <span
                className={`px-4 py-1 rounded-full text-sm font-medium ${
                  data?.isVerified
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {data?.isVerified
                  ? "Verified"
                  : "Unverified"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* COMPANY DETAILS */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-5">
            <BuildingOffice2Icon className="h-6 w-6 text-blue-600" />

            <h2 className="text-xl font-bold text-gray-800">
              Company Details
            </h2>
          </div>

          <div className="space-y-4">
            <DetailRow
              label="Company Name"
              value={capitalize(data?.companyName)}
            />

            <DetailRow
              label="Industry Type"
              value={capitalize(data?.industryType)}
            />

            <DetailRow
              label="Email"
              value={data?.email}
            />

            <DetailRow
              label="Phone"
              value={data?.companyPhone}
            />

            <DetailRow
              label="Website"
              value={data?.website}
            />

            <DetailRow
              label="GST Number"
              value={capitalize(data?.gstNumber)}
            />

            <DetailRow
              label="PAN Number"
              value={capitalize(data?.panNumber)}
            />

            <DetailRow
              label="Created At"
              value={capitalize(data?.createdAtIST)}
            />
          </div>
        </div>

        {/* CONTACT PERSON */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-5">
            <UserIcon className="h-6 w-6 text-green-600" />

            <h2 className="text-xl font-bold text-gray-800">
              Contact Person
            </h2>
          </div>

          <div className="space-y-4">
            <DetailRow
              label="Name"
              value={capitalize(
                data?.contactPerson?.name
              )}
            />

            <DetailRow
              label="Phone"
              value={data?.contactPerson?.phone}
            />

            <DetailRow
              label="Designation"
              value={capitalize(
                data?.contactPerson?.designation
              )}
            />
          </div>
        </div>

        {/* ADDRESS */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:col-span-2">
          <div className="flex items-center gap-2 mb-5">
            <MapPinIcon className="h-6 w-6 text-red-600" />

            <h2 className="text-xl font-bold text-gray-800">
              Company Address
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <DetailRow
              label="Address Line 1"
              value={capitalize(
                data?.companyAddress?.addressLine1
              )}
            />

            <DetailRow
              label="Address Line 2"
              value={capitalize(
                data?.companyAddress?.addressLine2
              )}
            />

            <DetailRow
              label="City"
              value={capitalize(
                data?.companyAddress?.city
              )}
            />

            <DetailRow
              label="State"
              value={capitalize(
                data?.companyAddress?.state
              )}
            />

            <DetailRow
              label="Country"
              value={capitalize(
                data?.companyAddress?.country
              )}
            />

            <DetailRow
              label="Pincode"
              value={capitalize(
                data?.companyAddress?.pincode
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* DETAIL ROW */
const DetailRow = ({ label, value }) => {
  return (
    <div className="border-b pb-3">
      <p className="text-sm text-gray-500 mb-1">
        {label}
      </p>

      <p className="text-base font-semibold text-gray-800 break-words">
        {value || "N/A"}
      </p>
    </div>
  );
};