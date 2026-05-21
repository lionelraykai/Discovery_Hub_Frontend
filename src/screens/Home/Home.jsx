import Navbar from "../../components/Home/Navbar";
import Hero from "../../components/Home/Hero";
import ProductGrid from "../../components/Home/ProductGrid";
import BentoSection from "../../components/Home/BentoSection";
import Footer from "../../components/Home/Footer";

const Home = () => {
  return (
    <div className="bg-surface font-body text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen">
      <Navbar />
      
      <main className="pt-24 pb-12 max-w-[1440px] mx-auto px-8">
        <Hero />
        <ProductGrid />
        <BentoSection />
      </main>

      <Footer />
    </div>
  );
};

export default Home;
