import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileEdit, Trash2, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function Equipment() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Состояния для диалогов
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<any>(null);

  // Состояние формы для добавления/редактирования
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    type: "",
    status: "active",
    lastMaintenance: "",
    nextMaintenance: "",
    responsible: ""
  });

  // Симуляция данных оборудования
  const [equipmentList, setEquipmentList] = useState([
    {
      id: "E001",
      name: "Станок фрезерный ВМ-127М",
      type: "Фрезерный",
      status: "active",
      lastMaintenance: "15.04.2025",
      nextMaintenance: "15.05.2025",
      responsible: "Иванов И.И."
    },
    {
      id: "E002",
      name: "Токарный станок ТВ-320",
      type: "Токарный",
      status: "maintenance",
      lastMaintenance: "10.03.2025",
      nextMaintenance: "31.05.2025",
      responsible: "Петров П.П."
    },
    {
      id: "E003",
      name: "Сварочный аппарат ТИГ-200",
      type: "Сварочный",
      status: "repair",
      lastMaintenance: "05.05.2025",
      nextMaintenance: "15.05.2025",
      responsible: "Сидоров С.С."
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

  const handleAddEquipment = () => {
    // Генерация нового ID
    const newId = `E${String(equipmentList.length + 1).padStart(3, '0')}`;
    
    const newEquipment = {
      ...formData,
      id: newId
    };
    
    setEquipmentList(prev => [...prev, newEquipment]);
    setAddDialogOpen(false);
    
    toast({
      title: "Оборудование добавлено",
      description: `${newEquipment.name} успешно добавлено в систему`,
    });
    
    // Сброс формы
    setFormData({
      id: "",
      name: "",
      type: "",
      status: "active",
      lastMaintenance: "",
      nextMaintenance: "",
      responsible: ""
    });
  };

  const handleEditEquipment = () => {
    const updatedList = equipmentList.map(item => 
      item.id === formData.id ? formData : item
    );
    
    setEquipmentList(updatedList);
    setEditDialogOpen(false);
    
    toast({
      title: "Оборудование обновлено",
      description: `Информация о ${formData.name} успешно обновлена`,
    });
  };

  const handleDeleteEquipment = () => {
    if (!selectedEquipment) return;
    
    const updatedList = equipmentList.filter(item => item.id !== selectedEquipment.id);
    setEquipmentList(updatedList);
    setDeleteDialogOpen(false);
    
    toast({
      title: "Оборудование удалено",
      description: `${selectedEquipment.name} успешно удалено из системы`,
      variant: "destructive"
    });
    
    setSelectedEquipment(null);
  };

  const openEditDialog = (equipment: any) => {
    setSelectedEquipment(equipment);
    setFormData(equipment);
    setEditDialogOpen(true);
  };

  const openViewDialog = (equipment: any) => {
    setSelectedEquipment(equipment);
    setViewDialogOpen(true);
  };

  const openDeleteDialog = (equipment: any) => {
    setSelectedEquipment(equipment);
    setDeleteDialogOpen(true);
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'active': return 'Рабочий';
      case 'maintenance': return 'Требует ТО';
      case 'repair': return 'В ремонте';
      default: return 'Неизвестно';
    }
  };

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
      case 'repair': return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  return (
    <div className="min-h-screen flex dark:bg-gray-900">
      <Helmet>
        <title>Управление оборудованием | Система мониторинга</title>
      </Helmet>
      
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6 dark:bg-gray-900">
          <div className="fade-in">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Управление оборудованием</h1>
              <Button onClick={() => setAddDialogOpen(true)} className="bg-primary-600 hover:bg-primary-700">
                <PlusCircle className="mr-2 h-4 w-4" />
                Добавить оборудование
              </Button>
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden dark:bg-gray-800">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Название</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Тип</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Статус</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Последнее ТО</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Следующее ТО</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                    {equipmentList.map((equipment) => (
                      <tr key={equipment.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{equipment.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{equipment.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{equipment.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(equipment.status)}`}>
                            {getStatusText(equipment.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{equipment.lastMaintenance}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{equipment.nextMaintenance}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => openViewDialog(equipment)}
                              className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => openEditDialog(equipment)}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              <FileEdit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => openDeleteDialog(equipment)}
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
      
      {/* Диалог добавления оборудования */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Добавить новое оборудование</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Название
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
              <Label htmlFor="type" className="text-right">
                Тип
              </Label>
              <Input
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Статус
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange("status", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Рабочий</SelectItem>
                  <SelectItem value="maintenance">Требует ТО</SelectItem>
                  <SelectItem value="repair">В ремонте</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastMaintenance" className="text-right">
                Последнее ТО
              </Label>
              <Input
                id="lastMaintenance"
                name="lastMaintenance"
                value={formData.lastMaintenance}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="ДД.ММ.ГГГГ"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nextMaintenance" className="text-right">
                Следующее ТО
              </Label>
              <Input
                id="nextMaintenance"
                name="nextMaintenance"
                value={formData.nextMaintenance}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="ДД.ММ.ГГГГ"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="responsible" className="text-right">
                Ответственный
              </Label>
              <Input
                id="responsible"
                name="responsible"
                value={formData.responsible}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>Отмена</Button>
            <Button onClick={handleAddEquipment}>Добавить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Диалог редактирования оборудования */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Редактировать оборудование</DialogTitle>
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
                Название
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
              <Label htmlFor="type" className="text-right">
                Тип
              </Label>
              <Input
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Статус
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange("status", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Рабочий</SelectItem>
                  <SelectItem value="maintenance">Требует ТО</SelectItem>
                  <SelectItem value="repair">В ремонте</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastMaintenance" className="text-right">
                Последнее ТО
              </Label>
              <Input
                id="lastMaintenance"
                name="lastMaintenance"
                value={formData.lastMaintenance}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nextMaintenance" className="text-right">
                Следующее ТО
              </Label>
              <Input
                id="nextMaintenance"
                name="nextMaintenance"
                value={formData.nextMaintenance}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="responsible" className="text-right">
                Ответственный
              </Label>
              <Input
                id="responsible"
                name="responsible"
                value={formData.responsible}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Отмена</Button>
            <Button onClick={handleEditEquipment}>Сохранить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Диалог просмотра оборудования */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Информация об оборудовании</DialogTitle>
          </DialogHeader>
          {selectedEquipment && (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium text-gray-500 dark:text-gray-400">ID:</span>
                <span className="text-gray-900 dark:text-white">{selectedEquipment.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-500 dark:text-gray-400">Название:</span>
                <span className="text-gray-900 dark:text-white">{selectedEquipment.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-500 dark:text-gray-400">Тип:</span>
                <span className="text-gray-900 dark:text-white">{selectedEquipment.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-500 dark:text-gray-400">Статус:</span>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(selectedEquipment.status)}`}>
                  {getStatusText(selectedEquipment.status)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-500 dark:text-gray-400">Последнее ТО:</span>
                <span className="text-gray-900 dark:text-white">{selectedEquipment.lastMaintenance}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-500 dark:text-gray-400">Следующее ТО:</span>
                <span className="text-gray-900 dark:text-white">{selectedEquipment.nextMaintenance}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-500 dark:text-gray-400">Ответственный:</span>
                <span className="text-gray-900 dark:text-white">{selectedEquipment.responsible}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewDialogOpen(false)}>Закрыть</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Диалог удаления оборудования */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Подтверждение удаления</DialogTitle>
          </DialogHeader>
          {selectedEquipment && (
            <div className="py-4">
              <p className="text-gray-700 dark:text-gray-300">
                Вы уверены, что хотите удалить оборудование "{selectedEquipment.name}"?
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Это действие нельзя будет отменить.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Отмена</Button>
            <Button variant="destructive" onClick={handleDeleteEquipment}>Удалить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}