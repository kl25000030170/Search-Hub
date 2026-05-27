import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Heart, ShoppingCart, Truck, RotateCcw, Shield, ChevronRight, Plus, Minus } from 'lucide-react';
import { MOCK_PRODUCTS } from '../utils/constants';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';
import { formatCurrency } from '../utils/formatters';
import { calculateDiscountedPrice } from '../utils/helpers';

const StarRating = ({ rating, max = 5 }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: max }).map((_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground'}`} />
    ))}
  </div>
);

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = MOCK_PRODUCTS.find(p => p.id === Number(id));

  const addItem = useCartStore(s => s.addItem);
  const { items: wishlistItems, toggleWishlist } = useWishlistStore();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-black mb-4">Product not found</h2>
        <button onClick={() => navigate('/products')} className="btn-primary">Back to Products</button>
      </div>
    );
  }

  const isWishlisted = wishlistItems.some(w => w.id === product.id);
  const discountedPrice = calculateDiscountedPrice(product.price, product.discount);
  const related = MOCK_PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    addItem(product, quantity, selectedColor || product.colors?.[0], selectedSize || product.sizes?.[0]);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    addItem(product, quantity, selectedColor || product.colors?.[0], selectedSize || product.sizes?.[0]);
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground font-medium line-clamp-1">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-muted border border-border">
            <AnimatePresence mode="wait">
              <motion.img key={selectedImage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                src={product.images[selectedImage]} alt={product.title}
                className="w-full h-full object-cover"
                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'; }}
              />
            </AnimatePresence>
            {product.discount > 0 && <span className="absolute top-4 left-4 badge-orange text-sm">{product.discount}% OFF</span>}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === i ? 'border-primary' : 'border-border hover:border-primary/40'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" onError={e => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200'; }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-5">
          <div>
            <span className="text-sm font-semibold text-primary">{product.brand}</span>
            <h1 className="text-2xl font-black mt-1 leading-tight">{product.title}</h1>
          </div>

          <div className="flex items-center gap-3">
            <StarRating rating={product.rating} />
            <span className="font-bold text-sm">{product.rating}</span>
            <span className="text-sm text-muted-foreground">({product.reviewsCount} reviews)</span>
          </div>

          <div className="flex items-center gap-3 py-3 border-y border-border">
            <span className="text-3xl font-black text-foreground">{formatCurrency(discountedPrice)}</span>
            {product.discount > 0 && <>
              <span className="price-original text-base">{formatCurrency(product.price)}</span>
              <span className="price-discount-badge">Save {formatCurrency(product.price - discountedPrice)}</span>
            </>}
          </div>

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <p className="text-sm font-semibold mb-2">Color</p>
              <div className="flex gap-2">
                {product.colors.map(color => (
                  <button key={color} onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === color ? 'border-primary scale-110' : 'border-transparent hover:border-muted-foreground'}`}
                    style={{ backgroundColor: color }} title={color}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes && product.sizes.length > 1 && (
            <div>
              <p className="text-sm font-semibold mb-2">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button key={size} onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 text-sm font-semibold rounded-xl border-2 transition-all ${selectedSize === size ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/40'}`}>
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-border rounded-xl overflow-hidden">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors"><Minus className="w-4 h-4" /></button>
              <span className="w-12 text-center font-bold text-sm">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors"><Plus className="w-4 h-4" /></button>
            </div>
            <span className={`text-sm font-semibold ${product.inStock ? 'text-success' : 'text-destructive'}`}>
              {product.inStock ? `${product.stockCount} in stock` : 'Out of Stock'}
            </span>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-3">
            <button onClick={handleAddToCart} disabled={!product.inStock}
              className={`btn-primary flex-1 h-12 ${addedToCart ? 'bg-success' : ''}`}>
              <ShoppingCart className="w-4 h-4" />
              {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
            </button>
            <button onClick={handleBuyNow} disabled={!product.inStock} className="btn-secondary flex-1 h-12 font-bold">
              Buy Now
            </button>
            <button onClick={() => toggleWishlist(product)}
              className={`btn-icon w-12 h-12 flex-shrink-0 ${isWishlisted ? 'bg-red-500 text-white border-red-500' : ''}`}>
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-white' : ''}`} />
            </button>
          </div>

          {/* Delivery Info */}
          <div className="space-y-2 p-4 bg-secondary/50 rounded-2xl border border-border">
            {[
              { icon: Truck, text: 'Free delivery on orders above $50' },
              { icon: RotateCcw, text: '30-day hassle-free returns' },
              { icon: Shield, text: '1-year manufacturer warranty' },
            ].map(item => (
              <div key={item.text} className="flex items-center gap-3 text-sm text-muted-foreground">
                <item.icon className="w-4 h-4 text-primary flex-shrink-0" />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Description & Specs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        <div className="card p-6">
          <h3 className="font-bold text-base mb-3">Description</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
        </div>
        {product.specifications?.length > 0 && (
          <div className="card p-6">
            <h3 className="font-bold text-base mb-3">Specifications</h3>
            <div className="space-y-2">
              {product.specifications.map(spec => (
                <div key={spec.name} className="flex justify-between text-sm py-2 border-b border-border last:border-0">
                  <span className="text-muted-foreground font-medium">{spec.name}</span>
                  <span className="font-semibold text-right">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Reviews */}
      {product.reviews?.length > 0 && (
        <div className="mb-16">
          <h3 className="section-heading mb-6">Customer Reviews</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {product.reviews.map((rev, i) => (
              <div key={i} className="card p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-amber-500 flex items-center justify-center text-white text-xs font-bold">{rev.user[0]}</div>
                    <span className="text-sm font-bold">{rev.user}</span>
                  </div>
                  <StarRating rating={rev.rating} />
                </div>
                <p className="text-sm text-muted-foreground">{rev.comment}</p>
                <p className="text-xs text-muted-foreground">{rev.date}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Products */}
      {related.length > 0 && (
        <div>
          <h3 className="section-heading mb-6">You might also like</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {related.map(p => (
              <div key={p.id} onClick={() => navigate(`/products/${p.id}`)} className="product-card cursor-pointer">
                <div className="aspect-square bg-muted overflow-hidden">
                  <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={e => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300'; }} />
                </div>
                <div className="p-3">
                  <p className="text-xs text-muted-foreground">{p.brand}</p>
                  <p className="text-sm font-semibold line-clamp-1">{p.title}</p>
                  <p className="text-sm font-black mt-1">{formatCurrency(calculateDiscountedPrice(p.price, p.discount))}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
