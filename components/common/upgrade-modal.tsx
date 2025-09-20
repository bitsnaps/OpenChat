"use client";

import {
  BrainIcon,
  CheckCircleIcon,
  CheckIcon,
  EyeIcon,
  ImagesIcon,
  SparkleIcon,
} from "@phosphor-icons/react";
import { useAction } from "convex/react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useUser } from "@/app/providers/user-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/convex/_generated/api";

type UpgradeModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export function UpgradeModal({ isOpen, onOpenChange }: UpgradeModalProps) {
  const { user, products } = useUser();
  const generateCheckoutLink = useAction(api.polar.generateCheckoutLink);
  const router = useRouter();

  const handleUpgrade = useCallback(async () => {
    // Anonymous users: send to auth page
    if (user?.isAnonymous) {
      router.push("/auth");
      return;
    }

    if (!products?.premium?.id) {
      return;
    }

    try {
      const { url } = await generateCheckoutLink({
        productIds: [products.premium.id],
        origin: window.location.origin,
        successUrl: `${window.location.origin}/settings?upgraded=true`,
      });

      window.location.href = url;
    } catch (error) {
      // Silent error handling - user will notice if checkout fails
    }
  }, [user?.isAnonymous, products?.premium?.id, generateCheckoutLink, router]);

  return (
    <Dialog onOpenChange={onOpenChange} open={isOpen}>
      <DialogContent className="w-4xl max-h-full p-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-center font-bold text-2xl">
            Upgrade your plan
          </DialogTitle>
        </DialogHeader>
        <div className="flex-col sm:flex-row flex gap-6 p-6">
          {/* Free Plan */}
          <div className="flex-1 rounded-lg border bg-card p-6">
            <div className="mb-6">
              <h3 className="mb-2 font-semibold text-xl">Free</h3>
              <div className="flex items-baseline gap-1">
                <span className="font-bold text-3xl">$0</span>
                <span className="text-muted-foreground text-sm">
                  USD / month
                </span>
              </div>
              <p className="mt-2 text-muted-foreground">
                Intelligence for everyday tasks
              </p>
            </div>

            <div className="mb-6 rounded-md bg-muted/50 px-3 py-2 text-center font-medium text-sm">
              Your current plan
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <SparkleIcon className="size-5 text-green-500" />
                <span>Access to GPT-5</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircleIcon className="size-5 text-muted-foreground" />
                <span className="text-muted-foreground">
                  Limited file uploads
                </span>
              </div>
              <div className="flex items-center gap-3">
                <BrainIcon className="size-5 text-muted-foreground" />
                <span className="text-muted-foreground">
                  Limited memory and context
                </span>
              </div>
            </div>
          </div>

          {/* Go Plan */}
          <div className="relative flex-1 rounded-lg border-2 border-primary bg-card p-6">
            <div className="-top-3 -translate-x-1/2 absolute left-1/2 transform">
              <span className="rounded-full bg-primary px-3 py-1 font-medium text-primary-foreground text-xs">
                NEW
              </span>
            </div>

            <div className="mb-6">
              <h3 className="mb-2 font-semibold text-xl">Pro</h3>
              <div className="flex items-baseline gap-1">
                <span className="font-bold text-3xl">$10</span>
                <span className="text-muted-foreground text-sm">
                  USD / month
                </span>
              </div>
              <p className="mt-2 text-muted-foreground">
                More access to popular features
              </p>
            </div>

            <Button className="mb-6 w-full" onClick={handleUpgrade} size="lg">
              Upgrade to Pro
            </Button>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <SparkleIcon className="size-5 text-green-500" />
                <span>Access to All Models</span>
              </div>
              <div className="flex items-center gap-3">
                <EyeIcon className="size-5 text-blue-500" />
                <span>Generous Limits</span>
              </div>
              <div className="flex items-center gap-3">
                <BrainIcon className="size-5 text-purple-500" />
                <span>Longer memory and context</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircleIcon className="size-5 text-blue-500" />
                <span>Background Agents</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6">
          <p className="text-center text-muted-foreground text-sm">
            Have an existing plan?{" "}
            <button
              type="button"
              className="text-primary hover:underline"
              onClick={() => {
                // Link to billing help - could be a separate modal or external link
                window.open("/settings", "_blank");
              }}
            >
              See billing help
            </button>
          </p>
          <p className="mt-2 text-center text-muted-foreground text-sm">
            Only available in certain regions.{" "}
            <button
              type="button"
              className="text-primary hover:underline"
              onClick={() => {
                // Link to limits info
                window.open("/settings", "_blank");
              }}
            >
              Limits apply
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
