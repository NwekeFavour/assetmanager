import React, { useState, useEffect, useContext, useCallback } from "react";
import AddSale from "../components/AddSale"; // You can rename this component to AddMovement later
import AuthContext from "../AuthContext";
import {
  ArrowRightCircleIcon,
  ArchiveBoxXMarkIcon,
  ArrowsRightLeftIcon,
  PlusIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";

function Movements() {
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [sales, setAllSalesData] = useState([]);
  const [products, setAllProducts] = useState([]);
  const [stores, setAllStores] = useState([]);
  const [updatePage, setUpdatePage] = useState(true);

  const authContext = useContext(AuthContext);

  const fetchSalesData = useCallback(() => {
    fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/sales/get/${authContext.user}`,
    )
      .then((response) => response.json())
      .then((data) => setAllSalesData(data))
      .catch((err) => console.log(err));
  }, [authContext.user]);

  const fetchProductsData = useCallback(() => {
    fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/product/get/${authContext.user}`,
    )
      .then((response) => response.json())
      .then((data) => setAllProducts(data))
      .catch((err) => console.log(err));
  }, [authContext.user]);

  const fetchStoresData = useCallback(() => {
    fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/store/get/${authContext.user}`,
    )
      .then((response) => response.json())
      .then((data) => setAllStores(data))
      .catch((err) => console.log(err));
  }, [authContext.user]);

  useEffect(() => {
    fetchSalesData();
    fetchProductsData();
    fetchStoresData();
  }, [updatePage, fetchSalesData, fetchProductsData, fetchStoresData]);

  // Asset Management Calculations
  const totalAssetsOut = sales.reduce((acc, curr) => acc + curr.StockSold, 0);
  const totalRecoveryValue = sales.reduce(
    (acc, curr) => acc + curr.TotalSaleAmount,
    0,
  );

  const addSaleModalSetting = () => setShowSaleModal(!showSaleModal);
  const handlePageUpdate = () => setUpdatePage(!updatePage);

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-8">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">
            Asset Outflow
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            Track asset disposals, external transfers, and liquidations.
          </p>
        </div>
        <button
          className="flex items-center gap-2 bg-[#8f5273] hover:bg-[#7a4562] text-white font-black py-3 px-6 rounded-xl shadow-lg shadow-[#8f5273]/20 transition-all active:scale-95 text-xs uppercase tracking-widest"
          onClick={addSaleModalSetting}
        >
          <PlusIcon className="h-4 w-4 stroke-[3]" />
          Record New Movement
        </button>
      </div>

      {/* 2. Asset Specific Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <SaleStatCard
          title="Assets Retired"
          value={totalAssetsOut.toLocaleString()}
          icon={<ArchiveBoxXMarkIcon className="h-6 w-6 text-rose-600" />}
          trend="Total items removed from inventory"
          trendColor="text-gray-400"
        />
        <SaleStatCard
          title="Recovery Value"
          value={`₦${totalRecoveryValue.toLocaleString()}`}
          icon={<ArrowRightCircleIcon className="h-6 w-6 text-emerald-600" />}
          trend="Capital recovered from disposals"
          trendColor="text-emerald-500"
        />
        <SaleStatCard
          title="Outflow Frequency"
          value={sales.length}
          icon={<ArrowsRightLeftIcon className="h-6 w-6 text-blue-600" />}
          trend="Total exit transactions logged"
          trendColor="text-blue-500"
        />
      </div>

      {/* 3. Movement Log Table */}
      <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
            Depletion & Movement Log
          </h3>
          {/* Mobile Helper Badge */}
          <span className="md:hidden text-[9px] font-bold bg-[#8f5273]/10 text-[#8f5273] px-2 py-0.5 rounded-full uppercase">
            {sales.length} Logs
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-100">
                <th className="px-4 md:px-8 py-5">Asset Identifier</th>
                {/* Hide secondary info on mobile, show on medium+ */}
                <th className="hidden md:table-cell px-6 py-5">Origin Node</th>
                <th className="px-4 md:px-6 py-5">Qty</th>
                <th className="hidden sm:table-cell px-6 py-5">
                  Movement Date
                </th>
                <th className="px-4 md:px-8 py-5 text-right">Recovery</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {sales.map((item) => (
                <tr
                  key={item._id}
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  {/* Asset Column - Always Visible */}
                  <td className="px-4 md:px-8 py-4 md:py-5">
                    <div className="font-black text-gray-900 group-hover:text-[#8f5273] transition-colors uppercase tracking-tight text-xs md:text-sm">
                      {item.ProductID?.name || "Unidentified Asset"}
                    </div>
                    <div className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                      ID: {item.ProductID?._id?.slice(-6) || "N/A"}
                    </div>
                    {/* Mobile-only inline detail */}
                    <div className="md:hidden text-[9px] text-gray-400 font-bold mt-1 uppercase">
                      via {item.StoreID?.name || "Main"}
                    </div>
                  </td>

                  {/* Origin - Hidden on mobile */}
                  <td className="hidden md:table-cell px-6 py-5">
                    <div className="flex items-center gap-2 text-gray-600 font-bold text-xs uppercase tracking-tighter">
                      <span className="w-2 h-2 rounded-full bg-gray-200"></span>
                      {item.StoreID?.name || "Main Storage"}
                    </div>
                  </td>

                  {/* Qty - Always Visible */}
                  <td className="px-4 md:px-6 py-5 font-black text-gray-700 text-sm md:text-base">
                    -{item.StockSold}
                  </td>

                  {/* Date - Hidden on tiny mobile */}
                  <td className="hidden sm:table-cell px-6 py-5">
                    <div className="flex items-center gap-2 text-gray-500 font-bold text-xs">
                      <CalendarDaysIcon className="h-4 w-4 text-gray-300" />
                      {new Date(item.SaleDate).toLocaleDateString(undefined, {
                        year: "2-digit",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </td>

                  {/* Amount - Always Visible */}
                  <td className="px-4 md:px-8 py-5 text-right">
                    <span className="inline-block px-3 md:px-4 py-1.5 rounded-lg md:rounded-xl bg-gray-900 text-white font-black text-[9px] md:text-[10px] tracking-widest uppercase">
                      ₦{item.TotalSaleAmount.toLocaleString()}
                    </span>
                    {/* Mobile-only date detail under price */}
                    <div className="sm:hidden text-[8px] text-gray-400 font-bold mt-1 uppercase">
                      {new Date(item.SaleDate).toLocaleDateString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {sales.length === 0 && (
            <div className="p-12 md:p-24 text-center flex flex-col items-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <ArrowsRightLeftIcon className="h-6 w-6 md:h-8 md:w-8 text-gray-200" />
              </div>
              <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest">
                No Asset Movements Recorded
              </p>
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
    <div className="bg-white w-full! max-w-[300px] p-8 rounded-[2rem] border border-gray-100 shadow-sm flex  flex-wrap items-start justify-between transition-all hover:shadow-md hover:border-[#8f5273]/20 group">
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
          {title}
        </p>
        <h3 className="text-3xl font-black text-gray-900 tracking-tighter group-hover:text-[#8f5273] transition-colors">
          {value}
        </h3>
        {trend && (
          <p
            className={`text-[10px] mt-4 font-bold italic tracking-tight ${trendColor}`}
          >
            {trend}
          </p>
        )}
      </div>
      <div className="p-4 bg-gray-50 rounded-2xl group-hover:bg-[#8f5273]/5 transition-colors">
        {icon}
      </div>
    </div>
  );
}

export default Movements;
