import type { CalendarEvent, ProcessedEvent, CalendarDay, CalendarWeek, EventBar } from '../types/calendar'

/**
 * Converte eventos brutos em eventos processados
 */
export function processEvents(events: CalendarEvent[]): ProcessedEvent[] {
  return events.map(event => ({
    id: event.id,
    title: event.title,
    lab_name: event.lab_name,
    media_type_name: event.media_type_detail.name,
    mediaIcon: getMediaIcon(event.media_type_detail.name),
    description: event.description,
    color: event.media_type_detail.color,
    start_date: event.start_date,
    end_date: event.end_date,
    continues_next_month: event.continues_next_month || false,
    original_end_date: event.original_end_date,
    comes_from_previous_month: event.comes_from_previous_month || false,
    active: event.active
  }))
}

/**
 * Gera as semanas do calendário para um mês específico
 */
export function generateCalendarWeeks(
  year: number, 
  month: number, 
  processedEvents: ProcessedEvent[]
): CalendarWeek[] {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  
  // Encontrar o primeiro dia da primeira semana (segunda-feira)
  const firstDayOfWeek = firstDay.getDay()
  const daysToSubtract = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1
  
  const calendarStart = new Date(firstDay)
  calendarStart.setDate(firstDay.getDate() - daysToSubtract)
  
  // Encontrar o último dia da última semana (domingo)
  const lastDayOfWeek = lastDay.getDay()
  const daysToAdd = lastDayOfWeek === 0 ? 0 : 7 - lastDayOfWeek
  
  const calendarEnd = new Date(lastDay)
  calendarEnd.setDate(lastDay.getDate() + daysToAdd)
  
  const weeks: CalendarWeek[] = []
  const currentDateObj = new Date(calendarStart)
  const today = new Date()
  
  while (currentDateObj <= calendarEnd) {
    const weekDays: CalendarDay[] = []
    
    // Criar 7 dias para a semana
    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(currentDateObj)
      const dateString = dayDate.toISOString().split('T')[0]
      const isCurrentMonth = dayDate.getMonth() === month
      const isToday = dayDate.toDateString() === today.toDateString()
      
      weekDays.push({
        date: dateString,
        dayNumber: dayDate.getDate(),
        isCurrentMonth,
        isToday
      })
      
      currentDateObj.setDate(currentDateObj.getDate() + 1)
    }
    
    if (weekDays.length === 7) {
      const weekStart = new Date(weekDays[0].date)
      const weekEnd = new Date(weekDays[6].date)
      const weekEvents = processWeekEvents(
        weekStart, 
        weekEnd, 
        weekDays, 
        calendarEnd, 
        processedEvents,
        year,
        month
      )
      const maxEventRow = weekEvents.reduce((max, event) => Math.max(max, event.row), -1)
      const height = Math.max(140, 80 + (maxEventRow + 1) * 36) // Altura base maior + espaçamento entre eventos
      
      weeks.push({
        days: weekDays,
        events: weekEvents,
        height
      })
    }
  }
  
  return weeks
}

/**
 * Processa eventos de uma semana específica
 */
function processWeekEvents(
  weekStart: Date,
  weekEnd: Date,
  weekDays: CalendarDay[],
  calendarEnd: Date,
  processedEvents: ProcessedEvent[],
  currentYear: number,
  currentMonth: number
): EventBar[] {
  const weekEvents: EventBar[] = []
  const occupiedRows: boolean[][] = []
  
  // Inicializar matriz de ocupação
  for (let row = 0; row < 10; row++) {
    occupiedRows[row] = new Array(7).fill(false)
  }
  
  processedEvents.forEach(event => {
    const eventStart = new Date(event.start_date)
    const eventEnd = new Date(event.end_date)
    const actualEventEnd = event.continues_next_month ? new Date(calendarEnd) : eventEnd
    
    if (eventStart <= weekEnd && actualEventEnd >= weekStart) {
      const eventDays: number[] = []
      
      weekDays.forEach((day, dayIndex) => {
        const dayDate = new Date(day.date)
        if (dayDate >= eventStart && dayDate <= actualEventEnd) {
          eventDays.push(dayIndex)
        }
      })
      
      if (eventDays.length > 0) {
        const startCol = eventDays[0]
        const endCol = eventDays[eventDays.length - 1]
        const span = endCol - startCol + 1
        
        // Encontrar linha disponível
        let assignedRow = 0
        let foundRow = false
        
        while (!foundRow && assignedRow < 10) {
          let canUseRow = true
          
          for (let col = startCol; col <= endCol; col++) {
            if (occupiedRows[assignedRow][col]) {
              canUseRow = false
              break
            }
          }
          
          if (canUseRow) {
            for (let col = startCol; col <= endCol; col++) {
              occupiedRows[assignedRow][col] = true
            }
            foundRow = true
          } else {
            assignedRow++
          }
        }
        
        const weekStartDay = new Date(weekDays[0].date)
        const weekEndDay = new Date(weekDays[6].date)
        
        const isStart = eventStart >= weekStartDay && eventStart <= weekEndDay
        const isEnd = actualEventEnd >= weekStartDay && actualEventEnd <= weekEndDay
        const comesFromPreviousWeek = eventStart < weekStartDay
        
        // Detectar se vem do mês anterior
        const eventStartMonth = eventStart.getMonth()
        const eventStartYear = eventStart.getFullYear()
        const startsInPreviousMonth = (eventStartYear < currentYear) || 
                                    (eventStartYear === currentYear && eventStartMonth < currentMonth)
        
        // Detectar se o evento continua além do mês atual
        const eventEndMonth = eventEnd.getMonth()
        const eventEndYear = eventEnd.getFullYear()
        const continuesNextMonth = (eventEndYear > currentYear) || 
                                 (eventEndYear === currentYear && eventEndMonth > currentMonth)
        
        // Se o evento continua no próximo mês e termina no último dia da semana
        const isLastVisibleSegment = continuesNextMonth && endCol === 6
        
        weekEvents.push({
          event,
          isStart,
          isEnd,
          comesFromPreviousWeek,
          startsInPreviousMonth,
          row: assignedRow,
          startCol,
          span,
          isLastVisibleSegment,
          continuesNextMonth
        })
      }
    }
  })
  
  return weekEvents
}

/**
 * Retorna o ícone apropriado para o tipo de mídia
 */
export function getMediaIcon(mediaType: string): string {
  switch (mediaType.toLowerCase()) {
    case 'tv':
    case 'tv/radio':
      return 'mdi-television'
    case 'social media':
      return 'mdi-share-variant'
    case 'pharmacie':
      return 'mdi-medical-bag'
    case 'radio':
      return 'mdi-radio'
    case 'print':
      return 'mdi-newspaper'
    case 'digital':
      return 'mdi-laptop'
    case 'outdoor':
      return 'mdi-billboard'
    case 'events':
      return 'mdi-calendar-account'
    case 'webinar':
      return 'mdi-video-account'
    default:
      return 'mdi-calendar-blank'
  }
}