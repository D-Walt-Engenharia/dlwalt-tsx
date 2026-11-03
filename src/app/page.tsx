import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { About } from "@/components/About";
import { Projects } from "@/components/Projects";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { AppShowcase } from "@/components/AppShowcase";
import { AffiliateSection } from "@/components/AffiliateSection";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";

import { COMPANY_INFO } from "@/lib/data/company";
import { TESTIMONIALS } from "@/lib/constants/testimonials";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "name": COMPANY_INFO.name,
        "image": "https://www.dwalt.net/logo-branca.svg",
        "description": COMPANY_INFO.description,
        "telephone": COMPANY_INFO.contact.whatsapp,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Ariquemes", // Main unit
          "addressRegion": "RO",
          "addressCountry": "BR",
          "streetAddress": COMPANY_INFO.units[0].address
        },
        "url": "https://www.dwalt.net",
        "priceRange": "$$$",
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday"
          ],
          "opens": "08:00",
          "closes": "18:00"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "5.0",
          "reviewCount": TESTIMONIALS.length.toString()
        },
        "review": TESTIMONIALS.map(t => ({
          "@type": "Review",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": t.stars,
            "bestRating": "5"
          },
          "author": {
            "@type": "Person",
            "name": t.name
          },
          "reviewBody": t.testimonial
        }))
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Como funciona a energia solar à noite?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "À noite, seus painéis não geram energia. No entanto, se você estiver conectado à rede elétrica (On-Grid), você utilizará a energia da concessionária. O grande benefício é o sistema de compensação: o excedente gerado durante o dia é injetado na rede e vira créditos para abater o consumo noturno."
            }
          },
          {
            "@type": "Question",
            "name": "Qual é o tempo de retorno do investimento (Payback)?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Em média, o retorno do investimento para sistemas residenciais e comerciais em Rondônia gira em torno de 2,5 a 4 anos. Considerando a vida útil do sistema de mais de 25 anos, você terá mais de duas décadas de 'lucro' com a energia gerada."
            }
          },
          {
            "@type": "Question",
            "name": "Os painéis precisam de muita manutenção?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "A manutenção é mínima e consiste basicamente na limpeza dos módulos para garantir a máxima eficiência. Recomendamos uma limpeza a cada 6 meses ou 1 ano, dependendo da poeira do local. O sistema em si é muito robusto e durável."
            }
          },
          {
            "@type": "Question",
            "name": "Como funciona o financiamento?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Trabalhamos com diversas linhas de financiamento bancário específicas para energia solar (como Santander, BV, Solfácil). Muitas vezes, é possivel trocar o valor da sua conta de luz pela parcela do financiamento, sem descapitalizar."
            }
          },
          {
            "@type": "Question",
            "name": "O que acontece em dias nublados ou chuva?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "O sistema continua gerando energia, porém em menor intensidade do que em dias de sol pleno. A tecnologia fotovoltaica funciona com a radiação solar, que atravessa as nuvens. O dimensionamento do seu projeto já leva em consideração a média climática da região para garantir a geração anual esperada."
            }
          }
        ]
      }
    ]
  };

  return (
    <main className="min-h-screen">
      <JsonLd data={jsonLd} />
      <Header />
      <Hero />
      <About />
      <Services />
      <Projects />
      <Testimonials />
      <FAQ />
      <AppShowcase />
      <AffiliateSection />
      <Contact />
      <Footer />
    </main>
  );
}
