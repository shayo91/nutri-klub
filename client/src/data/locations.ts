/**
 * Location config for SEO local landing pages at /nutricionista-[slug].
 * Single source of truth for slugs, display names, and unique per-page content.
 */

export const LOCATION_SLUGS = [
	'sarajevo',
	'banja-luka',
	'tuzla',
	'zenica',
	'mostar',
	'prijedor',
	'bih',
] as const;

export interface LocationConfig {
	slug: string;
	name: string;
	title: string;
	metaDescription: string;
	introParagraph: string;
	clientsParagraph: string;
}

export const LOCATIONS: LocationConfig[] = [
	{
		slug: 'sarajevo',
		name: 'Sarajevo',
		title: 'Nutricionista Sarajevo | Online Savjetovanje – Jelena Matijaš',
		metaDescription:
			'Nutricionista za Sarajevo: online savjetovanje i personalizovani planovi ishrane. Konsultacije putem video poziva za stanovnike Sarajeva i okolice. Zakažite termin.',
		introParagraph:
			'Kao nutricionista dostupna stanovnicima Sarajeva i šire regije, pružam savjetovanje isključivo online — putem video poziva, bez obzira gdje se nalazite. Radim sa klijentima koji žele da unaprijede ishranu, izgube višak kilograma ili riješe nutritivne izazove, uz pristup prilagođen zauzetom životnom ritmu grada. Planovi ishrane su personalizovani i praktični za svakodnevnu primjenu.',
		clientsParagraph:
			'Brojni klijenti iz Sarajeva i okoline koriste online konsultacije da postignu svoje ciljeve — od uspješnog mršavljenja do bolje energije i kvalitetnijeg sna. Bez potrebe za putovanjem, savjetovanje je dostupno iz udobnosti vašeg doma ili ureda.',
	},
	{
		slug: 'banja-luka',
		name: 'Banja Luka',
		title: 'Nutricionista Banja Luka | Online Savjetovanje – Jelena Matijaš',
		metaDescription:
			'Nutricionista za Banju Luku: online savjetovanje i planovi ishrane. Video konsultacije za grad i regiju. Mršavljenje, debljanje i zdrava ishrana.',
		introParagraph:
			'Za sve koji traže nutricionistu u Banjoj Luci, nudim profesionalno online savjetovanje — konsultacije se odvijaju putem video poziva, tako da možete raditi sa mnom bez obzira na lokaciju. Specijalizovana sam za personalizovane planove ishrane za mršavljenje, debljanje i održavanje zdravlja, uz naglasak na održive navike i praktične savjete prilagođene vašem stilu života.',
		clientsParagraph:
			'Klijenti iz Banje Luke i Republike Srpske često mi se javljaju zbog želje za strukturiranim pristupom ishrani i redovnom podrškom. Online format omogućava kontinuitet bez obzira na vrijeme i udaljenost.',
	},
	{
		slug: 'tuzla',
		name: 'Tuzla',
		title: 'Nutricionista Tuzla | Online Savjetovanje – Jelena Matijaš',
		metaDescription:
			'Nutricionista za Tuzlu: online savjetovanje i personalizovani planovi ishrane. Video konsultacije za Tuzlu i regiju. Zakažite online termin.',
		introParagraph:
			'Stanovnicima Tuzle i Tuzlanske regije nudim nutricionističko savjetovanje u potpunosti online. Završila sam master studije nutricionizma na Tehnološkom fakultetu Univerziteta u Tuzli i radim sa klijentima širom BiH putem video poziva. Fokus je na individualnim planovima ishrane, edukaciji i dugoročnoj podršci bez potrebe za fizičkim dolaskom.',
		clientsParagraph:
			'Mnogi klijenti iz Tuzle i okolnih opština koriste moje online usluge za postizanje ciljeva vezanih za tjelesnu težinu, energiju i opće zdravlje. Savjetovanje je prilagođeno vašim obavezama i dostupno kada vam odgovara.',
	},
	{
		slug: 'zenica',
		name: 'Zenica',
		title: 'Nutricionista Zenica | Online Savjetovanje – Jelena Matijaš',
		metaDescription:
			'Nutricionista za Zenicu: online savjetovanje i planovi ishrane. Konsultacije putem interneta za Zenicu i srednju Bosnu. Zakažite konsultaciju.',
		introParagraph:
			'Ako tražite nutricionistu za Zenicu ili srednju Bosnu, savjetovanje kod mene se odvija u potpunosti online. Putem video poziva analiziram vaše navike, ciljeve i zdravstveni status te kreiram personalizovani plan ishrane. Idealno je za one koji žele stručnu podršku bez putovanja, uz fleksibilnost u terminu i mjestu konsultacije.',
		clientsParagraph:
			'Klijenti iz Zenice i srednje Bosne često koriste online format da usklade ishranu sa poslom i obitelji. Redovno praćenje i prilagodbe plana omogućavaju trajne rezultate.',
	},
	{
		slug: 'mostar',
		name: 'Mostar',
		title: 'Nutricionista Mostar | Online Savjetovanje – Jelena Matijaš',
		metaDescription:
			'Nutricionista za Mostar: online savjetovanje i planovi ishrane za Hercegovinu. Video konsultacije. Mršavljenje, debljanje, zdrava ishrana.',
		introParagraph:
			'Za stanovnike Mostara i Hercegovine nudim nutricionističko savjetovanje isključivo online. Konsultacije putem video poziva omogućavaju personalizovane planove ishrane i redovno praćenje bez obzira na to gdje se nalazite. Radim sa klijentima na ciljevima mršavljenja, debljanja i unapređenja opšteg zdravlja kroz ishranu.',
		clientsParagraph:
			'Klijenti iz Mostara i Hercegovine cijene mogućnost savjetovanja od kuće ili s posla. Online pristup omogućava konzistentnu podršku i prilagodbu plana prema napretku i životnim promjenama.',
	},
	{
		slug: 'prijedor',
		name: 'Prijedor',
		title: 'Nutricionista Prijedor | Online Savjetovanje – Jelena Matijaš',
		metaDescription:
			'Nutricionista za Prijedor: online savjetovanje i personalizovani planovi ishrane. Video konsultacije za Prijedor i regiju. Zakažite termin.',
		introParagraph:
			'Stanovnicima Prijedora i šire regije pružam profesionalno nutricionističko savjetovanje putem online konsultacija. Bez potrebe za putovanjem do ordinacije, možete dobiti personalizovani plan ishrane, analizu navika i redovnu podršku putem video poziva. Usluga je prilagođena svima koji žele ozbiljan i strukturiran pristup ishrani i zdravlju.',
		clientsParagraph:
			'Klijenti iz Prijedora i okolice koriste online savjetovanje da postignu ciljeve mršavljenja ili debljanja i da uspostave trajne zdrave navike. Kontinuitet rada održavamo bez obzira na udaljenost.',
	},
	{
		slug: 'bih',
		name: 'Bosna i Hercegovina',
		title: 'Nutricionista BiH | Online Savjetovanje za cijelu zemlju – Jelena Matijaš',
		metaDescription:
			'Nutricionista za cijelu BiH: online savjetovanje i planovi ishrane. Video konsultacije dostupne svuda u Bosni i Hercegovini. Zakažite online termin.',
		introParagraph:
			'Kao nutricionista za cijelu Bosnu i Hercegovinu radim isključivo online — savjetovanje je dostupno svima, bez obzira na grad ili regiju. Putem video poziva kreiram personalizovane planove ishrane za mršavljenje, debljanje i održavanje zdravlja. Bez fizičkog ordinacijskog prostora, fokus je na kvaliteti savjetovanja i pristupačnosti za klijente širom zemlje.',
		clientsParagraph:
			'Klijenti iz svih dijelova BiH — od većih gradova do manjih mjesta — koriste moje online usluge da unaprijede ishranu i postignu svoje ciljeve. Online format uklanja barijere udaljenosti i omogućava jednaku pristupačnost stručnoj podršci.',
	},
];

export function getLocationBySlug(slug: string): LocationConfig | undefined {
	return LOCATIONS.find((l) => l.slug === slug);
}
