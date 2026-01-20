import React, { useContext, useEffect, useState, useCallback } from "react";
import Chart from "react-apexcharts";
import AuthContext from "../AuthContext";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import {
  PlusIcon,
  TagIcon,
  UserPlusIcon,
  SquaresPlusIcon,
  ChevronRightIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import AddProduct from "../components/AddProduct";

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  const [products, setProducts] = useState([]);
  const authContext = useContext(AuthContext);
  const [showProductModal, setShowProductModal] = useState(false);
  const [chart, setChart] = useState({
    options: {
      chart: { id: "asset-growth", toolbar: { show: false } },
      colors: ["#8f5273"],
      plotOptions: { bar: { borderRadius: 6, columnWidth: "35%" } },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        labels: { style: { fontWeight: 600, colors: "#9ca3af" } },
      },
    },
    series: [{ name: "Inventory Value", data: new Array(12).fill(0) }],
  });

  const userId = authContext.user;
const fetchData = useCallback(() => {
  if (!userId) return;

  setIsLoading(true); // Assuming you have a loading state
  
  // Example API call - Update this URL to match your backend exactly
  fetch(`${process.env.REACT_APP_BACKEND_URL}/api/product/get/${userId}`)
    .then((response) => response.json())
    .then((data) => {
      // THIS IS THE KEY: update the products state
      setProducts(data);
      
      // If you have chart data logic, update it here as well
      // setChart(prev => ({ ...prev, series: [...] }));
    })
    .catch((err) => console.error("Error fetching dashboard data:", err))
    .finally(() => setIsLoading(false));

}, [userId]); // Use userId instead of the whole authContext object

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addProductModalSetting = () => {
    setShowProductModal(!showProductModal);
  };
  // --- DEFINE THIS RIGHT BEFORE THE RETURN ---
  const categoryData = {
    labels: [...new Set(products.map((p) => p.category || "Uncategorized"))],
    datasets: [
      {
        data: [...new Set(products.map((p) => p.category))].map(
          (cat) => products.filter((p) => p.category === cat).length,
        ),
        // Theme-consistent colors starting with your primary #8f5273
        backgroundColor: [
          "#8f5273",
          "#a6718f",
          "#5e344a",
          "#d9b3c7",
          "#452234",
        ],
        borderWidth: 0,
        hoverOffset: 10,
      },
    ],
  };
  return (
    <div className="flex flex-col gap-8 p-3 sm:p-6 bg-[#fafafa] min-h-screen">
      {/* 1. Welcome & Onboarding Header (Matches Image 2 Style) */}
      <section className="max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Welcome
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Complete all tasks to unlock your full analytics dashboard.
          </p>
        </div>

        {/* Task Grid */}
        <div className="space-y-8">
          {/* Category: Stay Organized */}
          <div>
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
              Stay organized
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <OnboardingCard
                icon={<PlusIcon className="h-5 w-5" />}
                title="Create your first asset"
                description="Each asset gets its own unique tracking profile and ID."
                actionText="New asset"
                completed={products.length > 0}
              />
              <OnboardingCard
                icon={<SquaresPlusIcon className="h-5 w-5" />}
                title="Create a custom category"
                description="View, edit or delete our default categories and build your own."
                actionText="New category"
              />
              <OnboardingCard
                icon={<TagIcon className="h-5 w-5" />}
                title="Create a tag"
                description="Tags are small pieces of information that can be added to assets."
                actionText="New tag"
              />
            </div>
          </div>

          {/* Category: Team & Custody */}
          <div>
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
              Team, custody and bookings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <OnboardingCard
                icon={<UserPlusIcon className="h-5 w-5" />}
                title="Add a team member"
                description="Track who has custody over an asset by adding your team members."
                actionText="New team member"
                completed={true} // Example of a completed state
              />
              <OnboardingCard
                icon={<SquaresPlusIcon className="h-5 w-5" />}
                title="Assign custody over an asset"
                description="View, edit or delete our default categories and build your own."
                actionText="Assign custody"
              />
            </div>
          </div>
        </div>

        <button className="mt-8 text-xs font-bold text-[#8f5273] hover:underline uppercase tracking-tighter">
          Skip tour, continue to dashboard
        </button>
      </section>

      {/* 2. Visual Data Section (Only visible or active once tasks are done) */}
      <hr className="border-gray-100" />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
              Inventory Turnover
            </h3>
            <span className="text-[10px] font-bold text-[#8f5273] bg-[#8f5273]/10 px-2 py-1 rounded-md">
              Live Data
            </span>
          </div>
          <Chart
            options={chart.options}
            series={chart.series}
            type="bar"
            height={300}
          />
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col min-h-[400px]">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">
            Asset Composition
          </h3>

          <div className="flex-1 flex flex-col items-center justify-center relative">
            {products.length > 0 ? (
              <div className="h-[300px] w-full">
                <Doughnut
                  data={categoryData}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "bottom",
                        labels: {
                          boxWidth: 10,
                          padding: 20,
                          font: { size: 10, weight: "700" },
                          color: "#9ca3af",
                        },
                      },
                    },
                  }}
                />
              </div>
            ) : (
              /* --- Empty State Placeholder --- */
              <div className="flex flex-col items-center animate-in fade-in zoom-in duration-700">
                {/* Decorative Ring with #8f5273 accents */}
                <div className="relative w-40 h-40 rounded-full border-[10px] border-gray-50 flex items-center justify-center mb-6">
                  <div className="w-24 h-24 rounded-full border-[10px] border-gray-50/50 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-[#8f5273]/20 animate-pulse"></div>
                  </div>
                  {/* Subtle Dash to simulate a chart starting to form */}
                  <div className="absolute inset-0 border-[10px] border-[#8f5273]/10 border-dashed rounded-full"></div>
                </div>

                <p className="text-gray-900 font-black text-sm tracking-tight uppercase">
                  Composition Unavailable
                </p>
                <p className="text-gray-400 font-bold text-[10px] tracking-tighter mt-1 text-center max-w-[180px]">
                  Categorize your assets to see your inventory distribution
                  here.
                </p>

                <button
                  onClick={addProductModalSetting}
                  className="mt-6 text-[10px] font-black text-[#8f5273] uppercase tracking-widest bg-[#8f5273]/5 px-4 py-2 rounded-lg hover:bg-[#8f5273]/10 transition-colors"
                >
                  + Add First Asset
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showProductModal && (
        <AddProduct 
          addProductModalSetting={addProductModalSetting} 
          handlePageUpdate={() => {
            /* your fetch logic to refresh data */
            fetchData(); 
            setShowProductModal(false);
          }} 
        />
      )}
    </div>
  );
}

// Sub-component for the Onboarding Cards
function OnboardingCard({ icon, title, description, actionText, completed }) {
  return (
    <div
      className={`group relative flex gap-4 p-5 bg-white border rounded-xl transition-all ${completed ? "border-[#8f5273] ring-1 ring-[#8f5273]/10" : "border-gray-100 hover:border-gray-200"}`}
    >
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${completed ? "bg-[#8f5273] text-white" : "bg-orange-50 text-orange-500"}`}
      >
        {completed ? <CheckCircleIcon className="h-6 w-6" /> : icon}
      </div>

      <div className="flex-1">
        <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          {title}
          {completed && (
            <span className="text-[9px] bg-[#8f5273]/10 text-[#8f5273] px-1.5 py-0.5 rounded uppercase">
              Done
            </span>
          )}
        </h4>
        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
          {description}
        </p>
        <button className="mt-3 text-[11px] font-black text-[#8f5273] uppercase tracking-tight flex items-center gap-1 group-hover:gap-2 transition-all">
          {actionText} <ChevronRightIcon className="h-3 w-3" />
        </button>
      </div>

      {completed && (
        <div className="absolute top-4 right-4">
          <div className="w-2 h-2 rounded-full bg-[#8f5273] animate-pulse"></div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
