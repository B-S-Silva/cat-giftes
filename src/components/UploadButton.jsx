import { useState } from "react";
import { motion } from "framer-motion";
import api from "../services/api";

export default function UploadButton({ onUploaded, fieldName = "image", uploadPath = "/upload" }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post(uploadPath, formData, { headers: { "Content-Type": "multipart/form-data" } });
      onUploaded?.(res.data.url);
    } catch (err) {
      setError(err.response?.data?.message || "Falha no upload");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <label className="btn btn-secondary cursor-pointer">
        <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        {uploading ? "Enviando..." : "Enviar imagem"}
      </label>
      {error && (
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm">
          {error}
        </motion.span>
      )}
    </div>
  );
}