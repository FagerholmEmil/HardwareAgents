import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <Link href="/">
       404 Not Found
      </Link>
    </div>
  );
}