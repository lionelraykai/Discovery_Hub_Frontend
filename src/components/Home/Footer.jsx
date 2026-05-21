const Footer = () => {
  return (
    <footer className="w-full mt-24 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-12 py-16 flex flex-col md:flex-row justify-between items-start gap-8 font-['Inter'] text-sm tracking-wide uppercase font-medium">
        <div className="space-y-6">
          <span className="text-lg font-bold text-slate-900 dark:text-white">CURATED</span>
          <p className="max-w-xs normal-case tracking-normal font-normal text-slate-500">Elevating the everyday through thoughtful curation and uncompromising quality.</p>
        </div>
        <div className="grid grid-cols-2 gap-x-16 gap-y-4">
          <a className="text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 underline-offset-4 hover:underline opacity-80 hover:opacity-100 transition-opacity" href="#">Privacy Policy</a>
          <a className="text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 underline-offset-4 hover:underline opacity-80 hover:opacity-100 transition-opacity" href="#">Terms of Service</a>
          <a className="text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 underline-offset-4 hover:underline opacity-80 hover:opacity-100 transition-opacity" href="#">Shipping & Returns</a>
          <a className="text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 underline-offset-4 hover:underline opacity-80 hover:opacity-100 transition-opacity" href="#">Contact Us</a>
        </div>
        <div className="text-slate-400 dark:text-slate-500 text-xs tracking-widest self-end">
          © 2024 CURATED CANVAS. ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
