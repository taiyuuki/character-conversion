import type { DecorationOptions } from 'vscode'

export function equalDecorations(arr1: Array<DecorationOptions>, arr2: Array<DecorationOptions>) {
  const i1 = arr1.length
  const i2 = arr2.length
  if (i1 === i2) {
    for (let i = 0; i < i1; i++) {
      if (arr1[i].range.isEqual(arr2[i].range)) {
        continue
      }
      else {
        return false
      }
    }
    return true
  }
  else {
    return false
  }
}

export function isNotNull<T>(target: T): target is NonNullable<T> {
  return target !== void 0 && target !== null
}

export function isNotEmptyString<T>(target: T): target is Exclude<T, null | undefined | ''> {
  if (typeof target === 'string') {
    return target.trim() !== ''
  }
  else {
    return false
  }
}