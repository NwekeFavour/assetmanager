import React, { useState, useEffect, useContext, useCallback } from "react"; // Added useCallback to main import
import AddProduct from "../components/AddProduct";
import UpdateProduct from "../components/UpdateProduct";
import AuthContext from "../AuthContext";
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  PencilSquareIcon, 
  TrashIcon, 
  CubeIcon, 
  ArrowPathIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";

function Inventory() {
  const [showProductModal, setShowProductModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateProduct, setUpdateProduct] = useState([]);
  const [products, setAllProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatePage, setUpdatePage] = useState(true);
  const [stores, setAllStores] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const authContext = useContext(AuthContext);

  // --- Fixed Fetch Functions ---

  // 1. Added [authContext.user] dependency array
  const fetchProductsData = useCallback(() => {
    setIsLoading(true);
    fetch(`http://localhost:4000/api/product/get/${authContext.user}`)
      .then((response) => response.json())
      .then((data) => {
        setAllProducts(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, [authContext.user]);

  // 2. Added [authContext.user] dependency array
  const fetchSalesData = useCallback(() => {
    fetch(`http://localhost:4000/api/store/get/${authContext.user}`)
      .then((response) => response.json())
      .then((data) => setAllStores(data));
  }, [authContext.user]);

  // 3. Fixed useEffect dependencies
  useEffect(() => {
    fetchProductsData();
    fetchSalesData();
  }, [updatePage, fetchProductsData, fetchSalesData]); 

  // --- Other Functions ---

  const fetchSearchData = useCallback(() => {
    if (!searchTerm) {
        fetchProductsData();
        return;
    }
    fetch(`http://localhost:4000/api/product/search?searchTerm=${searchTerm}`)
      .then((response) => response.json())
      .then((data) => setAllProducts(data))
      .catch((err) => console.log(err));
  }, [searchTerm, fetchProductsData]);

  const addProductModalSetting = () => setShowProductModal(!showProductModal);
  
  const updateProductModalSetting = (selectedProductData) => {
    setUpdateProduct(selectedProductData);
    setShowUpdateModal(!showUpdateModal);
  };

  const deleteItem = (id) => {
    if(window.confirm("Are you sure you want to delete this product?")) {
      fetch(`http://localhost:4000/api/product/delete/${id}`)
        .then((response) => response.json())
        .then(() => setUpdatePage(!updatePage));
    }
  };

  const handlePageUpdate = () => setUpdatePage(!updatePage);

  const handleSearchTerm = (e) => {
    setSearchTerm(e.target.value);
    // Note: To avoid excessive API calls, you might want to call 
    // fetchSearchData inside another useEffect triggered by searchTerm
  };

  // Add this effect to handle search when searchTerm changes
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
        if(searchTerm) fetchSearchData();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, fetchSearchData]);

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Inventory Management</h1>
          <p className="text-gray-500 text-sm">Monitor stock levels, manufacturers, and product availability.</p>
        </div>
        <div className="flex gap-3 w-full lg:w-auto">
          <button 
            onClick={() => setUpdatePage(!updatePage)}
            className="p-2.5 text-gray-400 hover:text-[#8f5273] bg-white border border-gray-200 rounded-xl hover:border-[#8f5273] transition-all"
          >
            <ArrowPathIcon className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-[#8f5273] hover:bg-[#7a4562] text-white font-bold py-2.5 px-6 rounded-xl shadow-lg shadow-[#8f5273]/20 transition-all active:scale-95"
            onClick={addProductModalSetting}
          >
            <PlusIcon className="h-5 w-5" />
            Create Product
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Inventory" value={products.length} icon={<CubeIcon />} color="blue" />
        <StatCard title="Total Stores" value={stores.length} icon={<PlusIcon />} color="yellow" />
        <StatCard title="Stock Value" value="₦12,500" icon={<PlusIcon />} color="purple" />
        <StatCard title="Low Stock Units" value="12" icon={<ExclamationTriangleIcon />} color="red" />
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Search & Filter Bar */}
        <div className="p-5 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#8f5273]/20 transition-all"
              placeholder="Search by SKU, name or manufacturer..."
              value={searchTerm}
              onChange={handleSearchTerm}
            />
          </div>
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Showing {products.length} Products
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] bg-gray-50/50">
                <th className="px-8 py-4">Item Identification</th>
                <th className="px-6 py-4">Manufacturer</th>
                <th className="px-6 py-4 text-center">In Stock</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-8 py-4 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((item) => (
                <tr key={item._id} className="group hover:bg-gray-50/80 transition-all">
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-900 group-hover:text-[#8f5273] transition-colors">{item.name}</span>
                      <span className="text-xs text-gray-400 font-medium truncate max-w-[180px]">{item.description}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-medium text-gray-600">{item.manufacturer}</span>
                  </td>
                  <td className="px-6 py-5 text-center font-black text-gray-700">
                    {item.stock}
                  </td>
                  <td className="px-6 py-5">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      item.stock > 10 
                        ? "bg-green-50 text-green-600" 
                        : item.stock > 0 
                        ? "bg-orange-50 text-orange-600" 
                        : "bg-red-50 text-red-600"
                    }`}>
                      <span className={`w-1 h-1 rounded-full ${item.stock > 0 ? 'bg-current' : 'bg-red-600'}`}></span>
                      {item.stock > 10 ? "Available" : item.stock > 0 ? "Low Stock" : "Out of Stock"}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end items-center gap-2">
                      <button 
                        onClick={() => updateProductModalSetting(item)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => deleteItem(item._id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {products.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <CubeIcon className="h-12 w-12 text-gray-200 mb-3" />
              <p className="text-gray-400 font-medium italic">No products match your criteria</p>
            </div>
          )}
        </div>
      </div>

      {showProductModal && (
        <AddProduct addProductModalSetting={addProductModalSetting} handlePageUpdate={handlePageUpdate} />
      )}
      {showUpdateModal && (
        <UpdateProduct updateProductData={updateProduct} updateModalSetting={updateProductModalSetting} />
      )}
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  const colors = {
    blue: "text-blue-600 bg-blue-50",
    yellow: "text-amber-600 bg-amber-50",
    purple: "text-purple-600 bg-purple-50",
    red: "text-red-600 bg-red-50"
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex justify-between items-center">
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-1">{title}</p>
        <p className="text-2xl font-black text-gray-900">{value}</p>
      </div>
      <div className={`p-3 rounded-2xl ${colors[color]}`}>
        {React.cloneElement(icon, { className: "h-6 w-6" })}
      </div>
    </div>
  );
}

export default Inventory;