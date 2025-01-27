<template>
  <v-container ref="rootElemRef" fluid style="min-width: 1200px">
    <v-card class="card--border" variant="flat" color="white">
      <div class="d-flex align-center pt-2 pb-3 pl-6 pr-3" style="gap: 16px">
        <v-img :src="LogoImage" :height="60" aspect-ratio="16/9" position="left center" />
        <v-spacer />
        <div>
          <div class="text-caption text-grey">Year</div>
          <v-select
            v-model="yearSelected"
            :items="yearItems"
            width="200"
            mandatory
            hide-details
            @update:model-value="handleOnChangeYear"
          />
        </div>
        <div>
          <div class="text-caption text-grey">Month</div>
          <v-select
            v-model="monthSelected"
            :items="monthItems"
            width="200"
            hide-details
            @update:model-value="handleOnChangeMonth"
          />
        </div>
        <div>
          <div class="text-caption text-grey">Product</div>
          <v-select
            v-model="productSelected"
            :items="productItems"
            width="200"
            :menu-props="{ width: 400 }"
            mandatory
            hide-details
            @update:model-value="handleOnChangeProduct"
          />
        </div>
        <div>
          <div class="text-caption text-grey">Category</div>
          <v-select
            v-model="categorySelected"
            :items="categoryItems"
            width="200"
            :menu-props="{ width: 400 }"
            mandatory
            hide-details
            @update:model-value="handleOnChangeCategory"
          />
        </div>
      </div>
    </v-card>
    <div class="dashboard__row">
      <div class="dashboard__col">
        <stats-card
          v-model="inventoryValue"
          title="INVENTORY VALUE"
          icon="mdi-finance"
          class="card--border"
          :width="cardWidth"
          :height="cardHeight"
          :percent-change="inventoryValueChange"
        />
      </div>
      <div class="dashboard__col">
        <stats-card
          v-model="totalSku"
          title="SKUs"
          icon="mdi-package-variant-closed"
          class="card--border"
          :width="cardWidth"
          :height="cardHeight"
          :percent-change="totalSkuChange"
        />
      </div>
      <div class="dashboard__col">
        <stats-card
          v-model="stockAvailable"
          title="STOCK AVAILABLE"
          icon="mdi-basket-check-outline"
          class="card--border"
          :width="cardWidth"
          :height="cardHeight"
          :percent-change="stockAvailableChange"
        />
      </div>
      <div class="dashboard__col">
        <gauge-card
          v-model="turnoverRatio"
          title="TURNOVER RATIO"
          class="card--border"
          :width="cardWidth"
          :height="cardHeight"
          :max-value="15"
          color="#bf83ff"
          bg-color="#f3e8ff"
        />
      </div>
      <div class="dashboard__col">
        <gauge-card
          v-model="inventorySalesRatio"
          title="INVENTORY TO SALE RATIO"
          class="card--border"
          :width="cardWidth"
          :height="cardHeight"
          color="#0095ff"
          bg-color="#cde7ff"
        />
      </div>
    </div>
    <div class="dashboard__row">
      <div class="dashboard__col" :style="{ flex: `0 0 ${cardWidth * 3 + 32}px` }">
        <div class="dashboard__row pt-0">
          <div class="dashboard__col">
            <inventory-value-chart-card
              title="Inventory Value Over Time"
              width="100%"
              :height="296"
              :value="inventoryValueItems"
              :change-value="inventoryValueChangeItems"
              :months="monthsFilteredItems"
            />
          </div>
          <div class="dashboard__col">
            <turnover-chart-card
              title="Turnover (Days) by Month"
              width="100%"
              :height="296"
              :value="turnoverItems"
              :months="monthsFilteredItems"
            />
          </div>
        </div>
        <div class="dashboard__row">
          <div class="dashboard__col">
            <inventory-movement-card
              title="Inventory Movement"
              :purchase="inventoryPurchase"
              :sale="inventorySale"
              width="100%"
              :height="296"
            />
          </div>
          <div class="dashboard__col">
            <inventory-sale-analysis-card
              title="Inventory to Sales Analysis"
              :value="inventoryValueItems"
              :sales="saleAmountItems"
              width="100%"
              :height="296"
              :months="monthsFilteredItems"
            />
          </div>
        </div>
      </div>
      <div class="dashboard__col">
        <top-item-card
          v-model:mode="topViewMode"
          title-pattern="Top 10 Item Based on %s"
          :items="topItems"
          width="100%"
          :height="608"
          @change="handleOnChangeTopItem"
        />
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import type { VContainer } from 'vuetify/components'
import type { IFilterItem, TTopViewMode } from '~/types/filter'
import type { ITopItem } from '~/types/stock'
import LogoImage from '~/assets/images/logo.jpg'

