import type { ConnectorType } from "@/lib/types";
import type { Id } from "../../../../../convex/_generated/dataModel";
import { ConnectorCard } from "./ConnectorCard";

type ConnectorData = {
	_id?: Id<"connectors">;
	type: ConnectorType;
	isConnected: boolean;
	enabled?: boolean;
	displayName?: string;
	connectionId?: string;
};

type ConnectorGridProps = {
	connectorTypes: ConnectorType[];
	connectors: ConnectorData[];
	onConnectAction: (type: ConnectorType) => void;
	onDisconnectAction: (type: ConnectorType) => Promise<void>;
	onToggleEnabledAction: (
		type: ConnectorType,
		enabled: boolean,
	) => Promise<void>;
	connectingStates: Record<ConnectorType, boolean>;
};

export function ConnectorGrid({
	connectorTypes,
	connectors,
	onConnectAction,
	onDisconnectAction,
	onToggleEnabledAction,
	connectingStates,
}: ConnectorGridProps) {
	const connectorMap = new Map(
		connectors.map((connector) => [connector.type, connector]),
	);

	const filteredConnectors: ConnectorData[] = connectorTypes.map(
		(type: ConnectorType) => {
			const existing = connectorMap.get(type);
			return (
				existing ?? {
					type,
					isConnected: false,
				}
			);
		},
	);

	return (
		<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
			{filteredConnectors.map((connector, index) => (
				<div
					className="animate-in fade-in slide-in-from-bottom-2 duration-300"
					key={connector.type}
					style={{
						animationDelay: `${index * 50}ms`,
						animationFillMode: "backwards",
					}}
				>
					<ConnectorCard
						connector={connector}
						isConnecting={connectingStates[connector.type]}
						onConnectAction={onConnectAction}
						onDisconnectAction={onDisconnectAction}
						onToggleEnabledAction={onToggleEnabledAction}
					/>
				</div>
			))}
		</div>
	);
}
