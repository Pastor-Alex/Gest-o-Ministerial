import React from 'react';
import { UserProfile } from '../types';
import { DAYS_OF_WEEK } from '../constants';
import { User, ShieldCheck } from 'lucide-react';

interface SettingsProps {
  userProfile: UserProfile;
  onUpdateProfile: (p: UserProfile) => void;
}

const Settings: React.FC<SettingsProps> = ({ userProfile, onUpdateProfile }) => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-100 rounded-full">
            <User className="text-indigo-600" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Perfil Pastoral</h2>
            <p className="text-sm text-gray-500">Gerencie suas configurações de limites e preferências.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
            <input
              type="text"
              value={userProfile.name}
              onChange={(e) => onUpdateProfile({...userProfile, name: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck size={18} className="text-green-600"/>
              <label className="block text-sm font-bold text-gray-800">Dia de Descanso (Sabbath)</label>
            </div>
            <p className="text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded-md">
              O sistema irá alertar caso você tente agendar atividades ministeriais pesadas neste dia.
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {DAYS_OF_WEEK.map((day, index) => (
                <button
                  key={index}
                  onClick={() => onUpdateProfile({...userProfile, restDay: index})}
                  className={`p-3 text-sm rounded-lg border transition-all ${
                    userProfile.restDay === index
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-offset-1 ring-indigo-300'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;