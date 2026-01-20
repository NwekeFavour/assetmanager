import React, { useState, useEffect, useContext, useCallback } from "react";
import AddStore from "../components/AddStore";
import AuthContext from "../AuthContext";
import { MapPinIcon, PlusIcon, BuildingStorefrontIcon } from "@heroicons/react/24/outline";

function Store() {
  const [showModal, setShowModal] = useState(false);
  const [stores, setAllStores] = useState([]);
  const authContext = useContext(AuthContext);

  // Fix: Added dependency array [authContext.user] to useCallback
  const fetchData = useCallback(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/store/get/${authContext.user}`)
      .then((response) => response.json())
      .then((data) => setAllStores(data))
      .catch((err) => console.error("Error fetching stores:", err));
  }, [authContext.user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const modalSetting = () => setShowModal(!showModal);

  return (
    <div className="p-4 sm:p-8">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Manage Stores</h1>
          <p className="text-sm text-gray-500 mt-1">View and manage your physical store locations.</p>
        </div>
        <button
          className="flex items-center gap-2 bg-[#8f5273] hover:bg-[#7a4562] text-white font-bold py-2.5 px-6 rounded-xl shadow-lg shadow-[#8f5273]/20 transition-all active:scale-95"
          onClick={modalSetting}
        >
          <PlusIcon className="h-5 w-5 stroke-[3px]" />
          <span>Add New Store</span>
        </button>
      </div>

      {showModal && (
        <div className="mb-10 transition-all animate-in fade-in slide-in-from-top-4">
          <AddStore />
        </div>
      )}

      {/* 2. Responsive Grid Section */}
      {stores.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {stores.map((element) => (
            <div
              key={element._id}
              className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Store Image */}
              <div className="relative h-52 w-full overflow-hidden">
                <img
                  alt={element.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  src={element.image || "https://images.unsplash.com/photo-1534452203294-49c8913721b2?q=80&w=1000&auto=format&fit=crop"} 
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow-sm">
                  <span className="text-[10px] font-black text-[#8f5273] uppercase tracking-[0.2em]">Active</span>
                </div>
              </div>

              {/* Store Details */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-[#8f5273]/10 transition-colors">
                      <BuildingStorefrontIcon className="h-6 w-6 text-[#8f5273]" />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 tracking-tight">{element.name}</h3>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-gray-500 mb-6">
                  <MapPinIcon className="h-5 w-5 flex-shrink-0 text-gray-400" />
                  <span className="text-sm font-medium leading-relaxed">
                    {element.address}, {element.city}
                  </span>
                </div>

                {/* Card Footer Actions */}
                <div className="pt-5 border-t border-gray-50 flex justify-between items-center">
                  <button className="text-xs font-black uppercase tracking-widest text-[#8f5273] hover:opacity-70 transition-opacity">
                    View Inventory
                  </button>
                  <button className="text-[10px] font-black uppercase tracking-widest text-gray-300 hover:text-red-500 transition-colors">
                    Edit Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[2rem] border-2 border-dashed border-gray-100">
          <div className="p-6 bg-gray-50 rounded-full mb-4">
            <BuildingStorefrontIcon className="h-12 w-12 text-gray-200" />
          </div>
          <h3 className="text-xl font-black text-gray-900 tracking-tight">No stores found</h3>
          <p className="text-gray-400 font-medium text-sm mb-8 mt-1">Your physical locations will appear here.</p>
          <button
            onClick={modalSetting}
            className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-all active:scale-95 shadow-lg shadow-black/10"
          >
            Add Store Now
          </button>
        </div>
      )}
    </div>
  );
}

export default Store;