const sheetApi = useSheet()

const selectAllItem: IFilterItem = { title: 'All', value: -1 }

const logs = ref<string[][]>([])

const yearItems = ref<IFilterItem[]>([])
const monthItems = ref<IFilterItem[]>([
  { ...selectAllItem },
  {
    title: 'January',
    value: 1,
  },
  {
    title: 'February',
    value: 2,
  },
  {
    title: 'March',
    value: 3,
  },
  {
    title: 'April',
    value: 4,
  },
  {
    title: 'May',
    value: 5,
  },
  {
    title: 'June',
    value: 6,
  },
  {
    title: 'July',
    value: 7,
  },
  {
    title: 'August',
    value: 8,
  },
  {
    title: 'September',
    value: 9,
  },
  {
    title: 'October',
    value: 10,
  },
  {
    title: 'November',
    value: 11,
  },
  {
    title: 'December',
    value: 12,
  },
])
const shortMonthItems = ref<IFilterItem[]>([
  {
    title: 'Jan',
    value: 1,
  },
  {
    title: 'Fab',
    value: 2,
  },
  {
    title: 'Mar',
    value: 3,
  },
  {
    title: 'Apr',
    value: 4,
  },
  {
    title: 'May',
    value: 5,
  },
  {
    title: 'Jun',
    value: 6,
  },
  {
    title: 'Jul',
    value: 7,
  },
  {
    title: 'Aug',
    value: 8,
  },
  {
    title: 'Sep',
    value: 9,
  },
  {
    title: 'Oct',
    value: 10,
  },
  {
    title: 'Nov',
    value: 11,
  },
  {
    title: 'Dec',
    value: 12,
  },
])
const productItems = ref<IFilterItem[]>([selectAllItem])
const categoryItems = ref<IFilterItem[]>([selectAllItem])

const rootElemRef = ref<InstanceType<typeof VContainer>>()
const cardWidth = ref<number>(100)
const cardHeight = ref<number>(134)

const lastMonth = dayjs().startOf('month').subtract(1, 'month')
const yearSelected = ref<number>(lastMonth.year())
const monthSelected = ref<number>(-1)
const productSelected = ref<string | number>(-1)
const categorySelected = ref<number>(-1)

const totalSku = ref<number>(0)
const totalSkuChange = ref<number>(0)

const inventoryValue = ref<number>(0)
const inventoryValueChange = ref<number>(0)

const stockAvailable = ref<number>(0)
const stockAvailableChange = ref<number>(0)

const turnoverRatio = ref<number>(0.0)
const inventorySalesRatio = ref<number>(0.0)

const inventoryValueItems = ref<number[]>([])
const inventoryValueChangeItems = ref<number[]>([])

const turnoverItems = ref<number[]>([])

const inventoryPurchase = ref<number>()
const inventorySale = ref<number>()

const saleAmountItems = ref<number[]>([])
const topViewMode = ref<TTopViewMode>('value')
const topItems = ref<ITopItem[]>([])

const monthsFilteredItems = computed(() =>
  monthSelected.value < 1
    ? shortMonthItems.value.map((item) => item.title)
    : shortMonthItems.value.filter((item) => item.value === monthSelected.value).map((item) => item.title)
)

