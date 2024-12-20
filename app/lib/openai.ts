import OpenAI from "openai";

// console.log(process.env.OPENAI_API_KEY);
// if (!process.env.OPENAI_API_KEY) {
//   throw new Error("The OPENAI_API_KEY environment variable is missing or empty.");
// }

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function audioTranscript(file: File) {
  const transcription = await openai.audio.transcriptions.create({
    file: file,
    model: "whisper-1",
  });
  return transcription;
}
