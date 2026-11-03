/** Form validation and the explicit receipt contract for a saved application. */
export interface FinancingFormData {
  fullName: string;
  cpf: string;
  birthDate: string;
  phone: string;
  propertyType: string;
  hasDownPayment: string;
  downPaymentValue: string;
  monthlyIncome: string;
  energyBillValue: string;
  zipcode: string;
  street: string;
  houseNumber: string;
  city: string;
  state: string;
}

export type FinancingStep = 1 | 2 | 3;
export interface FinancingValidationError {
  field: keyof FinancingFormData;
  message: string;
  step: FinancingStep;
}

const STATES = new Set([
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT',
  'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO',
  'RR', 'SC', 'SP', 'SE', 'TO',
]);

function validCpf(value: string): boolean {
  const cpf = value.replace(/\D/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  for (const length of [9, 10]) {
    let sum = 0;
    for (let index = 0; index < length; index++) {
      sum += Number(cpf[index]) * (length + 1 - index);
    }
    const remainder = (sum * 10) % 11;
    if ((remainder === 10 ? 0 : remainder) !== Number(cpf[length])) return false;
  }
  return true;
}

function validBirthDate(value: string): boolean {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!match) return false;
  const [, dayValue, monthValue, yearValue] = match;
  const day = Number(dayValue);
  const month = Number(monthValue);
  const year = Number(yearValue);
  const date = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return year >= 1900 && date <= today && date.getFullYear() === year &&
    date.getMonth() === month - 1 && date.getDate() === day;
}

function positiveMoney(value: string): boolean {
  // The backend receives decimal strings with a period, not a UI currency mask.
  return /^\d+(\.\d{1,2})?$/.test(value) && Number.isFinite(Number(value)) &&
    Number(value) > 0 && Number.isSafeInteger(Math.round(Number(value) * 100));
}

/**
 * Plain-text BRL input. Editing never inserts thousands separators or zeroes.
 * A comma may be typed for cents; a single dot with 1-2 trailing digits is
 * accepted for keyboards which do not expose a comma key.
 */
export function sanitizeMoneyDraft(source: string): string {
  const clean = source.replace(/[^\d.,]/g, '');
  if (!clean) return '';

  const comma = clean.lastIndexOf(',');
  const dots = (clean.match(/\./g) || []).length;
  const dot = clean.lastIndexOf('.');
  const dotIsDecimal = comma === -1 && dots === 1 && dot >= 0 &&
    (clean.length - dot - 1) <= 2;
  const sep = comma >= 0 ? comma : dotIsDecimal ? dot : -1;
  const integer = (sep < 0 ? clean : clean.slice(0, sep)).replace(/\D/g, '').slice(0, 12);
  const fraction = sep < 0 ? '' : clean.slice(sep + 1).replace(/\D/g, '').slice(0, 2);
  if (!integer && !fraction) return sep >= 0 ? '0,' : '';
  const normalizedInt = integer.replace(/^0+(?=\d)/, '') || '0';
  return sep >= 0 ? `${normalizedInt},${fraction}` : normalizedInt;
}

export function moneyDraftToApiValue(draft: string): string {
  const normalized = sanitizeMoneyDraft(draft);
  if (!normalized) return '0';
  const [integer, cents = ''] = normalized.split(',');
  return `${integer || '0'}.${(cents + '00').slice(0, 2)}`;
}

export function formatMoneyBRL(draft: string): string {
  const normalized = moneyDraftToApiValue(draft);
  const amount = Number(normalized);
  if (!Number.isFinite(amount)) return '';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
    .format(amount).replace(/\u00a0/g, ' ');
}

