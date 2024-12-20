// app/ui/record.tsx

export default function Record({
  transcript: {
    text,
    createdAt
  }
}: {
  transcript: {
    text: string,
    createdAt: string
  }
}) {
  return (
    <div className="w-[200px] m-2 p-2 rounded border border-black bg-gray-300">
      <div
        className="text-sm"
      >{createdAt}</div>
      <span
        className="text-xs"
      >{text.slice(0, 50) + '...'}</span>
    </div>
  );
}
