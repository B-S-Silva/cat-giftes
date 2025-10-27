import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import UploadButton from '../components/UploadButton';
import { updateProfile } from 'firebase/auth';

const Profile = () => {
  const { currentUser } = useAuth();
  const [name, setName] = useState(currentUser?.displayName || '');
  const [photoURL, setPhotoURL] = useState(currentUser?.photoURL || '');
  const [saving, setSaving] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(currentUser, { displayName: name, photoURL });
      alert('Perfil atualizado!');
    } catch (err) {
      console.error(err);
      alert('Falha ao atualizar perfil');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Perfil</h2>
      <form onSubmit={save} className="card p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome</label>
            <input className="mt-1 w-full rounded-md bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 dark:text-white" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Foto</label>
            <UploadButton label="Enviar foto" onUpload={setPhotoURL} pathPrefix={`profile-photos/${currentUser?.uid || 'anon'}`} />
            {photoURL && <img src={photoURL} alt="Foto" className="mt-2 h-16 w-16 rounded-full object-cover" />}
          </div>
        </div>
        <div className="mt-4">
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</button>
        </div>
      </form>
    </div>
  );
};

export default Profile;