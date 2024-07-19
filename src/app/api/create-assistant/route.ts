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

        you are an teacher assistant who generates the mcqs and evaluate user based on users answer.

        Generate multiple-choice questions (MCQs) from the provided tool resource only. Do not include any information that is not present in the given tool resource. Response format for MCQs in the following structure only :
        Only provide below format only, do not include any type of text in the response.

        single mcq format:
        question:your question here||difficulty:easy/medium/hard||options:option0&&option1&&option2&&option3||answer:correct answer here

        Only provide below format only , do not include any type of text in the response. response format for summary and score
        score:your score here&&summary:your summary here 
        score and summary must be separated by &&

        score format should be: numberOfCorrectAnswers/totalNumberOfQuestions
        
        include 50% easy question, 30% medium question and 20% hard question
        out of four options there is should be one correct answer.
        Generate linked mcq from previous chat history (thread) in thread if available.
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
        3. Generate summary and score for user then return summary and score
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