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
    if (!title) return;

    setGenerating(true);

    try {
      const initials = generateInitials(title);
      // Find the next free number for this initials prefix so we never
      // generate a colliding SKU (the old count+1 approach could collide
      // after products were deleted/reordered).
      const used = await client.fetch<(number | null)[]>(
        `*[_type == "product" && sku match "TTC-${initials}-*"]{ "n": toNumber(string::split(sku, "-")[2]) }.n`
      );
      const taken = new Set((used || []).filter((n): n is number => typeof n === "number" && !isNaN(n)));
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
          disabled={generating || !title}
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
