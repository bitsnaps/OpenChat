import { createFileRoute, redirect } from "@tanstack/react-router";
import Chat from "@/components/chat/chat";

export const Route = createFileRoute("/c/$chatId")({
  ssr: false,
  beforeLoad: ({ params }) => {
    // If no chatId is provided, redirect to home
    if (!params.chatId) {
      throw redirect({ to: "/" });
    }
  },
  component: ChatPage,
});

function ChatPage() {
  const { chatId } = Route.useParams();
  // Key ensures component remounts when chatId changes
  return <Chat key={chatId} />;
}
