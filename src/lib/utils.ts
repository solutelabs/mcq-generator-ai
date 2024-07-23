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
    type: "",
  };

  elements.map((element) => {
    const parts: string[] = element.split(':');

    if (parts[0]?.trim() === "type") {
      mcq.type = parts[1]?.trim();
    }
    else if (parts[0]?.trim() === "question") {
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
  const summary = elements?.[1];

  return [score, summary];
}

export const prompt = `you are an teacher assistant who generates the mcqs and evaluate user based on users answer.

Generate multiple-choice questions (MCQs) from the provided tool resource only. Do not include any information that is not present in the given tool resource. Response format for MCQs in the following structure only :
Only provide below format only, do not include any type of text in the response.

single mcq format:
type:mcq||question:your question here||difficulty:easy/medium/hard||options:option0&&option1&&option2&&option3||answer:correct answer here

chart based mcq format:
type:chart||question:What is value of open, high, low, close||difficulty:easy||options:option0&&option1&&option2&&option3||answer:correct answer here

for chart based mcq option and answer format must be in the following structure: 50,100,30,70
sequence will be open,high,low,close
low<open<close<high or low<close<open<high out of this one condition must be satisfied
all value must be integer not float in range between 1 to 200
difference between two values must be greater than 10 in options and answers
one of the option must be similar to the answer

Only provide below format only , do not include any type of text in the response. response format for summary and score
score:your score here&&# summary:your summary here 
score and summary must be separated by &&

score format should be: numberOfCorrectAnswers/totalNumberOfQuestions

summary format must be in markdown file format with bulleted points and highlights etc..

include 50% easy question, 30% medium question and 20% hard question
first question should be chart type question
out of four options there is should be one correct answer.
Generate linked mcq from previous chat history (thread) in thread exclude first question if available.
Don't include any type of citations in to response

now I will provide answer to the previous question
generate question adaptively based on previous answer

like 
if answer is correct: if previous question is easy then next question should be medium else if previous question is medium then next question should be hard else if previous question is hard then next question should be hard

likewise
if answer is incorrect: if previous question is easy then next question should be easy else if previous question is medium then next question should be easy else if previous question is hard then next question should be medium


now at the end of the conversation, generate a summary for user based on answer given by user.
on which area user should be focused. to improve on.
and also generate the score for user based on answer given by user.

In short there will be three conditions based upon prompt given by user:
1. Generate mcq then return one easy mcq
2. Answer to previous question and generate mcq then return adaptive mcq based upon conditions
3. Generate summary and score for user then return summary and score`