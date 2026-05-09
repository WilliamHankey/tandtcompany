import { useState } from "react";
import { z } from "zod";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle } from "lucide-react";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  message: z.string().trim().min(5).max(1000),
});

const WHATSAPP_URL = "https://wa.me/27000000000";
const EMAIL = "hello@tandt.co";

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
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    toast.success("Opening your email…");
  };

  return (
    <Layout>
      <section className="container-prose pt-32 pb-16 text-center max-w-3xl">
        <h1 className="font-serif text-5xl md:text-6xl leading-tight text-navy">Let's Connect</h1>
        <p className="mt-8 text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          Whether you have a question about our collections, need guidance on your journey, or simply wish to share a word of encouragement, our doors are always open. We believe in the power of meaningful conversation and human connection.
        </p>
      </section>

      <section className="container-prose pb-24 grid lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-12">
          <div className="border-l-2 border-gold pl-6">
            <p className="eyebrow !text-gold">Direct Connection</p>
            <h2 className="font-serif text-3xl text-navy mt-3">Reach out instantly</h2>
            <p className="mt-5 text-muted-foreground leading-relaxed max-w-md">
              For immediate assistance or a more personal touch, our team is available via WhatsApp. We aim to respond within a few hours during business days.
            </p>
            <Button asChild variant="gold" size="lg" className="mt-8">
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4 mr-2" /> Message on WhatsApp
              </a>
            </Button>
          </div>

          <div className="border-l-2 border-gold pl-6">
            <p className="eyebrow !text-gold">Our Office</p>
            <p className="mt-4 font-serif text-navy">
              [TODO: Street Address]<br />
              [TODO: City, Postcode]
            </p>
          </div>
        </div>

        <form onSubmit={submit} className="bg-cream border border-border p-8 md:p-10 shadow-elegant space-y-6" noValidate>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <Label htmlFor="name" className="eyebrow">Name</Label>
              <Input id="name" placeholder="Your full name" className="mt-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <Label htmlFor="email" className="eyebrow">Email</Label>
              <Input id="email" type="email" placeholder="email@example.com" className="mt-2" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor="message" className="eyebrow">Message</Label>
            <Textarea id="message" rows={6} placeholder="How can we help you today?" className="mt-2" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            {errors.message && <p className="text-destructive text-xs mt-1">{errors.message}</p>}
          </div>
          <Button type="submit" variant="outlineNavy" size="lg" className="w-full !text-gold !border-gold hover:!bg-gold hover:!text-cream">
            Send Message
          </Button>
        </form>
      </section>
    </Layout>
  );
};

export default Contact;
