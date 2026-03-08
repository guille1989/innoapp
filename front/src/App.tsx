import { type ChangeEvent, type FormEvent, useState } from "react";
import { motion } from "framer-motion";
import {
  BrainCircuit,
  Check,
  CircleHelp,
  Database,
  Network,
  Radar,
  Server,
  ShieldCheck,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./components/ui/accordion";
import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { Toaster } from "./components/ui/toaster";
import { cn } from "./lib/utils";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";
const HERO_LOGO_SRC = "/images/InnoApp%20-%20Logotipo%20-%20vector.svg";
const ORB_LOGO_SRC = "/images/InnoApp%20-%20Isotipo%20-%20vector.svg";

type Feature = {
  title: string;
  description: string;
  icon: LucideIcon;
};

type PricingPlan = {
  name: string;
  badge?: string;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
};

type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

type FAQItem = {
  id: string;
  question: string;
  answer: string;
};

type ContactForm = {
  name: string;
  email: string;
  message: string;
};

const features: Feature[] = [
  {
    title: "Arquitectura cloud-native",
    description:
      "Infraestructura escalable y distribuida disenada para operar 24/7 sin interrupciones.",
    icon: Server,
  },
  {
    title: "Integracion omnicanal",
    description:
      "Conectamos todas tus fuentes de datos en un ecosistema unificado y accesible globalmente.",
    icon: Network,
  },
  {
    title: "Observabilidad en tiempo real",
    description:
      "Supervision continua del rendimiento, flujos y metricas criticas, siempre disponible.",
    icon: Radar,
  },
  {
    title: "Gobierno y seguridad avanzada",
    description:
      "Control total del dato con trazabilidad, permisos granulares y cumplimiento enterprise.",
    icon: ShieldCheck,
  },
  {
    title: "Procesamiento instantaneo",
    description:
      "Pipelines optimizados para analisis en tiempo real y decisiones inmediatas.",
    icon: Zap,
  },
  {
    title: "IA siempre conectada",
    description:
      "Modelos inteligentes desplegados sobre datos vivos, listos para generar impacto constante.",
    icon: BrainCircuit,
  },
];

const steps: Array<{
  phase: string;
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    phase: "Fase 01",
    title: "Integramos y estructuramos tus datos",
    description:
      "Unificamos tus fuentes en una arquitectura segura y escalable con pipelines cloud-native listos para crecer.",
    icon: Database,
  },
  {
    phase: "Fase 02",
    title: "Gobernamos y optimizamos",
    description:
      "Calidad, trazabilidad y seguridad end-to-end. Automatizamos validaciones y control para datos confiables.",
    icon: ShieldCheck,
  },
  {
    phase: "Fase 03",
    title: "Activamos inteligencia",
    description:
      "Convertimos datos en decisiones con IA y analitica avanzada: casos de uso, modelos y activacion medible.",
    icon: BrainCircuit,
  },
];

const plans: PricingPlan[] = [
  {
    name: "Data Foundation",
    badge: "Inicio",
    description:
      "Arquitectura base para centralizar y estructurar tus datos con seguridad y control.",
    features: [
      "Integracion de fuentes clave",
      "Pipelines iniciales y modelado",
      "Gobierno basico del dato",
    ],
    cta: "Solicitar diagnostico",
  },
  {
    name: "Data Acceleration",
    description:
      "Observabilidad y automatizacion avanzada para operar en tiempo real con datos confiables.",
    features: [
      "Monitoreo en tiempo real 24/7",
      "Calidad y trazabilidad end-to-end",
      "Alertas y metricas accionables",
    ],
    cta: "Hablar con un especialista",
    popular: true,
  },
  {
    name: "AI-Driven Enterprise",
    badge: "Enterprise",
    description:
      "Infraestructura completa + IA aplicada con soporte dedicado y cumplimiento enterprise.",
    features: [
      "Modelos predictivos y analitica avanzada",
      "SLA dedicado",
      "Seguridad enterprise",
    ],
    cta: "Contactar ventas",
  },
];

