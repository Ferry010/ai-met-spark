/**
 * AI Smart Kids — full lesson curriculum.
 * 3 worlds × 4 lessons = 12 lessons.
 */

export type Pillar = "safe" | "smart" | "stronger";

export type InteractiveStep =
  | {
      kind: "multiChoice";
      question: string;
      options: { label: string; correct: boolean }[];
      explanation: string;
    }
  | {
      kind: "tapReveal";
      prompt: string;
      reveals: { label: string; reveal: string }[];
    }
  | {
      kind: "sortBuckets";
      prompt: string;
      buckets: string[]; // 2 buckets
      items: { label: string; bucket: number }[];
    };

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  why: string;
}

export interface Lesson {
  id: string; // "1.1"
  worldId: 1 | 2 | 3;
  pillar: Pillar;
  title: string;
  emoji: string;
  fact: string; // big "Did you know?"
  interactive: InteractiveStep;
  quiz: QuizQuestion[];
}

export interface World {
  id: 1 | 2 | 3;
  pillar: Pillar;
  name: string;
  tagline: string;
  emoji: string;
  lessons: Lesson[];
}

export const WORLDS: World[] = [
  {
    id: 1,
    pillar: "safe",
    name: "SAFE",
    tagline: "Stay safe with AI",
    emoji: "🛡️",
    lessons: [
      {
        id: "1.1",
        worldId: 1,
        pillar: "safe",
        title: "What is AI, really?",
        emoji: "🤖",
        fact: "AI is a super-fast guesser, not a thinking brain. It learned from millions of examples.",
        interactive: {
          kind: "multiChoice",
          question: "How does AI come up with answers?",
          options: [
            { label: "It looks up facts in a giant book", correct: false },
            { label: "It guesses based on patterns from examples", correct: true },
            { label: "It thinks like a human brain", correct: false },
          ],
          explanation: "AI predicts what comes next using patterns it learned. It doesn't truly understand!",
        },
        quiz: [
          {
            question: "AI is best described as:",
            options: ["A thinking brain", "A super-fast pattern guesser", "A search engine"],
            correctIndex: 1,
            why: "AI predicts patterns from training data — it doesn't reason like a human.",
          },
          {
            question: "Where did AI learn what it knows?",
            options: ["From a teacher", "From millions of examples on the internet", "From magic"],
            correctIndex: 1,
            why: "AI is trained on huge piles of text and images.",
          },
        ],
      },
      {
        id: "1.2",
        worldId: 1,
        pillar: "safe",
        title: "AI can be wrong",
        emoji: "🤔",
        fact: "Sometimes AI makes stuff up. It's called 'hallucinating.' Always check important things.",
        interactive: {
          kind: "tapReveal",
          prompt: "Tap each example to see if AI got it right:",
          reveals: [
            { label: "AI says: 'Sharks have bones.'", reveal: "❌ WRONG. Sharks have cartilage, not bones." },
            { label: "AI says: 'The Sun is a star.'", reveal: "✅ TRUE. The Sun is our nearest star." },
            { label: "AI invents a fake book title", reveal: "❌ HALLUCINATION. AI sometimes makes things up that sound real." },
          ],
        },
        quiz: [
          {
            question: "When AI confidently makes something up, it's called:",
            options: ["Lying", "Hallucinating", "Sleeping"],
            correctIndex: 1,
            why: "It's the technical word — even experts use it.",
          },
          {
            question: "What should you do with important AI answers?",
            options: ["Trust them", "Double-check them", "Ignore them"],
            correctIndex: 1,
            why: "AI sounds confident even when wrong, so always verify.",
          },
        ],
      },
      {
        id: "1.3",
        worldId: 1,
        pillar: "safe",
        title: "Keep your secrets",
        emoji: "🤐",
        fact: "Never tell AI your full name, school, address, or share photos of yourself.",
        interactive: {
          kind: "sortBuckets",
          prompt: "Drag each thing into SAFE or SECRET:",
          buckets: ["✅ SAFE to share", "🔒 KEEP SECRET"],
          items: [
            { label: "Favourite colour", bucket: 0 },
            { label: "Your full name", bucket: 1 },
            { label: "A made-up character name", bucket: 0 },
            { label: "Your home address", bucket: 1 },
            { label: "Your school name", bucket: 1 },
            { label: "A maths question", bucket: 0 },
          ],
        },
        quiz: [
          {
            question: "Which of these should you NEVER tell an AI?",
            options: ["A maths question", "Your home address", "A joke"],
            correctIndex: 1,
            why: "Personal info should stay private — even with AI.",
          },
          {
            question: "Should you upload a photo of yourself to a chat AI?",
            options: ["Yes, it's fine", "No, keep your image private", "Only if it's blurry"],
            correctIndex: 1,
            why: "Your image is private. Keep it that way.",
          },
        ],
      },
      {
        id: "1.4",
        worldId: 1,
        pillar: "safe",
        title: "Spot the fake",
        emoji: "🕵️",
        fact: "AI can make fake videos and photos. Look for weird hands, strange backgrounds, too-perfect faces.",
        interactive: {
          kind: "tapReveal",
          prompt: "Tap each clue that gives away an AI-made image:",
          reveals: [
            { label: "Hands with 6 fingers", reveal: "🚩 Classic AI mistake — hands are tricky." },
            { label: "Background letters look like gibberish", reveal: "🚩 AI struggles with clear text in backgrounds." },
            { label: "Faces look 'too smooth'", reveal: "🚩 Skin without any pores or marks is suspicious." },
            { label: "Earrings don't match", reveal: "🚩 AI often forgets symmetry in tiny details." },
          ],
        },
        quiz: [
          {
            question: "What's a common giveaway in fake AI photos?",
            options: ["Bright colours", "Weird hands or fingers", "Square shape"],
            correctIndex: 1,
            why: "Hands and fingers are notoriously hard for AI.",
          },
          {
            question: "If a video looks too perfect, you should:",
            options: ["Believe it", "Be a bit suspicious and check the source", "Share it everywhere"],
            correctIndex: 1,
            why: "Always check the source before trusting or sharing.",
          },
        ],
      },
    ],
  },
  {
    id: 2,
    pillar: "smart",
    name: "SMART",
    tagline: "Use AI smartly",
    emoji: "🧠",
    lessons: [
      {
        id: "2.1",
        worldId: 2,
        pillar: "smart",
        title: "Ask like a pro",
        emoji: "💬",
        fact: "Clear questions = better answers. Say what you need, why, and how long.",
        interactive: {
          kind: "multiChoice",
          question: "Which is the BEST prompt?",
          options: [
            { label: "Tell me about space.", correct: false },
            { label: "Explain Saturn's rings to a 9-year-old in 3 sentences.", correct: true },
            { label: "Space stuff please!", correct: false },
          ],
          explanation: "Clear, specific, and short prompts give the best answers.",
        },
        quiz: [
          {
            question: "A great prompt includes:",
            options: ["Your favourite emoji", "What you need, why, and how long", "Just one word"],
            correctIndex: 1,
            why: "Be specific so AI knows what to give you.",
          },
          {
            question: "Which is clearer?",
            options: ["'Help.'", "'Help me understand fractions with one example.'", "'Fractions?'"],
            correctIndex: 1,
            why: "Specifics win every time.",
          },
        ],
      },
      {
        id: "2.2",
        worldId: 2,
        pillar: "smart",
        title: "Always double-check",
        emoji: "🔎",
        fact: "AI sounds confident even when wrong. Check with a book, a teacher, or another source.",
        interactive: {
          kind: "tapReveal",
          prompt: "Tap each good way to double-check:",
          reveals: [
            { label: "Ask a teacher", reveal: "✅ Great — humans know context." },
            { label: "Look it up in a real book", reveal: "✅ Books are usually reviewed by experts." },
            { label: "Ask the same AI again", reveal: "❌ It might just confidently repeat itself." },
            { label: "Search a trusted website", reveal: "✅ Cross-checking with a known source helps." },
          ],
        },
        quiz: [
          {
            question: "If AI gives you a fact, you should:",
            options: ["Trust it", "Check it with another source", "Forget it"],
            correctIndex: 1,
            why: "AI can be wrong — verify important info.",
          },
          {
            question: "Why does AI sound so confident?",
            options: ["It really knows everything", "It's trained to write smoothly, not to check facts", "It's bragging"],
            correctIndex: 1,
            why: "AI is great at sounding right, even when it isn't.",
          },
        ],
      },
      {
        id: "2.3",
        worldId: 2,
        pillar: "smart",
        title: "Helper, not homework-doer",
        emoji: "📚",
        fact: "AI helps you understand. Copying AI's answer is not learning.",
        interactive: {
          kind: "sortBuckets",
          prompt: "Sort these into HELPFUL or COPYING:",
          buckets: ["💡 HELPFUL use", "🚫 COPYING (not OK)"],
          items: [
            { label: "Ask AI to explain a hard word", bucket: 0 },
            { label: "Paste your essay question and submit AI's answer", bucket: 1 },
            { label: "Ask AI to test you with practice questions", bucket: 0 },
            { label: "Copy AI's homework answer word-for-word", bucket: 1 },
            { label: "Ask AI for an example of how something works", bucket: 0 },
          ],
        },
        quiz: [
          {
            question: "Using AI to explain a tricky idea is:",
            options: ["Cheating", "A great way to learn", "Lazy"],
            correctIndex: 1,
            why: "That's exactly what AI is for — helping you understand.",
          },
          {
            question: "Copying an AI answer for homework:",
            options: ["Means you learned it", "Skips the learning part", "Is always allowed"],
            correctIndex: 1,
            why: "Your brain doesn't grow when you copy.",
          },
        ],
      },
      {
        id: "2.4",
        worldId: 2,
        pillar: "smart",
        title: "When to use AI",
        emoji: "✅",
        fact: "Great for: brainstorming, explaining, practicing. NOT for: making real decisions, pretending it's you.",
        interactive: {
          kind: "sortBuckets",
          prompt: "Tap each task into the right bucket:",
          buckets: ["👍 Good use of AI", "👎 Bad use of AI"],
          items: [
            { label: "Brainstorm story ideas", bucket: 0 },
            { label: "Decide who your real friends should be", bucket: 1 },
            { label: "Practice a quiz", bucket: 0 },
            { label: "Pretend an AI message is from you", bucket: 1 },
            { label: "Explain a tricky word", bucket: 0 },
          ],
        },
        quiz: [
          {
            question: "AI is great for:",
            options: ["Making big life decisions for you", "Brainstorming and practicing", "Replacing your friends"],
            correctIndex: 1,
            why: "AI is a tool, not a decision-maker.",
          },
          {
            question: "Pretending AI's words are yours is:",
            options: ["Smart", "Honest", "Not honest"],
            correctIndex: 2,
            why: "Always be honest about using AI's help.",
          },
        ],
      },
    ],
  },
  {
    id: 3,
    pillar: "stronger",
    name: "STRONGER",
    tagline: "Become unstoppable",
    emoji: "💪",
    lessons: [
      {
        id: "3.1",
        worldId: 3,
        pillar: "stronger",
        title: "Learn 10x faster",
        emoji: "🚀",
        fact: "Ask AI to explain anything. 'Explain gravity like I'm 9.'",
        interactive: {
          kind: "multiChoice",
          question: "Which prompt makes AI explain things at YOUR level?",
          options: [
            { label: "Tell me about gravity", correct: false },
            { label: "Explain gravity like I'm 9, with one example", correct: true },
            { label: "Gravity?", correct: false },
          ],
          explanation: "Adding 'like I'm 9' tells AI to use simple words.",
        },
        quiz: [
          {
            question: "What's a magic phrase to make AI explain simply?",
            options: ["'Be smart'", "'Like I'm 9'", "'Be fancy'"],
            correctIndex: 1,
            why: "Telling AI your level helps it match.",
          },
          {
            question: "AI can help you learn faster by:",
            options: ["Doing your homework", "Explaining things in different ways", "Picking your friends"],
            correctIndex: 1,
            why: "AI can re-explain a topic 10 different ways until it clicks.",
          },
        ],
      },
      {
        id: "3.2",
        worldId: 3,
        pillar: "stronger",
        title: "Explain, don't solve",
        emoji: "🧩",
        fact: "Better prompt: 'Help me understand' instead of 'Give me the answer.'",
        interactive: {
          kind: "multiChoice",
          question: "Which prompt grows your brain more?",
          options: [
            { label: "Give me the answer to question 5", correct: false },
            { label: "Help me understand how to solve question 5", correct: true },
            { label: "Just tell me", correct: false },
          ],
          explanation: "Understanding > getting the answer. Always.",
        },
        quiz: [
          {
            question: "The smarter prompt is:",
            options: ["'Give me the answer'", "'Help me understand'", "'Just do it'"],
            correctIndex: 1,
            why: "Understanding sticks; answers don't.",
          },
          {
            question: "If AI just gives the answer, you should:",
            options: ["Copy it", "Ask it to explain how it got there", "Quit"],
            correctIndex: 1,
            why: "Always ask 'why' or 'how' to learn.",
          },
        ],
      },
      {
        id: "3.3",
        worldId: 3,
        pillar: "stronger",
        title: "Your practice buddy",
        emoji: "🎯",
        fact: "Use AI to test yourself, practice languages, or build stories together.",
        interactive: {
          kind: "tapReveal",
          prompt: "Tap each great practice idea:",
          reveals: [
            { label: "'Quiz me on the planets.'", reveal: "✅ Awesome way to test yourself." },
            { label: "'Let's write a story together.'", reveal: "✅ Co-creating builds creativity." },
            { label: "'Talk to me in Spanish.'", reveal: "✅ Practice languages anytime." },
            { label: "'Do my homework.'", reveal: "❌ That's copying, not practicing." },
          ],
        },
        quiz: [
          {
            question: "AI is a great practice buddy because it:",
            options: ["Never gets tired", "Plays football", "Eats pizza"],
            correctIndex: 0,
            why: "AI can quiz you forever without getting bored.",
          },
          {
            question: "Which is good practice with AI?",
            options: ["Co-writing a story", "Copying your homework", "Sharing your address"],
            correctIndex: 0,
            why: "Creating together is a brilliant use.",
          },
        ],
      },
      {
        id: "3.4",
        worldId: 3,
        pillar: "stronger",
        title: "Brain + AI = unbeatable",
        emoji: "⚡",
        fact: "Your creativity + AI's speed = your superpower. AI without you is boring.",
        interactive: {
          kind: "multiChoice",
          question: "What's the secret recipe for the BEST work?",
          options: [
            { label: "Just AI", correct: false },
            { label: "Just you", correct: false },
            { label: "Your ideas + AI's speed", correct: true },
          ],
          explanation: "You bring the creativity. AI brings the speed. Together = magic.",
        },
        quiz: [
          {
            question: "AI alone is:",
            options: ["The smartest thing ever", "Boring without your ideas", "Always perfect"],
            correctIndex: 1,
            why: "AI needs your direction to do anything cool.",
          },
          {
            question: "Your superpower is:",
            options: ["Letting AI do everything", "Combining your creativity with AI's speed", "Hiding from AI"],
            correctIndex: 1,
            why: "You + AI = unbeatable team.",
          },
        ],
      },
    ],
  },
];

export const ALL_LESSONS: Lesson[] = WORLDS.flatMap((w) => w.lessons);

export function getLesson(id: string): Lesson | undefined {
  return ALL_LESSONS.find((l) => l.id === id);
}

export function getWorld(id: number): World | undefined {
  return WORLDS.find((w) => w.id === id);
}

// Final test: 10 questions sampled from across all lessons
export const FINAL_TEST_QUESTIONS: QuizQuestion[] = [
  ALL_LESSONS[0].quiz[0],   // 1.1
  ALL_LESSONS[1].quiz[0],   // 1.2
  ALL_LESSONS[2].quiz[0],   // 1.3
  ALL_LESSONS[3].quiz[0],   // 1.4
  ALL_LESSONS[4].quiz[0],   // 2.1
  ALL_LESSONS[5].quiz[1],   // 2.2
  ALL_LESSONS[6].quiz[0],   // 2.3
  ALL_LESSONS[7].quiz[1],   // 2.4
  ALL_LESSONS[8].quiz[0],   // 3.1
  ALL_LESSONS[11].quiz[1],  // 3.4
];
