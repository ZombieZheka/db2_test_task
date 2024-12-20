// app/dashboard/layout.tsx

'use client';

import {
  useUser,
  SignedIn,
  UserButton
} from '@clerk/nextjs';
import Record from "@/app/ui/record";
import Link from 'next/link';

import {
  useState,
  useEffect
} from "react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isSignedIn, user } = useUser();
  const [transcripts, setTranscripts] = useState([]);

  useEffect(() => {
    if (!isSignedIn || !user) return;

    const fetchTranscripts = async () => {
      try {
        const response = await fetch('/api/transcripts', {
          method: 'GET'
        });
        if (!response.ok) {
          console.error('Failed to fetch transcripts');
        }
        
        const data = await response.json();
        setTranscripts(data.transcripts);
      } catch (err) {
        console.error('Error:', err);
      }
    };

    fetchTranscripts();
  });

  console.log('Transcripts:', transcripts);

  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
      <SignedIn>
        <div className='absolute w-200 h-full bg-gray-400'>
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: 'm-2 w-12 h-12 border'
              }
            }}
          />
          <div
            className="m-2"
          >
            <Link
              className="text-white bg-blue-500 p-2 rounded"
              href={'/'}
            >Home</Link>
          </div>
          {transcripts.map((transcript, index) => {
            return (
              <Record
                key={index}
                transcript={transcript}
              />
            );
          })}
        </div>
      </SignedIn>
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}
