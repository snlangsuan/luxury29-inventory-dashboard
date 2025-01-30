import type { IFilterItem } from '~/types/filter'
import type { IProductSummary } from '~/types/stock.d'

export function getStrDate(year: number, month?: number): string {
  if (!month) return `${year}`
  return year + ('00' + month).slice(-2)
}

export function parseLogData(logs: string[][]) {
  return logs.map((item) => ({
    beginInventoryValue: Number(item[9]),
    beginQuantity: Number(item[8]),
    cateId: item[4],
    cateName: item[5],
    lastInventoryValue: Number(item[7]),
    lastQuantity: Number(item[6]),
    month: Number(item[1]),
    productName: item[3],
    purchaseQuantity: Number(item[10]),
    purchaseTotal: Number(item[11]),
    saleQuantity: Number(item[12]),
    saleTotal: Number(item[13]),
    sku: item[2],
    year: Number(item[0]),
    yyyymm: getStrDate(Number(item[0]), Number(item[1])),
  }))
}

export function findLogData(
  logs: IProductSummary[],
  year: number,
  month?: number,
  skuId?: string,
  cateId?: string
): IProductSummary[] {
  if (month === -1) month = undefined
  if (String(skuId) === '-1') skuId = undefined
  if (String(cateId) === '-1') cateId = undefined

  const text = getStrDate(year, month)
  const filtered = logs.filter((item) => {
    const key = getStrDate(item.year, month ? item.month : undefined)
    return key === text && (!skuId || skuId === item.sku) && (!cateId || cateId === item.cateId)
  })

  return filtered
}

export function getUniqueYear(logs: string[][]): IFilterItem[] {
  return logs.reduce((items, item) => {
    const exists = items.find((x) => x.value === item[0])
    if (!exists) items.push({ title: item[0], value: item[0] })
    return items
  }, [] as IFilterItem[])
}

export function getUniqueProduct(logs: string[][]): IFilterItem[] {
  return logs.reduce((items, item) => {
    const exists = items.find((x) => x.value === item[0])
    if (!exists) items.push({ title: item[1], value: item[0] })
    return items
  }, [] as IFilterItem[])
}

export function getUniqueCategory(logs: string[][]): IFilterItem[] {
  return logs.reduce((items, item) => {
    const exists = items.find((x) => x.value === item[2])
    if (!exists) items.push({ title: item[3], value: item[2] })
    return items
  }, [] as IFilterItem[])
}
