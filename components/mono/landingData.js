// Landing pages za Google Ads kampanje: /izrada-web-stranica i /izrada-web-shopa.
// Plain module (no JSX) so server components can import it for metadata.
// Cijene su NAMJERNO odvojene od lib/salesPackages.js (Karlovi prodajni paketi):
// landing prikazuje standardni Ninefold cjenik, postavljen prema stvarnim ponudama.

const PRICES = {
  webStart: 1290,
  webStandard: 2490,
  webPremium: 4490,
  shopMini: 1990,
  shopCustomFrom: 3990,
}

const eur = (n) => `${n.toLocaleString('hr-HR')} €`

export const LANDINGS = {
  'izrada-web-stranica': {
    slug: 'izrada-web-stranica',
    chip: 'Izrada web stranica',
    metaTitle: `Izrada web stranica od ${eur(PRICES.webStart)} | Ninefold`,
    metaDescription: `Profesionalna izrada web stranica. Custom dizajn, SEO od prvog dana i brzina ispod sekunde. Paketi od ${eur(PRICES.webStart)}, cijena poznata unaprijed.`,
    h1: 'Izrada web stranica koje dovode klijente.',
    sub: 'Custom dizajn, brzina ispod sekunde i SEO od prvog dana. Cijenu znaš unaprijed, a stranicu dobiješ u par tjedana, ne mjeseci.',
    heroPills: [`Paketi od ${eur(PRICES.webStart)}`, 'Izrada od 2 tjedna', 'Odgovor unutar 24 sata'],
    benefits: [
      { title: 'Custom dizajn', note: 'Bez predložaka i tema. Dizajn koji izgleda kao tvoj brend, ne kao još jedan template.' },
      { title: 'Brzina koja se mjeri', note: 'Stranice se otvaraju ispod sekunde. Google to nagrađuje, posjetitelji još više.' },
      { title: 'SEO od prvog dana', note: 'Struktura, sadržaj i tehnika posloženi da te Google nađe i bez plaćenih oglasa.' },
      { title: 'Cijena poznata unaprijed', note: 'Paketi s fiksnom cijenom i jasnim opsegom. Bez skrivenih stavki i naknadnih iznenađenja.' },
    ],
    packagesTitle: 'Koliko košta web stranica?',
    packagesSub: 'Tri paketa, fiksne cijene. Točnu ponudu dobiješ nakon prvog razgovora, bez skrivenih stavki.',
    packages: [
      {
        name: 'Start',
        price: PRICES.webStart,
        duration: '2-3 tjedna',
        tagline: 'Za male biznise koji trebaju profesionalan web, brzo i bez komplikacija.',
        features: [
          'Do 5 stranica (Naslovnica, O nama, Usluge, Kontakt...)',
          'Custom dizajn, bez predložaka',
          'Responzivni dizajn (mobitel, tablet, računalo)',
          'Kontakt forma',
          'Osnovna SEO optimizacija',
          'SSL certifikat',
          'Postavljanje hostinga i domene',
        ],
      },
      {
        name: 'Standard',
        price: PRICES.webStandard,
        duration: '3-5 tjedana',
        tagline: 'Za biznise koji žele web koji aktivno dovodi klijente.',
        features: [
          'Do 10 stranica',
          'Dizajn po mjeri s animacijama',
          'Copywriting tekstova',
          'Blog / Novosti sekcija',
          'Kontakt forma + newsletter prijava',
          'Napredna SEO optimizacija',
          'Google Analytics postavljanje',
          'Povezivanje društvenih mreža',
        ],
        highlight: true,
        badge: 'Najčešći izbor',
      },
      {
        name: 'Premium',
        price: PRICES.webPremium,
        duration: '5-8 tjedana',
        tagline: 'Kompletno digitalno rješenje za biznise koji misle ozbiljno.',
        features: [
          'Do 20 stranica',
          'Premium dizajn i animacije',
          'CMS: samostalno uređivanje sadržaja',
          'Copywriting tekstova',
          'Napredni SEO + Google Search Console',
          'Integracije (rezervacije, newsletter)',
          'Priprema za višejezičnost',
          'Prioritetna podrška 30 dana nakon lansiranja',
        ],
      },
    ],
    packagesNote: 'Trebaš nešto ekstra? Dodatni jezik, online rezervacije, fotografiranje ili Google poslovni profil dogovaraju se kao dodatak uz svaki paket.',
    steps: [
      { step: '01', title: 'Razgovor', note: 'Prođemo što trebaš, koliko košta i kad će biti gotovo.' },
      { step: '02', title: 'Dizajn', note: 'Prvo skice, pa dizajn. Ništa ne ide u razvoj dok ne kažeš da.' },
      { step: '03', title: 'Razvoj', note: 'Gradimo i testiramo na stvarnim uređajima.' },
      { step: '04', title: 'Lansiranje', note: 'Domena, hosting, analitika. I održavanje ako želiš.' },
    ],
    faqs: [
      { q: 'Koliko košta izrada web stranice?', a: `Paketi kreću od ${eur(PRICES.webStart)} za web do 5 stranica. Standard paket s dizajnom po mjeri i copywritingom je ${eur(PRICES.webStandard)}, a Premium s CMS-om i animacijama ${eur(PRICES.webPremium)}. Točnu ponudu dobiješ nakon prvog razgovora, bez skrivenih stavki.` },
      { q: 'Koliko traje izrada?', a: 'Start paket 2-3 tjedna, Standard 3-5, Premium 5-8. Najviše ovisi o tome koliko brzo stižu materijali i povratne informacije s tvoje strane.' },
      { q: 'Već imam web, može li se samo osvježiti?', a: 'Može. Pogledamo što ima smisla zadržati, što baciti, i predložimo redizajn koji ne kreće od nule ako ne mora.' },
      { q: 'Hoću li moći sam mijenjati sadržaj?', a: 'U Premium paketu dobiješ CMS pa sadržaj mijenjaš sam, kad god želiš. U ostalim paketima izmjene radimo mi, a CMS se uvijek može dogovoriti kao dodatak.' },
      { q: 'Što s održavanjem nakon lansiranja?', a: 'Imamo mjesečne pakete održavanja: ažuriranja, sigurnosne zakrpe, sitne izmjene sadržaja i podrška. Cijena ovisi o opsegu i dogovara se uz ponudu.' },
      { q: 'Kako izgleda suradnja?', a: 'Prvo razgovor, pa ponuda, pa posao. Tijekom projekta imaš direktan kontakt s nama, bez posrednika i bez čekanja tjedan dana na mail.' },
    ],
    formTitle: 'Zatraži ponudu',
    formSub: 'Reci nam što trebaš i javimo se unutar 24 sata s konkretnim prijedlogom.',
    formSubject: 'Upit s landing stranice · Izrada web stranica',
  },

  'izrada-web-shopa': {
    slug: 'izrada-web-shopa',
    chip: 'Izrada web shopa',
    metaTitle: `Izrada web shopa od ${eur(PRICES.shopMini)} | Ninefold`,
    metaDescription: `Izrada web shopa s online plaćanjem. Od mini trgovine od ${eur(PRICES.shopMini)} do shopa po mjeri. Dizajn koji prodaje, cijena poznata unaprijed.`,
    h1: 'Izrada web shopa koji prodaje.',
    sub: 'Od mini trgovine do shopa po mjeri: online plaćanje, jednostavno vođenje narudžbi i dizajn koji ne izgleda kao template.',
    heroPills: [`Mini shop od ${eur(PRICES.shopMini)}`, 'Online plaćanje uključeno', 'Odgovor unutar 24 sata'],
    benefits: [
      { title: 'Online plaćanje od prvog dana', note: 'Kartice i sigurna naplata posložene prije lansiranja. Kupac plati, ti dobiješ narudžbu.' },
      { title: 'Sam vodiš svoju trgovinu', note: 'Dodaješ proizvode, mijenjaš cijene i pratiš narudžbe bez zvanja programera.' },
      { title: 'Brzina i SEO', note: 'Shop koji se otvara ispod sekunde i koji Google nađe. Spor shop je prazan shop.' },
      { title: 'Dizajn po mjeri', note: 'Tvoja trgovina izgleda kao tvoj brend, ne kao tisuću drugih shopova na istoj temi.' },
    ],
    packagesTitle: 'Koliko košta web shop?',
    packagesSub: 'Za početak online prodaje ili za ozbiljan katalog. Točnu ponudu dobiješ nakon prvog razgovora.',
    packages: [
      {
        name: 'Mini web shop',
        price: PRICES.shopMini,
        duration: '3-4 tjedna',
        tagline: 'Za početak online prodaje, do 15 proizvoda.',
        features: [
          'Do 15 proizvoda',
          'Online plaćanje karticama',
          'Custom dizajn, bez predložaka',
          'Responzivni dizajn (mobitel, tablet, računalo)',
          'Upravljanje narudžbama',
          'Osnovna SEO optimizacija',
          'SSL certifikat',
          'Postavljanje hostinga i domene',
        ],
        highlight: true,
        badge: 'Najbrži start',
      },
      {
        name: 'Web shop po mjeri',
        price: null,
        priceNote: `od ${eur(PRICES.shopCustomFrom)}`,
        duration: 'po dogovoru',
        tagline: 'Za veće kataloge i posebne zahtjeve.',
        features: [
          'Neograničen broj proizvoda',
          'Dizajn i funkcionalnosti po mjeri',
          'Više načina plaćanja',
          'Integracije (dostava, newsletter, ERP)',
          'Napredna SEO optimizacija',
          'Edukacija za vođenje shopa',
          'Podrška nakon lansiranja',
        ],
      },
    ],
    packagesNote: 'Uz shop se često dogovaraju i copywriting opisa proizvoda, profesionalno fotografiranje proizvoda i dodatni jezik.',
    steps: [
      { step: '01', title: 'Razgovor', note: 'Prođemo asortiman, načine plaćanja i dostavu.' },
      { step: '02', title: 'Dizajn', note: 'Dizajn shopa i toka kupnje. Ništa ne ide dalje bez tvog da.' },
      { step: '03', title: 'Razvoj', note: 'Proizvodi, plaćanje i testne narudžbe od početka do kraja.' },
      { step: '04', title: 'Lansiranje', note: 'Domena, hosting, analitika i kratka edukacija za vođenje shopa.' },
    ],
    faqs: [
      { q: 'Koliko košta izrada web shopa?', a: `Mini web shop s do 15 proizvoda i online plaćanjem je ${eur(PRICES.shopMini)}. Shopovi po mjeri kreću od ${eur(PRICES.shopCustomFrom)}, ovisno o broju proizvoda i integracijama. Točnu ponudu dobiješ nakon prvog razgovora.` },
      { q: 'Mogu li sam dodavati proizvode?', a: 'Da. Dobiješ pristup administraciji u kojoj sam dodaješ proizvode, mijenjaš cijene i pratiš narudžbe. Pokažemo ti kako, traje pola sata.' },
      { q: 'Koje načine plaćanja podržavate?', a: 'Kartično plaćanje je standard u svakom shopu. Plaćanje virmanom ili pouzećem dodajemo po dogovoru, ovisno o tome kako želiš poslovati.' },
      { q: 'Koliko traje izrada?', a: 'Mini web shop 3-4 tjedna. Shop po mjeri ovisi o opsegu, okvirni rok dobiješ uz ponudu i držimo ga se.' },
      { q: 'Što s dostavom?', a: 'Posložimo cijene dostave i pravila po tvojim uvjetima, a integracije s dostavnim službama dogovaramo prema potrebi.' },
      { q: 'Već imam shop, može li redizajn?', a: 'Može. Pogledamo što radi, što ne radi i gdje kupci odustaju, pa predložimo redizajn ili prelazak na brže rješenje bez gubitka podataka.' },
    ],
    formTitle: 'Zatraži ponudu',
    formSub: 'Reci nam što prodaješ i javimo se unutar 24 sata s konkretnim prijedlogom.',
    formSubject: 'Upit s landing stranice · Izrada web shopa',
  },
}

