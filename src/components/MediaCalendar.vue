<template>
  <v-container fluid class="pa-0">
    <v-card flat class="calendar-container">
      <!-- Header customizado -->
      <div class="calendar-header">
        <v-btn
          icon="mdi-chevron-left"
          variant="text"
          size="small"
          @click="previousMonth"
          class="nav-btn"
        />
        <h2 class="month-title">{{ currentMonthYear }}</h2>
        <v-btn
          icon="mdi-chevron-right"
          variant="text"
          size="small"
          @click="nextMonth"
          class="nav-btn"
        />
      </div>
      
      <!-- Grid do calendário -->
      <CalendarGrid 
        :weeks="calendarWeeks" 
        :open-tooltip-id="openTooltipId"
        @chip-click="handleChipClick"
      />
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import CalendarGrid from './CalendarGrid.vue'
import { EventService } from '../services/eventService'
import { processEvents, generateCalendarWeeks } from '../utils/calendarUtils'
import type { CalendarEvent, ProcessedEvent } from '../types/calendar'

const currentDate = ref(new Date(2025, 5, 1)) // Junho 2025
const events = ref<CalendarEvent[]>([])
const loading = ref(false)

const openTooltipId = ref<string | null>(null)

function handleChipClick(eventBar) {
  const id = eventBar.event.id
  openTooltipId.value = openTooltipId.value === id ? null : id
}

function handleClickOutside(event: MouseEvent) {
  // Fecha se não clicou em nenhum chip nem no conteúdo do tooltip
  if (
    !(event.target as HTMLElement).closest('.media-chip') &&
    !(event.target as HTMLElement).closest('.event-tooltip')
  ) {
    openTooltipId.value = null
  }
}

// Computed properties
const currentMonthYear = computed(() => {
  return currentDate.value.toLocaleDateString('fr-FR', { 
    month: 'long', 
    year: 'numeric' 
  })
})

const processedEvents = computed((): ProcessedEvent[] => {
  return processEvents(events.value)
})

const calendarWeeks = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  return generateCalendarWeeks(year, month, processedEvents.value)
})

// Métodos
const loadEvents = async () => {
  loading.value = true
  console.log('🔄 Carregando eventos para:', currentMonthYear.value)
  
  try {
    const year = currentDate.value.getFullYear()
    const month = currentDate.value.getMonth()
    
    events.value = await EventService.getEventsByMonth(year, month)
    console.log('✅ Eventos carregados:', events.value.length)
  } catch (error) {
    console.error('❌ Erro ao carregar eventos:', error)
    events.value = []
  } finally {
    loading.value = false
  }
}

const previousMonth = () => {
  const newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() - 1)
  currentDate.value = newDate
  loadEvents()
}

const nextMonth = () => {
  const newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() + 1)
  currentDate.value = newDate
  loadEvents()
}

// Lifecycle
onMounted(() => {
  loadEvents()
  document.addEventListener('click', handleClickOutside)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.calendar-container {
  background: #ffffff;
  border-radius: 8px;
  overflow: hidden;
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #ffffff;
}

.month-title {
  font-size: 18px;
  font-weight: 500;
  color: #333333;
  margin: 0;
}

.nav-btn {
  color: #666666;
}
</style>