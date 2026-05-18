import * as React from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import Loader from "../../compoents/Loader";
import Breaker from "../../compoents/Breaker";
import toast from "react-hot-toast";
import { getVehicleById } from "../../Services/VehicleApi"; // assuming you have this function
import { format } from "date-fns"; // optional - for nice date formatting

export default function VehicleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth, loading: authLoading } = useAuth();

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVehicle = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const result = await getVehicleById(id);
        if (result?.status && result?.data) {
          setVehicle(result.data);
        } else {
          toast.error(result?.message || "Failed to load vehicle details");
          setError("Vehicle not found");
        }
      } catch (err) {
        console.error("Error fetching vehicle:", err);
        toast.error("Error loading vehicle details");
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading.profile && auth.user) {
      fetchVehicle();
    }
  }, [id, authLoading.profile, auth.user]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    try {
      return format(new Date(dateStr), "dd MMM yyyy");
    } catch {
      return dateStr;
    }
  };

  if (authLoading.profile || loading) return <Loader />;
  if (!auth.user) {
    navigate("/login");
    return null;
  }
  if (error || !vehicle) {
    return (
      <div className="p-6 text-center text-red-600 min-h-screen bg-gray-50">
        <h2 className="text-2xl font-bold">Error</h2>
        <p>{error || "Vehicle not found"}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <Breaker />
      </div>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Vehicle Details: {vehicle.carNumber || "—"}
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
        >
          Back 
        </button>
      </div>

      {/* Main Info Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
          Basic Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DetailItem label="Vehicle Number" value={vehicle.carNumber} />
          <DetailItem label="Brand" value={vehicle.brand} />
          <DetailItem label="Model" value={vehicle.model} />
          <DetailItem label="Year" value={vehicle.year} />
          <DetailItem label="Color" value={vehicle.color} />
          <DetailItem label="Fuel Type" value={vehicle.fuelType?.toUpperCase()} />
          <DetailItem label="Capacity" value={`${vehicle.capacity || "—"} Seats`} />
          <DetailItem label="Boot Space" value={vehicle.bootSpace} />
          <DetailItem
            label="Status"
            value={
              <span
                className={`inline-flex px-4 py-1 rounded-full text-sm font-medium ${
                  vehicle.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {vehicle.isActive ? "Active" : "Inactive"}
              </span>
            }
          />
          <DetailItem label="Created At" value={formatDate(vehicle.createdAt)} />
        </div>
      </div>

      {/* Driver & Segment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
            Chauffeur Information
          </h2>
          <div className="space-y-3">
            <DetailItem label="Name" value={vehicle.driver?.name} />
            <DetailItem label="Phone" value={vehicle.driver?.phone} />
            <DetailItem label="Email" value={vehicle.driver?.email} />
            <DetailItem label="Driver ID" value={vehicle.driver?._id} small />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
            Segment Information
          </h2>
          <div className="space-y-3">
            <DetailItem label="Name" value={vehicle.segment?.name} />
            <DetailItem label="Description" value={vehicle.segment?.description} />
            <DetailItem label="Max Capacity" value={`${vehicle.segment?.maxCapacity} Seats`} />
            {vehicle.segment?.image && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Segment Image</p>
                <img
                  src={vehicle.segment.image}
                  alt="Segment"
                  className="h-32 w-full object-cover rounded-md border"
                  onError={(e) => (e.target.src = "/assets/placeholder.png")}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Images Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">
          Vehicle Images & Documents
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {vehicle.carImage?.length > 0 && (
            <ImageCard title="Vehicle Images" images={vehicle.carImage} />
          )}
          {vehicle.certificatePhoto && (
            <ImageCard title="Certificate Photo" images={[vehicle.certificatePhoto]} />
          )}
          {vehicle.rcFrontPhoto && (
            <ImageCard title="RC Front" images={[vehicle.rcFrontPhoto]} />
          )}
          {vehicle.rcBackPhoto && (
            <ImageCard title="RC Back" images={[vehicle.rcBackPhoto]} />
          )}
          {vehicle.documentImage?.length > 0 && (
  <div className="flex flex-row gap-6 overflow-x-auto pb-2 whitespace-nowrap">
    {vehicle.documentImage.map((docImg, idx) => (
      <div key={idx} className="inline-block flex-shrink-0">
        <ImageCard
          title={`Document Image ${idx + 1}`}
          images={[docImg]}
        />
      </div>
    ))}
  </div>
)}
          {/* {vehicle.documentImage?.length > 0 && (
            <div className="flex flex-wrap gap-6 overflow-x-auto pb-2">
              {vehicle.documentImage.map((docImg, idx) => (
                <ImageCard
                  key={idx}
                  title={`Document Image ${idx + 1}`}
                  images={[docImg]}
                />
              ))}
            </div>
          )} */}
        </div>

        {(!vehicle.carImage?.length &&
          !vehicle.documentImage?.length &&
          !vehicle.certificatePhoto &&
          !vehicle.rcFrontPhoto &&
          !vehicle.rcBackPhoto) && (
          <p className="text-gray-500 text-center py-8">No images available</p>
        )}
      </div>

      {/* Documents & Expiry Dates */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
          Documents & Expiry Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DetailItem label="Rc Number" value={vehicle.certificateNumber} />
          <DetailItem label="Insurance Number" value={vehicle.insuranceNumber} />
          <DetailItem label="Pollution Number" value={vehicle.pollutionNumber} />
          <DetailItem label="Fitness Number" value={vehicle.fitnessNumber} />
          <DetailItem label=" All India Permit Number" value={vehicle.permitNumber} />
          {/* <DetailItem label="Certificate Expiry" value={formatDate(vehicle.certificateExpiry)} /> */}
          <DetailItem label="RC Issue Date" value={formatDate(vehicle.rcIssueDate)} />
          <DetailItem label="Insurance Expiry" value={formatDate(vehicle.insuranceExpiry)} />
          <DetailItem label="Pollution Expiry" value={formatDate(vehicle.pollutionExpiry)} />
          <DetailItem label="RC Expiry" value={formatDate(vehicle.rcExpeiry)} /> {/* note: typo in backend */}
          <DetailItem label="Insurance Issue Date" value={formatDate(vehicle.insuranceIssueDate)} />
          <DetailItem label="Pollution Start Date" value={formatDate(vehicle.pollutionStartDate)} />
          <DetailItem label="Pollution Expiry Date" value={formatDate(vehicle.pollutionExpiryDate)} />
          <DetailItem label="Fitness Start Date" value={formatDate(vehicle.fitnessStartDate)} />
          <DetailItem label="Fitness Expiry Date" value={formatDate(vehicle.fitnessExpiryDate)} />
          <DetailItem label="Permit Start Date" value={formatDate(vehicle.permitStartDate)} />
          <DetailItem label="Permit Expiry Date" value={formatDate(vehicle.permitExpiryDate)} />
        </div>
      </div>
    </div>
  );
}

// Reusable components
const DetailItem = ({ label, value, small = false }) => (
  <div>
    <p className="text-sm font-medium text-gray-600">{label}</p>
    <p className={`${small ? "text-sm" : "text-base"} font-medium text-gray-900 mt-1`}>
      {value || "—"}
    </p>
  </div>
);

const handleDownloadImage = async (src, title, idx) => {
  try {
    const response = await fetch(src);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const extensionMatch = src.split(".").pop().split(/[?#]/)[0] || "jpg";
    const fileName = `${title.replace(/\s+/g, "_").toLowerCase()}_${idx + 1}.${extensionMatch}`;
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(objectUrl);
  } catch (err) {
    console.error("Download failed", err);
    toast.error("Unable to download image");
  }
};

const ImageCard = ({ title, images, horizontal = false }) => (
  <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
    <div className="bg-gray-100 px-4 py-2 font-medium text-gray-700 text-center">
      {title}
    </div>
    <div className={`p-3 ${horizontal ? "flex gap-3 overflow-x-auto" : "grid grid-cols-1 gap-3"}`}>
      {images.map((img, idx) => (
        <div key={idx} className={`overflow-hidden rounded-md shadow-sm bg-white ${horizontal ? "min-w-[220px]" : ""}`}>
          <img
            src={img}
            alt={`${title} ${idx + 1}`}
            className="w-full h-40 object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = "/assets/placeholder.png";
              e.target.alt = "Image not available";
            }}
          />
          <div className="p-2 bg-gray-50 flex justify-end">
            <button
              type="button"
              onClick={() => handleDownloadImage(img, title, idx)}
              className="px-3 py-1 text-xs font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Download
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);