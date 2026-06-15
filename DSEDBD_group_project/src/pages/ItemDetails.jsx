import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ArrowLeft, ChevronRight, Tag } from 'lucide-react';
import { useCatalogStore } from '../store/useCatalogStore';
import { formatCurrency } from '../utils/formatters';

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const getProduct = useCatalogStore((s) => s.getProduct);
  const products = useCatalogStore((s) => s.products);
  const incrementViews = useCatalogStore((s) => s.incrementViews);

  const item = getProduct(id);

  useEffect(() => {
    if (item) incrementViews();
  }, [item, incrementViews]);

  if (!item) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-black mb-4">Item not found</h2>
        <button onClick={() => navigate('/products')} className="btn-primary">
          Browse Products
        </button>
      </div>
    );
  }

  const related = products
    .filter((i) => i.category === item.category && i.id !== item.id)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/products" className="hover:text-primary">Products</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground font-medium line-clamp-1">{item.title}</span>
      </nav>

      <button onClick={() => navigate(-1)} className="btn-ghost text-sm mb-6 flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        <div className="aspect-square rounded-3xl overflow-hidden bg-muted border border-border">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src =
                'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600';
            }}
          />
        </div>

        <div className="space-y-5">
          <span className="badge-orange">{item.category}</span>
          <h1 className="text-3xl font-black tracking-tight">{item.title}</h1>
          <p className="text-sm text-muted-foreground">{item.brand}</p>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              <span className="font-bold">{item.rating}</span>
            </div>
            <span className="text-sm text-muted-foreground">({item.reviews} reviews)</span>
            <span className="text-2xl font-black ml-auto">{formatCurrency(item.price)}</span>
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>

          <div className="card p-5 space-y-3">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <Tag className="w-4 h-4 text-primary" /> Attributes
            </h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(item.attributes || []).map((attr) => (
                <div key={attr.name} className="bg-secondary/30 rounded-xl px-3 py-2">
                  <dt className="text-[10px] font-bold uppercase text-muted-foreground">
                    {attr.name}
                  </dt>
                  <dd className="text-sm font-semibold">{attr.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {item.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {item.tags.map((t) => (
                <span key={t} className="text-xs font-semibold px-3 py-1 rounded-full bg-secondary">
                  {t}
                </span>
              ))}
            </div>
          )}

          <button onClick={() => navigate('/search')} className="btn-primary w-full sm:w-auto">
            Search similar items
          </button>
        </div>
      </div>

      {related.length > 0 && (
        <section>
          <h2 className="section-heading mb-6">Related in {item.category}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {related.map((r) => (
              <motion.button
                key={r.id}
                type="button"
                whileHover={{ y: -2 }}
                onClick={() => navigate(`/items/${r.id}`)}
                className="card p-4 text-left"
              >
                <img src={r.image} alt={r.title} className="w-full h-28 object-cover rounded-xl mb-2 bg-muted" />
                <p className="text-sm font-bold line-clamp-2">{r.title}</p>
              </motion.button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ItemDetails;
