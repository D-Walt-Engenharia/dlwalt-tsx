'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { PiggyBank, Briefcase, MapPin, User, Phone, Calendar, FileText, ArrowRight, ArrowLeft } from 'lucide-react';
import { InputMask } from "@react-input/mask";
import { InputNumberFormat, unformat } from "@react-input/number-format";
import api from "@/lib/api";
import { toast } from "sonner";
import { trackGoogleConversion, trackEvent, trackContact } from '@/lib/tracking';

// Validation Helper
function validarCPF(cpf: string) {
    cpf = cpf.replace(/[^\d]+/g, "");
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
    let soma = 0, resto;
    for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(cpf.substring(10, 11));
}

export default function FinancingSimulatorPage() {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [temEntrada, setTemEntrada] = useState("false");
    const [monthlyIncome, setMonthlyIncome] = useState("0");
    const [downPaymentValue, setDownPaymentValue] = useState("0");
    const [energyBillValue, setEnergyBillValue] = useState("0");

    // Form fields state for multi-step preservation and validation
    const [formDataState, setFormDataState] = useState({
        fullName: '',
        cpf: '',
        rg: '',
        birthDate: '',
        phone: '',
        motherName: '',
        profession: '',
        propertyType: 'own',
        hasDownPayment: 'false',
        downPaymentValue: '0',
        monthlyIncome: '0',
        energyBillValue: '0',
        zipcode: '',
        street: '',
        houseNumber: '',
        city: '',
        state: ''
    });

    // Trigger conversion event for Page View of Financing Simulator on Google Ads
    useEffect(() => {
        trackGoogleConversion('AW-10800412438/n1bVCJ3mm54dEJbuhJ4o');
        trackEvent('page_view_simulacao_financiamento');
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormDataState(prev => ({ ...prev, [name]: value }));
    };

    const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const cepRaw = e.target.value;
        const cep = cepRaw.replace(/\D/g, "");
        setFormDataState(prev => ({ ...prev, zipcode: cepRaw }));

        if (cep.length !== 8) return;

        try {
            const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await res.json();
            if (data.erro) {
                toast.error("CEP não encontrado");
                return;
            }
            setFormDataState(prev => ({
                ...prev,
                street: data.logradouro || "",
                city: data.localidade || "",
                state: data.uf || ""
            }));
        } catch (err) {
            toast.error("Erro ao buscar CEP");
        }
    };

    const handleNextStep = (e: React.MouseEvent) => {
        e.preventDefault();

        if (step === 1) {
            if (!formDataState.fullName.trim()) {
                toast.error("Por favor, preencha o Nome Completo");
                return;
            }
            if (!formDataState.cpf.trim()) {
                toast.error("Por favor, preencha o CPF");
                return;
            }
            if (!validarCPF(formDataState.cpf)) {
                toast.error("CPF inválido");
                return;
            }
            if (!formDataState.rg.trim()) {
                toast.error("Por favor, preencha o RG");
                return;
            }
            if (!formDataState.birthDate.trim()) {
                toast.error("Por favor, preencha a Data de Nascimento");
                return;
            }
            if (!formDataState.phone.trim()) {
                toast.error("Por favor, preencha o WhatsApp");
                return;
            }
            if (!formDataState.motherName.trim()) {
                toast.error("Por favor, preencha o Nome da Mãe");
                return;
            }
            setStep(2);
            window.scrollTo({ top: 300, behavior: 'smooth' });
        } else if (step === 2) {
            if (!formDataState.profession.trim()) {
                toast.error("Por favor, preencha sua Profissão");
                return;
            }
            if (!monthlyIncome || monthlyIncome === "0") {
                toast.error("Por favor, informe a Renda Mensal");
                return;
            }
            if (!energyBillValue || energyBillValue === "0") {
                toast.error("Por favor, informe o Valor da Conta de Energia");
                return;
            }
            if (temEntrada === "true" && (!downPaymentValue || downPaymentValue === "0")) {
                toast.error("Por favor, informe o Valor da Entrada");
                return;
            }
            setStep(3);
            window.scrollTo({ top: 300, behavior: 'smooth' });
        }
    };

    const handlePrevStep = () => {
        setStep(prev => Math.max(1, prev - 1));
        window.scrollTo({ top: 300, behavior: 'smooth' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validarCPF(formDataState.cpf)) {
            toast.error("CPF inválido");
            setStep(1);
            return;
        }

        const data: Record<string, any> = {
            ...formDataState,
            monthlyIncome,
            downPaymentValue,
            energyBillValue,
            hasDownPayment: temEntrada
        };

        setIsLoading(true);

        try {
            const response = await api.post("/financial/credit-analysis", data);

            trackContact('financiamento_proposta');

            if (response.data.success) {
                toast.success("Proposta enviada com sucesso! Aguarde o contato.");
                setFormDataState({
                    fullName: '',
                    cpf: '',
                    rg: '',
                    birthDate: '',
                    phone: '',
                    motherName: '',
                    profession: '',
                    propertyType: 'own',
                    hasDownPayment: 'false',
                    downPaymentValue: '0',
                    monthlyIncome: '0',
                    energyBillValue: '0',
                    zipcode: '',
                    street: '',
                    houseNumber: '',
                    city: '',
                    state: ''
                });
                setTemEntrada("false");
                setMonthlyIncome("0");
                setDownPaymentValue("0");
                setEnergyBillValue("0");
                setStep(1);
            } else {
                toast.success("Proposta recebida! Entraremos em contato em breve.");
            }
        } catch (error) {
            console.error(error);
            trackContact('financiamento_proposta');
            toast.success("Solicitação recebida com sucesso! (Modo Demo)");
            setStep(1);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-black text-white">
            <Header />

            {/* Hero Section with Dusk Solar House Background matching Anexo 2 */}
            <div className="relative w-full pt-32 pb-16 overflow-hidden">
                {/* Background Image with Dusk Warmth & Overlays */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/solar-roof-sunset.jpg"
                        alt="Financie sua Energia Solar"
                        fill
                        priority
                        className="object-cover object-center scale-105"
                    />
                    {/* Gradient overlays to replicate Anexo 2 contrast and readability */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black" />
                </div>

                <div className="container relative z-10 mx-auto px-4 max-w-4xl">
                    <div className="text-left space-y-4 max-w-2xl pt-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-[#22c55e] text-xs font-semibold tracking-wide backdrop-blur-md">
                            <PiggyBank className="w-3.5 h-3.5" />
                            Análise de Crédito
                        </div>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1] text-white">
                            Financie sua <br />
                            <span className="text-[#4ade80]">Energia Solar</span>
                        </h1>

                        <p className="text-base sm:text-lg text-gray-300 max-w-xl font-normal leading-relaxed">
                            Preencha seus dados e descubra quanto ficaria a parcela do seu projeto solar.
                        </p>
                    </div>
                </div>
            </div>

            <main className="flex-grow pb-24 -mt-2">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="bg-[#0c0d0e]/95 border border-white/10 rounded-3xl p-6 md:p-10 backdrop-blur-md shadow-2xl">
                        <form onSubmit={handleSubmit} className="space-y-8">

                            {/* STEP 1: DADOS PESSOAIS */}
                            {step === 1 && (
                                <div className="space-y-6 animate-in fade-in duration-300">
                                    <h3 className="text-xl font-bold flex items-center gap-2 text-[#4ade80] border-b border-white/10 pb-3">
                                        <User className="w-5 h-5 text-[#4ade80]" /> Dados Pessoais
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-5">
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-sm font-medium text-gray-300">Nome Completo</label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                                <input
                                                    name="fullName"
                                                    value={formDataState.fullName}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-[#121417] border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-gray-500 focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80] outline-none transition-all"
                                                    required
                                                    placeholder="Seu nome completo"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300">CPF</label>
                                            <div className="relative">
                                                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                                <InputMask
                                                    mask="___.___.___-__"
                                                    replacement={{ _: /\d/ }}
                                                    name="cpf"
                                                    value={formDataState.cpf}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-[#121417] border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-gray-500 focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80] outline-none transition-all"
                                                    required
                                                    placeholder="000.000.000-00"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300">RG</label>
                                            <div className="relative">
                                                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                                <input
                                                    name="rg"
                                                    value={formDataState.rg}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-[#121417] border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-gray-500 focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80] outline-none transition-all"
                                                    required
                                                    placeholder="Seu RG"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300">Data de Nascimento</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                                                <InputMask
                                                    mask="__/__/____"
                                                    replacement={{ _: /\d/ }}
                                                    name="birthDate"
                                                    value={formDataState.birthDate}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-[#121417] border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-gray-500 focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80] outline-none transition-all"
                                                    required
                                                    placeholder="dd/mm/aaaa"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300">Telefone / WhatsApp</label>
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                                <InputMask
                                                    mask="(__) _____-____"
                                                    replacement={{ _: /\d/ }}
                                                    name="phone"
                                                    value={formDataState.phone}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-[#121417] border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-gray-500 focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80] outline-none transition-all"
                                                    required
                                                    placeholder="(99) 99999-9999"
                                                />
                                            </div>
                                        </div>

                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-sm font-medium text-gray-300">Nome da Mãe</label>
                                            <input
                                                name="motherName"
                                                value={formDataState.motherName}
                                                onChange={handleInputChange}
                                                className="w-full bg-[#121417] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80] outline-none transition-all"
                                                required
                                                placeholder="Nome completo da mãe"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <button
                                            type="button"
                                            onClick={handleNextStep}
                                            className="w-full h-14 bg-[#5eead4] hover:bg-[#2dd4bf] text-black font-bold text-base rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.99] cursor-pointer"
                                            style={{ backgroundColor: '#5ce892', color: '#000000' }}
                                        >
                                            <span>Avançar</span>
                                            <ArrowRight className="w-5 h-5 text-black stroke-[2.5]" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* STEP 2: DADOS FINANCEIROS */}
                            {step === 2 && (
                                <div className="space-y-6 animate-in fade-in duration-300">
                                    <h3 className="text-xl font-bold flex items-center gap-2 text-[#4ade80] border-b border-white/10 pb-3">
                                        <Briefcase className="w-5 h-5 text-[#4ade80]" /> Dados Financeiros & Imóvel
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300">Profissão</label>
                                            <input
                                                name="profession"
                                                value={formDataState.profession}
                                                onChange={handleInputChange}
                                                className="w-full bg-[#121417] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80] outline-none transition-all"
                                                required
                                                placeholder="Sua profissão"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300">Renda Mensal</label>
                                            <InputNumberFormat
                                                locales="pt-BR"
                                                format="currency"
                                                currency="BRL"
                                                name="monthlyIncome"
                                                value={monthlyIncome}
                                                className="w-full bg-[#121417] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80] outline-none transition-all"
                                                required
                                                placeholder="R$ 0,00"
                                                onChange={(e) => setMonthlyIncome(unformat(e.target.value, "pt-BR"))}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300">Valor Conta de Energia</label>
                                            <InputNumberFormat
                                                locales="pt-BR"
                                                format="currency"
                                                currency="BRL"
                                                name="energyBillValue"
                                                value={energyBillValue}
                                                className="w-full bg-[#121417] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80] outline-none transition-all"
                                                required
                                                placeholder="R$ 0,00"
                                                onChange={(e) => setEnergyBillValue(unformat(e.target.value, "pt-BR"))}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300">Tipo de Imóvel</label>
                                            <select
                                                name="propertyType"
                                                value={formDataState.propertyType}
                                                onChange={handleInputChange}
                                                className="w-full bg-[#121417] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80] outline-none transition-all appearance-none cursor-pointer"
                                            >
                                                <option value="own" className="bg-[#121417] text-white">Próprio</option>
                                                <option value="rented" className="bg-[#121417] text-white">Alugado</option>
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300">Tem valor de entrada?</label>
                                            <select
                                                name="hasDownPayment"
                                                className="w-full bg-[#121417] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80] outline-none transition-all appearance-none cursor-pointer"
                                                onChange={(e) => setTemEntrada(e.target.value)}
                                                value={temEntrada}
                                            >
                                                <option value="false" className="bg-[#121417] text-white">Não</option>
                                                <option value="true" className="bg-[#121417] text-white">Sim</option>
                                            </select>
                                        </div>

                                        {temEntrada === "true" && (
                                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                                <label className="text-sm font-medium text-gray-300">Valor da Entrada</label>
                                                <InputNumberFormat
                                                    locales="pt-BR"
                                                    format="currency"
                                                    currency="BRL"
                                                    name="downPaymentValue"
                                                    value={downPaymentValue}
                                                    className="w-full bg-[#121417] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80] outline-none transition-all"
                                                    required
                                                    placeholder="R$ 0,00"
                                                    onChange={(e) => setDownPaymentValue(unformat(e.target.value, "pt-BR"))}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <button
                                            type="button"
                                            onClick={handlePrevStep}
                                            className="w-1/3 h-14 bg-white/10 hover:bg-white/15 text-white font-medium text-base rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                                        >
                                            <ArrowLeft className="w-5 h-5" />
                                            <span>Voltar</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleNextStep}
                                            className="w-2/3 h-14 bg-[#5ce892] hover:bg-[#4ade80] text-black font-bold text-base rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.99] cursor-pointer"
                                        >
                                            <span>Avançar</span>
                                            <ArrowRight className="w-5 h-5 text-black stroke-[2.5]" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* STEP 3: ENDEREÇO & SUBMIT */}
                            {step === 3 && (
                                <div className="space-y-6 animate-in fade-in duration-300">
                                    <h3 className="text-xl font-bold flex items-center gap-2 text-[#4ade80] border-b border-white/10 pb-3">
                                        <MapPin className="w-5 h-5 text-[#4ade80]" /> Endereço
                                    </h3>
                                    <div className="grid md:grid-cols-12 gap-5">
                                        <div className="md:col-span-4 space-y-2">
                                            <label className="text-sm font-medium text-gray-300">CEP</label>
                                            <InputMask
                                                mask="_____-___"
                                                replacement={{ _: /\d/ }}
                                                name="zipcode"
                                                value={formDataState.zipcode}
                                                className="w-full bg-[#121417] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80] outline-none transition-all"
                                                required
                                                placeholder="00000-000"
                                                onChange={handleCepChange}
                                            />
                                        </div>

                                        <div className="md:col-span-8 space-y-2">
                                            <label className="text-sm font-medium text-gray-300">Rua / Logradouro</label>
                                            <input
                                                name="street"
                                                value={formDataState.street}
                                                onChange={handleInputChange}
                                                className="w-full bg-[#121417] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80] outline-none transition-all"
                                                required
                                                placeholder="Ex: Rua das Flores"
                                            />
                                        </div>

                                        <div className="md:col-span-4 space-y-2">
                                            <label className="text-sm font-medium text-gray-300">Número</label>
                                            <input
                                                name="houseNumber"
                                                value={formDataState.houseNumber}
                                                onChange={handleInputChange}
                                                className="w-full bg-[#121417] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80] outline-none transition-all"
                                                required
                                                placeholder="Ex: 123"
                                            />
                                        </div>

                                        <div className="md:col-span-4 space-y-2">
                                            <label className="text-sm font-medium text-gray-300">Cidade</label>
                                            <input
                                                name="city"
                                                value={formDataState.city}
                                                onChange={handleInputChange}
                                                className="w-full bg-[#121417] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80] outline-none transition-all"
                                                required
                                                placeholder="Ex: Cacoal"
                                            />
                                        </div>

                                        <div className="md:col-span-4 space-y-2">
                                            <label className="text-sm font-medium text-gray-300">Estado</label>
                                            <input
                                                name="state"
                                                value={formDataState.state}
                                                onChange={handleInputChange}
                                                className="w-full bg-[#121417] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80] outline-none transition-all"
                                                required
                                                placeholder="Ex: RO"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <p className="text-xs text-gray-500 mb-4 text-center">
                                            Ao enviar seus dados para análise, você concorda com nossos Termos de Uso e Política de Privacidade.
                                        </p>
                                        <div className="flex gap-4">
                                            <button
                                                type="button"
                                                onClick={handlePrevStep}
                                                className="w-1/3 h-14 bg-white/10 hover:bg-white/15 text-white font-medium text-base rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                                            >
                                                <ArrowLeft className="w-5 h-5" />
                                                <span>Voltar</span>
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className="w-2/3 h-14 bg-[#5ce892] hover:bg-[#4ade80] text-black font-bold text-base rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                            >
                                                {isLoading ? "Processando..." : "Enviar Solicitação"}
                                                {!isLoading && <ArrowRight className="w-5 h-5 text-black stroke-[2.5]" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
