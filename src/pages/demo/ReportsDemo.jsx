import { useState } from 'react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react'

const weekData = [
  { dia: 'Lun', ventas: 1250000, unidades: 312 },
  { dia: 'Mar', ventas: 1840000, unidades: 412 },
  { dia: 'Mié', ventas: 1100000, unidades: 275 },
  { dia: 'Jue', ventas: 1560000, unidades: 368 },
  { dia: 'Vie', ventas: 2200000, unidades: 510 },
  { dia: 'Sáb', ventas: 2800000, unidades: 680 },
  { dia: 'Dom', ventas: 1900000, unidades: 445 },
]

const monthData = [
  { semana: 'S1', ventas: 8500000 }, { semana: 'S2', ventas: 9200000 },
  { semana: 'S3', ventas: 7800000 }, { semana: 'S4', ventas: 11200000 },
]

const pieData = [
  { name: 'Efectivo', value: 52, color: '#10B981' },
  { name: 'Nequi', value: 31, color: '#EC4899' },
  { name: 'DaviPlata', value: 17, color: '#F5B800' },
]

const topProductos = [
  { name: 'Arepa Especial', ventas: 1847, ingreso: 13852500, trend: '+8%' },
  { name: 'Chorizo Parrilla', ventas: 1523, ingreso: 8376500, trend: '+12%' },
  { name: 'Arepa Mixta', ventas: 1201, ingreso: 9608000, trend: '-3%' },
  { name: 'Arepa con Jamón', ventas: 1098, ingreso: 5490000, trend: '+5%' },
  { name: 'Jugo Natural', ventas: 987, ingreso: 2961000, trend: '+22%' },
]