function handleOnResize() {
  const padding = 6 * 16
  cardWidth.value = ((rootElemRef.value?.$el?.offsetWidth || 0) - padding) / 5
  console.log(cardWidth.value)
  // if (rootElemRef.value?.$el) {
  //   console.log()
  //   rootElemRef.value.$el.style.transform = `scale(0.94)`
  //   rootElemRef.value.$el.style.maxHeight = `${window.innerHeight}px`
  //   rootElemRef.value.$el.style.transformOrigin = 'top center'
  // }
}

function handleOnChangeTopItem() {
  getTop10Items(logs.value, topViewMode.value, Number(yearSelected.value), Number(monthSelected.value))
}

function getInventoryValue(logs: string[][], year: number, month: number, skuId?: string, cateId?: string) {
  const items = findLogData(logs, year, month, skuId, cateId)
  const maxMonth = items.sort((a, b) => a.yyyymm.localeCompare(b.yyyymm))[items.length - 1]
  if (!maxMonth) {
    inventoryValue.value = 0
    inventoryValueChange.value = 0
    return
  }

  const maxMonthItems = items.filter((item) => item.yyyymm === maxMonth.yyyymm)
  const prevMonth = dayjs(`${maxMonth.yyyymm}-01`).subtract(1, 'month')
  const prevItems = findLogData(logs, prevMonth.year(), prevMonth.month() + 1)

  const currentValue = maxMonthItems.reduce((sum, item) => sum + item.lastInventoryValue, 0)
  const lastValue = prevItems.reduce((sum, item) => sum + item.lastInventoryValue, 0)
  const percentChange = lastValue === 0 ? 0 : (currentValue - lastValue) / lastValue
  inventoryValue.value = currentValue
  inventoryValueChange.value = percentChange
}

function getCountSku(logs: string[][], year: number, month: number, skuId?: string, cateId?: string) {
  const items = findLogData(logs, year, month, skuId, cateId)
  const maxMonth = items.sort((a, b) => a.yyyymm.localeCompare(b.yyyymm))[items.length - 1]
  if (!maxMonth) {
    totalSku.value = 0
    totalSkuChange.value = 0
    return
  }

  const maxMonthItems = items.filter((item) => item.yyyymm === maxMonth.yyyymm)
  const prevMonth = dayjs(`${maxMonth.yyyymm}-01`).subtract(1, 'month')
  const prevItems = findLogData(logs, prevMonth.year(), prevMonth.month() + 1)

  const currentValue = maxMonthItems.reduce(
    (unique, item) => (unique.includes(item.sku) ? unique : [...unique, item.sku]),
    [] as string[]
  )
  const lastValue = prevItems.reduce(
    (unique, item) => (unique.includes(item.sku) ? unique : [...unique, item.sku]),
    [] as string[]
  )
  const percentChange = lastValue.length === 0 ? 0 : (currentValue.length - lastValue.length) / lastValue.length
  totalSku.value = currentValue.length
  totalSkuChange.value = percentChange
}

function getStockAvailable(logs: string[][], year: number, month: number, skuId?: string, cateId?: string) {
  const items = findLogData(logs, year, month, skuId, cateId)
  const maxMonth = items.sort((a, b) => a.yyyymm.localeCompare(b.yyyymm))[items.length - 1]
  if (!maxMonth) {
    stockAvailable.value = 0
    stockAvailableChange.value = 0
    return
  }

  const maxMonthItems = items.filter((item) => item.yyyymm === maxMonth.yyyymm)
  const prevMonth = dayjs(`${maxMonth.yyyymm}-01`).subtract(1, 'month')
  const prevItems = findLogData(logs, prevMonth.year(), prevMonth.month() + 1)

  const currentValue = maxMonthItems.reduce((sum, item) => sum + item.lastQuantity, 0)
  const lastValue = prevItems.reduce((sum, item) => sum + item.lastQuantity, 0)
  const percentChange = lastValue === 0 ? 0 : (currentValue - lastValue) / lastValue
  stockAvailable.value = currentValue
  stockAvailableChange.value = percentChange
}

function getInventoryMovement(logs: string[][], year: number, month?: number, skuId?: string, cateId?: string) {
  const items = findLogData(logs, year, month, skuId, cateId)
  const purchase = items.reduce((sum, item) => sum + item.purchaseTotal, 0)
  const sale = items.reduce((sum, item) => sum + item.saleTotal, 0)
  inventoryPurchase.value = purchase
  inventorySale.value = sale * -1
}

