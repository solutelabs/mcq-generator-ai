import OpenAI from "openai";

export async function POST(req: Request) {

    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    const vectorStore = await openai.beta.vectorStores.create({
        name: "Varsity-zerodha-vector-store",
    });

    const responseOfFilesUpload = await openai.beta.vectorStores.fileBatches.uploadAndPoll(vectorStore.id, { files });

    const assistant = await openai.beta.assistants.create({
        name: "Varsity-zerodha-assistant",
        instructions: `
        Generate multiple-choice questions (MCQs) from the provided tool resource only. Do not include any information that is not present in the given tool resource. Response format for each MCQ in the following structure only :
        Only provide below format only, do not include any type of text in the response.

        question:your question here||answer:correct answer here||options:option0&&option1&&option2&&option3||difficulty:easy/medium/hard

        out of four options there is should be one correct answer.
        don't write citations of files in the response.
        Generate linked mcq from previous chat history in thread if available.
        `,
        model: "gpt-4o",
        tools: [
            { type: "file_search" },
        ],
        tool_resources: {
            file_search: {
                vector_store_ids: [vectorStore.id],
            }
        },
    });

    return new Response(JSON.stringify({ assistant, responseOfFilesUpload }));
}