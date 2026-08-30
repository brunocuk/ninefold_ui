// Lead magnet stranica /besplatna-analiza: posjetitelj ostavi URL svoje
// stranice i mail, mi vratimo konkretnu analizu. Plain module (no JSX) so the
// server component can import it for metadata and FAQPage schema.

export const ANALYSIS = {
  slug: 'besplatna-analiza',
  metaTitle: 'Besplatna analiza web stranice | Ninefold',
  metaDescription:
    'Pošalji nam link svoje web stranice i u 48 sati dobiješ besplatnu analizu: brzina, SEO, dizajn i konkretni prijedlozi. Bez obveza i bez prodajnog pritiska.',
  h1: 'Besplatna analiza tvoje web stranice.',
  sub: 'Pošalji link, mi pogledamo brzinu, SEO i dizajn, i u 48 sati dobiješ mail s konkretnim prijedlozima. Bez obveza, bez prodajnog pritiska.',
  checks: [
    {
      title: 'Brzina',
      note: 'Mjerimo koliko se brzo stranica stvarno otvara na mobitelu i računalu, i što je točno usporava. Spora stranica gubi posjetitelje prije nego što išta pročitaju.',
    },
    {
      title: 'SEO i vidljivost',
      note: 'Provjerimo kako te Google vidi: naslovi, struktura, indeksiranje i lokalne pretrage. Često se najveći problemi skrivaju u stvarima koje se s površine ne vide.',
    },
    {
      title: 'Dizajn i povjerenje',
      note: 'Prvi dojam u tri sekunde: izgleda li stranica kao biznis kojem bi netko dao novac? Prolazimo je očima tvog potencijalnog klijenta.',
    },
    {
      title: 'Konkretni prijedlozi',
      note: 'Ne dobiješ ocjenu nego popis: što bismo popravili prvo, što se isplati, a što je gubljenje vremena. Možeš ga odnijeti i bilo kojoj drugoj agenciji.',
    },
  ],
  steps: [
    { step: '01', title: 'Pošalješ link', note: 'Upišeš adresu svoje stranice i mail. Trideset sekundi posla.' },
    { step: '02', title: 'Mi analiziramo', note: 'Bruno ručno prolazi stranicu: brzina, SEO, dizajn, konverzije. Bez automatiziranih generičkih izvještaja.' },
    { step: '03', title: 'Dobiješ mail', note: 'U roku 48 sati stiže analiza s konkretnim prijedlozima. Što napraviš s njom, tvoja stvar.' },
  ],
  faqs: [
    {
      q: 'Je li analiza stvarno besplatna?',
      a: 'Da, potpuno. Nema skrivenih uvjeta ni obveze da nakon nje išta naručiš. Računamo jednostavno: ako je analiza korisna, možda nas se sjetiš kad budeš spreman za novi web. Ako ne, ostala ti je korisna lista popravaka.',
    },
    {
      q: 'Što točno dobivam?',
      a: 'Mail s analizom u četiri područja: brzina, SEO i vidljivost na Googleu, dizajn i dojam, te konverzije (koliko stranica olakšava ili otežava da ti se netko javi). Uz svako područje idu konkretni prijedlozi što popraviti prvo.',
    },
    {
      q: 'Koliko čekam na analizu?',
      a: 'Najkasnije 48 sati od prijave, obično brže. Analizu radimo ručno, pa ako se skupi više zahtjeva, može potrajati dan duže, ali stiže uvijek.',
    },
    {
      q: 'Radi li analizu čovjek ili program?',
      a: 'Čovjek. Alate koristimo za mjerenja (brzina, tehnički SEO), ali stranicu prolazi Bruno osobno i piše prijedloge za tvoj konkretan biznis, ne generički izvještaj iz alata.',
    },
    {
      q: 'Nemam još web stranicu, mogu li se svejedno javiti?',
      a: 'Možeš. U tom slučaju preskoči formu i javi se preko kontakta ili WhatsAppa, pa ćemo umjesto analize proći što bi tvom biznisu imalo smisla graditi od nule.',
    },
  ],
}
