import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const Newsletter = ({ variant = "light" }: { variant?: "light" | "dark" }) => {
  const [email, setEmail] = useState("");
  const dark = variant === "dark";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return toast.error("Please enter a valid email");
    toast.success("Welcome to T AND T", { description: "We'll be in touch soon." });
    setEmail("");
  };

  return (
    <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 max-w-md">
      <Input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        className={
          dark
            ? "bg-transparent border-cream/30 text-cream placeholder:text-cream/50 focus-visible:ring-gold"
            : ""
        }
      />
      <Button type="submit" variant={dark ? "gold" : "navy"} className="shrink-0">
        Join the list
      </Button>
    </form>
  );
};

export default Newsletter;
