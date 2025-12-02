import { useState } from "react";
import { SearchIcon, FilterIcon } from "lucide-react";
import Image from "next/image";
import { EyewearsData } from "../../utils/data";

const EyewearCatalogue = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const categories = ["All", ...new Set(EyewearsData.map(item => item.brand))];

    const filteredEyewear = EyewearsData.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.brand.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = item.brand === selectedCategory || selectedCategory === "All";
        return matchesCategory && matchesSearch;
    });

    return (
        <section className="max-width mx-auto px-6">
            <div className="flex items-center gap-2 w-full max-w-3xl py-6">
                <div className="bg-black/5 w-full h-10 py-1 px-2 rounded-lg flex items-center gap-2">
                    <SearchIcon size={18} color="#aaaaaa" />
                    <input
                        type="search"
                        placeholder="Search for any brand"
                        className="text-sm h-full w-full border-none outline-none bg-transparent"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button className="h-10 px-3 text-sm bg-primary-cyan/10 border border-primary-cyan/20 rounded">
                    <FilterIcon size={20} color="#0ab2e180" />
                </button>
            </div>

            <div className="py-6 flex items-center gap-2 overflow-x-auto scrollbar-hide">
                {categories.map((category, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedCategory(category)}
                        className={`text-xs whitespace-nowrap rounded py-1 px-3 w-fit h-6 flex items-center justify-center transition-all ${selectedCategory === category
                                ? "text-darkcyan bg-primary-cyan/10 border border-primary-cyan/20"
                                : "text-darkcyan bg-transparent border border-gray-200 hover:border-primary-cyan/20 hover:bg-primary-cyan/5"
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            <section className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                {filteredEyewear.map((item) => (
                    <div key={item.id} className="border-2 border-gray-100 rounded-2xl p-2">
                        <div className="w-full h-36 relative rounded-lg overflow-hidden">
                            <Image
                                src={item.src}
                                alt={item.name}
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            />
                        </div>
                        <div className="pt-3">
                            <p className="font-normal text-darkgray text-sm">{item.name}</p>
                            <div className="py-2 flex items-center justify-between">
                                <p className="font-bold text-darkgray/80">N{item.price}</p>
                                <p className={`text-xs ${item.available === "sold out" ? "text-primary-yellow font-semibold" : "text-darkgray/80 font-normal"}`}>
                                    {item.available === "sold out" ? "sold out" : `(${item.available})`}
                                </p>
                            </div>
                        </div>
                        <button className="bg-primary-cyan hover:bg-primary-cyan/70 hover:shadow transition-all duration-300 ease-in-out text-white cursor-pointer w-full text-center text-sm font-semibold py-2 rounded-lg">
                            Add to Cart
                        </button>
                    </div>
                ))}
            </section>

            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </section>
    );
};

export default EyewearCatalogue;