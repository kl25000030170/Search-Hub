import { useMemo, useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import Pagination from '../../components/admin/Pagination';
import { useCatalogStore } from '../../store/useCatalogStore';

const PAGE_SIZE = 6;

const AdminUsers = () => {
  const users = useCatalogStore((s) => s.users);
  const fetchUsers = useCatalogStore((s) => s.fetchUsers);
  const changeUserRole = useCatalogStore((s) => s.changeUserRole);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, []);

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black">Users Directory</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage and review platform users</p>
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
                <th className="px-5 py-4 font-bold text-muted-foreground">Joined Date</th>
                <th className="px-5 py-4 font-bold text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((u) => (
                <tr key={u.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  <td className="px-5 py-4 font-semibold">{u.name}</td>
                  <td className="px-5 py-4 text-muted-foreground">{u.email}</td>
                  <td className="px-5 py-4">
                    <select
                      value={u.role}
                      onChange={(e) => changeUserRole(u.id, e.target.value)}
                      className={`text-xs font-bold px-2.5 py-1 rounded-xl border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer ${u.role === 'ADMIN' ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10' : 'text-foreground bg-secondary'}`}
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{u.joinedDate}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusClass(u.status)}`}>
                      {u.status}
                    </span>
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
    </div>
  );
};

export default AdminUsers;
