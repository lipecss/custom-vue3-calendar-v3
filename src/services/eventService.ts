import type { CalendarEvent } from '../types/calendar'

// Mock data - substituir por chamadas reais ao backend
const mockEvents: Record<string, CalendarEvent[]> = {
  '2025-06': [
    {
      id: 1,
      title: "Caudalie",
      lab: 1,
      lab_name: "Caudalie",
      media_type: 1,
      media_type_detail: { id: 1, name: "Réseaux sociaux", color: "#FFCC2452" },
      start_date: "2025-06-01",
      end_date: "2025-06-17",
      description: "Vinoperfect",
      active: true,
      products: [17, 18]
    },
        {
      id: 2,
      title: "EA PHARMA",
      lab: 1,
      lab_name: "EA PHARMA",
      media_type: 1,
      media_type_detail: { id: 1, name: "TV/Radio", color: "#1A7D7252" },
      start_date: "2025-06-02",
      end_date: "2025-06-07",
      description: "PUB TV GRANIONS DE CHROME",
      active: true,
      products: [17, 18]
    },
    {
      id: 3,
      title: "3M",
      lab: 1,
      lab_name: "3M",
      media_type: 1,
      media_type_detail: { id: 1, name: "Presse", color: "#176AE552" },
      start_date: "2025-06-02",
      end_date: "2025-06-08",
      description: "Campagne de notoriété produits prioritaires",
      active: true,
      products: [17, 18]
    },
        {
      id: 4,
      title: "3M",
      lab: 1,
      lab_name: "3M",
      media_type: 1,
      media_type_detail: { id: 1, name: "Presse", color: "#176AE552" },
      start_date: "2025-06-30",
      end_date: "2025-07-08",
      description: "Campagne de notoriété produits prioritaires",
      active: false,
      products: [17, 18]
    },
            {
      id: 5,
      title: "Elanco",
      lab: 1,
      lab_name: "Elanco",
      media_type: 1,
      media_type_detail: { id: 1, name: "TV/Radio", color: "#F6774852" },
      start_date: "2025-06-02",
      end_date: "2025-06-05",
      description: "PUB TV GRANIONS DE CHROME",
      active: false,
      products: [17, 18]
    },
  ],
  '2025-07': [
    {
      id: 3,
      title: "ROCHE",
      lab: 4,
      lab_name: "ROCHE",
      media_type: 2,
      media_type_detail: { id: 2, name: "Digital", color: "#FF69B4" },
      start_date: "2025-07-01",
      end_date: "2025-07-10",
      description: "Campagne digitale été",
      active: true,
      products: [25, 26],
      continues_next_month: false,
      comes_from_previous_month: true
    },
            {
      id: 2,
      title: "3M",
      lab: 1,
      lab_name: "3M",
      media_type: 1,
      media_type_detail: { id: 1, name: "Presse", color: "#176AE552" },
      start_date: "2025-06-30",
      end_date: "2025-07-08",
      description: "Campagne de notoriété produits prioritaires",
      active: false,
      products: [17, 18]
    },
  ]
}

export class EventService {
  /**
   * Busca eventos para um mês específico
   * @param year Ano
   * @param month Mês (0-11)
   * @returns Promise com array de eventos
   */
  static async getEventsByMonth(year: number, month: number): Promise<CalendarEvent[]> {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`
    return mockEvents[monthKey] || []
  }

  /**
   * Busca eventos por período (para implementação futura)
   * @param startDate Data de início
   * @param endDate Data de fim
   * @returns Promise com array de eventos
   */
  static async getEventsByDateRange(startDate: string, endDate: string): Promise<CalendarEvent[]> {
    // TODO: Implementar chamada real ao backend
    console.log('Buscando eventos entre:', startDate, 'e', endDate)
    return []
  }

  /**
   * Cria um novo evento (para implementação futura)
   * @param event Dados do evento
   * @returns Promise com evento criado
   */
  static async createEvent(event: Partial<CalendarEvent>): Promise<CalendarEvent> {
    // TODO: Implementar chamada real ao backend
    console.log('Criando evento:', event)
    throw new Error('Não implementado')
  }

  /**
   * Atualiza um evento existente (para implementação futura)
   * @param id ID do evento
   * @param event Dados atualizados
   * @returns Promise com evento atualizado
   */
  static async updateEvent(id: number, event: Partial<CalendarEvent>): Promise<CalendarEvent> {
    // TODO: Implementar chamada real ao backend
    console.log('Atualizando evento:', id, event)
    throw new Error('Não implementado')
  }

  /**
   * Remove um evento (para implementação futura)
   * @param id ID do evento
   * @returns Promise void
   */
  static async deleteEvent(id: number): Promise<void> {
    // TODO: Implementar chamada real ao backend
    console.log('Removendo evento:', id)
    throw new Error('Não implementado')
  }
}