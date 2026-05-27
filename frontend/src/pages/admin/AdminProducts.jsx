import { useState } from 'react';
import { Pencil, Trash2, Eye, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Modal from '../../components/admin/Modal';
import ImageUploadField from '../../components/admin/ImageUploadField';
import { useCatalogStore } from '../../store/useCatalogStore';

const emptyProduct = {
  name: '',
  category: 'Electronics',
  description: '',
  price: '',
  rating: '4.0',
  image: '',
  brand: '',
};

const AdminProducts = () => {
  const navigate = useNavigate();
  const { products, categories, addProduct, updateProduct, deleteProduct } = useCatalogStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [viewProduct, setViewProduct] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyProduct);

  const categoryNames = categories.map((c) => c.name);

  const openAdd = () => {
    setEditingId(null);
    setForm({ ...emptyProduct, category: categoryNames[0] || 'Electronics' });
    setModalOpen(true);
  };

  const openEdit = (p) => {
    setEditingId(p.id);
    setForm({
      name: p.title || p.name,
      category: p.category,
      description: p.description || '',
      price: String(p.price),
      rating: String(p.rating),
      image: p.image || p.images?.[0] || '',
      brand: p.brand || '',
    });
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      title: form.name,
      category: form.category,
      description: form.description,
      price: Number(form.price) || 0,
      rating: Number(form.rating) || 0,
      image: form.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400',
      images: [form.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400'],
      brand: form.brand || 'Generic',
    };
    if (editingId) {
      updateProduct(editingId, payload);
    } else {
      addProduct(payload);
    }
    setModalOpen(false);
    setForm(emptyProduct);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black">Products Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Add and manage catalog products</p>
        </div>

      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-border text-left">
                <th className="px-5 py-4 font-bold text-muted-foreground w-20">Image</th>
                <th className="px-5 py-4 font-bold text-muted-foreground">Product Name</th>
                <th className="px-5 py-4 font-bold text-muted-foreground">Category</th>
                <th className="px-5 py-4 font-bold text-muted-foreground">Rating</th>
                <th className="px-5 py-4 font-bold text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-border/50 hover:bg-secondary/20">
                  <td className="px-5 py-3">
                    <img
                      src={p.image || p.images?.[0]}
                      alt=""
                      className="w-12 h-12 rounded-lg object-cover bg-muted"
                    />
                  </td>
                  <td className="px-5 py-3 font-semibold">{p.title || p.name}</td>
                  <td className="px-5 py-3 text-muted-foreground">{p.category}</td>
                  <td className="px-5 py-3 font-bold flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {p.rating}</td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => setViewProduct(p)} className="px-3 py-1.5 rounded-lg text-xs font-bold border border-border hover:bg-secondary">
                        View
                      </button>
                      <button type="button" onClick={() => openEdit(p)} className="p-2 rounded-lg hover:bg-primary/10 text-primary" title="Edit">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button type="button" onClick={() => deleteProduct(p.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Product' : 'Add Product'} size="lg">
        <form onSubmit={handleSave} className="space-y-4">
          <ImageUploadField label="Product Image" value={form.image} onChange={(v) => setForm({ ...form, image: v })} />
          <div>
            <label className="block text-sm font-semibold mb-1">Product Name</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field text-sm w-full" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field text-sm w-full">
                {categoryNames.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Brand</label>
              <input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="input-field text-sm w-full" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Description</label>
            <textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field text-sm w-full min-h-[100px]" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Price ($)</label>
              <input type="number" required min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field text-sm w-full" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Rating</label>
              <input type="number" required min="0" max="5" step="0.1" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} className="input-field text-sm w-full" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1">Save</button>
            <button type="button" onClick={() => setModalOpen(false)} className="btn-outline flex-1">Cancel</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!viewProduct} onClose={() => setViewProduct(null)} title="Product Details">
        {viewProduct && (
          <div className="space-y-4">
            <img src={viewProduct.image} alt="" className="w-full h-48 object-cover rounded-xl" />
            <p className="font-bold text-lg">{viewProduct.title}</p>
            <p className="text-sm text-muted-foreground">{viewProduct.description}</p>
            <button type="button" onClick={() => { navigate(`/items/${viewProduct.id}`); setViewProduct(null); }} className="btn-primary w-full flex items-center justify-center gap-2">
              <Eye className="w-4 h-4" /> View on user site
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminProducts;
