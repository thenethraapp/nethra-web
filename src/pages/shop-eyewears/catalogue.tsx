import { useState, useEffect } from "react";
import { SearchIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getCatalogue, type CatalogueItem } from "@/api/shop/getCatalogue";

const EyewearCatalogue = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [products, setProducts] = useState<CatalogueItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getCatalogue({ status: 'active', limit: 1000 });

            if (response.success && Array.isArray(response.data)) {
                setProducts(response.data);
            } else {
                throw new Error('Failed to load products');
            }
        } catch (err) {
            console.error('Error loading products:', err);
            setError(err instanceof Error ? err.message : 'Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(item => {
        const matchesSearch =
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    if (loading) {
        return (
            <section className="max-width mx-auto px-6 py-12">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-cyan"></div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="max-width mx-auto px-6 py-12">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-center">
                    <p>{error}</p>
                    <button
                        onClick={loadProducts}
                        className="mt-2 text-sm underline hover:no-underline"
                    >
                        Try again
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section className="max-width mx-auto px-6">
            <div className="flex items-center gap-2 w-full max-w-3xl py-6">
                <div className="bg-black/5 w-full h-10 py-1 px-2 rounded-lg flex items-center gap-2">
                    <SearchIcon size={18} color="#aaaaaa" />
                    <input
                        type="search"
                        placeholder="Search for any product"
                        className="text-sm h-full w-full border-none outline-none bg-transparent"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-darkgray">No products found.</p>
                </div>
            ) : (
                <section className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                    {filteredProducts.map((item) => (
                        <Link
                            key={item._id}
                            href={`/shop-eyewears/${item._id}`}
                            className="border-2 border-gray-100 rounded-2xl p-2 hover:border-primary-cyan/50 transition-all duration-300"
                        >
                            <div className="w-full h-36 relative rounded-lg overflow-hidden">
                                <Image
                                    src={item.imageUrl}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                    unoptimized={item.imageUrl.includes('cloudinary.com')}
                                />
                                {item.status === 'out_of_stock' && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <span className="text-white text-xs font-semibold bg-red-500 px-2 py-1 rounded">
                                            Out of Stock
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="pt-3">
                                <p className="font-normal text-darkgray text-sm line-clamp-1">{item.name}</p>
                                <div className="py-2 flex items-center justify-between">
                                    <p className="font-bold text-darkgray/80">₦{item.price.toLocaleString()}</p>
                                    <p className={`text-xs ${item.quantity === 0 ? "text-primary-yellow font-semibold" : "text-darkgray/80 font-normal"}`}>
                                        {item.quantity === 0 ? "sold out" : `(${item.quantity})`}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </section>
            )}

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
