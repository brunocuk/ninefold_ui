// content/blog.js
// Croatian articles written for real search queries. No filler, no em dashes.

export const blogPosts = [
  {
    id: 1,
    slug: "koliko-kosta-izrada-web-stranice",
    title: "Koliko košta izrada web stranice u Hrvatskoj?",
    excerpt: "Pravi odgovor je 'ovisi', ali to ti ništa ne znači. Evo konkretnih raspona cijena za 2026., što ih diže, koji su skriveni troškovi i kako ne preplatiti.",
    category: "Web",
    author: { name: "Bruno", role: "Web", avatar: "/images/team/bruno.png" },
    publishedAt: "2026-08-12",
    readTime: "8 min čitanja",
    featured: true,
    thumbnail: "/images/blog/hr/koliko-kosta-izrada-web-stranice.webp",
    heroImage: "/images/blog/hr/koliko-kosta-izrada-web-stranice.webp",
    tags: ["Cijene", "Web stranica", "Vodič"],
    metaDescription: "Koliko košta izrada web stranice u Hrvatskoj 2026.? Konkretni rasponi cijena, skriveni troškovi i pitanja koja trebaš postaviti prije nego potpišeš.",
    content: [
      { type: "text", content: "Ovo je pitanje koje svi postavljaju, a nitko ne želi odgovoriti brojkom. Razumijemo zašto: rasponi su ogromni i svaki projekt je drugačiji. Ali ako danas tražiš ponudu za web stranicu u Hrvatskoj, zaslužuješ znati u kojem se filmu krećeš prije nego što ti netko pošalje ponudu. Evo brojki, bez uvijanja." },
      { type: "heading", level: 2, content: "Kratki odgovor: rasponi cijena u 2026." },
      { type: "list", ordered: false, items: [
        "Sam preko Wixa ili Squarespacea: 0 do 300 € godišnje, plus tvoje vrijeme",
        "Freelancer, jednostavna stranica na predlošku: 400 do 1.500 €",
        "Agencija, custom dizajn za manji biznis (5 do 10 stranica): 1.500 do 4.000 €",
        "Ozbiljnija poslovna stranica s custom funkcionalnostima: 4.000 do 8.000 €",
        "Web shop: od 2.000 € za manju trgovinu do 10.000+ za velika custom rješenja, detalje smo razložili u [vodiču za cijene web shopova](/blog/koliko-kosta-izrada-web-shopa)"
      ]},
      { type: "text", content: "Ovi rasponi vrijede za hrvatsko tržište. U Njemačkoj ili Skandinaviji pomnoži sve s dva ili tri. Ako ti netko nudi custom stranicu za 300 €, dobit ćeš predložak s promijenjenim logom. To nije nužno loše, ali trebaš znati što kupuješ." },
      { type: "heading", level: 2, content: "Što zapravo diže cijenu" },
      { type: "text", content: "Cijena weba nije misterij. Diže je nekoliko vrlo konkretnih stvari, i kad ih znaš, možeš sam kontrolirati budžet." },
      { type: "list", ordered: false, items: [
        "Custom dizajn umjesto predloška: dizajner mora nešto smisliti, ne samo posložiti",
        "Broj stranica i količina sadržaja: 5 stranica i 25 stranica nisu isti posao",
        "Funkcionalnosti: rezervacije, kalkulatori, višejezičnost, povezivanje s drugim sustavima",
        "Pisanje tekstova: netko ih mora napisati, a 'imamo mi tekstove' u praksi znači da nemate",
        "Fotografija i video: stock fotke su besplatne i vide se. Prave koštaju i vide se.",
        "Rokovi: 'treba nam za dva tjedna' uvijek košta više"
      ]},
      { type: "heading", level: 2, content: "Skriveni troškovi koje ti nitko ne spomene" },
      { type: "text", content: "Stranica nije gotova kad je gotova. Ovo su troškovi koji dolaze poslije, i bolje da ih znaš unaprijed." },
      { type: "list", ordered: false, items: [
        "Domena: 10 do 20 € godišnje",
        "Hosting: 5 do 30 € mjesečno za većinu stranica",
        "Održavanje: nadogradnje, sigurnosne zakrpe, sitne izmjene. Paketi idu od 30 do 150 € mjesečno",
        "Licence: premium dodaci, fontovi, alati za mail. Obično sitno, ali se nakupi"
      ]},
      { type: "callout", style: "tip", content: "Prije potpisa pitaj: što točno dobivam za ovu cijenu, što se naplaćuje dodatno, i čija je stranica ako se raziđemo? Ako izvođač okoliša oko zadnjeg pitanja, bježi. Stranica, domena i svi pristupi moraju biti tvoji." },
      { type: "heading", level: 2, content: "Zašto su razlike toliko velike?" },
      { type: "text", content: "Jer 'web stranica' znači sto različitih stvari. Predložak od 500 € i custom stranica od 5.000 € izgledaju slično na prvi pogled, ali razlika je u onome što ne vidiš: brzini učitavanja, tome kako stranica stoji na Googleu, kako se ponaša na mobitelu i koliko lako posjetitelja pretvara u upit. Predložak je kupljeno odijelo, custom je šivano po mjeri. Oba pokrivaju golotinju, ali ne stoje isto." },
      { type: "heading", level: 2, content: "Kad je jeftinija opcija pametna" },
      { type: "text", content: "Iskreno? Ponekad ti ne treba skupa stranica. Ako tek krećeš, testiraš ideju ili ti web služi samo kao digitalna posjetnica uz Instagram, kreni s jednostavnim rješenjem. Bolja je živa stranica od 800 € nego savršena od 6.000 € koju nikad ne naručiš. Nadogradit ćeš kad biznis to opravda. O toj odluci detaljnije pišemo u vodiču [sam, freelancer ili agencija](/blog/web-stranica-sam-freelancer-ili-agencija)." },
      { type: "heading", level: 2, content: "Kad se skuplja stranica isplati" },
      { type: "text", content: "Onog trenutka kad ti stranica treba dovoditi posao, a ne samo postojati. Brža stranica bolje rangira na Googleu i manje ljudi odustane dok se učitava. Jasnija struktura znači više upita. Ako stranica dovede dva klijenta mjesečno koje inače ne bi, razlika u cijeni se vrati za par mjeseci. To je matematika, ne prodajna priča." },
      { type: "callout", style: "info", content: "Kod nas u Ninefoldu nakon prvog razgovora dobiješ točnu cijenu, fiksnu, bez skrivenih stavki. Pogledaj što sve uključuje naša [izrada weba](/usluge/web-digitalno), a ako ti je netko poslao ponudu pa te zanima drugo mišljenje, [javi se](/contact), besplatno ćemo je pogledati." },
      { type: "heading", level: 2, content: "Za kraj" },
      { type: "text", content: "Ne postoji 'prava cijena' web stranice, ali postoji prava cijena za tvoju situaciju. Definiraj što stranica treba raditi za tvoj biznis, postavi izvođačima ista pitanja i usporedi što stvarno dobivaš, ne samo koliko košta. Najskuplja stranica je ona koju moraš platiti dvaput." }
    ]
  },

  {
    id: 2,
    slug: "zasto-web-stranica-ne-dovodi-klijente",
    title: "Zašto tvoja web stranica ne dovodi klijente (7 razloga)",
    excerpt: "Imaš stranicu, platio si je, i ništa. Upiti ne stižu. U 90% slučajeva problem je jedan od ovih sedam, i većinu možeš provjeriti sam u pet minuta.",
    category: "Web",
    author: { name: "Bruno", role: "Web", avatar: "/images/team/bruno.png" },
    publishedAt: "2026-07-30",
    readTime: "7 min čitanja",
    featured: false,
    thumbnail: "/images/blog/hr/zasto-web-stranica-ne-dovodi-klijente.webp",
    heroImage: "/images/blog/hr/zasto-web-stranica-ne-dovodi-klijente.webp",
    tags: ["Web stranica", "Konverzije", "SEO"],
    metaDescription: "Web stranica ti ne dovodi klijente? Evo 7 najčešćih razloga, kako svaki provjeriti sam i kako ga popraviti. Bez tehničkog žargona.",
    content: [
      { type: "text", content: "Ovo čujemo stalno: 'Imamo stranicu, ali ništa od nje.' Stranica postoji, netko ju je naplatio, a upita nema. Dobra vijest: uzrok je gotovo uvijek jedan od sedam problema, i svaki se da popraviti. Idemo redom, od najčešćeg." },
      { type: "heading", level: 2, content: "1. Nitko je ne posjećuje" },
      { type: "text", content: "Najbanalniji razlog i najčešći. Stranica bez posjetitelja je brošura u ladici. Provjeri: imaš li Google Analytics ili bilo kakvu statistiku? Ako je odgovor 'ne znam', to je prvi problem. Ako imaš i vidiš 50 posjeta mjesečno, jasno je zašto nema upita. Promet dolazi iz tri smjera: Google (SEO), društvene mreže i oglasi. Trebaš barem jedan koji aktivno radi." },
      { type: "heading", level: 2, content: "2. Ne zna se što nudiš u prvih 5 sekundi" },
      { type: "text", content: "Otvori svoju naslovnicu i mjeri: može li netko tko te ne poznaje u 5 sekundi reći što radiš, za koga i što treba kliknuti? Ako naslov kaže 'Dobrodošli na našu stranicu' ili 'Kvaliteta i tradicija od 1995.', odgovor je ne. Posjetitelj ne čita, posjetitelj skenira. Reci mu odmah: što, za koga, i što dalje." },
      { type: "heading", level: 2, content: "3. Spora je" },
      { type: "text", content: "Ako se stranica učitava dulje od tri sekunde, pola ljudi ode prije nego što išta vidi. Google to zna i zato spore stranice gura niže u rezultatima. Provjeri sam: upiši svoju adresu u PageSpeed Insights. Ispod 50 na mobitelu znači da gubiš i posjetitelje i pozicije. Najčešći krivci: prevelike slike, jeftin hosting i predlošci natrpani dodacima." },
      { type: "heading", level: 2, content: "4. Nema je na Googleu" },
      { type: "text", content: "Upiši u Google 'site:tvojadomena.hr'. Ako se ne pojavi ništa, Google te uopće nije indeksirao. Ako se pojavi, upiši ono što bi tvoj klijent tražio, na primjer 'frizerski salon Trešnjevka'. Nisi na prvoj stranici? Za klijenta ne postojiš. Rješenje se zove SEO i nije magija: dobra struktura, pravi naslovi, brzina i Google Business profil naprave veći dio posla. Za male biznise smo o tome napisali cijeli [vodič za lokalni SEO](/blog/lokalni-seo-vodic)." },
      { type: "heading", level: 2, content: "5. Nema jasnog poziva na akciju" },
      { type: "text", content: "Posjetitelj je pročitao što radiš i sad bi te kontaktirao. Kako? Ako mora tražiti broj telefona po footeru, izgubio si ga. Na svakoj stranici mora biti očit sljedeći korak: gumb 'Nazovi', 'Pošalji upit' ili 'Rezerviraj termin'. Jedan gumb, jasna radnja, vidljiv bez skrolanja." },
      { type: "heading", level: 2, content: "6. Na mobitelu je katastrofa" },
      { type: "text", content: "Više od 60% posjeta dolazi s mobitela, a većina vlasnika svoju stranicu gleda samo na laptopu. Otvori je sad na mobitelu: čita li se tekst bez zumiranja, može li se gumb stisnuti palcem, učitava li se brzo na mobilnim podacima? Ako ne, popravak nije kozmetika nego prioritet." },
      { type: "heading", level: 2, content: "7. Izgleda napušteno" },
      { type: "text", content: "Zadnja novost iz 2022., copyright 2021., 'uskoro više informacija'. Posjetitelj to čita kao: možda više ne rade. Povjerenje se gubi u sekundi. Ne moraš voditi blog, ali ono što piše mora biti točno i živo: radno vrijeme, cjenik, fotografije koje izgledaju kao tvoj prostor danas, a ne prije pet godina." },
      { type: "callout", style: "tip", content: "Brzi test za pet minuta: otvori PageSpeed Insights (brzina), upiši site:tvojadomena.hr u Google (indeksiranost), otvori stranicu na mobitelu (upotrebljivost) i pokaži naslovnicu nekome tko te ne poznaje na 5 sekundi pa ga pitaj čime se baviš (jasnoća). Ta četiri testa otkriju većinu problema." },
      { type: "heading", level: 2, content: "Odakle krenuti" },
      { type: "text", content: "Ne moraš popraviti svih sedam odjednom. Kreni od prometa i jasnoće: da te ljudi nađu i da odmah shvate što nudiš. To dvoje riješi 80% problema. Ostalo je fino podešavanje. A ako nakon testova zaključiš da je lakše krenuti ispočetka nego krpati, ponekad je to iskreno i jeftinija opcija. U tom slučaju pogledaj kako mi radimo [web stranice](/usluge/web-digitalno) ili se odmah [javi](/contact) pa ćemo zajedno proći kroz testove." }
    ]
  },

  {
    id: 3,
    slug: "lokalni-seo-vodic",
    title: "Lokalni SEO: kako izaći prvi na Googleu u svom gradu",
    excerpt: "Kad netko utipka 'frizer Zagreb' ili 'stolar Split', Google odluči tko dobiva posao. Evo kako se popeti na vrh lokalnih rezultata, korak po korak.",
    category: "SEO",
    author: { name: "Bruno", role: "Web", avatar: "/images/team/bruno.png" },
    publishedAt: "2026-07-14",
    readTime: "9 min čitanja",
    featured: false,
    thumbnail: "/images/blog/hr/lokalni-seo-vodic.webp",
    heroImage: "/images/blog/hr/lokalni-seo-vodic.webp",
    tags: ["SEO", "Google", "Mali biznis"],
    metaDescription: "Lokalni SEO vodič za hrvatske male biznise: Google Business profil, recenzije, optimizacija stranice i sve što treba da te nađu u tvom gradu.",
    content: [
      { type: "text", content: "Kad nekome u tvom gradu zatreba ono što radiš, on to utipka u Google i nazove nekog s prve stranice. Ako to nisi ti, posao je otišao konkurenciji koja možda radi lošije od tebe, ali je bolje posložena online. Lokalni SEO je disciplina koja to mijenja, i za male biznise je daleko najisplativiji marketing. Evo cijelog recepta." },
      { type: "heading", level: 2, content: "Prvo i najvažnije: Google Business profil" },
      { type: "text", content: "Onaj okvir s kartom, radnim vremenom i recenzijama koji se pojavi kad tražiš lokalni biznis? To je Google Business profil i on donosi više lokalnih upita nego sama stranica. Besplatan je, a većina ga vodi napola." },
      { type: "list", ordered: true, items: [
        "Preuzmi ili napravi profil na business.google.com i verificiraj ga",
        "Ispuni sve: kategoriju djelatnosti, radno vrijeme, telefon, adresu, link na stranicu",
        "Dodaj prave fotografije prostora, tima i rada. Profili s fotkama dobivaju višestruko više klikova",
        "Objavi nešto barem jednom mjesečno: novost, ponudu, primjer rada. Google voli žive profile",
        "Odgovaraj na svaku recenziju, i dobru i lošu"
      ]},
      { type: "heading", level: 2, content: "Recenzije: tvoja najjača valuta" },
      { type: "text", content: "Broj i svježina recenzija direktno utječu na poziciju u lokalnim rezultatima, a još više na odluku čovjeka koji bira između tebe i konkurenta. Sustavno traži recenzije: nakon svakog dobro odrađenog posla pošalji poruku s direktnim linkom za ostavljanje recenzije. Većina zadovoljnih klijenata rado ostavi zvjezdice, samo ih nitko ne pita." },
      { type: "callout", style: "warning", content: "Nemoj kupovati recenzije ni moliti prijatelje da pišu lažne. Google ih zna prepoznati i kazna je brutalna: profil ti može biti suspendiran, a s njim nestaje i sav trud. Deset pravih recenzija vrijedi više od pedeset kupljenih." },
      { type: "heading", level: 2, content: "Stranica koja govori Googleu gdje si" },
      { type: "text", content: "Google mora sa stranice moći pročitati čime se baviš i gdje. To znači: grad u naslovu stranice ('Frizerski salon Zagreb | Ime salona'), adresa i telefon vidljivi u footeru na svakoj stranici, i tekst koji prirodno spominje grad i kvart. Ne trebaš trpati 'Zagreb' u svaku rečenicu, dovoljno je da bude jasno gdje radiš. Kako inače izgleda stranica posložena za Google, opisali smo kod usluge [Web i aplikacije](/usluge/web-digitalno)." },
      { type: "heading", level: 2, content: "Stranica po usluzi, ne sve na jednoj" },
      { type: "text", content: "Ako radiš pet stvari, napravi pet stranica. Stolar koji ima posebne stranice za kuhinje po mjeri, ugradbene ormare i vrata rangira za svaki od tih pojmova. Stolar koji sve nabroji u jednom odlomku na naslovnici ne rangira ni za što. Svaka stranica usluge treba opis, fotografije radova i poziv na akciju. Isti princip vrijedi i za iznajmljivače: za njih smo napisali [poseban vodič za web stranice apartmana](/blog/web-stranica-za-apartmane)." },
      { type: "heading", level: 2, content: "Konzistentnost podataka" },
      { type: "text", content: "Ime, adresa i telefon moraju biti identični svugdje: na stranici, Google profilu, Facebooku, imenicima. Ako je na jednom mjestu 'Ilica 5', a na drugom 'Ilica 5/1', Googleu je to signal nesigurnosti. Sitnica koja se lako sredi u jedno popodne." },
      { type: "heading", level: 2, content: "Koliko dugo traje?" },
      { type: "text", content: "Realno: prve pomake vidiš za mjesec do dva, ozbiljne rezultate za tri do šest mjeseci. Lokalni SEO je maraton u kojem većina konkurencije uopće ne trči, pa je dovoljno hodati brže od njih. Jednom kad se popneš, pozicija se drži uz minimalno održavanje." },
      { type: "callout", style: "tip", content: "Mini checklista: verificiran i popunjen Google Business profil, 15+ pravih recenzija na koje odgovaraš, grad u naslovu stranice, zasebna stranica za svaku uslugu, isti podaci svugdje, fotke novije od godinu dana. Pola dana posla, mjeseci rezultata." },
      { type: "heading", level: 2, content: "Za kraj" },
      { type: "text", content: "Lokalni SEO nije tajna znanost, nego serija dosadnih malih poslova koje većina ne obavi. U tome je prilika: u manjim gradovima i nišama možeš do vrha čistom urednošću. Ako te i uz dobar SEO stranica izdaje, prođi kroz [7 razloga zašto stranica ne dovodi klijente](/blog/zasto-web-stranica-ne-dovodi-klijente). A ako ti se time ne da baviti, to je legitimno, samo nemoj da ti to bude razlog zašto telefon ne zvoni. [Javi se](/contact), preuzet ćemo mi." }
    ]
  },

  {
    id: 4,
    slug: "koliko-kosta-video-produkcija",
    title: "Koliko košta video produkcija u Hrvatskoj?",
    excerpt: "Od Instagram klipa do TV reklame: konkretni rasponi cijena, što točno plaćaš i zašto 'imam nećaka s dronom' ponekad jest, a ponekad nije dobra ideja.",
    category: "Video",
    author: { name: "Petar", role: "Video & Foto", avatar: "/images/team/2.webp" },
    publishedAt: "2026-06-25",
    readTime: "7 min čitanja",
    featured: false,
    thumbnail: "/images/blog/hr/koliko-kosta-video-produkcija.webp",
    heroImage: "/images/blog/hr/koliko-kosta-video-produkcija.webp",
    tags: ["Video", "Cijene", "Produkcija"],
    metaDescription: "Koliko košta video produkcija u Hrvatskoj? Rasponi cijena za social klipove, korporativne videe i reklame, plus što sve ulazi u cijenu.",
    content: [
      { type: "text", content: "Video je postao obavezan: na webu, na mrežama, na oglasima. Ali kad pitaš koliko košta, dobiješ ili šutnju ili raspon od 200 do 20.000 €. Oboje je beskorisno. Evo kako cijene stvarno izgledaju u Hrvatskoj i, važnije, što za koji novac dobiješ." },
      { type: "heading", level: 2, content: "Rasponi po tipu videa" },
      { type: "list", ordered: false, items: [
        "Social klipovi (Reels, TikTok): 100 do 300 € po klipu, znatno manje u paketu od 8 do 12 klipova mjesečno",
        "Event video (konferencija, otvorenje, vjenčanje firme): 500 do 1.500 €",
        "Korporativni ili promo video (predstavljanje firme, 1 do 3 minute): 1.500 do 5.000 €",
        "Produkt video za web shop: 300 do 1.000 € po proizvodu, ovisno o kompleksnosti",
        "Reklama za TV ili ozbiljnu online kampanju: od 5.000 € naviše"
      ]},
      { type: "text", content: "Kao i kod weba, ovo su rasponi za hrvatsko tržište i manju do srednju produkciju. Velike produkcijske kuće s glumcima, lokacijama i režiserom su sasvim druga liga i drugi budžeti." },
      { type: "heading", level: 2, content: "Što točno plaćaš?" },
      { type: "text", content: "Dan snimanja je najvidljiviji dio, ali najmanji. Pravi posao je oko njega." },
      { type: "list", ordered: false, items: [
        "Predprodukcija: scenarij, plan snimanja, lokacije, organizacija. Ovo odvaja video od snimke",
        "Snimanje: ekipa, kamere, rasvjeta, audio, dron. Dan snimanja s opremom je 400 do 800 €",
        "Montaža: na sat montaže ide 3 do 5 sati posla po minuti finalnog videa",
        "Color grading: ono zbog čega video izgleda 'kao film', a ne kao snimka s mobitela",
        "Glazba i licence: legalna glazba košta. Ona s YouTubea koju 'svi koriste' zna skinuti video s oglasa",
        "Formati: isti materijal izrezan za web, Instagram, TikTok i oglase"
      ]},
      { type: "heading", level: 2, content: "Kad je mobitel sasvim dobar" },
      { type: "text", content: "Iskreno: za dnevni sadržaj na mrežama, storyje i sirove uvide iza kulisa, dobar mobitel u rukama nekog tko zna kadrirati je odličan i besplatan. Nemoj plaćati produkciju za ono što tvoj tim može snimiti sam. Prava [video produkcija](/usluge/video-animacija) se isplati tamo gdje video predstavlja firmu: naslovnica weba, reklame u koje ulažeš oglasni budžet, video koji će gledati potencijalni klijent prije nego što ti se javi. Tu razlika u kvaliteti direktno znači razliku u povjerenju." },
      { type: "callout", style: "tip", content: "Najveća ušteda: batch snimanje. Umjesto četiri odvojena termina kroz godinu, jedan dobro isplaniran dan snimanja iz kojeg izađe promo video, hrpa social klipova i [fotografije za web](/usluge/fotografija). Predprodukciju i putne troškove platiš jednom, materijala imaš za mjesece." },
      { type: "heading", level: 2, content: "Pitanja za produkciju prije potpisa" },
      { type: "list", ordered: false, items: [
        "Što je uključeno u cijenu: koliko revizija montaže, koliko formata, čija je glazba?",
        "Tko piše scenarij i što se događa ako se ne dogovorimo oko njega?",
        "U kojem roku dobivam finalni video?",
        "Dobivam li sirove materijale i pod kojim uvjetima?",
        "Što ako na dan snimanja pada kiša?"
      ]},
      { type: "heading", level: 2, content: "Za kraj" },
      { type: "text", content: "Video nije trošak nego materijal koji radi mjesecima: na naslovnici, u oglasima, na mrežama. Zato ga gledaj kroz cijenu po mjesecu korištenja, a ne po danu snimanja. Promo video od 2.500 € koji se vrti dvije godine košta te sto eura mjesečno. Za usporedbu, toliko košta i kava dnevno, a kava ti ne dovodi klijente. Ako razmišljaš o videu, [javi se](/contact), pošteno ćemo ti reći što ti treba, a što ne." }
    ]
  },

  {
    id: 5,
    slug: "instagram-za-male-biznise",
    title: "Instagram za male biznise: koliko često objavljivati i što?",
    excerpt: "Ne trebaš objavljivati svaki dan i ne trebaš plesati na TikTok trendove. Trebaš sustav koji možeš izdržati. Evo ga, s konkretnim brojkama i primjerima.",
    category: "Društvene mreže",
    author: { name: "Petar", role: "Video & Foto", avatar: "/images/team/2.webp" },
    publishedAt: "2026-06-05",
    readTime: "8 min čitanja",
    featured: false,
    thumbnail: "/images/blog/hr/instagram-za-male-biznise.webp",
    heroImage: "/images/blog/hr/instagram-za-male-biznise.webp",
    tags: ["Instagram", "Društvene mreže", "Mali biznis"],
    metaDescription: "Koliko često objavljivati na Instagramu kao mali biznis, što objavljivati i kako znati radi li? Praktičan vodič bez marketinškog žargona.",
    content: [
      { type: "text", content: "Svaki vlasnik malog biznisa zna taj osjećaj: trebalo bi nešto objaviti, ne znaš što, pa ne objaviš ništa tri tjedna, pa objaviš tri stvari u jednom danu iz grižnje savjesti. Algoritam te navodno kažnjava, trendovi se mijenjaju svaki tjedan i svi imaju savjet. Idemo to pojednostaviti do razine koju stvarno možeš održati." },
      { type: "heading", level: 2, content: "Koliko često? Manje nego što misliš" },
      { type: "text", content: "Za mali biznis: 3 do 4 objave tjedno u feedu i storyji kad god imaš nešto stvarno za pokazati. To je to. Konzistentnost kroz mjesece bije količinu u svakom slučaju. Profil koji objavljuje tri puta tjedno godinu dana pobjeđuje onaj koji objavljuje dnevno tri tjedna pa nestane. Algoritam nagrađuje ono što ljudi gledaju i lajkaju, a ne broj objava." },
      { type: "heading", level: 2, content: "Što objavljivati: 4 vrste sadržaja" },
      { type: "text", content: "Skoro sve što mali biznis treba objavljivati spada u četiri kante. Kad znaš kante, nikad više ne buljiš u prazan ekran." },
      { type: "list", ordered: true, items: [
        "Posao iza kulisa: kako nešto nastaje, tvoj prostor, tvoje ruke u poslu. Ljudi kupuju od ljudi",
        "Rezultati: prije i poslije, gotovi radovi, zadovoljni klijenti. Dokaz da radiš ono što tvrdiš",
        "Znanje: kratki savjeti iz tvoje struke. Frizer o njezi kose, stolar o materijalima. Gradi autoritet",
        "Društveni dokaz: recenzije, poruke klijenata, brojke. Tuđe riječi uvjerljivije su od tvojih"
      ]},
      { type: "text", content: "Dobar tjedan izgleda ovako: jedan reels iza kulisa, jedan prije i poslije, jedan savjet. Storyji usput: dnevni posao, anketa, odgovori na pitanja. Nijedna od tih objava ne traži produkciju, traže naviku." },
      { type: "heading", level: 2, content: "Reels, carousel ili obična fotka?" },
      { type: "text", content: "Reels ima najveći doseg do novih ljudi, jer ga Instagram gura i onima koji te ne prate. Carousel najbolje drži pažnju postojećih pratitelja i odličan je za savjete i prije-poslije. Obična fotka je sasvim legitimna kad je fotka dobra. Ne moraš plesati niti raditi voiceover: reels od 15 sekundi kako nastaje proizvod, ubrzana snimka posla ili prije-poslije s dobrom glazbom rade odlično. A kad ti zatreba nešto ozbiljnije od mobitela, evo [koliko košta video produkcija](/blog/koliko-kosta-video-produkcija)." },
      { type: "heading", level: 2, content: "Kada objavljivati? Iskreno, nebitno" },
      { type: "text", content: "Vrijeme objave je najprecjenjenija tema u social medijima. Da, postoje sati kad je tvoja publika aktivnija, i Instagram ti ih pokaže u statistici. Ali razlika između 'dobrog' i 'lošeg' termina je mrvica u usporedbi s razlikom između dobre i loše objave. Objavi kad stigneš, bitno da objaviš." },
      { type: "callout", style: "tip", content: "Batch dan: jednom mjesečno odvoji dva sata, snimi i pripremi 10 do 12 objava unaprijed i posloži ih u raspored. Ostatak mjeseca samo objavljuješ storyje usput. Time se 'vođenje Instagrama' pretvori iz svakodnevne brige u jedan termin u kalendaru." },
      { type: "heading", level: 2, content: "Što ne raditi" },
      { type: "list", ordered: false, items: [
        "Ne kupuj pratitelje: brojka izgleda bolje, ali doseg i povjerenje padnu. Svi to vide",
        "Ne trpaj 30 hashtagova: 3 do 5 relevantnih radi jednako ili bolje",
        "Ne objavljuj radi objavljivanja: loša objava šteti više nego dan tišine",
        "Ne briši objave koje 'nisu upalile': profil je izlog, ne top lista",
        "Ne prati brojke svaki dan: gledaj mjesečni trend, dnevno je lutrija"
      ]},
      { type: "heading", level: 2, content: "Kako znati radi li?" },
      { type: "text", content: "Zaboravi lajkove kao glavnu metriku. Za biznis su bitne tri stvari: javljaju li ti se ljudi u inbox, spominju li Instagram kad te kontaktiraju ('vidjela sam na Instagramu da radite...') i raste li doseg kroz mjesece. Ako se te tri stvari miču, Instagram radi svoj posao, čak i ako lajkova nije puno. Deset pravih upita vrijedi više od tisuću lajkova. A ako želiš da cijeli ovaj sustav, od snimanja do objave, preuzme netko drugi, pogledaj kako vodimo [društvene mreže](/usluge/sadrzaj-drustvene-mreze) ili se [javi](/contact)." }
    ]
  },

  {
    id: 6,
    slug: "web-stranica-sam-freelancer-ili-agencija",
    title: "Web stranica: napraviti sam, freelancer ili agencija?",
    excerpt: "Tri puta do web stranice, tri vrlo različita iskustva. Poštena usporedba cijena, rizika i rezultata, uključujući i to kad agencija NIJE pravi izbor.",
    category: "Web",
    author: { name: "Bruno", role: "Web", avatar: "/images/team/bruno.png" },
    publishedAt: "2026-05-18",
    readTime: "7 min čitanja",
    featured: false,
    thumbnail: "/images/blog/hr/web-stranica-sam-freelancer-ili-agencija.webp",
    heroImage: "/images/blog/hr/web-stranica-sam-freelancer-ili-agencija.webp",
    tags: ["Web stranica", "Vodič", "Cijene"],
    metaDescription: "Napraviti web stranicu sam, preko freelancera ili agencije? Poštena usporedba opcija s cijenama, rizicima i savjetima kako izabrati.",
    content: [
      { type: "text", content: "Trebaš web stranicu i imaš tri puta do nje: napraviti je sam, naći freelancera ili angažirati agenciju. Svaki put ima smisla u pravoj situaciji i svaki može biti bacanje novca u krivoj. Pišemo ovo kao agencija, pa uzmi u obzir iz koje pozicije govorimo, ali obećavamo pošten pregled, uključujući i to kad mi nismo pravi izbor." },
      { type: "heading", level: 2, content: "Opcija 1: Sam (Wix, Squarespace, WordPress)" },
      { type: "text", content: "Alati za samogradnju su danas stvarno dobri. Odabereš predložak, povučeš svoje tekstove i slike, platiš 10 do 25 € mjesečno i stranica je online za vikend." },
      { type: "list", ordered: false, items: [
        "Ima smisla kad: tek krećeš, testiraš ideju, treba ti jednostavna digitalna posjetnica, budžet je ispod 500 €",
        "Prednosti: najjeftinije, odmah online, sve kontroliraš sam",
        "Mane: izgledaš kao predložak jer i jesi predložak, sporije stranice, ograničene mogućnosti, a tvoje vrijeme nije besplatno",
        "Zamka: 'napravit ću za vikend' se često pretvori u tri mjeseca nedovršene stranice"
      ]},
      { type: "heading", level: 2, content: "Opcija 2: Freelancer" },
      { type: "text", content: "Za 400 do 1.500 € dobar freelancer napravi solidnu stranicu, obično na WordPressu ili predlošku koji prilagodi tebi. Ovdje je ključna riječ 'dobar', jer je raspon kvalitete među freelancerima ogroman." },
      { type: "list", ordered: false, items: [
        "Ima smisla kad: treba ti pristojna stranica, budžet je do 1.500 €, imaš vremena sam voditi projekt",
        "Prednosti: dobar omjer cijene i kvalitete, direktna komunikacija, fleksibilnost",
        "Mane: jedan čovjek znači jedno grlo. Godišnji, bolest, novi posao, i tvoja stranica čeka",
        "Zamka: što se događa za dvije godine kad treba izmjena, a freelancer se više ne javlja?"
      ]},
      { type: "callout", style: "tip", content: "Biraš li freelancera, traži tri stvari: žive stranice koje je napravio (klikni ih, testiraj na mobitelu), dogovor tko radi izmjene nakon lansiranja, i da sve (domena, hosting, pristupi) glasi na tebe. Zadnje je najvažnije: viđali smo ljude koji su ostali bez vlastite stranice jer je sve bilo na freelancerovom računu." },
      { type: "heading", level: 2, content: "Opcija 3: Agencija" },
      { type: "text", content: "Od 1.500 € naviše dobivaš tim: dizajn koji nije predložak, razvoj, tekstove, SEO postavke i nekoga tko odgovara i sljedeće godine. Plaćaš više jer više ljudi radi na tvom projektu i jer ostaju dostupni nakon lansiranja. Detaljne raspone cijena po opcijama razložili smo u članku [koliko košta izrada web stranice](/blog/koliko-kosta-izrada-web-stranice), a kako to izgleda kod nas piše na stranici [Web i aplikacije](/usluge/web-digitalno)." },
      { type: "list", ordered: false, items: [
        "Ima smisla kad: stranica ti treba dovoditi posao, a ne samo postojati; želiš jednog partnera za web, a možda i video i mreže",
        "Prednosti: sve na jednom mjestu, kvaliteta i brzina izvedbe, dugoročna podrška, odgovornost",
        "Mane: najskuplja opcija, a loših agencija ima jednako kao i loših freelancera",
        "Zamka: velike agencije malom klijentu znaju dodijeliti juniora i account managera, pa plaćaš seniorske cijene za juniorski rad"
      ]},
      { type: "heading", level: 2, content: "Kako odlučiti u dvije minute" },
      { type: "list", ordered: false, items: [
        "Budžet ispod 500 € ili tek testiraš ideju: napravi sam i ne razmišljaj previše",
        "Budžet do 1.500 € i imaš vremena voditi projekt: dobar freelancer",
        "Stranica ti je alat za dovođenje posla i želiš da netko preuzme brigu: agencija",
        "U svakom slučaju: domena i pristupi na tvoje ime, uvijek, bez iznimke"
      ]},
      { type: "heading", level: 2, content: "Za kraj, pošteno" },
      { type: "text", content: "Ne treba svima agencija. Ako ti je web sporedna stvar, kreni jeftinije i nadogradi kasnije, to je pametan put. Ali ako računaš da će ti stranica dovoditi klijente, gledaj je kao ulaganje s povratom, a ne kao trošak koji treba minimizirati. Najskuplji web je onaj koji plaćaš dvaput: prvo jeftino, pa onda opet, ispravno. Ako si u fazi odlučivanja, [javi se](/contact), pošteno ćemo ti reći trebaš li nas uopće." }
    ]
  },

  {
    id: 7,
    slug: "koliko-kosta-izrada-web-shopa",
    title: "Koliko košta izrada web shopa u Hrvatskoj?",
    excerpt: "Web shop nije web stranica s košaricom. Evo stvarnih raspona cijena za 2026., troškova koji dolaze tek nakon lansiranja i računice kad se shop uopće isplati.",
    category: "Web",
    author: { name: "Bruno", role: "Web", avatar: "/images/team/bruno.png" },
    publishedAt: "2026-08-27",
    readTime: "8 min čitanja",
    featured: false,
    thumbnail: "/images/blog/hr/koliko-kosta-izrada-web-shopa.webp",
    heroImage: "/images/blog/hr/koliko-kosta-izrada-web-shopa.webp",
    tags: ["Web shop", "Cijene", "Vodič"],
    metaDescription: "Koliko košta izrada web shopa u Hrvatskoj 2026.? Konkretni rasponi cijena, troškovi koje nitko ne spomene i kako znati koja opcija ima smisla za tebe.",
    content: [
      { type: "text", content: "Web shop je najčešće krivo shvaćen proizvod u cijelom webu. Ljudi ga zamišljaju kao običnu stranicu s košaricom, pa se iznenade i cijenama i poslom koji dolazi poslije. Zato krenimo od brojki, a onda pošteno o svemu što uz njih ide. Ako te zanimaju cijene običnih stranica, njih smo razložili u članku [koliko košta izrada web stranice](/blog/koliko-kosta-izrada-web-stranice)." },
      { type: "heading", level: 2, content: "Kratki odgovor: rasponi cijena u 2026." },
      { type: "list", ordered: false, items: [
        "Sam preko Shopifya ili Wixa: 30 do 50 € mjesečno plus provizije, i tvoje vrijeme",
        "Gotova tema na WooCommerceu preko freelancera: 500 do 1.500 €",
        "Manja custom trgovina (do 30-ak proizvoda, kartično plaćanje, dostava): 1.500 do 4.000 €",
        "Shop po mjeri s custom dizajnom i integracijama: 4.000 do 10.000 €",
        "Veliki shopovi, ERP i sinkronizacija skladišta: od 10.000 € naviše"
      ]},
      { type: "text", content: "Kao i kod stranica, rasponi su za hrvatsko tržište. Razlika između najjeftinije i najskuplje opcije nije u tome ima li shop košaricu, nego u svemu oko nje: brzini, dizajnu, tome kako ga Google rangira i koliko posla imaš ti kao vlasnik." },
      { type: "heading", level: 2, content: "Što zapravo diže cijenu" },
      { type: "list", ordered: false, items: [
        "Broj proizvoda i varijanti: 15 proizvoda i 500 proizvoda s veličinama i bojama nisu isti posao",
        "Načini plaćanja: kartice, pouzeće, virman. Svaka integracija se postavlja i testira",
        "Dostava: zone, cjenici dostavljača, praćenje pošiljki",
        "Opisi i fotografije proizvoda: netko ih mora napisati i snimiti, a to je često pola posla",
        "Integracije: računovodstvo, fiskalizacija, newsletteri, skladište",
        "Edukacija: shop vodiš ti, pa moraš znati unositi proizvode i obrađivati narudžbe"
      ]},
      { type: "heading", level: 2, content: "Troškovi koji dolaze tek nakon lansiranja" },
      { type: "text", content: "Kod web shopa je ovo važnije nego kod obične stranice, jer shop je živ sustav, a ne brošura." },
      { type: "list", ordered: false, items: [
        "Provizije na kartično plaćanje: tipično 1,5 do 3% po transakciji",
        "Hosting i domena: 10 do 40 € mjesečno za većinu shopova",
        "Održavanje i nadogradnje: 30 do 150 € mjesečno, ovisno o opsegu",
        "Licence za teme i dodatke ako si na gotovoj platformi",
        "Marketing: shop bez posjetitelja je skladište. Računaj na budžet za oglase ili SEO"
      ]},
      { type: "callout", style: "warning", content: "Najčešća greška koju viđamo: sav budžet ode na izradu, a za dovođenje kupaca ne ostane ništa. Bolji je jednostavniji shop plus budžet za oglase nego savršen shop na koji nitko ne dolazi." },
      { type: "heading", level: 2, content: "Shopify, WooCommerce ili custom?" },
      { type: "text", content: "Shopify je najbrži put do prve prodaje: mjesečna pretplata, sve uključeno, ali plaćaš provizije i izgledaš kao tema koju su kupili i drugi. WooCommerce je fleksibilniji i jeftiniji dugoročno, ali traži održavanje i zna se raspasti nakon nadogradnji. Custom shop najviše košta na početku, ali je najbrži, izgleda kao tvoj brend i nema mjesečnih provizija platformi. Nijedna opcija nije univerzalno najbolja, ovisi o fazi u kojoj je tvoj biznis." },
      { type: "heading", level: 2, content: "Kad je gotova platforma pametan izbor" },
      { type: "text", content: "Ako tek testiraš hoće li tvoj proizvod uopće prodavati online, kreni sa Shopifyem ili čak Instagramom i pošalji ljude na plaćanje pouzećem. Nemoj trošiti tisuće eura dok ne znaš da potražnja postoji. Shop se uvijek može nadograditi kad brojke to opravdaju." },
      { type: "heading", level: 2, content: "Kad se custom shop isplati" },
      { type: "text", content: "Kad znaš da prodaješ i kad ti provizije, sporost ili izgled gotove teme počnu jesti maržu i povjerenje. Brži shop znači manje napuštenih košarica, bolji Google znači besplatne posjete, a dizajn po mjeri znači da te se kupci sjećaju. Ako shop napravi par tisuća eura prometa mjesečno, razlika u konverziji od jedan posto plaća razliku u cijeni za koju godinu dana, a često i puno prije." },
      { type: "callout", style: "info", content: "Kod nas u Ninefoldu [izrada web shopa](/izrada-web-shopa) kreće od 1.990 € za mini trgovinu s kartičnim plaćanjem i edukacijom, a shop po mjeri od 3.990 €. Cijena je fiksna i poznata prije početka. Ako već imaš ponudu i želiš drugo mišljenje, [javi se](/contact), besplatno ćemo je pogledati." },
      { type: "heading", level: 2, content: "Pitanja koja postavi prije potpisa" },
      { type: "list", ordered: false, items: [
        "Tko unosi proizvode i koliko ih je uključeno u cijenu?",
        "Što je s provizijama: koliko ide platformi, a koliko kartičaru?",
        "Čiji je shop, domena i svi pristupi ako se raziđemo?",
        "Uključuje li cijena edukaciju za vođenje narudžbi?",
        "Koliko košta održavanje i što točno pokriva?"
      ]},
      { type: "heading", level: 2, content: "Za kraj" },
      { type: "text", content: "Web shop nije trošak izrade nego biznis s vlastitom matematikom: koliko košta posjetitelj, koliko ih kupi i koliko zaradiš po narudžbi. Izrada je samo ulaznica. Zato biraj opciju po fazi u kojoj jesi: testiraš li ideju, kreni jeftino; prodaješ li ozbiljno, kupi alat koji prodaje bolje od konkurencije. I u oba slučaja, prije potpisa postavi ista pitanja svima i usporedi što stvarno dobivaš." }
    ]
  },

  {
    id: 8,
    slug: "web-stranica-za-apartmane",
    title: "Web stranica za apartmane: isplati li se uz Booking i Airbnb?",
    excerpt: "Platformama daješ 15 posto od svake rezervacije. Evo računice kad se vlastita stranica isplati, što mora imati da donosi direktne rezervacije i koliko košta.",
    category: "Web",
    author: { name: "Bruno", role: "Web", avatar: "/images/team/bruno.png" },
    publishedAt: "2026-08-28",
    readTime: "7 min čitanja",
    featured: false,
    thumbnail: "/images/blog/hr/web-stranica-za-apartmane.webp",
    heroImage: "/images/blog/hr/web-stranica-za-apartmane.webp",
    tags: ["Apartmani", "Turizam", "Web stranica"],
    metaDescription: "Izrada web stranice za apartmane: kada se isplati uz Booking i Airbnb, što stranica mora imati da donosi direktne rezervacije i koliko košta u 2026.",
    content: [
      { type: "text", content: "Iznajmljuješ apartman, gosti dolaze preko Bookinga i Airbnb-a, i sve funkcionira. Pa čemu onda vlastita stranica? Zbog jedne brojke koju plaćaš svake godine, a ne vidiš je na računu: provizije. Platforme uzimaju 15-ak posto od svake rezervacije, i to zauvijek. Vlastita stranica je jednokratni trošak koji tu brojku počinje smanjivati od prvog gosta. Idemo kroz računicu, pa pošteno o tome kad se isplati, a kad ne." },
      { type: "heading", level: 2, content: "Računica koju možeš napraviti večeras" },
      { type: "text", content: "Uzmimo apartman sa 150 noćenja godišnje po prosječnih 90 €. To je 13.500 € prometa, od čega platformama ode oko 2.000 € svake godine. Ako vlastita stranica preusmjeri samo trećinu rezervacija na direktne, ušteda je 600 do 700 € godišnje, i to bez računanja gostiju koji se vrate iduće ljeto i rezerviraju direktno jer te sad znaju. Stranica koja košta 1.300 do 2.000 € vrati se u dvije sezone, a radi za tebe deset. Uvrsti svoje brojke i vidi gdje si." },
      { type: "heading", level: 2, content: "Zašto stranica, ako već imaš Booking?" },
      { type: "list", ordered: false, items: [
        "Provizija: svaka direktna rezervacija je 15% više u tvom džepu",
        "Gost je tvoj: imaš njegov mail i broj, pa ga iduće godine pozoveš direktno, ne preko posrednika",
        "Gosti te ionako guglaju: nakon što te vide na Bookingu, traže te po imenu da provjere jesi li stvaran. Ako ne nađu ništa, dio ih odustane",
        "Cjenovna sloboda: na stranici možeš dati popust za direktnu rezervaciju koji je platformama zabranjen",
        "Ne ovisiš o tuđim pravilima: platforme mijenjaju uvjete, provizije i algoritam kad žele. Stranica je tvoja"
      ]},
      { type: "heading", level: 2, content: "Što stranica za apartmane mora imati" },
      { type: "list", ordered: false, items: [
        "Fotografije koje prodaju: gost bira očima. Profesionalne fotke su najisplativija stavka cijelog projekta",
        "Kalendar dostupnosti povezan s platformama (iCal sinkronizacija), da ne dobivaš upite za zauzete termine",
        "Rezervacija u dva klika: forma, WhatsApp ili telefon. Svaki dodatni korak košta te gosta",
        "Višejezičnost: minimalno engleski i njemački, ovisno o tome tko ti dolazi",
        "Lokacija s mini vodičem: udaljenost do plaže, parking, restorani. Gost to ionako pita porukom",
        "Recenzije: prenesi ocjene i citate s Bookinga, to je dokaz koji gost traži",
        "Brzina na mobitelu: gosti pretražuju s mobitela, često na roamingu. Spora stranica znači izgubljena rezervacija"
      ]},
      { type: "callout", style: "tip", content: "Najjeftiniji marketing za direktne rezervacije: QR kod stranice u apartmanu i poruka gostu na odlasku da za sljedeći boravak rezervira direktno uz 10% popusta. Platforma je dovela gosta jednom, svaki sljedeći dolazak je tvoj." },
      { type: "heading", level: 2, content: "Kako te gosti nalaze na Googleu" },
      { type: "text", content: "Pretrage tipa 'apartmani Vodice' ili 'apartman s bazenom Pelješac' su tvoje tržište. Za njih se boriš dobrim naslovima, tekstom koji spominje mjesto i Google Business profilom s recenzijama, isto ono što radi svaki lokalni biznis. Cijeli recept smo raspisali u [vodiču za lokalni SEO](/blog/lokalni-seo-vodic). Jedno je kod apartmana posebno važno: tajming. Googleu trebaju mjeseci da novu stranicu počne ozbiljno rangirati, a gosti počinju rezervirati već u proljeće. Stranica koja se radi zimi stigne na vrijeme, ona koja se radi u svibnju hvata iduću sezonu." },
      { type: "heading", level: 2, content: "Koliko košta web stranica za apartmane?" },
      { type: "list", ordered: false, items: [
        "Predložak preko freelancera, galerija i kontakt forma: 400 do 1.000 €",
        "Custom stranica s višejezičnošću i kalendarom dostupnosti: 1.200 do 2.500 €",
        "S online plaćanjem i channel managerom za više jedinica: 2.500 do 4.500 €"
      ]},
      { type: "text", content: "Rasponi su za hrvatsko tržište, a što točno diže cijenu i koja skrivena pitanja postaviti izvođaču, razložili smo u [vodiču kroz cijene izrade web stranica](/blog/koliko-kosta-izrada-web-stranice)." },
      { type: "callout", style: "info", content: "Kod nas u Ninefoldu [izrada web stranica](/izrada-web-stranica) kreće od 1.290 €, s fiksnom cijenom poznatom prije početka. Višejezičnost i povezivanje kalendara dogovorimo unaprijed, a znamo snimiti i fotke i video apartmana. [Javi se](/contact) pa ćemo zajedno proći tvoju računicu." },
      { type: "heading", level: 2, content: "Kad ti stranica iskreno ne treba" },
      { type: "text", content: "Ako imaš jedan apartman koji se svake godine popuni preko platformi do zadnjeg termina, gosti ti se vraćaju preko Bookinga i ne planiraš širiti posao, stranica ti neće promijeniti život. Provizija je tada cijena mira i to je legitiman izbor. Stranica počinje imati smisla kad imaš više jedinica, kad računica provizija pređe tisuću eura godišnje, ili kad gradiš brend koji želiš da traje dulje od tvog profila na tuđoj platformi." },
      { type: "heading", level: 2, content: "Za kraj" },
      { type: "text", content: "Booking i Airbnb su odličan kanal i nemoj ih gasiti, oni dovode goste koje sam nikad ne bi dosegnuo. Ali svaki gost koji dođe drugi put preko njih je provizija koju si platio nepotrebno. Vlastita stranica je alat koji prvi dolazak pretvara u direktan odnos: ti, gost, i nula posrednika između. Izračunaj svoje brojke, pa odluči. Matematika je obično jasnija nego što se čini." }
    ]
  }
]
