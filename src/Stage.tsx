import {ReactElement} from "react";
import {StageBase, StageResponse, InitialData, Message} from "@chub-ai/stages-ts";
import {LoadResponse} from "@chub-ai/stages-ts/dist/types/load";

type MessageStateType = any;
type ConfigType = any;
type InitStateType = any;
type ChatStateType = any;

// --- Stage class ---
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
    // --- Stage directions guiding AI ---
    const stageDirections = `
      You are in stage: ${this.myInternalState.stage}. 
      Use the following word pools for responses:

      WHITE: friendly, nice, happy, cool, pleasant, cheerful, bright, fun, relaxed, easygoing
      GREEN: warm, pleasant, cheerful, sweet, fun, bright, friendly, engaging, kind, enjoyable
      PURPLE: naughty, hot-blooded, reckless, flirty, wild, seductive, thirsty, fiery, lustful, playful
      GOLDEN: affectionate, bold, intoxicating, merciless, tender, lustful, protective, horny, adoring, shameless
      RED: obsessive, craving, warmhearted, sensual-tormenting, tender, lustful, protective, horny, adoring, shameless

      Always include 1–2 words from the pool of the current stage per response.
      Incorporate at least 2 instances of the word 'fuck' in each paragraph.
      Tone: explicit, vulgar, depraved.
    `;

    return {
      stageDirections,
      messageState: this.myInternalState,
    };
  }

  async afterResponse(botMessage: Message): Promise<Partial<StageResponse<ChatStateType, MessageStateType>>> {
    return {
      messageState: this.myInternalState,
      systemMessage: null,
    };
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