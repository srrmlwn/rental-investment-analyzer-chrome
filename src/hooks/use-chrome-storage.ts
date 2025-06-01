import { useState, useEffect, useCallback } from "react"

export function useChromeStorage<T>(key: string, defaultValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(defaultValue)

  // Load initial value from storage
  useEffect(() => {
    chrome.storage.local.get([key], (result) => {
      if (result[key] !== undefined) {
        setValue(result[key])
      }
    })
  }, [key])

  // Update storage when value changes
  const updateValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const next = typeof newValue === "function" ? (newValue as (prev: T) => T)(prev) : newValue
        chrome.storage.local.set({ [key]: next })
        return next
      })
    },
    [key]
  )

  return [value, updateValue]
} 