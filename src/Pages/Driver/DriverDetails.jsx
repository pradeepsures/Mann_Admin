import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getSingleDriver, deleteDriverImage } from "../../Services/DriverApi";
import Loader from "../../compoents/Loader";

export default function DriverDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageDeleting, setImageDeleting] = useState(false);

  const fetchDriver = async () => {
    try {
      setLoading(true);
      const result = await getSingleDriver(id);

      if (result?.status) {
        setDriver(result.data);
      }
    } catch (err) {
      toast.error("Failed to load chauffeur details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDriver();
  }, []);

  /* image download  */
  // const handleDownloadImage = async (src, title) => {
  //   try {
  //     const response = await fetch(src);
  //     const blob = await response.blob();

  //     const objectUrl = window.URL.createObjectURL(blob);

  //     const extension = src.split(".").pop().split("?")[0] || "jpg";

  //     const fileName = `${title.replace(/\s+/g, "_").toLowerCase()}.${extension}`;

  //     const link = document.createElement("a");
  //     link.href = objectUrl;
  //     link.download = fileName;

  //     document.body.appendChild(link);
  //     link.click();

  //     document.body.removeChild(link);
  //     window.URL.revokeObjectURL(objectUrl);

  //     toast.success("Image downloaded successfully!");
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Failed to download image");
  //   }
  // };
const handleDownloadImage = async (src, title) => {
  const isPdf = /\.pdf(\?.*)?$/i.test(src);

  // PDF
  if (isPdf) {
    const link = document.createElement("a");
    link.href = src;
    link.target = "_blank";
    link.download = `${title}.pdf`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return;
  }

  // Images
  try {
    const response = await fetch(src);
    const blob = await response.blob();

    const objectUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = title;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(objectUrl);
  } catch (err) {
    console.error(err);
    toast.error("Failed to download file");
  }
};

  const handleDeleteImage = async (field) => {
    if (!field) return;
    if (!window.confirm("Delete this image?")) return;

    try {
      setImageDeleting(true);
      const result = await deleteDriverImage(id, field);

      if (result?.status) {
        toast.success("Image deleted successfully");
        setDriver((prev) => {
          if (!prev) return prev;
          const next = { ...prev };
          next[field] = null;
          return next;
        });
      } else {
        toast.error(result?.message || "Failed to delete image");
      }
    } catch (error) {
      console.error("Delete image failed:", error);
      toast.error(error.message || "Failed to delete image");
    } finally {
      setImageDeleting(false);
    }
  };

  const isImageUrl = (src) => /\.(jpe?g|png|gif|bmp|webp|svg)(\?.*)?$/i.test(src || "");
  const getFileName = (src) => {
    if (!src) return "file";
    return src.split("/").pop().split("?")[0] || "file";
  };

  const MediaPreview = ({ src, alt, title, downloadName, onDeleteField, disabled }) => {
    if (!src) return null;

    const isImage = isImageUrl(src);

    return (
      <div className="mt-4">
        {isImage ? (
          <img
            src={src}
            alt={alt}
            className="w-48 rounded-lg border"
            onError={(e) => {
              e.target.src = "/assets/placeholder.png";
              e.target.alt = "Image not available";
            }}
          />
        ) : (
          <div className="w-48 h-48 rounded-lg border bg-gray-100 flex flex-col items-center justify-center p-4 text-center text-gray-700">
            <div className="text-4xl">📄</div>
            <p className="mt-2 text-sm font-medium">{title}</p>
            <p className="mt-1 text-xs text-gray-500 break-all">{getFileName(src)}</p>
          </div>
        )}

        <div className="flex gap-2 mt-2">
          <button
            type="button"
            onClick={() => handleDownloadImage(src, downloadName)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Download
          </button>
          {onDeleteField && (
            <button
              type="button"
              onClick={() => handleDeleteImage(onDeleteField)}
              disabled={disabled}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    );
  };

  if (loading) return <Loader />;
  if (!driver) return <div className="p-6">No Driver Found</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-[#03045E] via-[#023E8A] to-[#0077B6] text-white p-5 rounded-xl shadow flex justify-between items-center">
        <h2 className="text-xl font-semibold">Driver Details</h2>
        <button
          onClick={() => navigate(-1)}
          className="bg-white text-[#03045E] px-4 py-2 rounded-lg font-medium"
        >
          Back
        </button>
      </div>

      {/* PROFILE */}
      <div className="bg-white mt-6 p-6 rounded-xl shadow">
        <div className="flex items-center gap-6">

          {driver.profilePic && (
            <div className="relative flex flex-col items-center gap-2">
              {isImageUrl(driver.profilePic) ? (
                <img
                  src={driver.profilePic}
                  alt="profile"
                  className="w-28 h-28 rounded-full object-cover border"
                />
              ) : (
                <div className="w-28 h-28 rounded-full border bg-gray-100 flex items-center justify-center text-gray-700 text-3xl">
                  📄
                </div>
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleDownloadImage(driver.profilePic, "profile_pic")}
                  className="px-2 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700"
                >
                  Download
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteImage("profilePic")}
                  disabled={imageDeleting}
                  className="px-2 py-1 bg-red-600 text-white text-xs rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Delete
                </button>
              </div>
            </div>
          )}

          <div>
            {driver.name && (
              <h3 className="text-2xl font-semibold text-gray-800">
                {driver.name}
              </h3>
            )}

            {driver.email && <p className="text-gray-600">{driver.email}</p>}
            {driver.phone && <p className="text-gray-600">{driver.phone}</p>}

            {driver.isVerified !== undefined && (
              <span
                className={`mt-2 inline-block px-3 py-1 text-sm rounded-full ${driver.isVerified
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
                  }`}
              >
                {driver.isVerified ? "Verified Driver" : "Not Verified"}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* BASIC DETAILS */}
      <div className="grid grid-cols-2 gap-6 mt-6">

        <div className="bg-white p-5 rounded-xl shadow">
          <h4 className="font-semibold text-lg mb-3 text-[#03045E]">
            Personal Information
          </h4>

          {(driver.name || driver.midName || driver.lastName) && (
            <p>
              <b>Full Name:</b>{" "}
              {[driver.name, driver.midName, driver.lastName]
                .filter(Boolean)
                .join(" ")}
            </p>
          )}

          {driver.email && <p><b>Email:</b> {driver.email}</p>}
          {driver.phone && <p><b>Phone:</b> {driver.phone}</p>}
          {driver.alternatePhone && (
            <p><b>Alternate Phone:</b> {driver.alternatePhone}</p>
          )}
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h4 className="font-semibold text-lg mb-3 text-[#03045E]">
            Address
          </h4>

          {driver.permanentAddress && (
            <p><b>Permanent Address:</b> {driver.permanentAddress}</p>
          )}

          {driver.currentAddress && (
            <p><b>Current Address:</b> {driver.currentAddress}</p>
          )}

          {(driver?.region?.name || driver?.region?.state) && (
            <p>
              <b>Region:</b>{" "}
              {driver?.region?.name} {driver?.region?.state && `(${driver.region.state})`}
            </p>
          )}

          {driver.state && <p><b>State:</b> {driver.state}</p>}
          {driver.city && <p><b>City:</b> {driver.city}</p>}
          {driver.pincode && <p><b>Pincode:</b> {driver.pincode}</p>}
          {driver.grade && <p><b>Grade:</b> {driver.grade}</p>}
        </div>
      </div>

      {/* LICENSE */}
      {/* {(driver.licenseNumber || driver.licenseExpiry || driver.licensePhoto) && (
        <div className="bg-white p-5 rounded-xl shadow mt-6">
          <h4 className="font-semibold text-lg mb-4 text-[#03045E]">
            License Details
          </h4>

          {driver.licenseNumber && (
            <p><b>License Number:</b> {driver.licenseNumber}</p>
          )}

          {driver.licenseExpiry && (
            <p>
              <b>Expiry Date:</b>{" "}
              {new Date(driver.licenseExpiry).toDateString()}
            </p>
          )}

          {driver.licensePhoto && (
            <div className="mt-4">
              <img
                src={driver.licensePhoto}
                className="w-48 rounded-lg border"
                alt="license"
              />

              <button
                type="button"
                onClick={() => handleDownloadImage(driver.licensePhoto, "license_photo")}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Download
              </button>
            </div>
          )}
        </div>
      )} */}

      {(driver.licenseNumber || driver.licenseExpiry || driver.licensePhoto || driver.licenseBackPhoto) && (
        <div className="bg-white p-5 rounded-xl shadow mt-6">
          <h4 className="font-semibold text-lg mb-4 text-[#03045E]">
            License Details
          </h4>

          {driver.licenseNumber && (
            <p><b>License Number:</b> {driver.licenseNumber}</p>
          )}

          {driver.licenseExpiry && (
            <p>
              <b>Expiry Date:</b>{" "}
              {new Date(driver.licenseExpiry).toDateString()}
            </p>
          )}

          {/* FRONT */}
          {driver.licensePhoto && (
            <MediaPreview
              src={driver.licensePhoto}
              alt="license front"
              title="License Front"
              downloadName="license_front"
              onDeleteField="licensePhoto"
              disabled={imageDeleting}
            />
          )}

          {/* BACK (NEW) */}
          {driver.licenseBackPhoto && (
            <MediaPreview
              src={driver.licenseBackPhoto}
              alt="license back"
              title="License Back"
              downloadName="license_back"
              onDeleteField="licenseBackPhoto"
              disabled={imageDeleting}
            />
          )}
        </div>
      )}

      {/* AADHAR */}
      {(driver.adhaarNumber ||
        driver.adhaarFrontPhoto ||
        driver.adhaarBackPhoto) && (
          <div className="bg-white p-5 rounded-xl shadow mt-6">
            <h4 className="font-semibold text-lg mb-4 text-[#03045E]">
              Aadhaar Details
            </h4>

            {driver.adhaarNumber && (
              <p><b>Aadhaar Number:</b> {driver.adhaarNumber}</p>
            )}

            <div className="flex gap-6 mt-3">
              {/* {driver.adhaarFrontPhoto && (
                <img
                  src={driver.adhaarFrontPhoto}
                  className="w-48 rounded-lg border"
                  alt="aadhaar front"
                />
              )} */}
              {driver.adhaarFrontPhoto && (
                <MediaPreview
                  src={driver.adhaarFrontPhoto}
                  alt="aadhaar front"
                  title="Aadhaar Front"
                  downloadName="aadhaar_front"
                  onDeleteField="adhaarFrontPhoto"
                  disabled={imageDeleting}
                />
              )}

              {/* {driver.adhaarBackPhoto && (
                <img
                  src={driver.adhaarBackPhoto}
                  className="w-48 rounded-lg border"
                  alt="aadhaar back"
                />
              )} */}
              {driver.adhaarBackPhoto && (
                <MediaPreview
                  src={driver.adhaarBackPhoto}
                  alt="aadhaar back"
                  title="Aadhaar Back"
                  downloadName="aadhaar_back"
                  onDeleteField="adhaarBackPhoto"
                  disabled={imageDeleting}
                />
              )}
            </div>
          </div>
        )}

      {/* PAN */}
      {(driver.panNumber || driver.panFrontPhoto || driver.panBackPhoto) && (
        <div className="bg-white p-5 rounded-xl shadow mt-6">
          <h4 className="font-semibold text-lg mb-4 text-[#03045E]">
            PAN Details
          </h4>

          {driver.panNumber && (
            <p><b>PAN Number:</b> {driver.panNumber}</p>
          )}

          <div className="flex gap-6 mt-3">
            {/* {driver.panFrontPhoto && (
              <img
                src={driver.panFrontPhoto}
                className="w-48 rounded-lg border"
                alt="pan front"
              />
            )} */}
            {driver.panFrontPhoto && (
              <MediaPreview
                src={driver.panFrontPhoto}
                alt="pan front"
                title="PAN Front"
                downloadName="pan_front"
                onDeleteField="panFrontPhoto"
                disabled={imageDeleting}
              />
            )}

            {/* {driver.panBackPhoto && (
              <img
                src={driver.panBackPhoto}
                className="w-48 rounded-lg border"
                alt="pan back"
              />
            )} */}
            {driver.panBackPhoto && (
              <MediaPreview
                src={driver.panBackPhoto}
                alt="pan back"
                title="PAN Back"
                downloadName="pan_back"
                onDeleteField="panBackPhoto"
                disabled={imageDeleting}
              />
            )}
          </div>
        </div>
      )}

      {/* POLICE VERIFICATION */}
      {(driver.policeVerificationExpiry || driver.policeVerificationPhoto) && (
        <div className="bg-white p-5 rounded-xl shadow mt-6">
          <h4 className="font-semibold text-lg mb-4 text-[#03045E]">
            Police Verification
          </h4>

          {driver.policeVerificationExpiry && (
            <p>
              <b>Expiry Date:</b>{" "}
              {new Date(driver.policeVerificationExpiry).toDateString()}
            </p>
          )}

          {/* {driver.policeVerificationPhoto && (
            <img
              src={driver.policeVerificationPhoto}
              className="w-48 mt-3 rounded-lg border"
              alt="police verification"
            />
          )} */}
          {driver.policeVerificationPhoto && (
            <MediaPreview
              src={driver.policeVerificationPhoto}
              alt="police verification"
              title="Police Verification"
              downloadName="police_verification"
              onDeleteField="policeVerificationPhoto"
              disabled={imageDeleting}
            />
          )}
        </div>
      )}

      {/* STATS */}
      <div className="grid grid-cols-3 gap-6 mt-6">

        {driver.rating !== undefined && (
          <div className="bg-white p-5 rounded-xl shadow text-center">
            <h5 className="text-gray-500">Rating</h5>
            <p className="text-2xl font-semibold">{driver.rating}</p>
          </div>
        )}

        {driver.totalRides !== undefined && (
          <div className="bg-white p-5 rounded-xl shadow text-center">
            <h5 className="text-gray-500">Total Rides</h5>
            <p className="text-2xl font-semibold">{driver.totalRides}</p>
          </div>
        )}

        {driver.isOnline !== undefined && (
          <div className="bg-white p-5 rounded-xl shadow text-center">
            <h5 className="text-gray-500">Online Status</h5>
            <p className="text-2xl font-semibold">
              {driver.isOnline ? "Online" : "Offline"}
            </p>
          </div>
        )}

      </div>

    </div>
  );
}