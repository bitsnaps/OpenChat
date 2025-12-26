import { convexQuery } from "@convex-dev/react-query";
import { ListMagnifyingGlass } from "@phosphor-icons/react";
import { useQuery as useTanStackQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "@tanstack/react-router";
import { useMutation } from "convex/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
	Command,
	CommandDialog,
	CommandEmpty,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	getOrderedGroupKeys,
	groupChatsByTime,
	hasChatsInGroup,
} from "@/lib/chat-utils/time-grouping";
import { api } from "../../../convex/_generated/api";
import type { Doc, Id } from "../../../convex/_generated/dataModel";
import { CommandHistoryItem } from "./command-history-item";

// Static - compute once at module level
const ORDERED_GROUP_KEYS = getOrderedGroupKeys();

function getSnippet(text: string, query: string, length = 80): React.ReactNode {
	const lower = text.toLowerCase();
	const q = query.toLowerCase();
	const idx = lower.indexOf(q);
	if (idx === -1) {
		return text.slice(0, length);
	}
	const start = Math.max(0, idx - Math.floor((length - q.length) / 2));
	const snippet = text.slice(start, start + length);
	const matchStart = idx - start;
	return (
		<>
			{snippet.slice(0, matchStart)}
			<mark>{snippet.slice(matchStart, matchStart + q.length)}</mark>
			{snippet.slice(matchStart + q.length)}
		</>
	);
}