const PERIODS = ['Hoy', 'Esta semana', 'Este mes']

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#E5E5E5] rounded-xl px-4 py-3 text-sm shadow-sm">
        <p className="text-[#1A1A1A]/60 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="font-bold" style={{color:p.color||'#D62B2B'}}>
            {p.name==='ventas' ? `$${p.value.toLocaleString()}` : `${p.value} und`}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function ReportsDemo() {
  const [period, setPeriod] = useState('Esta semana')

  const kpis = [
    { label: 'Total Ventas', value: '$12.65M', sub: '+18% vs semana anterior', up: true },
    { label: 'Unidades Vendidas', value: '3,002', sub: '+11% vs semana anterior', up: true },
    { label: 'Ticket Promedio', value: '$4,213', sub: '-2% vs semana anterior', up: false },
    { label: 'Pagos Nequi/Davi', value: '48%', sub: '+5pp vs semana anterior', up: true },
  ]

  return (
    <div className="p-5 md:p-8 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display font-black text-2xl text-[#1A1A1A]">Reportes & Analytics</h1>
          <p className="text-[#1A1A1A]/40 text-sm">Vista general de todos los puntos</p>
        </div>
        <div className="flex gap-2">
          {PERIODS.map(p => (
            <button key={p} onClick={() => setPeriod(p)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${period===p?'bg-[#D62B2B] text-white':'bg-white border border-[#E5E5E5] text-[#1A1A1A]/60 hover:text-[#1A1A1A]'}`}>{p}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k, i) => (
          <div key={i} className="bg-white border border-[#E5E5E5] rounded-2xl p-4 hover:border-[#D62B2B]/20 transition-all shadow-sm">
            <div className="text-[#1A1A1A]/40 text-xs mb-1">{k.label}</div>
            <div className="font-display font-black text-xl text-[#1A1A1A] mb-1">{k.value}</div>
            <div className={`flex items-center gap-1 text-xs ${k.up?'text-green-600':'text-red-500'}`}>
              {k.up ? <TrendingUp size={12}/> : <TrendingDown size={12}/>}
              {k.sub}
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white border border-[#E5E5E5] rounded-2xl p-5 shadow-sm">
          <h2 className="font-display font-bold text-[#1A1A1A] mb-4">Ventas por día — Esta semana</h2>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={weekData}>
              <defs>
                <linearGradient id="gw" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D62B2B" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#D62B2B" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="dia" tick={{fill:'#1A1A1A40',fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis hide/>
              <Tooltip content={<CustomTooltip/>}/>
              <Area type="monotone" dataKey="ventas" name="ventas" stroke="#D62B2B" strokeWidth={2} fill="url(#gw)"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5 shadow-sm">
          <h2 className="font-display font-bold text-[#1A1A1A] mb-4">Métodos de pago</h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                {pieData.map((entry, i) => <Cell key={i} fill={entry.color}/>)}
              </Pie>
              <Tooltip contentStyle={{background:'#fff',border:'1px solid #E5E5E5',borderRadius:'12px',color:'#1A1A1A'}} formatter={v=>`${v}%`}/>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 flex-wrap">
            {pieData.map(d => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs">
                <div className="w-2.5 h-2.5 rounded-full" style={{background:d.color}}/>
                <span className="text-[#1A1A1A]/60">{d.name} <strong className="text-[#1A1A1A]">{d.value}%</strong></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5 shadow-sm">
          <h2 className="font-display font-bold text-[#1A1A1A] mb-4">Top Productos</h2>
          <div className="space-y-2.5">
            {topProductos.map((p, i) => {
              const maxVal = topProductos[0].ventas
              return (
                <div key={i}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-[#1A1A1A] font-medium">{p.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[#1A1A1A]/40">{p.ventas.toLocaleString()} und</span>
                      <span className={`font-semibold ${p.trend.startsWith('+')?'text-green-600':'text-red-500'}`}>{p.trend}</span>
                    </div>
                  </div>
                  <div className="w-full bg-[#E5E5E5] rounded-full h-1.5 overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{width:`${(p.ventas/maxVal)*100}%`,background:`hsl(${4+i*3},75%,${48-i*3}%)`}}/>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5 shadow-sm">
          <h2 className="font-display font-bold text-[#1A1A1A] mb-4">Ventas por Punto — Esta semana</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={[
              {punto:'Chapinero',v:2100000},{punto:'Kennedy',v:1850000},{punto:'Suba',v:1640000},
              {punto:'Usaquén',v:1420000},{punto:'Bosa',v:1180000},{punto:'Engativá',v:990000},
            ]} layout="vertical">
              <XAxis type="number" hide/>
              <YAxis type="category" dataKey="punto" tick={{fill:'#1A1A1A60',fontSize:11}} axisLine={false} tickLine={false} width={72}/>
              <Tooltip contentStyle={{background:'#fff',border:'1px solid #E5E5E5',borderRadius:'12px',color:'#1A1A1A'}} formatter={v=>`$${v.toLocaleString()}`}/>
              <Bar dataKey="v" name="Ventas" fill="#D62B2B" radius={[0,6,6,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-[#1A1A1A]">Pagos Nequi/DaviPlata Pendientes</h2>
          <span className="bg-orange-500/15 text-orange-600 text-xs font-semibold px-3 py-1 rounded-full">8 pendientes</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[#1A1A1A]/40 text-xs border-b border-[#E5E5E5]">
                <th className="pb-2 text-left font-medium">Factura</th>
                <th className="pb-2 text-left font-medium">Punto</th>
                <th className="pb-2 text-left font-medium">Método</th>
                <th className="pb-2 text-left font-medium">Monto</th>
                <th className="pb-2 text-left font-medium">Hora</th>
                <th className="pb-2 text-left font-medium">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {[
                ['FAC-1045','Chapinero','Nequi','$45.000','8:32am'],
                ['FAC-1051','Kennedy','DaviPlata','$32.500','9:14am'],
                ['FAC-1063','Suba','Nequi','$67.000','10:05am'],
              ].map(([f,p,m,v,h]) => (
                <tr key={f} className="hover:bg-[#FAFAFA] transition-colors">
                  <td className="py-3 text-[#1A1A1A] font-mono text-xs">{f}</td>
                  <td className="py-3 text-[#1A1A1A]/70">{p}</td>
                  <td className="py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${m==='Nequi'?'bg-pink-500/15 text-pink-600':'bg-yellow-500/15 text-yellow-700'}`}>{m}</span></td>
                  <td className="py-3 text-[#1A1A1A] font-medium">{v}</td>
                  <td className="py-3 text-[#1A1A1A]/40 text-xs">{h}</td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <button className="text-xs bg-green-500/15 text-green-700 border border-green-500/25 px-2.5 py-1 rounded-lg hover:bg-green-500/25 transition-colors">Aprobar</button>
                      <button className="text-xs bg-red-500/8 text-red-500 border border-red-500/15 px-2.5 py-1 rounded-lg hover:bg-red-500/15 transition-colors">Rechazar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
