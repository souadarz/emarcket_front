import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ChevronLeft, ShoppingCart, Heart, Share2 } from "lucide-react";
import Header from "../components/header";

export default function ProductDetails() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const res = await fetch(`http://localhost:3000/api/v2/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch product");
        const result = await res.json();
        setProduct(result.data.product);
      } catch (err) {
        console.error(err);
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onLogout={logout} />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onLogout={logout} />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-700">{error || "Product not found"}</p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
            >
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  const images =
    product.imageUrls && product.imageUrls.length > 0
      ? product.imageUrls.map((url) => `http://localhost:3000${url}`)
      : ["https://via.placeholder.com/600"];


  return (
    <div className="min-h-screen bg-gray-50">
      <Header onLogout={logout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-6 font-medium"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Products
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Images Section */}
            <div>
              <div className="bg-gray-100 rounded-lg mb-4 overflow-hidden">
                <img
                  src={images[selectedImage]}
                  alt={product.title}
                  className="w-full h-96 object-cover"
                />
              </div>

              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`bg-gray-100 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === idx
                          ? "border-gray-900"
                          : "border-transparent hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.title} ${idx + 1}`}
                        className="w-full h-20 object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="mb-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.title}
                </h1>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-4xl font-bold text-gray-900">
                    ${product.price}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm font-medium text-gray-700">
                    Stock:
                  </span>
                  {product.stock > 0 ? (
                    <span className="text-sm text-green-600 font-medium">
                      InStock
                    </span>
                  ) : (
                    <span className="text-sm text-red-600 font-medium">
                      Out of stock
                    </span>
                  )}
                </div>
              </div>

              {product.stock > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold"
                    >
                      -
                    </button>
                    <span className="w-16 text-center font-semibold text-lg">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity(Math.min(product.stock, quantity + 1))
                      }
                      className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              <div className="flex gap-3 mb-6">
                <button
                  disabled={product.stock === 0}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-colors ${
                    product.stock === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gray-900 text-white hover:bg-gray-800"
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
                <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Heart className="w-5 h-5 text-gray-700" />
                </button>
                <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Share2 className="w-5 h-5 text-gray-700" />
                </button>
              </div>

              {/* <div className="border-t pt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Category</span>
                  <span className="font-medium text-gray-900">
                    {product.category || "General"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">SKU</span>
                  <span className="font-medium text-gray-900"> */}
                    {/* {product._id.slice(-8).toUpperCase()} */}
                  {/* </span>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
