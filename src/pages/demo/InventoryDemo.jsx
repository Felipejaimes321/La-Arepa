import { useState } from 'react'
import { Package, CheckCircle, AlertCircle, ArrowRight, RotateCcw, Truck } from 'lucide-react'

const PRODUCTOS = [
  { id: 1, nombre: 'Arepas de Maíz', unidad: 'und', stock: 240, precio: 1200, emoji: '🫓' },
  { id: 2, nombre: 'Chorizo', unidad: 'und', stock: 85, precio: 2500, emoji: '🌭' },
  { id: 3, nombre: 'Queso Costeño', unidad: 'kg', stock: 12, precio: 18000, emoji: '🧀' },
  { id: 4, nombre: 'Jamón', unidad: 'kg', stock: 8, precio: 22000, emoji: '🥩' },
  { id: 5, nombre: 'Huevos', unidad: 'und', stock: 120, precio: 600, emoji: '🥚' },
  { id: 6, nombre: 'Jugo Natural', unidad: 'und', stock: 48, precio: 3000, emoji: '🧃' },
  { id: 7, nombre: 'Gaseosa 350ml', unidad: 'und', stock: 72, precio: 2500, emoji: '🥤' },
]

const VEHICLES = [
  { id: 'V01', driver: 'Juan Pérez', route: 'Norte-Centro', points: 6, status: 'en_ruta' },
  { id: 'V02', driver: 'Mario López', route: 'Sur-Occidente', points: 5, status: 'cargando' },
  { id: 'V03', driver: 'Carlos Ríos', route: 'Oriente', points: 4, status: 'entregado' },
]

const ETAPAS = ['Central', 'Vehículo', 'Punto de Venta']

