import React, { useContext, useEffect, useState, useCallback } from "react";
import Chart from "react-apexcharts";
import AuthContext from "../AuthContext";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  const [stockValue, setStockValue] = useState(0);
  const [outOfStock, setOutOfStock] = useState(0);
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const authContext = useContext(AuthContext);

  const [chart, setChart] = useState({
    options: {
      chart: { id: "asset-growth", toolbar: { show: false } },
      colors: ['#8f5273'],
      plotOptions: { bar: { borderRadius: 8, columnWidth: '40%' } },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        labels: { style: { fontWeight: 700 } }
      },
    },
    series: [{ name: "Inventory Value", data: [] }],
  });

  // 1. Fetch Total Inventory Valuation (Sum of Price * Quantity)
  const fetchInventoryValuation = useCallback(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/product/get/${authContext.user}/valuation`)
      .then((res) => res.json())
      .then((data) => {
        setStockValue(data.totalValue || 0);
        
        // If your API returns monthly data (e.g., data.monthlyValues = [10, 20, 15...])
        // We update the chart series here
        if (data.monthlyValues) {
          setChart(prev => ({
            ...prev,
            series: [{ ...prev.series[0], data: data.monthlyValues }]
          }));
        }
      })
      .catch((err) => console.error("Valuation Error:", err));
  }, [authContext.user]);

  // 2. Fetch Low Stock/Out of Stock Count
  const fetchStockAlerts = useCallback(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/product/get/${authContext.user}/lowstock`)
      .then((res) => res.json())
      .then((data) => setOutOfStock(data.count || 0))
      .catch((err) => console.error("Alerts Error:", err));
  }, [authContext.user]);

  const fetchStoresData = useCallback(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/store/get/${authContext.user}`)
      .then((res) => res.json())
      .then((datas) => setStores(datas))
      .catch((err) => console.log(err));
  }, [authContext.user]);

  const fetchProductsData = useCallback(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/product/get/${authContext.user}`)
      .then((res) => res.json())
      .then((datas) => setProducts(datas))
      .catch((err) => console.log(err));
  }, [authContext.user]);

  useEffect(() => {
    fetchInventoryValuation();
    fetchStockAlerts();
    fetchStoresData();
    fetchProductsData();
  }, [fetchInventoryValuation, fetchStockAlerts, fetchStoresData, fetchProductsData]);


  useEffect(() => {
    if (products.length > 0) {
      // Dummy logic: filling the last month with current stock value for visual impact
      const dummyMonthlyData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, stockValue];
      setChart(prev => ({
        ...prev,
        series: [{ ...prev.series[0], data: dummyMonthlyData }]
      }));
    }
  }, [products, stockValue]);
  // Dynamic Doughnut Data based on actual Product Categories
  const categoryData = {
    labels: [...new Set(products.map(p => p.category || "Uncategorized"))],
    datasets: [{
      data: [...new Set(products.map(p => p.category))].map(cat => 
        products.filter(p => p.category === cat).length
      ),
      backgroundColor: ["#8f5273", "#b37b9a", "#5e344a", "#d9b3c7", "#452234"],
      borderWidth: 0,
    }]
  };

  return (
    <div className="flex flex-col gap-8 p-4 sm:p-8">
      {/* Asset Management Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardStatCard 
          title="Total Inventory Value" 
          value={`₦${stockValue.toLocaleString()}`} 
          trend="Valuation" 
          trendUp={true} 
          subtext="Total Asset Worth" 
        />
        <DashboardStatCard 
          title="Stock Alerts" 
          value={outOfStock} 
          trend="Critical" 
          trendUp={false} 
          subtext="Low/Out of Stock" 
        />
        <DashboardStatCard 
          title="Total SKUs" 
          value={products.length} 
          trend="Items" 
          trendUp={true} 
          subtext="Unique Asset Types"
        />
        <DashboardStatCard 
          title="Storage Nodes" 
          value={stores.length} 
          trend="Active" 
          trendUp={true} 
          subtext="Active Warehouses"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 w-full">
        {/* Main Asset Flow Chart */}
        <div className="xl:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">
            Inventory Turnover Trends
          </h3>
          <div className="h-[350px] w-full">
            <Chart options={chart.options} series={chart.series} type="bar" width="100%" height="100%" />
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">
            Asset Composition
          </h3>
          
          <div className="h-[300px] w-full flex flex-col justify-center items-center relative">
            {products.length > 0 ? (
              <Doughnut 
                data={categoryData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { 
                    legend: { 
                      position: 'bottom', 
                      labels: { boxWidth: 12, font: { weight: 'bold' }, padding: 20 } 
                    } 
                  }
                }} 
              />
            ) : (
              /* --- Empty State Placeholder --- */
              <div className="flex flex-col items-center animate-in fade-in duration-700">
                {/* Decorative Ring Placeholder */}
                <div className="relative w-40 h-40 rounded-full border-[12px] border-gray-50 flex items-center justify-center mb-6">
                  <div className="w-24 h-24 rounded-full border-[12px] border-gray-50/50"></div>
                  <div className="absolute inset-0 border-[12px] border-dashed border-gray-100 rounded-full"></div>
                </div>
                
                <p className="text-gray-900 font-black text-sm tracking-tight uppercase">No Assets Logged</p>
                <p className="text-gray-400 font-bold text-[10px] tracking-tighter mt-1">Add items to see category breakdown</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardStatCard({ title, value, trend, trendUp, subtext }) {
  return (
    <article className="flex flex-col gap-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <div className={`inline-flex gap-2 self-start rounded-lg px-2 py-1 text-[10px] font-black uppercase tracking-wider ${trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
        <span>{trend}</span>
      </div>
      <div>
        <strong className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">{title}</strong>
        <p className="mt-1">
          <span className="text-2xl font-black text-gray-900 tracking-tight">{value}</span>
          {subtext && <span className="text-[10px] font-bold text-gray-400 block mt-1 uppercase tracking-tighter">{subtext}</span>}
        </p>
      </div>
    </article>
  );
}

export default Dashboard;