import { ChartBar, Info } from "@phosphor-icons/react";
import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";
import isToday from "dayjs/plugin/isToday";
import isTomorrow from "dayjs/plugin/isTomorrow";
import React, { useCallback } from "react";
import { Progress } from "@/components/ui/progress";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { PREMIUM_CREDITS } from "@/lib/config";
import { useUser } from "@/providers/user-provider";

dayjs.extend(calendar);
dayjs.extend(isToday);
dayjs.extend(isTomorrow);

function MessageUsageCardComponent() {
	const { user, rateLimitStatus, hasPremium } = useUser();

	const formatResetDate = useCallback(
		(timestamp: number | null | undefined) => {
			if (!timestamp) {
				return "Not available";
			}
			try {
				const resetDate = dayjs(timestamp);

				return resetDate.calendar(null, {
					sameDay: "[today at] h:mm A",
					nextDay: "[tomorrow at] h:mm A",
					nextWeek() {
						return resetDate.format("MMM D [at] h:mm A");
					},
					lastDay: "[yesterday at] h:mm A",
					lastWeek() {
						return resetDate.format("MMM D [at] h:mm A");
					},
					sameElse() {
						if (resetDate.year() === dayjs().year()) {
							return resetDate.format("MMM D [at] h:mm A");
						}
						return resetDate.format("MMM D, YYYY [at] h:mm A");
					},
				});
			} catch {
				return "Error calculating reset time";
			}
		},
		[]
	);

	if (!(user && rateLimitStatus)) {
		return null;
	}

	const resetTimestamp = hasPremium
		? rateLimitStatus.monthlyReset
		: rateLimitStatus.dailyReset;
	const nextResetDateStr = formatResetDate(resetTimestamp);

	const standardLimit = hasPremium
		? rateLimitStatus.monthlyLimit
		: rateLimitStatus.dailyLimit;
	const standardCount = hasPremium
		? rateLimitStatus.monthlyCount
		: rateLimitStatus.dailyCount;
	const standardRemaining = hasPremium
		? rateLimitStatus.monthlyRemaining
		: rateLimitStatus.dailyRemaining;

	const premiumLimit = PREMIUM_CREDITS;
	const premiumCount = rateLimitStatus.premiumCount || 0;
	const premiumRemaining = rateLimitStatus.premiumRemaining || premiumLimit;

	return (
		<div className="rounded-xl border bg-card p-4">
			<div className="mb-3 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
						<ChartBar className="size-4 text-primary" />
					</div>
					<h3 className="font-medium text-sm">Message Usage</h3>
				</div>
				<Tooltip>
					<TooltipTrigger asChild>
						<span className="cursor-default text-right text-muted-foreground text-xs">
							Resets {nextResetDateStr}
						</span>
					</TooltipTrigger>
					<TooltipContent>
						<p>
							{resetTimestamp
								? dayjs(resetTimestamp).format("M/D/YYYY, h:mm:ss A")
								: "Not available"}
						</p>
					</TooltipContent>
				</Tooltip>
			</div>

			<div className="space-y-4">
				{/* Standard Credits */}
				<div className="space-y-2">
					<div className="flex items-center justify-between text-xs">
						<span className="text-muted-foreground">Standard</span>
						<span className="font-medium">
							{standardCount} / {standardLimit}
						</span>
					</div>
					<Progress
						className="h-1.5"
						value={Math.min((standardCount / standardLimit) * 100, 100)}
					/>
					<p className="text-muted-foreground text-[10px]">
						{standardRemaining} remaining
					</p>
				</div>

				{/* Premium Credits */}
				{Boolean(hasPremium) && (
					<div className="space-y-2">
						<div className="flex items-center justify-between text-xs">
							<span className="flex items-center gap-1 text-muted-foreground">
								Premium
								<Tooltip>
									<TooltipTrigger>
										<Info className="size-3" />
									</TooltipTrigger>
									<TooltipContent>
										<p>
											Premium credits are used for Claude 4 Sonnet and Grok 3.
										</p>
									</TooltipContent>
								</Tooltip>
							</span>
							<span className="font-medium">
								{premiumCount} / {premiumLimit}
							</span>
						</div>
						<Progress
							className="h-1.5"
							value={Math.min((premiumCount / premiumLimit) * 100, 100)}
						/>
						<p className="text-muted-foreground text-[10px]">
							{premiumRemaining} remaining
						</p>
					</div>
				)}
			</div>
		</div>
	);
}

export const MessageUsageCard = React.memo(MessageUsageCardComponent);
