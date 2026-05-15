// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import { getSingleDriver } from "../../Services/DriverApi";
// import Loader from "../../compoents/Loader";

// export default function DriverDetail() {

//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [driver, setDriver] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const fetchDriver = async () => {

//     try {

//       setLoading(true);

//       const result = await getSingleDriver(id);

//       if (result?.status) {
//         setDriver(result.data);
//       }

//     } catch (err) {
//       toast.error("Failed to load chauffeur details");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDriver();
//   }, []);

//   if (loading) return <Loader />;

//   if (!driver) return <div className="p-6">No Driver Found</div>;

//   return (

//     <div className="p-6 bg-gray-50 min-h-screen">

//       {/* HEADER */}

//       <div className="bg-gradient-to-r from-[#03045E] via-[#023E8A] to-[#0077B6] text-white p-5 rounded-xl shadow flex justify-between items-center">

//         <h2 className="text-xl font-semibold">Driver Details</h2>

//         <button
//           onClick={() => navigate(-1)}
//           className="bg-white text-[#03045E] px-4 py-2 rounded-lg font-medium"
//         >
//           Back
//         </button>

//       </div>

//       {/* PROFILE */}

//       <div className="bg-white mt-6 p-6 rounded-xl shadow">

//         <div className="flex items-center gap-6">

//           <img
//             src={driver.profilePic}
//             alt="profile"
//             className="w-28 h-28 rounded-full object-cover border"
//           />

//           <div>

//             <h3 className="text-2xl font-semibold text-gray-800">
//               {driver.name}
//             </h3>

//             <p className="text-gray-600">{driver.email}</p>
//             <p className="text-gray-600">{driver.phone}</p>

//             <span className={`mt-2 inline-block px-3 py-1 text-sm rounded-full ${
//               driver.isVerified
//                 ? "bg-green-100 text-green-700"
//                 : "bg-yellow-100 text-yellow-700"
//             }`}>
//               {driver.isVerified ? "Verified Driver" : "Not Verified"}
//             </span>

//           </div>

//         </div>

//       </div>

//       {/* BASIC DETAILS */}

//       <div className="grid grid-cols-2 gap-6 mt-6">

//         <div className="bg-white p-5 rounded-xl shadow">

//           <h4 className="font-semibold text-lg mb-3 text-[#03045E]">
//             Personal Information
//           </h4>

//           <p><b> Full Name:</b>  {`${driver.name || ""} ${driver.midName || ""} ${driver.lastName || ""}`}</p>
//           <p><b>Email:</b> {driver.email}</p>
//           <p><b>Phone:</b> {driver.phone}</p>
//           <p><b>Alternate Phone:</b> {driver.alternatePhone}</p>

//         </div>

//         <div className="bg-white p-5 rounded-xl shadow">

//           <h4 className="font-semibold text-lg mb-3 text-[#03045E]">
//             Address
//           </h4>

//           <p><b>Permanent Address:</b> {driver.permanentAddress}</p>
//           <p><b>Current Address:</b> {driver.currentAddress}</p>

//           <p>
//             <b>Region:</b> {driver?.region?.name} ({driver?.region?.state})
//           </p>
//           <p><b>State:</b> {driver.state}</p>
//           <p><b>City:</b> {driver.city}</p>
//           <p><b>Pincode:</b> {driver.pincode}</p>
//           <p><b>Grade:</b> {driver.grade}</p>

//         </div>

//       </div>

//       {/* LICENSE */}

//       <div className="bg-white p-5 rounded-xl shadow mt-6">

//         <h4 className="font-semibold text-lg mb-4 text-[#03045E]">
//           License Details
//         </h4>

//         <p><b>License Number:</b> {driver.licenseNumber}</p>
//         <p><b>Expiry Date:</b> {new Date(driver.licenseExpiry).toDateString()}</p>

//         <img
//           src={driver.licensePhoto}
//           className="w-48 mt-4 rounded-lg border"
//         />

//       </div>

//       {/* AADHAR */}

//       <div className="bg-white p-5 rounded-xl shadow mt-6">

//         <h4 className="font-semibold text-lg mb-4 text-[#03045E]">
//           Aadhaar Details
//         </h4>

//         <p><b>Aadhaar Number:</b> {driver.adhaarNumber}</p>

//         <div className="flex gap-6 mt-3">

//           <img
//             src={driver.adhaarFrontPhoto}
//             className="w-48 rounded-lg border"
//           />

//           <img
//             src={driver.adhaarBackPhoto}
//             className="w-48 rounded-lg border"
//           />

//         </div>

//       </div>

//       {/* PAN */}

//       <div className="bg-white p-5 rounded-xl shadow mt-6">

//         <h4 className="font-semibold text-lg mb-4 text-[#03045E]">
//           PAN Details
//         </h4>