function getTop10Items(
  logs: string[][],
  mode: TTopViewMode,
  year: number,
  month?: number,
  skuId?: string,
  cateId?: string
) {
  const items = findLogData(logs, year, month, skuId, cateId)
  const maxMonth = items.sort((a, b) => a.yyyymm.localeCompare(b.yyyymm))[items.length - 1]
  if (!maxMonth) {
    topItems.value = []
    return
  }

  const sortKey = mode === 'quantity' ? 'lastQuantity' : 'lastInventoryValue'
  const maxMonthItems = items.filter((item) => item.yyyymm === maxMonth.yyyymm).sort((a, b) => b[sortKey] - a[sortKey])
  const top10 = maxMonthItems.slice(0, 10)
  topItems.value = top10.map((item) => ({ id: item.sku, name: item.productName, value: item[sortKey] }))
}

function getInventoryValueOverTime(logs: string[][], year: number, month?: number, skuId?: string, cateId?: string) {
  const items = findLogData(logs, year, month, skuId, cateId)
  const stats = items.reduce(
    (items, item) => {
      const d = item.yyyymm
      if (!items[d]) items[d] = 0
      items[d] += item.lastInventoryValue
      return items
    },
    {} as Record<string, number>
  )
  const statDates = Object.keys(stats).sort((a, b) => a.localeCompare(b))
  inventoryValueItems.value = statDates.map((key) => stats[key])

  let lastValue = 0
  inventoryValueChangeItems.value = statDates.map((key) => {
    const val = stats[key]
    const change = lastValue === 0 ? 0 : val - lastValue
    lastValue = val
    return change
  })
}

function getSaleAmountOverTime(logs: string[][], year: number, month?: number, skuId?: string, cateId?: string) {
  const items = findLogData(logs, year, month, skuId, cateId)
  const stats = items.reduce(
    (items, item) => {
      const d = item.yyyymm
      if (!items[d]) items[d] = 0
      items[d] += item.saleTotal
      return items
    },
    {} as Record<string, number>
  )
  const statDates = Object.keys(stats).sort((a, b) => a.localeCompare(b))
  saleAmountItems.value = statDates.map((key) => stats[key])
}

function getInventoryToSaleRatio(logs: string[][], year: number, month?: number, skuId?: string, cateId?: string) {
  const items = findLogData(logs, year, month, skuId, cateId).sort((a, b) => a.yyyymm.localeCompare(b.yyyymm))
  const minMonth = items.sort((a, b) => a.yyyymm.localeCompare(b.yyyymm))[0]
  const maxMonth = items.sort((a, b) => a.yyyymm.localeCompare(b.yyyymm))[items.length - 1]

  if (!minMonth || !maxMonth) {
    inventorySalesRatio.value = 0
    return
  }

  const beginDate = minMonth.yyyymm
  const beginValue = items
    .filter((item) => item.yyyymm === beginDate)
    .reduce((sum, item) => sum + item.beginInventoryValue, 0)

  const lastDate = maxMonth.yyyymm
  const lastValue = items
    .filter((item) => item.yyyymm === lastDate)
    .reduce((sum, item) => sum + item.lastInventoryValue, 0)

  const avgInventory = (beginValue + lastValue) / 2
  const saleValue = items.reduce((sum, item) => sum + item.saleTotal, 0)
  inventorySalesRatio.value = saleValue === 0 ? 0 : avgInventory / saleValue
}

