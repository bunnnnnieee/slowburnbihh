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

        const { characters, users, messageState } = data;

        this.myInternalState = messageState != null ? messageState : {
            stage: 'white',
            counters: { white: 0, green: 0, purple: 0, golden: 0, red: 0 },
            affection: 0
        };

        this.myInternalState['numUsers'] = Object.keys(users).length;
        this.myInternalState['numChars'] = Object.keys(characters).length;
    }

    async load(): Promise<Partial<LoadResponse<InitStateType, ChatStateType, MessageStateType>>> {
        return {
            success: true,
            error: null,
            initState: null,
            chatState: null,
        };
    }

    async setState(state: MessageStateType): Promise<void> {
        if (state != null) {
            this.myInternalState = { ...this.myInternalState, ...state };
        }
    }

    async beforePrompt(userMessage: Message): Promise<Partial<StageResponse<ChatStateType, MessageStateType>>> {
        const { content } = userMessage;

        // --- Stage progression logic ---
        const stageThresholds = { white: 10, green: 25, purple: 45, golden: 75, red: Infinity };
        const stage = this.myInternalState.stage as keyof typeof stageThresholds;

        this.myInternalState.counters[stage] += 1;

        if (stage === 'white' && this.myInternalState.counters.white >= stageThresholds.white) this.myInternalState.stage = 'green';
        else if (stage === 'green' && this.myInternalState.counters.green + this.myInternalState.counters.white >= stageThresholds.green) this.myInternalState.stage = 'purple';
        else if (stage === 'purple' && this.myInternalState.counters.purple + this.myInternalState.counters.white + this.myInternalState.counters.green >= stageThresholds.purple) this.myInternalState.stage = 'golden';
        else if (stage === 'golden' && this.myInternalState.counters.golden + this.myInternalState.counters.white + this.myInternalState.counters.green + this.myInternalState.counters.purple >= stageThresholds.golden) this.myInternalState.stage = 'red';

        // --- Affection placeholder (to be updated when adding word lists) ---
        // Example: if (userMessage.content.includes('love')) { this.myInternalState.affection += 2; }

        return {
            stageDirections: null,
            messageState: { ...this.myInternalState },
            modifiedMessage: null,
            systemMessage: null,
            error: null,
            chatState: null,
        };
    }

    async afterResponse(botMessage: Message): Promise<Partial<StageResponse<ChatStateType, MessageStateType>>> {
        return {
            stageDirections: null,
            messageState: { ...this.myInternalState },
            modifiedMessage: null,
            systemMessage: null,
            error: null,
            chatState: null
        };
    }

    render(): ReactElement {
        // Empty screen
        return <div style={{ width: '100vw', height: '100vh' }}></div>;
    }
}