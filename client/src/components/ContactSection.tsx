import { useState, useRef } from "react"
import { motion } from "framer-motion"
import {
	Mail,
	Phone,
	MapPin,
	Send,
	ClipboardList,
	TrendingDown,
	Dumbbell,
	Wheat,
	HeartPulse,
} from "lucide-react"
import { useAnimateOnScroll } from "@/hooks/useAnimateOnScroll"
import { useToast } from "@/hooks/use-toast"
import { apiRequest } from "@/lib/queryClient"

interface ContactFormData {
	name: string
	email: string
	subject: string
	message: string
	privacyAgreed: boolean
	/** Honeypot: bots fill this, humans don't see it */
	website?: string
}

const contactInfo = [
	{ icon: Mail, label: "Email", value: "konsultacije@nutricionistajelena.ba" },
	{ icon: Phone, label: "Telefon", value: "Po dogovoru" },
	{ icon: MapPin, label: "Lokacija", value: "Banja Luka, BiH" },
]

const benefits = [
	{
		icon: ClipboardList,
		title: "Personalizovan plan ishrane",
		description:
			"prilagođen vašim ciljevima, zdravstvenom stanju i načinu života",
	},
	{
		icon: TrendingDown,
		title: "Održivo mršavljenje",
		description: "bez gladovanja, jojo efekta i striktnih dijeta",
	},
	{
		icon: Dumbbell,
		title: "Zdravo debljanje",
		description:
			"povećanje tjelesne mase pravilnom ishranom i treningom",
	},
	{
		icon: Wheat,
		title: "Bezglutenska ishrana",
		description: "planovi za celijakiju i intoleranciju na gluten",
	},
	{
		icon: HeartPulse,
		title: "Kontinuirana podrška",
		description:
			"praćenje napretka i prilagođavanje plana vašim potrebama",
	},
]

