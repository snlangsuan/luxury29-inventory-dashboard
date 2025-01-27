import type { IFilterItem } from '~/types/filter'
import type { IProductSummary } from '~/types/stock.d'

export function getStrDate(year: string, month: string): string {
  return year + ('00' + month).slice(-2)
}

export function findLogData(
  logs: string[][],
  year: number,
  month?: number,
  productId?: string,
  cateId?: string
): IProductSummary[] {
  const text = String(year) + (month ? String(month) : '')
  const filtered = logs.filter((item) => {
    const key = String(item[0]) + (month ? String(item[1]) : '')
    return key === text && (!productId || productId === item[2]) && (!cateId || cateId === item[4])
  })

  return filtered.map((item) => ({
    beginInventoryValue: Number(item[9]),
    beginQuantity: Number(item[8]),
    cateId: item[4],
    cateName: item[5],
    lastInventoryValue: Number(item[7]),
    lastQuantity: Number(item[6]),
    month: Number(item[1]),
    productName: item[3],
    purchaseInventoryValue: Number(item[11]),
    purchaseQuantity: Number(item[10]),
    saleInventoryValue: Number(item[13]),
    saleQuantity: Number(item[12]),
    sku: item[2],
    year: Number(item[0]),
    yyyymm: getStrDate(item[0], item[1]),
  }))
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
