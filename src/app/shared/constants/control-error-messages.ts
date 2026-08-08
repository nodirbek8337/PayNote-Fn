import { ControlErrorMessages } from '../components/control-error/control-error.component';

export enum ValidationErrorKey {
  Required = 'required',
  Email = 'email',
  Pattern = 'pattern',
  PasswordMinLength = 'passwordMinLength',
  PasswordUppercase = 'passwordUppercase',
  PasswordLowercase = 'passwordLowercase',
  PasswordNumber = 'passwordNumber',
  Min = 'min',
  Max = 'max',
  CurrencyMissing = 'currencyMissing',
}

export enum ValidationErrorText {
  Required = "Maydon to'ldirilishi shart",
  Email = "Email noto'g'ri formatda",
  Pattern = "Qiymat noto'g'ri formatda",
  PhoneRequired = 'Telefon raqami majburiy',
  PhonePattern = "Noto'g'ri telefon raqami",
  PasswordRequirements = "Parol kamida 6 ta belgi, bitta katta harf, bitta kichik harf va bitta raqamdan iborat bo'lishi kerak",
  CurrencyMissing = 'Valyuta tanlanishi shart',
}

export const INPUT_ERROR_MESSAGES: ControlErrorMessages = {
  [ValidationErrorKey.Required]: ValidationErrorText.Required,
  [ValidationErrorKey.Email]: ValidationErrorText.Email,
  [ValidationErrorKey.Pattern]: ValidationErrorText.Pattern,
  [ValidationErrorKey.PasswordMinLength]: ValidationErrorText.PasswordRequirements,
  [ValidationErrorKey.PasswordUppercase]: ValidationErrorText.PasswordRequirements,
  [ValidationErrorKey.PasswordLowercase]: ValidationErrorText.PasswordRequirements,
  [ValidationErrorKey.PasswordNumber]: ValidationErrorText.PasswordRequirements,
} as const;

export const SELECT_ERROR_MESSAGES: ControlErrorMessages = {
  [ValidationErrorKey.Required]: ValidationErrorText.Required,
} as const;

export const PHONE_ERROR_MESSAGES: ControlErrorMessages = {
  [ValidationErrorKey.Required]: ValidationErrorText.PhoneRequired,
  [ValidationErrorKey.Pattern]: ValidationErrorText.PhonePattern,
} as const;

export const MONEY_ERROR_MESSAGES: ControlErrorMessages = {
  [ValidationErrorKey.Required]: ValidationErrorText.Required,
  [ValidationErrorKey.Min]: (error) => `Minimal qiymat: ${(error as { min: number }).min}`,
  [ValidationErrorKey.Max]: (error) => `Maksimal qiymat: ${(error as { max: number }).max}`,
  [ValidationErrorKey.CurrencyMissing]: ValidationErrorText.CurrencyMissing,
} as const;
