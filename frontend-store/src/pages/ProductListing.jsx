import { useState, useEffect } from 'react';
import { get_All_Products, searchProduct } from '../api/products';
import ProductCard from '../components/ProductCard';
import ChatInterface from '../components/ChatInterface';
import { Link } from 'react-router-dom';

function ProductListing() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await get_All_Products();
      setProducts(response.data || []);
    } catch (err) {
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchTerm.trim()) {
      fetchAllProducts();
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await searchProduct(searchTerm);
      setProducts(response.data || []);
    } catch (err) {
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HERO */}

      <section className="relative overflow-hidden bg-gray-950 px-6 py-16 text-white">

        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-purple-600/20 blur-3xl" />

        <div className="relative mx-auto max-w-6xl">

          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-400">
                RazorAI Commerce
              </p>

              <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
                Shop smarter.
                <br />
                <span className="text-blue-400">
                  Let AI handle the rest.
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-6 text-gray-400">
                Discover tech products with RazorAI, your intelligent
                shopping assistant for search, cart and checkout.
              </p>

            </div>

            <Link
              to="/cart"
              className="w-fit rounded-xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-semibold backdrop-blur transition hover:bg-white/20"
            >
              🛒 View Cart
            </Link>

          </div>

        </div>

      </section>

      {/* MAIN */}

      <main className="mx-auto max-w-6xl px-6 py-10">

        {/* SEARCH */}

        <div className="mb-10">

          <form
            onSubmit={handleSearch}
            className="mx-auto flex max-w-3xl gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm"
          >

            <input
              type="text"
              placeholder="Search keyboards, mice, headphones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="min-w-0 flex-1 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400"
            />

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:opacity-50"
            >
              Search
            </button>

          </form>

        </div>

        {/* SECTION HEADER */}

        <div className="mb-6 flex items-end justify-between">

          <div>

            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-blue-600">
              Store
            </p>

            <h2 className="mt-1 text-2xl font-black text-gray-900">
              Explore Products
            </h2>

          </div>

          {!loading && (
            <p className="text-xs text-gray-400">
              {products.length} products
            </p>
          )}

        </div>

        {/* LOADING */}

        {loading && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-[390px] animate-pulse rounded-2xl bg-gray-200"
              />
            ))}

          </div>
        )}

        {/* ERROR */}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center">

            <p className="text-2xl">
              ⚠️
            </p>

            <p className="mt-3 font-semibold text-red-700">
              {error}
            </p>

            <button
              onClick={fetchAllProducts}
              className="mt-5 rounded-xl bg-gray-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-blue-600"
            >
              Try Again
            </button>

          </div>
        )}

        {/* EMPTY */}

        {!loading && !error && products.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-16 text-center">

            <p className="text-4xl">
              🔎
            </p>

            <h3 className="mt-4 font-bold text-gray-900">
              No products found
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Try searching for something else.
            </p>

          </div>
        )}

        {/* PRODUCTS */}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        )}

      </main>

      {/* AI */}

      <ChatInterface />

    </div>
  );
}

export default ProductListing;