export default function InventoryDemo() {
  const [stage, setStage] = useState(0)
  const [stock, setStock] = useState(PRODUCTOS)
  const [dispatch, setDispatch] = useState({})
  const [vehSel, setVehSel] = useState('V01')
  const [recepcion, setRecepcion] = useState(null)
  const [log, setLog] = useState([])

  const total = Object.entries(dispatch).reduce((sum, [id, qty]) => {
    const p = PRODUCTOS.find(p => p.id === parseInt(id))
    return sum + (p ? p.precio * qty : 0)
  }, 0)

  const handleDispatch = (id, qty) => {
    const num = Math.max(0, parseInt(qty) || 0)
    setDispatch(d => ({ ...d, [id]: num }))
  }

  const generarOrden = () => {
    const entries = Object.entries(dispatch).filter(([, q]) => q > 0)
    if (!entries.length) return
    setLog(l => [...l, { msg: `Orden generada para ${vehSel} — ${entries.length} productos`, time: new Date().toLocaleTimeString(), type: 'ok' }])
    setStage(1)
  }

  const confirmarEntrega = (puntoNombre) => {
    setRecepcion(puntoNombre)
    setLog(l => [...l, { msg: `${puntoNombre} confirmó recepción`, time: new Date().toLocaleTimeString(), type: 'ok' }])
    setStage(2)
  }

  return (
    <div className="p-5 md:p-8 space-y-6">
      <div>
        <h1 className="font-display font-black text-2xl text-white">Módulo de Inventario</h1>
        <p className="text-white/40 text-sm">Flujo: Central → Vehículo → Punto de Venta</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-2">
        {ETAPAS.map((e, i) => (
          <div key={e} className="flex items-center gap-2">
            <button onClick={() => setStage(i)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${stage===i?'bg-brand-yellow text-brand-dark':'glass text-white/50 hover:text-white'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${stage===i?'bg-brand-dark text-brand-yellow':i<stage?'bg-green-500 text-white':'bg-white/10 text-white/40'}`}>
                {i < stage ? '✓' : i+1}
              </span>
              {e}
            </button>
            {i < ETAPAS.length-1 && <ArrowRight size={14} className="text-white/20 flex-shrink-0"/>}
          </div>
        ))}
      </div>

      {/* Stage 0: Central */}
      {stage === 0 && (
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-white">Stock Central — Hoy</h2>
              <div className="flex items-center gap-2">
                <span className="text-white/40 text-sm">Asignar a:</span>
                <select value={vehSel} onChange={e=>setVehSel(e.target.value)} className="bg-white/10 border border-white/20 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none">
                  {VEHICLES.map(v => <option key={v.id} value={v.id} className="bg-brand-dark">{v.id} — {v.driver}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-3">
              {stock.map(p => (
                <div key={p.id} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/8 transition-colors">
                  <span className="text-2xl w-9 text-center">{p.emoji}</span>
                  <div className="flex-1">
                    <div className="text-white text-sm font-medium">{p.nombre}</div>
                    <div className="text-white/40 text-xs">Stock: {p.stock} {p.unidad} · ${p.precio.toLocaleString()}</div>
                  </div>
                  <div className={`text-xs font-medium px-2 py-0.5 rounded-full ${p.stock < 15 ? 'bg-red-500/20 text-red-400' : p.stock < 50 ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400'}`}>
                    {p.stock < 15 ? '⚠ Bajo' : p.stock < 50 ? 'Medio' : 'OK'}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white/40 text-xs">Despachar:</span>
                    <input type="number" min="0" max={p.stock} value={dispatch[p.id] || ''} onChange={e => handleDispatch(p.id, e.target.value)}
                      placeholder="0" className="w-16 bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-white text-sm text-center focus:outline-none focus:border-brand-yellow/50"/>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-5 h-fit">
            <h2 className="font-display font-bold text-white mb-4">Orden de Despacho</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Vehículo:</span>
                <span className="text-white font-medium">{vehSel}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Conductor:</span>
                <span className="text-white font-medium">{VEHICLES.find(v=>v.id===vehSel)?.driver}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Ruta:</span>
                <span className="text-white font-medium">{VEHICLES.find(v=>v.id===vehSel)?.route}</span>
              </div>
            </div>
            <div className="border-t border-white/10 pt-4 space-y-2">
              {Object.entries(dispatch).filter(([,q])=>q>0).map(([id,qty]) => {
                const p = PRODUCTOS.find(p=>p.id===parseInt(id))
                return p ? (
                  <div key={id} className="flex justify-between text-sm">
                    <span className="text-white/60">{p.emoji} {p.nombre} ×{qty}</span>
                    <span className="text-white">${(p.precio*qty).toLocaleString()}</span>
                  </div>
                ) : null
              })}
            </div>
            {total > 0 && (
              <div className="border-t border-white/10 mt-3 pt-3 flex justify-between font-display font-bold">
                <span className="text-white">Total</span>
                <span className="gradient-text">${total.toLocaleString()}</span>
              </div>
            )}
            <button onClick={generarOrden} disabled={total===0} className="mt-5 w-full bg-brand-yellow text-brand-dark font-bold py-3 rounded-xl hover:bg-yellow-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              <Truck size={16}/> Generar Orden
            </button>
          </div>
        </div>
      )}

      {/* Stage 1: Vehículo */}
      {stage === 1 && (
        <div className="grid lg:grid-cols-2 gap-5">
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center"><Truck size={20} className="text-blue-400"/></div>
              <div>
                <h2 className="font-display font-bold text-white">{vehSel} — En Ruta</h2>
                <p className="text-white/40 text-xs">{VEHICLES.find(v=>v.id===vehSel)?.driver} · {VEHICLES.find(v=>v.id===vehSel)?.route}</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { punto: 'Chapinero Centro', hora: '7:30am', status: 'pendiente' },
                { punto: 'Barrios Unidos', hora: '8:15am', status: 'pendiente' },
                { punto: 'Teusaquillo', hora: '9:00am', status: 'pendiente' },
              ].map((pt, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white/60">{i+1}</div>
                  <div className="flex-1">
                    <div className="text-white text-sm font-medium">{pt.punto}</div>
                    <div className="text-white/40 text-xs">Entrega estimada: {pt.hora}</div>
                  </div>
                  <button onClick={() => confirmarEntrega(pt.punto)} className="text-xs bg-brand-yellow/20 text-brand-yellow border border-brand-yellow/30 px-3 py-1.5 rounded-lg hover:bg-brand-yellow/30 transition-colors">
                    Entregar
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-5">
            <h2 className="font-display font-bold text-white mb-4">Inventario en Tránsito</h2>
            <div className="space-y-2">
              {Object.entries(dispatch).filter(([,q])=>q>0).map(([id,qty]) => {
                const p = PRODUCTOS.find(p=>p.id===parseInt(id))
                return p ? (
                  <div key={id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                    <span className="text-xl">{p.emoji}</span>
                    <div className="flex-1 text-sm text-white">{p.nombre}</div>
                    <div className="text-white/60 text-sm">{qty} {p.unidad}</div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"/>
                  </div>
                ) : null
              })}
            </div>
            <div className="mt-5 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-center gap-2 text-blue-400 text-sm">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"/>
                Estado: En tránsito hacia puntos de venta
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stage 2: Punto de Venta */}
      {stage === 2 && (
        <div className="glass rounded-2xl p-6 max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center"><CheckCircle size={24} className="text-green-400"/></div>
            <div>
              <h2 className="font-display font-bold text-white text-lg">{recepcion} — Recepción Confirmada</h2>
              <p className="text-white/40 text-xs">Inventario actualizado exitosamente</p>
            </div>
          </div>
          <div className="space-y-2 mb-6">
            {Object.entries(dispatch).filter(([,q])=>q>0).map(([id,qty]) => {
              const p = PRODUCTOS.find(p=>p.id===parseInt(id))
              return p ? (
                <div key={id} className="flex items-center gap-3 p-3 rounded-xl bg-green-500/5 border border-green-500/15">
                  <CheckCircle size={14} className="text-green-400 flex-shrink-0"/>
                  <span className="text-xl">{p.emoji}</span>
                  <div className="flex-1 text-sm text-white">{p.nombre}</div>
                  <div className="text-green-400 text-sm font-medium">+{qty} {p.unidad}</div>
                </div>
              ) : null
            })}
          </div>
          <div className="flex gap-3">
            <button onClick={() => { setStage(0); setDispatch({}) }} className="flex-1 flex items-center justify-center gap-2 bg-white/10 text-white font-semibold py-3 rounded-xl hover:bg-white/20 transition-colors">
              <RotateCcw size={16}/> Nuevo ciclo
            </button>
            <button className="flex items-center justify-center gap-2 bg-orange-500/20 text-orange-400 border border-orange-500/30 font-semibold px-5 py-3 rounded-xl hover:bg-orange-500/30 transition-colors text-sm">
              <AlertCircle size={14}/> Rechazar parcial
            </button>
          </div>
        </div>
      )}

      {/* Log */}
      {log.length > 0 && (
        <div className="glass rounded-2xl p-4">
          <h3 className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-3">Log de actividad</h3>
          <div className="space-y-1.5">
            {log.slice().reverse().map((l, i) => (
              <div key={i} className="flex items-center gap-3 text-xs">
                <CheckCircle size={12} className="text-green-400 flex-shrink-0"/>
                <span className="text-white/70">{l.msg}</span>
                <span className="text-white/30 ml-auto">{l.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
