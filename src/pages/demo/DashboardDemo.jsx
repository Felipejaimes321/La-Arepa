import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts'
import { TrendingUp, Package, ShoppingCart, AlertCircle, CheckCircle, Clock, Users, Star } from 'lucide-react'

const salesData = [
  { hora: '6am', ventas: 12 }, { hora: '7am', ventas: 31 }, { hora: '8am', ventas: 45 },
  { hora: '9am', ventas: 38 }, { hora: '10am', ventas: 22 }, { hora: '11am', ventas: 29 },
  { hora: '12pm', ventas: 58 }, { hora: '1pm', ventas: 67 }, { hora: '2pm', ventas: 49 },
  { hora: '3pm', ventas: 35 }, { hora: '4pm', ventas: 41 }, { hora: '5pm', ventas: 53 },
  { hora: '6pm', ventas: 72 }, { hora: '7pm', ventas: 61 }, { hora: '8pm', ventas: 44 },
]

const puntoData = [
  { punto: 'Chapinero', ventas: 340 }, { punto: 'Suba', ventas: 280 }, { punto: 'Kennedy', ventas: 310 },
  { punto: 'Usaquén', ventas: 220 }, { punto: 'Bosa', ventas: 190 }, { punto: 'Engativá', ventas: 260 },
]

const ALERTAS = [
  { type: 'warn', msg: 'Stock bajo: Chorizo en Bosa (3 und)', time: 'hace 5 min' },
  { type: 'ok',   msg: 'Entrega confirmada: Suba Portal', time: 'hace 12 min' },
  { type: 'pend', msg: 'Pago Nequi pendiente — $45.000', time: 'hace 20 min' },
  { type: 'ok',   msg: 'Devolución procesada: Veh. 02', time: 'hace 1h' },
]

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="glass rounded-2xl p-5 flex items-center gap-4 hover:border-brand-yellow/30 transition-all">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon size={22} className="text-white"/>
      </div>
      <div>
        <div className="text-white/50 text-xs">{label}</div>
        <div className="font-display font-bold text-white text-2xl">{value}</div>
        <div className="text-white/40 text-xs">{sub}</div>
      </div>
    </div>
  )
}

export default function DashboardDemo() {
  return (
    <div className="p-5 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-black text-2xl text-white">Dashboard General</h1>
          <p className="text-white/40 text-sm">Martes, 22 Abril 2025 · Actualizado hace 2 min</p>
        </div>
        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-3 py-1.5">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"/>
          <span className="text-green-400 text-xs font-medium">En vivo</span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={ShoppingCart} label="Ventas Hoy" value="$1.84M" sub="+12% vs ayer" color="bg-brand-yellow/20"/>
        <StatCard icon={Package} label="Unidades vendidas" value="412" sub="de 550 despachadas" color="bg-blue-500/20"/>
        <StatCard icon={TrendingUp} label="Puntos activos" value="47/50" sub="3 sin conexión" color="bg-green-500/20"/>
        <StatCard icon={AlertCircle} label="Pagos pendientes" value="8" sub="Por validar" color="bg-orange-500/20"/>
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-white">Ventas por hora — Hoy</h2>
            <span className="text-white/40 text-xs">Todas las sedes</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="gv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F5B800" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#F5B800" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="hora" tick={{ fill: '#ffffff40', fontSize: 11 }} axisLine={false} tickLine={false}/>
              <YAxis hide/>
              <Tooltip contentStyle={{ background:'#1A0A00', border:'1px solid #F5B80040', borderRadius:'12px', color:'#fff' }}/>
              <Area type="monotone" dataKey="ventas" stroke="#F5B800" strokeWidth={2} fill="url(#gv)"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass rounded-2xl p-5">
          <h2 className="font-display font-bold text-white mb-4">Top Puntos de Venta</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={puntoData} layout="vertical">
              <XAxis type="number" hide/>
              <YAxis type="category" dataKey="punto" tick={{ fill: '#ffffff60', fontSize: 11 }} axisLine={false} tickLine={false} width={65}/>
              <Tooltip contentStyle={{ background:'#1A0A00', border:'1px solid #F5B80040', borderRadius:'12px', color:'#fff' }}/>
              <Bar dataKey="ventas" fill="#E8521A" radius={[0,4,4,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Alertas */}
        <div className="glass rounded-2xl p-5">
          <h2 className="font-display font-bold text-white mb-4">Actividad Reciente</h2>
          <div className="space-y-3">
            {ALERTAS.map((a, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/5">
                {a.type === 'ok' && <CheckCircle size={16} className="text-green-400 flex-shrink-0 mt-0.5"/>}
                {a.type === 'warn' && <AlertCircle size={16} className="text-orange-400 flex-shrink-0 mt-0.5"/>}
                {a.type === 'pend' && <Clock size={16} className="text-blue-400 flex-shrink-0 mt-0.5"/>}
                <div className="flex-1">
                  <div className="text-white text-sm">{a.msg}</div>
                  <div className="text-white/30 text-xs mt-0.5">{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Productos top */}
        <div className="glass rounded-2xl p-5">
          <h2 className="font-display font-bold text-white mb-4">Productos Más Vendidos</h2>
          <div className="space-y-3">
            {[
              ['🌟','Arepa Especial','247 und','$1.85M'],
              ['🌭','Chorizo Parrilla','198 und','$1.08M'],
              ['🥪','Arepa con Jamón','183 und','$915K'],
              ['🧃','Jugo Natural','156 und','$468K'],
            ].map(([e,n,u,v], i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                <span className="text-2xl w-9 text-center">{e}</span>
                <div className="flex-1">
                  <div className="text-white text-sm font-medium">{n}</div>
                  <div className="text-white/40 text-xs">{u}</div>
                </div>
                <div className="text-brand-yellow font-display font-bold text-sm">{v}</div>
                <div className="text-white/30 text-xs w-5 text-center font-bold">#{i+1}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Solicitudes Franquicia */}
      <div className="glass rounded-2xl p-5">
        <h2 className="font-display font-bold text-white mb-4">Solicitudes de Franquicia Recientes</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/40 text-xs border-b border-white/10">
                <th className="pb-2 text-left font-medium">Nombre</th>
                <th className="pb-2 text-left font-medium">Ciudad</th>
                <th className="pb-2 text-left font-medium">Capital</th>
                <th className="pb-2 text-left font-medium">Fecha</th>
                <th className="pb-2 text-left font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                ['Carlos Mejía','Medellín','$20M','21/04/25','Nuevo'],
                ['Laura Gómez','Cali','$15M','20/04/25','En revisión'],
                ['Andrés Torres','Barranquilla','$30M','19/04/25','Contactado'],
              ].map(([n,c,k,f,s]) => (
                <tr key={n} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 text-white font-medium">{n}</td>
                  <td className="py-3 text-white/60">{c}</td>
                  <td className="py-3 text-white/60">{k}</td>
                  <td className="py-3 text-white/40">{f}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s==='Nuevo'?'bg-blue-500/20 text-blue-400':s==='En revisión'?'bg-yellow-500/20 text-yellow-400':'bg-green-500/20 text-green-400'}`}>{s}</span>
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
