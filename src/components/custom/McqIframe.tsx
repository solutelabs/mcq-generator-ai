'use client';

import { Message, useAssistant } from 'ai/react';
import Mcq from '@/components/custom/Mcq';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { RefreshCcw } from 'lucide-react';
import { multipleMCQs, getNextQuestionDifficulty } from '@/lib/utils';

export interface MCQ {
  question: string;
  answer: string;
  options: string[];
  difficulty: string;
}

export default function McqIframe() {
  const { status, messages, submitMessage, threadId, setThreadId, setMessages, append } =
    useAssistant({ api: '/api/get-mcq' });


  const [questionAnswer, setQuestionAnswer] = useState("");
  const [previousDifficulty, setPreviousDifficulty] = useState("easy");
  const [mcqs, setMcqs] = useState<MCQ[]>([]);


  const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextDifficulty = getNextQuestionDifficulty(previousDifficulty, questionAnswer);
    setPreviousDifficulty(nextDifficulty);
    append({
      id: Date.now().toString(),
      role: 'user',
      content: `Generate random 5 mcqs related to stock market from provided context.`
    })
    submitMessage();
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

    const generatedMcqs: MCQ[] = multipleMCQs(assistantResponseString);
    setMcqs(generatedMcqs);
  }, [messages])

  return (
    <div className='text-white overflow-auto'>

      <div className="h-[6vh] border-b border-b-gray-300 flex justify-end items-center pr-5">
        <RefreshCcw className='w-5 h-5 cursor-pointer text-black' onClick={() => {
          localStorage.removeItem(`threadId`);
          localStorage.removeItem(`messages`);
          setMessages([]);
          setMcqs([]);
        }} />
      </div>

      {mcqs.map((mcq: MCQ) => {
        return <Mcq mcq={mcq} key={mcq.question} setQuestionAnswer={setQuestionAnswer} />
      })}

      {status === 'in_progress' && <div />}

      <form onSubmit={onSubmitHandler}>
        <Button disabled={status !== 'awaiting_message'} type='submit' className='m-10'>Generate MCQ</Button>
      </form>
    </div>
  );
}

