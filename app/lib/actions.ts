// app/lib/actions.ts

import { prisma } from "@/app/lib/prisma";

export async function createUser(
  clerkId: string,
  email: string,
  name: string
) {
  
  const user = await prisma.user.create({
    data: {
      clerkId,
      email,
      name
    }
  });

  const returnUser = prisma.user.findUnique({
    where: {
      email: user.email
    },
    include: {
      transcripts: true
    }
  });

  return returnUser;
}

export async function createTranscript(
  userId: number,
  text: string,
  language: string,
  duration: string,
  words: number) {

  // const user = await prisma.user.findUnique({
  //   where: {
  //     id: userId
  //   }
  // });

  const transcript = await prisma.transcript.create({
    data: {
      user: {
        connect: {
          id: userId
        }
      },
      text,
      language,
      duration,
      words
    }
  });

  const returnTranscript = await prisma.transcript.findUnique({
    where: {
      id: transcript.id
    }
  });

  return returnTranscript;
}

export async function getTranscripts(userId: number) {
  const transcripts = prisma.transcript.findMany({
    where: {
      userId: userId
    }
  });
  return transcripts;
}
