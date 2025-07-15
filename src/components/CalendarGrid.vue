<template>
  <div class="calendar-grid px-5">
    <!-- Cabeçalho dos dias da semana -->
    <div class="weekdays-header">
      <div 
        v-for="(dayName, index) in weekdayNames" 
        :key="index"
        class="weekday-cell"
      >
        <div class="weekday-name font-weight-bold">{{ dayName }}</div>
      </div>
    </div>
    
    <!-- Grid do calendário com linhas dinâmicas -->
    <div class="calendar-weeks">
      <div
        v-for="(week, weekIndex) in weeks"
        :key="weekIndex"
        class="calendar-week"
        :style="{ minHeight: `${week.height}px` }"
      >
        <!-- Dias da semana -->
        <div
          v-for="(day, dayIndex) in week.days"
          :key="day.date"
          class="calendar-day"
          :class="{
            'outside-month': !day.isCurrentMonth,
            'today': day.isToday
          }"
        >
          <div class="day-number text-h6 font-weight-black">{{ day.dayNumber }}</div>
        </div>
        
        <!-- Eventos da semana -->
        <div class="week-events">
          <MediaChip
            v-for="eventBar in week.events"
            :key="`${eventBar.event.id}-${eventBar.row}-${eventBar.startCol}`"
            :event-bar="eventBar"
            :open-tooltip-id="openTooltipId"
            :chip-id="eventBar.event.id"
            @chip-click="handleChipClick(eventBar.event.id)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MediaChip from './MediaChip.vue'
import type { CalendarWeek } from '../types/calendar'
import { ref, onMounted, onBeforeUnmount } from 'vue'

interface Props {
  weeks: CalendarWeek[]
}

defineProps<Props>()

defineEmits<{
  'event-click': [event: any, mouseEvent: MouseEvent, el: HTMLElement | null]
  'chip-click': [eventBar: any]
}>()

const weekdayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

const openTooltipId = ref<string | null>(null)

function handleChipClick(eventId: string) {
  openTooltipId.value = openTooltipId.value === eventId ? null : eventId
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

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.calendar-grid {
  background: #ffffff;
}

.weekdays-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border-bottom: 1px solid #e0e0e0;
}

.weekday-cell {
  padding: 12px 8px;
  text-align: center;
}

.weekday-name {
  text-transform: uppercase;
}

.calendar-weeks {
  background: #ffffff;
}

.calendar-week {
  position: relative;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border-bottom: 1px solid #e0e0e0;
}

.calendar-day:not(:nth-child(7n)) {
  border-right: 1px solid #e0e0e0;
}


.calendar-day.outside-month {
  color: #999999;
}

.calendar-day:first-child {
  border-left: none;
}

.calendar-day:last-child {
  border-right: none;
}

.calendar-day.today {
  background-color: #e3f2fd;
}

.day-number {
  position: relative;
  z-index: 2;
}

.outside-month .day-number {
  color: #cccccc;
}

.week-events {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

/* Responsividade */
@media (max-width: 768px) {
  .weekday-cell {
    padding: 8px 4px;
  }
  
  .calendar-day {
    padding: 4px;
  }
}

@media (max-width: 480px) {
  .calendar-day {
    padding: 2px;
  }
  
  .weekday-cell {
    padding: 6px 2px;
  }
}
</style>