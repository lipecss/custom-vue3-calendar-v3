<template>
  <div
    v-if="isVisible && position"
    class="event-tooltip rounded-xl"
    :style="tooltipStyles"
    @click.stop
    @mousedown.stop
  >
    <!-- Header com logo e nome do laboratório -->
    <div class="tooltip-header">
      <div class="header-content">
        <div class="lab-info">
          <div class="lab-logo">
            {{ event?.lab_name?.charAt(0) || 'L' }}
          </div>
          <div class="lab-details">
            <h3 class="lab-name">{{ event?.lab_name }}</h3>
            <p class="event-description">{{ event?.description }}</p>
          </div>
        </div>
        <div class="operations-badge">
          <v-icon icon="mdi-account-multiple" size="12" class="mr-1" />
          <span>2 opérations</span>
          <v-icon icon="mdi-open-in-new" size="12" class="ml-1" />
        </div>
      </div>
    </div>

    <!-- Conteúdo principal -->
    <div class="tooltip-content">
      <!-- Tipo de mídia -->
      <div class="media-type-section">
        <div class="media-type-header">
          <v-icon :icon="event?.mediaIcon" size="16" class="mr-2" />
          <span class="media-type-name">{{ event?.media_type_name }}</span>
        </div>
      </div>

      <!-- Lista de produtos/códigos -->
      <div class="products-list">
        <div 
          v-for="(product, index) in mockProducts" 
          :key="index"
          class="product-item"
        >
          <div class="product-info">
            <span class="product-name">{{ product.name }}</span>
            <span class="product-code">{{ product.code }}</span>
          </div>
          <v-btn
            icon="mdi-content-copy"
            variant="text"
            size="x-small"
            class="copy-btn"
            @click="copyToClipboard(product.code)"
          />
        </div>
      </div>
    </div>

    <!-- Seta da tooltip -->
    <div class="tooltip-arrow" :style="{ left: arrowLeft }"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import type { ProcessedEvent } from '../types/calendar'

interface Props {
  modelValue: boolean
  event: ProcessedEvent | null
  position: { x: number; y: number } | null
  arrowX?: number | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const isVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Debug
watch(isVisible, (newValue) => {
  console.log('Tooltip visibility changed:', newValue)
})

watch(() => props.position, (newPos) => {
  console.log('Tooltip position changed:', newPos)
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

const tooltipWidth = 320
const tooltipHeight = 240
const arrowSize = 16

const tooltipStyles = computed(() => {
  if (!props.position) return {}
  const { x, y } = props.position
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  let left = x - tooltipWidth / 2
  let top = y

  // Limitar para não sair da tela
  if (left < 8) left = 8
  if (left + tooltipWidth > viewportWidth - 8) left = viewportWidth - tooltipWidth - 8
  if (top + tooltipHeight > viewportHeight - 8) top = Math.max(8, y - tooltipHeight - arrowSize)

  return {
    position: 'fixed',
    left: `${left}px`,
    top: `${top}px`,
    zIndex: 9999
  }
})

const arrowLeft = computed(() => {
  if (!props.arrowX || !props.position) return '50%';
  const { x } = props.position
  const viewportWidth = window.innerWidth
  let left = props.arrowX - (x - tooltipWidth / 2)
  // Limitar para não sair do tooltip
  left = Math.max(arrowSize, Math.min(left, tooltipWidth - arrowSize))
  return `${left}px`;
});

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    console.log('Código copiado:', text)
  } catch (error) {
    console.error('Erro ao copiar:', error)
  }
}

// Fechar tooltip ao clicar fora
const handleClickOutside = (event: MouseEvent) => {
  // Verificar se o clique foi dentro do tooltip
  const tooltipElement = document.querySelector('.event-tooltip')
  console.log('Click outside check - tooltip element:', tooltipElement)
  console.log('Click target:', event.target)
  
  if (tooltipElement && tooltipElement.contains(event.target as Node)) {
    console.log('Click was inside tooltip, not closing')
    return // Não fechar se clicou dentro do tooltip
  }
  
  console.log('Click was outside tooltip, closing')
  if (isVisible.value) {
    isVisible.value = false
  }
}

watch(isVisible, (newValue) => {
  if (newValue) {
    // Adicionar delay para evitar que o clique que abriu o tooltip o feche
    setTimeout(() => {
      document.addEventListener('click', handleClickOutside)
    }, 100)
  } else {
    document.removeEventListener('click', handleClickOutside)
  }
})
</script>

<style scoped>
.event-tooltip {
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border: 1px solid #e0e0e0;
  width: 320px;
  max-height: 400px;
  overflow: hidden;
  font-family: 'Roboto', sans-serif;
}

.tooltip-header {
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  padding: 12px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
}

.lab-info {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  flex: 1;
}

.lab-logo {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: #2196f3;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  flex-shrink: 0;
}

.lab-details {
  flex: 1;
  min-width: 0;
}

.lab-name {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 2px 0;
  color: #1a1a1a;
  line-height: 1.2;
}

.event-description {
  font-size: 12px;
  color: #666;
  margin: 0;
  line-height: 1.3;
}

.operations-badge {
  display: flex;
  align-items: center;
  background: #e3f2fd;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 10px;
  color: #1976d2;
  font-weight: 500;
  flex-shrink: 0;
  white-space: nowrap;
}

.tooltip-content {
  padding: 12px;
}

.media-type-section {
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 8px;
  margin-bottom: 8px;
}

.media-type-header {
  display: flex;
  align-items: center;
  font-weight: 500;
  color: #333;
}

.media-type-name {
  font-size: 14px;
}

.products-list {
  max-height: 200px;
  overflow-y: auto;
}

.product-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid #f0f0f0;
}

.product-item:last-child {
  border-bottom: none;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
}

.product-name {
  font-weight: 500;
  color: #333;
  font-size: 12px;
}

.product-code {
  font-size: 11px;
  color: #666;
  font-family: 'Courier New', monospace;
}

.copy-btn {
  opacity: 0.6;
  transition: opacity 0.2s;
  flex-shrink: 0;
}

.copy-btn:hover {
  opacity: 1;
}

.tooltip-arrow {
  position: absolute;
  top: -16px;
  width: 32px;
  height: 16px;
  pointer-events: none;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}
.tooltip-arrow::before {
  content: '';
  display: block;
  width: 0;
  height: 0;
  border-left: 16px solid transparent;
  border-right: 16px solid transparent;
  border-bottom: 16px solid white;
  filter: drop-shadow(0 -2px 4px rgba(0,0,0,0.10));
}

/* Scrollbar customizada */
.products-list::-webkit-scrollbar {
  width: 4px;
}

.products-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.products-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.products-list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Responsividade */
@media (max-width: 480px) {
  .event-tooltip {
    width: calc(100vw - 20px);
    max-width: 300px;
  }
  
  .header-content {
    flex-direction: column;
    gap: 8px;
  }
  
  .operations-badge {
    align-self: flex-start;
  }
}
</style>