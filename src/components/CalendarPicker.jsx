import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

const feriadosNacionais = [
  { date: '2024-01-01', name: 'Ano Novo', color: 'bg-blue-400' },
  { date: '2024-04-21', name: 'Tiradentes', color: 'bg-green-400' },
  { date: '2024-05-01', name: 'Dia do Trabalho', color: 'bg-red-400' },
  { date: '2024-09-07', name: 'Independência', color: 'bg-yellow-400' },
  { date: '2024-10-12', name: 'Nossa Senhora Aparecida', color: 'bg-purple-400' },
  { date: '2024-11-02', name: 'Finados', color: 'bg-gray-400' },
  { date: '2024-11-15', name: 'Proclamação da República', color: 'bg-orange-400' },
  { date: '2024-12-25', name: 'Natal', color: 'bg-red-500' },
];

export default function CalendarPicker({ userDates = [], onDateSelect, onAddDate, onRemoveDate }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDateName, setNewDateName] = useState('');

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayIndex = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const formatDateKey = (day) => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${year}-${month}-${dayStr}`;
  };

  const isHoliday = (day) => {
    const dateKey = formatDateKey(day);
    return feriadosNacionais.find(h => h.date === dateKey);
  };

  const isUserDate = (day) => {
    const dateKey = formatDateKey(day);
    return userDates.find(d => d.date === dateKey);
  };

  const handleDayClick = (day) => {
    const dateKey = formatDateKey(day);
    setSelectedDate(dateKey);
    onDateSelect?.(dateKey);
  };

  const handleAddDate = () => {
    if (newDateName.trim() && selectedDate) {
      onAddDate?.(selectedDate, newDateName.trim());
      setNewDateName('');
      setShowAddModal(false);
    }
  };

  const handleRemoveDate = (dateKey) => {
    onRemoveDate?.(dateKey);
  };

  const changeMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const renderDays = () => {
    const days = [];
    
    // Dias vazios no início
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(<div key={`empty-${i}`} className="w-10 h-10"></div>);
    }

    // Dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = formatDateKey(day);
      const holiday = isHoliday(day);
      const userDate = isUserDate(day);
      const isSelected = selectedDate === dateKey;
      const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

      days.push(
        <motion.div
          key={day}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`
            relative w-10 h-10 flex items-center justify-center rounded-lg cursor-pointer
            transition-all duration-200 text-sm font-medium
            ${isToday ? 'ring-2 ring-purple-400' : ''}
            ${isSelected ? 'bg-purple-500 text-white shadow-lg' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
            ${userDate ? 'border-2 border-pink-400' : ''}
            ${holiday ? `${holiday.color} text-white` : ''}
          `}
          onClick={() => handleDayClick(day)}
        >
          {day}
          {userDate && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full border-2 border-white dark:border-gray-800"></div>
          )}
          {holiday && (
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white dark:bg-gray-800 rounded-full"></div>
          )}
        </motion.div>
      );
    }

    return days;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700 max-w-md mx-auto">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Calendário de Datas</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => changeMonth(-1)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
          </button>
          <span className="text-xl font-semibold text-gray-800 dark:text-gray-100 min-w-[140px] text-center">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button
            onClick={() => changeMonth(1)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <ChevronRightIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Dias da semana */}
      <div className="grid grid-cols-7 gap-1 mb-3">
        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(day => (
          <div key={day} className="w-10 h-8 flex items-center justify-center text-sm font-semibold text-gray-500 dark:text-gray-400">
            {day}
          </div>
        ))}
      </div>

      {/* Calendário */}
      <div className="grid grid-cols-7 gap-1 mb-6">
        {renderDays()}
      </div>

      {/* Legenda */}
      <div className="flex flex-wrap gap-3 text-xs mb-4">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
          <span>Suas datas</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
          <span>Feriados</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
          <span>Selecionado</span>
        </div>
      </div>

      {/* Botão adicionar */}
      {selectedDate && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => setShowAddModal(true)}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
        >
          ➕ Adicionar data em {selectedDate.split('-').reverse().join('/')}
        </motion.button>
      )}

      {/* Modal adicionar */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Adicionar Data Especial</h4>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <XMarkIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
              
              <input
                type="text"
                placeholder="Nome da data (ex: Aniversário, Reunião...)"
                value={newDateName}
                onChange={(e) => setNewDateName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-purple-500 transition-colors duration-200 mb-6 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                autoFocus
              />
              
              <div className="flex gap-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddDate}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Adicionar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lista de datas do usuário */}
      {userDates.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <span>📅</span> Suas Datas Especiais
          </h4>
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {userDates.map((date, index) => (
              <motion.div
                key={date.date}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-pink-500 shadow-sm"></div>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-100">{date.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{date.date.split('-').reverse().join('/')}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveDate(date.date)}
                  className="p-2 rounded-full hover:bg-red-100 text-red-600 transition-all duration-200 hover:scale-110"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}