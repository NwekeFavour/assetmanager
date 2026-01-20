import { Fragment, useContext, useState } from "react";
import { Menu, Transition, Popover, Dialog } from "@headlessui/react";
import { 
  Bell, Search, Plus, LogOut, Package, Info, 
  Menu as MenuIcon, X, LayoutDashboard, Store, 
  ShoppingCart, ClipboardList 
} from "lucide-react";
import AuthContext from "../AuthContext";

const notifications = [
  { id: 1, title: "Low Stock Alert", message: "iPhone 13 Pro is below 5 units", time: "2 min ago", icon: Package, color: "text-red-500", bg: "bg-red-50" },
  { id: 2, title: "New Sale", message: "Order #4432 confirmed", time: "1 hour ago", icon: Info, color: "text-blue-500", bg: "bg-blue-50" },
];

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Inventory', href: '/inventory', icon: Package },
  { name: 'Purchase', href: '/purchase', icon: ShoppingCart },
  { name: 'Sales', href: '/sales', icon: ClipboardList },
  { name: 'Stores', href: '/stores', icon: Store },
];

export default function Header() {
  const authContext = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userData = JSON.parse(localStorage.getItem("user")) || {};

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white/80 px-4 backdrop-blur-md sm:px-6 lg:px-8">
        
        {/* Mobile Menu Button & Brand */}
        <div className="flex items-center gap-4 lg:hidden">
          <button
            type="button"
            className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(true)}
          >
            <MenuIcon className="h-6 w-6" />
          </button>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#8f5273] text-white">
            <Package className="h-5 w-5" />
          </div>
        </div>

        {/* Search Bar (Hidden on tiny screens, shown on md+) */}
        <div className="hidden sm:flex flex-1 items-center px-4">
          <div className="w-full max-w-sm lg:max-w-xs relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-[#8f5273] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#8f5273] transition-all"
              placeholder="Search everything..."
            />
          </div>
        </div>

        {/* Desktop Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button className="hidden sm:flex items-center gap-2 rounded-lg bg-[#8f5273] px-3 py-2 text-sm font-semibold text-white shadow-md shadow-[#8f5273]/20 hover:bg-[#7a4562] transition-all active:scale-95">
            <Plus className="h-4 w-4" />
            <span>Add New</span>
          </button>

          {/* Notifications */}
          <Popover className="relative">
            <Popover.Button className="relative rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors focus:outline-none">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute right-0 z-50 mt-3 w-80 transform px-4 sm:px-0">
                <div className="overflow-hidden rounded-2xl shadow-xl ring-1 ring-black/5 bg-white border border-gray-100">
                  <div className="p-4 bg-gray-50/50 border-b border-gray-100 flex justify-between items-center">
                    <span className="font-bold text-gray-900">Notifications</span>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((item) => (
                      <div key={item.id} className="p-4 flex gap-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0">
                        <div className={`mt-1 p-2 rounded-lg ${item.bg}`}><item.icon className={`h-4 w-4 ${item.color}`} /></div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{item.title}</p>
                          <p className="text-xs text-gray-500">{item.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </Popover>

          <div className="h-8 w-[1px] bg-gray-200 mx-1 hidden sm:block" />

          {/* Profile Menu */}
          <Menu as="div" className="relative">
            <Menu.Button className="flex rounded-full ring-2 ring-transparent hover:ring-[#8f5273]/20 transition-all focus:outline-none">
              <img
                className="h-9 w-9 rounded-full border border-gray-200 object-cover"
                src={userData.imageUrl || `https://ui-avatars.com/api/?name=${userData.firstName}`}
                alt="User"
              />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition duration-100 ease-out"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition duration-75 ease-in"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-52 origin-top-right divide-y divide-gray-100 rounded-xl bg-white shadow-xl ring-1 ring-black/5 p-1 focus:outline-none">
                <div className="px-4 py-3">
                  <p className="text-xs text-gray-500 font-medium">Signed in as</p>
                  <p className="text-sm font-bold text-gray-900 truncate">{userData.email || "User"}</p>
                </div>
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button onClick={() => authContext.signout()} className={`${active ? "bg-red-50 text-red-600" : "text-gray-700"} flex w-full items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg`}>
                        <LogOut className="h-4 w-4" /> Sign out
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </header>

      {/* Mobile Navigation Dialog (Drawer) */}
      <Transition.Root show={mobileMenuOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setMobileMenuOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                  <div className="flex h-16 shrink-0 items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#8f5273] text-white font-bold">I</div>
                      <span className="text-xl font-black tracking-tight text-gray-900">Inventory</span>
                    </div>
                    <button type="button" className="-m-2.5 p-2.5 text-gray-700" onClick={() => setMobileMenuOpen(false)}>
                      <X className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {navigation.map((item) => (
                            <li key={item.name}>
                              <a
                                href={item.href}
                                className="group flex gap-x-3 rounded-xl p-3 text-sm font-bold leading-6 text-gray-700 hover:bg-[#8f5273]/5 hover:text-[#8f5273] transition-colors"
                              >
                                <item.icon className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-[#8f5273]" aria-hidden="true" />
                                {item.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </li>
                      <li className="mt-auto">
                        <button
                          onClick={() => authContext.signout()}
                          className="group -mx-2 flex gap-x-3 rounded-xl p-3 text-sm font-bold leading-6 text-red-600 hover:bg-red-50 w-full"
                        >
                          <LogOut className="h-6 w-6 shrink-0 text-red-400 group-hover:text-red-600" aria-hidden="true" />
                          Logout
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}