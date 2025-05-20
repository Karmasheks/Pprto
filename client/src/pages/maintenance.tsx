import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileEdit, Trash2, Eye, Calendar, CheckCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function Maintenance() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Состояния для диалогов
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState<any>(null);

  // Состояние формы для добавления/редактирования
  const [formData, setFormData] = useState({
    id: "",
    equipmentId: "",
    equipmentName: "",
    maintenanceType: "monthly",
    status: "scheduled",
    scheduledDate: "",
    completedDate: "",
    assignedTo: "",
    notes: ""
  });

  // Симуляция данных оборудования для выбора
  const equipmentOptions = [
    { id: "E001", name: "Станок фрезерный ВМ-127М" },
    { id: "E002", name: "Токарный станок ТВ-320" },
    { id: "E003", name: "Сварочный аппарат ТИГ-200" }
  ];

  // Симуляция данных пользователей для назначения
  const userOptions = [
    { id: 1, name: "Иванов Иван Иванович" },
    { id: 2, name: "Петров Петр Петрович" },
    { id: 3, name: "Сидоров Сидор Сидорович" }
  ];

  // Симуляция данных технического обслуживания
  const [maintenanceList, setMaintenanceList] = useState([
    {
      id: "M001",
      equipmentId: "E001",
      equipmentName: "Станок фрезерный ВМ-127М",
      maintenanceType: "monthly",
      status: "scheduled",
      scheduledDate: "20.05.2025",
      completedDate: "",
      assignedTo: "Иванов Иван Иванович",
      notes: "Плановое ежемесячное обслуживание"
    },
    {
      id: "M002",
      equipmentId: "E002",
      equipmentName: "Токарный станок ТВ-320",
      maintenanceType: "monthly",
      status: "overdue",
      scheduledDate: "31.05.2025",
      completedDate: "",
      assignedTo: "Петров Петр Петрович",
      notes: "Просроченное обслуживание, требуется срочное выполнение"
    },
    {
      id: "M003",
      equipmentId: "E003",
      equipmentName: "Сварочный аппарат ТИГ-200",
      maintenanceType: "repair",
      status: "inProgress",
      scheduledDate: "15.05.2025",
      completedDate: "",
      assignedTo: "Сидоров Сидор Сидорович",
      notes: "Ремонт сварочного аппарата после неисправности"
    },
    {
      id: "M004",
      equipmentId: "E001",
      equipmentName: "Станок фрезерный ВМ-127М",
      maintenanceType: "quarterly",
      status: "completed",
      scheduledDate: "15.04.2025",
      completedDate: "15.04.2025",
      assignedTo: "Иванов Иван Иванович",
      notes: "Квартальное техническое обслуживание"
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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === "equipmentId") {
      const selectedEquipment = equipmentOptions.find(item => item.id === value);
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        equipmentName: selectedEquipment ? selectedEquipment.name : ""
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddMaintenance = () => {
    // Генерация нового ID
    const newId = `M${String(maintenanceList.length + 1).padStart(3, '0')}`;
    
    const newMaintenance = {
      ...formData,
      id: newId
    };
    
    setMaintenanceList(prev => [...prev, newMaintenance]);
    setAddDialogOpen(false);
    
    toast({
      title: "Техническое обслуживание добавлено",
      description: `ТО для ${newMaintenance.equipmentName} успешно запланировано`,
    });
    
    // Сброс формы
    setFormData({
      id: "",
      equipmentId: "",
      equipmentName: "",
      maintenanceType: "monthly",
      status: "scheduled",
      scheduledDate: "",
      completedDate: "",
      assignedTo: "",
      notes: ""
    });
  };

  const handleEditMaintenance = () => {
    const updatedList = maintenanceList.map(item => 
      item.id === formData.id ? formData : item
    );
    
    setMaintenanceList(updatedList);
    setEditDialogOpen(false);
    
    toast({
      title: "Техническое обслуживание обновлено",
      description: `Информация о ТО для ${formData.equipmentName} успешно обновлена`,
    });
  };

  const handleDeleteMaintenance = () => {
    if (!selectedMaintenance) return;
    
    const updatedList = maintenanceList.filter(item => item.id !== selectedMaintenance.id);
    setMaintenanceList(updatedList);
    setDeleteDialogOpen(false);
    
    toast({
      title: "Техническое обслуживание удалено",
      description: `ТО для ${selectedMaintenance.equipmentName} успешно удалено`,
      variant: "destructive"
    });
    
    setSelectedMaintenance(null);
  };

  const handleCompleteMaintenance = () => {
    if (!selectedMaintenance) return;
    
    const today = new Date();
    const formattedDate = `${today.getDate().toString().padStart(2, '0')}.${(today.getMonth() + 1).toString().padStart(2, '0')}.${today.getFullYear()}`;
    
    const updatedList = maintenanceList.map(item => 
      item.id === selectedMaintenance.id 
        ? {...item, status: "completed", completedDate: formattedDate} 
        : item
    );
    
    setMaintenanceList(updatedList);
    setCompleteDialogOpen(false);
    
    toast({
      title: "Техническое обслуживание завершено",
      description: `ТО для ${selectedMaintenance.equipmentName} успешно выполнено`,
      variant: "success"
    });
    
    setSelectedMaintenance(null);
  };

  const openEditDialog = (maintenance: any) => {
    setSelectedMaintenance(maintenance);
    setFormData(maintenance);
    setEditDialogOpen(true);
  };

  const openViewDialog = (maintenance: any) => {
    setSelectedMaintenance(maintenance);
    setViewDialogOpen(true);
  };

  const openDeleteDialog = (maintenance: any) => {
    setSelectedMaintenance(maintenance);
    setDeleteDialogOpen(true);
  };

  const openCompleteDialog = (maintenance: any) => {
    setSelectedMaintenance(maintenance);
    setCompleteDialogOpen(true);
  };

  const getMaintenanceTypeLabel = (type: string) => {
    switch(type) {
      case 'daily': return 'Ежедневное';
      case 'weekly': return 'Еженедельное';
      case 'monthly': return 'Ежемесячное';
      case 'quarterly': return 'Квартальное';
      case 'yearly': return 'Годовое';
      case 'repair': return 'Ремонт';
      default: return type;
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'scheduled': return 'Запланировано';
      case 'inProgress': return 'В процессе';
      case 'completed': return 'Завершено';
      case 'overdue': return 'Просрочено';
      default: return status;
    }
  };

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
      case 'inProgress': return 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'overdue': return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  return (
    <div className="min-h-screen flex dark:bg-gray-900">
      <Helmet>
        <title>Техническое обслуживание | Система мониторинга</title>
      </Helmet>
      
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6 dark:bg-gray-900">
          <div className="fade-in">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Техническое обслуживание</h1>
              <Button onClick={() => setAddDialogOpen(true)} className="bg-primary-600 hover:bg-primary-700">
                <Calendar className="mr-2 h-4 w-4" />
                Запланировать ТО
              </Button>
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden dark:bg-gray-800">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Оборудование</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Тип ТО</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Статус</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Дата</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Ответственный</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                    {maintenanceList.map((maintenance) => (
                      <tr key={maintenance.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{maintenance.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{maintenance.equipmentName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{getMaintenanceTypeLabel(maintenance.maintenanceType)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(maintenance.status)}`}>
                            {getStatusLabel(maintenance.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {maintenance.completedDate || maintenance.scheduledDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{maintenance.assignedTo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => openViewDialog(maintenance)}
                              className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {maintenance.status !== "completed" && (
                              <>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => openEditDialog(maintenance)}
                                  className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                >
                                  <FileEdit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => openCompleteDialog(maintenance)}
                                  className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => openDeleteDialog(maintenance)}
                                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
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
      
      {/* Диалог добавления технического обслуживания */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Запланировать техническое обслуживание</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="equipmentId" className="text-right">
                Оборудование
              </Label>
              <Select
                value={formData.equipmentId}
                onValueChange={(value) => handleSelectChange("equipmentId", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Выберите оборудование" />
                </SelectTrigger>
                <SelectContent>
                  {equipmentOptions.map(equipment => (
                    <SelectItem key={equipment.id} value={equipment.id}>
                      {equipment.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="maintenanceType" className="text-right">
                Тип ТО
              </Label>
              <Select
                value={formData.maintenanceType}
                onValueChange={(value) => handleSelectChange("maintenanceType", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Ежедневное</SelectItem>
                  <SelectItem value="weekly">Еженедельное</SelectItem>
                  <SelectItem value="monthly">Ежемесячное</SelectItem>
                  <SelectItem value="quarterly">Квартальное</SelectItem>
                  <SelectItem value="yearly">Годовое</SelectItem>
                  <SelectItem value="repair">Ремонт</SelectItem>
                </SelectContent>
              </Select>
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
                  <SelectItem value="scheduled">Запланировано</SelectItem>
                  <SelectItem value="inProgress">В процессе</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="scheduledDate" className="text-right">
                Плановая дата
              </Label>
              <Input
                id="scheduledDate"
                name="scheduledDate"
                value={formData.scheduledDate}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="ДД.ММ.ГГГГ"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="assignedTo" className="text-right">
                Ответственный
              </Label>
              <Select
                value={formData.assignedTo}
                onValueChange={(value) => handleSelectChange("assignedTo", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Выберите ответственного" />
                </SelectTrigger>
                <SelectContent>
                  {userOptions.map(user => (
                    <SelectItem key={user.id} value={user.name}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Примечания
              </Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="col-span-3"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>Отмена</Button>
            <Button onClick={handleAddMaintenance}>Добавить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Диалог редактирования технического обслуживания */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Редактировать техническое обслуживание</DialogTitle>
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
              <Label htmlFor="equipmentId" className="text-right">
                Оборудование
              </Label>
              <Select
                value={formData.equipmentId}
                onValueChange={(value) => handleSelectChange("equipmentId", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {equipmentOptions.map(equipment => (
                    <SelectItem key={equipment.id} value={equipment.id}>
                      {equipment.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="maintenanceType" className="text-right">
                Тип ТО
              </Label>
              <Select
                value={formData.maintenanceType}
                onValueChange={(value) => handleSelectChange("maintenanceType", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Ежедневное</SelectItem>
                  <SelectItem value="weekly">Еженедельное</SelectItem>
                  <SelectItem value="monthly">Ежемесячное</SelectItem>
                  <SelectItem value="quarterly">Квартальное</SelectItem>
                  <SelectItem value="yearly">Годовое</SelectItem>
                  <SelectItem value="repair">Ремонт</SelectItem>
                </SelectContent>
              </Select>
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
                  <SelectItem value="scheduled">Запланировано</SelectItem>
                  <SelectItem value="inProgress">В процессе</SelectItem>
                  <SelectItem value="overdue">Просрочено</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="scheduledDate" className="text-right">
                Плановая дата
              </Label>
              <Input
                id="scheduledDate"
                name="scheduledDate"
                value={formData.scheduledDate}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="assignedTo" className="text-right">
                Ответственный
              </Label>
              <Select
                value={formData.assignedTo}
                onValueChange={(value) => handleSelectChange("assignedTo", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Выберите ответственного" />
                </SelectTrigger>
                <SelectContent>
                  {userOptions.map(user => (
                    <SelectItem key={user.id} value={user.name}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Примечания
              </Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="col-span-3"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Отмена</Button>
            <Button onClick={handleEditMaintenance}>Сохранить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Диалог просмотра технического обслуживания */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Информация о техническом обслуживании</DialogTitle>
          </DialogHeader>
          {selectedMaintenance && (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium text-gray-500 dark:text-gray-400">ID:</span>
                <span className="text-gray-900 dark:text-white">{selectedMaintenance.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-500 dark:text-gray-400">Оборудование:</span>
                <span className="text-gray-900 dark:text-white">{selectedMaintenance.equipmentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-500 dark:text-gray-400">Тип ТО:</span>
                <span className="text-gray-900 dark:text-white">{getMaintenanceTypeLabel(selectedMaintenance.maintenanceType)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-500 dark:text-gray-400">Статус:</span>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(selectedMaintenance.status)}`}>
                  {getStatusLabel(selectedMaintenance.status)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-500 dark:text-gray-400">Плановая дата:</span>
                <span className="text-gray-900 dark:text-white">{selectedMaintenance.scheduledDate}</span>
              </div>
              {selectedMaintenance.completedDate && (
                <div className="flex justify-between">
                  <span className="font-medium text-gray-500 dark:text-gray-400">Дата завершения:</span>
                  <span className="text-gray-900 dark:text-white">{selectedMaintenance.completedDate}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="font-medium text-gray-500 dark:text-gray-400">Ответственный:</span>
                <span className="text-gray-900 dark:text-white">{selectedMaintenance.assignedTo}</span>
              </div>
              <div>
                <span className="font-medium text-gray-500 dark:text-gray-400">Примечания:</span>
                <p className="mt-1 text-gray-900 dark:text-white whitespace-pre-wrap">{selectedMaintenance.notes}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewDialogOpen(false)}>Закрыть</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Диалог удаления технического обслуживания */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Подтверждение удаления</DialogTitle>
          </DialogHeader>
          {selectedMaintenance && (
            <div className="py-4">
              <p className="text-gray-700 dark:text-gray-300">
                Вы уверены, что хотите удалить техническое обслуживание "{selectedMaintenance.equipmentName} ({getMaintenanceTypeLabel(selectedMaintenance.maintenanceType)})"?
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Это действие нельзя будет отменить.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Отмена</Button>
            <Button variant="destructive" onClick={handleDeleteMaintenance}>Удалить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Диалог завершения технического обслуживания */}
      <Dialog open={completeDialogOpen} onOpenChange={setCompleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Завершение технического обслуживания</DialogTitle>
          </DialogHeader>
          {selectedMaintenance && (
            <div className="py-4">
              <p className="text-gray-700 dark:text-gray-300">
                Вы уверены, что хотите отметить техническое обслуживание "{selectedMaintenance.equipmentName} ({getMaintenanceTypeLabel(selectedMaintenance.maintenanceType)})" как завершенное?
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Дата завершения будет установлена на сегодня.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setCompleteDialogOpen(false)}>Отмена</Button>
            <Button onClick={handleCompleteMaintenance} className="bg-green-600 hover:bg-green-700">Завершить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}