function getTurnover(logs: string[][], year: number, month?: number, skuId?: string, cateId?: string) {
  const items = findLogData(logs, year, month, skuId, cateId).sort((a, b) => a.yyyymm.localeCompare(b.yyyymm))
  const minMonth = items.sort((a, b) => a.yyyymm.localeCompare(b.yyyymm))[0]
  const maxMonth = items.sort((a, b) => a.yyyymm.localeCompare(b.yyyymm))[items.length - 1]

  if (!minMonth || !maxMonth) {
    inventorySalesRatio.value = 0
    return
  }

  const beginDate = minMonth.yyyymm
  const beginValue = items
    .filter((item) => item.yyyymm === beginDate)
    .reduce((sum, item) => sum + item.beginInventoryValue, 0)

  const lastDate = maxMonth.yyyymm
  const lastValue = items
    .filter((item) => item.yyyymm === lastDate)
    .reduce((sum, item) => sum + item.lastInventoryValue, 0)

  const purchaseValue = items.reduce((sum, item) => sum + item.purchaseTotal, 0)
  const cogs = beginValue + purchaseValue - lastValue
  const argInventory = (beginValue + lastValue) / 2
  turnoverRatio.value = argInventory == 0 ? 0 : cogs / argInventory
}

function getTurnoverByMonth(logs: string[][], year: number, month?: number, skuId?: string, cateId?: string) {
  const items = findLogData(logs, year, month, skuId, cateId).sort((a, b) => a.yyyymm.localeCompare(b.yyyymm))

  const stats = items.reduce(
    (items, item) => {
      const key = item.yyyymm
      if (!items[key]) items[key] = { end: 0, purchase: 0, sale: 0, start: 0 }
      items[key].start += item.beginInventoryValue
      items[key].end += item.lastInventoryValue
      items[key].purchase += item.purchaseTotal
      items[key].sale += item.saleTotal
      return items
    },
    {} as Record<string, { end: number; purchase: number; sale: number; start: number }>
  )
  turnoverItems.value = Object.keys(stats)
    .sort((a, b) => a.localeCompare(b))
    .map(
      (key) =>
        ((stats[key].start + stats[key].end) / 2 / (stats[key].start + stats[key].purchase - stats[key].end)) * 30
    )
}

function update() {
  const year = Number(yearSelected.value)
  const month = Number(monthSelected.value)
  const skuId = String(productSelected.value)
  const cateId = String(categorySelected.value)
  getInventoryValue(logs.value, year, month, skuId, cateId)
  getCountSku(logs.value, year, month, skuId, cateId)
  getStockAvailable(logs.value, year, month, skuId, cateId)
  getTop10Items(logs.value, topViewMode.value, year, month, skuId, cateId)
  getInventoryMovement(logs.value, year, month, skuId, cateId)
  getInventoryValueOverTime(logs.value, year, month, skuId, cateId)
  getSaleAmountOverTime(logs.value, year, month, skuId, cateId)
  getInventoryToSaleRatio(logs.value, year, month, skuId, cateId)
  getTurnover(logs.value, year, month, skuId, cateId)
  getTurnoverByMonth(logs.value, year, month, skuId, cateId)
}

async function handleOnInit() {
  const [summary, product] = await Promise.all([sheetApi.loadSummaryData(), sheetApi.loadProductData()])
  logs.value = summary
  yearItems.value = getUniqueYear(summary)
  productItems.value = [selectAllItem, ...getUniqueProduct(product)]
  categoryItems.value = [selectAllItem, ...getUniqueCategory(product)]
  const year = lastMonth.year()
  const month = lastMonth.month() + 1
  getInventoryValue(summary, year, month)
  getCountSku(summary, year, month)
  getStockAvailable(summary, year, month)
  getInventoryMovement(summary, year)
  getInventoryValueOverTime(summary, year)
  getSaleAmountOverTime(summary, year)
  getInventoryToSaleRatio(summary, year)
  getTurnover(summary, year)
  getTurnoverByMonth(summary, year)
  getTop10Items(summary, 'value', year)
}

function handleOnChangeYear() {
  update()
}
function handleOnChangeMonth() {
  update()
}

function handleOnChangeProduct() {
  update()
}

function handleOnChangeCategory() {
  update()
}

onMounted(() => {
  handleOnInit()
  handleOnResize()
  window.addEventListener('resize', handleOnResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleOnResize)
})

useHead({
  title: 'Inventory Dashboard',
})
</script>

<style lang="scss" scoped>
.dashboard {
  &__row {
    display: flex;
    align-items: stretch;
    gap: 16px;
    padding-top: 16px;
  }

  &__col {
    flex: 1;
  }
}
</style>
