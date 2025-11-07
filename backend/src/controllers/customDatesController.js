import { prisma } from '../prisma.js';

// Listar todas as datas personalizadas do usuário
export const getCustomDates = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const customDates = await prisma.customDate.findMany({
      where: { userId },
      orderBy: { date: 'asc' }
    });

    res.json(customDates);
  } catch (error) {
    console.error('Erro ao buscar datas personalizadas:', error);
    res.status(500).json({ error: 'Erro ao buscar datas' });
  }
};

// Criar nova data personalizada
export const createCustomDate = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date, name, color } = req.body;

    if (!date || !name) {
      return res.status(400).json({ error: 'Data e nome são obrigatórios' });
    }

    // Validar formato da data (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({ error: 'Formato de data inválido. Use YYYY-MM-DD' });
    }

    const customDate = await prisma.customDate.create({
      data: {
        userId,
        date,
        name,
        color: color || 'bg-pink-500'
      }
    });

    res.status(201).json(customDate);
  } catch (error) {
    console.error('Erro ao criar data personalizada:', error);
    res.status(500).json({ error: 'Erro ao criar data' });
  }
};

// Deletar data personalizada
export const deleteCustomDate = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const customDate = await prisma.customDate.findFirst({
      where: { id, userId }
    });

    if (!customDate) {
      return res.status(404).json({ error: 'Data não encontrada' });
    }

    await prisma.customDate.delete({
      where: { id }
    });

    res.json({ message: 'Data deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar data personalizada:', error);
    res.status(500).json({ error: 'Erro ao deletar data' });
  }
};

// Atualizar data personalizada
export const updateCustomDate = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { name, color } = req.body;

    const customDate = await prisma.customDate.findFirst({
      where: { id, userId }
    });

    if (!customDate) {
      return res.status(404).json({ error: 'Data não encontrada' });
    }

    const updatedDate = await prisma.customDate.update({
      where: { id },
      data: {
        name: name || customDate.name,
        color: color || customDate.color
      }
    });

    res.json(updatedDate);
  } catch (error) {
    console.error('Erro ao atualizar data personalizada:', error);
    res.status(500).json({ error: 'Erro ao atualizar data' });
  }
};