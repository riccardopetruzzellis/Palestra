export type ExerciseDbEntry = {
  id: string;
  name: string;
  nameEn: string;
  muscleGroup: string;
  secondaryMuscles: string[];
  animationType:
    | "press"
    | "pull-down"
    | "pull-horizontal"
    | "curl"
    | "lateral-raise"
    | "front-raise"
    | "squat"
    | "lunge"
    | "deadlift"
    | "fly"
    | "extension"
    | "plank-hold"
    | "plank-side"
    | "dip"
    | "jump"
    | "crunch"
    | "leg-raise"
    | "pushdown"
    | "pullup"
    | "row"
    | "shrug"
    | "calf-raise"
    | "hip-thrust"
    | "reverse-fly";
  description: string;
  difficulty: "base" | "intermedio" | "avanzato";
};

export const exerciseDatabase: ExerciseDbEntry[] = [
  // ─────────────────────────────────────────────
  // PETTO
  // ─────────────────────────────────────────────
  {
    id: "panca-piana-bilanciere",
    name: "Panca piana bilanciere",
    nameEn: "Barbell Bench Press",
    muscleGroup: "Petto",
    secondaryMuscles: ["Tricipiti", "Spalle"],
    animationType: "press",
    description:
      "Sdraiati sulla panca, impugna il bilanciere con presa leggermente più larga delle spalle. Abbassa il bilanciere fino a sfiorare il petto, poi spingi verso l'alto mantenendo le scapole retratte e i piedi a terra.",
    difficulty: "base",
  },
  {
    id: "panca-piana-manubri",
    name: "Panca piana manubri",
    nameEn: "Dumbbell Bench Press",
    muscleGroup: "Petto",
    secondaryMuscles: ["Tricipiti", "Spalle"],
    animationType: "press",
    description:
      "Sdraiati sulla panca con un manubrio in ciascuna mano. Abbassa i manubri con i gomiti a circa 45° rispetto al busto, poi premi verso l'alto convergendo leggermente le mani verso il centro.",
    difficulty: "base",
  },
  {
    id: "panca-inclinata-bilanciere",
    name: "Panca inclinata bilanciere",
    nameEn: "Incline Barbell Press",
    muscleGroup: "Petto",
    secondaryMuscles: ["Spalle", "Tricipiti"],
    animationType: "press",
    description:
      "Panca inclinata a circa 30-45°. Impugna il bilanciere con presa media, abbassa verso la parte alta del petto e spingi verso l'alto. Enfatizza la porzione clavicolare del grande pettorale.",
    difficulty: "base",
  },
  {
    id: "panca-inclinata-manubri",
    name: "Panca inclinata manubri",
    nameEn: "Incline Dumbbell Press",
    muscleGroup: "Petto",
    secondaryMuscles: ["Spalle", "Tricipiti"],
    animationType: "press",
    description:
      "Panca inclinata a 30-45°, un manubrio per mano. Abbassa i manubri all'altezza del petto superiore con i gomiti a 45°, poi premi verso l'alto. Permette un range di movimento più ampio rispetto al bilanciere.",
    difficulty: "base",
  },
  {
    id: "panca-declinata-manubri",
    name: "Panca declinata manubri",
    nameEn: "Decline Dumbbell Press",
    muscleGroup: "Petto",
    secondaryMuscles: ["Tricipiti"],
    animationType: "press",
    description:
      "Panca declinata con i piedi bloccati. Premi i manubri verso l'alto enfatizzando la porzione sternale inferiore del grande pettorale. Mantieni le scapole retratte durante tutto il movimento.",
    difficulty: "intermedio",
  },
  {
    id: "croci-manubri",
    name: "Croci con manubri",
    nameEn: "Dumbbell Flyes",
    muscleGroup: "Petto",
    secondaryMuscles: [],
    animationType: "fly",
    description:
      "Sdraiati sulla panca piana, manubri distesi sopra il petto con gomiti leggermente flessi. Apri le braccia ad arco verso il basso finché senti un buon allungamento, poi richiudi portando i manubri verso il centro.",
    difficulty: "base",
  },
  {
    id: "croci-ai-cavi-alte",
    name: "Croci ai cavi alte",
    nameEn: "High Cable Crossover",
    muscleGroup: "Petto",
    secondaryMuscles: [],
    animationType: "fly",
    description:
      "In piedi tra i due cavi alti, impugna le maniglie e inclinati leggermente in avanti. Porta le mani verso il basso e al centro incrociandole, concentrandoti sulla contrazione del basso pettorale. Ritorna lentamente alla posizione di partenza.",
    difficulty: "intermedio",
  },
  {
    id: "croci-alte",
    name: "Croci alte",
    nameEn: "High Cable Fly / Pec Deck",
    muscleGroup: "Petto",
    secondaryMuscles: [],
    animationType: "fly",
    description:
      "Con i cavi impostati in alto o alla macchina pec deck, porta le braccia in avanti e verso il centro mantenendo una leggera flessione del gomito. Concentra la contrazione sul pettorale, evitando di usare le spalle.",
    difficulty: "base",
  },
  {
    id: "pectoral-machine",
    name: "Macchina per il petto",
    nameEn: "Chest Press Machine",
    muscleGroup: "Petto",
    secondaryMuscles: ["Tricipiti", "Spalle"],
    animationType: "press",
    description:
      "Alla macchina per il petto, regola il sedile in modo che le maniglie siano all'altezza del petto. Spingi in avanti mantenendo la schiena aderente allo schienale e i gomiti leggermente più bassi delle spalle.",
    difficulty: "base",
  },
  {
    id: "dip",
    name: "Dip",
    nameEn: "Parallel Bar Dip",
    muscleGroup: "Petto",
    secondaryMuscles: ["Tricipiti", "Spalle"],
    animationType: "dip",
    description:
      "Alle parallele, abbassa il corpo flettendo i gomiti e inclinandoti leggermente in avanti per enfatizzare il petto. Scendi finché le spalle sono sotto i gomiti, poi spingi verso l'alto. Evita oscillazioni del busto.",
    difficulty: "intermedio",
  },
  {
    id: "push-up",
    name: "Flessioni",
    nameEn: "Push-up",
    muscleGroup: "Petto",
    secondaryMuscles: ["Tricipiti", "Spalle", "Core"],
    animationType: "press",
    description:
      "In posizione plank con le mani leggermente più larghe delle spalle, abbassa il petto verso il suolo mantenendo il corpo rigido come una tavola, poi spingi verso l'alto. Varia l'inclinazione per cambiare l'enfasi sul muscolo.",
    difficulty: "base",
  },
  {
    id: "push-up-inclinato",
    name: "Flessioni su panca",
    nameEn: "Incline Push-up",
    muscleGroup: "Petto",
    secondaryMuscles: ["Tricipiti", "Spalle"],
    animationType: "press",
    description:
      "Con le mani su una panca o superficie rialzata, esegui le flessioni sfruttando l'inclinazione per aumentare il range di movimento e ridurre il carico corporeo. Ottimo per principianti o come esercizio accessorio.",
    difficulty: "base",
  },
  {
    id: "svend-press",
    name: "Svend press",
    nameEn: "Svend Press",
    muscleGroup: "Petto",
    secondaryMuscles: [],
    animationType: "press",
    description:
      "In piedi, tieni un disco tra i palmi delle mani all'altezza del petto. Spingi i palmi l'uno contro l'altro mentre estendi le braccia in avanti, poi ritorna. La tensione isometrica delle mani attiva intensamente il pettorale.",
    difficulty: "intermedio",
  },
  {
    id: "pullover-manubrio",
    name: "Pullover con manubrio",
    nameEn: "Dumbbell Pullover",
    muscleGroup: "Petto",
    secondaryMuscles: ["Dorso", "Tricipiti"],
    animationType: "pull-down",
    description:
      "Sdraiati di traverso sulla panca con le spalle appoggiate, impugna un manubrio con entrambe le mani sopra il petto. Abbassa il manubrio dietro la testa ad arco finché senti l'allungamento del petto e dei dorsali, poi ritorna.",
    difficulty: "intermedio",
  },

  // ─────────────────────────────────────────────
  // DORSO
  // ─────────────────────────────────────────────
  {
    id: "trazioni-presa-prona",
    name: "Trazioni presa prona",
    nameEn: "Pull-up",
    muscleGroup: "Dorso",
    secondaryMuscles: ["Bicipiti", "Trapezio"],
    animationType: "pullup",
    description:
      "Impugna la sbarra con presa prona (palmi verso l'esterno) leggermente più larga delle spalle. Porta il mento sopra la sbarra retraendo le scapole e attivando i dorsali. Evita oscillazioni del corpo.",
    difficulty: "avanzato",
  },
  {
    id: "trazioni-presa-supina",
    name: "Trazioni presa supina (chin-up)",
    nameEn: "Chin-up",
    muscleGroup: "Dorso",
    secondaryMuscles: ["Bicipiti"],
    animationType: "pullup",
    description:
      "Impugna la sbarra con presa supina (palmi verso di te) alla larghezza delle spalle. Porta il mento sopra la sbarra pensando di portare i gomiti verso i fianchi. I bicipiti sono più attivi rispetto alle trazioni prona.",
    difficulty: "intermedio",
  },
  {
    id: "trazioni-esplosive",
    name: "Trazioni esplosive",
    nameEn: "Explosive Pull-up",
    muscleGroup: "Dorso",
    secondaryMuscles: ["Bicipiti", "Spalle"],
    animationType: "pullup",
    description:
      "Esegui una trazione con forza massimale cercando di portare il petto alla sbarra il più rapidamente possibile. La fase concentrica esplosiva sviluppa potenza muscolare del dorsale. Mantieni il controllo nella fase di discesa.",
    difficulty: "avanzato",
  },
  {
    id: "lat-machine-presa-larga",
    name: "Lat machine presa larga",
    nameEn: "Wide-grip Lat Pulldown",
    muscleGroup: "Dorso",
    secondaryMuscles: ["Bicipiti", "Trapezio"],
    animationType: "pull-down",
    description:
      "Alla lat machine con presa larga prona, porta la barra verso il petto retraendo le scapole e pensando di portare i gomiti verso il basso e all'indietro. Mantieni il busto leggermente inclinato all'indietro.",
    difficulty: "base",
  },
  {
    id: "lat-machine-presa-neutra",
    name: "Lat machine presa neutra",
    nameEn: "Neutral-grip Lat Pulldown",
    muscleGroup: "Dorso",
    secondaryMuscles: ["Bicipiti"],
    animationType: "pull-down",
    description:
      "Usa una maniglia a V o parallela con i palmi rivolti l'uno verso l'altro. Porta la maniglia verso il petto portando i gomiti verso i fianchi. La presa neutra riduce lo stress sulle spalle e favorisce una contrazione più profonda del dorsale.",
    difficulty: "base",
  },
  {
    id: "rematore-bilanciere",
    name: "Rematore con bilanciere",
    nameEn: "Barbell Row",
    muscleGroup: "Dorso",
    secondaryMuscles: ["Bicipiti", "Trapezio", "Lombari"],
    animationType: "row",
    description:
      "Con il bilanciere impugnato a larghezza spalle, fletti le anche a circa 45° mantenendo la schiena dritta. Porta il bilanciere verso il basso addome retraendo le scapole. Evita di inarcare eccessivamente la schiena.",
    difficulty: "intermedio",
  },
  {
    id: "rematore-supporto-toracico",
    name: "Rematore con supporto toracico",
    nameEn: "Chest-supported Row",
    muscleGroup: "Dorso",
    secondaryMuscles: ["Bicipiti", "Trapezio"],
    animationType: "row",
    description:
      "Sdraiati a pancia in giù su una panca inclinata a circa 30°, impugna i manubri e porta i gomiti verso l'alto e all'indietro. Il supporto toracico elimina il compenso lombare permettendo di isolare meglio il dorsale.",
    difficulty: "base",
  },
  {
    id: "rematore-manubrio-singolo",
    name: "Rematore con manubrio singolo",
    nameEn: "Single-arm Dumbbell Row",
    muscleGroup: "Dorso",
    secondaryMuscles: ["Bicipiti", "Trapezio"],
    animationType: "row",
    description:
      "Con un ginocchio e una mano appoggiate sulla panca, porta il manubrio verso il fianco ruotando leggermente la spalla verso l'alto alla fine del movimento. Mantieni la schiena parallela al suolo.",
    difficulty: "base",
  },
  {
    id: "rematore-cavi-seduto",
    name: "Rematore ai cavi seduto",
    nameEn: "Seated Cable Row",
    muscleGroup: "Dorso",
    secondaryMuscles: ["Bicipiti", "Trapezio"],
    animationType: "row",
    description:
      "Seduto alla macchina per i cavi, impugna la maniglia a V con il busto eretto. Porta la maniglia verso l'addome retraendo le scapole, poi ritorna lentamente mantenendo il controllo. Evita di oscillare con il busto.",
    difficulty: "base",
  },
  {
    id: "stacco-da-terra",
    name: "Stacco da terra",
    nameEn: "Deadlift",
    muscleGroup: "Dorso",
    secondaryMuscles: ["Gambe", "Glutei", "Trapezio", "Avambracci"],
    animationType: "deadlift",
    description:
      "In piedi con i piedi alla larghezza delle anche, impugna il bilanciere con presa prona o mista. Mantieni la schiena dritta con le scapole retratte, spingi con le gambe e porta le anche in avanti mentre sollevi il bilanciere.",
    difficulty: "avanzato",
  },
  {
    id: "stacco-rumeno",
    name: "Stacco rumeno",
    nameEn: "Romanian Deadlift",
    muscleGroup: "Dorso",
    secondaryMuscles: ["Glutei", "Femorali"],
    animationType: "deadlift",
    description:
      "Con il bilanciere o i manubri davanti alle cosce, fletti le anche portando il busto in avanti e le mani lungo le gambe. Mantieni le ginocchia leggermente flesse e la schiena dritta. Senti l'allungamento nei femorali prima di ritornare.",
    difficulty: "intermedio",
  },
  {
    id: "face-pull",
    name: "Face pull",
    nameEn: "Face Pull",
    muscleGroup: "Dorso",
    secondaryMuscles: ["Spalle", "Trapezio"],
    animationType: "row",
    description:
      "Al cavo alto con corda, porta la corda verso il viso divorcando le due estremità all'altezza delle orecchie. Enfatizza la retrazione scapolare e la rotazione esterna della spalla. Ottimo per la salute delle spalle.",
    difficulty: "base",
  },
  {
    id: "pullover-cavo",
    name: "Pullover al cavo",
    nameEn: "Cable Pullover",
    muscleGroup: "Dorso",
    secondaryMuscles: ["Petto", "Tricipiti"],
    animationType: "pull-down",
    description:
      "In piedi di fronte al cavo alto, impugna la corda o la barra dritta. Con le braccia quasi tese, porta le mani verso le cosce descrivendo un arco. Mantieni i gomiti leggermente flessi per tutto il movimento.",
    difficulty: "intermedio",
  },
  {
    id: "t-bar-row",
    name: "Rematore T-bar",
    nameEn: "T-bar Row",
    muscleGroup: "Dorso",
    secondaryMuscles: ["Bicipiti", "Trapezio", "Lombari"],
    animationType: "row",
    description:
      "Con il petto sull'apposita macchina o con il bilanciere in un angolo, impugna la maniglia e porta il peso verso il petto retraendo le scapole. Il busto è inclinato a circa 45° rispetto al pavimento.",
    difficulty: "intermedio",
  },
  {
    id: "iperestensioni",
    name: "Iperestensioni",
    nameEn: "Back Extension / Hyperextension",
    muscleGroup: "Dorso",
    secondaryMuscles: ["Glutei", "Femorali"],
    animationType: "deadlift",
    description:
      "Al panca per le iperestensioni con le anche al bordo, abbassa il busto verso il basso poi estendi la schiena fino alla posizione neutra o leggermente oltre. Evita un'iperestensione eccessiva della colonna.",
    difficulty: "base",
  },

  // ─────────────────────────────────────────────
  // SPALLE
  // ─────────────────────────────────────────────
  {
    id: "shoulder-press-bilanciere",
    name: "Shoulder press bilanciere",
    nameEn: "Overhead Barbell Press",
    muscleGroup: "Spalle",
    secondaryMuscles: ["Tricipiti", "Trapezio"],
    animationType: "press",
    description:
      "In piedi o seduto, impugna il bilanciere all'altezza delle clavicole con presa media. Spingi verso l'alto tenendo il core attivo e la schiena diritta. Evita di inarcare eccessivamente la zona lombare.",
    difficulty: "intermedio",
  },
  {
    id: "shoulder-press-macchina",
    name: "Shoulder press macchina",
    nameEn: "Machine Shoulder Press",
    muscleGroup: "Spalle",
    secondaryMuscles: ["Tricipiti"],
    animationType: "press",
    description:
      "Seduto alla macchina per le spalle, regola il sedile in modo che le maniglie siano all'altezza delle spalle. Spingi verso l'alto senza bloccare completamente i gomiti in alto, poi ritorna controllando il peso.",
    difficulty: "base",
  },
  {
    id: "shoulder-press-manubri",
    name: "Shoulder press manubri",
    nameEn: "Dumbbell Shoulder Press",
    muscleGroup: "Spalle",
    secondaryMuscles: ["Tricipiti", "Trapezio"],
    animationType: "press",
    description:
      "Seduto su una panca con schienale, porta i manubri all'altezza delle spalle con i gomiti a 90°. Spingi verso l'alto convergendo leggermente le mani e ritorna lentamente. Mantieni il core attivo per proteggere la zona lombare.",
    difficulty: "base",
  },
  {
    id: "alzate-laterali",
    name: "Alzate laterali",
    nameEn: "Lateral Raise",
    muscleGroup: "Spalle",
    secondaryMuscles: ["Trapezio"],
    animationType: "lateral-raise",
    description:
      "In piedi con i manubri ai fianchi, alza le braccia lateralmente fino all'altezza delle spalle con i gomiti leggermente flessi. Il pollice può essere leggermente abbassato (posizione 'svuota il pollice') per ridurre il rischio di impingement.",
    difficulty: "base",
  },
  {
    id: "alzate-laterali-cavi",
    name: "Alzate laterali ai cavi",
    nameEn: "Cable Lateral Raise",
    muscleGroup: "Spalle",
    secondaryMuscles: ["Trapezio"],
    animationType: "lateral-raise",
    description:
      "In piedi di fianco al cavo basso, impugna la maniglia con la mano più lontana dal cavo. Alza il braccio lateralmente fino all'altezza della spalla. Il cavo mantiene la tensione costante per tutto il range di movimento.",
    difficulty: "base",
  },
  {
    id: "alzate-frontali",
    name: "Alzate frontali",
    nameEn: "Front Raise",
    muscleGroup: "Spalle",
    secondaryMuscles: [],
    animationType: "front-raise",
    description:
      "In piedi con i manubri davanti alle cosce, alza le braccia in avanti (presa prona o neutra) fino all'altezza delle spalle. Mantieni i gomiti quasi tesi. Enfatizza il deltoide anteriore.",
    difficulty: "base",
  },
  {
    id: "croci-inverse",
    name: "Croci inverse",
    nameEn: "Reverse Fly",
    muscleGroup: "Spalle",
    secondaryMuscles: ["Trapezio", "Dorso"],
    animationType: "reverse-fly",
    description:
      "Con il busto inclinato in avanti a circa 45° e i manubri che pendono verso il basso, apri le braccia lateralmente verso l'alto fino all'altezza delle spalle. Enfatizza il deltoide posteriore e i muscoli romboidali.",
    difficulty: "base",
  },
  {
    id: "arnold-press",
    name: "Arnold press",
    nameEn: "Arnold Press",
    muscleGroup: "Spalle",
    secondaryMuscles: ["Tricipiti"],
    animationType: "press",
    description:
      "Parti con i manubri all'altezza del petto con i palmi rivolti verso di te. Mentre spingi verso l'alto, ruota i polsi verso l'esterno fino ad avere i palmi in avanti in cima. Ritorna eseguendo il movimento inverso.",
    difficulty: "intermedio",
  },
  {
    id: "upright-row",
    name: "Rematore verticale",
    nameEn: "Upright Row",
    muscleGroup: "Spalle",
    secondaryMuscles: ["Trapezio", "Bicipiti"],
    animationType: "row",
    description:
      "In piedi con il bilanciere o i manubri davanti alle cosce, porta i pesi verso il mento tenendo i gomiti più alti delle mani. Mantieni i pesi vicino al corpo. Evita questo esercizio se hai problemi di spalla.",
    difficulty: "intermedio",
  },
  {
    id: "handstand-pushup",
    name: "Piegamenti in verticale",
    nameEn: "Handstand Push-up",
    muscleGroup: "Spalle",
    secondaryMuscles: ["Tricipiti", "Trapezio", "Core"],
    animationType: "press",
    description:
      "In verticale contro un muro, abbassa la testa verso il suolo flettendo i gomiti poi spingi verso l'alto. Richiede ottima forza delle spalle e buon controllo corporeo. Inizia con varianti facilitate se necessario.",
    difficulty: "avanzato",
  },
  {
    id: "pallof-press",
    name: "Pallof press",
    nameEn: "Pallof Press",
    muscleGroup: "Spalle",
    secondaryMuscles: ["Core", "Petto"],
    animationType: "press",
    description:
      "In piedi di fianco al cavo, impugna la maniglia con entrambe le mani all'altezza del petto. Spingi le mani in avanti fino ad estendere le braccia resistendo alla rotazione, poi ritorna. Attiva il core per resistere alla trazione laterale.",
    difficulty: "intermedio",
  },

  // ─────────────────────────────────────────────
  // BICIPITI
  // ─────────────────────────────────────────────
  {
    id: "curl-bilanciere",
    name: "Curl bilanciere",
    nameEn: "Barbell Curl",
    muscleGroup: "Bicipiti",
    secondaryMuscles: ["Avambracci"],
    animationType: "curl",
    description:
      "In piedi con il bilanciere impugnato a larghezza spalle con presa supina, porta il bilanciere verso le spalle flettendo i gomiti. Mantieni i gomiti fermi ai fianchi e non usare il momentum del busto.",
    difficulty: "base",
  },
  {
    id: "curl-manubri-alternati",
    name: "Curl manubri alternati",
    nameEn: "Alternating Dumbbell Curl",
    muscleGroup: "Bicipiti",
    secondaryMuscles: ["Avambracci"],
    animationType: "curl",
    description:
      "In piedi o seduto, porta un manubrio alla volta verso la spalla supinando il polso durante il movimento. Supina completamente il polso nella posizione alta per massimizzare la contrazione del bicipite.",
    difficulty: "base",
  },
  {
    id: "hammer-curl",
    name: "Hammer curl",
    nameEn: "Hammer Curl",
    muscleGroup: "Bicipiti",
    secondaryMuscles: ["Avambracci", "Brachiale"],
    animationType: "curl",
    description:
      "Con i manubri ai fianchi con presa neutra (palmi rivolti verso il corpo), porta i manubri verso le spalle senza ruotare il polso. Enfatizza il brachiale e il brachioradiale oltre ai bicipiti.",
    difficulty: "base",
  },
  {
    id: "curl-concentrato",
    name: "Curl concentrato",
    nameEn: "Concentration Curl",
    muscleGroup: "Bicipiti",
    secondaryMuscles: [],
    animationType: "curl",
    description:
      "Seduto, appoggia il gomito contro la coscia interna. Porta il manubrio verso la spalla in modo concentrato, massimizzando l'isolamento del bicipite. Supina il polso nella fase finale.",
    difficulty: "base",
  },
  {
    id: "curl-panca-scott",
    name: "Curl panca Scott (Preacher curl)",
    nameEn: "Preacher Curl",
    muscleGroup: "Bicipiti",
    secondaryMuscles: ["Avambracci"],
    animationType: "curl",
    description:
      "Con i tricipiti appoggiati sulla panca Scott inclinata, porta il bilanciere o i manubri verso le spalle. Il supporto elimina il movimento compensatorio, isolando il bicipite nella porzione inferiore del movimento.",
    difficulty: "intermedio",
  },
  {
    id: "curl-cavi",
    name: "Curl ai cavi",
    nameEn: "Cable Curl",
    muscleGroup: "Bicipiti",
    secondaryMuscles: ["Avambracci"],
    animationType: "curl",
    description:
      "Al cavo basso con barra dritta o EZ, porta la barra verso le spalle mantenendo i gomiti fissi ai fianchi. Il cavo garantisce tensione costante per tutto il range di movimento.",
    difficulty: "base",
  },
  {
    id: "curl-ez-bar",
    name: "Curl barra EZ",
    nameEn: "EZ-bar Curl",
    muscleGroup: "Bicipiti",
    secondaryMuscles: ["Avambracci"],
    animationType: "curl",
    description:
      "Con la barra EZ impugnata sulla presa interna o esterna, porta la barra verso le spalle. La presa semi-prona riduce lo stress sui polsi rispetto alla barra dritta mantenendo una buona attivazione del bicipite.",
    difficulty: "base",
  },
  {
    id: "curl-inverso",
    name: "Curl inverso",
    nameEn: "Reverse Curl",
    muscleGroup: "Bicipiti",
    secondaryMuscles: ["Avambracci", "Brachiale"],
    animationType: "curl",
    description:
      "Con presa prona (palmi verso il basso), porta il bilanciere o i manubri verso le spalle. L'enfasi si sposta sull'avambraccio e sul brachioradiale. Usa un carico ridotto rispetto al curl tradizionale.",
    difficulty: "intermedio",
  },

  // ─────────────────────────────────────────────
  // TRICIPITI
  // ─────────────────────────────────────────────
  {
    id: "pushdown-corda",
    name: "Push down corda",
    nameEn: "Rope Pushdown",
    muscleGroup: "Tricipiti",
    secondaryMuscles: [],
    animationType: "pushdown",
    description:
      "Al cavo alto con attacco a corda, porta le estremità verso il basso e leggermente verso l'esterno. Tieni i gomiti fermi ai fianchi per tutto il movimento e cerca la massima estensione in basso. Dividi le corde alla fine per massimizzare la contrazione.",
    difficulty: "base",
  },
  {
    id: "french-press",
    name: "French press",
    nameEn: "Skull Crusher",
    muscleGroup: "Tricipiti",
    secondaryMuscles: [],
    animationType: "extension",
    description:
      "Sdraiato sulla panca con il bilanciere EZ, abbassa il peso verso la fronte o la testa flettendo solo i gomiti. Riporta verso l'alto estendendo i gomiti. Tieni i gomiti fissi e puntati verso il soffitto.",
    difficulty: "intermedio",
  },
  {
    id: "tricipiti-corda-cavo-alto",
    name: "Estensione tricipiti cavo alto",
    nameEn: "Cable Overhead Tricep Extension",
    muscleGroup: "Tricipiti",
    secondaryMuscles: [],
    animationType: "extension",
    description:
      "Con il cavo alto dietro la testa, porta la corda verso il basso e in avanti estendendo i gomiti. Il lungo capo del tricipite è più attivato con le braccia sopra la testa.",
    difficulty: "base",
  },
  {
    id: "kickback-tricipiti",
    name: "Kickback tricipiti",
    nameEn: "Tricep Kickback",
    muscleGroup: "Tricipiti",
    secondaryMuscles: [],
    animationType: "extension",
    description:
      "Con il busto inclinato in avanti e il gomito bloccato vicino al fianco, estendi il braccio all'indietro portando il manubrio nella posizione orizzontale. Mantieni il gomito immobile per tutto il movimento.",
    difficulty: "base",
  },
  {
    id: "dip-tricipiti",
    name: "Dip su panca",
    nameEn: "Bench Dip",
    muscleGroup: "Tricipiti",
    secondaryMuscles: ["Petto", "Spalle"],
    animationType: "dip",
    description:
      "Con le mani appoggiate sul bordo della panca e le gambe estese, abbassa il corpo verso il basso flettendo i gomiti, poi spingiti verso l'alto. Tieni i gomiti ravvicinati e punta verso il basso.",
    difficulty: "base",
  },
  {
    id: "tricipiti-manubrio-sopra-testa",
    name: "Estensione tricipiti sopra la testa",
    nameEn: "Overhead Tricep Extension",
    muscleGroup: "Tricipiti",
    secondaryMuscles: [],
    animationType: "extension",
    description:
      "Seduto o in piedi con un manubrio tenuto con entrambe le mani sopra la testa, abbassa il peso dietro la nuca flettendo i gomiti, poi estendi. Mantieni i gomiti ravvicinati e puntati verso il soffitto.",
    difficulty: "base",
  },
  {
    id: "pushdown-barra",
    name: "Push down barra",
    nameEn: "Bar Pushdown",
    muscleGroup: "Tricipiti",
    secondaryMuscles: [],
    animationType: "pushdown",
    description:
      "Al cavo alto con barra dritta o EZ, porta la barra verso il basso con presa prona. Mantieni i gomiti fermi ai fianchi e completa l'estensione del gomito. Varia la presa per cambiare l'enfasi sulle teste del tricipite.",
    difficulty: "base",
  },

  // ─────────────────────────────────────────────
  // GAMBE
  // ─────────────────────────────────────────────
  {
    id: "squat-bilanciere",
    name: "Squat con bilanciere",
    nameEn: "Back Squat",
    muscleGroup: "Gambe",
    secondaryMuscles: ["Glutei", "Core", "Lombari"],
    animationType: "squat",
    description:
      "Con il bilanciere sulle spalle (posizione alta o bassa), scendi flettendo anche e ginocchia fino a quando le cosce sono parallele o sotto il parallelo. Mantieni il busto eretto e le ginocchia in linea con le dita dei piedi.",
    difficulty: "intermedio",
  },
  {
    id: "squat-goblet",
    name: "Goblet squat",
    nameEn: "Goblet Squat",
    muscleGroup: "Gambe",
    secondaryMuscles: ["Glutei", "Core"],
    animationType: "squat",
    description:
      "Tieni un manubrio o kettlebell verticalmente all'altezza del petto con entrambe le mani. Scendi in uno squat profondo mantenendo i gomiti all'interno delle ginocchia. Ottimo per apprendere la meccanica dello squat.",
    difficulty: "base",
  },
  {
    id: "leg-press",
    name: "Leg press",
    nameEn: "Leg Press",
    muscleGroup: "Gambe",
    secondaryMuscles: ["Glutei"],
    animationType: "squat",
    description:
      "Seduto alla macchina, posiziona i piedi alla larghezza delle spalle sulla pedana. Scendi lentamente fino a formare 90° al ginocchio, poi spingi la pedana lontano. Evita di bloccare le ginocchia nella posizione di estensione.",
    difficulty: "base",
  },
  {
    id: "affondi",
    name: "Affondi",
    nameEn: "Lunges",
    muscleGroup: "Gambe",
    secondaryMuscles: ["Glutei", "Core"],
    animationType: "lunge",
    description:
      "Fai un passo in avanti e abbassa il ginocchio posteriore verso il suolo mantenendo il busto eretto. Il ginocchio anteriore non deve superare la punta del piede. Ritorna alla posizione iniziale e alterna i lati.",
    difficulty: "base",
  },
  {
    id: "bulgarian-split-squat",
    name: "Bulgarian split squat",
    nameEn: "Bulgarian Split Squat",
    muscleGroup: "Gambe",
    secondaryMuscles: ["Glutei", "Core"],
    animationType: "lunge",
    description:
      "Con il piede posteriore su una panca, scendi flettendo il ginocchio anteriore verso il suolo. Mantieni il busto eretto o leggermente inclinato in avanti. Eccellente per lo sviluppo unilaterale e la mobilità dell'anca.",
    difficulty: "intermedio",
  },
  {
    id: "leg-curl-sdraiato",
    name: "Leg curl sdraiato",
    nameEn: "Lying Leg Curl",
    muscleGroup: "Gambe",
    secondaryMuscles: [],
    animationType: "curl",
    description:
      "Sdraiato a pancia in giù sulla macchina, fletti le ginocchia portando i talloni verso i glutei. Mantieni le anche a contatto con la panca e contrai i femorali nella posizione finale prima di ritornare lentamente.",
    difficulty: "base",
  },
  {
    id: "leg-extension",
    name: "Leg extension",
    nameEn: "Leg Extension",
    muscleGroup: "Gambe",
    secondaryMuscles: [],
    animationType: "extension",
    description:
      "Seduto alla macchina con le caviglie sotto il rullo, estendi le ginocchia portando i piedi verso l'alto. Contrai il quadricipite nella posizione finale prima di scendere lentamente. Evita pesi eccessivi per proteggere il ginocchio.",
    difficulty: "base",
  },
  {
    id: "sumo-squat",
    name: "Squat sumo",
    nameEn: "Sumo Squat",
    muscleGroup: "Gambe",
    secondaryMuscles: ["Glutei", "Adduttori"],
    animationType: "squat",
    description:
      "Con i piedi più larghi delle spalle e le punte ruotate verso l'esterno a circa 45°, scendi in profondità mantenendo il busto eretto. L'ampiezza della posizione enfatizza l'interno coscia e i glutei.",
    difficulty: "base",
  },
  {
    id: "hack-squat",
    name: "Hack squat",
    nameEn: "Hack Squat",
    muscleGroup: "Gambe",
    secondaryMuscles: ["Glutei"],
    animationType: "squat",
    description:
      "Alla macchina hack squat, posiziona i piedi in basso sulla pedana per enfatizzare il quadricipite. Scendi fino a 90° o oltre mantenendo la schiena aderente allo schienale, poi spingi verso l'alto.",
    difficulty: "intermedio",
  },
  {
    id: "box-jump",
    name: "Box jump",
    nameEn: "Box Jump",
    muscleGroup: "Gambe",
    secondaryMuscles: ["Glutei", "Polpacci", "Core"],
    animationType: "jump",
    description:
      "Di fronte a una box, fletti le anche e le ginocchia in preparazione, poi salta esplosivamente sulla box atterrando con entrambi i piedi con le ginocchia leggermente flesse. Scendi dalla box in modo controllato.",
    difficulty: "intermedio",
  },
  {
    id: "box-jump-monopodalico",
    name: "Box jump monopodalico basso",
    nameEn: "Single-leg Box Jump",
    muscleGroup: "Gambe",
    secondaryMuscles: ["Glutei", "Core", "Polpacci"],
    animationType: "jump",
    description:
      "Su una gamba sola, esegui un piccolo salto su una box bassa. Concentrati sull'atterraggio stabile con la singola gamba, assorbendo l'impatto attraverso caviglia, ginocchio e anca. Ottimo per lo sviluppo della potenza unilaterale.",
    difficulty: "avanzato",
  },
  {
    id: "step-up",
    name: "Step up",
    nameEn: "Step-up",
    muscleGroup: "Gambe",
    secondaryMuscles: ["Glutei", "Core"],
    animationType: "lunge",
    description:
      "Con un piede su una box o scalino, spingi con quel piede per portare il corpo verso l'alto. Porta il ginocchio opposto verso l'alto nella posizione alta, poi scendi controllando il movimento. Alterna i lati o completa le ripetizioni su un lato.",
    difficulty: "base",
  },
  {
    id: "affondi-cammino",
    name: "Affondi in cammino",
    nameEn: "Walking Lunge",
    muscleGroup: "Gambe",
    secondaryMuscles: ["Glutei", "Core"],
    animationType: "lunge",
    description:
      "Esegui affondi avanzando ad ogni passo anziché tornare alla posizione iniziale. Mantieni il busto eretto e il core attivo. Puoi aggiungere manubri per aumentare l'intensità.",
    difficulty: "intermedio",
  },

  // ─────────────────────────────────────────────
  // CORE
  // ─────────────────────────────────────────────
  {
    id: "plank",
    name: "Plank",
    nameEn: "Plank",
    muscleGroup: "Core",
    secondaryMuscles: ["Spalle", "Glutei"],
    animationType: "plank-hold",
    description:
      "In posizione prona con i gomiti sotto le spalle e i piedi sulla punta, mantieni il corpo rigido come una tavola. Attiva gli addominali, i glutei e non lasciare che i fianchi scendano o salgano. Respira normalmente.",
    difficulty: "base",
  },
  {
    id: "side-plank",
    name: "Side plank",
    nameEn: "Side Plank",
    muscleGroup: "Core",
    secondaryMuscles: ["Spalle", "Glutei"],
    animationType: "plank-side",
    description:
      "Appoggiati su un gomito con i piedi sovrapposti o uno davanti all'altro. Solleva i fianchi dal suolo mantenendo il corpo in linea retta. Attiva l'obliquo e il quadrato dei lombi. Mantieni la posizione respirando normalmente.",
    difficulty: "base",
  },
  {
    id: "dead-bug",
    name: "Dead bug",
    nameEn: "Dead Bug",
    muscleGroup: "Core",
    secondaryMuscles: [],
    animationType: "plank-hold",
    description:
      "Sdraiato sulla schiena con le braccia estese verso il soffitto e le ginocchia a 90°, abbassa simultaneamente il braccio opposto al suolo sopra la testa e la gamba opposta verso il suolo senza toccare. Mantieni la zona lombare a contatto con il suolo.",
    difficulty: "intermedio",
  },
  {
    id: "crunch",
    name: "Crunch",
    nameEn: "Crunch",
    muscleGroup: "Core",
    secondaryMuscles: [],
    animationType: "crunch",
    description:
      "Sdraiato sulla schiena con le ginocchia flesse e le mani dietro la testa, solleva le spalle dal suolo contraendo gli addominali. Evita di tirare il collo con le mani. La zona lombare resta a contatto con il suolo.",
    difficulty: "base",
  },
  {
    id: "crunch-cable",
    name: "Crunch ai cavi",
    nameEn: "Cable Crunch",
    muscleGroup: "Core",
    secondaryMuscles: [],
    animationType: "crunch",
    description:
      "In ginocchio di fronte al cavo alto con la corda dietro la nuca, fletti il busto verso il basso portando i gomiti verso le ginocchia. Contrai gli addominali nella posizione bassa prima di ritornare lentamente.",
    difficulty: "intermedio",
  },
  {
    id: "leg-raise",
    name: "Sollevamento gambe",
    nameEn: "Leg Raise",
    muscleGroup: "Core",
    secondaryMuscles: ["Flessori dell'anca"],
    animationType: "leg-raise",
    description:
      "Sdraiato sulla schiena con le mani sotto i glutei, solleva le gambe tese verso il soffitto poi abbassale lentamente senza toccare il suolo. Mantieni la zona lombare aderente al pavimento per proteggere la schiena.",
    difficulty: "intermedio",
  },
  {
    id: "hanging-knee-raise",
    name: "Hanging knee raise",
    nameEn: "Hanging Knee Raise",
    muscleGroup: "Core",
    secondaryMuscles: ["Flessori dell'anca", "Avambracci"],
    animationType: "leg-raise",
    description:
      "Appeso alla sbarra, porta le ginocchia verso il petto contraendo gli addominali. Evita di oscillare usando il momentum. Puoi ruotare le ginocchia lateralmente per coinvolgere gli obliqui.",
    difficulty: "intermedio",
  },
  {
    id: "russian-twist",
    name: "Russian twist",
    nameEn: "Russian Twist",
    muscleGroup: "Core",
    secondaryMuscles: [],
    animationType: "crunch",
    description:
      "Seduto sul pavimento con le ginocchia flesse e il busto inclinato a circa 45°, ruota il busto da un lato all'altro tenendo le mani unite o con un peso. Più inclini il busto all'indietro, più l'esercizio diventa difficile.",
    difficulty: "intermedio",
  },
  {
    id: "ab-wheel",
    name: "Ab wheel rollout",
    nameEn: "Ab Wheel Rollout",
    muscleGroup: "Core",
    secondaryMuscles: ["Spalle", "Dorsali"],
    animationType: "plank-hold",
    description:
      "In ginocchio con la ruota davanti a te, fai rotolare la ruota in avanti estendendo il corpo verso il suolo, poi ritorna usando gli addominali. Mantieni la schiena piatta e evita di inarcare la zona lombare.",
    difficulty: "avanzato",
  },
  {
    id: "plank-dinamico",
    name: "Plank dinamico",
    nameEn: "Dynamic Plank",
    muscleGroup: "Core",
    secondaryMuscles: ["Spalle", "Petto"],
    animationType: "plank-hold",
    description:
      "Parti in posizione plank sui gomiti, poi estendi un braccio alla volta portandoti in posizione plank sulle mani, poi ritorna. Mantieni i fianchi stabili evitando rotazioni laterali.",
    difficulty: "intermedio",
  },
  {
    id: "v-up",
    name: "V-up",
    nameEn: "V-up",
    muscleGroup: "Core",
    secondaryMuscles: ["Flessori dell'anca"],
    animationType: "crunch",
    description:
      "Sdraiato sulla schiena con braccia e gambe tese, solleva contemporaneamente le gambe e il busto formando una V, toccando le punte dei piedi con le mani. Torna lentamente alla posizione iniziale.",
    difficulty: "avanzato",
  },
  {
    id: "mountain-climber",
    name: "Mountain climber",
    nameEn: "Mountain Climber",
    muscleGroup: "Core",
    secondaryMuscles: ["Spalle", "Gambe"],
    animationType: "plank-hold",
    description:
      "In posizione plank sulle mani, porta alternativamente le ginocchia verso il petto in modo rapido simulando il movimento di corsa. Mantieni i fianchi bassi e il core attivo.",
    difficulty: "intermedio",
  },

  // ─────────────────────────────────────────────
  // GLUTEI
  // ─────────────────────────────────────────────
  {
    id: "hip-thrust",
    name: "Hip thrust",
    nameEn: "Hip Thrust",
    muscleGroup: "Glutei",
    secondaryMuscles: ["Femorali", "Core"],
    animationType: "hip-thrust",
    description:
      "Con le spalle appoggiate sulla panca e il bilanciere o i manubri sulle anche, spingi i fianchi verso l'alto contraendo i glutei. Tieni il mento basso e raggiungi la piena estensione dell'anca in cima prima di scendere.",
    difficulty: "base",
  },
  {
    id: "glute-bridge",
    name: "Glute bridge",
    nameEn: "Glute Bridge",
    muscleGroup: "Glutei",
    secondaryMuscles: ["Femorali", "Core"],
    animationType: "hip-thrust",
    description:
      "Sdraiato sulla schiena con le ginocchia flesse e i piedi a terra, spingi i fianchi verso l'alto contraendo i glutei nella posizione alta. È la versione a corpo libero dell'hip thrust.",
    difficulty: "base",
  },
  {
    id: "squat-sumo-glutei",
    name: "Squat sumo con manubrio",
    nameEn: "Sumo Dumbbell Squat",
    muscleGroup: "Glutei",
    secondaryMuscles: ["Gambe", "Adduttori"],
    animationType: "squat",
    description:
      "Con i piedi larghi e le punte ruotate, tieni un manubrio verticale tra le gambe. Scendi in profondità mantenendo il busto eretto, enfatizzando glutei e adduttori. Spingi le ginocchia verso l'esterno durante la salita.",
    difficulty: "base",
  },
  {
    id: "cable-kickback",
    name: "Kickback al cavo",
    nameEn: "Cable Kickback",
    muscleGroup: "Glutei",
    secondaryMuscles: ["Femorali"],
    animationType: "hip-thrust",
    description:
      "Con la cavigliera al cavo basso, inclinati leggermente in avanti e spingi la gamba all'indietro estendendo l'anca. Contrai il gluteo nella posizione finale prima di ritornare. Mantieni il core attivo per stabilizzare il busto.",
    difficulty: "base",
  },
  {
    id: "romanian-deadlift-glutei",
    name: "Stacco rumeno per i glutei",
    nameEn: "Romanian Deadlift (glute focus)",
    muscleGroup: "Glutei",
    secondaryMuscles: ["Femorali", "Lombari"],
    animationType: "deadlift",
    description:
      "Con bilanciere o manubri, fletti le anche spingendo i fianchi all'indietro. Mantieni la schiena dritta e le ginocchia leggermente flesse. Focalizza la mente sui glutei e femorali durante il movimento di ritorno.",
    difficulty: "intermedio",
  },
  {
    id: "donkey-kick",
    name: "Donkey kick",
    nameEn: "Donkey Kick",
    muscleGroup: "Glutei",
    secondaryMuscles: [],
    animationType: "hip-thrust",
    description:
      "In posizione quadrupedica, spingi un tallone verso il soffitto mantenendo il ginocchio a 90°. Contrai il gluteo nella posizione alta evitando di inarcare la zona lombare. Completa le ripetizioni su un lato prima di cambiare.",
    difficulty: "base",
  },
  {
    id: "fire-hydrant",
    name: "Fire hydrant",
    nameEn: "Fire Hydrant",
    muscleGroup: "Glutei",
    secondaryMuscles: ["Abduttori"],
    animationType: "lateral-raise",
    description:
      "In posizione quadrupedica, alza lateralmente la gamba mantenendo il ginocchio a 90° come se alzassi la zampa (da cui il nome). Questo esercizio isola il medio gluteo responsabile dell'abduzione.",
    difficulty: "base",
  },

  // ─────────────────────────────────────────────
  // POLPACCI
  // ─────────────────────────────────────────────
  {
    id: "calf-raise-in-piedi",
    name: "Calf raise in piedi",
    nameEn: "Standing Calf Raise",
    muscleGroup: "Polpacci",
    secondaryMuscles: [],
    animationType: "calf-raise",
    description:
      "In piedi con le punte dei piedi sulla pedana o sul gradino, alzati sulla punta dei piedi più in alto possibile contraendo il polpaccio, poi scendi lentamente fino all'allungamento completo. Usa anche il bilanciere o i manubri per aggiungere resistenza.",
    difficulty: "base",
  },
  {
    id: "calf-raise-seduto",
    name: "Calf raise seduto",
    nameEn: "Seated Calf Raise",
    muscleGroup: "Polpacci",
    secondaryMuscles: [],
    animationType: "calf-raise",
    description:
      "Seduto alla macchina apposita con i pesi sulle ginocchia e le punte dei piedi sulla pedana, spingi verso l'alto sollevando i talloni. La posizione seduta enfatizza il soleo rispetto al gastrocnemio.",
    difficulty: "base",
  },
  {
    id: "calf-raise-monopodalico",
    name: "Calf raise monopodalico",
    nameEn: "Single-leg Calf Raise",
    muscleGroup: "Polpacci",
    secondaryMuscles: [],
    animationType: "calf-raise",
    description:
      "In piedi su una gamba sola con la punta del piede sul bordo di un gradino, esegui il calf raise. La versione monopodalica aumenta significativamente il carico ed è ottima per correggere squilibri laterali.",
    difficulty: "intermedio",
  },
  {
    id: "jump-rope",
    name: "Salto con la corda",
    nameEn: "Jump Rope",
    muscleGroup: "Polpacci",
    secondaryMuscles: ["Core", "Spalle"],
    animationType: "jump",
    description:
      "Salta la corda atterrando sulle punte dei piedi. Mantieni i gomiti vicini ai fianchi e ruota la corda con i polsi. I polpacci lavorano intensamente per ammortizzare ogni atterraggio.",
    difficulty: "base",
  },
  {
    id: "leg-press-calf-raise",
    name: "Calf raise al leg press",
    nameEn: "Leg Press Calf Raise",
    muscleGroup: "Polpacci",
    secondaryMuscles: [],
    animationType: "calf-raise",
    description:
      "Al leg press con le punte dei piedi sul bordo inferiore della pedana, spingi con le punte estendendo le caviglie. L'angolazione della macchina permette di caricare ulteriormente rispetto ai calf raise tradizionali.",
    difficulty: "base",
  },

  // ─────────────────────────────────────────────
  // AVAMBRACCI
  // ─────────────────────────────────────────────
  {
    id: "wrist-curl",
    name: "Wrist curl",
    nameEn: "Wrist Curl",
    muscleGroup: "Avambracci",
    secondaryMuscles: [],
    animationType: "curl",
    description:
      "Seduto con gli avambracci appoggiati sulle cosce e i polsi oltre il bordo, fletti i polsi verso l'alto con il bilanciere o i manubri. Enfatizza i flessori dell'avambraccio.",
    difficulty: "base",
  },
  {
    id: "reverse-wrist-curl",
    name: "Reverse wrist curl",
    nameEn: "Reverse Wrist Curl",
    muscleGroup: "Avambracci",
    secondaryMuscles: [],
    animationType: "curl",
    description:
      "Con presa prona e gli avambracci appoggiati sulle cosce, estendi i polsi verso l'alto. Sviluppa i muscoli estensori dell'avambraccio spesso trascurati. Usa un carico leggero.",
    difficulty: "base",
  },
  {
    id: "farmers-walk",
    name: "Farmer's walk",
    nameEn: "Farmer's Walk",
    muscleGroup: "Avambracci",
    secondaryMuscles: ["Trapezio", "Core", "Gambe"],
    animationType: "shrug",
    description:
      "Impugna due manubri o kettlebell pesanti e cammina per una distanza stabilita mantenendo il busto eretto e le spalle retratte. Sviluppa la presa, il trapezio e la resistenza generale.",
    difficulty: "intermedio",
  },
  {
    id: "plate-pinch",
    name: "Plate pinch",
    nameEn: "Plate Pinch",
    muscleGroup: "Avambracci",
    secondaryMuscles: [],
    animationType: "shrug",
    description:
      "Tieni due dischi insieme con la presa a pizzico (pollice da un lato, dita dall'altro) per il maggior tempo possibile o camminando. Sviluppa specificamente la presa a pizzico.",
    difficulty: "intermedio",
  },
  {
    id: "dead-hang",
    name: "Dead hang",
    nameEn: "Dead Hang",
    muscleGroup: "Avambracci",
    secondaryMuscles: ["Dorsali", "Spalle"],
    animationType: "plank-hold",
    description:
      "Appeso alla sbarra con le braccia completamente tese, mantieni la posizione per il maggior tempo possibile. Sviluppa la forza della presa, la mobilità delle spalle e decomprime la colonna vertebrale.",
    difficulty: "base",
  },
  {
    id: "towel-pull-up",
    name: "Trazioni con asciugamano",
    nameEn: "Towel Pull-up",
    muscleGroup: "Avambracci",
    secondaryMuscles: ["Dorsali", "Bicipiti"],
    animationType: "pullup",
    description:
      "Appendi due asciugamani alla sbarra e impugnali anziché la sbarra stessa. Esegui le trazioni normalmente. Il diametro maggiore e la superficie instabile degli asciugamani sfidano intensamente la presa.",
    difficulty: "avanzato",
  },

  // ─────────────────────────────────────────────
  // TRAPEZIO
  // ─────────────────────────────────────────────
  {
    id: "shrug-bilanciere",
    name: "Shrug bilanciere",
    nameEn: "Barbell Shrug",
    muscleGroup: "Trapezio",
    secondaryMuscles: ["Avambracci"],
    animationType: "shrug",
    description:
      "In piedi con il bilanciere davanti alle cosce, alza le spalle verso le orecchie il più in alto possibile, mantieni un secondo, poi abbassa lentamente. Evita di ruotare le spalle: il movimento è verticale.",
    difficulty: "base",
  },
  {
    id: "shrug-manubri",
    name: "Shrug manubri",
    nameEn: "Dumbbell Shrug",
    muscleGroup: "Trapezio",
    secondaryMuscles: ["Avambracci"],
    animationType: "shrug",
    description:
      "Con i manubri ai fianchi, alza le spalle verso le orecchie il più possibile. I manubri permettono una presa più naturale e un range di movimento leggermente più ampio rispetto al bilanciere.",
    difficulty: "base",
  },
  {
    id: "power-shrug",
    name: "Power shrug",
    nameEn: "Power Shrug",
    muscleGroup: "Trapezio",
    secondaryMuscles: ["Gambe", "Lombari"],
    animationType: "shrug",
    description:
      "Simile allo shrug ma con una leggera flessione delle ginocchia seguita da un'estensione esplosiva per generare slancio. Permette di usare carichi maggiori per sviluppare il trapezio superiore.",
    difficulty: "avanzato",
  },
  {
    id: "face-pull-trapezio",
    name: "Face pull per trapezio",
    nameEn: "Face Pull (Trapezius Focus)",
    muscleGroup: "Trapezio",
    secondaryMuscles: ["Spalle", "Dorso"],
    animationType: "row",
    description:
      "Al cavo alto con corda, porta la corda verso il viso portando i gomiti in alto e all'indietro. Enfatizza la retrazione scapolare e il trapezio medio e inferiore. Ottimo complemento agli esercizi di spinta.",
    difficulty: "base",
  },
  {
    id: "rack-pull",
    name: "Rack pull",
    nameEn: "Rack Pull",
    muscleGroup: "Trapezio",
    secondaryMuscles: ["Dorsali", "Lombari", "Avambracci"],
    animationType: "deadlift",
    description:
      "Come lo stacco da terra ma con il bilanciere partente da una posizione rialzata (sopra le ginocchia). Permette di usare carichi molto elevati per sviluppare il trapezio superiore e la presa.",
    difficulty: "avanzato",
  },
  {
    id: "upright-row-cavi",
    name: "Rematore verticale ai cavi",
    nameEn: "Cable Upright Row",
    muscleGroup: "Trapezio",
    secondaryMuscles: ["Spalle"],
    animationType: "row",
    description:
      "Al cavo basso con barra dritta, porta la barra verso il mento mantenendo i gomiti più alti delle mani. La tensione costante del cavo rende questo esercizio più sicuro per le spalle rispetto al bilanciere.",
    difficulty: "intermedio",
  },
];

export const muscleGroups: string[] = [
  ...new Set(exerciseDatabase.map((e) => e.muscleGroup)),
];
