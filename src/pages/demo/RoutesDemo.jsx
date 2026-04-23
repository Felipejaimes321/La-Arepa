import { useState } from 'react'
import { Truck, MapPin, CheckCircle, Clock, Package, AlertCircle, Navigation } from 'lucide-react'

const VEHICLES = [
  {
    id: 'V01', driver: 'Juan Pérez', plate: 'ABC-123', route: 'Norte-Centro',
    progress: 65, status: 'en_ruta', phone: '310-555-0101',
    stops: [
      { name: 'Chapinero Centro', status: 'entregado', hora: '7:30am', productos: 45 },
      { name: 'Barrios Unidos', status: 'entregado', hora: '8:15am', productos: 32 },
      { name: 'Teusaquillo', status: 'en_camino', hora: '9:00am', productos: 28 },
      { name: 'Puente Aranda', status: 'pendiente', hora: '10:00am', productos: 35 },
      { name: 'Antonio Nariño', status: 'pendiente', hora: '11:00am', productos: 22 },
      { name: 'Rafael Uribe', status: 'pendiente', hora: '12:00pm', productos: 40 },
    ]
  },
  {
    id: 'V02', driver: 'Mario López', plate: 'DEF-456', route: 'Sur-Occidente',
    progress: 20, status: 'cargando', phone: '310-555-0202',
    stops: [
      { name: 'Kennedy Sur', status: 'en_camino', hora: '8:00am', productos: 50 },
      { name: 'Bosa Centro', status: 'pendiente', hora: '9:00am', productos: 38 },
      { name: 'Ciudad Bolívar', status: 'pendiente', hora: '10:30am', productos: 30 },
      { name: 'Fontibón', status: 'pendiente', hora: '12:00pm', productos: 44 },
      { name: 'Engativá', status: 'pendiente', hora: '1:30pm', productos: 36 },
    ]
  },
  {
    id: 'V03', driver: 'Carlos Ríos', plate: 'GHI-789', route: 'Oriente',
    progress: 100, status: 'completado', phone: '310-555-0303',
    stops: [
      { name: 'Usaquén Norte', status: 'entregado', hora: '7:00am', productos: 40 },
      { name: 'San Cristóbal', status: 'entregado', hora: '8:30am', productos: 35 },
      { name: 'Mártires', status: 'entregado', hora: '10:00am', productos: 28 },
      { name: 'Suba Portal', status: 'entregado', hora: '11:30am', productos: 52 },
    ]
  }
]

