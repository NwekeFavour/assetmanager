import React, { useState, useEffect, useContext, useCallback } from "react"; // Added useCallback
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

  // --- Fixed Fetch Functions with useCallback and Dependency Arrays ---

  const fetchSalesData = useCallback(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/sales/get/${authContext.user}`)
      .then((response) => response.json())
      .then((data) => setAllSalesData(data))
      .catch((err) => console.log(err));
  }, [authContext.user]);

  const fetchProductsData = useCallback(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/product/get/${authContext.user}`)
      .then((response) => response.json())
      .then((data) => setAllProducts(data))
      .catch((err) => console.log(err));
  }, [authContext.user]);

  const fetchStoresData = useCallback(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/store/get/${authContext.user}`)
      .then((response) => response.json())
      .then((data) => setAllStores(data))
      .catch((err) => console.log(err));
  }, [authContext.user]);

  // Fix: Included all memoized functions in the dependency array
  useEffect(() => {
    fetchSalesData();
    fetchProductsData();
    fetchStoresData();
  }, [updatePage, fetchSalesData, fetchProductsData, fetchStoresData]);

  // Calculations for Stats
  const totalRevenue = sales.reduce((acc, curr) => acc + curr.TotalSaleAmount, 0);
  const totalItemsSold = sales.reduce((acc, curr) => acc + curr.StockSold, 0);

  const addSaleModalSetting = () => setShowSaleModal(!showSaleModal);
  const handlePageUpdate = () => setUpdatePage(!updatePage);

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-8">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Sales Transactions</h1>
          <p className="text-sm text-gray-500">Track and manage your revenue across all stores.</p>
        </div>
        <button
          className="flex items-center gap-2 bg-[#8f5273] hover:bg-[#7a4562] text-white font-bold py-2.5 px-6 rounded-xl shadow-lg shadow-[#8f5273]/20 transition-all active:scale-95"
          onClick={addSaleModalSetting}
        >
          <PlusIcon className="h-5 w-5" />
          Add Sale Transaction
        </button>
      </div>

      {/* 2. Summary Cards */}
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
          value={totalItemsSold.toLocaleString()} 
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

      {/* 3. Transactions Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-50 bg-gray-50/30">
           <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Recent History</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-gray-400 text-[11px] font-black uppercase tracking-[0.2em] border-b border-gray-100">
                <th className="px-8 py-5">Product Details</th>
                <th className="px-6 py-5">Store</th>
                <th className="px-6 py-5">Qty</th>
                <th className="px-6 py-5">Date</th>
                <th className="px-8 py-5 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {sales.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="font-bold text-gray-900 group-hover:text-[#8f5273] transition-colors">
                      {item.ProductID?.name || "Deleted Product"}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-1.5 text-gray-600 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8f5273]/30"></span>
                      {item.StoreID?.name || "Main Store"}
                    </div>
                  </td>
                  <td className="px-6 py-5 font-black text-gray-700">
                    {item.StockSold}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-gray-500">
                      <CalendarDaysIcon className="h-4 w-4 text-gray-400" />
                      {new Date(item.SaleDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <span className="inline-block px-3 py-1 rounded-full bg-green-50 text-green-700 font-black text-[11px]">
                      ₦{item.TotalSaleAmount.toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {sales.length === 0 && (
            <div className="p-20 text-center flex flex-col items-center">
              <ShoppingCartIcon className="h-12 w-12 text-gray-100 mb-2" />
              <p className="text-gray-400 font-medium italic">No sales transactions found.</p>
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

function SaleStatCard({ title, value, icon, trend, trendColor }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start justify-between transition-all hover:shadow-md">
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-1">{title}</p>
        <h3 className="text-2xl font-black text-gray-900 tracking-tight">{value}</h3>
        {trend && <p className={`text-[10px] mt-2 font-black uppercase tracking-wider ${trendColor}`}>{trend}</p>}
      </div>
      <div className="p-3 bg-gray-50 rounded-2xl">
        {icon}
      </div>
    </div>
  );
}

export default Sales;