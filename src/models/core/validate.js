import { observable } from 'mobx'

export const validateRequired = value => {
  const error = 'is required'

  if (value && value instanceof Array && value.length > 0) return ''

  if (value) return ''

  return error
}

export const validateEmail = value => {
  const error = 'not a valid email format < name@example.com >'

  if (!value) return ''

  // eslint-disable-next-line no-useless-escape
  const emailFormat = /^[^<>@,;\s]+@[^<>@,;\s]+\.[^<>@,;\s\.]+$/
  if (emailFormat.test(value)) return ''

  return error
}

export const validateEmailComplex = value => {
  const error = 'not a valid email format < name@example.com >'

  // eslint-disable-next-line no-useless-escape
  const domainPartFormat = /^[^"<>@,;\s\.]+(\.[^"<>@,;\s\.]+)+$/
  // eslint-disable-next-line no-useless-escape
  const simpleLocalPartFormat = /^[^"<>@,;\s\.]+((\.[^"<>@,;\s\.]+)+)?$/
  const quotedLocalPartFormat = /^"[^"<>@,;\s]+"$/

  if (!value) return error

  const parts = value.split('@')
  if (parts.length !== 2) return 'must contain @ character'

  if (!domainPartFormat.test(parts[1]) || value.endsWith('.unknown')) {
    return 'domain part after the @ is not valid'
  }

  // simple local part
  if (simpleLocalPartFormat.test(parts[0])) return ''

  // quoted local part
  if (quotedLocalPartFormat.test(parts[0])) return ''

  return error
}

const validateFunc = {
  required: validateRequired,
  emailRegex: validateEmail,
}

const validate = (obj, key, rules, options = {}) => {
  rules = (rules || '').split('|').filter(r => r !== '')
  if (rules.length === 0) return

  const errorKey = options.customErrorKey || key
  const value = options.value === undefined ? obj[key] : options.value

  obj.errors[errorKey] = rules
    .map(rule => validateFunc[rule](value))
    .filter(err => err !== '')
    .join(', ')

  if (!obj.errors[errorKey]) delete obj.errors[errorKey]
}

export const validatable = obj => {
  obj.errors = observable({})
  obj.hasErrors = () => {
    return Object.keys(obj.errors).length > 0
  }
  obj.validate = (key, rules, options) => validate(obj, key, rules, options)
}
