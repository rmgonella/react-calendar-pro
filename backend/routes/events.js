const express = require('express');
const Event = require('../models/Event');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/events
// @desc    Obter todos os eventos do usuário
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    
    // Construir filtros
    const filters = { user: req.user._id };
    
    if (status && status !== 'all') {
      filters.status = status;
    }
    
    if (startDate && endDate) {
      filters.start = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const events = await Event.find(filters).sort({ start: 1 });
    
    res.json(events);
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   GET /api/events/:id
// @desc    Obter evento específico
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });
    
    if (!event) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }
    
    res.json(event);
  } catch (error) {
    console.error('Erro ao buscar evento:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   POST /api/events
// @desc    Criar novo evento
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, start, end, status } = req.body;
    
    const event = new Event({
      title,
      description,
      start: new Date(start),
      end: new Date(end),
      status: status || 'Pendente',
      user: req.user._id
    });
    
    await event.save();
    
    res.status(201).json({
      message: 'Evento criado com sucesso',
      event
    });
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   PUT /api/events/:id
// @desc    Atualizar evento
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, start, end, status } = req.body;
    
    const event = await Event.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });
    
    if (!event) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }
    
    // Atualizar campos
    if (title) event.title = title;
    if (description !== undefined) event.description = description;
    if (start) event.start = new Date(start);
    if (end) event.end = new Date(end);
    if (status) event.status = status;
    
    await event.save();
    
    res.json({
      message: 'Evento atualizado com sucesso',
      event
    });
  } catch (error) {
    console.error('Erro ao atualizar evento:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   DELETE /api/events/:id
// @desc    Deletar evento
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user._id 
    });
    
    if (!event) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }
    
    res.json({ message: 'Evento deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar evento:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   PATCH /api/events/:id/status
// @desc    Atualizar status do evento
// @access  Private
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['Pendente', 'Concluído'].includes(status)) {
      return res.status(400).json({ message: 'Status inválido' });
    }
    
    const event = await Event.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { status },
      { new: true }
    );
    
    if (!event) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }
    
    res.json({
      message: 'Status atualizado com sucesso',
      event
    });
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

module.exports = router;
