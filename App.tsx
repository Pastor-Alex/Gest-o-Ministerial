import React, { useState } from 'react';
import { 
  Layout, 
  Calendar as CalendarIcon, 
  PieChart, 
  Settings as SettingsIcon, 
  Plus,
  Menu
} from 'lucide-react';
import CalendarView from './components/CalendarView';
import WeeklyReport from './components/WeeklyReport';
import Settings from './components/Settings';
import TaskModal from './components/TaskModal';
import { TaskObject, UserProfile, ViewMode, Category, SubType } from './types';

// Mock Initial Data
const INITIAL_TASKS: TaskObject[] = [
  {
    id: '1',
    title: 'Preparo Sermão: Romanos',
    category: Category.MINISTRY,
    subType: SubType.SERMON_PREP,
    startTime: new Date().toISOString().split('T')[0] + 'T09:00:00',
    endTime: new Date().toISOString().split('T')[0] + 'T11:00:00',
    isRecurring: true,
    bibleReference: 'Romanos 8:1-17',
    notes: 'Focar na vida no Espírito.'
  },
  {
    id: '2',
    title: 'Devocional Matinal',
    category: Category.PERSONAL_GROWTH,
    subType: SubType.DEVOTIONAL,
    startTime: new Date().toISOString().split('T')[0] + 'T06:00:00',
    endTime: new Date().toISOString().split('T')[0] + 'T07:00:00',
    isRecurring: true,
  },
  {
    id: '3',
    title: 'Jantar com Família',
    category: Category.FAMILY,
    subType: SubType.LEISURE,
    startTime: new Date().toISOString().split('T')[0] + 'T19:00:00',
    endTime: new Date().toISOString().split('T')[0] + 'T21:00:00',
    isRecurring: false,
  }
];

const INITIAL_PROFILE: UserProfile = {
  name: 'Pastor Alex',
  restDay: 1 // Segunda-feira (index 1)
};

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('CALENDAR');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  
  // App State
  const [tasks, setTasks] = useState<TaskObject[]>(INITIAL_TASKS);
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_PROFILE);

  const handleSaveTask = (newTask: TaskObject) => {
    setTasks([...tasks, newTask]);
  };

  const renderContent = () => {
    switch (viewMode) {
      case 'CALENDAR':
        return <CalendarView tasks={tasks} userProfile={userProfile} />;
      case 'REPORT':
        return <WeeklyReport tasks={tasks} />;
      case 'SETTINGS':
        return <Settings userProfile={userProfile} onUpdateProfile={setUserProfile} />;
      default:
        return <CalendarView tasks={tasks} userProfile={userProfile} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className={`fixed md:sticky top-0 z-30 h-screen w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-6 flex items-center gap-3 border-b border-gray-100">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <Layout size={20} />
          </div>
          <h1 className="font-bold text-gray-800 text-lg">Pastor Planner</h1>
        </div>

        <nav className="p-4 space-y-2">
          <button 
            onClick={() => { setViewMode('CALENDAR'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${viewMode === 'CALENDAR' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <CalendarIcon size={18} />
            Agenda Semanal
          </button>
          
          <button 
            onClick={() => { setViewMode('REPORT'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${viewMode === 'REPORT' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <PieChart size={18} />
            Relatório de Equilíbrio
          </button>

          <button 
            onClick={() => { setViewMode('SETTINGS'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${viewMode === 'SETTINGS' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <SettingsIcon size={18} />
            Configurações
          </button>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold">
              {userProfile.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{userProfile.name}</p>
              <p className="text-xs text-gray-500">Online</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Header (Mobile) & Actions */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
             <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-gray-600">
               <Menu />
             </button>
             <h2 className="text-xl font-bold text-gray-800 hidden md:block">
               {viewMode === 'CALENDAR' && 'Agenda Semanal'}
               {viewMode === 'REPORT' && 'Relatório de Equilíbrio'}
               {viewMode === 'SETTINGS' && 'Configurações'}
             </h2>
          </div>
          
          <button 
            onClick={() => setIsTaskModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm active:scale-95"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Nova Atividade</span>
            <span className="sm:hidden">Novo</span>
          </button>
        </header>

        {/* Dynamic Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          {renderContent()}
        </div>
      </main>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Modal */}
      <TaskModal 
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        userProfile={userProfile}
      />
    </div>
  );
};

export default App;