import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AdminView = () => {
  const [pageViews, setPageViews] = useState([]);
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    const fetchPageViews = async () => {
      try {
        const response = await axios.get(
          "https://api.wisatawatuaji.com/api/page-views"
        );
        console.log("Response data:", response.data);

        if (Array.isArray(response.data)) {
          const formattedData = response.data.map((item) => {
            const date = new Date(item.date);
            const formattedDate = date.toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            });

            return {
              ...item,
              date: formattedDate,
            };
          });

          setPageViews(formattedData);

          const labels = formattedData.map((item) => item.date);
          const data = formattedData.map((item) => item.totalViews);

          setChartData({
            labels,
            datasets: [
              {
                label: "Page Views",
                data,
                borderColor: "rgba(75,192,192,1)",
                backgroundColor: "rgba(75,192,192,0.2)",
              },
            ],
          });
        } else {
          console.error("Data yang diterima bukan array:", response.data);
        }
      } catch (error) {
        console.error("Error fetching page views:", error);
      }
    };

    fetchPageViews();
  }, []);

  return (
    <div className="tables">
      <h2>Page Views</h2>
      {chartData.labels ? <Line data={chartData} /> : <p>Loading chart...</p>}
    </div>
  );
};

export default AdminView;
