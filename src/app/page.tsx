'use client';

import { Message, useAssistant } from 'ai/react';
import Mcq from '@/components/custom/Mcq';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { RefreshCcw } from 'lucide-react';

export interface MCQ {
  question: string;
  answer: string;
  options: string[];
  difficulty: string;
}

function getMcq(mcqString: string) {
  const elements = mcqString.split('||');
  if (elements.length < 4) {
    return null;
  }

  const mcq: MCQ = {
    question: "",
    answer: "",
    options: [],
    difficulty: "",
  };

  elements.map((element) => {
    const parts: string[] = element.split(':');

    if (parts[0].trim() === "question") {
      mcq.question = parts[1].trim();
    }
    else if (parts[0].trim() === "answer") {
      mcq.answer = parts[1].trim();
    }
    else if (parts[0].trim() === "options") {
      const options = parts[1].split('&&') as string[];
      for (const option of options) {
        mcq.options.push(option.trim());
      }
    } else {
      mcq.difficulty = parts[1]?.trim();
    }
  })

  return mcq;
}

export default function Chat() {
  const { status, messages, submitMessage, setInput, threadId, setThreadId, setMessages } =
    useAssistant({ api: '/api/get-mcq' });


  const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // setInput("Generate random one easy mcq from provided context");
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
  }, [messages])

  return (
    <div className='text-white'>

      <div className="h-[6vh] border-b border-b-gray-300 flex justify-end items-center pr-5">
        <RefreshCcw className='w-5 h-5 cursor-pointer text-black' onClick={() => {
          localStorage.removeItem(`threadId`);
          localStorage.removeItem(`messages`);
          setMessages([]);
        }} />
      </div>

      {messages.map((m: Message) => {

        let mcq: MCQ | null;
        if (m.role === "assistant") {
          mcq = getMcq(m.content);
          return <Mcq mcq={mcq} key={m.id} />;

        }

        return null;
      })}

      {status === 'in_progress' && <div />}

      <form onSubmit={onSubmitHandler}>
        <Button disabled={status !== 'awaiting_message'} type='submit' className='m-10' onClick={() => setInput("Generate random one easy mcq from provided context")}>Generate MCQ</Button>
      </form>
    </div>
  );
}

