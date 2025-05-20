import { Helmet } from "react-helmet";
import { RegisterForm } from "@/components/auth/register-form";
import { BarChart2 } from "lucide-react";

export default function Register() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 dark:bg-gray-900">
      <Helmet>
        <title>Регистрация - МаркетМетрикс</title>
        <meta name="description" content="Создайте новый аккаунт МаркетМетрикс, чтобы начать мониторинг эффективности вашей маркетинговой команды." />
      </Helmet>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-md bg-primary-600 flex items-center justify-center">
            <BarChart2 className="text-white text-lg" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">МаркетМетрикс</h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Создайте аккаунт, чтобы начать работу
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <RegisterForm />
      </div>
    </div>
  );
}
