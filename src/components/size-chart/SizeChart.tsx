import type { Product } from "@/types/product";

interface SizeChartProps {
  product: Product;
}

const SizeChart: React.FC<SizeChartProps> = ({ product }) => {
  const chart = product.sizeChart;

  if (!chart?.sizes?.length || !chart.sizes[0]?.measurements?.length) {
    return null;
  }

  const measurementTypes = chart.sizes[0].measurements.map((m) => m.type);

  return (
    <div className="mt-10 border-t border-border pt-8">
      <p className="eyebrow mb-2">Size Chart</p>
      <h3 className="font-serif text-lg mb-4">
        {chart.name || `${product.name} — Measurements`}
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-border bg-cream p-3 text-left text-xs font-medium uppercase tracking-[0.15em] text-foreground/70">
                Size
              </th>
              {measurementTypes.map((type) => (
                <th
                  key={type}
                  className="border border-border bg-cream p-3 text-left text-xs font-medium uppercase tracking-[0.15em] text-foreground/70"
                >
                  {type}
                </th>
              ))}
              <th className="border border-border bg-cream p-3 text-left text-xs font-medium text-foreground/40 w-10">
                cm
              </th>
            </tr>
          </thead>
          <tbody>
            {chart.sizes.map((row) => (
              <tr key={row.label} className="bg-white transition-colors hover:bg-cream/50">
                <td className="border border-border p-3 text-sm font-semibold text-navy-deep">
                  {row.label}
                </td>
                {measurementTypes.map((type) => {
                  const measurement = row.measurements.find((m) => m.type === type);
                  return (
                    <td key={type} className="border border-border p-3 text-sm text-foreground/80">
                      {measurement?.value ?? "—"}
                    </td>
                  );
                })}
                <td className="border border-border p-3" />
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        Measurements are approximate and in centimetres (cm). If between sizes, size up for a relaxed fit.
      </p>
    </div>
  );
};

export default SizeChart;