import React, { useEffect, useState } from "react";
import { getDailyStatistics } from "../../../services/Api";
import { Line } from "react-chartjs-2";

import {
  Chart,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);
// import { Spinner } from "react-bootstrap";
const Dashboard = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReport = async () => {
      try {
        const response = await getDailyStatistics();
        setReport(response.data.data);
      } catch (error) {
        console.error("Failed to load report", error);
      } finally {
        setLoading(false);
      }
    };
    loadReport();
  }, []);
  const incomeLast7Days = [
    123123, 123456, 456123, 456789, 786456, 156789, 654789,
  ];
  const last7DaysLabels = [
    "26/04",
    "27/04",
    "28/04",
    "29/04",
    "30/04",
    "01/05",
    "02/05",
  ];

  // if (loading) {
  //   return <Spinner animation="border" variant="primary" />;
  // }

  // if (!report) {
  //   return <div className="alert alert-danger">Không có dữ liệu thống kê.</div>;
  // }

  return (
    <>
      <div className="container-fluid p-4">
        <h4 className="mb-4">Thống kê hôm nay</h4>
        <div className="row">
          <div className="col-md-3 mb-3">
            <div className="card text-white bg-primary">
              <div className="card-body">
                <h5 className="card-title">Lượt Check-in</h5>
                {/* <p className="card-text fs-4">{report.countCheckIn || 0}</p> */}
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card text-white bg-success">
              <div className="card-body">
                <h5 className="card-title">Lượt Check-out</h5>
                {/* <p className="card-text fs-4">{report.countCheckOut || 0}</p> */}
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card text-white bg-warning">
              <div className="card-body">
                <h5 className="card-title">Phòng còn trống </h5>
                <p className="card-text fs-4">
                  {/* {(report.incomeToday || 0).toLocaleString()}₫ */}
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card text-white bg-dark">
              <div className="card-body">
                <h5 className="card-title">Doanh thu hôm nay</h5>
                <p className="card-text fs-4">
                  {/* {(report.incomeYesterday || 0).toLocaleString()}₫ */}
                </p>
              </div>
            </div>
          </div>
        </div>

        <h4 className="my-3">Thống kê doanh thu</h4>
        <div className="row align-items-center align-items-stretch">
          <div className="col-md-8">
            <Line
              data={{
                labels: last7DaysLabels || [],
                datasets: [
                  {
                    label: "Doanh thu (VND)",
                    data: incomeLast7Days || [],
                    borderColor: "#dfa974",
                    backgroundColor: "rgba(223, 169, 116, 0.2)",
                    fill: origin,
                    tension: 0.4,
                    pointBackgroundColor: "#dfa974",
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (value) => value.toLocaleString() + "₫",
                    },
                  },
                },
              }}
            />
          </div>
          <div className="col-md-4 d-flex flex-column gap-3">
            <div className="card text-center shadow-sm my-2">
              <div className="card-body">
                <h6 className="mb-2">Khách đang lưu trú</h6>
                <p className="fs-4 fw-bold text-primary mb-0">12</p>
              </div>
            </div>

            <div className="card text-center shadow-sm my-4">
              <div className="card-body">
                <h6 className="mb-2">Đặt phòng hôm nay</h6>
                <p className="fs-4 fw-bold text-success mb-0">7</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
