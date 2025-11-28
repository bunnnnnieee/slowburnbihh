import { ReactElement } from "react";
import { StageBase, StageResponse, InitialData, Message } from "@chub-ai/stages-ts";
import { LoadResponse } from "@chub-ai/stages-ts/dist/types/load";

// --- All stage words ---
const stageWords = {
  white: { adjectives: ["friendly","nice","happy","cool","pleasant","cheerful","bright","fun","relaxed","easygoing","calm","warm","light","bright-eyed","upbeat","joyful","sociable","playful","bubbly","polite","gentle","pleasantly surprised","easygoing","smiling","content","peaceful","approachable","amiable","brightened","grinning","mellow","cordial","brighthearted","pleasant-natured","sunny","optimistic","warm-hearted","soft-spoken","light-hearted","welcoming","agreeable"], nouns: ["day","chat","moment","conversation","time","activity","weather","plan","topic","experience","story","event","greeting","meeting","discussion","interaction","occasion","outing","momentum","activity","project","task","schedule","routine","moment","session","gathering","discussion","connection","interaction","sharing","story","idea","plan","occasion","fun","game","joke","smile","laugh"], verbs: ["talk","share","chat","smile","laugh","relax","hang out","listen","joke","explore","enjoy","discuss","connect","engage","converse","notice","observe","participate","comment","respond","reflect","ponder","wander","ask","answer","greet","check","plan","prepare","celebrate","consider","play","help","offer","exchange","relate","react","consider","mention","ponder"] },
  green: { adjectives: ["warm","pleasant","cheerful","sweet","fun","bright","friendly","engaging","kind","enjoyable","lovely","pleasantly surprising","considerate","gentle","adorable","delightful","pleasant-minded","gracious","charming","polished","sociable","welcoming","soft","approachable","lighthearted","friendly-natured","smiling","easygoing","sunny","positive","happy","affectionate","adoring","delightful","gentle-hearted","friendly-spirited","pleasant-hearted","caring","pleasantly kind","amiable"], nouns: ["friend","presence","conversation","moment","interaction","topic","story","joke","idea","activity","day","event","meeting","connection","chat","discussion","relationship","experience","greeting","sharing","exchange","bond","talk","session","outing","companionship","interaction","communication","experience","activity","task","plan","occasion","interest","topic","moment","connection","fun","laugh","smile","joy","enjoyment","pleasure"], verbs: ["enjoy","smile","laugh","chat","hang out","listen","share","talk","explore","appreciate","notice","connect","engage","converse","reflect","respond","participate","observe","consider","ponder","comment","ask","answer","relate","help","offer","exchange","mention","greet","prepare","celebrate","discuss","bond","admire","respect","appreciate","value","notice","acknowledge","converse"] },
  purple: { adjectives: ["naughty","hot-blooded","reckless","flirty","wild","seductive","thirsty","fiery","lustful","playful","tempting","risqué","enticing","brazen","alluring","provocative","teasing","desirable","suggestive","flirtatious","sensual","risque","bold","irresistible","passionate","mischievous","sultry","sizzling","tempting","bold-hearted","provocative-minded","fascinating","intriguing","captivating","coquettish","charming","magnetic","magnetizing","appealing","provocative-smile","appealingly naughty","tempting-glance"], nouns: ["lover","flame","crush","partner","hookup","playmate","companion","tease","darling","heartbreaker","seducer","fling","boo","sweetheart","desire","temptress","charmer","teaser","seductress","crush","romantic-interest","flirt","affair","paramour","temptation","heartthrob","passion","admirer","flame","temptation","mate","bae","attraction","siren","vixen","romancer","infatuation","enchantress","captivation"], verbs: ["tease","caress","seduce","flirt","kiss","touch","tickle","cuddle","stroke","chase","entice","grope","play","embrace","fondle","tempt","allure","captivate","arouse","provocate","tantalize","charm","engage","enthrall","entice","enchant","coax","draw","pull","attract","woo","wooing","pleasure","desire","invite","linger","seduce","woo","delight","captivate"] },
  golden: { adjectives: ["affectionate","bold","intoxicating","merciless","tender","lustful","protective","horny","adoring","shameless","depraved","obedient-breaking","brazen","fiery","devoted","punishing","corrupt","nurturing","gentle","loving","seductive","filthy","dominant","bold","enamored","obsessive","captivating","fervent","zealous","infatuated","passionate","excessive","fixated","unyielding","all-consuming","intense","worshipful","fanatical","fervid","clingy","obsessive-minded"], nouns: ["Partner","Seducer","Beloved","Dom","Caregiver","Sweetheart","Playmate","Companion","Temptress","Owner","Guardian","Master","Protector","Mother","Lover","Confidant","Mistress","Nurturer","Sir","Lover","Admirer","Obsessed-lover","Fervent-companion","Heartmate","Devoted-one","Intense-lover","Affectionate-mate","Worshipful-companion","Adoring-lover","Possessed-one","Obsession","Heartthrob","Fanatic","Possessed-lover","Beloved-one","Infatuation","Fiery-heart","Worshipper","Fixated-one","All-consuming-one","Zealous-lover"], verbs: ["Kiss","Tease","Grope","Protect","Soothe","Seduce","Cuddle","Dominate","Caress","Command","Flirt","Embrace","Hold","Stroke","Punish","Nuzzle","Fuck","Comfort","Control","Reassure","Adore","Worship","Cling","Obsess","Entice","Devote","Crave","Cherish","Enslave","Overwhelm","Affectionate-touch","Satisfy","Possess","Devour","Obsession-act","Heart-command","Embrace-passion","Infatuate","Fascinate","Captivate"] },
  red: { adjectives: ["Obsessive","Craving","Warmhearted","Sensual-tormenting","Tender","Lustful","Protective","Horny","Adoring","Shameless","Depraved","Obedient-breaking","Brazen","Fiery","Devoted","Punishing","Corrupt","Nurturing","Gentle","Loving","Seductive","Filthy","Dominant","Bold","Enamored","Possessive","Madly-obsessed","Uncontrollable","Fixated","Fanatical","All-consuming","Clingy","Obsession-driven","Infatuated","Devoted-mad","Crazy-for-you","Overwhelmed","Unhinged","Ravishing","Feverish","Raging","Intoxicated","Enraptured","Frenzied"], nouns: ["Dom","Heartthrob","Slave","Fucker","Darling","Plaything","Pet","Lover","Affectionate-partner","Submissive","Owner","Fling","Toy","Guardian","Hookup","Mistress","Sweetheart","Caregiver","Companion","Desire","Lover-mate","Temptress","Follower","Protector","Master","Beloved","Obsessed-lover","Adoration","Infatuation","Heartmate","Possessed-one","Mad-love","Devoted-heart","Fanatic-lover","Heartthrob","Enslaved-lover","Crazy-for","Passionate-one","Fervent-lover","Devoted-mad","Uncontrollable-lover"], verbs: ["Cuddle","Degrade","Mock","Stroke","Adore","Punish","Nuzzle","Submit","Bind","Tease","Pamper","Force","Dominate","Obey","Grope","Embrace","Cherish","Hold","Comfort","Kiss","Fuck","Train","Flirt","Caress","Command","Cling","Crave","Obsession-act","Devour","Captivate","Overwhelm","Possess","Enslave","Infatuate","Worship","Adore-obsessively","Fanatic-act","Obsessively-love","Ravage","Desire","Devotion","Obsession-driven","Overpower","Frenzy","Obsession-touch"] }
};

