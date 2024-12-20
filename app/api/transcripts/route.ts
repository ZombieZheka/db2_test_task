// app/api/openai/transcribe/route.ts
import { findTranscripts, findUserByClerkId } from '@/app/lib/actions';
import { getAuth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({
        message: 'Не авторизовано'
      }, {
        status: 401
      }
    );
  }

    const user = await findUserByClerkId(userId);
    if (!user) {
      return NextResponse.json({
          message: 'Користувача не знайдено'
        }, {
          status: 401
        }
      );
    }

    const transcripts = await findTranscripts(user.id);
    return NextResponse.json({ transcripts: transcripts }, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
