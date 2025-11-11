import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Header from "../components/header";

export default function Home() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:3000/api/v2/products?page=${pageNumber}&limit=6`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const result = await res.json();
      const { data, metadata } = result;
      setProducts(data.products || []);
      setTotalPages(metadata.totalPages);
    } catch (err) {
      console.error(err);
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onLogout={logout} />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onLogout={logout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="bg-gray-400 rounded-lg px-6 py-4 mb-8">
          <h2 className="text-2xl font-bold text-black">All Products</h2>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl overflow-hidden shadow animate-pulse"
              >
                <div className="bg-gray-200 h-64"></div>
                <div className="p-4">
                  <div className="bg-gray-200 h-4 rounded mb-3"></div>
                  <div className="bg-gray-200 h-3 rounded w-3/4 mb-4"></div>
                  <div className="bg-gray-200 h-10 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No products available
            </h3>
            <p className="text-gray-600">Check back later for new items.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                onClick={() => navigate(`/products/${product._id}`)}
              >
                {/* Product Image */}
                <div className="relative bg-gray-100 h-64 overflow-hidden">
                  <img
                    src={
                      product.imageUrls?.[0]
                        ? `http://localhost:3000${product.imageUrls[0]}`
                        : "https://via.placeholder.com/400"
                    }
                    alt={product.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  {product.stock === 0 && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      Out of Stock
                    </div>
                  )}
                  {product.stock > 0 && product.stock < 10 && (
                    <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      Low Stock
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-1">
                    {product.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3 h-10">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl font-bold text-gray-900">
                      ${product.price}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/products/${product._id}`);
                    }}
                    className="w-full bg-gray-900 text-white py-2.5 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                page <= 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-900 hover:bg-gray-100 shadow"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                      page === pageNum
                        ? "bg-gray-900 text-white"
                        : "bg-white text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                page >= totalPages
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-900 hover:bg-gray-100 shadow"
              }`}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
