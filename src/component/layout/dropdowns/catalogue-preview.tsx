"use client";
import Link from "next/link";

const CataloguePreview = () => {

  return (
    <section className="bg-white shadow-xl rounded-2xl w-full max-w-md md:max-w-xl p-3 border border-gray-100 transition-all duration-300">
      <div className="grid md:grid-cols-5 gap-6 items-center">
        <div className="col-span-2 h-full">
          <h3 className="text-primary-darkcyan font-semibold mb-3 text-base">
            Available Brands
          </h3>
          <ul className="space-y-2 md:space-y-3">
            {["RayBan", "Gucci", "Cartier", "Lacoste"].map((brand) => (
              <li key={brand} className="text-darkgray text-sm font-medium hover:text-primary-cyan transition-colors cursor-pointer">
                {brand}
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-3 bg-primary-darkcyan rounded-2xl p-3 flex flex-col gap-3">
          <img
            src="/images/eyewear-catalogue/eyewear-rayban-01.jpeg"
            alt="Featured eyewear collection"
            className="object-cover w-full h-36 md:h-48 rounded-xl"
          />

          <div>
            <h4 className="text-white font-medium text-sm md:text-base leading-snug mb-2">
            Shop quality eyewear
            </h4>
            <Link
              href="/shop-eyewears"
              className="inline-flex items-center justify-center border border-white/80 text-white text-xs md:text-sm rounded-full px-4 py-2 font-medium hover:bg-white hover:text-darkgray transition-all duration-300"
            >
              Browse Catalogue
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CataloguePreview;