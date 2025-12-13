import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { ArrowLeft, CreditCard, Plus, Minus } from "lucide-react";
import { getCatalogueItemById, type CatalogueItem } from "@/api/shop/getCatalogue";
import { createOrder, type CreateOrderData } from "@/api/shop/createOrder";
import { toast } from "sonner";

const ProductDetailPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [product, setProduct] = useState<CatalogueItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showOrderForm, setShowOrderForm] = useState(false);
    const [orderLoading, setOrderLoading] = useState(false);
    const [orderData, setOrderData] = useState({
        email: "",
        phone: "",
        name: "",
        quantity: 1,
        paymentMethod: undefined as "transfer" | "card" | undefined,
        shippingAddress: "",
        notes: ""
    });

    useEffect(() => {
        if (id && typeof id === 'string') {
            loadProduct(id);
        }
    }, [id]);

    const loadProduct = async (productId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await getCatalogueItemById(productId);

            if (response.success && response.data) {
                setProduct(response.data);
            } else {
                throw new Error('Product not found');
            }
        } catch (err) {
            console.error('Error loading product:', err);
            setError(err instanceof Error ? err.message : 'Failed to load product');
        } finally {
            setLoading(false);
        }
    };

    const handleOrderSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!product) return;

        // Validate form
        if (!orderData.email.trim()) {
            toast.error("Email is required");
            return;
        }
        if (!orderData.phone.trim()) {
            toast.error("Phone number is required");
            return;
        }
        if (orderData.quantity < 1) {
            toast.error("Quantity must be at least 1");
            return;
        }
        if (orderData.quantity > product.quantity) {
            toast.error(`Only ${product.quantity} items available`);
            return;
        }

        try {
            setOrderLoading(true);
            const orderPayload: CreateOrderData = {
                productId: product._id,
                email: orderData.email.trim(),
                phone: orderData.phone.trim(),
                name: orderData.name.trim() || undefined,
                quantity: orderData.quantity,
                paymentMethod: orderData.paymentMethod || undefined,
                shippingAddress: orderData.shippingAddress.trim() || undefined,
                notes: orderData.notes.trim() || undefined
            };

            const response = await createOrder(orderPayload);

            if (response.success) {
                toast.success("Order placed successfully!");
                // Reset form
                setOrderData({
                    email: "",
                    phone: "",
                    name: "",
                    quantity: 1,
                    paymentMethod: undefined,
                    shippingAddress: "",
                    notes: ""
                });
                setShowOrderForm(false);
            } else {
                throw new Error(response.message || 'Failed to place order');
            }
        } catch (err) {
            console.error('Error placing order:', err);
            toast.error(err instanceof Error ? err.message : 'Failed to place order');
        } finally {
            setOrderLoading(false);
        }
    };

    if (loading) {
        return (
            <main className="pb-12">
                <div className="max-width px-6 mx-auto pt-12">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-cyan"></div>
                    </div>
                </div>
            </main>
        );
    }

    if (error || !product) {
        return (
            <main className="pb-12">
                <div className="max-width px-6 mx-auto pt-12">
                    <button
                        onClick={() => router.push('/shop-eyewears')}
                        className="mb-4 flex items-center gap-2 text-primary-cyan hover:text-primary-cyan/80"
                    >
                        <ArrowLeft size={20} />
                        Back to Catalogue
                    </button>
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                        <p>{error || 'Product not found'}</p>
                    </div>
                </div>
            </main>
        );
    }

    const totalAmount = product.price * orderData.quantity;
    const isOutOfStock = product.status === 'out_of_stock' || product.quantity === 0;

    return (
        <main className="pb-12">
            <div className="max-width px-6 mx-auto pt-12">
                <button
                    onClick={() => router.push('/shop-eyewears')}
                    className="mb-6 flex items-center gap-2 text-primary-cyan hover:text-primary-cyan/80 transition-colors"
                >
                    <ArrowLeft size={20} />
                    Back to Catalogue
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Product Image */}
                    <div className="relative w-full h-96 rounded-2xl overflow-hidden bg-gray-100">
                        <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover"
                            unoptimized={product.imageUrl.includes('cloudinary.com')}
                        />
                    </div>

                    {/* Product Details */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold text-primary-darkcyan mb-4">
                                {product.name}
                            </h1>
                            <p className="text-2xl font-bold text-primary-darkcyan mb-4">
                                ₦{product.price.toLocaleString()}
                            </p>
                            <div className="mb-4">
                                <p className="text-sm text-darkgray mb-2">
                                    <span className="font-semibold">Available:</span> {product.quantity} items
                                </p>
                                {isOutOfStock && (
                                    <p className="text-sm text-red-500 font-semibold">
                                        Currently out of stock
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-primary-darkcyan mb-2">
                                Description
                            </h2>
                            <p className="text-darkgray leading-relaxed whitespace-pre-wrap">
                                {product.description}
                            </p>
                        </div>

                        {/* Action Buttons */}
                        {!isOutOfStock && (
                            <div className="pt-4">
                                <button
                                    onClick={() => setShowOrderForm(true)}
                                    className="bg-primary-darkcyan hover:bg-primary-darkcyan/80 hover:shadow transition-all duration-300 ease-in-out text-white cursor-pointer w-full text-center text-sm font-semibold py-3 rounded-lg flex items-center justify-center gap-2"
                                >
                                    <CreditCard size={20} />
                                    Order Now
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Order Form Modal */}
                {showOrderForm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-bold text-gray-900">Place Order</h2>
                                    <button
                                        onClick={() => setShowOrderForm(false)}
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <form onSubmit={handleOrderSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={orderData.email}
                                        onChange={(e) => setOrderData({ ...orderData, email: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-cyan"
                                        required
                                        placeholder="your@email.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        value={orderData.phone}
                                        onChange={(e) => setOrderData({ ...orderData, phone: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-cyan"
                                        required
                                        placeholder="+234 800 000 0000"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={orderData.name}
                                        onChange={(e) => setOrderData({ ...orderData, name: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-cyan"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Quantity <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (orderData.quantity > 1) {
                                                    setOrderData({ ...orderData, quantity: orderData.quantity - 1 });
                                                }
                                            }}
                                            disabled={orderData.quantity <= 1}
                                            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                                            aria-label="Decrease quantity"
                                        >
                                            <Minus size={18} className="text-gray-700" />
                                        </button>
                                        <input
                                            type="number"
                                            min="1"
                                            max={product.quantity}
                                            value={orderData.quantity}
                                            onChange={(e) => {
                                                const value = parseInt(e.target.value) || 1;
                                                const clampedValue = Math.max(1, Math.min(value, product.quantity));
                                                setOrderData({ ...orderData, quantity: clampedValue });
                                            }}
                                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-cyan text-center"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (orderData.quantity < product.quantity) {
                                                    setOrderData({ ...orderData, quantity: orderData.quantity + 1 });
                                                }
                                            }}
                                            disabled={orderData.quantity >= product.quantity}
                                            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                                            aria-label="Increase quantity"
                                        >
                                            <Plus size={18} className="text-gray-700" />
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Available: {product.quantity} items
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Payment Method <span className="text-gray-400 text-xs">(Optional - will be added later)</span>
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setOrderData({ ...orderData, paymentMethod: orderData.paymentMethod === "transfer" ? undefined : "transfer" })}
                                            className={`px-4 py-3 border-2 rounded-lg transition-all ${orderData.paymentMethod === "transfer"
                                                ? "border-primary-cyan bg-primary-cyan/10"
                                                : "border-gray-300 hover:border-gray-400"
                                                }`}
                                        >
                                            Bank Transfer
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setOrderData({ ...orderData, paymentMethod: orderData.paymentMethod === "card" ? undefined : "card" })}
                                            className={`px-4 py-3 border-2 rounded-lg transition-all ${orderData.paymentMethod === "card"
                                                ? "border-primary-cyan bg-primary-cyan/10"
                                                : "border-gray-300 hover:border-gray-400"
                                                }`}
                                        >
                                            Card Payment
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Shipping Address (Optional)
                                    </label>
                                    <textarea
                                        value={orderData.shippingAddress}
                                        onChange={(e) => setOrderData({ ...orderData, shippingAddress: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-cyan"
                                        rows={3}
                                        placeholder="Enter your delivery address"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Notes (Optional)
                                    </label>
                                    <textarea
                                        value={orderData.notes}
                                        onChange={(e) => setOrderData({ ...orderData, notes: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-cyan"
                                        rows={2}
                                        placeholder="Any additional notes or instructions"
                                    />
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-700">Subtotal:</span>
                                        <span className="font-semibold">₦{product.price.toLocaleString()} × {orderData.quantity}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-gray-900">Total:</span>
                                        <span className="text-lg font-bold text-primary-cyan">₦{totalAmount.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowOrderForm(false)}
                                        className="flex-1 px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                        disabled={orderLoading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-3 bg-primary-cyan text-white rounded-lg hover:bg-primary-cyan/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={orderLoading}
                                    >
                                        {orderLoading ? "Processing..." : "Place Order"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
};

export default ProductDetailPage;
