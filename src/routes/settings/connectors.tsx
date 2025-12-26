import { useAuthToken } from "@convex-dev/auth/react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "convex/react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { ConnectorGrid } from "@/components/layout/settings/connectors/ConnectorGrid";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { getConnectorConfig, SUPPORTED_CONNECTORS } from "@/lib/config/tools";
import type { ConnectorType } from "@/lib/types";
import { useUser } from "@/providers/user-provider";

export const Route = createFileRoute("/settings/connectors")({
	component: ConnectorsSettingsPage,
});

type SimpleConnectionState = {
	status: "idle" | "connecting";
};

type ConnectorCategory = {
	name: string;
	description: string;
	types: ConnectorType[];
};

const CONNECTOR_CATEGORIES: ConnectorCategory[] = [
	{
		name: "Google Workspace",
		description: "Seamlessly integrate your Google productivity suite",
		types: [
			"gmail",
			"googlecalendar",
			"googledrive",
			"googledocs",
			"googlesheets",
		],
	},
	{
		name: "Communication",
		description: "Connect your messaging and social platforms",
		types: ["slack", "twitter"],
	},
	{
		name: "Development & Productivity",
		description: "Sync with your workflow and project management tools",
		types: ["notion", "linear", "github"],
	},
];

export function ConnectorsSettingsPage() {
	const authToken = useAuthToken();
	const { user, connectors, isConnectorsLoading } = useUser();
	const setConnectorEnabled = useMutation(
		api.connectors.setConnectorEnabled
	).withOptimisticUpdate((localStore, { type, enabled }) => {
		const currentConnectors = localStore.getQuery(
			api.connectors.listUserConnectors
		);
		if (currentConnectors) {
			const updatedConnectors = currentConnectors.map((connector) =>
				connector.type === type ? { ...connector, enabled } : connector
			);
			localStore.setQuery(
				api.connectors.listUserConnectors,
				{},
				updatedConnectors
			);
		}
	});
	const [connectionStates, setConnectionStates] = useState<
		Record<ConnectorType, SimpleConnectionState>
	>(() => {
		const initialStates: Record<ConnectorType, SimpleConnectionState> =
			{} as Record<ConnectorType, SimpleConnectionState>;
		for (const type of SUPPORTED_CONNECTORS) {
			initialStates[type] = { status: "idle" };
		}
		return initialStates;
	});

	const handleConnect = useCallback(
		async (type: ConnectorType) => {
			if (!user) {
				toast.error("Please log in to connect accounts");
				return;
			}

			setConnectionStates((prev) => ({
				...prev,
				[type]: { status: "connecting" },
			}));

			try {
				const response = await fetch("/api/composio/connect", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						...(authToken && { Authorization: `Bearer ${authToken}` }),
					},
					body: JSON.stringify({ connectorType: type }),
				});

				if (!response.ok) {
					const error = await response.json();
					toast.error(
						error.error ||
							`Failed to connect to ${getConnectorConfig(type).displayName}`
					);
					setConnectionStates((prev) => ({
						...prev,
						[type]: { status: "idle" },
					}));
					return;
				}

				const { redirectUrl, connectionRequestId } = await response.json();

				try {
					const url = new URL(redirectUrl);
					if (url.protocol !== "https:") {
						throw new Error("Invalid URL protocol");
					}
				} catch {
					toast.error("Invalid redirect URL");
					setConnectionStates((prev) => ({
						...prev,
						[type]: { status: "idle" },
					}));
					return;
				}

				sessionStorage.setItem(
					`composio_connection_${type}`,
					connectionRequestId
				);

				window.location.href = redirectUrl;
			} catch (_error) {
				toast.error(
					`Failed to connect to ${getConnectorConfig(type).displayName}`
				);
				setConnectionStates((prev) => ({
					...prev,
					[type]: { status: "idle" },
				}));
			}
		},
		[authToken, user]
	);

	const handleDisconnect = useCallback(
		async (type: ConnectorType) => {
			if (!user) {
				toast.error("Please log in to disconnect accounts");
				return;
			}

			try {
				const response = await fetch("/api/composio/disconnect", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						...(authToken && { Authorization: `Bearer ${authToken}` }),
					},
					body: JSON.stringify({ connectorType: type }),
				});

				if (!response.ok) {
					const error = await response.json();
					throw new Error(error.error || "Failed to disconnect");
				}

				toast.success(
					`${getConnectorConfig(type).displayName} disconnected successfully`
				);
			} catch {
				toast.error(
					`Failed to disconnect ${getConnectorConfig(type).displayName}`
				);
			}
		},
		[authToken, user]
	);

	const handleToggleEnabled = useCallback(
		async (type: ConnectorType, enabled: boolean) => {
			if (!user) {
				toast.error("Please log in to update connector settings");
				return;
			}
			await setConnectorEnabled({ type, enabled });
		},
		[user, setConnectorEnabled]
	);

	const connectingStates = Object.fromEntries(
		Object.entries(connectionStates).map(([key, { status }]) => [
			key,
			status === "connecting",
		])
	) as Record<ConnectorType, boolean>;

	const connectedCount = connectors.filter((c) => c.isConnected).length;
	const enabledCount = connectors.filter(
		(c) => c.isConnected && c.enabled !== false
	).length;

	return (
		<div className="space-y-8">
			<header className="space-y-4">
				<div className="flex items-baseline justify-between">
					<h1 className="font-semibold text-2xl tracking-tight">Connectors</h1>
					{!isConnectorsLoading && connectedCount > 0 && (
						<div className="flex items-center gap-2">
							<span className="rounded-full bg-muted px-2.5 py-1 font-medium text-muted-foreground text-xs">
								{connectedCount} connected
							</span>
							<span className="text-muted-foreground/40">·</span>
							<span className="rounded-full bg-emerald-500/10 px-2.5 py-1 font-medium text-emerald-600 text-xs dark:text-emerald-400">
								{enabledCount} active
							</span>
						</div>
					)}
				</div>
				<p className="text-muted-foreground leading-relaxed">
					Connect your favorite services to supercharge your conversations. Once
					connected, you can interact with these platforms directly through
					chat.
				</p>
			</header>

			{isConnectorsLoading ? (
				<div className="space-y-10">
					{CONNECTOR_CATEGORIES.map((category) => (
						<div className="space-y-4" key={category.name}>
							<div className="space-y-1">
								<Skeleton className="h-5 w-40" />
								<Skeleton className="h-4 w-64" />
							</div>
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
								{category.types.map((type) => (
									<Skeleton
										className="h-36 rounded-xl"
										key={`loading-${type}`}
									/>
								))}
							</div>
						</div>
					))}
				</div>
			) : (
				<div className="space-y-10">
					{CONNECTOR_CATEGORIES.map((category) => (
						<section
							aria-labelledby={`category-${category.name}`}
							className="space-y-4"
							key={category.name}
						>
							<div className="space-y-1">
								<h2
									className="font-medium text-foreground text-sm tracking-wide"
									id={`category-${category.name}`}
								>
									{category.name}
								</h2>
								<p className="text-muted-foreground/80 text-xs">
									{category.description}
								</p>
							</div>
							<ConnectorGrid
								connectingStates={connectingStates}
								connectors={connectors}
								connectorTypes={category.types}
								onConnectAction={handleConnect}
								onDisconnectAction={handleDisconnect}
								onToggleEnabledAction={handleToggleEnabled}
							/>
						</section>
					))}
				</div>
			)}
		</div>
	);
}
