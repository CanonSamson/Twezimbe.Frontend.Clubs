export function isEmail (email: string) {
  const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
  return reg.test(email)
}

export function hasChanges (oldData: any, newData: any) {
  for (const key in oldData) {
    if (oldData[key] !== newData[key]) {
      return true
    }
  }
  return false
}

export function changedData (oldData: any, newData: any) {
  const changed: any = {}
  for (const key in oldData) {
    if (oldData[key] !== newData[key]) {
      changed[key] = newData[key]
    }
  }
  return changed
}
