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
  purchaseInventoryValue: number
  purchaseQuantity: number
  saleInventoryValue: number
  saleQuantity: number
  sku: string
  year: number
  yyyymm: string
}
