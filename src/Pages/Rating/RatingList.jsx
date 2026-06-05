import * as React from "react";
import { useEffect, useState, useCallback } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import toast from "react-hot-toast";
import xlsx from "json-as-xlsx";

import { getAllRatings } from "../../Services/RatingApi";

export default function RatingList() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const res = await getAllRatings({ page, limit: rowsPerPage });

      if (res?.status) {
        setData(res.data || []);
        setTotalPages(Math.ceil(res.count / rowsPerPage));
      }
    } catch (err) {
      console.log(err);
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const exportExcel = () => {
    if (!data.length) return toast.error("No data to export");

    const settings = {
      fileName: "Ratings_List",
      writeMode: "writeFile",
    };

    const sheetData = [
      {
        sheet: "Ratings",
        columns: [
          { label: "Booking No", value: r => r.booking?.bookingNumber },
          { label: "User Name", value: r => r.user?.name },
          { label: "User Phone", value: r => r.user?.phone },
          { label: "Driver Name", value: r => r.driver?.name },
          { label: "Driver Phone", value: r => r.driver?.phone },
          { label: "User Rating", value: r => r.userRating },
          { label: "Driver Rating", value: r => r.driverRating },
          { label: "User Comment", value: r => r.userComment },
          { label: "Driver Comment", value: r => r.driverComment },
          {
            label: "Created At",
            value: r => new Date(r.createdAt).toLocaleString(),
          },
        ],
        content: data,
      },
    ];

    xlsx(sheetData, settings);
    toast.success("Exported successfully");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* EXPORT BUTTON */}
      <div className="flex justify-end mb-4">
        <button
          onClick={exportExcel}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Export Excel
        </button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Booking</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Driver</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Comment</TableCell>
              <TableCell>Created At</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.map((row) => (
              <TableRow key={row._id}>
                <TableCell>{row.booking?.bookingNumber}</TableCell>

                <TableCell>
                  {row.user?.name}
                  <br />
                  {row.user?.email}
                  <br />
                  {row.user?.mobile}
                </TableCell>

                <TableCell>
                  {row.driver?.name}
                  <br />
                  {row.user?.email}
                  <br />
                  {row.driver?.phone}
                </TableCell>

                <TableCell>
                  ⭐ {row.userRating || "-"} / {row.driverRating || "-"}
                </TableCell>

                <TableCell>
                  {row.userComment || "-"}
                </TableCell>

                <TableCell>
                  {new Date(row.createdAt).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack spacing={2} alignItems="center" mt={3}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(e, val) => setPage(val)}
        />
      </Stack>
    </div>
  );
}