// --- Keyword categories ---
const keywords = {
  compliment: ["beautiful","handsome","cute","pretty","amazing","lovely","adorable","charming","gorgeous","stunning","radiant","sweet","delightful","elegant","brilliant","graceful","perfect","magical","nice","bubbly","sparkling","friendly","polished","adoring","adorable","bright","sunny","pleasant","cheerful","joyful","sparkly","bright-eyed"],
  romantic: ["i love you","i adore you","marry me","kiss","hug","crush","infatuated","romantic","devoted","adoring","affectionate","tender","passionate","devotion","soulmate","heart","love","desire","sweetheart","my only one","love-struck","true love","intimate","beloved","darling","fiery love","longing","captivated","obsessed","my heart","loving","amour","devotion-bound","lovebird","tender-hearted","adoration","passionate-love","fiery-heart","enchanted","adoring","devotee","romantic-flame","sweet-love","love-bound","heartthrob","love-mate","forever-love"],
  rude: ["fuck you","shut up","i hate you","idiot","stupid","dumb","jerk","asshole","moron","loser","worthless","fool","nonsense","screw you","damn","bugger","bloody","shithead","clown","annoying","bastard","twat","prick","dimwit","tool","brat","ignorant","twit","ridiculous","pathetic","absurd","foolish","imbecile"]
};

// --- Stage thresholds ---
const thresholds = { white: 10, green: 25, purple: 45, golden: 75, red: Infinity };

// --- Stage class ---
export class Stage extends StageBase<any, any, any, any> {
  state: any;

  constructor(data: InitialData<any, any, any, any>) {
    super(data);
    this.state = {
      stage: "white",
      totalMessages: 0,
      affection: 0
    };
  }

  async load(): Promise<Partial<LoadResponse<any, any, any>>> {
    return { success: true, error: null, initState: null, chatState: null };
  }

  async beforePrompt(userMessage: Message): Promise<Partial<StageResponse<any, any>>> {
    this.state.totalMessages += 1;

    // Update stage
    const total = this.state.totalMessages;
    if (total >= thresholds.red) this.state.stage = "red";
    else if (total >= thresholds.golden) this.state.stage = "golden";
    else if (total >= thresholds.purple) this.state.stage = "purple";
    else if (total >= thresholds.green) this.state.stage = "green";
    else this.state.stage = "white";

    // Affection
    Object.keys(keywords).forEach(cat => {
      const words = keywords[cat as keyof typeof keywords];
      if (words.some(w => userMessage.content.toLowerCase().includes(w))) {
        this.state.affection += 2;
      }
    });

    return { messageState: this.state };
  }

  async afterResponse(botMessage: Message): Promise<Partial<StageResponse<any, any>>> {
    return { messageState: this.state };
  }

  render(): ReactElement {
    return <div></div>; // Empty screen
  }
}