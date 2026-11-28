export const ENERGY_PRICE = 0.95; // R$/kWh
export const ENERGY_INFLATION = 0.06; // 6% a.a.

export const irradiationData: Record<string, number> = {
    'AC': 4.5, 'AL': 5.3, 'AP': 4.8, 'AM': 4.3, 'BA': 5.5, 'CE': 5.6,
    'DF': 5.2, 'ES': 5.0, 'GO': 5.3, 'MA': 5.2, 'MT': 5.1, 'MS': 5.2,
    'MG': 5.1, 'PA': 4.8, 'PB': 5.5, 'PR': 4.8, 'PE': 5.4, 'PI': 5.6,
    'RJ': 5.0, 'RN': 5.6, 'RS': 4.6, 'RO': 4.8, 'RR': 5.0, 'SC': 4.5,
    'SP': 4.9, 'SE': 5.4, 'TO': 5.2
};

// Keep the illustrative examples and the interactive calculator on the same assumptions.
export const REFERENCE_SUN_HOURS = 4.5;
export const REFERENCE_PANEL_WATTS = 550;
export const MONTHLY_CONSUMPTION_EXAMPLES = [600, 1000, 1500] as const;

export function estimateSolarArray(monthlyKwh: number) {
    const systemSize = monthlyKwh / (30 * REFERENCE_SUN_HOURS);
    const panels = Math.ceil(systemSize / (REFERENCE_PANEL_WATTS / 1000));
    return { systemSize, panels };
}
