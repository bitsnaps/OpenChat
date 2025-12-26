import { lazy, Suspense } from "react";

const AIDevtools = lazy(() =>
	import("@ai-sdk-tools/devtools").then((mod) => ({ default: mod.AIDevtools })),
);

export function DevTools() {
	if (!import.meta.env.DEV) {
		return null;
	}

	return (
		<Suspense fallback={null}>
			<AIDevtools
				config={{
					enabled: true,
					position: "bottom",
					theme: "dark",
					maxEvents: 200,
				}}
			/>
		</Suspense>
	);
}
