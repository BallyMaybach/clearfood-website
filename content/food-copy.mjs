// Hand-written copy for each food page. Numbers never go in here by hand:
// {score}, {swapScore}, {sugar}, {cal}, {protein} and {goal:clear_skin} etc.
// are filled from content/scans.json, so the text always matches the scan.
//
// Every claim about skin must be covered by one of SOURCES — copied from the
// app's "Sources & science" screen (app/sources.js in Clear-Food-App). Keep it hedged: a link found in a
// study is "linked to", never "causes".

export const SOURCES = {
  aad: { title: 'Acne and your diet', by: 'American Academy of Dermatology', url: 'https://www.aad.org/public/diseases/acne/causes/diet' },
  lowgl: { title: 'A low-glycemic-load diet improves symptoms in acne vulgaris patients', by: 'Smith RN et al., Am J Clin Nutr (2007)', url: 'https://pubmed.ncbi.nlm.nih.gov/17616769/' },
  dairy: { title: 'Dairy intake and acne vulgaris: a systematic review and meta-analysis', by: 'Juhl CR et al., Nutrients (2018)', url: 'https://pubmed.ncbi.nlm.nih.gov/30096883/' },
  ages: { title: 'Advanced glycation end products (AGEs) in the diet', by: 'Uribarri J et al., J Am Diet Assoc (2010)', url: 'https://pubmed.ncbi.nlm.nih.gov/20497781/' },
  sodium: { title: 'How much sodium should I eat per day?', by: 'American Heart Association', url: 'https://www.heart.org/en/healthy-living/healthy-eating/eat-smart/sodium/how-much-sodium-should-i-eat-per-day' },
};

