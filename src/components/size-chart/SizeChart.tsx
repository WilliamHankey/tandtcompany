import type { Product } from "@/types/product";

interface SizeChartProps {
  product: Product;
}

const SizeChart: React.FC<SizeChartProps> = ({ product }) => {
  const charts = (product.sizeCharts || []).filter(
    (c) => c?.sizes?.length && c.sizes[0]?.measurements?.length
  );

  if (!charts.length) {
    return null;
  }

  return (
    <div className="mt-10 border-t border-border pt-8 space-y-10">
      <div>
        <p className="eyebrow mb-2">Size Chart</p>
        {charts.length > 1 && (
          <h3 className="font-serif text-lg mb-4">Choose your size</h3>
        )}
      </div>

      {charts.map((chart) => {
        const measurementTypes = chart.sizes![0].measurements.map((m) => m.type);
        return (
          <div key={`${chart.name}-${chart.productType}`}>
            {charts.length > 1 && (
              <h4 className="font-serif text-base mb-3">
                {chart.name || `${product.name} — Measurements`}
              </h4>
            )}

            <div className={charts.length > 1 ? "" : "mt-4"}>
              {charts.length === 1 && (
                <h3 className="font-serif text-lg mb-4">
                  {chart.name || `${product.name} — Measurements`}
                </h3>
              )}

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
                    {chart.sizes!.map((row) => (
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
            </div>
          </div>
        );
      })}

      <p className="text-xs text-muted-foreground">
        Measurements are approximate and in centimetres (cm). If between sizes, size up for a relaxed fit.
      </p>
    </div>
  );
};

export default SizeChart;