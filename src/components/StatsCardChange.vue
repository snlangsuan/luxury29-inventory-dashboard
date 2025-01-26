<template>
  <div class="stats-card-change">
    <span :class="['stats-card-change-value', directionState]">
      <v-icon v-if="modelValue > 0">mdi-trending-up</v-icon>
      <v-icon v-else-if="modelValue < 0">mdi-trending-down</v-icon>
      <span class="stats-card-change-value__text">{{ percentText }}</span>
    </span>
    <span class="stats-card-change__caption">Then Last Month</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: {
    default: 0,
    type: Number,
  },
})

const percentText = computed(() => percentageFormat(Math.abs(props.modelValue)))

const directionState = computed(() => {
  if (props.modelValue > 0) return 'stats-card-change-value--positive'
  if (props.modelValue < 0) return 'stats-card-change-value--negative'
  return ''
})
</script>

<style lang="scss" scoped>
.stats-card-change {
  font-size: 0.875rem;
  color: #888888;
  display: flex;
  align-items: center;

  &-value {
    color: #888888;
    display: flex;
    align-items: center;

    &__text {
      padding-right: 4px;
      padding-left: 2px;
    }

    &--positive {
      color: rgb(var(--v-theme-success));
    }

    &--negative {
      color: rgb(var(--v-theme-error));
    }
  }

  &__caption {
    display: inline-block;
  }
}
</style>
