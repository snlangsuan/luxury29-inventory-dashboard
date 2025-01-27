export interface ITopItem {
  id: string
  name: string
  value: number
}

export interface IProductSummary {
  beginInventoryValue: number
  beginQuantity: number
  cateId: string
  cateName: string
  lastInventoryValue: number
  lastQuantity: number
  month: number
  productName: string
  purchaseQuantity: number
  purchaseTotal: number
  saleQuantity: number
  saleTotal: number
  sku: string
  year: number
  yyyymm: string
}
