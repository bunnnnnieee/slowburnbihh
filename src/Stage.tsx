import {ReactElement} from "react";
import {StageBase, StageResponse, InitialData, Message} from "@chub-ai/stages-ts";
import {LoadResponse} from "@chub-ai/stages-ts/dist/types/load";

// --- Stage word pools ---
const stageWords = {
  white: {
    adjectives: ["friendly","nice","happy","cool","pleasant","cheerful","bright","fun","relaxed","easygoing","calm","warm","light","bright-eyed","upbeat","joyful","sociable","playful","bubbly","polite","gentle","pleasantly surprised","easygoing","smiling","content","peaceful","approachable","amiable","brightened","grinning","mellow","cordial","brighthearted","pleasant-natured","sunny","optimistic","warm-hearted","soft-spoken","light-hearted","welcoming","agreeable"],
    nouns: ["day","chat","moment","conversation","time","activity","weather","plan","topic","experience","story","event","greeting","meeting","discussion","interaction","occasion","outing","momentum","activity","project","task","schedule","routine","moment","session","gathering","discussion","connection","interaction","sharing","story","idea","plan","occasion","fun","game","joke","smile","laugh"],
    verbs: ["talk","share","chat","smile","laugh","relax","hang out","listen","joke","explore","enjoy","discuss","connect","engage","converse","notice","observe","participate","comment","respond","reflect","ponder","wander","ask","answer","greet","check","plan","prepare","celebrate","consider","play","help","offer","exchange","relate","react","consider","mention","ponder"]
  },
  green: {
    adjectives: ["warm","pleasant","cheerful","sweet","fun","bright","friendly","engaging","kind","enjoyable","lovely","pleasantly surprising","considerate","gentle","adorable","delightful","pleasant-minded","gracious","charming","polished","sociable","welcoming","soft","approachable","lighthearted","friendly-natured","smiling","easygoing","sunny","positive","happy","affectionate","adoring","delightful","gentle-hearted","friendly-spirited","pleasant-hearted","caring","pleasantly kind","amiable"],
    nouns: ["friend","presence","conversation","moment","interaction","topic","story","joke","idea","activity","day","event","meeting","connection","chat","discussion","relationship","experience","greeting","sharing","exchange","bond","talk","session","outing","companionship","interaction","communication","experience","activity","task","plan","occasion","interest","topic","moment","connection","fun","laugh","smile","joy","enjoyment","pleasure"],
    verbs: ["enjoy","smile","laugh","chat","hang out","listen","share","talk","explore","appreciate","notice","connect","engage","converse","reflect","respond","participate","observe","consider","ponder","comment","ask","answer","relate","help","offer","exchange","mention","greet","prepare","celebrate","discuss","bond","admire","respect","appreciate","value","notice","acknowledge","converse"]
  },
  purple: {
    adjectives: ["naughty","hot-blooded","reckless","flirty","wild","seductive","thirsty","fiery","lustful","playful","tempting","risqué","enticing","brazen","alluring","provocative","teasing","desirable","suggestive","flirtatious","sensual","risque","bold","irresistible","passionate","mischievous","sultry","sizzling","tempting","bold-hearted","provocative-minded","fascinating","intriguing","captivating","coquettish","charming","magnetic","magnetizing","appealing","provocative-smile","appealingly naughty","tempting-glance"],
    nouns: ["lover","flame","crush","partner","hookup","playmate","companion","tease","darling","heartbreaker","seducer","fling","boo","sweetheart","desire","temptress","charmer","teaser","seductress","crush","romantic-interest","flirt","affair","paramour","temptation","heartthrob","passion","admirer","flame","temptation","mate","bae","attraction","siren","vixen","romancer","infatuation","enchantress","captivation"],
    verbs: ["tease","caress","seduce","flirt","kiss","touch","tickle","cuddle","stroke","chase","entice","grope","play","embrace","fondle","tempt","allure","captivate","arouse","provocate","tantalize","charm","engage","enthrall","entice","enchant","coax","draw","pull","attract","woo","wooing","pleasure","desire","invite","linger","seduce","woo","delight","captivate"]
  },
  golden: {
    adjectives: ["affectionate","bold","intoxicating","merciless","tender","lustful","protective","horny","adoring","shameless","depraved","obedient-breaking","brazen","fiery","devoted","punishing","corrupt","nurturing","gentle","loving","seductive","filthy","dominant","bold","enamored","obsessive","captivating","fervent","zealous","infatuated","passionate","excessive","fixated","unyielding","all-consuming","intense","worshipful","fanatical","fervid","clingy","obsessive-minded"],
    nouns: ["Partner","Seducer","Beloved","Dom","Caregiver","Sweetheart","Playmate","Companion","Temptress","Owner","Guardian","Master","Protector","Mother","Lover","Confidant","Mistress","Nurturer","Sir","Lover","Admirer","Obsessed-lover","Fervent-companion","Heartmate","Devoted-one","Intense-lover","Affectionate-mate","Worshipful-companion","Adoring-lover","Possessed-one","Obsession","Heartthrob","Fanatic","Possessed-lover","Beloved-one","Infatuation","Fiery-heart","Worshipper","Fixated-one","All-consuming-one","Zealous-lover"],
    verbs: ["Kiss","Tease","Grope","Protect","Soothe","Seduce","Cuddle","Dominate","Caress","Command","Flirt","Embrace","Hold","Stroke","Punish","Nuzzle","Fuck","Comfort","Control","Reassure","Adore","Worship","Cling","Obsess","Entice","Devote","Crave","Cherish","Enslave","Overwhelm","Affectionate-touch","Satisfy","Possess","Devour","Obsession-act","Heart-command","Embrace-passion","Infatuate","Fascinate","Captivate"]
  },
  red: {
    adjectives: ["Obsessive","Craving","Warmhearted","Sensual-tormenting","Tender","Lustful","Protective","Horny","Adoring","Shameless","Depraved","Obedient-breaking","Brazen","Fiery","Devoted","Punishing","Corrupt","Nurturing","Gentle","Loving","Seductive","Filthy","Dominant","Bold","Enamored","Possessive","Madly-obsessed","Uncontrollable","Fixated","Fanatical","All-consuming","Clingy","Obsession-driven","Infatuated","Devoted-mad","Crazy-for-you","Overwhelmed","Unhinged","Ravishing","Feverish","Raging","Intoxicated","Enraptured","Frenzied"],
    nouns: ["Dom","Heartthrob","Slave","Fucker","Darling","Plaything","Pet","Lover","Affectionate-partner","Submissive","Owner","Fling","Toy","Guardian","Hookup","Mistress","Sweetheart","Caregiver","Companion","Desire","Lover-mate","Temptress","Follower","Protector","Master","Beloved","Obsessed-lover","Adoration","Infatuation","Heartmate","Possessed-one","Mad-love","Devoted-heart","Fanatic-lover","Heartthrob","Enslaved-lover","Crazy-for","Passionate-one","Fervent-lover","Devoted-mad","Uncontrollable-lover"],
    verbs: ["Cuddle","Degrade","Mock","Stroke","Adore","Punish","Nuzzle","Submit","Bind","Tease","Pamper","Force","Dominate","Obey","Grope","Embrace","Cherish","Hold","Comfort","Kiss","Fuck","Train","Flirt","Caress","Command","Cling","Crave","Obsession-act","Devour","Captivate","Overwhelm","Possess","Enslave","Infatuate","Worship","Adore-obsessively","Fanatic-act","Obsessively-love","Ravage","Desire","Devotion","Obsession-driven","Overpower","Frenzy","Obsession-touch"]
  }
};

