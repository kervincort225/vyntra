"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'client';
  avatar?: string;
}

interface SidebarItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  roles: ('admin' | 'client')[];
}

const sidebarItems: SidebarItem[] = [
  {
    id: 'overview',
    label: 'Resumen',
    icon: '📊',
    href: '/dashboard',
    roles: ['admin', 'client']
  },
  {
    id: 'projects',
    label: 'Proyectos',
    icon: '📁',
    href: '/dashboard/projects',
    roles: ['admin', 'client']
  },
  {
    id: 'leads',
    label: 'Leads',
    icon: '👥',
    href: '/dashboard/leads',
    roles: ['admin']
  },
  {
    id: 'clients',
    label: 'Clientes',
    icon: '🏢',
    href: '/dashboard/clients',
    roles: ['admin']
  },
  {
    id: 'documents',
    label: 'Documentos',
    icon: '📄',
    href: '/dashboard/documents',
    roles: ['admin', 'client']
  },
  {
    id: 'billing',
    label: 'Facturación',
    icon: '💰',
    href: '/dashboard/billing',
    roles: ['admin', 'client']
  },
  {
    id: 'communication',
    label: 'Comunicación',
    icon: '💬',
    href: '/dashboard/communication',
    roles: ['client']
  },
  {
    id: 'settings',
    label: 'Configuración',
    icon: '⚙️',
    href: '/dashboard/settings',
    roles: ['admin', 'client']
  }
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar autenticación y obtener datos del usuario
    const authStatus = localStorage.getItem("vyntra-auth");
    const userData = localStorage.getItem("vyntra-user");
    
    if (authStatus !== "true") {
      router.push("/login");
      return;
    }

    // Simular datos de usuario (en producción vendría de API)
    let defaultUser: User;
    
    // Determinar rol basado en email o configuración
    const isAdmin = !userData || JSON.parse(userData)?.email?.includes('admin') || JSON.parse(userData)?.role === 'admin';
    
    if (isAdmin) {
      defaultUser = userData ? JSON.parse(userData) : {
        id: '1',
        name: 'Administrador Vyntra',
        email: 'admin@vyntra.com',
        role: 'admin'
      };
    } else {
      defaultUser = userData ? JSON.parse(userData) : {
        id: '2',
        name: 'Juan Pérez',
        email: 'juan@empresa.com',
        role: 'client'
      };
    }

    setUser(defaultUser);
    localStorage.setItem("vyntra-user", JSON.stringify(defaultUser));
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("vyntra-auth");
    localStorage.removeItem("vyntra-user");
    router.push("/login");
  };

  const filteredSidebarItems = sidebarItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        
        {/* Logo y Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-pink-600">
          <div className="flex items-center space-x-3">
            <Image
              src="/Vyntra.png"
              alt="Vyntra"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="text-white font-bold text-lg">Dashboard</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
              {user?.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email}
              </p>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
                user?.role === 'admin' 
                  ? 'bg-purple-100 text-purple-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {user?.role === 'admin' ? 'Administrador' : 'Cliente'}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {filteredSidebarItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group ${
                pathname === item.href
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-600'
              }`}
            >
              <span className="text-lg mr-3">{item.icon}</span>
              {item.label}
              {pathname === item.href && (
                <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
              )}
            </a>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200 group"
          >
            <span className="text-lg mr-3">🚪</span>
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : ''}`}>
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {sidebarItems.find(item => item.href === pathname)?.label || 'Dashboard'}
              </h1>
              <p className="text-sm text-gray-500">
                Bienvenido de vuelta, {user?.name}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.5 6h7.5M10.5 10h7.5M10.5 14h4" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {user?.name.charAt(0)}
                </div>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
} 