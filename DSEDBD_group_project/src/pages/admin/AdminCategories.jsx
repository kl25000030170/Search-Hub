import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Modal from '../../components/admin/Modal';
import { useCatalogStore } from '../../store/useCatalogStore';

const AdminCategories = () => {
  const { categories, addCategory, deleteCategory, updateCategory } = useCatalogStore();
  const [newName, setNewName] = useState('');
  const [editCategory, setEditCategory] = useState(null);
  const [editName, setEditName] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    addCategory(newName.trim());
    setNewName('');
  };

  const handleEditClick = (cat) => {
    setEditCategory(cat);
    setEditName(cat.name);
  };

  const handleEditSave = (e) => {
    e.preventDefault();
    if (!editName.trim() || !editCategory) return;
    updateCategory(editCategory.id, editName.trim());
    setEditCategory(null);
    setEditName('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black">Categories Management</h1>
        <p className="text-sm text-muted-foreground mt-1">Organize products and courses by category</p>
      </div>

      <form onSubmit={handleAdd} className="bg-card border border-border rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row gap-3">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New category name..."
          className="input-field flex-1 text-sm"
        />
        <button type="submit" className="btn-primary flex items-center justify-center gap-2 text-sm px-6">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center text-lg font-bold text-primary">
                  {cat.name[0]?.toUpperCase() || 'C'}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{cat.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Category ID: {cat.id}</p>
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                <button
                  type="button"
                  onClick={() => handleEditClick(cat)}
                  className="p-2 rounded-xl text-primary hover:bg-primary/10 transition-all"
                  title="Edit category"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => deleteCategory(cat.id)}
                  className="p-2 rounded-xl text-destructive hover:bg-destructive/10 transition-all"
                  title="Delete category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex gap-2 mt-4 sm:hidden">
              <button
                type="button"
                onClick={() => handleEditClick(cat)}
                className="flex-1 py-2 text-xs font-bold rounded-xl border border-primary/30 text-primary hover:bg-primary/10"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => deleteCategory(cat.id)}
                className="flex-1 py-2 text-xs font-bold rounded-xl border border-destructive/30 text-destructive hover:bg-destructive/10"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Category Modal */}
      <Modal isOpen={!!editCategory} onClose={() => setEditCategory(null)} title="Edit Category">
        {editCategory && (
          <form onSubmit={handleEditSave} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Category Name</label>
              <input
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="input-field text-sm w-full"
                placeholder="Category name..."
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="btn-primary flex-1">Save Rename</button>
              <button
                type="button"
                onClick={() => setEditCategory(null)}
                className="btn-outline flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default AdminCategories;
