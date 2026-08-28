import { useState } from "react";
import { useClient, useFormValue, set, type StringInputProps } from "sanity";
import { Button, Flex, TextInput, Text } from "@sanity/ui";

function generateInitials(title: string): string {
  return title
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function SkuInput(props: StringInputProps) {
  const { value, onChange } = props;
  const client = useClient({ apiVersion: "2024-05-22" });
  const title = useFormValue(["title"]) as string | undefined;
  const [generating, setGenerating] = useState(false);

  const generateSku = async () => {
    // Always allowed to (re)generate, even if a SKU already exists — it
    // simply replaces the current value. Falls back to "Product" if the
    // title is somehow empty so the button is never dead.
    const base = (title || "").trim() || "Product";

    setGenerating(true);

    try {
      const initials = generateInitials(base);
      // Find the next free number for this initials prefix so we never
      // generate a colliding SKU (the old count+1 approach could collide
      // after products were deleted/reordered).
      const used = await client.fetch<string[]>(
        `*[_type == "product" && sku match "TTC-${initials}-*"].sku`
      );
      // Extract the trailing 3-digit number from each "TTC-XXX-NNN" and find
      // the next free one (computed in JS — GROQ has no string->number cast).
      const taken = new Set<number>();
      for (const sku of used || []) {
        const m = /^TTC-[A-Z]+-(\d+)$/.exec(sku);
        if (m) taken.add(parseInt(m[1], 10));
      }
      let nextNumber = 1;
      while (taken.has(nextNumber)) nextNumber++;
      const sku = `TTC-${initials}-${String(nextNumber).padStart(3, "0")}`;

      onChange(set(sku));
    } catch (err) {
      console.error("Failed to generate SKU:", err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Flex direction="column" gap={2}>
      <TextInput
        value={value || ""}
        readOnly
        placeholder="Click Generate to create a SKU"
        fontSize={1}
        padding={3}
        radius={2}
      />
      <Flex gap={2} align="center">
        <Button
          text={generating ? "Generating…" : "Generate SKU from Title"}
          onClick={generateSku}
          disabled={generating}
          tone="primary"
          mode="ghost"
          fontSize={1}
        />
        {value && (
          <Text size={1} muted>
            {value}
          </Text>
        )}
      </Flex>
    </Flex>
  );
}
