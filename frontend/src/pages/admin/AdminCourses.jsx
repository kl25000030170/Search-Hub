import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import Modal from '../../components/admin/Modal';
import ImageUploadField from '../../components/admin/ImageUploadField';
import { useCatalogStore } from '../../store/useCatalogStore';

const emptyCourse = {
  title: '',
  description: '',
  category: 'Courses',
  level: 'Beginner',
  instructor: '',
  image: '',
};

const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

const AdminCourses = () => {
  const { courses, categories, addCourse, updateCourse, deleteCourse } = useCatalogStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyCourse);

  const categoryNames = categories.map((c) => c.name);

  const openAdd = () => {
    setEditingId(null);
    setForm({ ...emptyCourse, category: categoryNames.includes('Courses') ? 'Courses' : categoryNames[0] });
    setModalOpen(true);
  };

  const openEdit = (c) => {
    setEditingId(c.id);
    setForm({
      title: c.title,
      description: c.description,
      category: c.category,
      level: c.level,
      instructor: c.instructor,
      image: c.image,
    });
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      image: form.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400',
      rating: 4.5,
    };
    if (editingId) updateCourse(editingId, payload);
    else addCourse(payload);
    setModalOpen(false);
    setForm(emptyCourse);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black">Courses Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage learning courses for users</p>
        </div>

      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-border text-left">
                <th className="px-5 py-4 font-bold text-muted-foreground w-20">Image</th>
                <th className="px-5 py-4 font-bold text-muted-foreground">Course Name</th>
                <th className="px-5 py-4 font-bold text-muted-foreground">Category</th>
                <th className="px-5 py-4 font-bold text-muted-foreground">Level</th>
                <th className="px-5 py-4 font-bold text-muted-foreground">Instructor</th>
                <th className="px-5 py-4 font-bold text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c.id} className="border-b border-border/50 hover:bg-secondary/20">
                  <td className="px-5 py-3">
                    <img src={c.image} alt="" className="w-12 h-12 rounded-lg object-cover bg-muted" />
                  </td>
                  <td className="px-5 py-3 font-semibold">{c.title}</td>
                  <td className="px-5 py-3 text-muted-foreground">{c.category}</td>
                  <td className="px-5 py-3">
                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-violet-500/10 text-violet-600">{c.level}</span>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{c.instructor}</td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => openEdit(c)} className="p-2 rounded-lg hover:bg-primary/10 text-primary">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button type="button" onClick={() => deleteCourse(c.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive">
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

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Course' : 'Add Course'} size="lg">
        <form onSubmit={handleSave} className="space-y-4">
          <ImageUploadField label="Course Image" value={form.image} onChange={(v) => setForm({ ...form, image: v })} />
          <div>
            <label className="block text-sm font-semibold mb-1">Course Name</label>
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field text-sm w-full" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Description</label>
            <textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field text-sm w-full min-h-[100px]" />
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Difficulty</label>
              <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} className="input-field text-sm w-full">
                {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field text-sm w-full">
                {categoryNames.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Instructor</label>
              <input required value={form.instructor} onChange={(e) => setForm({ ...form, instructor: e.target.value })} className="input-field text-sm w-full" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1">Save</button>
            <button type="button" onClick={() => setModalOpen(false)} className="btn-outline flex-1">Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminCourses;
