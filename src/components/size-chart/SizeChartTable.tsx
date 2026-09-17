import type { SizeChart as SizeChartData } from "@/types/product";

interface SizeChartTableProps {
  chart: SizeChartData;
  className?: string;
}

const SizeChartTable: React.FC<SizeChartTableProps> = ({ chart, className }) => {
  const sizes = (chart.sizes || []).filter((s) => s?.measurements?.length);

  if (!sizes.length) {
    return null;
  }

  const measurementTypes = sizes[0].measurements.map((m) => m.type);

  return (
    <div className={className}>
      {chart.name && (
        <h2 className="font-serif text-3xl md:text-4xl text-navy-deep mb-6">
          {chart.name}
        </h2>
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
            {sizes.map((row) => (
              <tr
                key={row.label}
                className="bg-white transition-colors hover:bg-cream/50"
              >
                <td className="border border-border p-3 text-sm font-semibold text-navy-deep">
                  {row.label}
                </td>
                {measurementTypes.map((type) => {
                  const measurement = row.measurements.find(
                    (m) => m.type === type,
                  );
                  return (
                    <td
                      key={type}
                      className="border border-border p-3 text-sm text-foreground/80"
                    >
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
  );
};

export default SizeChartTable;
