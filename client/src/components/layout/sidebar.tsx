import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { BarChart2, Users, Calendar, Wrench, FileText, Settings, CheckSquare, Clipboard, ChartBar } from "lucide-react";

export function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();

  const navigation = [
    {
      section: "Основное",
      items: [
        {
          name: "Панель управления",
          href: "/dashboard",
          icon: <BarChart2 className="w-5 h-5" />,
          active: location === "/dashboard" || location === "/",
        },
        {
          name: "Оборудование",
          href: "/equipment",
          icon: <Wrench className="w-5 h-5" />,
          active: location === "/equipment",
        },
        {
          name: "Техническое обслуживание",
          href: "/maintenance",
          icon: <Clipboard className="w-5 h-5" />,
          active: location === "/maintenance",
          badge: 3
        }
      ]
    },
    {
      section: "Администрирование",
      items: [
        {
          name: "Пользователи",
          href: "/users",
          icon: <Users className="w-5 h-5" />,
          active: location === "/users",
        },
        {
          name: "Отчеты",
          href: "/reports",
          icon: <ChartBar className="w-5 h-5" />,
          active: location === "/reports",
        }
      ]
    }
  ];

  const teamMembers = [
    { id: 1, name: "Елена Иванова", initials: "ЕИ", status: "Онлайн" },
    { id: 2, name: "Максим Петров", initials: "МП", status: "Отошел" },
    { id: 3, name: "Анна Смирнова", initials: "АС", status: "Отошел" },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <div className="p-5 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-md bg-primary-600 flex items-center justify-center">
              <BarChart2 className="text-white text-sm" />
            </div>
            <h1 className="ml-3 text-xl font-semibold text-gray-800 dark:text-gray-100">Победит 4</h1>
          </div>
          <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      <nav className="flex-grow overflow-y-auto p-4">
        {navigation.map((section, idx) => (
          <div key={`section-${idx}`} className="mb-6">
            <p className="uppercase text-xs font-semibold text-gray-500 mb-2 dark:text-blue-300">{section.section}</p>
            <ul className="space-y-2">
              {section.items.map((item, itemIdx) => (
                <li key={`item-${idx}-${itemIdx}`}>
                  <Link href={item.href}>
                    <a className={`flex items-center px-4 py-3 rounded-md font-medium 
                      ${item.active 
                        ? "text-primary-600 bg-primary-50 dark:text-primary-400 dark:bg-primary-900/20"
                        : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50"}`}>
                      {item.icon}
                      <span className="ml-3">{item.name}</span>
                      {item.badge && (
                        <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">Сотрудники</h3>
          <ul className="mt-3 space-y-2">
            {teamMembers.map((member) => (
              <li key={member.id}>
                <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md dark:text-gray-300 dark:hover:bg-gray-700/50">
                  <div className={`w-7 h-7 rounded-full 
                    ${member.initials === "ЕИ" ? "bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300" : 
                      member.initials === "МП" ? "bg-secondary-100 text-secondary-500 dark:bg-secondary-900 dark:text-secondary-300" : 
                      "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300"} 
                    flex items-center justify-center font-medium text-xs`}>
                    {member.initials}
                  </div>
                  <span className="ml-3">{member.name}</span>
                  <span className={`ml-auto text-xs px-2 py-1 rounded-full 
                    ${member.status === "Онлайн" 
                      ? "bg-green-500 text-white dark:bg-green-600" 
                      : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"}`}>
                    {member.status}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      
      {/* User profile */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-medium">
            {user?.avatar || "НИ"}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{user?.name || "Никита"}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role === "admin" ? "Администратор" : user?.role === "manager" ? "Менеджер" : user?.role || "Администратор"}</p>
          </div>
          <Button variant="ghost" size="icon" className="ml-auto text-gray-400 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path d="M3 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM8.5 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM15.5 8.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
            </svg>
          </Button>
        </div>
      </div>
    </aside>
  );
}
