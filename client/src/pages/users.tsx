import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileEdit, Trash2, Eye, UserPlus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function Users() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Состояния для диалогов
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Состояние формы для добавления/редактирования
  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    email: "",
    role: "user",
    department: "",
    position: "",
    password: ""
  });

  // Симуляция данных пользователей
  const [usersList, setUsersList] = useState([
    {
      id: 1,
      name: "Иванов Иван Иванович",
      email: "admin@example.com",
      role: "admin",
      department: "ИТ отдел",
      position: "Администратор системы",
      avatar: null
    },
    {
      id: 2,
      name: "Петров Петр Петрович",
      email: "petrov@example.com",
      role: "engineer",
      department: "Инженерный отдел",
      position: "Ведущий инженер",
      avatar: null
    },
    {
      id: 3,
      name: "Сидоров Сидор Сидорович",
      email: "sidorov@example.com",
      role: "user",
      department: "Производственный отдел",
      position: "Техник",
      avatar: null
    }
  ]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated()) {
      setLocation("/login");
    }
  }, [isLoading, isAuthenticated, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Обработчики для форм
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddUser = () => {
    // Генерация нового ID
    const newId = usersList.length + 1;
    
    const newUser = {
      ...formData,
      id: newId,
      avatar: null
    };
    
    // Удаляем пароль перед добавлением в список
    const { password, ...userToAdd } = newUser;
    
    setUsersList(prev => [...prev, userToAdd]);
    setAddDialogOpen(false);
    
    toast({
      title: "Пользователь добавлен",
      description: `${newUser.name} успешно добавлен в систему`,
    });
    
    // Сброс формы
    setFormData({
      id: 0,
      name: "",
      email: "",
      role: "user",
      department: "",
      position: "",
      password: ""
    });
  };

  const handleEditUser = () => {
    const updatedList = usersList.map(item => 
      item.id === formData.id ? {...formData, avatar: item.avatar} : item
    );
    
    setUsersList(updatedList);
    setEditDialogOpen(false);
    
    toast({
      title: "Пользователь обновлен",
      description: `Информация о ${formData.name} успешно обновлена`,
    });
  };

  const handleDeleteUser = () => {
    if (!selectedUser) return;
    
    const updatedList = usersList.filter(item => item.id !== selectedUser.id);
    setUsersList(updatedList);
    setDeleteDialogOpen(false);
    
    toast({
      title: "Пользователь удален",
      description: `${selectedUser.name} успешно удален из системы`,
      variant: "destructive"
    });
    
    setSelectedUser(null);
  };

  const openEditDialog = (user: any) => {
    setSelectedUser(user);
    setFormData({
      ...user,
      password: ""  // Не передаем пароль в форму редактирования
    });
    setEditDialogOpen(true);
  };

  const openViewDialog = (user: any) => {
    setSelectedUser(user);
    setViewDialogOpen(true);
  };

  const openDeleteDialog = (user: any) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const getRoleLabel = (role: string) => {
    switch(role) {
      case 'admin': return 'Администратор';
      case 'engineer': return 'Инженер';
      case 'user': return 'Пользователь';
      default: return role;
    }
  };

  const getRoleClass = (role: string) => {
    switch(role) {
      case 'admin': return 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100';
      case 'engineer': return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
      case 'user': return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  return (
    <div className="min-h-screen flex dark:bg-gray-900">
      <Helmet>
        <title>Управление пользователями | Система мониторинга</title>
      </Helmet>
      
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6 dark:bg-gray-900">
          <div className="fade-in">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Управление пользователями</h1>
              <Button onClick={() => setAddDialogOpen(true)} className="bg-primary-600 hover:bg-primary-700">
                <UserPlus className="mr-2 h-4 w-4" />
                Добавить пользователя
              </Button>
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden dark:bg-gray-800">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Имя</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Роль</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Отдел</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Должность</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                    {usersList.map((userData) => (
                      <tr key={userData.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{userData.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{userData.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{userData.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleClass(userData.role)}`}>
                            {getRoleLabel(userData.role)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{userData.department}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{userData.position}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => openViewDialog(userData)}
                              className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => openEditDialog(userData)}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              <FileEdit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => openDeleteDialog(userData)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      <MobileSidebar />
      
      {/* Диалог добавления пользователя */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Добавить нового пользователя</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                ФИО
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="col-span-3"
                type="email"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Пароль
              </Label>
              <Input
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="col-span-3"
                type="password"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Роль
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleSelectChange("role", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Администратор</SelectItem>
                  <SelectItem value="engineer">Инженер</SelectItem>
                  <SelectItem value="user">Пользователь</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="department" className="text-right">
                Отдел
              </Label>
              <Input
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="position" className="text-right">
                Должность
              </Label>
              <Input
                id="position"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>Отмена</Button>
            <Button onClick={handleAddUser}>Добавить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Диалог редактирования пользователя */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Редактировать пользователя</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="id" className="text-right">
                ID
              </Label>
              <Input
                id="id"
                name="id"
                value={formData.id}
                readOnly
                className="col-span-3 bg-gray-100 dark:bg-gray-700"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                ФИО
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="col-span-3"
                type="email"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Пароль
              </Label>
              <Input
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="col-span-3"
                type="password"
                placeholder="Оставьте пустым, чтобы не менять"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Роль
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleSelectChange("role", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Администратор</SelectItem>
                  <SelectItem value="engineer">Инженер</SelectItem>
                  <SelectItem value="user">Пользователь</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="department" className="text-right">
                Отдел
              </Label>
              <Input
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="position" className="text-right">
                Должность
              </Label>
              <Input
                id="position"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Отмена</Button>
            <Button onClick={handleEditUser}>Сохранить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Диалог просмотра пользователя */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Информация о пользователе</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium text-gray-500 dark:text-gray-400">ID:</span>
                <span className="text-gray-900 dark:text-white">{selectedUser.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-500 dark:text-gray-400">ФИО:</span>
                <span className="text-gray-900 dark:text-white">{selectedUser.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-500 dark:text-gray-400">Email:</span>
                <span className="text-gray-900 dark:text-white">{selectedUser.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-500 dark:text-gray-400">Роль:</span>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleClass(selectedUser.role)}`}>
                  {getRoleLabel(selectedUser.role)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-500 dark:text-gray-400">Отдел:</span>
                <span className="text-gray-900 dark:text-white">{selectedUser.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-500 dark:text-gray-400">Должность:</span>
                <span className="text-gray-900 dark:text-white">{selectedUser.position}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewDialogOpen(false)}>Закрыть</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Диалог удаления пользователя */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Подтверждение удаления</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="py-4">
              <p className="text-gray-700 dark:text-gray-300">
                Вы уверены, что хотите удалить пользователя "{selectedUser.name}"?
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Это действие нельзя будет отменить.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Отмена</Button>
            <Button variant="destructive" onClick={handleDeleteUser}>Удалить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}