/** Client-side guidance. The API must independently validate every field. */
export function validateFinancingForm(
  data: FinancingFormData,
  step?: FinancingStep,
): FinancingValidationError | null {
  const error = (field: keyof FinancingFormData, message: string, at: FinancingStep) =>
    ({ field, message, step: at });

  if (!step || step === 1) {
    if (!positiveMoney(data.energyBillValue)) return error('energyBillValue', 'Informe o valor da conta de energia, maior que zero.', 1);
    if (!data.fullName.trim()) return error('fullName', 'Preencha seu nome completo.', 1);
    if (!validCpf(data.cpf)) return error('cpf', 'Confira o CPF e preencha os 11 números.', 1);
    if (!validBirthDate(data.birthDate)) {
      return error('birthDate', 'Informe uma data de nascimento válida no formato dia/mês/ano.', 1);
    }
    if (!/^[1-9]{2}\d{8,9}$/.test(data.phone.replace(/\D/g, ''))) {
      return error('phone', 'Informe o telefone com DDD e todos os números.', 1);
    }
  }

  if (!step || step === 2) {
    if (!positiveMoney(data.monthlyIncome)) return error('monthlyIncome', 'Informe uma renda mensal válida, maior que zero.', 2);
    if (!['own', 'rented'].includes(data.propertyType)) return error('propertyType', 'Selecione o tipo de imóvel.', 2);
    if (!['true', 'false'].includes(data.hasDownPayment)) return error('hasDownPayment', 'Informe se possui valor de entrada.', 2);
    if (data.hasDownPayment === 'true' && !positiveMoney(data.downPaymentValue)) {
      return error('downPaymentValue', 'Informe o valor da entrada, maior que zero.', 2);
    }
  }

  if (!step || step === 3) {
    if (!/^\d{8}$/.test(data.zipcode.replace(/\D/g, ''))) return error('zipcode', 'Informe os 8 números do CEP.', 3);
    if (!data.street.trim()) return error('street', 'Preencha a rua ou o logradouro.', 3);
    if (!data.houseNumber.trim()) return error('houseNumber', 'Preencha o número ou informe s/n.', 3);
    if (!data.city.trim()) return error('city', 'Preencha a cidade.', 3);
    if (!STATES.has(data.state.trim().toUpperCase())) return error('state', 'Informe a sigla válida do estado, como RO.', 3);
  }

  return null;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function hasReportedError(value: unknown): boolean {
  if (value === null || value === undefined || value === false || value === 0) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (isObject(value)) return Object.keys(value).length > 0;
  return true;
}

function normalizeId(value: unknown): string | null {
  if (typeof value === 'number') {
    return Number.isSafeInteger(value) && value > 0 ? String(value) : null;
  }
  // This is the application receipt, not the Ads field: a legitimate long ID
  // may confirm a save even when the optional measurement cannot accept it.
  if (typeof value !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9_-]{0,127}$/.test(value)) return null;
  // Reject placeholder values, zero and negative IDs, even if a server mistakenly
  // sends success=true. UUIDs and other opaque database keys remain supported.
  if (/^(?:0+|null|undefined|true|false|success|ok|pending)$/i.test(value)) return null;
  return value;
}

/**
 * Proposed API contract, to be verified against the actual backend before rollout:
 * { success: true, data: { id: <stable database record ID> } }
 * The equivalent { success: true, id: ... } envelope is also accepted.
 *
 * This validates a response; it cannot independently verify database persistence.
 * The API must return it only after its write has committed. An HTTP 2xx, an
 * arbitrary message, or success=true without an ID is insufficient for tracking.
 */
export function getFinancingReceipt(body: unknown): { registrationId: string } | null {
  if (!isObject(body) || body.success !== true || hasReportedError(body.error) || hasReportedError(body.errors)) return null;
  const data = isObject(body.data) ? body.data : null;
  if (data?.success === false || hasReportedError(data?.error) || hasReportedError(data?.errors)) return null;
  const nestedId = normalizeId(data?.id);
  const rootId = normalizeId(body.id);
  if ((data?.id !== undefined && !nestedId) || (body.id !== undefined && !rootId)) return null;
  if (nestedId && rootId && nestedId !== rootId) return null;
  const registrationId = nestedId ?? rootId;
  return registrationId ? { registrationId } : null;
}
