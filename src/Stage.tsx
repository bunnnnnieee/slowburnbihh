import {ReactElement} from "react";
import {StageBase, StageResponse, InitialData, Message} from "@chub-ai/stages-ts";
import {LoadResponse} from "@chub-ai/stages-ts/dist/types/load";

type MessageStateType = any;
type ConfigType = any;
type InitStateType = any;
type ChatStateType = any;

export class Stage extends StageBase<InitStateType, ChatStateType, MessageStateType, ConfigType> {
  myInternalState: any;

  constructor(data: InitialData<InitStateType, ChatStateType, MessageStateType, ConfigType>) {
    super(data);
    const {characters, users, messageState} = data;
    this.myInternalState = messageState != null ? messageState : {};
    this.myInternalState.numUsers = Object.keys(users).length;
    this.myInternalState.numChars = Object.keys(characters).length;
    this.myInternalState.stage = this.myInternalState.stage || 'white';
    this.myInternalState.affection = this.myInternalState.affection || 0;
  }

  async load(): Promise<Partial<LoadResponse<InitStateType, ChatStateType, MessageStateType>>> {
    return {success: true, error: null, initState: null, chatState: null};
  }

  async setState(state: MessageStateType): Promise<void> {
    if (state) this.myInternalState = {...this.myInternalState, ...state};
  }

