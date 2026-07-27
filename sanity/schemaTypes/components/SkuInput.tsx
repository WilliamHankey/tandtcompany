import { useState } from "react";
import { useClient, set, type StringInputProps } from "sanity";
import { Button, Flex, TextInput, Text } from "@sanity/ui";

type SkuInputProps = StringInputProps & {
  document?: { title?: string };
};

function generateInitials(title: string): string {
  return title
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function SkuInput(props: SkuInputProps) {
  const { value, onChange, document } = props;
  const client = useClient({ apiVersion: "2024-05-22" });
  const [generating, setGenerating] = useState(false);

  const generateSku = async () => {
    const title = document?.title;
    if (!title) return;

    setGenerating(true);

    try {
      const initials = generateInitials(title);
      const count = await client.fetch<number>(
        `count(*[_type == "product"])`
      );
      const nextNumber = (count || 0) + 1;
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
          disabled={generating || !document?.title}
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
