export type SlideCategory =
  | 'Introduction'
  | 'VMs vs Containers'
  | 'Docker Jargon-Free'
  | 'Terminology'
  | 'Hands-on Labs'
  | 'Cheat Sheet'
  | 'Summary & Best Practices'
  | 'Resources';

export type SlideType =
  | 'title'
  | 'text-content'
  | 'comparison'
  | 'diagram'
  | 'glossary'
  | 'lab'
  | 'cheatsheet'
  | 'interactive-quiz'
  | 'summary'
  | 'resources';

export interface AnalogyData {
  title: string;
  jargonWord: string;
  simpleAnalogy: string;
  technicalReality: string;
}

export interface LabStep {
  title: string;
  instruction: string;
  command: string;
  expectedOutput: string;
  hint: string;
  validationKeyword: string;
}

export interface LabDetails {
  labId: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  timeEstimate: string;
  prerequisites: string;
  steps: LabStep[];
}

export interface CommandCheat {
  command: string;
  description: string;
  syntax: string;
  example: string;
  flags?: { flag: string; desc: string }[];
}

export interface CheatSheetCategory {
  categoryName: string;
  description: string;
  commands: CommandCheat[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface QuizDetail {
  title: string;
  questions: QuizQuestion[];
}

export interface Slide {
  id: number;
  title: string;
  subtitle?: string;
  category: SlideCategory;
  type: SlideType;
  bullets?: string[];
  contentParagraphs?: string[];
  analogy?: AnalogyData;
  speakerNotes?: string;
  // Visual markers/highlights for custom component rendering
  highlight?: string;
  // Specific slide extensions
  comparisonData?: {
    feature: string;
    vm: string;
    container: string;
    winner: 'VM' | 'Container' | 'Tie';
  }[];
  diagramId?: string;
  labDetails?: LabDetails;
  cheatSheetDetails?: CheatSheetCategory;
  quizDetails?: QuizDetail;
}
