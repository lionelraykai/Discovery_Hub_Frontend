import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "./ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ChevronDown, SlidersHorizontal } from "lucide-react";
import {
  fetchProducts,
  fetchCategories,
  setPage,
  setSelectedCategory
} from "../../store/productsSlice";
import { useQuery } from "@tanstack/react-query";
import { getCategories, getProducts } from "../../API/endpoints";

const ProductSkeleton = () => {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Skeleton Card Image */}
      <div className="aspect-[4/5] bg-slate-100 dark:bg-slate-800 rounded-2xl relative overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* Skeleton Card Details */}
      <div className="space-y-2.5 px-1">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-2 flex-1">
            {/* Brand */}
            <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full w-1/3" />
            {/* Title */}
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full w-3/4" />
            {/* Category */}
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full w-1/2" />
          </div>
          {/* Price */}
          <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded-full w-12" />
        </div>
        {/* Rating */}
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full w-16 mt-3" />
      </div>
    </div>
  );
};

const ProductGrid = () => {

  const dispatch = useDispatch();
  const {
    // products,
    // loading,
    // error,
    // page,
    // totalPages,
    // totalProducts,
    // categories,
    // selectedCategory
  } = useSelector((state) => state.products);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef(null);
  const limit = 10;

  const { data: productsData, isLoading: loading, isError: isProductsError, error: productError } = useQuery({
    queryKey: ['products', page, limit, selectedCategory?.name || null],
    queryFn: async () => {
      const response = await getProducts(page, limit, selectedCategory?.name || null);
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch products");
      }
    },

  })

  const {data:categories} = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await getCategories();
      if (response.data.success) {
        return response.data.categories;
      } else {
        throw new Error(response.data.message || "Failed to fetch categories");
      }
    },
  })
  const totalProducts = productsData?.totalProducts || 0;
  const products = productsData?.products || [];
  const totalPages = productsData?.totalPages || 1;
  const error = isProductsError ? (error?.message || "An error occurred while fetching products") : null; 

  // useEffect(() => {
  //   dispatch(fetchProducts({ page, limit, category: selectedCategory?.name || null }));
  // }, [dispatch, page, selectedCategory]);

  // useEffect(() => {
  //   dispatch(fetchCategories());
  // }, [dispatch]);

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
      setPage(newPage);
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  };

  const handleCategorySelect = (category) => {
    dispatch(setSelectedCategory(category));
    setFilterOpen(false);
     setPage(1);
  };

  if (loading) {
    return (
      <section className="space-y-12 relative overflow-hidden">
        {/* Local Scrollbar & Shimmer styles */}
        <style>{`
          .scrollbar-none::-webkit-scrollbar { display: none; }
          .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
          @keyframes shimmer {
            100% { transform: translateX(100%); }
          }
        `}</style>

        {/* Skeleton Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-100 dark:border-slate-800/60 pb-8 animate-pulse">
          <div className="space-y-3">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-full w-56" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full w-40" />
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-2xl w-36" />
            <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-2xl w-36 hidden md:block" />
          </div>
        </div>

        {/* Skeleton Pills Slider */}
        <div className="flex gap-2.5 overflow-x-auto pb-4 scrollbar-none animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-10 bg-slate-200 dark:bg-slate-700 rounded-full w-28 flex-shrink-0" />
          ))}
        </div>

        {/* Skeleton Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {[...Array(limit)].map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative max-w-lg w-full text-center glass rounded-[2.5rem] border border-red-100 dark:border-red-950/20 p-10 md:p-14 shadow-2xl overflow-hidden"
        >
          {/* Glowing Ambient Spots */}
          <div className="absolute -top-10 -left-10 w-44 h-44 bg-red-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/20 flex items-center justify-center text-red-500 dark:text-red-400 shadow-inner">
            <SlidersHorizontal size={26} className="rotate-90 animate-pulse" />
          </div>

          <h3 className="font-display font-extrabold text-2xl mb-3 text-slate-900 dark:text-white">
            Curations Temporarily Offline
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8">
            {error || "We encountered a minor disturbance in our collection database. Please attempt a reload or check back in a moment."}
          </p>

          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto px-10 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primary-hover btn-premium transition-all text-sm tracking-wide"
          >
            Reconnect Feed
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 120, damping: 18 }
    }
  };

  return (
    <section className="space-y-10 relative">
      {/* Local Scrollbar & Shimmer styles */}
      <style>{`
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>

      {/* Decorative Ambient Background Gradients */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Tier 1 Header: Title, Total Items & Main Action Dropdowns */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-100 dark:border-slate-800/60 pb-8">
        <div>
          <div className="flex items-center gap-2">
            <motion.h2
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white"
            >
              The Weekly Curated
            </motion.h2>
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse mt-2" />
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-slate-500 dark:text-slate-400 text-sm mt-2 font-medium"
          >
            We discovered <span className="text-primary font-bold">{totalProducts}</span> signature creations for you
          </motion.p>
        </div>

        {/* Filters and Action Buttons */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Dropdown Category Selector */}
          <div className="relative flex-1 md:flex-none" ref={filterRef}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFilterOpen((prev) => !prev)}
              className={`w-full md:w-auto h-12 rounded-xl flex items-center justify-center gap-3 px-6 transition-all border font-semibold text-sm ${selectedCategory
                ? "bg-primary/10 border-primary/20 text-primary shadow-sm hover:bg-primary/20"
                : "bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm"
                }`}
            >
              <SlidersHorizontal size={16} className={selectedCategory ? "text-primary" : "text-slate-400"} />
              <span>{selectedCategory ? selectedCategory.name : "Quick Filter"}</span>
              {selectedCategory && (
                <span className="flex items-center justify-center bg-primary text-white rounded-full w-5 h-5 text-[10px] font-bold">
                  1
                </span>
              )}
            </motion.button>

            <AnimatePresence>
              {filterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.96 }}
                  transition={{ type: "spring", duration: 0.3 }}
                  className="absolute right-0 mt-3 w-64 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800/80 z-50 overflow-hidden"
                >
                  <div className="px-5 py-3.5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.18em] border-b border-slate-50 dark:border-slate-900/60">
                    Categories
                  </div>
                  <ul className="max-h-80 overflow-y-auto p-2 space-y-1">
                    <li>
                      <button
                        onClick={() => handleCategorySelect(null)}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all ${!selectedCategory
                          ? "bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold shadow-md shadow-slate-900/10 dark:shadow-none"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50 font-medium"
                          }`}
                      >
                        All Categories
                      </button>
                    </li>
                    {categories.map((cat) => (
                      <li key={cat._id}>
                        <button
                          onClick={() => handleCategorySelect(cat)}
                          className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all ${selectedCategory?._id === cat._id
                            ? "bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold shadow-md shadow-slate-900/10 dark:shadow-none"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50 font-medium"
                            }`}
                        >
                          {cat.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sorting Option (Static Premium Placeholder) */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="hidden md:flex h-12 items-center gap-3 px-6 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-semibold text-sm hover:border-slate-300 dark:hover:border-slate-700 shadow-sm transition-all"
          >
            <span>Sort by Popularity</span>
            <ChevronDown size={16} className="text-slate-400 dark:text-slate-500" />
          </motion.button>
        </div>
      </div>

      {/* Tier 2 Header: Horizontal Categories Tabs (Ultra-premium Slider) */}
      <div className="flex items-center w-full overflow-x-auto pb-4 scrollbar-none border-b border-slate-100/60 dark:border-slate-900/30 gap-2.5">
        {/* All Categories Chip */}
        <button
          onClick={() => handleCategorySelect(null)}
          className="relative px-5 py-2.5 rounded-full text-xs md:text-sm font-semibold transition-all duration-300 flex-shrink-0"
          style={{ WebkitTapHighlightColor: "transparent" }}
        >
          <span className={`relative z-10 transition-colors duration-300 ${!selectedCategory ? 'text-white' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'}`}>
            All Collection
          </span>
          {!selectedCategory && (
            <motion.span
              layoutId="activeCategoryIndicator"
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="absolute inset-0 bg-slate-900 dark:bg-white rounded-full shadow-lg shadow-slate-900/10 dark:shadow-none"
            />
          )}
        </button>

        {/* Dynamic Category Chips */}
        {categories.map((cat) => {
          const isSelected = selectedCategory?._id === cat._id;
          return (
            <button
              key={cat._id}
              onClick={() => handleCategorySelect(cat)}
              className="relative px-5 py-2.5 rounded-full text-xs md:text-sm font-semibold transition-all duration-300 flex-shrink-0"
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <span className={`relative z-10 transition-colors duration-300 ${isSelected ? 'text-white' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'}`}>
                {cat.name}
              </span>
              {isSelected && (
                <motion.span
                  layoutId="activeCategoryIndicator"
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  className="absolute inset-0 bg-slate-900 dark:bg-white rounded-full shadow-lg shadow-slate-900/10 dark:shadow-none"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Product Cards Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16"
      >
        <AnimatePresence mode="popLayout">
          {products.map((product) => (
            <motion.div
              key={product._id}
              variants={itemVariants}
              layout
            >
              <ProductCard
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
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Tactical Premium Pagination Component */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="flex flex-col md:flex-row justify-center items-center gap-6 mt-20 pt-10 border-t border-slate-100 dark:border-slate-900/60"
      >
        <div className="flex items-center gap-6 glass dark:glass-dark rounded-2xl px-4 py-2 border border-slate-100 dark:border-slate-800/80 shadow-md">
          {/* Previous Page Arrow */}
          <motion.button
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className={`p-2.5 rounded-xl transition-all ${page === 1
              ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
              : 'text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-900'
              }`}
          >
            <ChevronLeft size={20} />
          </motion.button>

          {/* Individual Page Buttons */}
          <div className="flex items-center gap-1.5">
            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              if (
                totalPages <= 7 ||
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= page - 1 && pageNumber <= page + 1)
              ) {
                const isActive = page === pageNumber;
                return (
                  <motion.button
                    key={pageNumber}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`w-10 h-10 rounded-xl text-xs font-extrabold transition-all duration-300 ${isActive
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-lg shadow-slate-900/10 dark:shadow-none'
                      : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900/60'
                      }`}
                  >
                    {pageNumber}
                  </motion.button>
                );
              } else if (
                (pageNumber === 2 && page > 4) ||
                (pageNumber === totalPages - 1 && page < totalPages - 3)
              ) {
                return <span key={pageNumber} className="text-slate-300 dark:text-slate-700 font-bold px-1.5">...</span>;
              }
              return null;
            })}
          </div>

          {/* Next Page Arrow */}
          <motion.button
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className={`p-2.5 rounded-xl transition-all ${page === totalPages
              ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
              : 'text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-900'
              }`}
          >
            <ChevronRight size={20} />
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
};

export default ProductGrid;


