<template>
  <v-dialog v-model="isOpen" max-width="500px">
    <v-card class="event-dialog">
      <!-- Header com logo e nome do laboratório -->
      <v-card-title class="dialog-header pa-4">
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
            <v-icon icon="mdi-account-multiple" size="16" class="mr-1" />
            <span>2 opérations</span>
            <v-icon icon="mdi-open-in-new" size="16" class="ml-1" />
          </div>
        </div>
      </v-card-title>

      <!-- Conteúdo principal -->
      <v-card-text class="pa-4">
        <!-- Tipo de mídia -->
        <div class="media-type-section mb-4">
          <div class="media-type-header">
            <v-icon :icon="event?.mediaIcon" size="20" class="mr-2" />
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
              size="small"
              class="copy-btn"
              @click="copyToClipboard(product.code)"
            />
          </div>
        </div>
      </v-card-text>

      <!-- Footer com botões -->
      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn
          variant="text"
          @click="closeDialog"
        >
          Fermer
        </v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          @click="viewDetails"
        >
          Voir détails
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { ProcessedEvent } from '../types/calendar'

interface Props {
  modelValue: boolean
  event: ProcessedEvent | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Mock data para produtos - em produção viria da API
const mockProducts = ref([
  { name: 'ADTAB', code: '376015521303' },
  { name: 'Advantix', code: '336015521322' },
  { name: 'SERESTO CHIEN', code: '556015521379' },
  { name: 'SERESTO CHAT', code: '776015521387' },
  { name: 'BAYER', code: '246015521400' },
  { name: 'FRONTLINE', code: '406015521418' },
  { name: 'NEXGARD', code: '496015521425' }
])

const closeDialog = () => {
  isOpen.value = false
}

const viewDetails = () => {
  console.log('Ver detalhes do evento:', props.event)
  // TODO: Implementar navegação para detalhes
  closeDialog()
}

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    console.log('Código copiado:', text)
    // TODO: Mostrar toast de sucesso
  } catch (error) {
    console.error('Erro ao copiar:', error)
  }
}

// Atualizar produtos quando o evento mudar
watch(() => props.event, (newEvent) => {
  if (newEvent) {
    // Em produção, buscar produtos reais baseado no evento
    console.log('Carregando produtos para evento:', newEvent.id)
  }
})
</script>

<style scoped>
.event-dialog {
  border-radius: 12px;
  overflow: hidden;
}

.dialog-header {
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
}

.lab-info {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.lab-logo {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #2196f3;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 18px;
  flex-shrink: 0;
}

.lab-details {
  flex: 1;
}

.lab-name {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #1a1a1a;
}

.event-description {
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.4;
}

.operations-badge {
  display: flex;
  align-items: center;
  background: #e3f2fd;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  color: #1976d2;
  font-weight: 500;
  flex-shrink: 0;
}

.media-type-section {
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 16px;
}

.media-type-header {
  display: flex;
  align-items: center;
  font-weight: 500;
  color: #333;
}

.media-type-name {
  font-size: 16px;
}

.products-list {
  max-height: 300px;
  overflow-y: auto;
}

.product-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.product-item:last-child {
  border-bottom: none;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.product-name {
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.product-code {
  font-size: 13px;
  color: #666;
  font-family: 'Courier New', monospace;
}

.copy-btn {
  opacity: 0.6;
  transition: opacity 0.2s;
}

.copy-btn:hover {
  opacity: 1;
}

/* Responsividade */
@media (max-width: 600px) {
  .header-content {
    flex-direction: column;
    gap: 12px;
  }
  
  .operations-badge {
    align-self: flex-start;
  }
  
  .lab-name {
    font-size: 18px;
  }
  
  .event-description {
    font-size: 13px;
  }
}
</style>