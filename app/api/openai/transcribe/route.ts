// app/api/openai/transcribe/route.ts
import { createTranscript, findUserByClerkId } from '@/app/lib/actions';
import { getAuth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({
      message: 'Не авторизовано'
    }, {
      status: 401
    });
  }

  const user = await findUserByClerkId(userId);
  if (!user) {
    return NextResponse.json({
      message: 'Користувача не знайдено'
    }, {
      status: 401
    });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({
        error: 'File is required'
      }, {
        status: 400
      });
    }

    const transcription = await openai.audio.transcriptions.create({
      file,
      model: 'whisper-1',
      response_format: "verbose_json",
      timestamp_granularities: ["word"]
    });
    const {
      text,
      language,
      duration,
      words
    } = transcription;

    if (!words) {
      return NextResponse.json({
        error: 'File is damaged'
      }, {
        status: 400
      });
    }

    const transcript = await createTranscript(user.id, text, language, `${duration}`, words.length);
    return NextResponse.json({ transcript: transcript }, { status: 200 });
  } catch (error) {
    console.error('OpenAI Error:', error.message);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
