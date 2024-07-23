import { prompt } from "@/lib/utils";
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
        instructions: prompt,
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