<template>
  <!-- Chips de início: renderizam tooltip -->
  <v-tooltip
    v-if="eventBar.isStart && eventBar.event.active"
    :model-value="openTooltipId === eventBar.event.id"
    location="auto"
    open-on-click
    :open-on-hover="false"
    :close-on-content-click="false"
    :offset="8"
  >
    <template #activator="{ props: activatorProps }">
      <div
        v-bind="activatorProps"
        :class="{
          'media-chip': true,
          'chip-start': eventBar.isStart,
          'chip-end': eventBar.isEnd,
          'chip-middle': !eventBar.isStart && !eventBar.isEnd,
          'chip-inactive': !eventBar.event.active
        }"
        :style="chipStyles"
        @click.stop="handleChipClick"
      >
        <div class="chip-content">
          <v-icon 
            v-if="showLeftArrow" 
            icon="mdi-arrow-expand-left" 
            size="12" 
            class="continue-arrow mr-1" 
          />
          <v-icon 
            v-if="showMediaIcon"
            :icon="eventBar.event.mediaIcon" 
            size="12" 
            class="media-icon mr-1" 
          />
          <span class="lab-name">{{ eventBar.event.lab_name }}</span>
          <span class="event-description ml-1">{{ eventBar.event.description }}</span>
          <v-chip
            v-if="showTypeBadge"
            :color="eventBar.event.color"
            variant="elevated"
            size="x-small"
            class="media-type-chip ml-1"
          >
            {{ eventBar.event.media_type_name }}
          </v-chip>
          <v-icon 
            v-if="showRightArrow" 
            icon="mdi-arrow-expand-right" 
            size="12" 
            class="continue-arrow ml-1" 
          />
        </div>
      </div>
    </template>
    
    <v-card width="320" max-height="400" class="pa-0">
      <!-- Header -->
      <v-card-item class="bg-grey-lighten-4">
        <template #prepend>
          <v-avatar color="primary" size="32">
            <span class="text-white font-weight-bold">{{ eventBar.event.lab_name?.charAt(0) || 'L' }}</span>
          </v-avatar>
        </template>
        
        <v-card-title class="text-body-1 font-weight-bold">
          {{ eventBar.event.lab_name }}
        </v-card-title>
        
        <v-card-subtitle class="text-caption">
          {{ eventBar.event.description }}
        </v-card-subtitle>
        
        <template #append>
          <v-chip size="small" color="primary" variant="tonal">
            <v-icon size="12" class="mr-1">mdi-account-multiple</v-icon>
            2 opérations
          </v-chip>
        </template>
      </v-card-item>
      
      <!-- Content -->
      <v-card-text class="pa-3">
        <!-- Media Type -->
        <div class="d-flex align-center mb-3 pb-2 border-b">
          <v-icon :icon="eventBar.event.mediaIcon" size="16" class="mr-2" />
          <span class="text-body-2 font-weight-medium">{{ eventBar.event.media_type_name }}</span>
        </div>
        
        <!-- Products List -->
        <div style="max-height: 200px; overflow-y: auto;">
          <div 
            v-for="(product, index) in mockProducts" 
            :key="index"
            class="d-flex justify-space-between align-center py-1"
          >
            <div class="flex-grow-1">
              <div class="text-body-2 font-weight-medium">{{ product.name }}</div>
              <div class="text-caption text-grey">{{ product.code }}</div>
            </div>
            <v-btn
              icon="mdi-content-copy"
              variant="text"
              size="x-small"
              @click.stop="copyToClipboard(product.code)"
            />
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-tooltip>

  <!-- Chips intermediários/finais: não renderizam tooltip, mas emitem clique -->
  <div
    v-else
    class="rounded-xl"
    :class="{
      'media-chip': true,
      'chip-start': eventBar.isStart,
      'chip-end': eventBar.isEnd,
      'chip-middle': !eventBar.isStart && !eventBar.isEnd,
      'chip-inactive': !eventBar.event.active
    }"
    :style="chipStyles"
    @click.stop="handleChipClick"
  >
    <div class="chip-content">
      <v-icon 
        v-if="showLeftArrow" 
        icon="mdi-arrow-expand-left" 
        size="12" 
        class="continue-arrow mr-1" 
      />
      <v-icon 
        v-if="showMediaIcon"
        :icon="eventBar.event.mediaIcon" 
        size="12" 
        class="media-icon mr-1" 
      />
      <span class="lab-name">{{ eventBar.event.lab_name }}</span>
      <span class="event-description ml-1">{{ eventBar.event.description }}</span>
      <v-chip
        v-if="showTypeBadge"
        :color="eventBar.event.color"
        variant="elevated"
        size="x-small"
        class="media-type-chip ml-1"
      >
        {{ eventBar.event.media_type_name }}
      </v-chip>
      <v-icon 
        v-if="showRightArrow" 
        icon="mdi-arrow-expand-right" 
        size="12" 
        class="continue-arrow ml-1" 
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { EventBar } from '../types/calendar'