const testimonials: Testimonial[] = [
  {
    quote:
      "Durante años operamos con información fragmentada. Pensábamos que entendíamos el negocio, hasta que vimos los datos completos. InnoApp nos dio visibilidad 360°. Ahora cada decisión está respaldada por datos reales y medibles.",
    name: "Alejandro Torres",
    role: "CEO, Grupo Empresarial",
  },
  {
    quote:
      "Centralizamos todas nuestras fuentes en una arquitectura moderna y redujimos un 38% los tiempos de análisis. Ahora las decisiones se toman en tiempo real.",
    name: "Laura Méndez",
    role: "Chief Data Officer, Helio Group",
  },
  {
    quote:
      "Pasamos de datos dispersos y poco confiables a un ecosistema gobernado y trazable. Hoy tenemos visibilidad total y control sobre cada flujo.",
    name: "Carlos Ortega",
    role: "COO, Quanta Systems",
  },
  {
    quote:
      "Activamos modelos predictivos sobre nuestros propios datos y mejoramos un 27% nuestra eficiencia operativa en seis meses.",
    name: "Elena Campos",
    role: "VP Strategy, NexoTech",
  },
];

const faqItems: FAQItem[] = [
  {
    id: "faq-1",
    question: "Cuanto tarda la implementacion inicial?",
    answer:
      "La mayoria de equipos se conecta y activa los primeros flujos en menos de una semana con soporte guiado.",
  },
  {
    id: "faq-2",
    question: "Necesito conocimientos tecnicos para usar InnoApp?",
    answer:
      "No. La interfaz esta pensada para negocio y producto, con plantillas y reglas visuales faciles de usar.",
  },
  {
    id: "faq-3",
    question: "Puedo integrar herramientas existentes?",
    answer:
      "Si. InnoApp ofrece conectores listos para usar y API para integraciones personalizadas.",
  },
  {
    id: "faq-4",
    question: "Como manejan la seguridad de datos?",
    answer:
      "Aplicamos cifrado en transito, controles de acceso por rol y auditoria para cada cambio relevante.",
  },
];

const sectionTransition = {
  duration: 0.6,
  ease: [0.22, 1, 0.36, 1] as const,
};

const sectionHeadingClass =
  "mb-3 text-3xl font-semibold text-white md:text-4xl";

