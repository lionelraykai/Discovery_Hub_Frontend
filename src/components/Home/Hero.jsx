import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <header className="mb-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      <div className="lg:col-span-5 space-y-6">
        <span className="text-[10px] font-black tracking-[0.2em] uppercase text-primary">Seasonal Drop 01</span>
        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-on-surface leading-none">
          Essential <br/> <span className="text-primary-container">Discovery.</span>
        </h1>
        <p className="text-base text-on-surface-variant max-w-sm leading-relaxed">
          A thoughtfully curated selection of modern essentials designed for those who appreciate the intersection of form and utility.
        </p>
        <div className="pt-2 flex gap-3">
          <button 
            className="bg-primary-container text-on-primary px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-primary/20 transition-all active:scale-95 text-sm"
            onClick={() => navigate("/signup")}
          >
            Explore All
          </button>
          <button className="bg-surface-container-highest text-on-surface px-6 py-3 rounded-lg font-semibold hover:bg-surface-container-high transition-all active:scale-95 text-sm">
            Our Story
          </button>
        </div>
      </div>
      <div className="lg:col-span-7 relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
        <img 
          className="w-full h-full object-cover" 
          alt="minimalist white product"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSbUAXlKPmSZ4Hdom9fxkS2xYT2Dm_sHD-gKhRMxnHPytEOIDN04Dsc4B-maeAdYqdT_28gdQ2XG2nWUvH_Qct5AYvPDOOGXX7RLyFlVQWpGfqcorIILGvYzuDPguWWB4NL4K7-GB9IELwCjA_pkZaawWzYoeF5LoZ1O2DsLTtqGSD4WnnAllvpWgTxXtFPKruG3wzOobtSZP1uJd--UK9WrW9N17XpE-xiKpkPuLdX-kKf4c5iGJpmBh99xOO1PfN2i0rkl0wu7I"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>
    </header>
  );
};

export default Hero;
