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
      <div className="glass rounded-xl px-4 py-3 border border-brand-yellow/20 text-sm">
        <p className="text-white/60 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="font-bold" style={{color:p.color||'#F5B800'}}>
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
          <h1 className="font-display font-black text-2xl text-white">Reportes & Analytics</h1>
          <p className="text-white/40 text-sm">Vista general de todos los puntos</p>
        </div>
        <div className="flex gap-2">
          {PERIODS.map(p => (
            <button key={p} onClick={() => setPeriod(p)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${period===p?'bg-brand-yellow text-brand-dark':'glass text-white/60 hover:text-white'}`}>{p}</button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k, i) => (
          <div key={i} className="glass rounded-2xl p-4 hover:border-brand-yellow/30 transition-all">
            <div className="text-white/40 text-xs mb-1">{k.label}</div>
            <div className="font-display font-black text-xl text-white mb-1">{k.value}</div>
            <div className={`flex items-center gap-1 text-xs ${k.up?'text-green-400':'text-red-400'}`}>
              {k.up ? <TrendingUp size={12}/> : <TrendingDown size={12}/>}
              {k.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 glass rounded-2xl p-5">
          <h2 className="font-display font-bold text-white mb-4">Ventas por día — Esta semana</h2>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={weekData}>
              <defs>
                <linearGradient id="gw" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F5B800" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#F5B800" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="dia" tick={{fill:'#ffffff40',fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis hide/>
              <Tooltip content={<CustomTooltip/>}/>
              <Area type="monotone" dataKey="ventas" name="ventas" stroke="#F5B800" strokeWidth={2} fill="url(#gw)"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass rounded-2xl p-5">
          <h2 className="font-display font-bold text-white mb-4">Métodos de pago</h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                {pieData.map((entry, i) => <Cell key={i} fill={entry.color}/>)}
              </Pie>
              <Tooltip contentStyle={{background:'#1A0A00',border:'1px solid #F5B80040',borderRadius:'12px',color:'#fff'}} formatter={v=>`${v}%`}/>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 flex-wrap">
            {pieData.map(d => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs">
                <div className="w-2.5 h-2.5 rounded-full" style={{background:d.color}}/>
                <span className="text-white/60">{d.name} <strong className="text-white">{d.value}%</strong></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Top productos */}
        <div className="glass rounded-2xl p-5">
          <h2 className="font-display font-bold text-white mb-4">Top Productos</h2>
          <div className="space-y-2.5">
            {topProductos.map((p, i) => {
              const maxVal = topProductos[0].ventas
              return (
                <div key={i}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-white font-medium">{p.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-white/40">{p.ventas.toLocaleString()} und</span>
                      <span className={`font-semibold ${p.trend.startsWith('+')?'text-green-400':'text-red-400'}`}>{p.trend}</span>
                    </div>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{width:`${(p.ventas/maxVal)*100}%`,background:`hsl(${40-i*8},85%,${55-i*3}%)`}}/>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Ventas por punto */}
        <div className="glass rounded-2xl p-5">
          <h2 className="font-display font-bold text-white mb-4">Ventas por Punto — Esta semana</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={[
              {punto:'Chapinero',v:2100000},{punto:'Kennedy',v:1850000},{punto:'Suba',v:1640000},
              {punto:'Usaquén',v:1420000},{punto:'Bosa',v:1180000},{punto:'Engativá',v:990000},
            ]} layout="vertical">
              <XAxis type="number" hide/>
              <YAxis type="category" dataKey="punto" tick={{fill:'#ffffff60',fontSize:11}} axisLine={false} tickLine={false} width={72}/>
              <Tooltip contentStyle={{background:'#1A0A00',border:'1px solid #F5B80040',borderRadius:'12px',color:'#fff'}} formatter={v=>`$${v.toLocaleString()}`}/>
              <Bar dataKey="v" name="Ventas" fill="#E8521A" radius={[0,6,6,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pagos pendientes */}
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-white">Pagos Nequi/DaviPlata Pendientes</h2>
          <span className="bg-orange-500/20 text-orange-400 text-xs font-semibold px-3 py-1 rounded-full">8 pendientes</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/40 text-xs border-b border-white/10">
                <th className="pb-2 text-left font-medium">Factura</th>
                <th className="pb-2 text-left font-medium">Punto</th>
                <th className="pb-2 text-left font-medium">Método</th>
                <th className="pb-2 text-left font-medium">Monto</th>
                <th className="pb-2 text-left font-medium">Hora</th>
                <th className="pb-2 text-left font-medium">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                ['FAC-1045','Chapinero','Nequi','$45.000','8:32am'],
                ['FAC-1051','Kennedy','DaviPlata','$32.500','9:14am'],
                ['FAC-1063','Suba','Nequi','$67.000','10:05am'],
              ].map(([f,p,m,v,h]) => (
                <tr key={f} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 text-white font-mono text-xs">{f}</td>
                  <td className="py-3 text-white/70">{p}</td>
                  <td className="py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${m==='Nequi'?'bg-pink-500/20 text-pink-400':'bg-yellow-500/20 text-yellow-400'}`}>{m}</span></td>
                  <td className="py-3 text-white font-medium">{v}</td>
                  <td className="py-3 text-white/40 text-xs">{h}</td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <button className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-2.5 py-1 rounded-lg hover:bg-green-500/30 transition-colors">Aprobar</button>
                      <button className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-1 rounded-lg hover:bg-red-500/20 transition-colors">Rechazar</button>
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
