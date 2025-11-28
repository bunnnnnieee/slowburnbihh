import { ReactElement } from "react";
import { StageBase, StageResponse, InitialData, Message } from "@chub-ai/stages-ts";
import { LoadResponse } from "@chub-ai/stages-ts/dist/types/load";

type MessageStateType = any;
type ConfigType = any;
type InitStateType = any;
type ChatStateType = any;

export class Stage extends StageBase<InitStateType, ChatStateType, MessageStateType, ConfigType> {
  myInternalState: { [key: string]: any };

  constructor(data: InitialData<InitStateType, ChatStateType, MessageStateType, ConfigType>) {
    super(data);
    const { users, characters, messageState } = data;

    this.myInternalState = messageState || {
      stage: 'white',
      counters: { white: 0, green: 0, purple: 0, golden: 0, red: 0 },
      affection: 0,
    };

    this.myInternalState.numUsers = Object.keys(users).length;
    this.myInternalState.numChars = Object.keys(characters).length;
  }

  async load(): Promise<Partial<LoadResponse<InitStateType, ChatStateType, MessageStateType>>> {
    return { success: true, error: null, initState: null, chatState: null };
  }

  async setState(state: MessageStateType): Promise<void> {
    if (state != null) this.myInternalState = { ...this.myInternalState, ...state };
  }

  async beforePrompt(userMessage: Message): Promise<Partial<StageResponse<ChatStateType, MessageStateType>>> {
    const { content } = userMessage;

    const stageThresholds = { white: 10, green: 25, purple: 45, golden: 65, red: Infinity };

    // --- Update counters ---
    const stage = this.myInternalState.stage;
    this.myInternalState.counters[stage] += 1;

    // --- Stage progression ---
    const total = this.myInternalState.counters.white + this.myInternalState.counters.green +
                  this.myInternalState.counters.purple + this.myInternalState.counters.golden;
    if (total >= stageThresholds.red) this.myInternalState.stage = 'red';
    else if (total >= stageThresholds.golden) this.myInternalState.stage = 'golden';
    else if (total >= stageThresholds.purple) this.myInternalState.stage = 'purple';
    else if (total >= stageThresholds.green) this.myInternalState.stage = 'green';

    // --- Affection keyword detection ---
    const keywords: { [key: string]: string[] } = {
      compliment: ["beautiful","handsome","cute"],
      romantic: ["i love you","kiss","hug"],
      rude: ["fuck you","shut up"],
      flirt: ["sexy","hot","tease"],
    };

    Object.keys(keywords).forEach(category => {
      const words = keywords[category];
      if (words.some(w => content.toLowerCase().includes(w))) {
        this.myInternalState.affection += 2;
      }
    });

    // --- Secret logic: only reveal from purple stage ---
    let modifiedMessage = content;
    if (this.myInternalState.stage !== 'purple' && content.toLowerCase().includes('secret')) {
      modifiedMessage = "I can't tell you that yet.";
    }

    return {
      stageDirections: null,
      messageState: this.myInternalState,
      modifiedMessage,
      systemMessage: null,
      error: null,
      chatState: null,
    };
  }

  async afterResponse(botMessage: Message): Promise<Partial<StageResponse<ChatStateType, MessageStateType>>> {
    return {
      stageDirections: null,
      messageState: this.myInternalState,
      modifiedMessage: null,
      systemMessage: null,
      error: null,
      chatState: null
    };
  }

  render(): ReactElement {
    return <div style={{ width: '100vw', height: '100vh', display: 'grid', alignItems: 'stretch' }}>
      {/* Empty stage; you can later add visual effects or components */}
    </div>;
  }
}