import { defineStage, Stage as StageBase } from '@chub-ai/sdk'; // Use an alias for Stage

// --- Stage word pools ---
const stageWords = {
  // ... (Your entire stageWords object remains the same)
  white: { /* ... */ },
  green: { /* ... */ },
  purple: { /* ... */ },
  golden: { /* ... */ },
  red: { /* ... */ }
};

// --- Stage tone pools matching adjectives ---
const stageTones = {
  // ... (Your entire stageTones object remains the same)
  white: stageWords.white.adjectives,
  green: stageWords.green.adjectives,
  purple: stageWords.purple.adjectives,
  golden: stageWords.golden.adjectives,
  red: stageWords.red.adjectives
};

// --- Expanded keyword categories ---
const keywords = {
  // ... (Your entire keywords object remains the same)
  compliment: [ /* ... */ ],
  // ...
};

// --- Stage thresholds ---
const stageThresholds = { white: 5, green: 10, purple: 20, golden: 25, red: Infinity };

// --- Define Chub stage as a CLASS and export it ---
export default class SlowburnbihStage extends StageBase { // <-- Rename to your stage name

  constructor() {
    super({
      id: 'slowburnbih',
      name: 'Slowburnbih',
    });
  }

  // Use the onUserMessage method inside the class
  async onUserMessage(context: Parameters<StageBase['onUserMessage']>[0]) {
    const { state, sendBotMessage, ai, message } = context;

    if (!state.stage) state.stage = 'white';
    if (!state.counters) state.counters = { white: 0, green: 0, purple: 0, golden: 0, red: 0 };
    if (!state.affection) state.affection = 0;

    const stage = state.stage as keyof typeof stageWords;

    // --- Update counters and stage progression ---
    state.counters[stage] += 1;
    if (stage === 'white' && state.counters.white >= stageThresholds.white) state.stage = 'green';
    else if (stage === 'green' && state.counters.green >= stageThresholds.green) state.stage = 'purple';
    else if (stage === 'purple' && state.counters.purple >= stageThresholds.purple) state.stage = 'golden';
    else if (stage === 'golden' && state.counters.golden >= stageThresholds.golden) state.stage = 'red';

    // --- Affection keyword processing ---
    Object.keys(keywords).forEach(category => {
      const words = keywords[category as keyof typeof keywords];
      if (words.some(w => message.text.toLowerCase().includes(w))) {
        state.affection += 2; // Adjust affection per match
      }
    });

    // --- AI generates freeform message with stage tone ---
    const toneDescription = `${stage} stage tone: intense, using adjectives, nouns, verbs from stageWords and tones from stageTones, around 40 words per message`;

    const aiMessage = await ai.generateMessage({
      userText: message.text,
      tone: toneDescription,
      stageWords: stageWords[stage],
      stageTones: stageTones[stage],
      affection: state.affection,
    });

    // --- Send AI message ---
    sendBotMessage({ text: aiMessage });

    return { state };
  }
}
