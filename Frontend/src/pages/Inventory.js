import React, { useState, useEffect, useContext, useCallback } from "react";
import AddProduct from "../components/AddProduct";
import UpdateProduct from "../components/UpdateProduct";
import AuthContext from "../AuthContext";
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  PencilSquareIcon, 
  TrashIcon, 
  ArrowDownTrayIcon,
  AdjustmentsHorizontalIcon,
  ArrowsUpDownIcon,
  ListBulletIcon,
  CalendarIcon,
  XMarkIcon 
} from "@heroicons/react/24/outline";

function Inventory() {
  const [showProductModal, setShowProductModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateProduct, setUpdateProduct] = useState([]);
  const [products, setAllProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatePage, setUpdatePage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const authContext = useContext(AuthContext);

  // 1. Fetch Logic
  const fetchProductsData = useCallback(() => {
    setIsLoading(true);
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/product/get/${authContext.user}`)
      .then((res) => res.json())
      .then((data) => {
        setAllProducts(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [authContext.user]);


  useEffect(() => {
    if (products.length === 0 && !isLoading) {
      const dummyAssets = [
        {
          _id: "dummy-1",
          name: "Precision Workstation T7920",
          manufacturer: "Dell Technologies",
          stock: 14,
          description: "High-end compute node for rendering."
        },
        {
          _id: "dummy-2",
          name: "MacBook Pro M3 Max (16-inch)",
          manufacturer: "Apple Inc.",
          stock: 5,
          description: "Creative team standard issue."
        },
        {
          _id: "dummy-3",
          name: "Sony Alpha a7 IV Mirrorless",
          manufacturer: "Sony",
          stock: 0,
          description: "Marketing department equipment."
        },
        {
          _id: "dummy-4",
          name: "Logitech MX Master 3S",
          manufacturer: "Logitech",
          stock: 42,
          description: "Standard ergonomic peripheral."
        }
      ];
      setAllProducts(dummyAssets);
    }
  }, [products.length, isLoading]);
  useEffect(() => {
    fetchProductsData();
  }, [updatePage, fetchProductsData]);

  // 2. Search Logic
  const filteredProducts = products.filter((item) =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.manufacturer?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addProductModalSetting = () => setShowProductModal(!showProductModal);
  const handlePageUpdate = () => setUpdatePage(!updatePage);
  
  const updateProductModalSetting = (selectedProductData) => {
    setUpdateProduct(selectedProductData);
    setShowUpdateModal(!showUpdateModal);
  };

  const deleteItem = (id) => {
    if(window.confirm("Are you sure you want to delete this asset?")) {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/api/product/delete/${id}`, { method: 'DELETE' })
        .then(() => setUpdatePage(!updatePage));
    }
  };

  return (
    <div className="flex flex-col gap-4 bg-gray-50/50 min-h-screen">
      
      {/* Top Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-gray-900 tracking-tight">Inventory Assets</h1>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Manage your physical nodes</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-xs font-black text-gray-600 uppercase bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
            <ArrowDownTrayIcon className="h-4 w-4" /> Import
          </button>
          <button
            onClick={addProductModalSetting}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#8f5273] hover:bg-[#8f5273]/90 text-white text-xs font-black uppercase tracking-widest py-2.5 px-6 rounded-xl shadow-lg shadow-[#8f5273]/20 transition-all"
          >
            <PlusIcon className="h-4 w-4" /> New Asset
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col lg:flex-row items-center gap-3 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-3 py-2 border border-gray-100 rounded-xl text-[10px] font-black uppercase text-gray-500 hover:bg-gray-50">
            <AdjustmentsHorizontalIcon className="h-4 w-4" /> Filter
          </button>
          <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-3 py-2 border border-gray-100 rounded-xl text-[10px] font-black uppercase text-gray-500 hover:bg-gray-50">
            <ArrowsUpDownIcon className="h-4 w-4" /> Sort
          </button>
        </div>
        
        <div className="relative flex-1 w-full">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            className="w-full pl-11 pr-10 py-2.5 bg-gray-50/50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-[#8f5273]/20 focus:border-[#8f5273] outline-none transition-all"
            placeholder="Search by name or manufacturer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full">
              <XMarkIcon className="h-3 w-3 text-gray-500" />
            </button>
          )}
        </div>

        <div className="hidden lg:flex items-center gap-1 border-l border-gray-100 pl-3">
          <button className="p-2 text-[#8f5273] bg-[#8f5273]/10 rounded-lg"><ListBulletIcon className="h-5 w-5"/></button>
          <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg"><CalendarIcon className="h-5 w-5"/></button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        {products.length === 0 ? (
          /* Empty Database State */
          <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <img src="https://cdn-icons-png.flaticon.com/512/4076/4076432.png" className="w-12 h-12 grayscale opacity-30" alt="empty" />
            </div>
            <h3 className="text-lg font-black text-gray-800 uppercase tracking-tight">No Assets Found</h3>
            <p className="text-gray-400 text-xs font-bold mt-1 uppercase tracking-tighter">Your inventory database is currently empty</p>
            <button onClick={addProductModalSetting} className="mt-6 px-6 py-2 bg-[#8f5273] text-white text-[10px] font-black uppercase rounded-xl">Add First Item</button>
          </div>
        ) : filteredProducts.length === 0 ? (
          /* No Search Results State */
          <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
             <MagnifyingGlassIcon className="h-12 w-12 text-gray-200 mb-2" />
             <p className="text-gray-800 font-black uppercase text-sm">No matches for "{searchTerm}"</p>
             <button onClick={() => setSearchTerm("")} className="mt-2 text-[#8f5273] text-[10px] font-black uppercase underline">Clear Search</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Asset Detail</th>
                  <th className="hidden md:table-cell px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Manufacturer</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">Qty</th>
                  <th className="hidden sm:table-cell px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredProducts.map((item) => (
                  <tr key={item._id} className="group hover:bg-gray-50/80 transition-all">
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#8f5273]/5 flex items-center justify-center text-[#8f5273] font-bold text-xs">
                          {item.name?.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-gray-900 group-hover:text-[#8f5273] transition-colors line-clamp-1">{item.name}</span>
                          <span className="text-[10px] font-bold text-gray-400 uppercase md:hidden">{item.manufacturer}</span>
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-tight">
                      {item.manufacturer}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-black text-gray-900 bg-gray-100 px-3 py-1 rounded-lg">{item.stock}</span>
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-tighter ${
                        item.stock > 10 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                      }`}>
                        {item.stock > 10 ? 'Healthy' : 'Low Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => updateProductModalSetting(item)} className="p-2 text-gray-400 hover:text-[#8f5273] hover:bg-[#8f5273]/5 rounded-xl transition-all"><PencilSquareIcon className="h-4 w-4"/></button>
                        <button onClick={() => deleteItem(item._id)} className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"><TrashIcon className="h-4 w-4"/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer / Pagination */}
        <div className="mt-auto p-6 border-t border-gray-100 bg-gray-50/30 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Showing {filteredProducts.length} Assets</span>
            <select className="bg-white border border-gray-200 rounded-lg text-[10px] font-black uppercase px-2 py-1 outline-none">
              <option>10 per page</option>
              <option>25 per page</option>
            </select>
          </div>
          <div className="flex items-center gap-1">
             <button className="px-3 py-1 text-[10px] font-black uppercase text-gray-400 border border-gray-200 rounded-lg disabled:opacity-30" disabled>Prev</button>
             <button className="px-3 py-1 text-[10px] font-black uppercase bg-[#8f5273] text-white rounded-lg shadow-md shadow-[#8f5273]/20">1</button>
             <button className="px-3 py-1 text-[10px] font-black uppercase text-gray-400 border border-gray-200 rounded-lg">Next</button>
          </div>
        </div>
      </div>

      {showProductModal && (
        <AddProduct addProductModalSetting={addProductModalSetting} handlePageUpdate={handlePageUpdate} />
      )}
      {showUpdateModal && (
        <UpdateProduct updateProductData={updateProduct} updateModalSetting={updateProductModalSetting} handlePageUpdate={handlePageUpdate}/>
      )}
    </div>
  );
}

export default Inventory;