import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import UploadButton from '../components/UploadButton';
import CalendarPicker from '../components/CalendarPicker';
import { motion } from 'framer-motion';
import api from '../services/api';
import { customDatesService } from '../services/customDates';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [saving, setSaving] = useState(false);
  const [xp, setXp] = useState(user?.xp || 0);
  const [level, setLevel] = useState(user?.level || 1);
  const [streak, setStreak] = useState(user?.streak || 0);
  const [badges, setBadges] = useState(Array.isArray(user?.badges) ? user.badges : []);
  const [customDates, setCustomDates] = useState([]);
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const avatarSrc = avatarUrl?.startsWith('/') ? baseURL + avatarUrl : avatarUrl;

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ name, avatarUrl });
      // Subtle success indication instead of alert
      console.log('Perfil atualizado com sucesso!');
    } catch (err) {
      console.error(err);
      // Error handling without alert
      console.error('Falha ao atualizar perfil');
    } finally {
      setSaving(false);
    }
  };

  const handleAddDate = async (date, name) => {
    try {
      await customDatesService.createCustomDate(date, name);
      await loadCustomDates();
      // Removed alert for better UX
      console.log('Data adicionada com sucesso!');
    } catch (err) {
      console.error('Erro ao adicionar data:', err);
      // Removed error alert
      console.error('Erro ao adicionar data');
    }
  };

  const handleRemoveDate = async (date) => {
    try {
      const dateToDelete = customDates.find(d => d.date === date);
      if (dateToDelete) {
        await customDatesService.deleteCustomDate(dateToDelete.id);
        await loadCustomDates();
        // Removed alert for better UX
        console.log('Data removida com sucesso!');
      }
    } catch (err) {
      console.error('Erro ao remover data:', err);
      // Removed error alert
      console.error('Erro ao remover data');
    }
  };

  useEffect(() => {
    // Sync local gamified state if user updates from context
    setXp(user?.xp || 0);
    setLevel(user?.level || 1);
    setStreak(user?.streak || 0);
    setBadges(Array.isArray(user?.badges) ? user.badges : []);
    
    // Carregar datas personalizadas
    loadCustomDates();
  }, [user]);

  const loadCustomDates = async () => {
    try {
      const dates = await customDatesService.getCustomDates();
      setCustomDates(dates);
    } catch (err) {
      console.error('Erro ao carregar datas:', err);
    }
  };

  const claimDaily = async () => {
    try {
      const res = await api.post('/users/me/streak');
      setStreak(res.data.streak || 0);
      // Award small XP for daily check-in
      const xpRes = await api.post('/users/me/xp', { amount: 10 });
      setXp(xpRes.data.xp || xp + 10);
      setLevel(xpRes.data.level || level);
      // Removed alert - let the UI show the change naturally
      console.log('Check-in diário concluído! +10 XP');
    } catch (err) {
      console.error(err);
      // Removed alert - let the error be handled by the UI
      console.error(err.response?.data?.message || 'Falha no check-in diário');
    }
  };

  const addBadge = async (badge) => {
    try {
      const res = await api.post('/users/me/badges', { badge });
      setBadges(res.data.badges || []);
      // Removed alert - let the UI show the new badge
      console.log('Conquista adicionada!');
    } catch (err) {
      console.error(err);
      // Removed alert - let the error be handled by the UI
      console.error(err.response?.data?.message || 'Falha ao adicionar conquista');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Perfil</h2>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="card p-4 duo-card">
        <div className="flex items-center gap-4 mb-4">
          {avatarSrc && <img src={avatarSrc} alt="Foto" className="h-16 w-16 rounded-full object-cover shadow-sm" />}
          <div>
            <div className="text-lg font-bold text-duo-green">Nível {level}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Sequência diária: {streak} 🔥</div>
          </div>
        </div>
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="font-medium text-gray-800 dark:text-gray-200">XP</span>
            <span className="text-gray-600 dark:text-gray-300">{xp} / {(Math.floor(xp/100)+1)*100}</span>
          </div>
          <div className="duo-progress">
            <div className="duo-progress-bar" style={{ width: `${Math.min(100, (xp % 100))}%` }} />
          </div>
        </div>
        <div className="flex gap-2">
          <button type="button" className="btn btn-primary" onClick={claimDaily}>Check-in diário</button>
          <button type="button" className="btn btn-secondary" onClick={() => addBadge({ id: Date.now(), name: 'Primeiro Miado' })}>Ganhar conquista</button>
        </div>
      </motion.div>

      <form onSubmit={save} className="card p-4 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome</label>
            <input className="mt-1 w-full rounded-md bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 dark:text-white" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Foto</label>
            <UploadButton onUploaded={setAvatarUrl} />
            {avatarSrc && <img src={avatarSrc} alt="Foto" className="mt-2 h-16 w-16 rounded-full object-cover" />}
          </div>
        </div>
        <div className="mt-4">
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</button>
        </div>
      </form>

      {badges && badges.length > 0 && (
        <div className="card p-4 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Conquistas</h3>
          <div className="flex flex-wrap gap-2">
            {badges.map((b) => (
              <motion.span key={b.id || b.name} whileHover={{ scale: 1.05 }} className="inline-flex items-center px-3 py-1 rounded-full bg-duo-yellow text-gray-800 text-sm shadow-sm">
                🏅 {b.name || 'Badge'}
              </motion.span>
            ))}
          </div>
        </div>
      )}

      {/* Calendário de Datas Personalizadas */}
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">📅 Calendário de Datas Especiais</h3>
        <CalendarPicker
          userDates={customDates}
          onDateSelect={(date) => console.log('Data selecionada:', date)}
          onAddDate={handleAddDate}
          onRemoveDate={handleRemoveDate}
        />
      </div>
    </div>
  );
};

export default Profile;