import { isObservableArray, reaction } from 'mobx'

export const caseInsensitiveNameComparator = (itemA, itemB) => {
  const nameA = (itemA.name || '').toLowerCase()
  const nameB = (itemB.name || '').toLowerCase()
  if (nameA < nameB) return -1
  if (nameB < nameA) return 1
  return 0
}

export const weightComparator = (itemA, itemB) => {
  const weightA = itemA.weight || 0
  const weightB = itemB.weight || 0
  if (weightA < weightB) return -1
  if (weightB < weightA) return 1
  return 0
}

// Create a name and weight sortable that uses a sortable
// so they don't have to provide field and watcher
// from ticket folder listing we will use the generic sortable
export const sortable = (target, comparator, watcher = x => x.length) => {
  if (!isObservableArray(target)) {
    throw new Error('sortable requires a mobx observable array')
  }

  target.sortAll = () => {
    target.replace(target.slice().sort(comparator))
  }

  reaction(
    () => [target.length, watcher(target)].join(),
    () => target.sortAll()
  )

  return target
}
