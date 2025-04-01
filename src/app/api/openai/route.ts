import { NextResponse } from 'next/server';
import dotenv from 'dotenv';
import { BufferMemory } from 'langchain/memory';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ConversationChain } from 'langchain/chains';
import { ChatOpenAI } from '@langchain/openai';

dotenv.config();

let memory = new BufferMemory({
  returnMessages: true,
  memoryKey: 'history',
});

export async function POST(req: Request) {
  try {
    console.log('Memory before call:', memory);

    const { message } = await req.json();

    const chatModel = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: 'gpt-3.5-turbo',
      temperature: 0.5,
      maxTokens: 2048,
    });

    const promptTemplate = ChatPromptTemplate.fromTemplate(['Je bent een Nederlandstalig LLM.', '{history}', '{input}'].join('\n'));

    const chain = new ConversationChain({
      memory: memory,
      prompt: promptTemplate,
      llm: chatModel,
    });

    const response = await chain.call({
      input: message,
    });

    const memoryVariables = await memory.loadMemoryVariables({});
    console.log('Current memory:', memoryVariables);

    return NextResponse.json({
      message: response.response,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}