export function CommandHistory() {
	const router = useRouter();
	const params = useParams({ strict: false }) as { chatId?: string };
	const { data: chatHistory } = useTanStackQuery({
		...convexQuery(api.chats.listChatsForUser, {}),
	});
	const deleteChat = useMutation(api.chats.deleteChat);
	const updateChatTitle = useMutation(api.chats.updateChatTitle);
	const pinChatToggle = useMutation(api.chats.pinChatToggle);
	const [isOpen, setIsOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const { data: messageResults = [] } = useTanStackQuery({
		...convexQuery(
			api.messages.searchMessages,
			searchQuery ? { query: searchQuery } : "skip",
		),
		enabled: Boolean(searchQuery),
	});
	const [editingId, setEditingId] = useState<Id<"chats"> | null>(null);
	const [editTitle, setEditTitle] = useState("");
	const [deletingId, setDeletingId] = useState<Id<"chats"> | null>(null);

	const handleEdit = useCallback((chat: Doc<"chats">) => {
		setEditingId(chat._id);
		setEditTitle(chat.title || "");
	}, []);

	const handleSaveEdit = useCallback(
		async (id: Id<"chats">) => {
			setEditingId(null);
			await updateChatTitle({ chatId: id, title: editTitle });
		},
		[editTitle, updateChatTitle],
	);

	const handleCancelEdit = useCallback(() => {
		setEditingId(null);
		setEditTitle("");
	}, []);

	const handleDelete = useCallback((id: Id<"chats">) => {
		setDeletingId(id);
	}, []);

	const handleConfirmDelete = useCallback(
		async (id: Id<"chats">) => {
			setDeletingId(null);
			await deleteChat({ chatId: id });
		},
		[deleteChat],
	);

	const handleCancelDelete = useCallback(() => {
		setDeletingId(null);
	}, []);

	const handleTogglePin = useCallback(
		async (chat: Doc<"chats">) => {
			await pinChatToggle({ chatId: chat._id });
		},
		[pinChatToggle],
	);

	// Listen for global openCommandHistory and toggleFloatingSearch events
	useEffect(() => {
		const open = () => setIsOpen(true);
		const toggle = () => setIsOpen((prev) => !prev);
		window.addEventListener("openCommandHistory", open);
		window.addEventListener("toggleFloatingSearch", toggle);
		return () => {
			window.removeEventListener("openCommandHistory", open);
			window.removeEventListener("toggleFloatingSearch", toggle);
		};
	}, []);

	const handleOpenChange = (open: boolean) => {
		setIsOpen(open);
		if (!open) {
			setSearchQuery("");
			setEditingId(null);
			setEditTitle("");
			setDeletingId(null);
		}
	};

	// Memoize all filtering and grouping to avoid O(N) work on every render
	const { filteredChat, pinnedChats, groupedChats } = useMemo(() => {
		if (!chatHistory) {
			return {
				filteredChat: [],
				pinnedChats: [],
				unpinnedChats: [],
				groupedChats: {} as ReturnType<typeof groupChatsByTime>,
			};
		}

		const lowerQuery = searchQuery.toLowerCase();
		const filtered = chatHistory.filter((chat) =>
			(chat.title || "").toLowerCase().includes(lowerQuery),
		);

		const pinned: Doc<"chats">[] = [];
		const unpinned: Doc<"chats">[] = [];

		for (const chat of filtered) {
			if (chat.isPinned) {
				pinned.push(chat);
			} else {
				unpinned.push(chat);
			}
		}

		return {
			filteredChat: filtered,
			pinnedChats: pinned,
			unpinnedChats: unpinned,
			groupedChats: groupChatsByTime(unpinned),
		};
	}, [chatHistory, searchQuery]);

	// Build a map for O(1) chat title lookups instead of O(N) .find() calls
	const chatTitleById = useMemo(() => {
		const map = new Map<string, string>();
		if (chatHistory) {
			for (const c of chatHistory) {
				map.set(c._id, c.title || "Untitled Chat");
			}
		}
		return map;
	}, [chatHistory]);

	// Defer route preloading to idle time and limit to top 10 items
	useEffect(() => {
		if (!(isOpen && chatHistory)) {
			return;
		}

		const subset = chatHistory.slice(0, 10);
		const preload = () => {
			for (const chat of subset) {
				router.preloadRoute({ to: "/c/$chatId", params: { chatId: chat._id } });
			}
		};

		if ("requestIdleCallback" in window) {
			const id = window.requestIdleCallback(preload);
			return () => window.cancelIdleCallback(id);
		}
		const id = setTimeout(preload, 100);
		return () => clearTimeout(id);
	}, [isOpen, chatHistory, router]);

	return (
		<>
			<Tooltip>
				<TooltipTrigger asChild>
					<button
						className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
						onClick={() => setIsOpen(true)}
						type="button"
					>
						<ListMagnifyingGlass size={24} />
					</button>
				</TooltipTrigger>
				<TooltipContent>History</TooltipContent>
			</Tooltip>

			<CommandDialog
				description="Search through your past conversations"
				onOpenChange={handleOpenChange}
				open={isOpen}
				title="Chat History"
			>
				<Command shouldFilter={false}>
					<CommandInput
						onValueChange={(value) => setSearchQuery(value)}
						placeholder="Search history..."
						value={searchQuery}
					/>
					<CommandList className="max-h-[480px] min-h-[480px] flex-1">
						{/* Invisible placeholder (size zero, no pointer) so nothing visible is preselected */}
						<CommandItem
							className="pointer-events-none h-0 w-0 overflow-hidden opacity-0"
							value="__placeholder"
						/>
						{filteredChat.length === 0 && messageResults.length === 0 && (
							<CommandEmpty>No chat history found.</CommandEmpty>
						)}

						{!!searchQuery && messageResults.length > 0 ? (
							<div className="px-2 pb-2">
								<div className="flex h-8 shrink-0 items-center rounded-md px-1.5 font-semibold text-muted-foreground text-sm uppercase tracking-wide">
									Messages
								</div>
								{messageResults.map((msg) => (
									<CommandItem
										className="px-2 py-1"
										key={msg._id}
										onSelect={() => {
											// For messages, always navigate since the message ID parameter makes it a different URL
											// and we want to scroll to the specific message
											router.navigate({
												to: "/c/$chatId",
												params: { chatId: msg.chatId },
												search: { m: msg._id },
												replace: true,
											});
											setIsOpen(false);
										}}
										value={msg._id}
									>
										<div className="flex flex-col">
											<span className="line-clamp-2 text-sm">
												{getSnippet(msg.content, searchQuery)}
											</span>
											<span className="text-muted-foreground text-xs">
												{chatTitleById.get(msg.chatId) ?? "Untitled Chat"}
											</span>
										</div>
									</CommandItem>
								))}
							</div>
						) : null}

						{filteredChat.length > 0 && (
							<div className="px-2 pt-1">
								<div className="flex h-8 shrink-0 items-center rounded-md px-1.5 font-semibold text-muted-foreground text-sm uppercase tracking-wide">
									Chats
								</div>
								{pinnedChats.length > 0 && (
									<div className="px-2 pb-2">
										<div className="flex h-8 shrink-0 items-center rounded-md px-1.5 font-semibold text-muted-foreground text-sm uppercase tracking-wide">
											Pinned
										</div>
										{pinnedChats.map((chat) => (
												<CommandHistoryItem
													chat={chat}
													chatTitleById={chatTitleById}
													currentChatId={params.chatId}
													deletingId={deletingId}
													editingId={editingId}
													editTitle={editTitle}
													handleCancelDelete={handleCancelDelete}
													handleCancelEdit={handleCancelEdit}
													handleConfirmDelete={handleConfirmDelete}
													handleDelete={handleDelete}
													handleEdit={handleEdit}
													handleSaveEdit={handleSaveEdit}
													handleTogglePin={handleTogglePin}
													key={chat._id}
													router={router}
													setEditTitle={setEditTitle}
													setIsOpen={setIsOpen}
												/>
											))}
									</div>
								)}
							</div>
						)}
						{/* Time-based Groups */}
						{ORDERED_GROUP_KEYS.map(
							(groupKey) =>
								hasChatsInGroup(groupedChats, groupKey) && (
									<div className="px-2 pb-2" key={groupKey}>
										<div className="flex h-8 shrink-0 items-center rounded-md px-1.5 font-semibold text-muted-foreground text-sm uppercase tracking-wide">
											{groupKey}
										</div>
										{groupedChats[groupKey].map((chat) => (
												<CommandHistoryItem
													chat={chat}
													chatTitleById={chatTitleById}
													currentChatId={params.chatId}
													deletingId={deletingId}
													editingId={editingId}
													editTitle={editTitle}
													handleCancelDelete={handleCancelDelete}
													handleCancelEdit={handleCancelEdit}
													handleConfirmDelete={handleConfirmDelete}
													handleDelete={handleDelete}
													handleEdit={handleEdit}
													handleSaveEdit={handleSaveEdit}
													handleTogglePin={handleTogglePin}
													key={chat._id}
													router={router}
													setEditTitle={setEditTitle}
													setIsOpen={setIsOpen}
												/>
											))}
									</div>
								),
						)}
					</CommandList>
				</Command>
			</CommandDialog>
		</>
	);
}
