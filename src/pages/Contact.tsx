import { useState } from "react";
import { z } from "zod";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Mail, MapPin } from "lucide-react";
import { toast } from "sonner";
import { useContactPage, useSiteSettings } from "@/hooks/useSanityContent";

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  message: z.string().trim().min(5).max(1000),
});

const Contact = () => {
  const { data: page } = useContactPage();
  const { data: settings } = useSiteSettings();

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const whatsappUrl = settings?.whatsappUrl || "https://wa.me/27000000000";
  const email = settings?.email || "hello@tandt.co";
  const address =
    settings?.address || "[Address — edit in Sanity Site Settings]";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    const r = schema.safeParse(form);

    if (!r.success) {
      const errs: Record<string, string> = {};

      r.error.issues.forEach((i) => {
        errs[i.path[0] as string] = i.message;
      });

      setErrors(errs);
      return;
    }

    setErrors({});

    const subject = encodeURIComponent(`Hello from ${form.name}`);
    const body = encodeURIComponent(
      `${form.message}\n\n— ${form.name} (${form.email})`,
    );

    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;

    toast.success("Opening your email…");
  };

  return (
    <Layout>
      <section className="container-prose pt-28 md:pt-36 pb-12 md:pb-16 text-center max-w-3xl px-6">
        <p className="eyebrow !text-gold mb-4">
          {page?.heroEyebrow || "Contact"}
        </p>

        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl leading-tight text-navy">
          {page?.heroHeadline || "Let's Connect"}
        </h1>

        <p className="mt-6 md:mt-8 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          {page?.heroSubtext ||
            "Whether you have a question about our collections, need guidance on your journey, or simply wish to share a word of encouragement, our doors are always open."}
        </p>
      </section>

      <section className="container-prose px-6 pb-28 md:pb-32 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        <div className="space-y-6 md:space-y-8">
          <div className="bg-cream border border-border p-6 sm:p-8 shadow-soft">
            <div className="flex flex-col sm:flex-row items-start gap-4 min-w-0">
              <div className="h-11 w-11 rounded-full bg-gold/15 text-gold grid place-items-center shrink-0">
                <MessageCircle className="h-5 w-5" />
              </div>

              <div className="min-w-0 w-full">
                <p className="eyebrow !text-gold break-words">
                  {page?.heroEyebrow || "Direct Connection"}
                </p>

                <h2 className="font-serif text-2xl sm:text-3xl text-navy mt-2 break-words">
                  Reach out instantly
                </h2>

                <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed break-words">
                  {page?.formIntro ||
                    "For immediate assistance or a more personal touch, our team is available via WhatsApp."}
                </p>

                <Button
                  asChild
                  variant="gold"
                  size="lg"
                  className="mt-6 w-full sm:w-auto max-w-full px-4 sm:px-10 text-[10px] sm:text-xs tracking-[0.14em] sm:tracking-[0.2em] whitespace-normal text-center"
                >
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-4 w-4 mr-2 shrink-0" />
                    <span className="break-words">
                      {page?.whatsappLabel || "Message on WhatsApp"}
                    </span>
                  </a>
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-cream border border-border p-6 sm:p-8 shadow-soft">
            <div className="flex items-start gap-4">
              <div className="h-11 w-11 rounded-full bg-gold/15 text-gold grid place-items-center shrink-0">
                <Mail className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <p className="eyebrow !text-gold">Email</p>

                <a
                  href={`mailto:${email}`}
                  className="mt-3 block font-serif text-xl sm:text-2xl text-navy break-words"
                >
                  {email}
                </a>
              </div>
            </div>
          </div>

          <div className="bg-cream border border-border p-6 sm:p-8 shadow-soft">
            <div className="flex items-start gap-4">
              <div className="h-11 w-11 rounded-full bg-gold/15 text-gold grid place-items-center shrink-0">
                <MapPin className="h-5 w-5" />
              </div>

              <div>
                <p className="eyebrow !text-gold">Our Office</p>

                <p className="mt-3 font-serif text-xl sm:text-2xl text-navy whitespace-pre-line leading-snug">
                  {address}
                </p>
              </div>
            </div>
          </div>
        </div>

        <form
          onSubmit={submit}
          className="bg-cream border border-border p-6 sm:p-8 md:p-10 shadow-elegant space-y-6 w-full"
          noValidate
        >
          <div>
            <p className="eyebrow !text-gold mb-3">Send a Message</p>

            <h2 className="font-serif text-3xl text-navy">How can we help?</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <Label htmlFor="name" className="eyebrow">
                Name
              </Label>

              <Input
                id="name"
                placeholder="Your full name"
                className="mt-2 h-12"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
              />

              {errors.name && (
                <p className="text-destructive text-xs mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email" className="eyebrow">
                Email
              </Label>

              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                className="mt-2 h-12"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
              />

              {errors.email && (
                <p className="text-destructive text-xs mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="message" className="eyebrow">
              Message
            </Label>

            <Textarea
              id="message"
              rows={6}
              placeholder="How can we help you today?"
              className="mt-2 min-h-36 resize-none"
              value={form.message}
              onChange={(e) =>
                setForm({
                  ...form,
                  message: e.target.value,
                })
              }
            />

            {errors.message && (
              <p className="text-destructive text-xs mt-1">{errors.message}</p>
            )}
          </div>

          <Button
            type="submit"
            variant="outlineNavy"
            size="lg"
            className="w-full !text-gold !border-gold hover:!bg-gold hover:!text-cream"
          >
            Send Message
          </Button>
        </form>
      </section>
    </Layout>
  );
};

export default Contact;
