import type { GrammarExercise } from './types';

// NOTE: screenshotUrl paths are placeholders. Drop the teacher's lesson-note
// images into /public/screenshots using these exact filenames and they will
// appear automatically — no code changes needed.

export const exercises: GrammarExercise[] = [
  {
    id: 'unit-6a',
    unitCode: '6A',
    title: 'Unit 6A — The Passive (All Tenses)',
    topic: 'Active vs. Passive',
    instruction: 'Select the correct form, active or passive.',
    type: 'multiple-choice',
    screenshotUrl: '/screenshots/lesson-6a.png',
    questions: [
      {
        id: '6a-0', number: 0,
        promptBefore: 'The college', promptAfter: 'in the 16th century.',
        options: ['built', 'was built'], correctAnswer: 'was built',
        explanation: "Passive (Past Simple). The college receives the action of being built.",
      },
      {
        id: '6a-1', number: 1,
        promptBefore: 'The costumes for the show', promptAfter: 'by hand.',
        options: ['are making', 'are being made'], correctAnswer: 'are being made',
        explanation: 'Present Continuous Passive for an action currently in progress.',
      },
      {
        id: '6a-2', number: 2,
        promptBefore: 'The story', promptAfter: 'him to make a film.',
        options: ['inspired', 'was inspired'], correctAnswer: 'inspired',
        explanation: 'Active (Past Simple). The story actively performed the action of inspiring.',
      },
      {
        id: '6a-3', number: 3,
        promptBefore: "This castle", promptAfter: 'for nearly a century.',
        options: ["hasn't inhabited", "hasn't been inhabited"], correctAnswer: "hasn't been inhabited",
        explanation: 'Present Perfect Passive. Describes a state continuing up to the present.',
      },
      {
        id: '6a-4', number: 4,
        promptBefore: 'His latest film', promptAfter: 'in France in the 1960s.',
        options: ['set', 'is set'], correctAnswer: 'is set',
        explanation: 'Present Simple Passive. Standard phrase "is set in" for locations.',
      },
      {
        id: '6a-5', number: 5,
        promptBefore: 'The film', promptAfter: 'in the autumn.',
        options: ['will shoot', 'will be shot'], correctAnswer: 'will be shot',
        explanation: 'Future Simple Passive (will + be + past participle).',
      },
      {
        id: '6a-6', number: 6,
        promptBefore: "The actors", promptAfter: 'the dialogue until next week.',
        options: ["aren't recording", "aren't being recorded"], correctAnswer: "aren't recording",
        explanation: 'Present Continuous Active. The actors are the subject performing the recording.',
      },
      {
        id: '6a-7', number: 7,
        promptBefore: 'The house', promptAfter: 'by the owners during the winter.',
        options: ["wasn't using", "wasn't being used"], correctAnswer: "wasn't being used",
        explanation: 'Past Continuous Passive for ongoing past action.',
      },
      {
        id: '6a-8', number: 8,
        promptBefore: 'The make-up artist', promptAfter: 'the actor into a monster.',
        options: ['has transformed', 'has been transformed'], correctAnswer: 'has transformed',
        explanation: 'Present Perfect Active. Subject (make-up artist) performs the action.',
      },
      {
        id: '6a-9', number: 9,
        promptBefore: 'They', promptAfter: 'the company for very long before they went bankrupt.',
        options: ["hadn't owned", "hadn't been owned"], correctAnswer: "hadn't owned",
        explanation: "Past Perfect Active. State verb 'own' active before past event.",
      },
      {
        id: '6a-10', number: 10,
        promptBefore: 'The photo', promptAfter: 'by my husband on the balcony of our hotel.',
        options: ['took', 'was taken'], correctAnswer: 'was taken',
        explanation: "Past Simple Passive. Agent indicated by 'by my husband'.",
      },
    ],
  },
  {
    id: 'unit-7a',
    unitCode: '7A',
    title: 'Unit 7A — First Conditional & Future Time Clauses',
    topic: 'First Conditional',
    instruction: 'Complete with the present simple or future with will, using the verb in brackets.',
    type: 'fill-in-blank',
    screenshotUrl: '/screenshots/lesson-7a.png',
    questions: [
      {
        id: '7a-0', number: 0,
        promptBefore: 'If I fail my exams, I', promptAfter: 'them again next year.',
        targetVerb: 'take', correctAnswer: "'ll take", acceptableAlternatives: ['will take'],
        explanation: 'Main clause: future with will.',
      },
      {
        id: '7a-1', number: 1,
        promptBefore: 'That girl', promptAfter: "into trouble if she doesn't wear her uniform.",
        targetVerb: 'get', correctAnswer: 'will get', acceptableAlternatives: ["'ll get"],
        explanation: 'Main clause predicts result: will + infinitive.',
      },
      {
        id: '7a-2', number: 2,
        promptBefore: 'If you give in your homework late, the teacher', promptAfter: 'it.',
        targetVerb: 'not mark', correctAnswer: "won't mark", acceptableAlternatives: ['will not mark'],
        explanation: "Negative main clause with won't.",
      },
      {
        id: '7a-3', number: 3,
        promptBefore: "Don't write anything unless you", promptAfter: 'sure of the answer.',
        targetVerb: 'be', correctAnswer: 'are', acceptableAlternatives: ["'re"],
        explanation: 'Time/condition clause (unless): present simple.',
      },
      {
        id: '7a-4', number: 4,
        promptBefore: 'Gary will be expelled if his behaviour', promptAfter: '.',
        targetVerb: 'not improve', correctAnswer: "doesn't improve",
        explanation: 'If-clause: present simple negative (3rd person).',
      },
      {
        id: '7a-5', number: 5,
        promptBefore: "They'll be late for school unless they", promptAfter: '.',
        targetVerb: 'hurry', correctAnswer: 'hurry',
        explanation: 'Unless-clause (+ present simple).',
      },
      {
        id: '7a-6', number: 6,
        promptBefore: 'Ask me if you', promptAfter: 'what to do.',
        targetVerb: 'not know', correctAnswer: "don't know",
        explanation: "If-clause: present simple negative (you don't know).",
      },
      {
        id: '7a-7', number: 7,
        promptBefore: 'Johnny will be punished if he', promptAfter: 'at the teacher again.',
        targetVerb: 'shout', correctAnswer: 'shouts',
        explanation: 'If-clause: present simple singular verb (he shouts).',
      },
      {
        id: '7a-8', number: 8,
        promptBefore: 'My sister', promptAfter: 'university this year if she passes all her exams.',
        targetVerb: 'finish', correctAnswer: 'will finish', acceptableAlternatives: ["'ll finish"],
        explanation: 'Main result clause: future simple with will.',
      },
      {
        id: '7a-9', number: 9,
        promptBefore: 'I', promptAfter: 'tonight unless I finish my homework quickly.',
        targetVerb: 'not go out', correctAnswer: "won't go out",
        explanation: "Main clause: negative future with won't.",
      },
      {
        id: '7a-10', number: 10,
        promptBefore: 'Call me if you', promptAfter: 'some help with your project.',
        targetVerb: 'need', correctAnswer: 'need',
        explanation: 'If-clause following imperative: present simple.',
      },
    ],
  },
  {
    id: 'unit-8a',
    unitCode: '8A',
    title: 'Unit 8A — Gerunds vs. Infinitives',
    topic: 'Gerunds & Infinitives',
    instruction: 'Select the correct verb form: gerund, infinitive with to, or bare infinitive.',
    type: 'multiple-choice',
    screenshotUrl: '/screenshots/lesson-8a.png',
    questions: [
      {
        id: '8a-0', number: 0,
        promptBefore: "I'm in charge of", promptAfter: 'new staff.',
        options: ['recruiting', 'to recruit'], correctAnswer: 'recruiting',
        explanation: "Gerund required after a preposition ('of').",
      },
      {
        id: '8a-1', number: 1,
        promptBefore: "It's important for me", promptAfter: 'time with my family.',
        options: ['spending', 'to spend'], correctAnswer: 'to spend',
        explanation: "Infinitive with 'to' after adjectives ('important').",
      },
      {
        id: '8a-2', number: 2,
        promptBefore: '', promptAfter: 'to go to university abroad can be complicated.',
        options: ['Applying', 'Apply'], correctAnswer: 'Applying',
        explanation: 'Gerund functioning as the subject of the sentence.',
      },
      {
        id: '8a-3', number: 3,
        promptBefore: 'I want', promptAfter: 'my shopping this morning.',
        options: ['to do', 'doing'], correctAnswer: 'to do',
        explanation: "Verb 'want' takes an infinitive with 'to'.",
      },
      {
        id: '8a-4', number: 4,
        promptBefore: 'My boss wants', promptAfter: 'a new office.',
        options: ['open', 'to open'], correctAnswer: 'to open',
        explanation: "Verb 'want' takes an infinitive with 'to'.",
      },
      {
        id: '8a-5', number: 5,
        promptBefore: 'Be careful', promptAfter: 'her about her boyfriend.',
        options: ['not asking', 'not to ask'], correctAnswer: 'not to ask',
        explanation: "Negative infinitive ('not to' + verb) after adjectives.",
      },
      {
        id: '8a-6', number: 6,
        promptBefore: 'We went on', promptAfter: 'until we finished.',
        options: ['working', 'to work'], correctAnswer: 'working',
        explanation: "Gerund after the phrasal verb 'went on' (= continue).",
      },
      {
        id: '8a-7', number: 7,
        promptBefore: 'Dave is very good at', promptAfter: 'problems.',
        options: ['solving', 'to solve'], correctAnswer: 'solving',
        explanation: "Gerund following adjective + preposition ('good at').",
      },
    ],
  },
];

export const TEACHER_PASSWORD = 'esc-teacher';
