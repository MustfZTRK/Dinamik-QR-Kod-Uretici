
import React from 'react';
import { LogOut, LayoutDashboard, PlusCircle, QrCode } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  user: { name: string } | null;
  onLogout: () => void;
  onNavigate: (view: any) => void;
  currentView: string;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, onNavigate, currentView }) => {
  if (!user) return <>{children}</>;

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <QrCode className="text-indigo-400 w-8 h-8" />
          <span className="font-bold text-xl tracking-tight">Quick2File</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => onNavigate('DASHBOARD')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'DASHBOARD' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
          >
            <LayoutDashboard size={20} />
            Yönetim Paneli
          </button>
          <button
            onClick={() => onNavigate('CREATE')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'CREATE' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
          >
            <PlusCircle size={20} />
            Yeni QR Oluştur
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 truncate">
              <p className="text-sm font-medium">{user.name}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full mt-2 flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-slate-50 p-6 md:p-10">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
