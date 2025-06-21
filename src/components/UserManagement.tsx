
import React, { useState } from 'react';
import { Plus, Edit, Trash2, UserCheck, UserX, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { User, Role } from '@/types/auth';

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      username: 'admin',
      email: 'admin@example.com',
      role: 'Administrator',
      createdAt: '2024-01-01',
      isActive: true
    },
    {
      id: 2,
      username: 'kapor1',
      email: 'kapor@example.com',
      role: 'Kapor',
      createdAt: '2024-01-02',
      isActive: true
    }
  ]);

  const [roles, setRoles] = useState<Role[]>([
    { id: 'administrator', name: 'Administrator', description: 'Full system access', isDefault: true, isEditable: false },
    { id: 'kapor', name: 'Kapor', description: 'Kepala Operasi', isDefault: true, isEditable: true },
    { id: 'permin', name: 'Permin', description: 'Perencanaan Administrasi', isDefault: true, isEditable: true },
    { id: 'binmat', name: 'Binmat', description: 'Pembinaan Material', isDefault: true, isEditable: true },
    { id: 'alsatri', name: 'Alsatri', description: 'Alat Satuan Terpadu', isDefault: true, isEditable: true },
    { id: 'binhar', name: 'Binhar', description: 'Pembinaan Harian', isDefault: true, isEditable: true },
    { id: 'jasa-int', name: 'Jasa Int', description: 'Jasa Internasional', isDefault: true, isEditable: true }
  ]);

  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  
  const [userFormData, setUserFormData] = useState({
    username: '',
    email: '',
    role: 'Kapor',
    password: ''
  });

  const [roleFormData, setRoleFormData] = useState({
    name: '',
    description: ''
  });

  const handleAddUser = () => {
    setEditingUser(null);
    setUserFormData({ username: '', email: '', role: 'Kapor', password: '' });
    setIsUserDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setUserFormData({
      username: user.username,
      email: user.email,
      role: user.role,
      password: ''
    });
    setIsUserDialogOpen(true);
  };

  const handleSaveUser = () => {
    if (!userFormData.username || !userFormData.email || (!editingUser && !userFormData.password)) {
      toast.error('Harap isi semua field yang wajib!');
      return;
    }

    if (editingUser) {
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? { ...user, username: userFormData.username, email: userFormData.email, role: userFormData.role }
          : user
      ));
      toast.success('User berhasil diupdate!');
    } else {
      const newUser: User = {
        id: Math.max(...users.map(u => u.id), 0) + 1,
        username: userFormData.username,
        email: userFormData.email,
        role: userFormData.role,
        createdAt: new Date().toISOString().split('T')[0],
        isActive: true
      };
      setUsers([...users, newUser]);
      toast.success('User berhasil ditambahkan!');
    }

    setIsUserDialogOpen(false);
  };

  const handleAddRole = () => {
    setEditingRole(null);
    setRoleFormData({ name: '', description: '' });
    setIsRoleDialogOpen(true);
  };

  const handleEditRole = (role: Role) => {
    if (!role.isEditable) {
      toast.error('Role ini tidak dapat diedit!');
      return;
    }
    setEditingRole(role);
    setRoleFormData({
      name: role.name,
      description: role.description || ''
    });
    setIsRoleDialogOpen(true);
  };

  const handleSaveRole = () => {
    if (!roleFormData.name) {
      toast.error('Nama role harus diisi!');
      return;
    }

    if (editingRole) {
      setRoles(roles.map(role => 
        role.id === editingRole.id 
          ? { ...role, name: roleFormData.name, description: roleFormData.description }
          : role
      ));
      toast.success('Role berhasil diupdate!');
    } else {
      const newRole: Role = {
        id: roleFormData.name.toLowerCase().replace(/\s+/g, '-'),
        name: roleFormData.name,
        description: roleFormData.description,
        isDefault: false,
        isEditable: true
      };
      setRoles([...roles, newRole]);
      toast.success('Role berhasil ditambahkan!');
    }

    setIsRoleDialogOpen(false);
  };

  const handleDeleteRole = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (!role?.isEditable) {
      toast.error('Role ini tidak dapat dihapus!');
      return;
    }

    const usersWithRole = users.filter(user => user.role === role.name);
    if (usersWithRole.length > 0) {
      toast.error(`Tidak dapat menghapus role karena masih digunakan oleh ${usersWithRole.length} user!`);
      return;
    }

    if (window.confirm('Apakah Anda yakin ingin menghapus role ini?')) {
      setRoles(roles.filter(role => role.id !== roleId));
      toast.success('Role berhasil dihapus!');
    }
  };

  const handleToggleStatus = (userId: number) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, isActive: !user.isActive } : user
    ));
    toast.success('Status user berhasil diubah!');
  };

  const handleDeleteUser = (userId: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus user ini?')) {
      setUsers(users.filter(user => user.id !== userId));
      toast.success('User berhasil dihapus!');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manajemen User & Role</CardTitle>
        <CardDescription>
          Kelola user dan role dalam sistem
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users">Manajemen User</TabsTrigger>
            <TabsTrigger value="roles">Manajemen Role</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Daftar User</h3>
              <Button onClick={handleAddUser} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Tambah User
              </Button>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tanggal Dibuat</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {user.role}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isActive ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </TableCell>
                      <TableCell>{user.createdAt}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleStatus(user.id)}
                          >
                            {user.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="roles" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Daftar Role</h3>
              <Button onClick={handleAddRole} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Tambah Role
              </Button>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Role</TableHead>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Jumlah User</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">{role.name}</TableCell>
                      <TableCell>{role.description || '-'}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          role.isDefault ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {role.isDefault ? 'Default' : 'Custom'}
                        </span>
                      </TableCell>
                      <TableCell>
                        {users.filter(user => user.role === role.name).length} user
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditRole(role)}
                            disabled={!role.isEditable}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteRole(role.id)}
                            disabled={!role.isEditable}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* Add/Edit User Dialog */}
      <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingUser ? 'Edit User' : 'Tambah User Baru'}</DialogTitle>
            <DialogDescription>
              {editingUser ? 'Ubah informasi user' : 'Masukkan informasi user baru'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">Username</Label>
              <Input
                id="username"
                value={userFormData.username}
                onChange={(e) => setUserFormData({ ...userFormData, username: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">Email</Label>
              <Input
                id="email"
                type="email"
                value={userFormData.email}
                onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">Role</Label>
              <Select
                value={userFormData.role}
                onValueChange={(value) => setUserFormData({ ...userFormData, role: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.name}>{role.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {!editingUser && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={userFormData.password}
                  onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                  className="col-span-3"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUserDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSaveUser}>
              {editingUser ? 'Update' : 'Tambah'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Role Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingRole ? 'Edit Role' : 'Tambah Role Baru'}</DialogTitle>
            <DialogDescription>
              {editingRole ? 'Ubah informasi role' : 'Masukkan informasi role baru'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="roleName" className="text-right">Nama Role</Label>
              <Input
                id="roleName"
                value={roleFormData.name}
                onChange={(e) => setRoleFormData({ ...roleFormData, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="roleDescription" className="text-right">Deskripsi</Label>
              <Textarea
                id="roleDescription"
                value={roleFormData.description}
                onChange={(e) => setRoleFormData({ ...roleFormData, description: e.target.value })}
                className="col-span-3"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSaveRole}>
              {editingRole ? 'Update' : 'Tambah'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default UserManagement;
