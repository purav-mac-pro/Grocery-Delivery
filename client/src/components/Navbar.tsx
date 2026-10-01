
import {
  ArrowUpRightIcon,
  BikeIcon,
  ChevronDownIcon,
  LogOutIcon,
  MapPinIcon,
  MenuIcon,
  PackageIcon,
  SearchIcon,
  ShieldIcon,
  ShoppingCartIcon,
  UserIcon,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const {user,logout} = useAuth()

  // Cart context
  const { cartCount, setIsCartOpen } = useCart();

  const [searchQuery, setSearchQuery] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const query = searchQuery.trim();

    if (query) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    logout()
    setUserMenuOpen(false);
    navigate("/");
  };

  return (
    <nav className="bg-white sticky top-0 z-50 border-b border-app-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 gap-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-[22px] font-medium shrink-0"
        >
          <BikeIcon size={24} />
          <span>Instacart</span>
        </Link>

        <div className="w-full flex items-center justify-end gap-4 lg:gap-10">
          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center gap-6 text-sm text-zinc-600">
            <Link
              to="/"
              className="hover:text-app-orange transition-colors"
            >
              Home
            </Link>

            <Link
              to="/products"
              className="hover:text-app-orange transition-colors"
            >
              Products
            </Link>

            <Link
              to="/deals"
              className="text-app-orange hover:text-orange-600 transition-colors"
            >
              Deals
            </Link>
          </div>

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="hidden sm:flex flex-1 max-w-sm text-xs sm:text-sm"
          >
            <div className="relative w-full">
              <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />

              <input
                type="text"
                placeholder="Search for groceries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-4 py-2 bg-orange-50 rounded-full ring ring-app-orange/15 focus:ring-app-orange/30 outline-none transition-all"
              />
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <button
              type="button"
              className="relative p-2 rounded-xl hover:bg-orange-50 transition-colors"
              onClick={() => setIsCartOpen(true)}
              aria-label="Shopping cart"
            >
              <ShoppingCartIcon className="size-5 text-zinc-900" />

              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 size-4 bg-app-orange text-white text-[10px] rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User */}
            <div className="relative">
              {user ? (
                <>
                  {/* Logged-in user button */}
                  <button
                    type="button"
                    onClick={() => setUserMenuOpen((prev) => !prev)}
                    className="flex items-center gap-2 p-2 rounded-xl hover:bg-orange-50 transition-colors"
                    aria-label="User menu"
                    aria-expanded={userMenuOpen}
                  >
                    <div className="size-7 rounded-full bg-green-950 text-white flex items-center justify-center text-sm font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </div>

                    <ChevronDownIcon className="size-3 text-zinc-500" />
                  </button>

                  {/* User Dropdown */}
                  {userMenuOpen && (
                    <>
                      {/* Background overlay */}
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setUserMenuOpen(false)}
                      />

                      {/* Dropdown */}
                      <div className="absolute right-0 mt-2.5 w-56 bg-white rounded-xl shadow-lg border border-app-border py-2 z-50 animate-fade-in">
                        {/* User Information */}
                        <div className="px-4 py-2 border-b border-app-border">
                          <p className="text-sm font-medium text-zinc-900">
                            {user.name}
                          </p>

                          <p className="text-xs text-zinc-500">
                            {user.email}
                          </p>
                        </div>

                        {/* Menu Items */}
                        <div>
                          {/* My Orders */}
                          <Link
                            to="/orders"
                            onClick={() => setUserMenuOpen(false)}
                            className="dropdown-link flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-orange-50 transition-colors"
                          >
                            <PackageIcon size={16} />
                            My Orders
                          </Link>

                          {/* Addresses */}
                          <Link
                            to="/addresses"
                            onClick={() => setUserMenuOpen(false)}
                            className="dropdown-link flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-orange-50 transition-colors"
                          >
                            <MapPinIcon size={16} />
                            Addresses
                          </Link>

                          {/* Products */}
                          <Link
                            to="/products"
                            onClick={() => setUserMenuOpen(false)}
                            className="dropdown-link flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-orange-50 transition-colors"
                          >
                            <ArrowUpRightIcon size={16} />
                            Products
                          </Link>

                          {/* Deals - Mobile */}
                          <Link
                            to="/deals"
                            onClick={() => setUserMenuOpen(false)}
                            className="dropdown-link md:hidden flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-orange-50 transition-colors"
                          >
                            <ArrowUpRightIcon size={16} />
                            Deals
                          </Link>

                          {/* Admin Panel */}
                          {user.isAdmin && (
                            <Link
                              to="/admin"
                              onClick={() => setUserMenuOpen(false)}
                              className="dropdown-link flex items-center gap-3 px-4 py-2.5 text-sm text-app-orange-dark hover:bg-orange-50 transition-colors"
                            >
                              <ShieldIcon size={16} />
                              <span>Admin Panel</span>
                            </Link>
                          )}

                          {/* Logout */}
                          <div className="border-t border-app-border pt-1 mt-1">
                            <button
                              type="button"
                              onClick={handleLogout}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-app-error hover:bg-red-50 w-full transition-colors"
                            >
                              <LogOutIcon size={16} />
                              Logout
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </>
              ) : (
                /* Logged-out user */
                <div className="flex items-center gap-2">
                  {/* Desktop Sign In */}
                  <Link
                    to="/login"
                    className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-950 rounded-full hover:bg-green-900 transition-colors"
                  >
                    <UserIcon size={16} />
                    Sign In
                  </Link>

                  {/* Mobile Menu */}
                  {userMenuOpen ? (
                    <XIcon
                      className="md:hidden cursor-pointer"
                      onClick={() => setUserMenuOpen(false)}
                    />
                  ) : (
                    <MenuIcon
                      className="md:hidden cursor-pointer"
                      onClick={() => setUserMenuOpen(true)}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      {!userMenuOpen && (
        <div className="sm:hidden px-4 pb-3">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />

              <input
                type="text"
                placeholder="Search for groceries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-orange-50 rounded-full ring ring-app-orange/15 focus:ring-app-orange/30 outline-none text-sm"
              />
            </div>
          </form>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
