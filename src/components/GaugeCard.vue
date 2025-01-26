<template>
  <v-card :width="width" :height="height" variant="flat" color="white">
    <div class="px-3 pt-3 stat-card__title text-grey">
      {{ title }}
    </div>
    <div :style="{ width: `${width}px`, height: `${height - 34.5}px` }">
      <VChart :option="chartOpt" autoresize />
    </div>
  </v-card>
</template>

<script setup lang="ts">
import type { SeriesOption } from 'echarts'
import type { VChart } from '#components'

const props = defineProps({
  bgColor: {
    default: '#e8eaf6',
    type: String,
  },
  color: {
    default: '#3f51b5',
    type: String,
  },
  height: {
    default: 100,
    type: Number,
  },
  maxValue: {
    default: 1,
    type: Number,
  },
  minValue: {
    default: 0,
    type: Number,
  },
  modelValue: {
    default: 0.0,
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

const chartOpt = ref<ECOption>({
  animation: true,
  series: [
    {
      anchor: {
        show: false,
      },
      axisLabel: { show: false },
      axisLine: {
        lineStyle: {
          color: [[1, props.bgColor]],
          width: 20,
        },
      },
      axisTick: { show: false },
      center: ['50%', '78%'],
      data: [{ value: props.modelValue }],
      detail: {
        fontSize: 20,
        formatter: (value: number): string => {
          return decimalFormat(value)
        },
        offsetCenter: [0, '-10%'],
        valueAnimation: true,
      },
      endAngle: 0,
      max: props.maxValue,
      min: props.minValue,
      pointer: {
        show: false,
      },
      progress: {
        itemStyle: {
          color: props.color,
        },
        show: true,
        width: 20,
      },
      radius: '140%',
      splitLine: { show: false },
      startAngle: 180,
      title: {
        show: false,
      },
      type: 'gauge',
    },
  ],
  ssr: true,
  xAxis: { show: false },
  yAxis: { show: false },
})

watch(() => props.modelValue, update)

function update() {
  if (chartOpt.value.series) {
    const series = chartOpt.value.series as Array<SeriesOption>
    if (Array.isArray(series[0].data) && 'value' in series[0].data[0]) series[0].data[0].value = props.modelValue
  }
}

defineExpose({ update })

onMounted(() => {
  update()
})
</script>

<style lang="scss" scoped>
.card {
  &__title {
    font-size: 0.9375rem;
  }

  &__content {
    font-size: 2.125rem;
  }
}
</style>
