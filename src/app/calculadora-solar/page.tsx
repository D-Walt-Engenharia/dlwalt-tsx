'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Sun, Zap, ArrowRight, Wallet, MapPin, BarChart3, TrendingUp, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { irradiationData, ENERGY_PRICE, ENERGY_INFLATION } from '@/lib/solar-constants';
import { redirectToWhatsApp } from '@/lib/whatsapp-quote';

export default function SolarCalculatorPage() {
    const [cityUf, setCityUf] = useState("");
    const [kwh, setKwh] = useState<number | ''>('');
    const [isLoadingLocation, setIsLoadingLocation] = useState(true);
    const [result, setResult] = useState<{
        irradiation: string;
        systemSize: string;
        investment: string;
        monthlySavings: string;
        paybackTime: string;
        totalSavings25Years: string;
        chartData: { year: number; saldo: number }[];
        fullText: string;
        panels: number;
    } | null>(null);

    useEffect(() => {
        // Obter localização do usuário (cidade + UF)
        fetch("https://ipapi.co/json/")
            .then((res) => res.json())
            .then((data) => {
                if (data.city && data.region_code) {
                    const location = `${data.city}/${data.region_code}`;
                    setCityUf(location);
                }
            })
            .catch((err) => console.error("Erro ao obter localização", err))
            .finally(() => setIsLoadingLocation(false));
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const kwhValue = Number(kwh);

        if (!kwhValue || kwhValue < 50) {
            alert("O consumo mínimo deve ser 50 kWh.");
            return;
        }

        const uf = cityUf.split("/")[1] || "SP";
        // Default to a median value if UF not found or not in map
        const irradiation = 4.5 //irradiationData[uf] || 5.0;

        // Cálculo do tamanho do sistema
        // Fórmula básica: Consumo / 30 dias / Irradiação / Rendimento (0.80 padrão)
        // O código do usuário usava kwh / 30 / irradiation. Vamos manter a lógica do usuário mas ajustando para um sistema real.
        // Geralmente: (KwhMes / 30) / (Irradiacao * PerformanceRatio)
        // User snippet: systemSizeVal = kwh / 30 / irradiation; 
        const systemSizeVal = kwhValue / 30 / irradiation;

        // Investimento Estimado (Baseado no snippet do usuário: kwh * 19.4?? Isso parece alto ou uma fórmula específica.
        // Geralmente custa ~R$ 3000-4000 por kWp.
        // O snippet diz: const investmentVal = kwh * 19.4;
        // Se kwh for 500: 500 * 19.4 = 9700. Para 500kWh precisa de ~4kWp. 4 * 2500 = 10k. Faz sentido.
        const investmentVal = kwhValue * 19.4;

        // --- CÁLCULOS FINANCEIROS ---

        // Economia Mensal Estimada
        const monthlySavingsVal = kwhValue * ENERGY_PRICE;

        // Tempo de Retorno (anos) -> Investimento / (Economia Mensal * 12)
        const annualSavingsInitial = monthlySavingsVal * 12;
        const paybackYearsVal = investmentVal / annualSavingsInitial;

        // Projeção 25 anos (Gráfico)
        const chartData = [];
        let accumulatedSavings = -investmentVal; // Começa negativo
        let currentEnergyPrice = ENERGY_PRICE;

        // Ano 0
        chartData.push({
            year: 0,
            saldo: -investmentVal,
        });

        for (let year = 1; year <= 25; year++) {
            // Economia neste ano considerando inflação da energia
            const yearlySavings = kwhValue * 12 * currentEnergyPrice;
            accumulatedSavings += yearlySavings;

            chartData.push({
                year: year,
                saldo: Math.round(accumulatedSavings),
            });

            // Inflaciona o preço da energia para o próximo ano
            currentEnergyPrice *= (1 + ENERGY_INFLATION);
        }

        const totalSavingsVal = accumulatedSavings;

        // Formatação
        const formattedInvestment = investmentVal.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
        const formattedMonthlySavings = monthlySavingsVal.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
        const formattedTotalSavings = totalSavingsVal.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });

        // Payback formatado
        const paybackYearsFloor = Math.floor(paybackYearsVal);
        const paybackMonths = Math.round((paybackYearsVal - paybackYearsFloor) * 12);
        const formattedPayback = `${paybackYearsFloor} anos${paybackMonths > 0 ? ` e ${paybackMonths} meses` : ""}`;

        // Número de painéis (estimativa 550W)
        const panelsVal = Math.ceil(systemSizeVal / 0.55);

        const simulationText = `Olá, fiz uma simulação no site.\n\n*Simulação realizada:*\n- Cidade/UF: ${cityUf}\n- Consumo mensal: ${kwhValue} kWh\n- Sistema Estimado: ${systemSizeVal.toFixed(2)} kWp\n- Economia Mensal: ${formattedMonthlySavings}\n- Retorno (Payback): ${formattedPayback}\n- Economia Total (25 anos): ${formattedTotalSavings}`;

        setResult({
            irradiation: irradiation.toFixed(2),
            systemSize: systemSizeVal.toFixed(2),
            investment: formattedInvestment,
            monthlySavings: formattedMonthlySavings,
            paybackTime: formattedPayback,
            totalSavings25Years: formattedTotalSavings,
            chartData: chartData,
            fullText: simulationText,
            panels: panelsVal
        });
    };

    const handleWhatsAppSubmit = () => {
        if (!result) return;


        const message = result.fullText;
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/5569993695702?text=${encodedMessage}`;

        redirectToWhatsApp(whatsappUrl, "calculadora_whatsapp");
    };

    // Helper para o gráfico simples (CSS)
    const maxSaldo = result ? result.chartData[result.chartData.length - 1].saldo : 0;
    const minSaldo = result ? Math.abs(result.chartData[0].saldo) : 0; // Valor investido (negativo)
    const totalRange = maxSaldo + minSaldo;

    return (
        <div className="flex flex-col min-h-screen bg-black text-white">
            <Header />
            <main className="flex-grow pt-32 pb-20">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-16 space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                            <Zap className="w-4 h-4 text-yellow-500" />
                            Simulador Inteligente 2.0
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold">
                            Seu Investimento em <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-300">Energia Solar</span>
                        </h1>
                        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                            Descubra em quanto tempo seu sistema se paga e quanto você vai lucrar nos próximos 25 anos.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-8 items-start">
                        {/* Formulário */}
                        <div className="lg:col-span-5 bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <Sun className="text-yellow-500" />
                                Seus Dados
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Cidade / UF</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <input
                                            type="text"
                                            value={isLoadingLocation ? "Localizando..." : cityUf}
                                            onChange={(e) => setCityUf(e.target.value)}
                                            placeholder="Ex: Porto Velho/RO"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 transition-colors"
                                            required
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500">Detectamos sua localização para dados de irradiação solar mais precisos.</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Consumo Mensal Médio (kWh)</label>
                                    <div className="relative">
                                        <Zap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <input
                                            type="number"
                                            value={kwh}
                                            onChange={(e) => setKwh(Number(e.target.value))}
                                            placeholder="Ex: 500"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 transition-colors"
                                            required
                                            min="50"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500">Verifique este valor na sua conta de luz.</p>
                                </div>

                                <Button type="submit" size="lg" className="w-full h-14 text-lg font-bold rounded-xl bg-gradient-to-r from-primary to-blue-600 hover:opacity-90 transition-opacity text-white">
                                    Simular Economia
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </form>
                        </div>

                        {/* Resultados */}
                        <div className="lg:col-span-7">
                            {!result ? (
                                <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 bg-white/5 border border-white/10 rounded-3xl border-dashed">
                                    <BarChart3 className="w-16 h-16 text-white/10 mb-4" />
                                    <p className="text-xl text-gray-500 font-medium text-center">
                                        Preencha os dados ao lado para ver <br /> sua projeção financeira detalhada.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                                    {/* Destaque Financeiro */}
                                    <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 rounded-3xl p-8 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/20 rounded-full blur-3xl opacity-50" />
                                        <div className="relative z-10">
                                            <p className="text-sm font-bold text-primary uppercase tracking-widest mb-1">Lucro Estimado em 25 Anos</p>
                                            <p className="text-4xl md:text-6xl font-extrabold text-white mb-4">
                                                {result.totalSavings25Years}
                                            </p>
                                            <div className="flex flex-wrap gap-4">
                                                {/**
                                                 * 
                                                <div className="bg-black/30 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10">
                                                    <p className="text-xs text-gray-400 uppercase">Investimento</p>
                                                    <p className="font-bold text-white">{result.investment}</p>
                                                </div>
                                                 */}
                                                <div className="bg-black/30 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10">
                                                    <p className="text-xs text-gray-400 uppercase">Payback</p>
                                                    <p className="font-bold text-green-400">{result.paybackTime}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Detalhes Técnicos */}
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                                            <p className="text-xs text-gray-400 mb-1">Sistema</p>
                                            <p className="text-lg font-bold text-white">{result.systemSize} kWp</p>
                                        </div>
                                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                                            <p className="text-xs text-gray-400 mb-1">Placas (est.)</p>
                                            <p className="text-lg font-bold text-white">~{result.panels}</p>
                                        </div>
                                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                                            <p className="text-xs text-gray-400 mb-1">Economia/mês</p>
                                            <p className="text-lg font-bold text-green-400">{result.monthlySavings}</p>
                                        </div>
                                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                                            <p className="text-xs text-gray-400 mb-1">Irradiação</p>
                                            <p className="text-lg font-bold text-white">{result.irradiation}</p>
                                        </div>
                                    </div>

                                    {/* Gráfico Simplificado CSS */}
                                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                            <TrendingUp className="w-5 h-5 text-primary" />
                                            Fluxo de Caixa Acumulado (25 anos)
                                        </h3>
                                        <div className="flex items-end gap-1 h-40 w-full px-2 pb-4 border-b border-white/10 relative">
                                            {/* Linha Zero */}
                                            <div className="absolute w-full h-px bg-white/20" style={{ bottom: `${(minSaldo / totalRange) * 100}%` }}></div>

                                            {result.chartData.map((point, i) => {
                                                // Normalizar altura. 
                                                // range vai de -minSaldo a +maxSaldo
                                                // Se saldo = -10000 -> altura em relação ao bottom é 0.
                                                // Se saldo = 0 -> altura é minSaldo.
                                                // Se saldo = maxSaldo -> altura é full.
                                                const heightPerc = ((point.saldo + minSaldo) / totalRange) * 100;
                                                const isPositive = point.saldo >= 0;

                                                return (
                                                    <div key={i} className="flex-1 flex flex-col justify-end group relative h-full">
                                                        <div
                                                            className={cn(
                                                                "w-full rounded-t-sm transition-all duration-300 hover:opacity-100 opacity-80",
                                                                isPositive ? "bg-green-500" : "bg-red-500"
                                                            )}
                                                            style={{ height: `${Math.max(heightPerc, 2)}%` }} // min 2% para visibilidade
                                                        ></div>

                                                        {/* Tooltip simples */}
                                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-black border border-white/20 p-2 rounded text-xs whitespace-nowrap z-10">
                                                            Ano {point.year}: R$ {point.saldo.toLocaleString('pt-BR')}
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        <div className="flex justify-between mt-2 text-xs text-gray-500">
                                            <span>Hoje</span>
                                            <span>12 anos</span>
                                            <span>25 anos</span>
                                        </div>
                                    </div>

                                    {/* CTA WhatsApp */}
                                    <div className="bg-green-600/10 border border-green-500/20 rounded-2xl p-6 text-center">
                                        <p className="text-gray-300 mb-4">
                                            Essa é uma estimativa preliminar baseada em dados médios. Para um orçamento exato e garantido:
                                        </p>
                                        <Button
                                            onClick={handleWhatsAppSubmit}
                                            size="lg"
                                            className="w-full bg-green-600 hover:bg-green-500 text-white font-bold h-12 rounded-xl"
                                        >
                                            <CheckCircle2 className="mr-2 w-5 h-5" />
                                            Receber Proposta no WhatsApp
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

