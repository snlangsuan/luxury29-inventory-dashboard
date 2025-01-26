import numeral from 'numeral'

export const shorthandNumberFormat = (val: number): string => {
  return val < 1000 && val > -1000 ? String(val) : numeral(val).format('0.0a')
}

export const percentageFormat = (val: number): string => {
  return numeral(val).format('0%')
}

export const decimalFormat = (val: number, len: number = 2): string => {
  return numeral(val).format(`0.${'0'.repeat(len)}a`)
}