//         <p><b>PAN Number:</b> {driver.panNumber}</p>

//         <div className="flex gap-6 mt-3">

//           <img
//             src={driver.panFrontPhoto}
//             className="w-48 rounded-lg border"
//           />

//           <img
//             src={driver.panBackPhoto}
//             className="w-48 rounded-lg border"
//           />

//         </div>

//       </div>

//       {/* POLICE VERIFICATION */}

//       <div className="bg-white p-5 rounded-xl shadow mt-6">

//         <h4 className="font-semibold text-lg mb-4 text-[#03045E]">
//           Police Verification
//         </h4>

//         <p>
//           <b>Expiry Date:</b>{" "}
//           {new Date(driver.policeVerificationExpiry).toDateString()}
//         </p>

//         <img
//           src={driver.policeVerificationPhoto}
//           className="w-48 mt-3 rounded-lg border"
//         />

//       </div>

//       {/* DRIVER STATS */}

//       <div className="grid grid-cols-3 gap-6 mt-6">

//         <div className="bg-white p-5 rounded-xl shadow text-center">
//           <h5 className="text-gray-500">Rating</h5>
//           <p className="text-2xl font-semibold">{driver.rating}</p>
//         </div>

//         <div className="bg-white p-5 rounded-xl shadow text-center">
//           <h5 className="text-gray-500">Total Rides</h5>
//           <p className="text-2xl font-semibold">{driver.totalRides}</p>
//         </div>

//         <div className="bg-white p-5 rounded-xl shadow text-center">
//           <h5 className="text-gray-500">Online Status</h5>
//           <p className="text-2xl font-semibold">
//             {driver.isOnline ? "Online" : "Offline"}
//           </p>
//         </div>

//       </div>

//     </div>

//   );

// }

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getSingleDriver } from "../../Services/DriverApi";
import Loader from "../../compoents/Loader";

export default function DriverDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(false);

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
  const handleDownloadImage = async (src, title) => {
    try {
      const response = await fetch(src);
      const blob = await response.blob();

      const objectUrl = window.URL.createObjectURL(blob);

      const extension = src.split(".").pop().split("?")[0] || "jpg";

      const fileName = `${title.replace(/\s+/g, "_").toLowerCase()}.${extension}`;

      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(objectUrl);

      toast.success("Image downloaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to download image");
    }
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
            <img
              src={driver.profilePic}
              alt="profile"
              className="w-28 h-28 rounded-full object-cover border"
            />
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
      {(driver.licenseNumber || driver.licenseExpiry || driver.licensePhoto) && (
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

          {/* {driver.licensePhoto && (
            <img
              src={driver.licensePhoto}
              className="w-48 mt-4 rounded-lg border"
              alt="license"
            />
          )} */}
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
                <div>
                  <img
                    src={driver.adhaarFrontPhoto}
                    className="w-48 rounded-lg border"
                    alt="aadhaar front"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      handleDownloadImage(driver.adhaarFrontPhoto, "aadhaar_front")
                    }
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Download
                  </button>
                </div>
              )}

              {/* {driver.adhaarBackPhoto && (
                <img
                  src={driver.adhaarBackPhoto}
                  className="w-48 rounded-lg border"
                  alt="aadhaar back"
                />
              )} */}
              {driver.adhaarBackPhoto && (
                <div>
                  <img
                    src={driver.adhaarBackPhoto}
                    className="w-48 rounded-lg border"
                    alt="aadhaar back"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      handleDownloadImage(driver.adhaarBackPhoto, "aadhaar_back")
                    }
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Download
                  </button>
                </div>
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
              <div>
                <img
                  src={driver.panFrontPhoto}
                  className="w-48 rounded-lg border"
                  alt="pan front"
                />

                <button
                  type="button"
                  onClick={() =>
                    handleDownloadImage(driver.panFrontPhoto, "pan_front")
                  }
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Download
                </button>
              </div>
            )}

            {/* {driver.panBackPhoto && (
              <img
                src={driver.panBackPhoto}
                className="w-48 rounded-lg border"
                alt="pan back"
              />
            )} */}
            {driver.panBackPhoto && (
              <div>
                <img
                  src={driver.panBackPhoto}
                  className="w-48 rounded-lg border"
                  alt="pan back"
                />

                <button
                  type="button"
                  onClick={() =>
                    handleDownloadImage(driver.panBackPhoto, "pan_back")
                  }
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Download
                </button>
              </div>
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
            <div className="mt-3">
              <img
                src={driver.policeVerificationPhoto}
                className="w-48 rounded-lg border"
                alt="police verification"
              />

              <button
                type="button"
                onClick={() =>
                  handleDownloadImage(
                    driver.policeVerificationPhoto,
                    "police_verification"
                  )
                }
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Download
              </button>
            </div>
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