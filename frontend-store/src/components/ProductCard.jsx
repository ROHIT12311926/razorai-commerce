import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  const isOutOfStock = product.stock <= 0;

  return (
    <Link
      to={`/product/${product._id}`}
      className="group block h-full"
    >
      <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">

        {/* Top glow */}

        <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Product visual */}

        <div className="relative mb-5 flex h-44 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100">

          <div className="text-6xl transition-transform duration-500 group-hover:scale-110">
            {product.category?.toLowerCase().includes('keyboard')
              ? '⌨️'
              : product.category?.toLowerCase().includes('mouse')
              ? '🖱️'
              : product.category?.toLowerCase().includes('headphone')
              ? '🎧'
              : product.category?.toLowerCase().includes('monitor')
              ? '🖥️'
              : '⚡'}
          </div>

          {/* Stock badge */}

          <div
            className={`absolute right-3 top-3 rounded-full px-3 py-1 text-[10px] font-semibold ${
              isOutOfStock
                ? 'bg-red-100 text-red-600'
                : product.stock <= 5
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-emerald-100 text-emerald-700'
            }`}
          >
            {isOutOfStock
              ? 'Out of stock'
              : product.stock <= 5
              ? `Only ${product.stock} left`
              : 'In stock'}
          </div>

        </div>

        {/* Category */}

        {product.category && (
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">
            {product.category}
          </p>
        )}

        {/* Name */}

        <h3 className="text-lg font-bold text-gray-900 transition-colors group-hover:text-blue-600">
          {product.name}
        </h3>

        {/* Description */}

        <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500">
          {product.description}
        </p>

        {/* Features */}

        <div className="mt-4 flex min-h-[28px] flex-wrap gap-2">

          {product.features?.slice(0, 3).map((feature, index) => (
            <span
              key={index}
              className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[10px] font-medium text-gray-600"
            >
              {feature}
            </span>
          ))}

        </div>

        {/* Bottom */}

        <div className="mt-auto flex items-end justify-between border-t border-gray-100 pt-5">

          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-400">
              Price
            </p>

            <p className="mt-1 text-2xl font-black text-gray-900">
              ₹{Number(product.price).toLocaleString('en-IN')}
            </p>
          </div>

          <span className="rounded-xl bg-gray-900 px-4 py-2.5 text-xs font-semibold text-white transition-all duration-300 group-hover:bg-blue-600">
            View →
          </span>

        </div>

      </div>
    </Link>
  );
}

export default ProductCard;