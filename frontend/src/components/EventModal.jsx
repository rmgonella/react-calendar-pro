import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  Calendar, 
  Clock, 
  FileText, 
  Tag, 
  Trash2, 
  Save,
  AlertTriangle,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { formatDate, formatTime, createDateFromInputs } from '../utils/dateUtils';

const EventModal = ({ event, onSave, onDelete, onStatusChange, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    status: 'Pendente'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (event) {
      const startDate = new Date(event.start);
      const endDate = new Date(event.end);
      
      setFormData({
        title: event.title || '',
        description: event.description || '',
        startDate: startDate.toISOString().split('T')[0],
        startTime: startDate.toTimeString().slice(0, 5),
        endDate: endDate.toISOString().split('T')[0],
        endTime: endDate.toTimeString().slice(0, 5),
        status: event.status || 'Pendente'
      });
    }
  }, [event]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Data de início é obrigatória';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'Data de fim é obrigatória';
    }
    
    if (!formData.startTime) {
      newErrors.startTime = 'Hora de início é obrigatória';
    }
    
    if (!formData.endTime) {
      newErrors.endTime = 'Hora de fim é obrigatória';
    }
    
    // Validar se a data/hora de fim é posterior à de início
    if (formData.startDate && formData.endDate && formData.startTime && formData.endTime) {
      const startDateTime = createDateFromInputs(formData.startDate, formData.startTime);
      const endDateTime = createDateFromInputs(formData.endDate, formData.endTime);
      
      if (endDateTime <= startDateTime) {
        newErrors.endDate = 'Data/hora de fim deve ser posterior à de início';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSelectChange = (value) => {
    setFormData(prev => ({
      ...prev,
      status: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      const startDateTime = createDateFromInputs(formData.startDate, formData.startTime);
      const endDateTime = createDateFromInputs(formData.endDate, formData.endTime);

      const eventData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        start: startDateTime.toISOString(),
        end: endDateTime.toISOString(),
        status: formData.status
      };

      await onSave(eventData);
    } catch (error) {
      console.error('Erro ao salvar evento:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja deletar este evento?')) {
      setLoading(true);
      try {
        await onDelete(event._id);
      } catch (error) {
        console.error('Erro ao deletar evento:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleStatusChangeClick = async (newStatus) => {
    setLoading(true);
    try {
      await onStatusChange(event._id, newStatus);
      setFormData(prev => ({ ...prev, status: newStatus }));
    } catch (error) {
      console.error('Erro ao alterar status:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Concluído':
        return <CheckCircle className="h-4 w-4" />;
      case 'Pendente':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Concluído':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Pendente':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border-0 bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-900">
                {event?._id ? 'Editar Evento' : 'Novo Evento'}
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {event?._id && (
            <div className="flex items-center gap-2 mt-3">
              <Badge className={getStatusColor(formData.status)}>
                {getStatusIcon(formData.status)}
                <span className="ml-1">{formData.status}</span>
              </Badge>
              {event.createdAt && (
                <span className="text-xs text-gray-500">
                  Criado em {new Date(event.createdAt).toLocaleDateString('pt-BR')}
                </span>
              )}
            </div>
          )}
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Título */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Título *
              </Label>
              <Input
                id="title"
                name="title"
                type="text"
                placeholder="Digite o título do evento"
                value={formData.title}
                onChange={handleChange}
                className={`h-12 ${errors.title ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'}`}
                required
              />
              {errors.title && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {errors.title}
                </p>
              )}
            </div>
            
            {/* Descrição */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                Descrição
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Digite uma descrição (opcional)"
                value={formData.description}
                onChange={handleChange}
                className="min-h-[100px] border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                rows={3}
              />
            </div>
            
            {/* Data e Hora */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Início */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-green-600" />
                  Data e Hora de Início *
                </h3>
                
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-xs text-gray-600">Data de Início</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleChange}
                    className={`h-10 ${errors.startDate ? 'border-red-300' : 'border-gray-200'}`}
                    required
                  />
                  {errors.startDate && (
                    <p className="text-xs text-red-600">{errors.startDate}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="startTime" className="text-xs text-gray-600">Hora de Início</Label>
                  <Input
                    id="startTime"
                    name="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={handleChange}
                    className={`h-10 ${errors.startTime ? 'border-red-300' : 'border-gray-200'}`}
                    required
                  />
                  {errors.startTime && (
                    <p className="text-xs text-red-600">{errors.startTime}</p>
                  )}
                </div>
              </div>
              
              {/* Fim */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-red-600" />
                  Data e Hora de Fim *
                </h3>
                
                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-xs text-gray-600">Data de Fim</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleChange}
                    className={`h-10 ${errors.endDate ? 'border-red-300' : 'border-gray-200'}`}
                    required
                  />
                  {errors.endDate && (
                    <p className="text-xs text-red-600">{errors.endDate}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endTime" className="text-xs text-gray-600">Hora de Fim</Label>
                  <Input
                    id="endTime"
                    name="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={handleChange}
                    className={`h-10 ${errors.endTime ? 'border-red-300' : 'border-gray-200'}`}
                    required
                  />
                  {errors.endTime && (
                    <p className="text-xs text-red-600">{errors.endTime}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Status */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Status
              </Label>
              <Select value={formData.status} onValueChange={handleSelectChange}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pendente">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                      Pendente
                    </div>
                  </SelectItem>
                  <SelectItem value="Concluído">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Concluído
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Botões de Ação */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
              {/* Botões de Status (apenas para eventos existentes) */}
              {event?._id && (
                <div className="flex gap-2 flex-1">
                  {formData.status !== 'Concluído' && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChangeClick('Concluído')}
                      disabled={loading}
                      className="border-green-200 text-green-700 hover:bg-green-50"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Marcar como Concluído
                    </Button>
                  )}
                  
                  {formData.status !== 'Pendente' && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChangeClick('Pendente')}
                      disabled={loading}
                      className="border-amber-200 text-amber-700 hover:bg-amber-50"
                    >
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Marcar como Pendente
                    </Button>
                  )}
                </div>
              )}
              
              {/* Botões Principais */}
              <div className="flex gap-2 sm:ml-auto">
                {event?._id && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDelete}
                    disabled={loading}
                    className="border-red-200 text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Deletar
                  </Button>
                )}
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Salvando...
                    </div>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventModal;