// Gradske varijante /izrada-web-stranica/[grad] za lokalne pretrage
// (izrada web stranica zagreb/split/rijeka/pula/dubrovnik). Paketi i cijene su
// zajednički (ponuda je ista), a hero, gradska sekcija i prva dva FAQ-a su
// jedinstveni po gradu da stranice ne budu doorway kopije.
export const CITIES = [
  {
    slug: 'zagreb',
    name: 'Zagreb',
    metaTitle: `Izrada web stranica Zagreb · od ${eur(PRICES.webStart)} | Ninefold`,
    metaDescription: `Izrada web stranica u Zagrebu. Zagrebačka agencija, custom dizajn, lokalni SEO i brzina ispod sekunde. Paketi od ${eur(PRICES.webStart)}, kava uživo po dogovoru.`,
    h1: 'Izrada web stranica u Zagrebu.',
    sub: 'Zagrebačka agencija za web koji dovodi klijente: custom dizajn, brzina ispod sekunde i SEO od prvog dana. Kava uživo ili sve online, kako ti paše.',
    section: {
      title: 'Web agencija iz Zagreba, za zagrebačke biznise',
      paragraphs: [
        'Ninefold je zagrebačka agencija, pa suradnja može krenuti i uz kavu: prođemo što ti treba, pokažemo radove i dogovorimo plan. Većinu zagrebačkih klijenata vodimo kombinirano, uživo kad treba, online kad je brže.',
        'Zagreb je najkonkurentnije tržište u Hrvatskoj: tko god nešto traži, prvo upiše djelatnost i grad u Google. Zato zagrebačke stranice radimo s lokalnim SEO-om od prvog dana: struktura za pretrage po djelatnosti i kvartu, Google poslovni profil i brzina koju Google nagrađuje.',
        'Iza nas su zagrebački projekti iz raznih branši: pizzeria na Knežiji, tattoo studio u Sesvetama, frizerski salon, coworking prostori. Svaki s istim ciljem: da stranica ne bude ukras, nego kanal koji dovodi upite.',
      ],
    },
    faqs: [
      { q: 'Možemo li se naći uživo u Zagrebu?', a: 'Naravno. Baza nam je u Zagrebu, pa se za početak suradnje rado nađemo uživo: kod tebe, kod nas ili uz kavu. Ostatak projekta ide online tempom koji ti odgovara.' },
      { q: 'Radite li lokalni SEO za zagrebačke pretrage?', a: "Da. Stranicu posložimo za pretrage tipa 'tvoja djelatnost + Zagreb' ili kvart, a uz to sredimo i Google poslovni profil, koji za lokalne pretrage često donosi više upita od same stranice." },
    ],
  },
  {
    slug: 'split',
    name: 'Split',
    metaTitle: `Izrada web stranica Split · od ${eur(PRICES.webStart)} | Ninefold`,
    metaDescription: `Izrada web stranica u Splitu: turizam, apartmani, usluge i obrti. Custom dizajn, lokalni SEO i stranica spremna prije sezone. Paketi od ${eur(PRICES.webStart)}.`,
    h1: 'Izrada web stranica u Splitu.',
    sub: 'Custom stranice za splitske biznise: od turizma i apartmana do usluga i obrta. Brze, dobro rangirane i spremne prije sezone.',
    section: {
      title: 'Web za Split: grad u kojem sezona ne oprašta',
      paragraphs: [
        'Splitski biznisi žive od ritma sezone: stranica koja se sporo otvara ili je nema na Googleu doslovno znači prazne termine u srpnju. Zato stranice za splitske klijente radimo s jasnim rokom: online i posložene prije nego što krene navala.',
        'S turističkim projektima imamo konkretno iskustvo: radili smo stranicu za padel klub kraj Trogira i kuću za odmor s direktnim rezervacijama. Znamo što gost gleda prije nego što rezervira i kako mu maknuti svaku prepreku do upita ili rezervacije.',
        "A Split nije samo turizam: usluge, obrti, klinike i dućani trebaju stranicu koju nađe lokalna publika. Struktura za pretrage 'djelatnost + Split', Google poslovni profil i brzina ispod sekunde su standard u svakom paketu.",
      ],
    },
    faqs: [
      { q: 'Radite li s klijentima iz Splita iako ste iz Zagreba?', a: 'Da, redovito. Cijeli proces ide glatko online: poziv, dizajn na pregled, izmjene i lansiranje. Radili smo projekte od Trogira do Dubrovnika bez ijednog sastanka uživo, a po potrebi rado dođemo.' },
      { q: 'Radite li stranice za apartmane i turizam?', a: 'Da, i to nam je jedna od najdražih niša. Stranica s direktnim upitima ili rezervacijama smanjuje ovisnost o Booking provizijama: gost te nađe na Googleu, pogleda galeriju i rezervira direktno.' },
    ],
  },
  {
    slug: 'rijeka',
    name: 'Rijeka',
    metaTitle: `Izrada web stranica Rijeka · od ${eur(PRICES.webStart)} | Ninefold`,
    metaDescription: `Izrada web stranica u Rijeci za tvrtke, obrte i usluge. Custom dizajn, lokalni SEO i brzina ispod sekunde. Paketi od ${eur(PRICES.webStart)}, cijena poznata unaprijed.`,
    h1: 'Izrada web stranica u Rijeci.',
    sub: 'Stranice za riječke tvrtke i obrte: od industrije i servisa do ugostiteljstva. Custom dizajn, brzina i SEO koji te stavi ispred konkurencije.',
    section: {
      title: 'Web za Rijeku: manje buke, više prilike',
      paragraphs: [
        'U Rijeci ima manje agencija nego u Zagrebu, ali i manje kvalitetnih stranica. To je prilika: riječki biznis s brzom, posloženom stranicom vrlo lako iskoči ispred konkurencije koja se drži zastarjelog weba ili samo Facebook stranice.',
        'Riječko gospodarstvo je specifično: industrija, servisi, logistika, tehničke usluge. Takvim biznisima ne treba šminka, nego jasna stranica koja u tri sekunde kaže što radite, za koga i zašto vama vjerovati, uz reference i jednostavan kontakt. Točno takve radimo.',
        "Uz to, stranicu posložimo za lokalne pretrage: 'djelatnost + Rijeka', Google poslovni profil i tehnički SEO. Kad netko u Rijeci traži ono što radiš, cilj je jednostavan: da nađe tebe.",
      ],
    },
    faqs: [
      { q: 'Radite li s klijentima iz Rijeke na daljinu?', a: 'Da, bez problema. Sve od prvog razgovora do lansiranja ide online, s dizajnom na pregled u svakoj fazi. Klijenti iz cijele Hrvatske prošli su isti proces bez ijednog sastanka uživo.' },
      { q: 'Radite li B2B stranice za tvrtke?', a: 'Da. Za tvrtke koje prodaju drugim tvrtkama stranica je digitalna posjetnica prije svakog sastanka: reference, certifikati, oprema i jasan upit. Radimo ih redovito, i na više jezika kad poslovanje ide preko granice.' },
    ],
  },
  {
    slug: 'pula',
    name: 'Pula',
    metaTitle: `Izrada web stranica Pula · od ${eur(PRICES.webStart)} | Ninefold`,
    metaDescription: `Izrada web stranica u Puli i Istri: turizam, apartmani, restorani i usluge. Višejezične stranice s lokalnim SEO-om. Paketi od ${eur(PRICES.webStart)}.`,
    h1: 'Izrada web stranica u Puli.',
    sub: 'Stranice za pulske i istarske biznise: turizam, apartmani, restorani i usluge. Višejezične, brze i spremne za sezonu.',
    section: {
      title: 'Web za Pulu i Istru: gosti dolaze s Googlea',
      paragraphs: [
        'Istra živi od gostiju koji sve traže online, i to na svom jeziku. Zato stranice za pulske klijente često radimo višejezično: hrvatski za lokalne, a engleski, njemački ili talijanski za goste. Priprema za višejezičnost je ugrađena u naše pakete.',
        'Apartmani, agroturizmi, restorani i izleti: svima je ista matematika. Svaka rezervacija koja dođe direktno preko tvoje stranice je noćenje bez provizije. Radili smo stranice za smještaj s direktnim upitima i znamo što gosta uvjeri: brza galerija, jasne informacije i kontakt bez traženja.',
        "Za pulske obrte i usluge izvan turizma vrijedi isto što i svugdje: lokalna pretraga odlučuje. 'Djelatnost + Pula', Google poslovni profil i stranica koja se otvara ispod sekunde, to je paket s kojim te lokalna publika nađe.",
      ],
    },
    faqs: [
      { q: 'Radite li višejezične stranice?', a: 'Da. Za istarske biznise često radimo dvojezične ili trojezične stranice (HR, EN, DE ili IT po potrebi). Struktura i SEO se poslože za svaki jezik, pa te i strani gosti nađu na Googleu, ne samo domaći.' },
      { q: 'Surađujete li s klijentima iz Pule na daljinu?', a: 'Da, cijeli proces radimo online: poziv, dizajn na pregled, izmjene, lansiranje. Po potrebi dođemo i uživo, Istra nam nikad nije teško.' },
    ],
  },
  {
    slug: 'dubrovnik',
    name: 'Dubrovnik',
    metaTitle: `Izrada web stranica Dubrovnik · od ${eur(PRICES.webStart)} | Ninefold`,
    metaDescription: `Izrada web stranica u Dubrovniku: luksuzni smještaj, izleti, restorani i usluge. Premium dizajn, višejezičnost i direktne rezervacije. Paketi od ${eur(PRICES.webStart)}.`,
    h1: 'Izrada web stranica u Dubrovniku.',
    sub: 'Premium stranice za dubrovački turizam i biznise: luksuzni smještaj, izleti, restorani i usluge. Dizajn na razini grada u kojem radiš.',
    section: {
      title: 'Web za Dubrovnik: premium gosti očekuju premium dojam',
      paragraphs: [
        'Dubrovnik je najskuplja turistička adresa u Hrvatskoj, a gosti koji plaćaju premium cijene odluke donose na temelju dojma u prvih par sekundi. Stranica s predloška tu ne prolazi: dizajn, fotografija i brzina moraju biti na razini onoga što naplaćuješ.',
        'Za luksuzni smještaj i vile matematika je jednostavna: uz dubrovačke cijene noćenja, već par direktnih rezervacija godišnje pokrije cijelu investiciju u stranicu, jer provizija posrednika ostaje tebi. Radimo stranice s direktnim upitima i rezervacijama, višejezične i posložene za Google.',
        'Isto vrijedi za izlete, chartere, restorane i vjenčanja: gost sve istražuje unaprijed, na engleskom, i bira one koji izgledaju ozbiljno. Naš posao je da to budeš ti.',
      ],
    },
    faqs: [
      { q: 'Radite li s klijentima iz Dubrovnika na daljinu?', a: 'Da, cijeli proces ide online i klijenti s juga su ga prolazili bez ijednog sastanka uživo: poziv, dizajn na pregled, izmjene, lansiranje. Po dogovoru rado dođemo i uživo.' },
      { q: 'Isplati li se vlastita stranica uz Booking i Airbnb?', a: 'Uz dubrovačke cijene noćenja, apsolutno. Platforme uzimaju 15 do 20% od svake rezervacije. Vlastita stranica s direktnim rezervacijama tu proviziju vraća tebi, a uz to gradiš bazu gostiju koji se vraćaju.' },
    ],
  },
]

const baseWeb = LANDINGS['izrada-web-stranica']

for (const city of CITIES) {
  LANDINGS[`izrada-web-stranica/${city.slug}`] = {
    ...baseWeb,
    slug: `izrada-web-stranica/${city.slug}`,
    chip: `Izrada web stranica · ${city.name}`,
    metaTitle: city.metaTitle,
    metaDescription: city.metaDescription,
    h1: city.h1,
    sub: city.sub,
    citySection: city.section,
    faqs: [...city.faqs, ...baseWeb.faqs],
    formSubject: `Upit s landing stranice · Izrada web stranica ${city.name}`,
    cityLinks: [
      { href: '/izrada-web-stranica', label: 'Cijela Hrvatska' },
      ...CITIES.filter((c) => c.slug !== city.slug).map((c) => ({
        href: `/izrada-web-stranica/${c.slug}`,
        label: c.name,
      })),
    ],
  }
}

baseWeb.cityLinks = CITIES.map((c) => ({
  href: `/izrada-web-stranica/${c.slug}`,
  label: c.name,
}))
