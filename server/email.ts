import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST ?? "mail.nutricionistajelena.ba",
	port: Number(process.env.SMTP_PORT) || 465,
	secure: true,
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS,
	},
});

const from = process.env.SMTP_USER ?? "planishrane@nutricionistajelena.ba";

export async function sendContactEmail(params: {
	to: string;
	name: string;
	email: string;
	subject: string;
	message: string;
}): Promise<void> {
	await transporter.sendMail({
		from,
		to: params.to,
		subject: `[Kontakt] ${params.subject}`,
		text: [
			`Ime: ${params.name}`,
			`Email: ${params.email}`,
			"",
			"Poruka:",
			params.message,
		].join("\n"),
	});
}

export async function sendComingSoonNotification(params: {
	to: string;
	email: string;
}): Promise<void> {
	const date = new Date().toLocaleString("bs-BA");
	await transporter.sendMail({
		from,
		to: params.to,
		subject: "Coming soon prijava – Nutricionista Jelena Matijaš",
		text: `Nova prijava za obavijest kada platforma bude dostupna.\n\nEmail: ${params.email}\nDatum: ${date}`,
	});
}

export async function sendNewsletterNotification(params: {
	to: string;
	email: string;
}): Promise<void> {
	const date = new Date().toLocaleString("bs-BA");
	await transporter.sendMail({
		from,
		to: params.to,
		subject: "Newsletter prijava – Nutricionista Jelena Matijaš",
		text: `Nova prijava na newsletter.\n\nEmail: ${params.email}\nDatum: ${date}`,
	});
}
