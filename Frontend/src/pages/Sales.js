import React, { useState, useEffect, useContext } from "react";
import AddSale from "../components/AddSale";
import AuthContext from "../AuthContext";
import { 
  CurrencyDollarIcon, 
  ArrowUpIcon, 
  ShoppingCartIcon, 
  PlusIcon, 
  CalendarDaysIcon 
} from "@heroicons/react/24/outline";

function Sales() {
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [sales, setAllSalesData] = useState([]);
  const [products, setAllProducts] = useState([]);
  const [stores, setAllStores] = useState([]);
  const [updatePage, setUpdatePage] = useState(true);

  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchSalesData();
    fetchProductsData();
    fetchStoresData();
  }, [updatePage]);

  // Calculations for Stats (Logic based on your sales state)
  const totalRevenue = sales.reduce((acc, curr) => acc + curr.TotalSaleAmount, 0);
  const totalItemsSold = sales.reduce((acc, curr) => acc + curr.StockSold, 0);

  // ... (Your fetch functions remain exactly the same)
  const fetchSalesData = () => {
    fetch(`http://localhost:4000/api/sales/get/${authContext.user}`)
      .then((response) => response.json())
      .then((data) => setAllSalesData(data))
      .catch((err) => console.log(err));
  };

  const fetchProductsData = () => {
    fetch(`http://localhost:4000/api/product/get/${authContext.user}`)
      .then((response) => response.json())
      .then((data) => setAllProducts(data));
  };

  const fetchStoresData = () => {
    fetch(`http://localhost:4000/api/store/get/${authContext.user}`)
      .then((response) => response.json())
      .then((data) => setAllStores(data));
  };

  const addSaleModalSetting = () => setShowSaleModal(!showSaleModal);
  const handlePageUpdate = () => setUpdatePage(!updatePage);

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      {/* 1. Sales Header & Summary Cards */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales Transactions</h1>
          <p className="text-sm text-gray-500">Track and manage your revenue across all stores.</p>
        </div>
        <button
          className="flex items-center gap-2 bg-[#8f5273] hover:bg-[#7a4562] text-white font-semibold py-2.5 px-5 rounded-xl shadow-sm transition-all active:scale-95"
          onClick={addSaleModalSetting}
        >
          <PlusIcon className="h-5 w-5" />
          Add Sale Transaction
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <SaleStatCard 
          title="Total Revenue" 
          value={`₦${totalRevenue.toLocaleString()}`} 
          icon={<CurrencyDollarIcon className="h-6 w-6 text-green-600" />}
          trend="+12.5% from last month"
          trendColor="text-green-500"
        />
        <SaleStatCard 
          title="Items Sold" 
          value={totalItemsSold} 
          icon={<ShoppingCartIcon className="h-6 w-6 text-blue-600" />}
          trend="+5 new orders today"
          trendColor="text-blue-500"
        />
        <SaleStatCard 
          title="Avg. Transaction" 
          value={`₦${sales.length > 0 ? (totalRevenue / sales.length).toFixed(0) : 0}`} 
          icon={<ArrowUpIcon className="h-6 w-6 text-purple-600" />}
        />
      </div>

      {/* 2. Transactions Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-2">
        <div className="p-5 border-b border-gray-50 bg-gray-50/30">
          <h3 className="font-bold text-gray-800">Recent History</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-gray-400 text-[11px] uppercase tracking-widest border-b border-gray-100">
                <th className="px-6 py-4 font-bold">Product Details</th>
                <th className="px-6 py-4 font-bold">Store</th>
                <th className="px-6 py-4 font-bold">Qty</th>
                <th className="px-6 py-4 font-bold">Date</th>
                <th className="px-6 py-4 font-bold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {sales.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900 group-hover:text-[#8f5273] transition-colors">
                      {item.ProductID?.name || "Deleted Product"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                      {item.StoreID?.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-700">
                    {item.StockSold}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-500">
                      <CalendarDaysIcon className="h-4 w-4 text-gray-400" />
                      {new Date(item.SaleDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-block px-3 py-1 rounded-lg bg-green-50 text-green-700 font-bold">
                      ₦{item.TotalSaleAmount.toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {sales.length === 0 && (
            <div className="p-20 text-center">
              <p className="text-gray-400 italic">No sales transactions found.</p>
            </div>
          )}
        </div>
      </div>

      {showSaleModal && (
        <AddSale
          addSaleModalSetting={addSaleModalSetting}
          products={products}
          stores={stores}
          handlePageUpdate={handlePageUpdate}
          authContext={authContext}
        />
      )}
    </div>
  );
}

// Sub-component for Sales Stats
function SaleStatCard({ title, value, icon, trend, trendColor }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start justify-between">
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-2xl font-black text-gray-900">{value}</h3>
        {trend && <p className={`text-[10px] mt-2 font-bold ${trendColor}`}>{trend}</p>}
      </div>
      <div className="p-3 bg-gray-50 rounded-xl">
        {icon}
      </div>
    </div>
  );
}

export default Sales;