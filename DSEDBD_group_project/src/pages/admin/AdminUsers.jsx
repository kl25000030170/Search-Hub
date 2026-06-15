import { useMemo, useState } from 'react';
import { Search, Filter, Eye, Pencil, Trash2 } from 'lucide-react';
import Pagination from '../../components/admin/Pagination';
import Modal from '../../components/admin/Modal';
import { useCatalogStore } from '../../store/useCatalogStore';

const PAGE_SIZE = 6;

const AdminUsers = () => {
  const users = useCatalogStore((s) => s.users);
  const deleteUser = useCatalogStore((s) => s.deleteUser);
  const updateUser = useCatalogStore((s) => s.updateUser);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);

  // Modal States
  const [viewUser, setViewUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', role: 'USER', status: 'Active' });

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        !search ||
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchRole = roleFilter === 'all' || u.role === roleFilter;
      const matchStatus = statusFilter === 'all' || u.status === statusFilter;
      return matchSearch && matchRole && matchStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const statusClass = (status) => {
    if (status === 'Active') return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400';
    if (status === 'Suspended') return 'bg-red-500/10 text-red-600';
    return 'bg-slate-500/10 text-slate-600';
  };

  const handleEditClick = (u) => {
    setEditUser(u);
    setEditForm({
      name: u.name,
      email: u.email,
      role: u.role,
      status: u.status,
    });
  };

  const handleEditSave = (e) => {
    e.preventDefault();
    if (!editUser) return;
    updateUser(editUser.id, editForm);
    setEditUser(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black">Users Management</h1>
        <p className="text-sm text-muted-foreground mt-1">Review and manage platform users</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="input-field pl-10 w-full text-sm"
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <select
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
              className="input-field pl-10 pr-8 text-sm min-w-[130px]"
            >
              <option value="all">All Roles</option>
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="input-field text-sm min-w-[130px]"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-border text-left">
                <th className="px-5 py-4 font-bold text-muted-foreground">Name</th>
                <th className="px-5 py-4 font-bold text-muted-foreground">Email</th>
                <th className="px-5 py-4 font-bold text-muted-foreground">Role</th>
                <th className="px-5 py-4 font-bold text-muted-foreground">Status</th>
                <th className="px-5 py-4 font-bold text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((u) => (
                <tr key={u.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  <td className="px-5 py-4 font-semibold">{u.name}</td>
                  <td className="px-5 py-4 text-muted-foreground">{u.email}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${u.role === 'ADMIN' ? 'bg-indigo-500/10 text-indigo-600' : 'bg-secondary text-foreground'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusClass(u.status)}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setViewUser(u)}
                        className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground"
                        title="View User Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEditClick(u)}
                        className="p-2 rounded-lg hover:bg-primary/10 text-primary"
                        title="Edit User"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteUser(u.id)}
                        className="p-2 rounded-lg hover:bg-destructive/10 text-destructive"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {paginated.length === 0 && (
          <p className="text-center py-12 text-muted-foreground font-medium">No users match your filters.</p>
        )}
        <div className="px-5 pb-4">
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            totalItems={filtered.length}
            pageSize={PAGE_SIZE}
          />
        </div>
      </div>

      {/* View User Modal */}
      <Modal isOpen={!!viewUser} onClose={() => setViewUser(null)} title="User Details">
        {viewUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center text-white text-lg font-bold">
                {viewUser.name[0].toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-lg">{viewUser.name}</h3>
                <p className="text-sm text-muted-foreground">{viewUser.email}</p>
              </div>
            </div>
            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">User ID:</span>
                <span className="font-bold">{viewUser.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Role:</span>
                <span className="font-bold">{viewUser.role}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status:</span>
                <span className={`font-bold px-2 py-0.5 rounded text-xs ${statusClass(viewUser.status)}`}>
                  {viewUser.status}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Joined Date:</span>
                <span className="font-bold">{viewUser.joinedDate || 'N/A'}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setViewUser(null)}
              className="btn-primary w-full mt-4"
            >
              Close
            </button>
          </div>
        )}
      </Modal>

      {/* Edit User Modal */}
      <Modal isOpen={!!editUser} onClose={() => setEditUser(null)} title="Edit User">
        {editUser && (
          <form onSubmit={handleEditSave} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Full Name</label>
              <input
                required
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="input-field text-sm w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Email Address</label>
              <input
                required
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="input-field text-sm w-full"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Role</label>
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  className="input-field text-sm w-full"
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="input-field text-sm w-full"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="btn-primary flex-1">Save Changes</button>
              <button
                type="button"
                onClick={() => setEditUser(null)}
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

export default AdminUsers;
