export const handleCurrencyChange =
  (callback: (numericValue: number) => void) =>
  (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = Number(e.target.value.replace(/,/g, ''))
    callback(numericValue)
  }
