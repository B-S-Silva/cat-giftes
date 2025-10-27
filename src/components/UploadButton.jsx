import { useState } from 'react';
import { storage } from '../firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { motion } from 'framer-motion';

const UploadButton = ({ onUpload, pathPrefix = 'images', accept = 'image/*', label = 'Enviar imagem', disabled }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const uniqueName = `${Date.now()}-${file.name}`;
      const storageRef = ref(storage, `${pathPrefix}/${uniqueName}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      onUpload?.(url);
    } catch (err) {
      console.error('Erro ao enviar imagem:', err);
      alert('Falha ao enviar imagem.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.label whileTap={{ scale: 0.98 }} className={`inline-flex items-center px-3 py-2 rounded-md cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600`}>
      <input type="file" accept={accept} className="hidden" onChange={handleFileChange} disabled={disabled || uploading} />
      {uploading ? 'Enviando...' : label}
    </motion.label>
  );
};

export default UploadButton;