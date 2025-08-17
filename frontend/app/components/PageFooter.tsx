import {
  HandThumbUpIcon,
  ChatBubbleLeftIcon,
  UserIcon
} from "@heroicons/react/24/solid";
import Link from "next/link";

interface PageFooterElementProps {
  title: string;
  children?: React.ReactNode;
  href?: string;
}

function PageFooterElement({ title, href, children }: PageFooterElementProps) {
  return (
    
    <button className="shadow max-w-3xl max-auto p-0 space-y-1 w-full h-20 md:w-1/3 font-semibold text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-lg  mx-1">
      <Link href={href || "#"}>
      <div className="flex items-center justify-center">{children}</div>
      <div className="flex items-center justify-center">{title}</div>
      </Link>
    </button>
    
  );
}

export default function PageFooter() {
  return (
    <footer className="shadow-[0_-1px_1px_rgba(0,0,0,0.2)] mt-8 fixed bottom-0 w-full g-gray-50 z-10">
      <div className="max-w-7xl mx-auto px-4 py-6 items-center justify-between flex">
        <PageFooterElement title="Vote" href="/vote">
          <HandThumbUpIcon className="h-5 w-5 inline-block mr-2" />
        </PageFooterElement>
        <PageFooterElement title="Chat" href="/chat">
          <ChatBubbleLeftIcon className="h-5 w-5 inline-block mr-2" />
        </PageFooterElement>
        <PageFooterElement title="Profile" href="/profile">
          <UserIcon className="h-5 w-5 inline-block mr-2" />
        </PageFooterElement>
      </div>
    </footer>
  );
}
