<template>
  <v-card :width="width" :height="height" variant="flat" color="white">
    <div class="d-flex flex-column fill-height">
      <div class="d-flex px-3 pt-3 stat-card__title" style="gap: 8px">
        <v-icon>{{ icon }}</v-icon>
        {{ title }}
      </div>
      <div class="flex-grow-1 d-flex align-center stat-card__content px-3 py-2">{{ countText }}</div>
      <stats-card-change :model-value="percentChange" class="px-3 pb-3" />
    </div>
  </v-card>
</template>

<script setup lang="ts">
const props = defineProps({
  height: {
    default: 100,
    type: Number,
  },
  icon: {
    default: '',
    type: String,
  },
  modelValue: {
    default: 0,
    type: Number,
  },
  percentChange: {
    default: 0,
    type: Number,
  },
  title: {
    default: '',
    type: String,
  },
  width: {
    default: 100,
    type: Number,
  },
})

const countText = computed(() => shorthandNumberFormat(props.modelValue))
</script>
