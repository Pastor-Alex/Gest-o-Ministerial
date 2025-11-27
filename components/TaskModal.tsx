import React, { useState, useEffect } from 'react';
import { Category, SubType, TaskObject, UserProfile } from '../types';
import { CATEGORY_LABELS, SUBTYPE_LABELS, DAYS_OF_WEEK } from '../constants';
import { X, AlertTriangle, Info } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: TaskObject) => void;
  userProfile: UserProfile;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, userProfile }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>(Category.MINISTRY);
  const [subType, setSubType] = useState<SubType>(SubType.GENERIC);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [isRecurring, setIsRecurring] = useState(false);
  const [notes, setNotes] = useState('');
  const [bibleReference, setBibleReference] = useState('');
  
  // Warnings
  const [restDayWarning, setRestDayWarning] = useState<string | null>(null);
  const [durationWarning, setDurationWarning] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Reset fields when opening
      setTitle('');
      setCategory(Category.MINISTRY);
      setSubType(SubType.GENERIC);
      const today = new Date();
      setDate(today.toISOString().split('T')[0]);
      setStartTime('09:00');
      setEndTime('10:00');
      setNotes('');
      setBibleReference('');
      setIsRecurring(false);
    }
  }, [isOpen]);

  // Validation Logic (RF3 & RF4)
  useEffect(() => {
    setRestDayWarning(null);
    setDurationWarning(null);

    if (!date) return;

    const selectedDate = new Date(date);
    // getDay returns 0 for Sunday... 6 for Saturday.
    // userProfile.restDay uses same index.
    // RF4: Warning on Rest Day for Ministry
    if (selectedDate.getDay() === userProfile.restDay && category === Category.MINISTRY) {
      setRestDayWarning(`Atenção Pastor: ${DAYS_OF_WEEK[userProfile.restDay]} é seu dia de descanso definido. Agendar atividades ministeriais pode violar seu descanso.`);
    }

    // RF3: Devotional logic
    if (category === Category.PERSONAL_GROWTH && subType === SubType.DEVOTIONAL) {
        const start = new Date(`1970-01-01T${startTime}:00`);
        const end = new Date(`1970-01-01T${endTime}:00`);
        const diffMinutes = (end.getTime() - start.getTime()) / 60000;
        
        if (diffMinutes < 15) {
            setDurationWarning("O tempo de devocional deve ser de no mínimo 15 minutos (Regra de Prioridade Espiritual).");
        }
    }

  }, [date, category, startTime, endTime, subType, userProfile.restDay]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (durationWarning) {
        alert("Por favor, ajuste o tempo conforme os requisitos espirituais.");
        return;
    }

    const newTask: TaskObject = {
      id: crypto.randomUUID(),
      title,
      category,
      subType,
      startTime: `${date}T${startTime}:00`,
      endTime: `${date}T${endTime}:00`,
      isRecurring,
      notes: notes || undefined,
      bibleReference: subType === SubType.SERMON_PREP ? bibleReference : undefined,
    };

    onSave(newTask);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Nova Atividade</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input 
              required
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              placeholder="Ex: Preparar Sermão de Domingo"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria (RF1)</label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.values(Category) as Category[]).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                      setCategory(cat);
                      // Reset subtype to something valid for generic use if needed, but for now specific logic applies
                      if (cat === Category.MINISTRY) setSubType(SubType.SERMON_PREP);
                      if (cat === Category.FAMILY) setSubType(SubType.DATE_NIGHT);
                      if (cat === Category.PERSONAL_GROWTH) setSubType(SubType.DEVOTIONAL);
                  }}
                  className={`p-2 text-xs font-semibold rounded-md transition-colors ${
                    category === cat 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
          </div>

          {/* SubType */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Atividade</label>
            <select
              value={subType}
              onChange={(e) => setSubType(e.target.value as SubType)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              {(Object.values(SubType) as SubType[]).map((st) => (
                <option key={st} value={st}>{SUBTYPE_LABELS[st]}</option>
              ))}
            </select>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
              <input 
                required
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Início</label>
              <input 
                required
                type="time" 
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fim</label>
              <input 
                required
                type="time" 
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Warnings Display */}
          {restDayWarning && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2 text-sm text-red-700">
              <AlertTriangle className="flex-shrink-0 mt-0.5" size={16} />
              <span>{restDayWarning}</span>
            </div>
          )}
          
          {durationWarning && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-start gap-2 text-sm text-yellow-700">
              <Info className="flex-shrink-0 mt-0.5" size={16} />
              <span>{durationWarning}</span>
            </div>
          )}

          {/* RF2: Sermon Prep Special Fields */}
          {category === Category.MINISTRY && subType === SubType.SERMON_PREP && (
            <div className="space-y-4 p-4 bg-orange-50 rounded-md border border-orange-100">
               <h4 className="text-sm font-bold text-orange-800 flex items-center gap-2">
                 Detalhes do Sermão (RF2)
               </h4>
               <div>
                <label className="block text-xs font-medium text-orange-800 mb-1">Referência Bíblica</label>
                <input 
                  type="text" 
                  value={bibleReference}
                  onChange={(e) => setBibleReference(e.target.value)}
                  placeholder="Ex: Romanos 8:28"
                  className="w-full p-2 border border-orange-200 rounded-md text-sm"
                />
               </div>
               <div>
                <label className="block text-xs font-medium text-orange-800 mb-1">Notas / Esboço</label>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Ideias principais..."
                  className="w-full p-2 border border-orange-200 rounded-md text-sm"
                />
               </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="recurring"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="recurring" className="text-sm text-gray-700">Evento Recorrente (Semanal)</label>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={!!durationWarning}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md 
                ${durationWarning ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
              Salvar Atividade
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default TaskModal;