function App() {
  const [formData, setFormData] = useState<ContactForm>({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange =
    (field: keyof ContactForm) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleContactSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const payload = (await response.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
      } | null;

      if (!response.ok || !payload?.ok) {
        throw new Error(payload?.error ?? "No se pudo enviar el mensaje");
      }

      toast.success("Mensaje enviado", {
        description: "Te contactaremos en menos de 24 horas.",
      });
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Ocurrio un error inesperado. Intentalo nuevamente.";
      toast.error("Error al enviar", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative overflow-x-clip">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-aurora"
        aria-hidden="true"
      />

      <main>
        <section id="hero" className="relative container overflow-hidden py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...sectionTransition, delay: 0.06 }}
            className="relative z-10 -mt-[100px] mb-10 flex justify-center md:mb-14"
          >
            <img
              src={HERO_LOGO_SRC}
              alt="InnoApp logotipo"
              className="h-auto w-[min(90vw,740px)] drop-shadow-[0_20px_42px_rgba(140,244,238,0.38)]"
              loading="eager"
              decoding="async"
            />
          </motion.div>

          <div className="orb" aria-hidden="true"></div>

          <div className="orb-inner" aria-hidden="true"></div>

          <div className="orb-inner-2" aria-hidden="true"></div>

          <div className="orb-logo" aria-hidden="true">
            <img
              src={ORB_LOGO_SRC}
              alt=""
              className="orb-logo-img"
              loading="eager"
              decoding="async"
            />
          </div>

          <div className="relative z-10 flex justify-center -mt-[50px]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={sectionTransition}
              className="mx-auto max-w-3xl space-y-7 text-center"
            >
              <div className="space-y-4">
                <h1 className="heading-glow text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                  Tu ventaja competitiva empieza en tus datos.
                </h1>
                <p className="mx-auto max-w-xl text-base leading-relaxed text-brand-light/85 sm:text-lg">
                  Diseñamos y operamos infraestructuras de datos listas para IA.
                  Data as a Service para empresas que toman decisiones con
                  inteligencia.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg">
                  <a href="#contact">Solicitar demo</a>
                </Button>
                <Button asChild size="lg" variant="secondary">
                  <a href="#pricing">Ver planes</a>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        <motion.section
          id="features"
          className="container py-16 md:py-24"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={sectionTransition}
        >
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-brand-primary/80">
              CAPACIDADES
            </p>
            <h2 className={sectionHeadingClass}>
              Infraestructura de datos siempre activa
            </h2>
            <p className="text-brand-light/80">
              Monitorea, analiza y activa tus datos en tiempo real, desde
              cualquier lugar y en todo momento.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ ...sectionTransition, delay: index * 0.04 }}
              >
                <Card className="h-full border-brand-primary/25 bg-gradient-to-b from-brand-dark2/75 to-brand-dark/80 transition-all hover:-translate-y-1 hover:border-brand-primary/45 hover:shadow-glow">
                  <CardHeader className="space-y-4">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-brand-primary/35 bg-brand-dark/70 text-brand-primary">
                      <feature.icon aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <CardTitle className="text-2xl leading-tight">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed text-brand-light/85">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          id="how-it-works"
          className="container py-16 md:py-24"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={sectionTransition}
        >
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-brand-primary/80">
              HOW IT WORKS
            </p>
            <h2 className={sectionHeadingClass}>
              Como construimos tu ecosistema de datos
            </h2>
            <p className="text-brand-light/80">
              De datos dispersos a inteligencia accionable, en tres fases.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {steps.map((step) => (
              <Card
                key={step.title}
                className="h-full border-brand-primary/25 bg-gradient-to-b from-brand-dark2/75 to-brand-dark/80 transition-all hover:-translate-y-1 hover:border-brand-primary/45 hover:shadow-glow"
              >
                <CardHeader className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-brand-primary/35 bg-brand-dark/70 text-brand-primary">
                      <step.icon aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <span className="rounded-full border border-brand-primary/25 bg-brand-dark/70 px-3 py-1 text-xs font-medium uppercase tracking-[0.12em] text-brand-light/80">
                      {step.phase}
                    </span>
                  </div>
                  <CardTitle className="text-2xl leading-tight">
                    {step.title}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed text-brand-light/85">
                    {step.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </motion.section>

        <motion.section
          id="pricing"
          className="container py-16 md:py-24"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={sectionTransition}
        >
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-brand-primary/80">
              MODELOS DE SERVICIO
            </p>
            <h2 className={sectionHeadingClass}>
              Planes adaptados a tu infraestructura de datos
            </h2>
            <p className="text-brand-light/80">
              Desde la base de datos hasta ecosistemas AI-ready con monitoreo en
              tiempo real, 24/7 y desde cualquier lugar.
            </p>
            <p className="mt-2 text-xs text-brand-light/65">
              Precios personalizados segun volumen, complejidad e integracion.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={cn(
                  "relative h-full border-brand-primary/25 bg-gradient-to-b from-brand-dark2/75 to-brand-dark/80 transition-all hover:-translate-y-1 hover:border-brand-primary/45 hover:shadow-glow",
                  plan.popular && "border-brand-primary/50 shadow-glow",
                )}
              >
                {plan.popular && (
                  <span className="absolute right-5 top-5 rounded-full bg-brand-primary px-3 py-1 text-xs font-semibold text-brand-dark">
                    Mas popular
                  </span>
                )}
                {!plan.popular && plan.badge && (
                  <span className="absolute right-5 top-5 rounded-full border border-brand-primary/30 bg-brand-dark/70 px-3 py-1 text-xs font-semibold text-brand-light/85">
                    {plan.badge}
                  </span>
                )}

                <CardHeader className="space-y-4">
                  <CardTitle className="text-2xl leading-tight">
                    {plan.name}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed text-brand-light/85">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-brand-light/85">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <Check
                          className="h-4 w-4 text-brand-primary"
                          aria-hidden="true"
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={plan.popular ? "default" : "secondary"}
                    className="mt-8 w-full"
                    aria-label={`${plan.cta} para ${plan.name}`}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.section>

        <motion.section
          id="testimonials"
          className="container py-16 md:py-24"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={sectionTransition}
        >
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-brand-primary/80">
              Testimonials
            </p>
            <h2 className={sectionHeadingClass}>
              Impacto real impulsado por datos
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="h-full">
                <CardHeader className="space-y-5">
                  <CircleHelp
                    className="h-6 w-6 text-brand-primary/80"
                    aria-hidden="true"
                  />
                  <CardDescription className="text-base leading-relaxed text-brand-light/90">
                    "{testimonial.quote}"
                  </CardDescription>
                  <div>
                    <CardTitle className="text-lg">
                      {testimonial.name}
                    </CardTitle>
                    <p className="text-sm text-brand-light/65">
                      {testimonial.role}
                    </p>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </motion.section>

        <motion.section
          id="faq"
          className="container py-16 md:py-24"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={sectionTransition}
        >
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-brand-primary/80">
              FAQ
            </p>
            <h2 className={sectionHeadingClass}>Preguntas frecuentes</h2>
          </div>

          <div className="mx-auto max-w-3xl space-y-3">
            <Accordion type="single" collapsible className="space-y-3">
              {faqItems.map((item) => (
                <AccordionItem key={item.id} value={item.id}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </motion.section>

        <motion.section
          id="contact"
          className="container py-16 pb-24 md:py-24"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={sectionTransition}
        >
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="glass-panel p-8">
              <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-brand-primary/80">
                Call to action
              </p>
              <h2 className="mb-4 text-3xl font-semibold text-white md:text-4xl">
                Listo para escalar con InnoApp?
              </h2>
              <p className="max-w-xl text-brand-light/85">
                Solicita una demo personalizada y descubre como automatizar tus
                operaciones con una experiencia clara, moderna y eficiente.
              </p>
            </div>

            <Card className="border-brand-primary/25 bg-brand-dark2/78 p-6">
              <form
                onSubmit={handleContactSubmit}
                className="space-y-4"
                aria-label="Formulario de contacto"
              >
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-brand-light"
                  >
                    Nombre
                  </label>
                  <Input
                    id="name"
                    name="name"
                    maxLength={80}
                    required
                    placeholder="Tu nombre"
                    value={formData.name}
                    onChange={handleInputChange("name")}
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-brand-light"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    maxLength={120}
                    required
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={handleInputChange("email")}
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="text-sm font-medium text-brand-light"
                  >
                    Mensaje
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    maxLength={2000}
                    required
                    placeholder="Cuentanos sobre tu equipo y objetivos."
                    value={formData.message}
                    onChange={handleInputChange("message")}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
                >
                  {isSubmitting ? "Enviando..." : "Enviar mensaje"}
                </Button>
              </form>
            </Card>
          </div>
        </motion.section>
      </main>

      <footer className="border-t border-brand-primary/15 bg-brand-dark/85 py-8">
        <div className="container flex flex-col items-center justify-between gap-4 text-sm text-brand-light/75 md:flex-row">
          <p>&copy; InnoApp</p>
          <nav className="flex items-center gap-5" aria-label="Footer links">
            <a
              href="#features"
              className="transition-colors hover:text-brand-primary"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="transition-colors hover:text-brand-primary"
            >
              Pricing
            </a>
            <a
              href="#faq"
              className="transition-colors hover:text-brand-primary"
            >
              FAQ
            </a>
            <a
              href="#contact"
              className="transition-colors hover:text-brand-primary"
            >
              Contacto
            </a>
          </nav>
        </div>
      </footer>

      <Toaster />
    </div>
  );
}

export default App;
