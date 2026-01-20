import React, { useState, useEffect, useContext } from "react";
import AddStore from "../components/AddStore";
import AuthContext from "../AuthContext";
import { MapPinIcon, PlusIcon, BuildingStorefrontIcon } from "@heroicons/react/24/outline";

function Store() {
  const [showModal, setShowModal] = useState(false);
  const [stores, setAllStores] = useState([]);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch(`http://localhost:4000/api/store/get/${authContext.user}`)
      .then((response) => response.json())
      .then((data) => setAllStores(data))
      .catch((err) => console.error("Error fetching stores:", err));
  };

  const modalSetting = () => setShowModal(!showModal);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Stores</h1>
          <p className="text-sm text-gray-500 mt-1">View and manage your physical store locations.</p>
        </div>
        <button
          className="flex items-center gap-2 bg-[#8f5273] hover:bg-[#7a4562] text-white font-semibold py-2.5 px-5 rounded-xl shadow-sm transition-all active:scale-95"
          onClick={modalSetting}
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add New Store</span>
        </button>
      </div>

      {showModal && (
        <div className="mb-8 transition-all animate-in fade-in slide-in-from-top-4">
          <AddStore />
        </div>
      )}

      {/* Responsive Grid Section */}
      {stores.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {stores.map((element) => (
            <div
              key={element._id}
              className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              {/* Store Image */}
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  alt={element.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  src={element.image || "https://images.unsplash.com/photo-1534452203294-49c8913721b2?q=80&w=1000&auto=format&fit=crop"} 
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-md shadow-sm">
                  <span className="text-[10px] font-bold text-[#8f5273] uppercase tracking-wider">Active</span>
                </div>
              </div>

              {/* Store Details */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#8f5273]/10 rounded-lg">
                      <BuildingStorefrontIcon className="h-5 w-5 text-[#8f5273]" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{element.name}</h3>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-gray-500">
                  <MapPinIcon className="h-5 w-5 flex-shrink-0 text-gray-400" />
                  <span className="text-sm leading-relaxed">
                    {element.address}, {element.city}
                  </span>
                </div>

                {/* Card Footer Actions */}
                <div className="mt-6 pt-4 border-t border-gray-50 flex justify-between items-center">
                  <button className="text-sm font-semibold text-[#8f5273] hover:underline">
                    View Inventory
                  </button>
                  <button className="text-xs font-medium text-gray-400 hover:text-red-500 transition-colors">
                    Edit Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
          <BuildingStorefrontIcon className="h-16 w-16 text-gray-200 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No stores found</h3>
          <p className="text-gray-500 text-sm mb-6">Get started by adding your first location.</p>
          <button
            onClick={modalSetting}
            className="text-[#8f5273] font-bold hover:underline"
          >
            Add Store Now
          </button>
        </div>
      )}
    </div>
  );
}

export default Store;