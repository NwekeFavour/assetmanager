import React, { useState, useEffect, useContext } from "react";
import AddPurchaseDetails from "../components/AddPurchaseDetails";
import AuthContext from "../AuthContext";
import { 
  ShoppingBagIcon, 
  BanknotesIcon, 
  CalendarIcon, 
  PlusIcon,
  ArrowDownTrayIcon
} from "@heroicons/react/24/outline";

function PurchaseDetails() {
  const [showPurchaseModal, setPurchaseModal] = useState(false);
  const [purchase, setAllPurchaseData] = useState([]);
  const [products, setAllProducts] = useState([]);
  const [updatePage, setUpdatePage] = useState(true);

  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchPurchaseData();
    fetchProductsData();
  }, [updatePage]);

  // Derived Stats for the "Stationary" look
  const totalExpenditure = purchase.reduce((acc, curr) => acc + curr.TotalPurchaseAmount, 0);
  const totalItemsBought = purchase.reduce((acc, curr) => acc + curr.QuantityPurchased, 0);

  const fetchPurchaseData = () => {
    fetch(`http://localhost:4000/api/purchase/get/${authContext.user}`)
      .then((response) => response.json())
      .then((data) => setAllPurchaseData(data))
      .catch((err) => console.log(err));
  };

  const fetchProductsData = () => {
    fetch(`http://localhost:4000/api/product/get/${authContext.user}`)
      .then((response) => response.json())
      .then((data) => setAllProducts(data))
      .catch((err) => console.log(err));
  };

  const addSaleModalSetting = () => setPurchaseModal(!showPurchaseModal);
  const handlePageUpdate = () => setUpdatePage(!updatePage);

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Purchase Orders</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and track your incoming stock and procurement expenses.</p>
        </div>
        <button
          className="flex items-center gap-2 bg-[#8f5273] hover:bg-[#7a4562] text-white font-semibold py-2.5 px-5 rounded-xl shadow-sm transition-all active:scale-95"
          onClick={addSaleModalSetting}
        >
          <PlusIcon className="h-5 w-5" />
          Add New Purchase
        </button>
      </div>

      {/* 2. Consistent Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Procurement</p>
            <h3 className="text-2xl font-black text-gray-900">₦{totalExpenditure.toLocaleString()}</h3>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl">
            <BanknotesIcon className="h-6 w-6 text-amber-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Items Received</p>
            <h3 className="text-2xl font-black text-gray-900">{totalItemsBought} Units</h3>
          </div>
          <div className="p-3 bg-indigo-50 rounded-xl">
            <ShoppingBagIcon className="h-6 w-6 text-indigo-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Orders</p>
            <h3 className="text-2xl font-black text-gray-900">{purchase.length}</h3>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl">
            <ArrowDownTrayIcon className="h-6 w-6 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* 3. Responsive Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
          <h3 className="font-bold text-gray-800">Purchase History</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-gray-400 text-[11px] uppercase tracking-widest border-b border-gray-100">
                <th className="px-6 py-4 font-bold">Product</th>
                <th className="px-6 py-4 font-bold">Quantity</th>
                <th className="px-6 py-4 font-bold">Purchase Date</th>
                <th className="px-6 py-4 font-bold text-right">Total Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {purchase.map((element) => (
                <tr key={element._id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-bold text-gray-900 group-hover:text-[#8f5273] transition-colors">
                      {element.ProductID?.name || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      +{element.QuantityPurchased}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-500">
                      <CalendarIcon className="h-4 w-4 text-gray-400" />
                      {new Date(element.PurchaseDate).toLocaleDateString() === new Date().toLocaleDateString()
                        ? <span className="text-[#8f5273] font-semibold">Today</span>
                        : element.PurchaseDate}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-black text-gray-900">
                    ₦{element.TotalPurchaseAmount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {purchase.length === 0 && (
            <div className="p-20 text-center text-gray-400 italic">
              No purchase records found.
            </div>
          )}
        </div>
      </div>

      {showPurchaseModal && (
        <AddPurchaseDetails
          addSaleModalSetting={addSaleModalSetting}
          products={products}
          handlePageUpdate={handlePageUpdate}
          authContext={authContext}
        />
      )}
    </div>
  );
}

export default PurchaseDetails;