const statusConfig = {
  entregado:  { color: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/20', label: 'Entregado',   dot: 'bg-green-400' },
  en_camino:  { color: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/20',  label: 'En camino',  dot: 'bg-blue-400 animate-pulse' },
  pendiente:  { color: 'text-white/40',   bg: 'bg-white/5',       border: 'border-white/10',     label: 'Pendiente',  dot: 'bg-white/20' },
  en_ruta:    { color: 'text-blue-400',   bg: 'bg-blue-500/15',   border: 'border-blue-500/30',  label: 'En ruta',    dot: 'bg-blue-400 animate-pulse' },
  cargando:   { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20',label: 'Cargando',   dot: 'bg-orange-400' },
  completado: { color: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/20', label: 'Completado', dot: 'bg-green-400' },
}

export default function RoutesDemo() {
  const [sel, setSel] = useState(VEHICLES[0])

  return (
    <div className="p-5 md:p-8 space-y-5">
      <div>
        <h1 className="font-display font-black text-2xl text-white">Gestión de Rutas</h1>
        <p className="text-white/40 text-sm">Seguimiento de vehículos y entregas en tiempo real</p>
      </div>

      {/* Vehicle cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        {VEHICLES.map(v => {
          const s = statusConfig[v.status]
          return (
            <button key={v.id} onClick={() => setSel(v)} className={`glass rounded-2xl p-4 text-left transition-all hover:-translate-y-0.5 ${sel.id===v.id ? 'border-brand-yellow/40 bg-brand-yellow/5' : ''}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center"><Truck size={16} className="text-white/70"/></div>
                  <div>
                    <div className="text-white text-sm font-bold">{v.id}</div>
                    <div className="text-white/40 text-xs">{v.plate}</div>
                  </div>
                </div>
                <div className={`flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full border ${s.bg} ${s.color} ${s.border}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${s.dot}`}/>
                  {s.label}
                </div>
              </div>
              <div className="text-white text-sm font-medium mb-0.5">{v.driver}</div>
              <div className="text-white/40 text-xs mb-3">{v.route}</div>
              <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                <div className="h-full bg-brand-yellow rounded-full transition-all" style={{width:`${v.progress}%`}}/>
              </div>
              <div className="flex justify-between text-xs text-white/40 mt-1">
                <span>{v.stops.filter(s=>s.status==='entregado').length}/{v.stops.length} entregas</span>
                <span>{v.progress}%</span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Detail */}
      <div className="grid lg:grid-cols-5 gap-5">
        {/* Stops list */}
        <div className="lg:col-span-2 glass rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-brand-yellow/15 rounded-xl flex items-center justify-center">
              <Navigation size={18} className="text-brand-yellow"/>
            </div>
            <div>
              <div className="text-white font-display font-bold">{sel.driver}</div>
              <div className="text-white/40 text-xs">{sel.route} · {sel.plate}</div>
            </div>
          </div>
          <div className="space-y-2">
            {sel.stops.map((stop, i) => {
              const sc = statusConfig[stop.status]
              return (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${sc.bg} ${sc.border}`}>
                  <div className="flex flex-col items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${stop.status==='entregado'?'bg-green-500 text-white':stop.status==='en_camino'?'bg-blue-500 text-white':'bg-white/10 text-white/40'}`}>
                      {stop.status==='entregado'?'✓':i+1}
                    </div>
                    {i<sel.stops.length-1 && <div className="w-px h-4 bg-white/10 mt-1"/>}
                  </div>
                  <div className="flex-1">
                    <div className={`text-sm font-medium ${sc.color}`}>{stop.name}</div>
                    <div className="text-white/30 text-xs">{stop.hora} · {stop.productos} productos</div>
                  </div>
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${sc.dot}`}/>
                </div>
              )
            })}
          </div>
        </div>

        {/* Map placeholder + stats */}
        <div className="lg:col-span-3 space-y-4">
          <div className="glass rounded-2xl overflow-hidden relative" style={{height:'280px'}}>
            <div className="absolute inset-0 bg-[#0D2A0D] opacity-80"/>
            <div className="absolute inset-0 opacity-15" style={{backgroundImage:'linear-gradient(#1a4a1a 1px,transparent 1px),linear-gradient(90deg,#1a4a1a 1px,transparent 1px)',backgroundSize:'32px 32px'}}/>
            <div className="absolute top-3 left-3 bg-black/60 rounded-lg px-3 py-1.5 text-xs text-white/60 z-10 flex items-center gap-1.5">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"/>
              GPS en tiempo real — {sel.driver}
            </div>
            {/* Simulated stops on map */}
            {sel.stops.map((stop, i) => {
              const positions = [{x:45,y:30},{x:40,y:25},{x:50,y:45},{x:35,y:55},{x:55,y:60},{x:48,y:70}]
              const pos = positions[i] || {x:50,y:50}
              return (
                <div key={i} className="absolute" style={{left:`${pos.x}%`,top:`${pos.y}%`,transform:'translate(-50%,-50%)'}}>
                  <div className={`w-3 h-3 rounded-full border-2 ${stop.status==='entregado'?'bg-green-400 border-green-200':stop.status==='en_camino'?'bg-blue-400 border-blue-200 animate-pulse':'bg-white/30 border-white/50'}`}/>
                </div>
              )
            })}
            {/* Truck icon */}
            <div className="absolute" style={{left:'50%',top:'45%',transform:'translate(-50%,-50%)'}}>
              <div className="bg-brand-yellow rounded-full p-2 shadow-lg animate-pulse">
                <Truck size={14} className="text-brand-dark"/>
              </div>
            </div>
            <div className="absolute bottom-3 right-3 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-xs"><div className="w-2 h-2 rounded-full bg-green-400"/><span className="text-white/60">Entregado</span></div>
              <div className="flex items-center gap-1.5 text-xs"><div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"/><span className="text-white/60">En camino</span></div>
              <div className="flex items-center gap-1.5 text-xs"><div className="w-2 h-2 rounded-full bg-white/30"/><span className="text-white/60">Pendiente</span></div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Entregados', value: sel.stops.filter(s=>s.status==='entregado').length, icon: CheckCircle, color: 'text-green-400' },
              { label: 'En camino', value: sel.stops.filter(s=>s.status==='en_camino').length, icon: Clock, color: 'text-blue-400' },
              { label: 'Pendientes', value: sel.stops.filter(s=>s.status==='pendiente').length, icon: Package, color: 'text-white/40' },
            ].map((stat, i) => (
              <div key={i} className="glass rounded-xl p-4 text-center">
                <stat.icon size={20} className={`${stat.color} mx-auto mb-2`}/>
                <div className={`font-display font-black text-2xl ${stat.color}`}>{stat.value}</div>
                <div className="text-white/40 text-xs mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="glass rounded-2xl p-4">
            <h3 className="font-display font-bold text-white text-sm mb-3">Devoluciones del día</h3>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-orange-500/5 border border-orange-500/15">
              <AlertCircle size={16} className="text-orange-400 flex-shrink-0"/>
              <div className="flex-1">
                <div className="text-white text-xs font-medium">V01 — Chorizo deteriorado</div>
                <div className="text-white/40 text-xs">Rafael Uribe rechazó 8 und · Motivo: mal estado</div>
              </div>
              <button className="text-xs bg-orange-500/20 text-orange-400 border border-orange-500/30 px-3 py-1 rounded-lg">Aceptar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
