import React, { useState, useEffect } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { toast } from 'react-toastify';
import { eventService } from '../services/eventService';
import EventModal from './EventModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Filter, 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Search,
  Download,
  Upload,
  BarChart3
} from 'lucide-react';

// Configurar moment para português
moment.locale('pt-br');
const localizer = momentLocalizer(moment);

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [view, setView] = useState('month');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, statusFilter, searchTerm]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await eventService.getEvents();
      
      // Converter datas para objetos Date
      const formattedEvents = data.map(event => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
        title: event.title
      }));
      
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
      toast.error('Erro ao carregar eventos');
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = events;
    
    // Filtro por status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(event => event.status === statusFilter);
    }
    
    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    setFilteredEvents(filtered);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleSelectSlot = ({ start, end }) => {
    setSelectedEvent({
      start,
      end,
      title: '',
      description: '',
      status: 'Pendente'
    });
    setShowModal(true);
  };

  const handleSaveEvent = async (eventData) => {
    try {
      if (selectedEvent._id) {
        // Atualizar evento existente
        await eventService.updateEvent(selectedEvent._id, eventData);
        toast.success('Evento atualizado com sucesso!');
      } else {
        // Criar novo evento
        await eventService.createEvent(eventData);
        toast.success('Evento criado com sucesso!');
      }
      
      setShowModal(false);
      setSelectedEvent(null);
      loadEvents();
    } catch (error) {
      console.error('Erro ao salvar evento:', error);
      toast.error('Erro ao salvar evento');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await eventService.deleteEvent(eventId);
      toast.success('Evento deletado com sucesso!');
      setShowModal(false);
      setSelectedEvent(null);
      loadEvents();
    } catch (error) {
      console.error('Erro ao deletar evento:', error);
      toast.error('Erro ao deletar evento');
    }
  };

  const handleStatusChange = async (eventId, newStatus) => {
    try {
      await eventService.updateEventStatus(eventId, newStatus);
      toast.success('Status atualizado com sucesso!');
      loadEvents();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status');
    }
  };

  const eventStyleGetter = (event) => {
    let backgroundColor = '#3b82f6';
    let borderColor = '#2563eb';
    
    if (event.status === 'Concluído') {
      backgroundColor = '#10b981';
      borderColor = '#059669';
    } else if (event.status === 'Pendente') {
      backgroundColor = '#f59e0b';
      borderColor = '#d97706';
    }
    
    return {
      style: {
        backgroundColor,
        borderColor,
        borderRadius: '8px',
        opacity: 0.9,
        color: 'white',
        border: `2px solid ${borderColor}`,
        display: 'block',
        fontSize: '12px',
        fontWeight: '500',
        padding: '2px 6px'
      }
    };
  };

  const messages = {
    allDay: 'Dia inteiro',
    previous: 'Anterior',
    next: 'Próximo',
    today: 'Hoje',
    month: 'Mês',
    week: 'Semana',
    day: 'Dia',
    agenda: 'Agenda',
    date: 'Data',
    time: 'Hora',
    event: 'Evento',
    noEventsInRange: 'Não há eventos neste período',
    showMore: total => `+ Ver mais (${total})`
  };

  // Estatísticas
  const totalEvents = events.length;
  const completedEvents = events.filter(e => e.status === 'Concluído').length;
  const pendingEvents = events.filter(e => e.status === 'Pendente').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg text-gray-600">Carregando eventos...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total de Eventos</p>
                <p className="text-3xl font-bold">{totalEvents}</p>
              </div>
              <CalendarIcon className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Concluídos</p>
                <p className="text-3xl font-bold">{completedEvents}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm font-medium">Pendentes</p>
                <p className="text-3xl font-bold">{pendingEvents}</p>
              </div>
              <Clock className="h-8 w-8 text-amber-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controles e Filtros */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CalendarIcon className="h-5 w-5 text-blue-600" />
              </div>
              Meus Compromissos
            </CardTitle>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
              {/* Busca */}
              <div className="relative flex-1 sm:flex-none sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar eventos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {/* Filtro por Status */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        Todos
                      </div>
                    </SelectItem>
                    <SelectItem value="Pendente">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        Pendente
                      </div>
                    </SelectItem>
                    <SelectItem value="Concluído">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Concluído
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Botões de Ação */}
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
                
                <Button 
                  onClick={() => setShowModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Evento
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Legenda */}
          <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">Legenda:</span>
            <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200">
              <Clock className="h-3 w-3 mr-1" />
              Pendente
            </Badge>
            <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
              <CheckCircle className="h-3 w-3 mr-1" />
              Concluído
            </Badge>
          </div>
          
          {/* Calendário */}
          <div className="h-96 md:h-[700px] bg-white rounded-lg border border-gray-200 p-4">
            <BigCalendar
              localizer={localizer}
              events={filteredEvents}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
              selectable
              eventPropGetter={eventStyleGetter}
              messages={messages}
              view={view}
              onView={setView}
              popup
              showMultiDayTimes
              step={30}
              timeslots={2}
            />
          </div>
          
          {/* Resumo dos Eventos Filtrados */}
          {(statusFilter !== 'all' || searchTerm) && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 text-blue-800">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Mostrando {filteredEvents.length} de {totalEvents} eventos
                  {statusFilter !== 'all' && ` • Filtro: ${statusFilter}`}
                  {searchTerm && ` • Busca: "${searchTerm}"`}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de evento */}
      {showModal && (
        <EventModal
          event={selectedEvent}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
          onStatusChange={handleStatusChange}
          onClose={() => {
            setShowModal(false);
            setSelectedEvent(null);
          }}
        />
      )}
    </div>
  );
};

export default Calendar;
