<template>
  <v-card :width="width" :height="height" variant="flat" color="white">
    <div class="px-3 pt-3 chat-card__title">
      {{ title }}
    </div>
    <div :style="{ width: widthValue, height: heightValue }">
      <VChart :option="chartOpt" autoresize />
    </div>
  </v-card>
</template>

<script setup lang="ts">
import type { SeriesOption } from 'echarts'
import type { PropType } from 'vue'

const props = defineProps({
  height: {
    default: 100,
    type: [Number, String],
  },
  months: {
    default: () => [],
    type: Array as PropType<string[]>,
  },
  sales: {
    default: () => [],
    type: Array as PropType<number[]>,
  },
  title: {
    default: '',
    type: String,
  },
  value: {
    default: () => [],
    type: Array as PropType<number[]>,
  },
  width: {
    default: 100,
    type: [Number, String],
  },
})

const chartOpt = ref<ECOption>({
  animation: true,
  grid: {
    bottom: 35,
    left: 66,
    right: 40,
    top: 45,
  },
  legend: {
    data: ['Inventory Value', 'Sale Amount', 'Ratio'],
    left: 16,
    padding: [10, 0, 20, 0],
    show: true,
  },
  series: [
    {
      data: [],
      itemStyle: {
        color: '#ffcf00',
      },
      name: 'Sale Amount',
      type: 'bar',
    },
    {
      data: [],
      itemStyle: {
        color: '#3cd856',
      },
      name: 'Inventory Value',
      type: 'bar',
    },
    {
      data: [],
      itemStyle: {
        color: '#0095ff',
      },
      name: 'Ratio',
      type: 'line',
      yAxisIndex: 1,
    },
  ],
  ssr: true,
  xAxis: {
    axisLine: {
      lineStyle: {
        type: 'dashed',
      },
    },
    data: props.months,
    type: 'category',
  },
  yAxis: [
    {
      axisLabel: {
        formatter: shorthandNumberFormat,
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
        },
      },
      type: 'value',
    },
    {
      splitLine: {
        show: false,
      },
      type: 'value',
    },
  ],
})
const widthValue = computed(() => (typeof props.width === 'number' ? `${props.width}px` : props.width))
const heightValue = computed(() => (typeof props.height === 'number' ? `${props.height - 36}px` : props.height))

watch(() => props.value, update)
watch(() => props.sales, update)
watch(() => props.months, update)

function update() {
  const max = Math.max(...props.value)
  if (chartOpt.value.grid && 'left' in chartOpt.value.grid) chartOpt.value.grid.left = max < 10000 ? 46 : 66
  if (chartOpt.value.series) {
    const series = chartOpt.value.series as Array<SeriesOption>
    series[0].data = props.sales
    series[1].data = props.value
    series[2].data = props.value.map((val, i) => val / props.sales[i])
  }
  if (chartOpt.value!.xAxis) {
    const xAxis = chartOpt.value.xAxis
    if ('data' in xAxis) xAxis.data = props.months
  }
}

defineExpose({ update })

onMounted(() => {
  update()
})
</script>
