'use client';

import { useAssistant } from 'ai/react';
import Mcq from '@/components/custom/Mcq';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Loader2, RefreshCcw } from 'lucide-react';
import { oneMCQ } from '@/lib/utils';
import SummaryCard from './SummaryCard';
import CandleChart from './CandleChart';


export interface MCQ {
  question: string;
  answer: string;
  options: string[];
  difficulty: string;
  type: string;
}

export const totalQuestions = 6;

export default function McqIframe() {``
  const { status, messages, submitMessage, threadId, setThreadId, setMessages, append } =
    useAssistant({ api: '/api/get-mcq' });


  const [questionAnswer, setQuestionAnswer] = useState("");
  const [mcqs, setMcqs] = useState<MCQ[]>([]);

  const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (messages.length === 0) {
      append({
        id: Date.now().toString(),
        role: 'user',
        content: `Generate first chart based mcq`
      })
    }
    else if (messages.length === 2) {
      append({
        id: Date.now().toString(),
        role: 'user',
        content: `Answer to previous question: ${questionAnswer} and generate random mcq related to stock market from provided context.`
      })
    }
    else if (messages.length < totalQuestions) {
      append({
        id: Date.now().toString(),
        role: 'user',
        content: `Answer to previous question: ${questionAnswer} and generate next mcq linked to previous questions related to stock market if previous question is not related to open high low close.`
      })
    }
    else {
      append({
        id: Date.now().toString(),
        role: 'user',
        content: `Answer to previous question: ${questionAnswer} and generate summary and score.`
      })
      setMcqs([]);
    }
    submitMessage();
    setQuestionAnswer("");
  }

  useEffect(() => {
    const localThreadId = localStorage.getItem('threadId');
    if (localThreadId) {
      setThreadId(localThreadId);
    }
    const localMessages = localStorage.getItem('messages');
    if (localMessages !== '[]' && localMessages) {
      setMessages(JSON.parse(localMessages));
    }
  }, [])


  useEffect(() => {
    if (threadId) {
      localStorage.setItem(`threadId`, threadId);
    }
  }, [threadId])

  useEffect(() => {
    if (messages) {
      localStorage.setItem(`messages`, JSON.stringify(messages));
    }
    const assistantResponse = messages[messages.length - 1];
    if (!assistantResponse || assistantResponse.role !== 'assistant') return
    const assistantResponseString = assistantResponse?.content;

    const mcq = oneMCQ(assistantResponseString)
    if (mcq && messages.length <= totalQuestions) {
      setMcqs([mcq]);
    }
    else {
      setMcqs([]);
    }
  }, [messages])

  return (
    <div className='text-white  bg-black overflow-auto'>

      <div className="h-[6vh] border-b border-b-gray-300 flex justify-end items-center pr-5">
        <RefreshCcw className='w-5 h-5 cursor-pointer text-white' onClick={() => {
          localStorage.removeItem(`threadId`);
          localStorage.removeItem(`messages`);
          setMessages([]);
          setMcqs([]);
        }} />
      </div>

      {mcqs.map((mcq: MCQ) => {
        if (mcq.type === "chart") return (
          <>
            <CandleChart mcq={mcq} key={mcq.question} />
            <Mcq mcq={mcq} key={mcq.question} setQuestionAnswer={setQuestionAnswer} />
          </>
        )
        return <Mcq mcq={mcq} key={mcq.question} setQuestionAnswer={setQuestionAnswer} />
      })}

      {messages.length <= totalQuestions &&
        <form onSubmit={onSubmitHandler} className='flex justify-center items-center'>
          <Button disabled={status !== 'awaiting_message' || (questionAnswer === "" && messages.length > 0)} type='submit' className='bg-white text-black hover:bg-slate-20 w-[90%] m-10'>
            {status === 'in_progress' && "Generating..."}
            {messages.length === 0 && "Generate MCQ"}
            {mcqs.length > 0 && messages.length < totalQuestions && status === 'awaiting_message' && "Next MCQ"}
            {messages.length >= totalQuestions && "Get your score and summary"}
          </Button>
        </form>}

      {messages.length > totalQuestions && messages[messages.length - 1]?.role === "assistant" &&
        <SummaryCard summaryAndScore={messages[messages.length - 1]?.content} />
      }
      {messages.length > totalQuestions && messages[messages.length - 1]?.role === "user" &&
        <div className="flex justify-center items-center h-[50vh] w-[46vw]">
          <Loader2 className='w-20 h-20 text-white bg-black animate-spin' />
        </div>
      }
    </div>
  );
}

