import React, { useState, useEffect, useContext, useCallback } from "react"; // Added useCallback to import
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

  // --- Fixed Fetch Functions with Dependencies ---

  // Fix: Added [authContext.user] as the second argument
  const fetchPurchaseData = useCallback(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/purchase/get/${authContext.user}`)
      .then((response) => response.json())
      .then((data) => setAllPurchaseData(data))
      .catch((err) => console.log(err));
  }, [authContext.user]);

  // Fix: Added [authContext.user] as the second argument
  const fetchProductsData = useCallback(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/product/get/${authContext.user}`)
      .then((response) => response.json())
      .then((data) => setAllProducts(data))
      .catch((err) => console.log(err));
  }, [authContext.user]);

  // Fix: Added fetch functions to the dependency array
  useEffect(() => {
    fetchPurchaseData();
    fetchProductsData();
  }, [updatePage, fetchPurchaseData, fetchProductsData]);

  // Derived Stats
  const totalExpenditure = purchase.reduce((acc, curr) => acc + curr.TotalPurchaseAmount, 0);
  const totalItemsBought = purchase.reduce((acc, curr) => acc + curr.QuantityPurchased, 0);

  const addSaleModalSetting = () => setPurchaseModal(!showPurchaseModal);
  const handlePageUpdate = () => setUpdatePage(!updatePage);

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Purchase Orders</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and track your incoming stock and procurement expenses.</p>
        </div>
        <button
          className="flex items-center gap-2 bg-[#8f5273] hover:bg-[#7a4562] text-white font-bold py-2.5 px-6 rounded-xl shadow-lg shadow-[#8f5273]/20 transition-all active:scale-95"
          onClick={addSaleModalSetting}
        >
          <PlusIcon className="h-5 w-5" />
          Add New Purchase
        </button>
      </div>

      {/* 2. Consistent Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-1">Total Procurement</p>
            <h3 className="text-2xl font-black text-gray-900">₦{totalExpenditure.toLocaleString()}</h3>
          </div>
          <div className="p-3 bg-amber-50 rounded-2xl">
            <BanknotesIcon className="h-6 w-6 text-amber-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-1">Items Received</p>
            <h3 className="text-2xl font-black text-gray-900">{totalItemsBought.toLocaleString()} Units</h3>
          </div>
          <div className="p-3 bg-indigo-50 rounded-2xl">
            <ShoppingBagIcon className="h-6 w-6 text-indigo-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-1">Total Orders</p>
            <h3 className="text-2xl font-black text-gray-900">{purchase.length}</h3>
          </div>
          <div className="p-3 bg-emerald-50 rounded-2xl">
            <ArrowDownTrayIcon className="h-6 w-6 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* 3. Responsive Table Container */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Purchase History</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-gray-400 text-[11px] font-black uppercase tracking-[0.2em] border-b border-gray-100">
                <th className="px-8 py-5">Product</th>
                <th className="px-6 py-5">Quantity</th>
                <th className="px-6 py-5">Purchase Date</th>
                <th className="px-8 py-5 text-right">Total Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {purchase.map((element) => (
                <tr key={element._id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <span className="text-sm font-bold text-gray-900 group-hover:text-[#8f5273] transition-colors">
                      {element.ProductID?.name || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 uppercase tracking-wider">
                      +{element.QuantityPurchased} Units
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <CalendarIcon className="h-4 w-4 text-gray-400" />
                      {new Date(element.PurchaseDate).toLocaleDateString() === new Date().toLocaleDateString()
                        ? <span className="text-[#8f5273] font-bold">Today</span>
                        : new Date(element.PurchaseDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right font-black text-gray-900">
                    ₦{element.TotalPurchaseAmount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {purchase.length === 0 && (
            <div className="p-20 text-center flex flex-col items-center justify-center">
               <ShoppingBagIcon className="h-12 w-12 text-gray-200 mb-2" />
               <p className="text-gray-400 font-medium italic">No purchase records found.</p>
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