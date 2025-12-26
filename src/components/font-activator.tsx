import { useEffect, useMemo, useRef } from "react";
import type { ThemeEditorState } from "@/lib/types/theme";

type Props = {
	themeState: ThemeEditorState;
};

type FontModule = {
	fontVar: string;
	fontFamily: string;
};

function getPrimaryFontName(fontFamily: string | undefined): string | null {
	if (!fontFamily) return null;
	const first = fontFamily.split(",")[0]?.trim();
	if (!first) return null;
	return first.replace(/^["']|["']$/g, "");
}

// Normalize font keys for robust lookups: trim, strip quotes, collapse spaces, lowercase
const normalizeFontKey = (value: string): string =>
	value
		.trim()
		.replace(/^["']|["']$/g, "")
		.replace(/\s+/g, " ")
		.toLowerCase();

const registry: Record<string, () => Promise<FontModule>> = {
	Inter: () => import("./font-registry/inter"),
	"Space Grotesk": () => import("./font-registry/space-grotesk"),
	"Open Sans": () => import("./font-registry/open-sans"),
	"DM Sans": () => import("./font-registry/dm-sans"),
	"Architects Daughter": () => import("./font-registry/architects-daughter"),
	"Atkinson Hyperlegible": () =>
		import("./font-registry/atkinson-hyperlegible"),
	"Atkinson Hyperlegible Mono": () =>
		import("./font-registry/atkinson-hyperlegible-mono"),
	"Fira Mono": () => import("./font-registry/fira-mono"),
	"JetBrains Mono": () => import("./font-registry/jetbrains-mono"),
	"IBM Plex Mono": () => import("./font-registry/ibm-plex-mono"),
};

// Create a normalized registry view for case/spacing-insensitive lookups
const normalizedRegistry: Record<string, () => Promise<FontModule>> =
	Object.freeze(
		Object.fromEntries(
			Object.entries(registry).map(([k, v]) => [normalizeFontKey(k), v]),
		),
	);

export function FontActivator({ themeState }: Props) {
	const loadedRef = useRef<Set<string>>(new Set());
	const appliedVarsRef = useRef<Map<string, string>>(new Map());

	const names = useMemo(() => {
		const s = new Set<string>();
		const exclude = new Set(["geist", "geist mono", "geist sans"]);
		const lightSans = getPrimaryFontName(themeState.styles.light["font-sans"]);
		const lightMono = getPrimaryFontName(themeState.styles.light["font-mono"]);
		const darkSans = getPrimaryFontName(themeState.styles.dark["font-sans"]);
		const darkMono = getPrimaryFontName(themeState.styles.dark["font-mono"]);
		for (const n of [lightSans, lightMono, darkSans, darkMono]) {
			if (!n) continue;
			const normalized = normalizeFontKey(n);
			if (!exclude.has(normalized)) s.add(normalized);
		}
		return Array.from(s);
	}, [themeState.styles]);

	useEffect(() => {
		let cancelled = false;

		async function loadAndApplyFonts() {
			const root = document.documentElement;
			if (!root) return;

			for (const name of names) {
				// Skip if already loaded
				if (loadedRef.current.has(name)) continue;

				const importer = normalizedRegistry[name];
				if (!importer) continue;

				try {
					const mod = await importer();
					if (cancelled) return;

					// Mark as loaded
					loadedRef.current.add(name);

					// Set the CSS variable on the root element
					root.style.setProperty(mod.fontVar, mod.fontFamily);
					appliedVarsRef.current.set(mod.fontVar, mod.fontFamily);
				} catch {
					// Font loading failed, continue with next
				}
			}
		}

		loadAndApplyFonts();

		return () => {
			cancelled = true;
		};
	}, [names]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			const root = document.documentElement;
			if (!root) return;

			// Remove all applied CSS variables
			for (const varName of appliedVarsRef.current.keys()) {
				root.style.removeProperty(varName);
			}
			appliedVarsRef.current.clear();
		};
	}, []);

	return null;
}
