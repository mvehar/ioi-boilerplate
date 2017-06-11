Rentgenska fluorescenčna spektrometrija (XRF)
Jaka Šušteršič & Matej Vehar - FRI, UNI LJ

Spredstavitev XRF metode skozi aplikacijo.

Apliakcija je sestavljena iz delov:
 1. Uvodna stran
 2. Prikaz analize predmeta z laserjem
 3. Podproben prikaz učinka laserja na atome predmeta - animacija
 4. Prikaz analize rezultatov s senzorjev in določitev elementov
 5. Uvod v drugi del, kjer uporabnik pomaga analizirati Živine rezultate
 6. Graf z rezultati obsevanja in možnostjo, da uporabnik določi elemente
 7. Prikaz uspešnosti uporabnika pri določevanju.

Stran se po 2 minutah nektinosti na 6. strani ponastavi na prvo stran.
Stran je pripravljena v drveh jezikih: slovenščini in angleščini. 
Med jezikoma lahko preklopimo zgoraj desno. Zraven je gumb za vrnitev na začetek.

-------------------------------------------------------------------------------
Zasnova:

Aplikacija je narejena kot HTML5 spletna stran, ki jo bo pretvoriti v mobilno (hibridno) aplikacijo.
Struktura je postavljena na osnovi Bootstrap ogrodja in uporablja knjižnice jQuery za grobo upravljanje scen, L20n.js za prevode ter Graph.js za prikaz grafov.

Animacije so narejene ali z CSS3 (povečava na strani 2) oziroma z uporabo Canvas elementa in JS animacije (stran 3). Slednja je bila narejena s tem pristopom, da jo lahko sinhroniziramo z ostalimi elementi na strani (grafi, prehodi)

Aplikacija lahko poženemo samostojno z odprjem index.html v brskalniku oziroma uporabimo WebView tehnologijo (lahko z uporabo orodja Cordova) za pripravo mobilne aplikacije.
Za uporabo v muzeju priporočamo vklopa vodenega načina (Guided Access) na tablicah iPad oziroma ustreznih podobnih pristopov na ostalih napravah. S tem bo aplikacija zavzela celoten zaslon naprave ter onemogočila uporabnikom, da zapustijo aplikacijo oziroma lorabijo napravo.

Aplikacija zahteva, da je resolucija prikaza vsaj 1280x768 pikslov ali več. Hitrost animacije je odvisna od srajnih zmogljivosti naprav, predvideno je prirejena, da se na mobilnih napravah izvaja prilagojeno (večji koraki, manj tekoče).


Jaka Šušteršič & Matej Vehar

