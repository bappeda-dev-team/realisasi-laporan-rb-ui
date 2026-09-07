"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

const realisasiBidang = [
  { bidang: "Perencanaan", pagu: 82, realisasi: 61 },
  { bidang: "Infrastruktur", pagu: 68, realisasi: 40 },
  { bidang: "Ekonomi", pagu: 54, realisasi: 25 },
  { bidang: "Sosial Budaya", pagu: 42, realisasi: 17 },
];

const bulanan = [
  { bulan: "Jan", pagu: 245.8, realisasi: 8.2 },
  { bulan: "Feb", pagu: 245.8, realisasi: 17.4 },
  { bulan: "Mar", pagu: 245.8, realisasi: 30.1 },
  { bulan: "Apr", pagu: 245.8, realisasi: 45.6 },
  { bulan: "Mei", pagu: 245.8, realisasi: 58.3 },
  { bulan: "Jun", pagu: 245.8, realisasi: 74.0 },
  { bulan: "Jul", pagu: 245.8, realisasi: 83.5 },
  { bulan: "Agu", pagu: 245.8, realisasi: 96.2 },
  { bulan: "Sep", pagu: 245.8, realisasi: 108.9 },
  { bulan: "Okt", pagu: 245.8, realisasi: 120.1 },
  { bulan: "Nov", pagu: 245.8, realisasi: 132.8 },
  { bulan: "Des", pagu: 245.8, realisasi: 142.3 },
];

const proporsiBidang = [
  { bidang: "perencanaan", label: "Perencanaan", nilai: 61 },
  { bidang: "infrastruktur", label: "Infrastruktur", nilai: 40 },
  { bidang: "ekonomi", label: "Ekonomi", nilai: 25 },
  { bidang: "sosial", label: "Sosial Budaya", nilai: 17 },
];

const trendConfig = {
  pagu: { label: "Pagu", color: "var(--chart-2)" },
  realisasi: { label: "Realisasi", color: "var(--chart-1)" },
} satisfies ChartConfig;

const bidangConfig = {
  pagu: { label: "Pagu", color: "var(--chart-2)" },
  realisasi: { label: "Realisasi", color: "var(--chart-1)" },
} satisfies ChartConfig;

const pieConfig = {
  perencanaan: { label: "Perencanaan", color: "var(--chart-1)" },
  infrastruktur: { label: "Infrastruktur", color: "var(--chart-2)" },
  ekonomi: { label: "Ekonomi", color: "var(--chart-3)" },
  sosial: { label: "Sosial Budaya", color: "var(--chart-4)" },
} satisfies ChartConfig;

export function DashboardCharts() {
  const totalPagu = realisasiBidang.reduce((sum, b) => sum + b.pagu, 0);
  const totalRealisasi = realisasiBidang.reduce(
    (sum, b) => sum + b.realisasi,
    0
  );
  const persen = Math.round((totalRealisasi / totalPagu) * 100);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Trend Realisasi Bulanan</CardTitle>
            <CardDescription>
              Perbandingan pagu dan realisasi kumulatif tahun 2026 (dalam
              miliar rupiah).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={trendConfig} className="h-64">
              <AreaChart
                accessibilityLayer
                data={bulanan}
                margin={{ left: 0, right: 12 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="bulan"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => `${value} M`}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <defs>
                  <linearGradient id="fillRealisasi" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-realisasi)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-realisasi)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <Area
                  dataKey="pagu"
                  type="natural"
                  fill="var(--color-pagu)"
                  fillOpacity={0.1}
                  stroke="var(--color-pagu)"
                  strokeWidth={2}
                  dot={false}
                />
                <Area
                  dataKey="realisasi"
                  type="natural"
                  fill="url(#fillRealisasi)"
                  stroke="var(--color-realisasi)"
                  strokeWidth={2}
                  dot={false}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Komposisi Realisasi</CardTitle>
            <CardDescription>Distribusi realisasi per bidang.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={pieConfig} className="h-64">
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent hideLabel labelKey="bidang" />
                  }
                />
                <Pie
                  data={proporsiBidang}
                  dataKey="nilai"
                  nameKey="bidang"
                  innerRadius={48}
                  outerRadius={72}
                  paddingAngle={2}
                >
                  {proporsiBidang.map((item) => (
                    <Cell
                      key={item.bidang}
                      fill={`var(--color-${item.bidang})`}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Realisasi per Bidang</CardTitle>
            <CardDescription>
              Perbandingan pagu dan realisasi per bidang (dalam miliar).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={bidangConfig} className="h-64">
              <BarChart accessibilityLayer data={realisasiBidang}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="bidang"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="pagu" fill="var(--color-pagu)" radius={4} />
                <Bar
                  dataKey="realisasi"
                  fill="var(--color-realisasi)"
                  radius={4}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Realisasi per Bidang</CardTitle>
            <CardDescription>
              Total realisasi {totalRealisasi.toLocaleString("id-ID")} dari{" "}
              {totalPagu.toLocaleString("id-ID")} pagu ({persen}%).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {realisasiBidang.map((item) => (
              <div key={item.bidang} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.bidang}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {Math.round((item.realisasi / item.pagu) * 100)}%
                  </span>
                </div>
                <Progress value={(item.realisasi / item.pagu) * 100} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}