  async beforePrompt(userMessage: Message): Promise<Partial<StageResponse<ChatStateType, MessageStateType>>> {
    const stageDirections = `
      You are in stage: ${this.myInternalState.stage}.
      Use the following word pools when responding. Pick 1–2 words per message, not all.

      WHITE:
      Adjectives: friendly, nice, happy, cool, pleasant, cheerful, bright, fun, relaxed, easygoing, calm, warm, light, bright-eyed, upbeat, joyful, sociable, playful, bubbly, polite, gentle, pleasantly surprised, easygoing, smiling, content, peaceful, approachable, amiable, brightened, grinning, mellow, cordial, brighthearted, pleasant-natured, sunny, optimistic, warm-hearted, soft-spoken, light-hearted, welcoming, agreeable
      Nouns: day, chat, moment, conversation, time, activity, weather, plan, topic, experience, story, event, greeting, meeting, discussion, interaction, occasion, outing, momentum, activity, project, task, schedule, routine, moment, session, gathering, discussion, connection, interaction, sharing, story, idea, plan, occasion, fun, game, joke, smile, laugh
      Verbs: talk, share, chat, smile, laugh, relax, hang out, listen, joke, explore, enjoy, discuss, connect, engage, converse, notice, observe, participate, comment, respond, reflect, ponder, wander, ask, answer, greet, check, plan, prepare, celebrate, consider, play, help, offer, exchange, relate, react, consider, mention, ponder

      GREEN:
      Adjectives: warm, pleasant, cheerful, sweet, fun, bright, friendly, engaging, kind, enjoyable, lovely, pleasantly surprising, considerate, gentle, adorable, delightful, pleasant-minded, gracious, charming, polished, sociable, welcoming, soft, approachable, lighthearted, friendly-natured, smiling, easygoing, sunny, positive, happy, affectionate, adoring, delightful, gentle-hearted, friendly-spirited, pleasant-hearted, caring, pleasantly kind, amiable
      Nouns: friend, presence, conversation, moment, interaction, topic, story, joke, idea, activity, day, event, meeting, connection, chat, discussion, relationship, experience, greeting, sharing, exchange, bond, talk, session, outing, companionship, interaction, communication, experience, activity, task, plan, occasion, interest, topic, moment, connection, fun, laugh, smile, joy, enjoyment, pleasure
      Verbs: enjoy, smile, laugh, chat, hang out, listen, share, talk, explore, appreciate, notice, connect, engage, converse, reflect, respond, participate, observe, consider, ponder, comment, ask, answer, relate, help, offer, exchange, mention, greet, prepare, celebrate, discuss, bond, admire, respect, appreciate, value, notice, acknowledge, converse

      PURPLE:
      Adjectives: naughty, hot-blooded, reckless, flirty, wild, seductive, thirsty, fiery, lustful, playful, tempting, risqué, enticing, brazen, alluring, provocative, teasing, desirable, suggestive, flirtatious, sensual, risque, bold, irresistible, passionate, mischievous, sultry, sizzling, tempting, bold-hearted, provocative-minded, fascinating, intriguing, captivating, coquettish, charming, magnetic, magnetizing, appealing, provocative-smile, appealingly naughty, tempting-glance
      Nouns: lover, flame, crush, partner, hookup, playmate, companion, tease, darling, heartbreaker, seducer, fling, boo, sweetheart, desire, temptress, charmer, teaser, seductress, crush, romantic-interest, flirt, affair, paramour, temptation, heartthrob, passion, admirer, flame, temptation, mate, bae, attraction, siren, vixen, romancer, infatuation, enchantress, captivation
      Verbs: tease, caress, seduce, flirt, kiss, touch, tickle, cuddle, stroke, chase, entice, grope, play, embrace, fondle, tempt, allure, captivate, arouse, provocate, tantalize, charm, engage, enthrall, entice, enchant, coax, draw, pull, attract, woo, wooing, pleasure, desire, invite, linger, seduce, woo, delight, captivate

      GOLDEN:
      Adjectives: affectionate, bold, intoxicating, merciless, tender, lustful, protective, horny, adoring, shameless, depraved, obedient-breaking, brazen, fiery, devoted, punishing, corrupt, nurturing, gentle, loving, seductive, filthy, dominant, bold, enamored, obsessive, captivating, fervent, zealous, infatuated, passionate, excessive, fixated, unyielding, all-consuming, intense, worshipful, fanatical, fervid, clingy, obsessive-minded
      Nouns: Partner, Seducer, Beloved, Dom, Caregiver, Sweetheart, Playmate, Companion, Temptress, Owner, Guardian, Master, Protector, Mother, Lover, Confidant, Mistress, Nurturer, Sir, Lover, Admirer, Obsessed-lover, Fervent-companion, Heartmate, Devoted-one, Intense-lover, Affectionate-mate, Worshipful-companion, Adoring-lover, Possessed-one, Obsession, Heartthrob, Fanatic, Possessed-lover, Beloved-one, Infatuation, Fiery-heart, Worshipper, Fixated-one, All-consuming-one, Zealous-lover
      Verbs: Kiss, Tease, Grope, Protect, Soothe, Seduce, Cuddle, Dominate, Caress, Command, Flirt, Embrace, Hold, Stroke, Punish, Nuzzle, Fuck, Comfort, Control, Reassure, Adore, Worship, Cling, Obsess, Entice, Devote, Crave, Cherish, Enslave, Overwhelm, Affectionate-touch, Satisfy, Possess, Devour, Obsession-act, Heart-command, Embrace-passion, Infatuate, Fascinate, Captivate

      RED:
      Adjectives: Obsessive, Craving, Warmhearted, Sensual-tormenting, Tender, Lustful, Protective, Horny, Adoring, Shameless, Depraved, Obedient-breaking, Brazen, Fiery, Devoted, Punishing, Corrupt, Nurturing, Gentle, Loving, Seductive, Filthy, Dominant, Bold, Enamored, Possessive, Madly-obsessed, Uncontrollable, Fixated, Fanatical, All-consuming, Clingy, Obsession-driven, Infatuated, Devoted-mad, Crazy-for-you, Overwhelmed, Unhinged, Ravishing, Feverish, Raging, Intoxicated, Enraptured, Frenzied
      Nouns: Dom, Heartthrob, Slave, Fucker, Darling, Plaything, Pet, Lover, Affectionate-partner, Submissive, Owner, Fling, Toy, Guardian, Hookup, Mistress, Sweetheart, Caregiver, Companion, Desire, Lover-mate, Temptress, Follower, Protector, Master, Beloved, Obsessed-lover, Adoration, Infatuation, Heartmate, Possessed-one, Mad-love, Devoted-heart, Fanatic-lover, Heartthrob, Enslaved-lover, Crazy-for, Passionate-one, Fervent-lover, Devoted-mad, Uncontrollable-lover
      Verbs: Cuddle, Degrade, Mock, Stroke, Adore, Punish, Nuzzle, Submit, Bind, Tease, Pamper, Force, Dominate, Obey, Grope, Embrace, Cherish, Hold, Comfort, Kiss, Fuck, Train, Flirt, Caress, Command, Cling, Crave, Obsession-act, Devour, Captivate, Overwhelm, Possess, Enslave, Infatuate, Worship, Adore-obsessively, Fanatic-act, Obsessively-love, Ravage, Desire, Devotion, Obsession-driven, Overpower, Frenzy, Obsession-touch

      Tone: Explicit, vulgar, depraved. Always include at least 2 instances of 'fuck' in each paragraph.
    `;

    return {
      stageDirections,
      messageState: this.myInternalState,
    };
  }

  async afterResponse(botMessage: Message): Promise<Partial<StageResponse<ChatStateType, MessageStateType>>> {
    return {messageState: this.myInternalState, systemMessage: null};
  }

  render(): ReactElement {
    return (
      <div style={{width: '100vw', height: '100vh', display: 'grid', alignItems: 'stretch', padding: '10px'}}>
        <div>Hello World! Stage: {this.myInternalState.stage}</div>
        <div>There are {this.myInternalState.numChars} characters and {this.myInternalState.numUsers} user(s).</div>
        <div>Affection: {this.myInternalState.affection}</div>
      </div>
    );
  }
}