export default function ContactSection() {
	const [formData, setFormData] = useState<ContactFormData>({
		name: "",
		email: "",
		subject: "",
		message: "",
		privacyAgreed: false,
		website: "",
	})

	const [isSubmitting, setIsSubmitting] = useState(false)
	const { toast } = useToast()
	const formMountedAtRef = useRef<number>(Date.now())

	const { ref: headerRef, inView: headerInView } = useAnimateOnScroll()
	const { ref: contentRef, inView: contentInView } = useAnimateOnScroll(0.3)

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value, type } = e.target

		if (type === "checkbox") {
			const checkbox = e.target as HTMLInputElement
			setFormData((prev) => ({
				...prev,
				[name]: checkbox.checked,
			}))
		} else {
			setFormData((prev) => ({
				...prev,
				[name]: value,
			}))
		}
	}

	// Honeypot: visually hidden, aria-hidden, tabIndex -1 - bots fill it, humans never see it
	const honeypotStyles =
		"absolute -left-[9999px] w-px h-px opacity-0 pointer-events-none"

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (formData.website?.trim()) return
		const minTimeMs = 3000
		if (Date.now() - formMountedAtRef.current < minTimeMs) return
		setIsSubmitting(true)
		try {
			await apiRequest("POST", "/api/contact", {
				name: formData.name,
				email: formData.email,
				subject: formData.subject,
				message: formData.message,
				privacyAgreed: formData.privacyAgreed,
			})
			toast({
				title: "Uspešno!",
				description: "Poruka je poslata. Javićemo vam se uskoro.",
			})
			setFormData({
				name: "",
				email: "",
				subject: "",
				message: "",
				privacyAgreed: false,
				website: "",
			})
		} catch (err) {
			const message =
				err instanceof Error ? err.message : "Došlo je do greške. Pokušajte ponovo."
			toast({
				title: "Greška",
				description: message,
				variant: "destructive",
			})
		} finally {
			setIsSubmitting(false)
		}
	}

	const inputClasses =
		"rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 transition-all duration-200 focus:border-[#1F7A5C] focus:outline-none focus:ring-2 focus:ring-[#1F7A5C]/20"

	return (
		<section
			id="contact"
			aria-label="Kontakt forma"
			className="relative w-full overflow-hidden bg-[#62B895]"
		>
			{/* Decorative background shapes */}
			<div className="pointer-events-none absolute inset-0">
				<div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/10 opacity-50" />
				<div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-white/10 opacity-50" />
			</div>

			<div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-24">
				{/* Header */}
				<motion.div
					ref={headerRef}
					initial={{ opacity: 0, y: 20 }}
					animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
					transition={{ duration: 0.6 }}
					className="mb-12 text-center"
				>
					<span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.2em] text-white">
						KONTAKT
					</span>
					<h2 className="text-balance text-3xl font-bold text-white font-poppins sm:text-4xl">
						Pošalji poruku
					</h2>
					<p className="mx-auto mt-4 max-w-xl text-pretty text-base leading-relaxed text-white">
						Za sve informacije o proizvodima i uslugama ispuni kontakt formu ili
						mi se javi direktno putem e-maila.
					</p>
				</motion.div>

				{/* Contact info pills */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
					transition={{ duration: 0.6, delay: 0.1 }}
					className="mb-10 flex flex-wrap items-center justify-center gap-3"
				>
					{contactInfo.map((info) => (
						<div
							key={info.label}
							className="flex items-center gap-2.5 rounded-full bg-white px-5 py-2.5 shadow-md border border-white/50"
						>
							<info.icon className="h-4 w-4 text-[#1a5f4a]" />
							<span className="text-sm font-medium text-[#1a5f4a]">
								{info.value}
							</span>
						</div>
					))}
				</motion.div>

				{/* Main content */}
				<motion.div
					ref={contentRef}
					initial={{ opacity: 0, y: 20 }}
					animate={contentInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
					transition={{ duration: 0.6, delay: 0.3 }}
					className="grid grid-cols-1 gap-6 lg:grid-cols-5"
				>
					{/* Form card */}
					<div className="rounded-2xl bg-white p-6 shadow-xl shadow-black/5 sm:p-8 lg:col-span-3">
						<div className="mb-6">
							<h3 className="text-lg font-bold text-gray-900">
								Pošaljite nam poruku
							</h3>
							<p className="mt-1 text-sm text-gray-600">
								Odgovaramo u roku od 24 sata
							</p>
						</div>
						<form
							id="contact-form"
							className="flex flex-col gap-5"
							onSubmit={handleSubmit}
						>
							{/* Honeypot - invisible to humans, bots fill it */}
							<div className={honeypotStyles} aria-hidden>
								<label htmlFor="website">Web stranica (ostavite prazno)</label>
								<input
									id="website"
									name="website"
									type="text"
									tabIndex={-1}
									autoComplete="off"
									value={formData.website ?? ""}
									onChange={handleChange}
								/>
							</div>
							<div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
								<div className="flex flex-col gap-2">
									<label
										htmlFor="name"
										className="text-sm font-medium text-gray-900"
									>
										Ime
									</label>
									<input
										id="name"
										name="name"
										type="text"
										placeholder="Unesite svoje ime"
										value={formData.name}
										onChange={handleChange}
										required
										className={inputClasses}
									/>
								</div>
								<div className="flex flex-col gap-2">
									<label
										htmlFor="email"
										className="text-sm font-medium text-gray-900"
									>
										Email
									</label>
									<input
										id="email"
										name="email"
										type="email"
										placeholder="Unesite svoj email"
										value={formData.email}
										onChange={handleChange}
										required
										className={inputClasses}
									/>
								</div>
							</div>

							<div className="flex flex-col gap-2">
								<label
									htmlFor="subject"
									className="text-sm font-medium text-gray-900"
								>
									Tema
								</label>
								<input
									id="subject"
									name="subject"
									type="text"
									placeholder="Tema poruke"
									value={formData.subject}
									onChange={handleChange}
									required
									className={inputClasses}
								/>
							</div>

							<div className="flex flex-col gap-2">
								<label
									htmlFor="message"
									className="text-sm font-medium text-gray-900"
								>
									Poruka
								</label>
								<textarea
									id="message"
									name="message"
									rows={5}
									placeholder="Vaša poruka"
									value={formData.message}
									onChange={handleChange}
									required
									className={`resize-none ${inputClasses}`}
								/>
							</div>

							<label className="group flex cursor-pointer items-start gap-3">
								<input
									type="checkbox"
									id="privacy"
									name="privacyAgreed"
									checked={formData.privacyAgreed}
									onChange={handleChange}
									required
									className="mt-0.5 h-4 w-4 rounded border-input accent-primary"
								/>
								<span className="text-sm leading-relaxed text-gray-700">
									Slažem se sa{" "}
									<a
										href="/privacy"
										className="text-[#1F7A5C] font-medium underline underline-offset-2 hover:text-[#1a5f4a]"
									>
										Pravilima Privatnosti
									</a>{" "}
									i pristajem na kontaktiranje.
								</span>
							</label>

							<button
								type="submit"
								disabled={isSubmitting}
								className="flex items-center justify-center gap-2 rounded-full bg-[#1a5f4a] px-6 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#145042] hover:shadow-lg active:scale-[0.98] disabled:opacity-70"
							>
								<Send className="h-4 w-4" />
								{isSubmitting ? "Šaljem..." : "Pošaljite Poruku"}
							</button>
						</form>
					</div>

					{/* Benefits card */}
					<div className="rounded-2xl bg-white p-6 shadow-xl shadow-black/5 sm:p-8 lg:col-span-2">
						<h3 className="mb-4 text-xl font-bold text-gray-900">
							Zašto Nutricionista?
						</h3>
						<div className="flex flex-col gap-4">
							{benefits.map((benefit) => (
								<div
									key={benefit.title}
									className="group flex items-start gap-3.5 rounded-lg p-2.5 transition-colors duration-200 hover:bg-gray-50"
								>
									<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1F7A5C]/15">
										<benefit.icon className="h-[18px] w-[18px] text-[#1F7A5C]" />
									</div>
									<div className="flex flex-col gap-0.5">
										<span className="text-sm font-semibold leading-snug text-gray-900">
											{benefit.title}
										</span>
										<span className="text-sm leading-relaxed text-gray-600">
											{benefit.description}
										</span>
									</div>
								</div>
							))}
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	)
}
