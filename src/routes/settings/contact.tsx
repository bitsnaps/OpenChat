import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/settings/contact")({
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-xl p-6">
      <h1 className="font-medium text-xl">Contact Us</h1>
      <p className="mt-4 text-muted-foreground">Coming soon.</p>
    </div>
  );
}
