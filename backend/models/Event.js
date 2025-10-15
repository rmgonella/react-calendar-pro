const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Título é obrigatório'],
    trim: true,
    maxlength: [100, 'Título deve ter no máximo 100 caracteres']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Descrição deve ter no máximo 500 caracteres']
  },
  start: {
    type: Date,
    required: [true, 'Data de início é obrigatória']
  },
  end: {
    type: Date,
    required: [true, 'Data de fim é obrigatória']
  },
  status: {
    type: String,
    enum: ['Pendente', 'Concluído'],
    default: 'Pendente'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Validação para garantir que a data de fim seja posterior à de início
eventSchema.pre('save', function(next) {
  if (this.end <= this.start) {
    next(new Error('Data de fim deve ser posterior à data de início'));
  } else {
    next();
  }
});

module.exports = mongoose.model('Event', eventSchema);
