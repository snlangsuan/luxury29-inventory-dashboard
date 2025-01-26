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

const props = defineProps({
  height: {
    default: 100,
    type: [Number, String],
  },
  purchase: {
    default: 0,
    type: Number,
  },
  sale: {
    default: 0,
    type: Number,
  },
  title: {
    default: '',
    type: String,
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
    right: 20,
    top: 45,
  },
  legend: {
    data: ['Increase', 'Decrease', 'Total'],
    left: 16,
    padding: [10, 0, 20, 0],
    show: true,
  },
  series: [
    {
      data: [0, 0, 0],
      emphasis: {
        itemStyle: {
          borderColor: 'transparent',
          color: 'transparent',
        },
      },
      itemStyle: {
        borderColor: 'transparent',
        color: 'transparent',
      },
      name: 'Placeholder',
      silent: true,
      stack: 'group1',
      type: 'bar',
    },
    {
      data: [0, 0, 0],
      itemStyle: {
        color: '#3cd856',
      },
      name: 'Increase',
      stack: 'group1',
      type: 'bar',
    },
    {
      data: [0, 0, 0],
      itemStyle: {
        color: '#fa5a7d',
      },
      name: 'Decrease',
      stack: 'group1',
      type: 'bar',
    },
    {
      data: [0, 0, 0],
      itemStyle: {
        color: '#0095ff',
      },
      name: 'Total',
      stack: 'group1',
      type: 'bar',
    },
    {
      data: [0, 0, 0],
      itemStyle: {
        color: '#3cd856',
      },
      name: 'Increase',
      stack: 'group1',
      type: 'bar',
    },
    {
      data: [0, 0, 0],
      itemStyle: {
        color: '#fa5a7d',
      },
      name: 'Decrease',
      stack: 'group1',
      type: 'bar',
    },
    {
      data: [0, 0, 0],
      itemStyle: {
        color: '#0095ff',
      },
      name: 'Total',
      stack: 'group1',
      type: 'bar',
    },
  ],
  ssr: true,
  xAxis: {
    axisLine: {
      lineStyle: {
        type: 'dashed',
      },
    },
    data: ['Purchase', 'Sale', 'Total'],
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
  ],
})
const widthValue = computed(() => (typeof props.width === 'number' ? `${props.width}px` : props.width))
const heightValue = computed(() => (typeof props.height === 'number' ? `${props.height - 36}px` : props.height))

watch(() => props.purchase, update)
watch(() => props.sale, update)

function update() {
  const max = Math.max(props.purchase, props.sale)
  if (chartOpt.value.grid && 'left' in chartOpt.value.grid) chartOpt.value.grid.left = max < 10000 ? 46 : 66
  if (chartOpt.value.series) {
    const series = chartOpt.value.series as Array<SeriesOption>
    const total = props.purchase + props.sale
    series[0].data = [0, 0, 0]
    series[2].data = [0, 0, 0]
    series[5].data = [0, 0, 0]

    if (total > 0) series[0].data = [0, total, 0]
    series[1].data = [props.purchase, 0, 0]
    if (total > 0) {
      series[2].data = [0, props.purchase - total, 0]
    } else if (total < 0) {
      series[2].data = [0, props.purchase, 0]
      series[5].data = [0, total, 0]
    }
    series[3].data = [0, 0, total]
  }
}

defineExpose({ update })

onMounted(() => {
  update()
})
</script>
