import { MCQ } from "@/components/custom/McqIframe"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getNextQuestionDifficulty(currentDifficulty: string, questionAnswer: string): string {

  if (questionAnswer === "correct") {
    if (currentDifficulty === "easy") {
      return "medium"
    } else if (currentDifficulty === "medium") {
      return "hard"
    } else if (currentDifficulty === "hard") {
      return "hard"
    }
  }
  else {
    if (currentDifficulty === "easy") {
      return "easy"
    } else if (currentDifficulty === "medium") {
      return "easy"
    } else if (currentDifficulty === "hard") {
      return "medium"
    }
  }

  return "easy"
}

export function oneMCQ(mcqString: string) {
  if (mcqString === "") return null
  const elements = mcqString.split('||');
  const mcq: MCQ = {
    question: "",
    answer: "",
    options: [],
    difficulty: "",
  };

  elements.map((element) => {
    const parts: string[] = element.split(':');

    if (parts[0]?.trim() === "question") {
      mcq.question = parts[1]?.trim();
    }
    else if (parts[0]?.trim() === "answer") {
      mcq.answer = parts[1]?.trim();
    }
    else if (parts[0]?.trim() === "options") {
      const options = parts[1]?.split('&&') as string[];
      if (!options || options?.length === 0) return;

      for (const option of options) {
        mcq.options.push(option.trim());
      }
    } else {
      mcq.difficulty = parts[1]?.trim();
    }
  })

  return mcq;
}


export function multipleMCQs(mcqsString: string): MCQ[] {
  const elements = mcqsString.split('#');
  if (elements.length === 0) return [];
  const mcqs: MCQ[] = [];

  for (const element of elements) {
    const mcq = oneMCQ(element);
    if (mcq) {
      mcqs.push(mcq);
    }
  }

  return mcqs;
}

export function getSummaryAndScore(summaryAndScore: string): [string, string] {
  const elements = summaryAndScore.split('&&');
  const score = elements?.[0]?.split(":")[1]?.trim();
  const summary = elements?.[1]?.split(":")[1]?.trim();

  return [score, summary];
}