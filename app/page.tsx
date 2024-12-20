// app/page.tsx
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton
} from '@clerk/nextjs'
import AudioUploader from './ui/audio-uploader';

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <SignedOut>
          <SignedOutDiv/>
        </SignedOut>
        <SignedIn>
          <SignedInDiv/>
        </SignedIn>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        footer
      </footer>
    </div>
  );
}

function SignedOutDiv() {
  return (
    <div className='flex'>
      <SignInButton>
        <button
          className='rounded border p-2 m-2 bg-blue-500 hover:border-black'
        >Sign In</button>
      </SignInButton>
      <SignUpButton>
        <button
          className='rounded border p-2 m-2 hover:border-black'
        >Sign Up</button>
      </SignUpButton>
    </div>
  );
}

function SignedInDiv() {
  return (
    <SignedIn>
      {/* <div> */}
        <AudioUploader/>
      {/* </div> */}
    </SignedIn>
  );
}
