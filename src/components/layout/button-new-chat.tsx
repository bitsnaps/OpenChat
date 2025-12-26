import { NotePencil } from "@phosphor-icons/react";
import { Link, useLocation } from "@tanstack/react-router";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

export function ButtonNewChat() {
	const location = useLocation();
	const pathname = location.pathname;
	if (pathname === "/") {
		return null;
	}

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Link
					className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
					to="/"
				>
					<NotePencil size={24} />
				</Link>
			</TooltipTrigger>
			<TooltipContent>New Chat</TooltipContent>
		</Tooltip>
	);
}
