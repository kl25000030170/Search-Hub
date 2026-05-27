import { Trash2 } from 'lucide-react';
import { useCatalogStore } from '../../store/useCatalogStore';

const AdminCategories = () => {
  const { categories, deleteCategory } = useCatalogStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black">Categories Management</h1>
        <p className="text-sm text-muted-foreground mt-1">Organize products and courses by category</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center text-2xl">
                  {cat.icon || '??'}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{cat.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Category ID: {cat.id}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => deleteCategory(cat.id)}
                className="p-2 rounded-xl text-destructive opacity-0 group-hover:opacity-100 hover:bg-destructive/10 transition-all"
                title="Delete category"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => deleteCategory(cat.id)}
              className="mt-4 w-full py-2 text-xs font-bold rounded-xl border border-destructive/30 text-destructive hover:bg-destructive/10 sm:hidden"
            >
              Delete Category
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCategories;
