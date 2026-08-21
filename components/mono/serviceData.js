// Service definitions for /usluge pages and homepage cards.
// Plain module (no JSX) so server components can import it for metadata.

export const SERVICES = [
  { slug: 'web-digitalno', visual: 'web', title: 'Web i aplikacije', note: 'Stranice i aplikacije koje rade svoj posao. Brzo, sigurno, skalabilno.' },
  { slug: 'video-animacija', visual: 'video', title: 'Video i animacija', note: 'Od scenarija do finalnog reza. Reklame, korporativni video, social.' },
  { slug: 'fotografija', visual: 'foto', title: 'Fotografija', note: 'Produkt, prostor, ljudi. Fotografija koja prodaje.' },
  { slug: 'strategija-branding', visual: 'brand', title: 'Strategija i branding', note: 'Identitet koji se pamti, od logotipa do kompletne priče.' },
  { slug: 'sadrzaj-drustvene-mreze', visual: 'social', title: 'Sadržaj i društvene mreže', note: 'Sadržaj koji pretvara pratitelje u kupce. Strategija i kreacija.' },
  { slug: 'studio', visual: 'studio', title: 'Studio', note: 'Opremljen studio za video i podcast. Za najam ili tvoj projekt.' },
]

export const SERVICE_DETAILS = {
  'web-digitalno': {
    title: 'Web i aplikacije',
    metaDescription: 'Web stranice, shopovi i aplikacije koje se brzo otvaraju, dobro rangiraju i pretvaraju posjetitelje u upite.',
    headline: 'Stranice, shopovi i aplikacije koje rade svoj posao.',
    sub: 'Brzo se otvaraju, dobro rangiraju i pretvaraju posjetitelje u upite. Bez predložaka, bez kompromisa.',
    features: [
      { title: 'Custom dizajn', note: 'Bez predložaka i tema. Dizajn koji izgleda kao tvoj brend, ne kao još jedan template.' },
      { title: 'Brzina koja se mjeri', note: 'Stranice se otvaraju ispod sekunde. Google to nagrađuje, posjetitelji još više.' },
      { title: 'SEO od prvog dana', note: 'Struktura, sadržaj i tehnika posloženi da te Google nađe bez plaćenih oglasa.' },
      { title: 'CMS koji ne smeta', note: 'Sam mijenjaš sadržaj kad želiš. A ako nećeš, tu smo mi.' },
    ],
    steps: [
      { step: '01', title: 'Razgovor', note: 'Prođemo što trebaš, koliko košta i kad će biti gotovo.' },
      { step: '02', title: 'Dizajn', note: 'Prvo skice, pa dizajn. Ništa ne ide u razvoj dok ne kažeš da.' },
      { step: '03', title: 'Razvoj', note: 'Gradimo u Next.js-u i testiramo na stvarnim uređajima.' },
      { step: '04', title: 'Lansiranje', note: 'Domena, hosting, analitika. I održavanje ako želiš.' },
    ],
    includes: ['UI/UX dizajn', 'Copywriting', 'Razvoj (Next.js)', 'SEO', 'Analitika', 'Domena i hosting', 'Održavanje'],
    projectType: 'web_development',
  },
  'video-animacija': {
    title: 'Video i animacija',
    metaDescription: 'Reklame, korporativni video i sadržaj za društvene mreže. Od scenarija do finalnog reza.',
    headline: 'Video koji se stvarno gleda.',
    sub: 'Od scenarija do finalnog reza: reklame, korporativni video i sadržaj za društvene mreže.',
    features: [
      { title: 'Predprodukcija', note: 'Scenarij, plan snimanja i lokacije. Dođemo spremni, ne "vidjet ćemo na licu mjesta".' },
      { title: 'Snimanje', note: 'Naša oprema, tvoja lokacija ili naš studio. 4K, stabilizacija i audio koji se čuje.' },
      { title: 'Montaža i color', note: 'Rez koji drži pažnju i boje koje izgledaju kao film, ne kao snimka s mobitela.' },
      { title: 'Formati za sve', note: '16:9 za web, 9:16 za Reels i TikTok, 1:1 za feed. Iz jednog snimanja, sve.' },
    ],
    steps: [
      { step: '01', title: 'Brief', note: 'Što snimamo, za koga i gdje će se vrtjeti.' },
      { step: '02', title: 'Snimanje', note: 'Isplanirano unaprijed, odrađeno bez kaosa.' },
      { step: '03', title: 'Montaža', note: 'Rez, color, titlovi i glazba. Šaljemo na pregled.' },
      { step: '04', title: 'Isporuka', note: 'Svi formati, spremni za objavu.' },
    ],
    includes: ['Scenarij', 'Snimanje', 'Montaža', 'Color grading', 'Titlovi', 'Glazba', 'Svi formati'],
    projectType: 'video_production',
  },
  'fotografija': {
    title: 'Fotografija',
    metaDescription: 'Produktna fotografija, prostori, ljudi i eventi. Fotografija koja prodaje, bez stock osjećaja.',
    headline: 'Fotografija koja prodaje.',
    sub: 'Produkt, prostor, ljudi. Bez stock osjećaja i bez fejkanja.',
    features: [
      { title: 'Produktna', note: 'Proizvodi snimljeni da se požele kupiti. Za web, shop i katalog.' },
      { title: 'Prostori', note: 'Interijeri, lokali i uredi. Za web, booking platforme i Google.' },
      { title: 'Ljudi i tim', note: 'Portreti koji ne izgledaju kao za osobnu. Tvoj tim, opušteno i profesionalno.' },
      { title: 'Event', note: 'Konferencije, otvorenja, proslave. Uhvatimo atmosferu dok traje.' },
    ],
    steps: [
      { step: '01', title: 'Dogovor', note: 'Što snimamo, gdje i za koje kanale.' },
      { step: '02', title: 'Snimanje', note: 'Dođemo s opremom, ti dođeš kakav jesi.' },
      { step: '03', title: 'Obrada', note: 'Selekcija i profesionalna obrada, bez pretjerivanja.' },
      { step: '04', title: 'Isporuka', note: 'Web-ready formati i prava korištenja.' },
    ],
    includes: ['Priprema i scenografija', 'Snimanje', 'Profesionalna obrada', 'Web-ready export', 'Prava korištenja'],
    projectType: null,
  },
  'strategija-branding': {
    title: 'Strategija i branding',
    metaDescription: 'Logo, vizualni identitet i brand strategija. Identitet koji se pamti.',
    headline: 'Identitet koji se pamti.',
    sub: 'Od logotipa do kompletne priče o brendu: kako izgledaš, kako zvučiš i po čemu te pamte.',
    features: [
      { title: 'Logo i identitet', note: 'Znak koji radi na posjetnici i na billboardu. I svugdje između.' },
      { title: 'Brand knjiga', note: 'Boje, tipografija i pravila. Da tvoj brend izgleda isto, tko god ga koristio.' },
      { title: 'Ton komunikacije', note: 'Kako tvoj brend zvuči: na webu, na mrežama, u mailu.' },
      { title: 'Primjena', note: 'Identitet primijenjen na sve: web, social, print, potpis u mailu.' },
    ],
    steps: [
      { step: '01', title: 'Radionica', note: 'Tko si, za koga radiš i po čemu se razlikuješ.' },
      { step: '02', title: 'Koncepti', note: 'Par smjerova, pa zajedno biramo pravi.' },
      { step: '03', title: 'Razrada', note: 'Odabrani smjer razradimo do zadnjeg detalja.' },
      { step: '04', title: 'Primopredaja', note: 'Brand knjiga i svi materijali, spremni za korištenje.' },
    ],
    includes: ['Logo i varijante', 'Paleta boja', 'Tipografija', 'Brand smjernice', 'Predlošci'],
    projectType: null,
  },
  'sadrzaj-drustvene-mreze': {
    title: 'Sadržaj i društvene mreže',
    metaDescription: 'Strategija, kreacija i vođenje društvenih mreža. Sadržaj koji pretvara pratitelje u kupce.',
    headline: 'Sadržaj koji pretvara pratitelje u kupce.',
    sub: 'Strategija, kreacija i objava, sve na jednom mjestu. Ti radiš svoj posao, mi vodimo mreže.',
    features: [
      { title: 'Strategija i kalendar', note: 'Znaš što ide van i zašto, tjednima unaprijed.' },
      { title: 'Kreacija', note: 'Foto, video i dizajn objava. Snimamo kod tebe, ne recikliramo stock.' },
      { title: 'Objava i community', note: 'Objavljujemo, odgovaramo i pratimo što radi.' },
      { title: 'Izvještaji', note: 'Mjesečni izvještaj bez buzzworda: što je raslo, što nije i što dalje.' },
    ],
    steps: [
      { step: '01', title: 'Strategija', note: 'Kanali, publika i plan sadržaja.' },
      { step: '02', title: 'Produkcija', note: 'Snimimo i dizajniramo sadržaj za cijeli mjesec.' },
      { step: '03', title: 'Objave', note: 'Objavljujemo po kalendaru i vodimo community.' },
      { step: '04', title: 'Izvještaj', note: 'Brojke, zaključci i plan za sljedeći mjesec.' },
    ],
    includes: ['Kalendar sadržaja', 'Snimanje', 'Dizajn objava', 'Captioni', 'Objavljivanje', 'Mjesečni izvještaji'],
    projectType: 'social_media',
  },
  'studio': {
    title: 'Studio',
    metaDescription: 'Opremljen studio za video i podcast u Zagrebu. Najam prostora s opremom, uz tehničara ili bez.',
    headline: 'Studio spreman za snimanje.',
    sub: 'Opremljen studio za video i podcast u Zagrebu. Najmi prostor ili dođi s idejom, mi ćemo ostalo.',
    features: [
      { title: 'Oprema', note: '4K kamere, rasvjeta i audio. Sve uključeno u najam, ništa se ne doplaćuje.' },
      { title: 'Podcast setup', note: 'Mikrofoni, više kamera i snimanje spremno za montažu.' },
      { title: 'S tehničarem ili bez', note: 'Znaš što radiš? Prostor je tvoj. Ne znaš? Naš tehničar je tu.' },
      { title: 'Fleksibilni termini', note: 'Radnim danom, vikendom, navečer. Dogovorimo se.' },
    ],
    steps: [
      { step: '01', title: 'Rezervacija', note: 'Javi termin i što snimaš.' },
      { step: '02', title: 'Priprema', note: 'Postavimo set prije nego dođeš.' },
      { step: '03', title: 'Snimanje', note: 'Ti pričaš, oprema radi.' },
      { step: '04', title: 'Materijali', note: 'Sirovi materijali odmah, montaža po dogovoru.' },
    ],
    includes: ['4K kamere', 'Rasvjeta', 'Mikrofoni', 'Pozadine', 'Tehničar (opcionalno)', 'Montaža (opcionalno)'],
    projectType: null,
  },
}
