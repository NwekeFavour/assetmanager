import React, { useContext, useEffect, useState, useCallback } from "react"; // Added useCallback
import Chart from "react-apexcharts";
import AuthContext from "../AuthContext";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export const data = {
  labels: ["Apple", "Knorr", "Shoop", "Green", "Purple", "Orange"],
  datasets: [
    {
      label: "# of Votes",
      data: [0, 1, 5, 8, 9, 15],
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(255, 159, 64, 0.2)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)",
      ],
      borderWidth: 1,
    },
  ],
};

function Dashboard() {
  const [saleAmount, setSaleAmount] = useState("");
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const authContext = useContext(AuthContext);

  const [chart, setChart] = useState({
    options: {
      chart: { id: "basic-bar" },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      },
    },
    series: [
      {
        name: "series",
        data: [10, 20, 40, 50, 60, 20, 10, 35, 45, 70, 25, 70],
      },
    ],
  });

  // Update Chart Data Helper
  const updateChartData = useCallback((salesData) => {
    setChart((prevChart) => ({
      ...prevChart,
      series: [
        {
          name: "Monthly Sales Amount",
          data: [...salesData],
        },
      ],
    }));
  }, []);

  // --- Fixed Fetch Functions with useCallback ---

  const fetchTotalSaleAmount = useCallback(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/sales/get/${authContext.user}/totalsaleamount`)
      .then((response) => response.json())
      .then((datas) => setSaleAmount(datas.totalSaleAmount))
      .catch((err) => console.log(err));
  }, [authContext.user]);

  const fetchTotalPurchaseAmount = useCallback(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/purchase/get/${authContext.user}/totalpurchaseamount`)
      .then((response) => response.json())
      .then((datas) => setPurchaseAmount(datas.totalPurchaseAmount))
      .catch((err) => console.log(err));
  }, [authContext.user]);

  const fetchStoresData = useCallback(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/store/get/${authContext.user}`)
      .then((response) => response.json())
      .then((datas) => setStores(datas))
      .catch((err) => console.log(err));
  }, [authContext.user]);

  const fetchProductsData = useCallback(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/product/get/${authContext.user}`)
      .then((response) => response.json())
      .then((datas) => setProducts(datas))
      .catch((err) => console.log(err));
  }, [authContext.user]);

  const fetchMonthlySalesData = useCallback(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/sales/getmonthly`)
      .then((response) => response.json())
      .then((datas) => updateChartData(datas.salesAmount))
      .catch((err) => console.log(err));
  }, [updateChartData]);

  useEffect(() => {
    fetchTotalSaleAmount();
    fetchTotalPurchaseAmount();
    fetchStoresData();
    fetchProductsData();
    fetchMonthlySalesData();
  }, [
    fetchTotalSaleAmount, 
    fetchTotalPurchaseAmount, 
    fetchStoresData, 
    fetchProductsData, 
    fetchMonthlySalesData
  ]);

  return (
    <div className="flex flex-col gap-8 p-4 sm:p-8">
      {/* Stat Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardStatCard 
          title="Sales" 
          value={`₦${saleAmount}`} 
          trend="67.81%" 
          trendUp={true} 
          subtext="from ₦240.94" 
        />
        <DashboardStatCard 
          title="Purchase" 
          value={`₦${purchaseAmount}`} 
          trend="67.81%" 
          trendUp={false} 
          subtext="from ₦404.32" 
        />
        <DashboardStatCard 
          title="Total Products" 
          value={products.length} 
          trend="Active" 
          trendUp={true} 
        />
        <DashboardStatCard 
          title="Total Stores" 
          value={stores.length} 
          trend="Online" 
          trendUp={true} 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 w-full">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm w-full">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">
            Monthly Revenue Flow
          </h3>
          <div className="h-[300px] w-full">
            <Chart
              options={{
                ...chart.options,
                colors: ['#8f5273'],
                plotOptions: { bar: { borderRadius: 8 } },
                chart: { ...chart.options.chart, toolbar: { show: false } }
              }}
              series={chart.series}
              type="bar"
              width="100%"
              height="100%"
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm w-full">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">
            Category Distribution
          </h3>
          <div className="h-[300px] w-full flex justify-center">
            <Doughnut 
              data={data} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, font: { weight: 'bold' } } } }
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable Stat Card Component for cleaner Dashboard code
function DashboardStatCard({ title, value, trend, trendUp, subtext }) {
  return (
    <article className="flex flex-col gap-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <div className={`inline-flex gap-2 self-end rounded-lg px-2 py-1 text-[10px] font-black uppercase tracking-wider ${trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
        <span>{trend}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d={trendUp ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"} />
        </svg>
      </div>
      <div>
        <strong className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">
          {title}
        </strong>
        <p className="mt-1">
          <span className="text-2xl font-black text-gray-900 tracking-tight">
            {value}
          </span>
          {subtext && <span className="ml-2 text-[10px] font-bold text-gray-400 italic block"> {subtext} </span>}
        </p>
      </div>
    </article>
  );
}

export default Dashboard;