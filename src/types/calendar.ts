export interface MediaTypeDetail {
  id: number
  name: string
  color: string
}

export interface CalendarEvent {
  id: number
  title: string
  lab: number
  lab_name: string
  media_type: number
  media_type_detail: MediaTypeDetail
  start_date: string
  end_date: string
  description: string
  active: boolean
  products: number[]
  continues_next_month?: boolean
  original_end_date?: string
  comes_from_previous_month?: boolean
}

export interface ProcessedEvent {
  id: number
  title: string
  lab_name: string
  media_type_name: string
  mediaIcon: string
  description: string
  color: string
  start_date: string
  end_date: string
  continues_next_month: boolean
  original_end_date?: string
  comes_from_previous_month: boolean
  active: boolean
}

export interface EventBar {
  event: ProcessedEvent
  isStart: boolean
  isEnd: boolean
  comesFromPreviousWeek: boolean
  startsInPreviousMonth: boolean
  row: number
  startCol: number
  span: number
  isLastVisibleSegment?: boolean
  continuesNextMonth?: boolean
}

export interface CalendarDay {
  date: string
  dayNumber: number
  isCurrentMonth: boolean
  isToday: boolean
}

export interface CalendarWeek {
  days: CalendarDay[]
  events: EventBar[]
  height: number
}