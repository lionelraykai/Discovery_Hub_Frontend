import { useState, useEffect, useRef } from "react";
import ProductCard from "./ProductCard";
import { getProducts, getCategories } from "../../API/endpoints";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories, fetchProduct, setPage, setSelectedCategory } from "../../slices/productSlice";

const ProductGrid = () => {
  const dispatch = useDispatch()
  const { products, loading, categories, totalProducts, selectedCategory, error, page, totalPages } = useSelector((state) => state.products)

  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef(null);
  const limit = 10;
  useEffect(() => {
    dispatch(fetchProduct({ page, limit, category: selectedCategory?.name }))
  }, [page, selectedCategory]);

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch(setPage(newPage));
    }
  };

  const handleCategorySelect = (category) => {
    dispatch(setSelectedCategory(category));
    setFilterOpen(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-error">
        <p className="font-bold">Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-primary text-on-primary rounded-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-lg font-bold tracking-tight">The Weekly Curated</h2>
          <p className="text-on-surface-variant text-xs">{totalProducts} objects found in your selection</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Filter button with category dropdown */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setFilterOpen((prev) => !prev)}
              className={`p-2 rounded-lg flex items-center gap-2 px-4 transition-all ${selectedCategory
                ? "bg-primary text-on-primary"
                : "bg-surface-container text-on-surface hover:bg-surface-container-high"
                }`}
            >
              <span className="material-symbols-outlined text-xl">tune</span>
              <span className="text-xs font-medium">
                {selectedCategory ? selectedCategory.name : "Category"}
              </span>
              {selectedCategory && (
                <span
                  className="material-symbols-outlined text-base leading-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCategorySelect(null);
                  }}
                >
                  close
                </span>
              )}
            </button>

            {filterOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-surface rounded-xl shadow-xl border border-outline-variant z-50 overflow-hidden animate-fadeIn">
                <div className="px-4 py-2 text-xs font-semibold text-on-surface-variant uppercase tracking-widest border-b border-outline-variant">
                  Categories
                </div>
                <ul className="max-h-64 overflow-y-auto">
                  <li>
                    <button
                      onClick={() => handleCategorySelect(null)}
                      className={`w-full text-left px-4 py-2.5 text-xs transition-colors ${!selectedCategory
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-on-surface hover:bg-surface-container"
                        }`}
                    >
                      All Categories
                    </button>
                  </li>
                  {categories.map((cat) => (
                    <li key={cat._id}>
                      <button
                        onClick={() => handleCategorySelect(cat)}
                        className={`w-full text-left px-4 py-2.5 text-xs transition-colors ${selectedCategory?._id === cat._id
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-on-surface hover:bg-surface-container"
                          }`}
                      >
                        {cat.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <button className="p-2 rounded-lg bg-surface-container text-on-surface flex items-center gap-2 px-4 hover:bg-surface-container-high transition-all">
            <span className="text-xs font-medium">Popularity</span>
            <span className="material-symbols-outlined text-xl">keyboard_arrow_down</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            id={product._id}
            title={product.name}
            category={product.category}
            price={product.price}
            image={product.images && product.images[0]}
            outOfStock={product.countInStock === 0}
            badge={product.countInStock > 0 && product.countInStock < 5 ? "Low Stock" : null}
            brand={product.brand}
            rating={product.rating}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-4 mt-12 py-8 border-t border-outline-variant">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className={`flex items-center gap-1 px-4 py-2 rounded-lg transition-all ${page === 1
            ? 'text-outline cursor-not-allowed'
            : 'text-on-surface hover:bg-surface-container-high'
            }`}
        >
          <span className="material-symbols-outlined text-xl">chevron_left</span>
          <span className="text-xs font-medium">Previous</span>
        </button>

        <div className="flex items-center gap-2">
          {[...Array(totalPages)].map((_, index) => {
            const pageNumber = index + 1;
            // Basic logic to show limited page numbers if totalPages is high
            if (
              totalPages <= 7 ||
              pageNumber === 1 ||
              pageNumber === totalPages ||
              (pageNumber >= page - 1 && pageNumber <= page + 1)
            ) {
              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${page === pageNumber
                    ? 'bg-primary text-on-primary shadow-lg shadow-primary/20'
                    : 'text-on-surface hover:bg-surface-container-high'
                    }`}
                >
                  {pageNumber}
                </button>
              );
            } else if (
              (pageNumber === 2 && page > 4) ||
              (pageNumber === totalPages - 1 && page < totalPages - 3)
            ) {
              return <span key={pageNumber} className="text-outline">...</span>;
            }
            return null;
          })}
        </div>

        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className={`flex items-center gap-1 px-4 py-2 rounded-lg transition-all ${page === totalPages
            ? 'text-outline cursor-not-allowed'
            : 'text-on-surface hover:bg-surface-container-high'
            }`}
        >
          <span className="text-xs font-medium">Next</span>
          <span className="material-symbols-outlined text-xl">chevron_right</span>
        </button>
      </div>
    </section>
  );
};

export default ProductGrid;

