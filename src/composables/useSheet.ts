import type { ISheet } from '~/types/sheet'

export const useSheet = () => {
  const getData = async (sheetRange: string): Promise<string[][]> => {
    const config = useRuntimeConfig()
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.public.spreadSheetId}/values/${encodeURIComponent(sheetRange)}?key=${config.public.googleApiKey}`
    const res = await $fetch<ISheet>(url)
    return res.values
  }

  const loadSummaryData = async (): Promise<string[][]> => {
    const res = await getData('mock_summary!A2:N')
    return res
  }

  const loadProductData = async (): Promise<string[][]> => {
    const res = await getData('mock_product!A2:E')
    return res
  }

  return { loadProductData, loadSummaryData }
}
