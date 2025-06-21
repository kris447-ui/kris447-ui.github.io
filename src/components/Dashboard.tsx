
import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface DataItem {
  id: number;
  namaPengadaan: string;
  noTglKep: string;
  noTglKontrak: string;
  jukminJusik: string;
  namaPerusahaan: string;
  bekal: string;
  proses: string;
  tipeData: string;
  dataPdf: string;
}

interface DashboardProps {
  data: DataItem[];
}

const Dashboard = ({ data }: DashboardProps) => {
  // Prepare data for process status chart
  const processData = data.reduce((acc, item) => {
    const existing = acc.find(d => d.name === item.proses);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: item.proses, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // Prepare data for data type chart
  const dataTypeData = data.reduce((acc, item) => {
    const existing = acc.find(d => d.name === item.tipeData);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: item.tipeData, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // Prepare data for company chart (top 5 companies by number of procurements)
  const companyData = data.reduce((acc, item) => {
    const existing = acc.find(d => d.company === item.namaPerusahaan);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ company: item.namaPerusahaan, count: 1 });
    }
    return acc;
  }, [] as { company: string; count: number }[])
  .sort((a, b) => b.count - a.count)
  .slice(0, 5);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const totalItems = data.length;
  const selesaiCount = data.filter(item => item.proses === 'Selesai').length;
  const berjalanCount = data.filter(item => item.proses === 'Berjalan').length;
  const perencanaanCount = data.filter(item => item.proses === 'Perencanaan').length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pengadaan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-muted-foreground">
              Total data pengadaan
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Selesai</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{selesaiCount}</div>
            <p className="text-xs text-muted-foreground">
              Pengadaan selesai
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Berjalan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{berjalanCount}</div>
            <p className="text-xs text-muted-foreground">
              Pengadaan berjalan
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Perencanaan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{perencanaanCount}</div>
            <p className="text-xs text-muted-foreground">
              Dalam perencanaan
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Status Proses</CardTitle>
            <CardDescription>
              Distribusi pengadaan berdasarkan status proses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={processData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {processData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top 5 Perusahaan</CardTitle>
            <CardDescription>
              Perusahaan dengan pengadaan terbanyak
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={companyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="company" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {dataTypeData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Tipe Data</CardTitle>
            <CardDescription>
              Pembagian pengadaan berdasarkan tipe data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dataTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dataTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