export const COPY = {
  milk: {
    showSwap: false, // the almond drink scores lower than milk — no honest swap
    sources: ['dairy', 'aad'],
    en: { q: 'Does milk cause acne?',
      a: 'Clear Food rates a glass of milk {score} out of 100: barely processed and high in protein. For skin, the research is less relaxed. A 2018 meta-analysis of about 78,000 children and young adults found acne was more common in those who drank more milk, skim milk included. That shows a link, not proof. If clear skin is your main goal, try two to three weeks without milk and compare.' },
    de: { q: 'Macht Milch Pickel?',
      a: 'Clear Food bewertet ein Glas Milch mit {score} von 100: kaum verarbeitet und viel Eiweiß. Für die Haut sieht die Forschung das weniger entspannt. Eine Meta-Analyse von 2018 mit rund 78.000 Kindern und jungen Erwachsenen fand: Wer mehr Milch trinkt, hat häufiger Akne, auch bei Magermilch. Das zeigt einen Zusammenhang, keinen Beweis. Wenn reine Haut dein Hauptziel ist, lass Milch zwei bis drei Wochen weg und vergleiche.' },
  },
  'milk-chocolate': {
    sources: ['lowgl', 'aad'],
    en: { q: 'Does chocolate cause acne?',
      a: 'Milk chocolate scores {score}. The problem is less the cocoa than what comes with it: {sugar} g of sugar in a 50 g bar, plus milk powder. Diets with a lot of fast sugar are linked to more acne. In a 12-week trial, young men on a low-glycemic diet had fewer spots than those who ate as usual. Dark chocolate with 85% cocoa has far less sugar and scores {swapScore}.' },
    de: { q: 'Macht Schokolade Pickel?',
      a: 'Milchschokolade kommt auf {score}. Das Problem ist weniger der Kakao als das, was dazukommt: {sugar} g Zucker in einer 50-g-Tafel, dazu Milchpulver. Viel schneller Zucker hängt mit mehr Akne zusammen. In einer 12-Wochen-Studie hatten junge Männer mit wenig schnellen Kohlenhydraten weniger Pickel als die, die normal weiteraßen. Zartbitter mit 85 % Kakao hat viel weniger Zucker und kommt auf {swapScore}.' },
  },
  'whey-protein': {
    showSwap: false, // skyr is dairy too — not a fair swap on a skin page
    sources: ['dairy', 'aad'],
    en: { q: 'Does whey protein cause acne?',
      a: 'A whey shake scores {score} in Clear Food: {protein} g of protein, almost no sugar and {goal:build_muscle} for muscle. For skin it is less clear. Whey is made from milk, and milk is linked to acne in studies of young people. For whey itself there are only small studies and case reports, no large trials. If you break out after starting whey, pausing it for a few weeks is an easy test.' },
    de: { q: 'Macht Whey Pickel?',
      a: 'Ein Whey-Shake kommt in Clear Food auf {score}: {protein} g Eiweiß, kaum Zucker und {goal:build_muscle} für Muskeln. Für die Haut ist es weniger klar. Whey wird aus Milch gewonnen, und Milch hängt in Studien mit Jugendlichen mit Akne zusammen. Zu Whey selbst gibt es nur kleine Studien und Fallberichte, keine großen Untersuchungen. Wenn du seit dem Whey mehr Pickel hast, ist eine Pause von ein paar Wochen ein einfacher Test.' },
  },
  'energy-drink': {
    sources: ['lowgl', 'aad'],
    en: { q: 'Are energy drinks bad for your skin?',
      a: 'A sugared 500 ml energy drink scores {score}. It is mostly sugar water: {sugar} g of sugar per can, which sends your blood sugar up fast. Diets heavy in fast sugar are linked to more acne, and cutting back helped in a controlled trial. Sparkling water with lemon scores {swapScore}.' },
    de: { q: 'Sind Energy Drinks schlecht für die Haut?',
      a: 'Ein gezuckerter Energy Drink mit 500 ml kommt auf {score}. Er ist vor allem Zuckerwasser: {sugar} g Zucker pro Dose, die deinen Blutzucker schnell hochtreiben. Viel schneller Zucker hängt mit mehr Akne zusammen, und weniger davon hat in einer kontrollierten Studie geholfen. Sprudelwasser mit Zitrone kommt auf {swapScore}.' },
  },
  cola: {
    sources: ['lowgl', 'aad'],
    en: { q: 'Is cola bad for acne?',
      a: 'Regular cola scores {score}, one of the lowest results we measured. A 500 ml bottle has {sugar} g of sugar and nothing else your body needs. Fast sugar in large amounts is linked to more acne. Cola zero scores {swapScore}: no sugar, but still a highly processed drink.' },
    de: { q: 'Macht Cola Pickel?',
      a: 'Normale Cola kommt auf {score}, einer der schlechtesten Werte in unserer Liste. Eine 500-ml-Flasche hat {sugar} g Zucker und sonst nichts, was dein Körper braucht. Viel schneller Zucker hängt mit mehr Akne zusammen. Cola Zero kommt auf {swapScore}: ohne Zucker, aber immer noch ein stark verarbeitetes Getränk.' },
  },
  'french-fries': {
    sources: ['ages', 'lowgl'],
    en: { q: 'Do french fries cause acne?',
      a: 'Deep-fried fries score {score}. They combine fast carbs with frying fat, and frying at high heat creates advanced glycation end products (AGEs), which are linked to inflammation in the body. The same potatoes roasted in the oven with a little olive oil score {swapScore}.' },
    de: { q: 'Machen Pommes Pickel?',
      a: 'Frittierte Pommes kommen auf {score}. Sie verbinden schnelle Kohlenhydrate mit Frittierfett, und beim Frittieren entstehen sogenannte AGEs, die mit Entzündungen im Körper in Verbindung gebracht werden. Dieselben Kartoffeln aus dem Ofen mit etwas Olivenöl kommen auf {swapScore}.' },
  },
  'white-toast': {
    sources: ['lowgl', 'aad'],
    en: { q: 'Is white bread bad for your skin?',
      a: 'Two slices of white toast score {score}. White flour is digested fast and raises your blood sugar almost like sugar itself. In a 12-week trial, young men who switched to slow carbs had fewer spots. Wholegrain rye bread scores {swapScore}.' },
    de: { q: 'Ist Toastbrot schlecht für die Haut?',
      a: 'Zwei Scheiben Toastbrot kommen auf {score}. Weißmehl wird schnell verdaut und treibt den Blutzucker fast wie Zucker selbst. In einer 12-Wochen-Studie hatten junge Männer, die auf langsame Kohlenhydrate umgestiegen sind, weniger Pickel. Vollkornbrot kommt auf {swapScore}.' },
  },
  nutella: {
    sources: ['lowgl', 'dairy'],
    en: { q: 'Is Nutella bad for acne?',
      a: 'Two tablespoons of Nutella score {score}. More than half of Nutella is sugar, and it also contains skimmed milk powder. Sugar and milk are the two food groups most often linked to acne in studies. Peanut butter made of 100% peanuts scores {swapScore}.' },
    de: { q: 'Macht Nutella Pickel?',
      a: 'Zwei Esslöffel Nutella kommen auf {score}. Mehr als die Hälfte von Nutella ist Zucker, dazu kommt Magermilchpulver. Zucker und Milch sind die zwei Lebensmittelgruppen, die in Studien am häufigsten mit Akne in Verbindung gebracht werden. Erdnussbutter aus 100 % Erdnüssen kommt auf {swapScore}.' },
  },
  'sugary-cereal': {
    sources: ['lowgl', 'aad'],
    en: { q: 'Are cornflakes bad for your skin?',
      a: 'A bowl of frosted cornflakes with milk scores {score}. Cornflakes are among the foods that raise blood sugar fastest, and the frosting adds sugar on top. Oatmeal with berries scores {swapScore}: oats release their energy much more slowly.' },
    de: { q: 'Sind Cornflakes schlecht für die Haut?',
      a: 'Eine Schüssel gezuckerte Cornflakes mit Milch kommt auf {score}. Cornflakes gehören zu den Lebensmitteln, die den Blutzucker am schnellsten hochtreiben, und die Zuckerschicht legt noch etwas drauf. Haferflocken mit Beeren kommen auf {swapScore}: Hafer gibt seine Energie viel langsamer ab.' },
  },
  'gummy-bears': {
    sources: ['lowgl', 'aad'],
    en: { q: 'Do gummy bears cause acne?',
      a: 'A 100 g bag of gummy bears scores {score}. It is almost pure sugar, {sugar} g per bag, with no fibre, fat or protein to slow it down. High-sugar diets are linked to more acne. A bowl of fresh berries scores {swapScore} and still tastes sweet.' },
    de: { q: 'Machen Gummibärchen Pickel?',
      a: 'Eine 100-g-Tüte Gummibärchen kommt auf {score}. Das ist fast reiner Zucker, {sugar} g pro Tüte, ohne Ballaststoffe, Fett oder Eiweiß, die ihn bremsen. Viel Zucker hängt mit mehr Akne zusammen. Eine Schale frische Beeren kommt auf {swapScore} und schmeckt trotzdem süß.' },
  },
  'doner-kebab': {
    sources: ['sodium', 'lowgl'],
    en: { q: 'Is doner kebab bad for your skin?',
      a: 'A doner in bread scores {score}, right in the middle. The meat brings a lot of protein, which is why muscle gets {goal:build_muscle}. The white bread, the sauce and the salt pull it down. Order it as a plate with salad and no bread and it scores {swapScore}.' },
    de: { q: 'Ist Döner schlecht für die Haut?',
      a: 'Ein Döner im Brot kommt auf {score}, genau in der Mitte. Das Fleisch bringt viel Eiweiß, deshalb gibt es für Muskeln {goal:build_muscle}. Das Weißbrot, die Soße und das Salz ziehen ihn runter. Als Dönerteller mit Salat und ohne Brot kommt er auf {swapScore}.' },
  },
  eggs: {
    sources: ['aad'],
    en: { q: 'Are eggs good for your skin?',
      a: 'Two boiled eggs score {score}, one of the best results we measured. Eggs are unprocessed, high in protein and barely affect your blood sugar. There is no good evidence that eggs cause acne. Only leave them out if you have an egg allergy or intolerance.' },
    de: { q: 'Sind Eier gut für die Haut?',
      a: 'Zwei gekochte Eier kommen auf {score}, einer der besten Werte in unserer Liste. Eier sind unverarbeitet, haben viel Eiweiß und treiben den Blutzucker kaum. Es gibt keine guten Belege dafür, dass Eier Pickel machen. Lass sie nur weg, wenn du eine Eiallergie oder Unverträglichkeit hast.' },
  },
};
