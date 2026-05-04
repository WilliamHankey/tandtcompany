import { useState } from "react";
import { z } from "zod";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageCircle } from "lucide-react";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  message: z.string().trim().min(5).max(1000),
});

const WHATSAPP = "[+27 ___ ___ ____]";
const EMAIL = "[hello@tandt.co]";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(form);
    if (!r.success) {
      const errs: Record<string, string> = {};
      r.error.issues.forEach((i) => { errs[i.path[0] as string] = i.message; });
      setErrors(errs);
      return;
    }
    setErrors({});
    const subject = encodeURIComponent(`Hello from ${form.name}`);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
    window.location.href = `mailto:${EMAIL.replace(/[\[\]]/g, "")}?subject=${subject}&body=${body}`;
    toast.success("Opening your email…");
  };

  return (
    <Layout>
      <section className="bg-navy-gradient text-cream pt-40 pb-24">
        <div className="container-prose max-w-3xl">
          <p className="eyebrow">Contact</p>
          <div className="hairline mt-4 mb-8" />
          <h1 className="font-serif text-5xl md:text-7xl leading-[1.05]">We'd love to hear from you.</h1>
          <p className="mt-6 text-cream/75 max-w-xl leading-relaxed">
            Whether it's a question about a piece, a custom request, or simply a hello — we read every message.
          </p>
        </div>
      </section>

      <section className="container-prose py-24 grid lg:grid-cols-5 gap-16">
        <div className="lg:col-span-2 space-y-10">
          <div>
            <p className="eyebrow mb-3">WhatsApp</p>
            <a className="font-serif text-2xl link-underline inline-flex items-center gap-3" href="#">
              <MessageCircle className="h-5 w-5 text-accent" />{WHATSAPP}
            </a>
            <p className="mt-2 text-sm text-muted-foreground">Quickest way to reach us.</p>
          </div>
          <div>
            <p className="eyebrow mb-3">Email</p>
            <a className="font-serif text-2xl link-underline inline-flex items-center gap-3" href={`mailto:${EMAIL.replace(/[\[\]]/g, "")}`}>
              <Mail className="h-5 w-5 text-accent" />{EMAIL}
            </a>
            <p className="mt-2 text-sm text-muted-foreground">For longer notes or partnerships.</p>
          </div>
        </div>

        <form onSubmit={submit} className="lg:col-span-3 space-y-6" noValidate>
          <div>
            <Label htmlFor="name">Your name</Label>
            <Input id="name" className="mt-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" className="mt-2" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" rows={6} className="mt-2" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            {errors.message && <p className="text-destructive text-sm mt-1">{errors.message}</p>}
          </div>
          <Button type="submit" variant="navy" size="lg" className="w-full">Send message</Button>
        </form>
      </section>
    </Layout>
  );
};

export default Contact;