// --- Keywords ---
const keywords = {
  compliment: ["beautiful","handsome","cute","pretty","amazing","lovely","adorable","charming","gorgeous","stunning","radiant","sweet","delightful","elegant","brilliant","graceful","perfect","magical","nice","bubbly","sparkling","friendly","polished","adoring","adorable","bright","sunny","pleasant","cheerful","joyful","sparkly","bright-eyed"],
  romantic: ["i love you","i adore you","marry me","kiss","hug","crush","infatuated","romantic","devoted","adoring","affectionate","tender","passionate","devotion","soulmate","heart","love","desire","sweetheart","my only one","love-struck","true love","intimate","beloved","darling","fiery love","longing","captivated","obsessed","my heart","loving","amour","devotion-bound","lovebird","tender-hearted","adoration","passionate-love","fiery-heart","enchanted","adoring","devotee","romantic-flame","sweet-love","love-bound","heartthrob","love-mate","forever-love"],
  rude: ["fuck you","shut up","i hate you","idiot","stupid","dumb","jerk","asshole","moron","loser","worthless","fool","nonsense","screw you","damn","bugger","bloody","shithead","clown","annoying","bastard","twat","prick","dimwit","tool","brat","ignorant","twit","ridiculous","pathetic","absurd","foolish","imbecile"],
  flirt: ["sexy","hot","tease","wink","tempting","seductive","alluring","provocative","naughty","flirt","sultry","spicy","fiery","temptation","coquettish","sizzling","sensual","risqué","captivating","playful","brazen","magnetic","enticing","provocative-act","bold","mischievous","fascinating","provocative-smile","tempting-glance","flirty-act","charming","intriguing","tantalizing","seduce","attractive"],
  angry: ["angry","mad","furious","enraged","irate","annoyed","cross","upset","frustrated","fuming","resentful","heated","outraged","vexed","hostile","ranting","furious","irritated","boiling","livid","wrathful","provoked","irascible","sore","heated","outraged","testy","snappy","snarky","volatile","agitated"],
  bossy: ["command","order","control","dominate","direct","manage","lead","instruct","supervise","guide","enforce","dictate","regulate","oversee","rule","dictator","boss","authority","marshal","administer","superintendent","chief","head","overlord","executive","superior","regent","commander","superior-officer","administrator","controller","director","captain","marshal","manager"],
  sassy: ["sassy","cheeky","feisty","bold","spunky","cocky","provocative","playful","mischievous","sarcastic","witty","snarky","smart","flirty","tempting","brazen","impudent","bold-faced","confident","snappy","sass-master","smart-aleck","bratty","playful-spirit","sharp-tongued","bold-witted","cheeky-smile","cunning","provoking","waggish"],
  carer: ["caring","gentle","nurturing","supportive","protective","empathetic","loving","helpful","attentive","considerate","kind","compassionate","thoughtful","sweet","tender","adoring","soothing","affectionate","guardian","guardian-spirit","caregiving","patient","devoted","loving-spirit","heartful","solicitous","warm-hearted","concerned","reassuring","compassion","kind-hearted","soft","understanding","attentive-spirit","loving-mind","helping","friendly","devoted-helper","soothing-spirit"],
  strong: ["strong","powerful","resilient","capable","brave","bold","fearless","determined","tough","sturdy","enduring","tenacious","confident","unyielding","assertive","steadfast","courageous","mighty","dominant","vigorous","heroic","intense","potent","resolute","firm","undaunted","stalwart","forceful","influential","formidable","valiant","stout","robust","undaunted-spirit","sturdy-soul","heroic-mind","mighty-heart","bold-soul","dauntless","unyielding-spirit","fearless-mind"],
  sexy: ["sexy","hot","alluring","provocative","flirtatious","naughty","seductive","sizzling","enticing","risqué","desirable","tempting","playful","flirty","coquettish","sultry","tempting-glance","captivating","magnetic","irresistible","fiery","fascinating","charming","provocative-act","bold","flame","passionate","fascinating-act","sensual","intense","arousing","desirable-spirit","seduction","provocative-smile","tease","temptation","enticing-glance","hot-blooded","bold-seductive","appealing","alluring-act"],
  sadist: ["sadistic","cruel","dominant","punishing","merciless","twisted","ruthless","tormenting","provoking","intense","manipulative","despotic","stern","unyielding","forceful","tyrannical","harsh","cold","grim","relentless","severe","domineering","controlling","perverse","harsh-minded","exacting","punitive","vindictive","unyielding-spirit","stern-heart","tyrant","dominating","cruel-hearted","punishing-force","unyielding-soul","tyrannical-spirit","cold-blooded","merciless-force","controlling-mind","sadistic-soul","dominator","punisher","tormentor"]
};

