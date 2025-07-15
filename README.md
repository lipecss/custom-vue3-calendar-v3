# 📅 Media Calendar - Calendário de Campanhas de Mídia

Um calendário para visualização de campanhas de mídia e marketing, desenvolvido com Vue 3, TypeScript e Vuetify 3.

## 🎯 Sobre o Projeto

Este é um calendário especializado para agências de mídia e marketing, que permite visualizar campanhas de forma intuitiva com barras visuais que se estendem por múltiplos dias, tooltips interativos e controle de estados ativos/inativos.

### ✨ Funcionalidades Principais

- **📊 Visualização de eventos multi-dia** - Barras coloridas que se estendem por vários dias
- **🔄 Continuação entre meses** - Setas indicam eventos que continuam no próximo mês
- **💬 Tooltips interativos** - Detalhes completos com produtos, códigos e botões de ação
- **🎨 Estados visuais** - Diferenciação entre eventos ativos e inativos
- **📱 Responsivo** - Se adapta a diferentes tamanhos de tela
- **⚡ Performance otimizada** - Renderização eficiente de eventos complexos

### Por que não usei `v-calendar` do Vuetify?
Primeiro que não tive tempo para ver a docs kkk a fundo, mas percebi que  `v-calendar` do Vuetify tem limitações que não atendem às necessidades de um calendário de mídia profissional:

❌ **Limitações do v-calendar:**
- Não suporta eventos multi-dia
- Não tem barras visuais extensas
- Não controla sobreposição de eventos
- Não tem continuação entre meses
- Tooltips básicos apenas
- Não diferencia estados ativos/inativos

✅ **Nossa solução customizada:**
- Barras que se estendem por múltiplos dias
- Controle granular de posicionamento
- Setas de continuação entre meses
- Tooltips ricos e interativos
- Estados visuais diferenciados

## 📅 Como os Meses são Gerados

### 1. Cálculo do Período do Calendário

Isso aqui pode melhorar, fiz correndo:

```typescript
// Encontrar primeira segunda-feira antes do mês
const firstDayOfWeek = firstDay.getDay()
const daysToSubtract = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1

// Encontrar último domingo após o mês
const lastDayOfWeek = lastDay.getDay()
const daysToAdd = lastDayOfWeek === 0 ? 0 : 7 - lastDayOfWeek
```

### 2. Geração de Semanas e Dias

```typescript
// Para cada semana (segunda a domingo)
for (let i = 0; i < 7; i++) {
  weekDays.push({
    date: dateString,
    dayNumber: dayDate.getDate(),
    isCurrentMonth: dayDate.getMonth() === month,
    isToday: dayDate.toDateString() === today.toDateString()
  })
}
```

### 3. Processamento de Eventos

```typescript
// Para cada evento, verificar se intersecta com a semana
if (eventStart <= weekEnd && actualEventEnd >= weekStart) {
  // Calcular colunas (dias) que o evento ocupa
  const startCol = eventDays[0]
  const endCol = eventDays[eventDays.length - 1]
  const span = endCol - startCol + 1
  
  // Encontrar linha disponível (evitar sobreposição)
  let assignedRow = 0
  // ... lógica de alocação de linha
}
```

## 🎨 Componentes

### MediaCalendar.vue
- Componente principal do calendário
- Controle de estado global dos tooltips
- Navegação entre meses

### CalendarGrid.vue
- Grid do calendário com semanas
- Renderização de dias e eventos
- Estrutura responsiva

### MediaChip.vue
- Barras visuais dos eventos
- Tooltips interativos com v-card
- Estados ativos/inativos

## 🚀 Como Executar

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── MediaCalendar.vue    # Componente principal
│   ├── CalendarGrid.vue     # Grid do calendário
│   ├── MediaChip.vue        # Barras de eventos
│   └── EventTooltip.vue     # Tooltips (deprecated)
├── utils/
│   └── calendarUtils.ts     # Lógica de geração do calendário
├── types/
│   └── calendar.ts          # Tipos TypeScript
├── services/
│   └── eventService.ts      # Mock de dados
└── App.vue                  # App principal
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

**Desenvolvido com ❤️ usando Vue 3 + TypeScript + Vuetify 3**
