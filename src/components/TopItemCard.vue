<template>
  <v-card :width="width" :height="height" variant="flat" color="white">
    <div class="px-3 pt-3 chat-card__title">
      {{ title }}
    </div>
    <div :style="{ width: widthValue, height: heightValue }">
      <VChart :option="chartOpt" autoresize />
    </div>
    <div class="d-flex align-center pa-4">
      <v-btn-toggle
        v-model="topMode"
        density="compact"
        variant="outlined"
        rounded="xl"
        class="mx-auto"
        divided
        mandatory
        @update:model-value="handleOnChangeMode"
      >
        <v-btn width="100" value="value">Value</v-btn>
        <v-btn width="100" value="quantity">Quantity</v-btn>
      </v-btn-toggle>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import type { SeriesOption } from 'echarts'
import type { PropType } from 'vue'
import type { ITopItem } from '~/types/stock'

type TTopMode = 'value' | 'quantity'

const props = defineProps({
  height: {
    default: 100,
    type: [Number, String],
  },
  items: {
    default: () => [],
    type: Array as PropType<ITopItem[]>,
  },
  titlePattern: {
    default: '',
    type: String,
  },
  width: {
    default: 100,
    type: [Number, String],
  },
})

const emit = defineEmits(['change'])

const chartOpt = ref<ECOption>({
  animation: true,
  grid: {
    bottom: 35,
    left: 200,
    right: 36,
    top: 45,
  },
  legend: {
    show: false,
  },
  series: [
    {
      data: [],
      itemStyle: {
        color: '#3cd856',
      },
      label: {
        formatter: ({ value }): string => {
          return shorthandNumberFormat(Number(value))
        },
        position: 'right',
        precision: 1,
        show: true,
        valueAnimation: true,
      },
      name: 'item',
      type: 'bar',
    },
  ],
  ssr: true,
  xAxis: {
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
  yAxis: [
    {
      axisLabel: {
        formatter: (val: string): string => {
          const len = 25
          return String(val).length > len ? String(val).slice(0, len) + '...' : val
        },
      },
      axisLine: {
        lineStyle: {
          type: 'dashed',
        },
      },
      data: [],
      max: 10,
      type: 'category',
    },
  ],
})
const topMode = ref<TTopMode>('value')
const widthValue = computed(() => (typeof props.width === 'number' ? `${props.width}px` : props.width))
const heightValue = computed(() => (typeof props.height === 'number' ? `${props.height - 104}px` : props.height))
const title = computed(() =>
  props.titlePattern.replace('%s', String(topMode.value)[0].toUpperCase() + String(topMode.value).slice(1))
)

watch(() => props.items, update, { deep: true })

function update() {
  if (chartOpt.value.series) {
    const series = chartOpt.value.series as Array<SeriesOption>
    series[0].data = props.items.map((item) => item.value)
  }
  if (chartOpt.value!.yAxis) {
    const yAxis = chartOpt.value.yAxis
    if (Array.isArray(yAxis) && 'data' in yAxis[0]) yAxis[0].data = props.items.map((item) => item.name)
  }
}

function handleOnChangeMode() {
  emit('change', topMode.value)
}

defineExpose({ update })

onMounted(() => {
  update()
})
</script>