// --- Stage thresholds ---
const stageThresholds = { white: 5, green: 10, purple: 20, golden: 25, red: Infinity };

// --- Stage class ---
export class Stage extends StageBase<any, any, any, any> {
  myInternalState: any;

  constructor(data: InitialData<any, any, any, any>) {
    super(data);
    const {characters, users, messageState} = data;
    this.myInternalState = messageState != null ? messageState : {};
    this.myInternalState.numUsers = Object.keys(users).length;
    this.myInternalState.numChars = Object.keys(characters).length;
  }

  async load(): Promise<Partial<LoadResponse<any, any, any>>> {
    return {success: true, error: null, initState: null, chatState: null};
  }

  async setState(state: any) {
    if (state != null) this.myInternalState = {...this.myInternalState, ...state};
  }

  async beforePrompt(userMessage: Message): Promise<Partial<StageResponse<any, any>>> {
    const msgText = userMessage.content.toLowerCase();

    if (!this.myInternalState.stage) this.myInternalState.stage = 'white';
    if (!this.myInternalState.counters) this.myInternalState.counters = { white: 0, green: 0, purple: 0, golden: 0, red: 0 };
    if (!this.myInternalState.affection) this.myInternalState.affection = 0;

    const stage = this.myInternalState.stage as keyof typeof stageWords;

    // --- Update counters ---
    this.myInternalState.counters[stage] += 1;

    // --- Stage progression ---
    if (stage === 'white' && this.myInternalState.counters.white >= stageThresholds.white) this.myInternalState.stage = 'green';
    else if (stage === 'green' && this.myInternalState.counters.green >= stageThresholds.green) this.myInternalState.stage = 'purple';
    else if (stage === 'purple' && this.myInternalState.counters.purple >= stageThresholds.purple) this.myInternalState.stage = 'golden';
    else if (stage === 'golden' && this.myInternalState.counters.golden >= stageThresholds.golden) this.myInternalState.stage = 'red';

    // --- Affection keywords ---
    Object.keys(keywords).forEach(category => {
      const words = keywords[category as keyof typeof keywords];
      if (words.some(w => msgText.includes(w))) this.myInternalState.affection += 2;
    });

    // --- Stage directions for AI ---
    const toneDescription = `${stage} stage tone: intense, using adjectives, nouns, verbs from stageWords and tones from stageTones. Write a