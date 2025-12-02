import EyewearCatalogue from "./catalogue";

const ShopEyewears = () => {
  return (
    <main className="pb-12">
      {/* Enhanced Header */}
      <header className="max-width px-6 mx-auto pt-12">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-darkcyan mb-4 tracking-tight">
          Discover Eyewear that Fits Your Lifestyle
        </h1>
        <p className="w-full max-w-2xl  text-darkgray text-sm md:text-base leading-relaxed">
          Explore our curated collection of designer and everyday frames —
          crafted for comfort, style, and clarity. Whether it’s work, travel, or
          leisure, find lenses that help you see and look your best.
        </p>

      </header>

      <EyewearCatalogue />
    </main>
  );
};

export default ShopEyewears;
