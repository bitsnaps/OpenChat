import { X } from "@phosphor-icons/react";
import { lazy } from "react";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type DrawerSettingsProps = {
	trigger: React.ReactNode;
	isOpen: boolean;
	setIsOpenAction: (open: boolean) => void;
};

// Dynamically import the same pages used in the desktop routes so that we
// don't duplicate code. Using React.lazy for code splitting.
const AccountPage = lazy(() =>
	import("@/routes/settings/index").then((m) => ({
		default: m.AccountSettingsPage,
	})),
);
const CustomizationPage = lazy(() =>
	import("@/routes/settings/customization").then((m) => ({
		default: m.CustomizationSettingsPage,
	})),
);
const HistorySettingsPage = lazy(() =>
	import("@/routes/settings/history").then((m) => ({
		default: m.HistorySettingsPage,
	})),
);
const AttachmentsPage = lazy(() =>
	import("@/routes/settings/attachments").then((m) => ({
		default: m.AttachmentsSettingsPage,
	})),
);
const ApiKeysPage = lazy(() =>
	import("@/routes/settings/api-keys").then((m) => ({
		default: m.ApiKeysSettingsPage,
	})),
);
const ModelsPage = lazy(() =>
	import("@/routes/settings/models").then((m) => ({
		default: m.ModelsSettingsPage,
	})),
);
const ConnectorsPage = lazy(() =>
	import("@/routes/settings/connectors").then((m) => ({
		default: m.ConnectorsSettingsPage,
	})),
);

const NAV_ITEMS = [
	{ key: "account", name: "Account" },
	{ key: "customization", name: "Customization" },
	{ key: "history", name: "History & Sync" },
	{ key: "models", name: "Models" },
	{ key: "api-keys", name: "API Keys" },
	{ key: "connectors", name: "Connectors" },
	{ key: "attachments", name: "Attachments" },
] as const;

export function DrawerSettings({
	trigger,
	isOpen,
	setIsOpenAction,
}: DrawerSettingsProps) {
	return (
		<Drawer
			dismissible={true}
			onOpenChange={setIsOpenAction}
			open={isOpen}
			shouldScaleBackground={false}
		>
			<DrawerTrigger asChild>{trigger}</DrawerTrigger>
			<DrawerContent>
				<div className="flex h-dvh max-h-[80vh] flex-col">
					<DrawerHeader className="flex-row items-center justify-between border-border border-b px-6 py-4">
						<DrawerTitle className="font-semibold text-base">
							Settings
						</DrawerTitle>
						<DrawerClose asChild>
							<button
								aria-label="Close settings"
								className="flex size-11 items-center justify-center rounded-full hover:bg-muted focus:outline-none"
								type="button"
							>
								<X className="size-5" />
							</button>
						</DrawerClose>
					</DrawerHeader>

					<Tabs
						className="flex flex-1 flex-col overflow-hidden"
						defaultValue="account"
					>
						<div className="relative mb-2">
							<span className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-background" />
							<span className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-background" />
							<div className="overflow-x-auto">
								<TabsList className="h-auto w-max min-w-full p-1 [scroll-snap-type:x_mandatory]">
									{NAV_ITEMS.map((item) => (
										<TabsTrigger
											className="shrink-0 [scroll-snap-align:start]"
											key={item.key}
											value={item.key}
										>
											{item.name}
										</TabsTrigger>
									))}
								</TabsList>
							</div>
						</div>

						<div className="flex-1 overflow-auto px-6 pt-4 pb-16">
							<TabsContent value="account">
								<AccountPage />
							</TabsContent>
							<TabsContent value="customization">
								<CustomizationPage />
							</TabsContent>
							<TabsContent value="history">
								<HistorySettingsPage />
							</TabsContent>
							<TabsContent value="models">
								<ModelsPage />
							</TabsContent>
							<TabsContent value="api-keys">
								<ApiKeysPage />
							</TabsContent>
							<TabsContent value="connectors">
								<ConnectorsPage />
							</TabsContent>
							<TabsContent value="attachments">
								<AttachmentsPage />
							</TabsContent>
						</div>
					</Tabs>
				</div>
			</DrawerContent>
		</Drawer>
	);
}
