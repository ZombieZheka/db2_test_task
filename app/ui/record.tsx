// app/ui/record.tsx

export default function Record(date: Date, transcript: string) {
  return (
    <div>
      <div>{date.toDateString()}</div>
      <div>{transcript}</div>
    </div>
  );
}
