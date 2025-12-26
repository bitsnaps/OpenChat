import { User } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { DrawerSettings } from "@/components/layout/settings/drawer-settings";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { useUser } from "@/providers/user-provider";

type SettingsTriggerProps = {
	isMenuItem?: boolean;
	onOpenChange?: (isOpen: boolean) => void;
};

export function SettingsTrigger({
	isMenuItem = false,
	onOpenChange,
}: SettingsTriggerProps) {
	const { user } = useUser();
	const isMobileOrTablet = useBreakpoint(896);
	const [isOpen, setIsOpen] = useState(false);

	if (!user) {
		return null;
	}

	if (isMenuItem && !isMobileOrTablet) {
		return (
			<DropdownMenuItem asChild>
				<Link
					className="flex w-full cursor-pointer select-none items-center justify-start gap-2 rounded px-2 py-1.5 text-sm hover:bg-accent focus:bg-accent focus:outline-none"
					to="/settings"
				>
					<User className="size-4" />
					<span className="flex-1 text-left">Settings</span>
				</Link>
			</DropdownMenuItem>
		);
	}

	if (isMenuItem && isMobileOrTablet) {
		const trigger = (
			<DropdownMenuItem
				onSelect={(e) => {
					e.preventDefault();
					setIsOpen(true);
				}}
			>
				<User className="size-4" />
				Settings
			</DropdownMenuItem>
		);
		return (
			<DrawerSettings
				isOpen={isOpen}
				setIsOpenAction={(open) => {
					setIsOpen(open);
					onOpenChange?.(open);
				}}
				trigger={trigger}
			/>
		);
	}

	if (isMobileOrTablet) {
		const trigger = (
			<button
				className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
				onClick={() => setIsOpen(true)}
				type="button"
			>
				<User className="size-4" />
			</button>
		);
		return (
			<DrawerSettings
				isOpen={isOpen}
				setIsOpenAction={setIsOpen}
				trigger={trigger}
			/>
		);
	}

	return (
		<Link
			className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
			to="/settings"
		>
			<User className="size-4" />
		</Link>
	);
}
