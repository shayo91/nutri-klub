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
	faq: { question: string; answer: string }[];
}

export const LOCATIONS: LocationConfig[] = [
	{
		slug: 'sarajevo',
		name: 'Sarajevo',
		title: 'Nutricionista Sarajevo | Online Savjetovanje – Jelena Matijaš',
		metaDescription:
			'Nutricionista za Sarajevo: online savjetovanje i personalizovani planovi ishrane. Konsultacije putem video poziva za stanovnike Sarajeva i okolice. Zakažite termin.',
		introParagraph:
			'Kao nutricionista dostupna stanovnicima Sarajeva i šire regije, pružam savjetovanje isključivo online putem video poziva, bez obzira gdje se nalazite. Radim sa klijentima koji žele da unaprijede ishranu, izgube višak kilograma ili riješe nutritivne izazove, uz pristup prilagođen zauzetom životnom ritmu grada. Planovi ishrane su personalizovani i praktični za svakodnevnu primjenu. Svaki plan kreiram na osnovu detaljne analize vaših trenutnih navika, zdravstvenog stanja i osobnih ciljeva, uz redovnu podršku i praćenje napretka.',
		clientsParagraph:
			'Brojni klijenti iz Sarajeva i okoline koriste online konsultacije da postignu svoje ciljeve od uspješnog mršavljenja do bolje energije i kvalitetnijeg sna. Bez potrebe za putovanjem, savjetovanje je dostupno iz udobnosti vašeg doma ili ureda. Klijenti cijene fleksibilnost termina, profesionalan pristup i dugoročne rezultate koji se održavaju nakon završetka programa.',
		faq: [
			{ question: 'Koliko košta nutricionista u Sarajevu?', answer: 'Cijena online nutricionističkog savjetovanja je prilagođena tržištu Sarajeva i iznosi od 80 KM za individualne konsultacije, do 300 KM za kompletne mesečne pakete koji uključuju jelovnik, praćenje i podršku.' },
			{ question: 'Da li radite uživo u Sarajevu ili samo online?', answer: 'Savjetovanje je isključivo online putem video poziva, što omogućava veću fleksibilnost za zaposlene osobe u Sarajevu. Nemam fizičku ordinaciju u Sarajevu, ali svi klijenti iz Sarajeva i okolice dobijaju istu kvalitetu usluge putem interneta.' },
			{ question: 'Koliko brzo se vide rezultati kod pacijenata iz Sarajeva?', answer: 'Prvi rezultati su vidljivi nakon 2-3 sedmice pridržavanja plana ishrane. Značajnije promjene u težini i energiji klijenti iz Sarajeva obično primjećuju nakon 4-6 sedmica kontinuiranog rada.' },
		],
	},
	{
		slug: 'banja-luka',
		name: 'Banja Luka',
		title: 'Nutricionista Banja Luka | Online Savjetovanje – Jelena Matijaš',
		metaDescription:
			'Nutricionista za Banju Luku: online savjetovanje i planovi ishrane. Video konsultacije za grad i regiju. Mršavljenje, debljanje i zdrava ishrana.',
		introParagraph:
			'Za sve koji traže nutricionistu u Banjoj Luci, nudim profesionalno online savjetovanje putem video poziva. Specijalizovana sam za personalizovane planove ishrane za mršavljenje, debljanje i održavanje zdravlja bez potrebe za putovanjem do ordinacije. Svaka konsultacija uključuje detaljnu analizu vaših prehrambenih navika, zdravstvenog stanja i ciljeva, nakon čega kreiram plan prilagođen vašim potrebama i životnom stilu.',
		clientsParagraph:
			'Klijenti iz Banje Luke koriste moje usluge da postignu svoje ciljeve više energije, kvalitetniji san, zdraviju težinu i bolje razumijevanje ishrane. Online format omogućava fleksibilnost radimo kada vam odgovara, gdje god se nalazili. Posebno cijenim podršku klijenata iz Banje Luke koji uspješno postižu svoje ciljeve kroz kontinuirano praćenje i prilagođavanja plana.',
		faq: [
			{ question: 'Koliko košta nutricionista u Banjoj Luci?', answer: 'Cijena usluga nutricioniste za Banju Luku kreće se od 80 KM za početnu konsultaciju, do 300 KM za mesečni paket koji uključuje individualni jelovnik, praćenje napretka i redovne online susrete.' },
			{ question: 'Da li radite uživo u Banjoj Luci ili samo online?', answer: 'Savjetovanje je dostupno isključivo online za klijente iz Banje Luke i okolice. Video konsultacije omogućavaju fleksibilnost bez gubljenja vremena na putovanje do ordinacije.' },
			{ question: 'Koliko brzo se vide rezultati kod pacijenata iz Banje Luke?', answer: 'Klijenti iz Banje Luke obično primjećuju prve promjene u energiji i kvaliteta sna nakon 2-3 sedmice. Vidljivi rezultati u težini dolaze nakon 4-8 sedmica, zavisno od početnog stanja i pridržavanja plana.' },
		],
	},
	{
		slug: 'tuzla',
		name: 'Tuzla',
		title: 'Nutricionista Tuzla | Online Savjetovanje – Jelena Matijaš',
		metaDescription:
			'Nutricionista za Tuzlu: online savjetovanje i personalizovani planovi ishrane. Video konsultacije za Tuzlu i regiju. Zakažite online termin.',
		introParagraph:
			'Magistar nutricionizma sa Tehnološkog fakulteta TU Tuzla. Stanovnicima Tuzle i regije nudim nutricionističko savjetovanje u potpunosti online bez potrebe za fizičkim dolaskom do ordinacije. Fokus je na vašim ciljevima, edukaciji i dugoročnoj podršci kroz personalizovane planove ishrane. Svaki plan kreiram na osnovu naučno potvrđenih principa ishrane prilagođenih vašem metabolizmu, preferencijama i svakodnevnim obavezama.',
		clientsParagraph:
			'Klijenti iz Tuzle koriste moje usluge za mršavljenje, debljanje, bolji san i više energije. Savjetovanje je prilagođeno vašem rasporedu radimo kada vam odgovara, bilo da ste zauzeti profesionalac ili vlasnik vlasnica posla. Sve se odvija putem video poziva, udobno kod vas. Tuzlaci posebno cijene praktične savjete koji se lako uklapaju u brzi životni ritam grada.',
		faq: [
			{ question: 'Koliko košta nutricionista u Tuzli?', answer: 'Za stanovnike Tuzle i okolice nudim pristupačne cijene od 80 KM za individualnu konsultaciju, do 300 KM za kompletan mesečni program sa jelovnikom i praćenjem.' },
			{ question: 'Da li radite uživo u Tuzli ili samo online?', answer: 'Sve konsultacije su online putem video poziva. Ovo je posebno praktično za zaposlene Tuzlake koji žele savjetovanje bez ometanja radnog vremena.' },
			{ question: 'Koliko brzo se vide rezultati kod pacijenata iz Tuzle?', answer: 'Klijenti iz Tuzle obično primjećuju prve promjene u energiji nakon 2-3 sedmice. Stabilni rezultati u težini postižu se nakon 6-8 sedmica kontinuiranog praćenja plana ishrane.' },
		],
	},
	{
		slug: 'zenica',
		name: 'Zenica',
		title: 'Nutricionista Zenica | Online Savjetovanje – Jelena Matijaš',
		metaDescription:
			'Nutricionista za Zenicu: online savjetovanje i planovi ishrane. Konsultacije putem interneta za Zenicu i srednju Bosnu. Zakažite konsultaciju.',
		introParagraph:
			'Ako tražite nutricionistu za Zenicu ili srednju Bosnu, savjetovanje kod mene se odvija u potpunosti online. Putem video poziva analiziram vaše navike, ciljeve i zdravstveni status te kreiram personalizovani plan ishrane. Idealno je za one koji žele stručnu podršku bez putovanja, uz fleksibilnost u terminu i mjestu konsultacije. Planovi uključuju jelovnike prilagođene zauzetom životnom stilu stanovnika Zenice, uz kontinuiranu podršku kroz redovne online susrete.',
		clientsParagraph:
			'Klijenti iz Zenice i srednje Bosne često koriste online format da usklade ishranu sa poslom i porodicom. Redovno praćenje i prilagodbe plana omogućavaju trajne rezultate. Zeničani posebno cijene mogućnost dobivanja profesionalne nutricionističke podrške bez ometanja svakodnevnih obaveza, bilo da rade u industriji, administraciji ili se bave privatnim biznisom.',
		faq: [
			{ question: 'Koliko košta nutricionista u Zenici?', answer: 'Cijene nutricionističkih usluga za Zenicu i srednju Bosnu kreću se od 80 KM za početnu konsultaciju, do 300 KM za kompletan mesečni program sa jelovnikom i praćenjem.' },
			{ question: 'Da li radite uživo u Zenici ili samo online?', answer: 'Savjetovanje je isključivo online putem video poziva, što je idealno za zaposlene u industriji i administraciji u Zenici koji imaju ograničeno slobodno vrijeme.' },
			{ question: 'Koliko brzo se vide rezultati kod pacijenata iz Zenice?', answer: 'Klijenti iz Zenice obično primjećuju poboljšanje energije i sna nakon 2-3 sedmice. Vidljivi rezultati u težini postižu se nakon 4-6 sedmica, uz redovno praćenje plana.' },
		],
	},
	{
		slug: 'mostar',
		name: 'Mostar',
		title: 'Nutricionista Mostar | Online Savjetovanje – Jelena Matijaš',
		metaDescription:
			'Nutricionista za Mostar: online savjetovanje i planovi ishrane za Hercegovinu. Video konsultacije. Mršavljenje, debljanje, zdrava ishrana.',
		introParagraph:
			'Za stanovnike Mostara i Hercegovine nudim nutricionističko savjetovanje isključivo online. Personalizovani planovi ishrane sa redovnim praćenjem putem video poziva. Bez putovanja, bez čekanja radimo direktno sa vama iz udobnosti vašeg doma ili ureda. Svaki klijent dobiva individualni pristup uz plan ishrane koji poštuje lokalne gastronomske tradicije hercegovačke kuhinje, uz moderna nutricionistička znanja.',
		clientsParagraph:
			'Klijenti iz Mostara koriste online savjetovanje za mršavljenje, debljanje, poboljšanje energije i uspostavljanje zdravih navika. Praćenje napretka je redovno svako par mjeseci analiziramo kako ide i prilagođavamo plan prema vašim rezultatima i promjenama u životu. Podrška bez obzira gdje ste. Mostarci cijene kombinaciju tradicionalnih hercegovačkih namirnica sa modernim nutricionističkim principima.',
		faq: [
			{ question: 'Koliko košta nutricionista u Mostaru?', answer: 'Za stanovnike Mostara i Hercegovine cijene kreću se od 80 KM za individualnu konsultaciju, do 300 KM za kompletan mesečni program koji uključuje personalizovani jelovnik i redovno praćenje.' },
			{ question: 'Da li radite uživo u Mostaru ili samo online?', answer: 'Savjetovanje je dostupno isključivo online putem video poziva za klijente iz Mostara i Hercegovine. Ovo omogućava fleksibilnost bez obzira na udaljenost.' },
			{ question: 'Koliko brzo se vide rezultati kod pacijenata iz Mostara?', answer: 'Klijenti iz Mostara obično primjećuju prve promjene nakon 2-3 sedmice. Značajniji rezultati u težini i energiji postižu se nakon 4-8 sedmica, uz redovno pridržavanje plana.' },
		],
	},
	{
		slug: 'prijedor',
		name: 'Prijedor',
		title: 'Nutricionista Prijedor | Online Savjetovanje – Jelena Matijaš',
		metaDescription:
			'Nutricionista za Prijedor: online savjetovanje i personalizovani planovi ishrane. Video konsultacije za Prijedor i regiju. Zakažite termin.',
		introParagraph:
			'Stanovnicima Prijedora i šire regije pružam profesionalno nutricionističko savjetovanje putem online konsultacija. Bez putovanja dobijate personalizovani plan ishrane, analizu vašeg života i redovnu podršku. Usluga je prilagođena svima koji žele ozbiljan pristup ishrani i zdravlju. Svaki plan uključuje praktične savjete za pripremu obroka koji odgovaraju vašem budžetu i vremenskim mogućnostima, uz poštovanje lokalnih prehrambenih običaja.',
		clientsParagraph:
			'Klijenti iz Prijedora koriste moje usluge da postignu ciljeve mršavljenje, debljanje, bolji san, više energije. Analiziram vaše trenutne navike, kreiram plan i redovno vas pratim da vidim napredak. Rezultati se vide obično u prvih 4-6 sedmica uz dobro pridržavanje plana. Prijedorci cijene direktan i iskren pristup, te konkretne savjete koji se odmah mogu primijeniti u svakodnevnom životu.',
		faq: [
			{ question: 'Koliko košta nutricionista u Prijedoru?', answer: 'Cijene za stanovnike Prijedora i okolice kreću se od 80 KM za početnu konsultaciju, do 300 KM za kompletan mesečni paket sa jelovnikom i praćenjem napretka.' },
			{ question: 'Da li radite uživo u Prijedoru ili samo online?', answer: 'Savjetovanje je isključivo online putem video poziva, što omogućava klijentima iz Prijedora i okolnih mjesta da dobiju stručnu podršku bez dugačkog putovanja.' },
			{ question: 'Koliko brzo se vide rezultati kod pacijenata iz Prijedora?', answer: 'Klijenti iz Prijedora obično primjećuju prve promjene u energiji nakon 2-3 sedmice. Vidljivi rezultati u težini dolaze nakon 4-6 sedmica uz redovno pridržavanje plana ishrane.' },
		],
	},
	{
		slug: 'bih',
		name: 'Bosna i Hercegovina',
		title: 'Nutricionista BiH | Online Savjetovanje za cijelu zemlju – Jelena Matijaš',
		metaDescription:
			'Nutricionista za cijelu BiH: online savjetovanje i planovi ishrane. Video konsultacije dostupne svuda u Bosni i Hercegovini. Zakažite online termin.',
		introParagraph:
			'Nutricionista za cijelu Bosnu i Hercegovinu savjetovanje dostupno svima, bez obzira gdje živite. Radim isključivo online putem video poziva. Kreiram personalizovane planove ishrane za mršavljenje, debljanje i održavanje zdravlja. Bez ordinacije fokus je čisto na vama i vašim ciljevima. Svim klijentima iz BiH pružam istu visoku razinu profesionalne podrške, bilo da ste u glavnom gradu ili manjem mjestu.',
		clientsParagraph:
			'Klijenti iz svih dijelova BiH koriste moje usluge od Sarajeva do Zvornika, od Zenice do Trebinja svi imaju pristup istoj kvaliteti savjetovanja. Online format znači nema čekanja u redovima, nema putovanja, fleksibilni termini. Rezultati su isti bez obzira gdje ste jer je plan prilagođen točno vama. Građani BiH cijene mogućnost dobivanja stručne nutricionističke podrške bez obzira na udaljenost od glavnog grada.',
		faq: [
			{ question: 'Koliko košta nutricionista u Bosni i Hercegovini?', answer: 'Cijene su jednake za sve gradove u BiH i kreću se od 80 KM za individualnu konsultaciju, do 300 KM za kompletan mesečni program sa jelovnikom i praćenjem. Nema dodatnih troškova za udaljena mjesta.' },
			{ question: 'Da li radite u svim gradovima BiH ili samo online?', answer: 'Savjetovanje je dostupno isključivo online putem video poziva za sva mjesta u Bosni i Hercegovini. Ovo omogućava jednaku kvalitetu usluge bez obzira na vašu lokaciju.' },
			{ question: 'Koliko brzo se vide rezultati kod pacijenata iz BiH?', answer: 'Klijenti iz svih dijelova BiH obično primjećuju prve promjene nakon 2-3 sedmice. Značajniji rezultati postižu se nakon 4-8 sedmica, zavisno od početnog stanja i pridržavanja plana.' },
		],
	},
];

export function getLocationBySlug(slug: string): LocationConfig | undefined {
	return LOCATIONS.find((l) => l.slug === slug);
}