interface Props {
  eventBar: EventBar
  openTooltipId: string | null
  chipId: string
}

const props = defineProps<Props>()
const emit = defineEmits(['chip-click'])

const chipStyles = computed(() => ({
  backgroundColor: props.eventBar.event.active ? props.eventBar.event.color : '#e0e0e0',
  color: '#333333',
  top: `${40 + props.eventBar.row * 36}px`,
  height: '28px',
  left: `${props.eventBar.startCol * (100/7)}%`,
  width: `${props.eventBar.span * (100/7)}%`,
  zIndex: 10,
  margin: '4px 0'
}))

const showLeftArrow = computed(() => {
  return props.eventBar.comesFromPreviousWeek || props.eventBar.startsInPreviousMonth
})

const showMediaIcon = computed(() => {
  return !showLeftArrow.value
})

const showTypeBadge = computed(() => {
  return (props.eventBar.isEnd && !props.eventBar.event.continues_next_month) || 
         props.eventBar.isLastVisibleSegment
})

const showRightArrow = computed(() => {
  return props.eventBar.isLastVisibleSegment || 
         (props.eventBar.continuesNextMonth && props.eventBar.startCol + props.eventBar.span - 1 === 6)
})

// Mock data para produtos
const mockProducts = ref([
  { name: 'ADTAB', code: '376015521303' },
  { name: 'Advantix', code: '336015521322' },
  { name: 'SERESTO CHIEN', code: '556015521379' },
  { name: 'SERESTO CHAT', code: '776015521387' },
  { name: 'BAYER', code: '246015521400' },
  { name: 'FRONTLINE', code: '406015521418' },
  { name: 'NEXGARD', code: '496015521425' }
])

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    // Você pode adicionar um feedback visual aqui
  } catch (error) {
    // Trate o erro se necessário
  }
}

const handleChipClick = () => {
  if (props.eventBar.event.active) {
    emit('chip-click', props.eventBar.event.id)
  }
}
</script>

<style scoped>
.media-chip {
  position: absolute;
  border-radius: 4px;
  font-size: 11px;
  line-height: 1.2;
  cursor: pointer;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
  padding: 0 8px;
  pointer-events: auto;
  box-sizing: border-box;
  margin: 1px 0;
}

.media-chip.chip-inactive {
  cursor: not-allowed;
  opacity: 0.6;
}

.media-chip.chip-inactive:hover {
  opacity: 0.6;
}

.media-chip.chip-start {
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}

.media-chip.chip-end {
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}

.media-chip.chip-middle {
  border-radius: 0;
}

.media-chip:hover {
  opacity: 0.9;
}

.chip-content {
  display: flex;
  align-items: center;
  width: 100%;
  overflow: hidden;
  height: 100%;
}

.continue-arrow {
  flex-shrink: 0;
  opacity: 0.8;
  color: inherit;
}

.media-icon {
  flex-shrink: 0;
}

.lab-name {
  font-weight: 600;
  font-size: 11px;
  flex-shrink: 0;
  margin-right: 4px;
}

.event-description {
  font-size: 9px;
  opacity: 0.9;
  line-height: 1.1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  flex: 1;
  margin-left: 4px;
  margin-right: 4px;
}

.media-type-chip {
  flex-shrink: 0;
  margin-left: auto;
}

.media-type-chip :deep(.v-chip__content) {
  font-size: 9px !important;
  font-weight: 500;
  color: #333333 !important;
}

/* Responsividade */
@media (max-width: 768px) {
  .media-chip {
    font-size: 10px;
    padding: 0 4px;
    height: 24px;
  }
  
  .event-description {
    font-size: 8px;
  }
}

@media (max-width: 480px) {
  .media-chip {
    font-size: 9px;
    padding: 0 2px;
    height: 20px;
  }
  
  .lab-name {
    font-size: 10px;
  }
  
  .event-description {
    font-size: 7px;
  }
}

/* Garantir que o v-card dentro do tooltip seja interativo */
:deep(.v-tooltip__content) {
  pointer-events: auto !important;
}

:deep(.v-tooltip__content *) {
  pointer-events: auto !important;
}

:deep(.v-card) {
  pointer-events: auto !important;
}

:deep(.v-card *) {
  pointer-events: auto !important;
}

:deep(.v-tooltip) {
  background: transparent !important;
  padding: 0px !important;
  margin: 0px !important;
}

:deep(.v-tooltip .v-overlay__content) {
  background: transparent !important;
}

/* Tentar seletores alternativos */
:deep(.v-overlay__content) {
  background: transparent !important;
  padding: 0 !important;
  margin: 0 !important;
}

:deep(.v-tooltip__content) {
  background: transparent !important;
  padding: 0 !important;
  margin: 0 !important;
}

/* Seletor mais específico */
:deep(.v-tooltip .v-overlay .v-overlay__content) {
  background: transparent !important;
  padding: 0 !important;
  margin: 0 !important;
  box-shadow: none !important;
}
</style>