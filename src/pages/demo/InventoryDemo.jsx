import { useState } from 'react'
import { Package, CheckCircle, RotateCcw, Truck, RefreshCw, Warehouse, MapPin, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react'

const PRODUCTOS = [
  { id: 1, nombre: 'Arepas',    unidad: 'und', emoji: '🫓' },
  { id: 2, nombre: 'Huevos',    unidad: 'und', emoji: '🥚' },
  { id: 3, nombre: 'Tocinetas', unidad: 'und', emoji: '🥓' },
  { id: 4, nombre: 'Chorizos',  unidad: 'und', emoji: '🌭' },
  { id: 5, nombre: 'Jamones',   unidad: 'kg',  emoji: '🥩' },
  { id: 6, nombre: 'Quesos',    unidad: 'kg',  emoji: '🧀' },
]

const VEHICLES_DATA = [
  { id: 'V01', driver: 'Juan Pérez',  route: 'Norte-Centro',  puntos: [1, 4, 8] },
  { id: 'V02', driver: 'Mario López', route: 'Sur-Occidente', puntos: [3, 5, 9] },
  { id: 'V03', driver: 'Carlos Ríos', route: 'Oriente',       puntos: [7, 10]   },
]

const PUNTOS_DATA = [
  { id: 1,  nombre: 'Chapinero Centro', barrio: 'Chapinero',      open: true  },
  { id: 2,  nombre: 'Suba Plaza',       barrio: 'Suba',           open: true  },
  { id: 3,  nombre: 'Kennedy Cl 38',    barrio: 'Kennedy',        open: false },
  { id: 4,  nombre: 'Usaquén Norte',    barrio: 'Usaquén',        open: true  },
  { id: 5,  nombre: 'Bosa Centro',      barrio: 'Bosa',           open: true  },
  { id: 6,  nombre: 'Engativá',         barrio: 'Engativá',       open: true  },
  { id: 7,  nombre: 'Teusaquillo',      barrio: 'Teusaquillo',    open: false },
  { id: 8,  nombre: 'Barrios Unidos',   barrio: 'Barrios Unidos', open: true  },
  { id: 9,  nombre: 'Fontibón',         barrio: 'Fontibón',       open: true  },
  { id: 10, nombre: 'Puente Aranda',    barrio: 'Puente Aranda',  open: true  },
]

function sc(val) {
  if (val < 5)  return 'text-red-400'
  if (val < 20) return 'text-orange-400'
  return 'text-[#7DC242]'
}

function StockRow({ stock }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-x-6 gap-y-5">
      {PRODUCTOS.map(p => {
        const qty = stock[p.id] || 0
        return (
          <div key={p.id} className="flex flex-col gap-1">
            <div className={`font-display font-black text-2xl leading-none ${sc(qty)}`}>{qty}</div>
            <div className="text-white/40 text-xs">{p.nombre}</div>
            <div className="text-white/20 text-xs">{p.unidad}</div>
          </div>
        )
      })}
    </div>
  )
}

export default function InventoryDemo() {
  const [vista, setVista] = useState('bodega')

  const [stockBodega, setStockBodega]   = useState({ 1: 240, 2: 120, 3: 60, 4: 85, 5: 18, 6: 12 })
  const [stockVehiculos, setStockVehiculos] = useState({
    V01: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
    V02: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
    V03: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
  })
  const [stockPuntos, setStockPuntos] = useState({
    1:  { 1: 40, 2: 24, 3: 12, 4: 18, 5: 4,  6: 3  },
    2:  { 1: 55, 2: 30, 3: 8,  4: 22, 5: 6,  6: 4  },
    3:  { 1: 10, 2: 5,  3: 2,  4: 4,  5: 1,  6: 1  },
    4:  { 1: 62, 2: 40, 3: 15, 4: 28, 5: 7,  6: 5  },
    5:  { 1: 38, 2: 18, 3: 6,  4: 14, 5: 3,  6: 2  },
    6:  { 1: 44, 2: 22, 3: 10, 4: 20, 5: 5,  6: 4  },
    7:  { 1: 8,  2: 4,  3: 1,  4: 3,  5: 1,  6: 1  },
    8:  { 1: 50, 2: 28, 3: 9,  4: 16, 5: 4,  6: 3  },
    9:  { 1: 35, 2: 16, 3: 7,  4: 12, 5: 3,  6: 2  },
    10: { 1: 42, 2: 20, 3: 8,  4: 15, 5: 4,  6: 3  },
  })

  const [log, setLog] = useState([])
  const addLog = (msg) => setLog(l => [{ msg, time: new Date().toLocaleTimeString() }, ...l])

  const [cargaForm, setCargaForm]           = useState({})
  const [cargaConfirmada, setCargaConfirmada] = useState(null)

  const confirmarCarga = () => {
    const entries = Object.entries(cargaForm).filter(([, q]) => q > 0)
    if (!entries.length) return
    const cambios = Object.fromEntries(entries.map(([id, q]) => [parseInt(id), q]))
    setStockBodega(s => { const n = {...s}; Object.entries(cambios).forEach(([id,q]) => n[id] = (n[id]||0)+q); return n })
    setCargaConfirmada(cambios)
    addLog(`Ingreso confirmado — ${entries.length} productos a Bodega`)
  }

  const [despachoVeh, setDespachoVeh]   = useState('V01')
  const [despachoForm, setDespachoForm] = useState({})
  const [despachoOK, setDespachoOK]     = useState(null)

  const confirmarDespacho = () => {
    const entries = Object.entries(despachoForm).filter(([, q]) => q > 0)
    if (!entries.length) return
    const cambios = Object.fromEntries(entries.map(([id, q]) => [parseInt(id), q]))
    const excede = Object.entries(cambios).find(([id, q]) => q > (stockBodega[id] || 0))
    if (excede) return
    setStockBodega(s => { const n={...s}; Object.entries(cambios).forEach(([id,q]) => n[id]-=q); return n })
    setStockVehiculos(s => { const n={...s}; n[despachoVeh]={...n[despachoVeh]}; Object.entries(cambios).forEach(([id,q]) => n[despachoVeh][id]=(n[despachoVeh][id]||0)+q); return n })
    setDespachoOK({ veh: despachoVeh, cambios })
    addLog(`Despacho a ${despachoVeh} confirmado — ${entries.length} productos`)
  }

  const [entregaVeh,  setEntregaVeh]  = useState('V01')
  const [entregaPunto, setEntregaPunto] = useState(1)
  const [entregaForm, setEntregaForm] = useState({})
  const [entregaOK,   setEntregaOK]   = useState(null)
  const [vehOpen,     setVehOpen]     = useState(null)
  const [puntoOpen,   setPuntoOpen]   = useState(null)

  const confirmarEntrega = () => {
    const entries = Object.entries(entregaForm).filter(([, q]) => q > 0)
    if (!entries.length) return
    const cambios = Object.fromEntries(entries.map(([id, q]) => [parseInt(id), q]))
    const excede = Object.entries(cambios).find(([id, q]) => q > ((stockVehiculos[entregaVeh]||{})[id] || 0))
    if (excede) return
    setStockVehiculos(s => { const n={...s}; n[entregaVeh]={...n[entregaVeh]}; Object.entries(cambios).forEach(([id,q]) => n[entregaVeh][id]-=q); return n })
    setStockPuntos(s => { const n={...s}; n[entregaPunto]={...n[entregaPunto]}; Object.entries(cambios).forEach(([id,q]) => n[entregaPunto][id]=(n[entregaPunto][id]||0)+q); return n })
    setEntregaOK({ veh: entregaVeh, punto: PUNTOS_DATA.find(p=>p.id===entregaPunto)?.nombre, cambios })
    addLog(`Entrega de ${entregaVeh} a ${PUNTOS_DATA.find(p=>p.id===entregaPunto)?.nombre} confirmada`)
  }

  const TABS = [
    { id: 'bodega',    label: 'Bodega',          icon: Warehouse, color: '#7DC242' },
    { id: 'vehiculos', label: 'Vehículos',        icon: Truck,     color: '#C9A227' },
    { id: 'puntos',    label: 'Puntos de Venta',  icon: MapPin,    color: '#60a5fa' },
  ]

  return (
    <div className="p-5 md:p-10 space-y-10 max-w-5xl">

      <div>
        <h1 className="font-display font-black text-2xl text-white tracking-tight">Inventario</h1>
        <div className="flex items-center gap-2 mt-1 text-white/25 text-xs">
          <span className="text-[#7DC242]/70">Bodega</span>
          <ArrowRight size={10}/>
          <span className="text-[#C9A227]/70">Vehículo</span>
          <ArrowRight size={10}/>
          <span className="text-blue-400/70">Punto de Venta</span>
        </div>
      </div>

      <div className="flex items-center gap-1 border-b border-white/8">
        {TABS.map(({ id, label, icon: Icon, color }) => (
          <button
            key={id}
            onClick={() => setVista(id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all -mb-px ${
              vista === id
                ? 'border-b-2 text-white'
                : 'text-white/30 hover:text-white/60 border-b-2 border-transparent'
            }`}
            style={vista === id ? { borderBottomColor: color, color } : {}}
          >
            <Icon size={14}/>
            <span>{label}</span>
          </button>
        ))}
      </div>

      {vista === 'bodega' && (
        <div className="space-y-12">

          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display font-bold text-white">Stock en Bodega</h2>
                <p className="text-white/25 text-xs mt-0.5">Cantidades disponibles ahora mismo</p>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-[#7DC242] rounded-full"/>
                <span className="text-white/30 text-xs">Bodega Central</span>
              </div>
            </div>
            <StockRow stock={stockBodega}/>
          </div>

          <div className="border-t border-white/6"/>

          <div>
            <h3 className="font-display font-bold text-white">Registrar Ingreso</h3>
            <p className="text-white/25 text-xs mt-0.5 mb-6">Productos que llegan a la bodega</p>

            {cargaConfirmada ? (
              <div className="space-y-1 mb-6">
                <p className="text-[#7DC242] text-sm font-medium mb-3">Ingreso confirmado — stock actualizado</p>
                {Object.entries(cargaConfirmada).map(([id, qty]) => {
                  const p = PRODUCTOS.find(p => p.id === parseInt(id))
                  return p ? (
                    <div key={id} className="flex items-baseline gap-3 text-sm py-1 border-b border-white/5">
                      <span className="text-white/50 w-24">{p.nombre}</span>
                      <span className="text-[#7DC242]">+{qty} {p.unidad}</span>
                      <span className="text-white/20 text-xs">total {stockBodega[parseInt(id)]}</span>
                    </div>
                  ) : null
                })}
                <button onClick={() => { setCargaForm({}); setCargaConfirmada(null) }} className="mt-4 flex items-center gap-1.5 text-white/40 hover:text-white/70 text-sm transition-colors">
                  <RefreshCw size={12}/> Nuevo ingreso
                </button>
              </div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/8">
                        <th className="text-left text-white/25 text-xs font-medium pb-2 pr-4">Producto</th>
                        <th className="text-right text-white/25 text-xs font-medium pb-2 pr-4">En bodega</th>
                        <th className="text-right text-white/25 text-xs font-medium pb-2">Cantidad a ingresar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {PRODUCTOS.map(p => (
                        <tr key={p.id} className="border-b border-white/5">
                          <td className="py-3 pr-4">
                            <span className="text-white/70 text-sm">{p.nombre}</span>
                          </td>
                          <td className="py-3 pr-4 text-right">
                            <span className={`text-sm font-semibold ${sc(stockBodega[p.id]||0)}`}>{stockBodega[p.id]||0}</span>
                            <span className="text-white/20 text-xs ml-1">{p.unidad}</span>
                          </td>
                          <td className="py-3 text-right">
                            <input
                              type="number" min="0"
                              value={cargaForm[p.id]||''}
                              onChange={e => setCargaForm(f=>({...f,[p.id]:Math.max(0,parseInt(e.target.value)||0)}))}
                              placeholder="0"
                              className="w-20 bg-transparent border-b border-white/15 text-white text-sm text-right py-1 px-1 focus:outline-none focus:border-[#7DC242]/50 transition-colors"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="space-y-5">
                  <div>
                    <div className="text-white/30 text-xs uppercase tracking-wider mb-3">Resumen</div>
                    {Object.entries(cargaForm).filter(([,q])=>q>0).length === 0
                      ? <p className="text-white/15 text-sm">Sin productos aún</p>
                      : Object.entries(cargaForm).filter(([,q])=>q>0).map(([id,qty]) => {
                          const p = PRODUCTOS.find(p=>p.id===parseInt(id))
                          return p ? (
                            <div key={id} className="flex items-baseline gap-2 text-sm mb-2">
                              <span className="text-white/40 flex-1">{p.nombre}</span>
                              <span className="text-[#7DC242]">+{qty}</span>
                            </div>
                          ) : null
                        })
                    }
                  </div>
                  <div className="flex flex-col gap-2 pt-2">
                    <button
                      onClick={confirmarCarga}
                      disabled={!Object.values(cargaForm).some(q=>q>0)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
                      style={{ background: '#7DC242', color: '#111' }}
                    >
                      <Package size={14}/> Confirmar Ingreso
                    </button>
                    <button onClick={() => setCargaForm({})} className="w-full py-2 text-sm text-white/25 hover:text-white/50 transition-colors flex items-center justify-center gap-1.5">
                      <RotateCcw size={12}/> Limpiar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-white/6"/>

          <div>
            <h3 className="font-display font-bold text-white">Despachar a Vehículo</h3>
            <p className="text-white/25 text-xs mt-0.5 mb-6">Descarga productos de la bodega hacia un carro</p>

            {despachoOK ? (
              <div className="space-y-1 mb-6">
                <p className="text-[#C9A227] text-sm font-medium mb-3">Despacho confirmado — {despachoOK.veh}</p>
                {Object.entries(despachoOK.cambios).map(([id, qty]) => {
                  const p = PRODUCTOS.find(p=>p.id===parseInt(id))
                  return p ? (
                    <div key={id} className="flex items-baseline gap-3 text-sm py-1 border-b border-white/5">
                      <span className="text-white/50 w-24">{p.nombre}</span>
                      <span className="text-[#C9A227]">{qty} {p.unidad}</span>
                    </div>
                  ) : null
                })}
                <button onClick={() => { setDespachoForm({}); setDespachoOK(null) }} className="mt-4 flex items-center gap-1.5 text-white/40 hover:text-white/70 text-sm transition-colors">
                  <RefreshCw size={12}/> Nuevo despacho
                </button>
              </div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-white/30 text-sm">Asignar a</span>
                    <select
                      value={despachoVeh}
                      onChange={e=>setDespachoVeh(e.target.value)}
                      className="bg-transparent border-b border-white/15 text-white text-sm py-1 px-1 focus:outline-none focus:border-[#C9A227]/50 transition-colors flex-1"
                    >
                      {VEHICLES_DATA.map(v => <option key={v.id} value={v.id} className="bg-[#111]">{v.id} — {v.driver} ({v.route})</option>)}
                    </select>
                  </div>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/8">
                        <th className="text-left text-white/25 text-xs font-medium pb-2 pr-4">Producto</th>
                        <th className="text-right text-white/25 text-xs font-medium pb-2 pr-4">Disponible</th>
                        <th className="text-right text-white/25 text-xs font-medium pb-2">A despachar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {PRODUCTOS.map(p => {
                        const disponible = stockBodega[p.id] || 0
                        const pedido = despachoForm[p.id] || 0
                        const excede = pedido > disponible
                        return (
                          <tr key={p.id} className="border-b border-white/5">
                            <td className="py-3 pr-4">
                              <span className="text-white/70 text-sm">{p.nombre}</span>
                            </td>
                            <td className="py-3 pr-4 text-right">
                              <span className={`text-sm font-semibold ${sc(disponible)}`}>{disponible}</span>
                              <span className="text-white/20 text-xs ml-1">{p.unidad}</span>
                            </td>
                            <td className="py-3 text-right">
                              <input
                                type="number" min="0" max={disponible}
                                value={despachoForm[p.id]||''}
                                onChange={e=>setDespachoForm(f=>({...f,[p.id]:Math.max(0,parseInt(e.target.value)||0)}))}
                                placeholder="0"
                                className={`w-20 bg-transparent border-b text-sm text-right py-1 px-1 focus:outline-none transition-colors ${excede ? 'border-red-500/50 text-red-400' : 'border-white/15 text-white focus:border-[#C9A227]/50'}`}
                              />
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="space-y-5">
                  <div>
                    <div className="text-white/30 text-xs uppercase tracking-wider mb-1">Despacho</div>
                    <div className="text-white/20 text-xs mb-3">{VEHICLES_DATA.find(v=>v.id===despachoVeh)?.driver}</div>
                    {Object.entries(despachoForm).filter(([,q])=>q>0).length === 0
                      ? <p className="text-white/15 text-sm">Sin productos aún</p>
                      : Object.entries(despachoForm).filter(([,q])=>q>0).map(([id,qty]) => {
                          const p = PRODUCTOS.find(p=>p.id===parseInt(id))
                          const excede = qty > (stockBodega[parseInt(id)]||0)
                          return p ? (
                            <div key={id} className="flex items-baseline gap-2 text-sm mb-2">
                              <span className="text-white/40 flex-1">{p.nombre}</span>
                              <span className={`font-semibold ${excede ? 'text-red-400' : 'text-[#C9A227]'}`}>{qty}</span>
                            </div>
                          ) : null
                        })
                    }
                  </div>
                  <button
                    onClick={confirmarDespacho}
                    disabled={!Object.values(despachoForm).some(q=>q>0) || Object.entries(despachoForm).some(([id,q])=>q>(stockBodega[parseInt(id)]||0))}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
                    style={{ background: '#C9A227', color: '#111' }}
                  >
                    <Truck size={14}/> Confirmar Despacho
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {vista === 'vehiculos' && (
        <div className="space-y-12">

          <div>
            <h2 className="font-display font-bold text-white mb-1">Stock en Vehículos</h2>
            <p className="text-white/25 text-xs mb-6">Inventario cargado en cada carro ahora mismo</p>
            <div className="space-y-px">
              {VEHICLES_DATA.map(v => {
                const isOpen = vehOpen === v.id
                const vStock = stockVehiculos[v.id] || {}
                const total  = Object.values(vStock).reduce((s,n)=>s+n, 0)
                return (
                  <div key={v.id}>
                    <button
                      onClick={() => setVehOpen(isOpen ? null : v.id)}
                      className="w-full flex items-center gap-4 py-4 border-b border-white/6 hover:bg-white/2 transition-colors text-left px-1"
                    >
                      <Truck size={14} className="text-[#C9A227]/60 flex-shrink-0"/>
                      <div className="flex-1">
                        <span className="text-white/80 text-sm font-medium">{v.id}</span>
                        <span className="text-white/30 text-sm ml-2">{v.driver}</span>
                        <span className="text-white/20 text-xs ml-2">{v.route}</span>
                      </div>
                      <span className={`text-sm font-semibold ${total > 0 ? 'text-[#C9A227]' : 'text-white/20'}`}>{total}</span>
                      {isOpen ? <ChevronUp size={14} className="text-white/25"/> : <ChevronDown size={14} className="text-white/25"/>}
                    </button>
                    {isOpen && (
                      <div className="py-5 px-1 border-b border-white/6">
                        <StockRow stock={vStock}/>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="border-t border-white/6"/>

          <div>
            <h3 className="font-display font-bold text-white">Entregar a Punto de Venta</h3>
            <p className="text-white/25 text-xs mt-0.5 mb-6">Transfiere el inventario del carro al punto</p>

            {entregaOK ? (
              <div className="space-y-1 mb-6">
                <p className="text-blue-400 text-sm font-medium mb-3">Entrega confirmada — {entregaOK.veh} a {entregaOK.punto}</p>
                {Object.entries(entregaOK.cambios).map(([id,qty]) => {
                  const p = PRODUCTOS.find(p=>p.id===parseInt(id))
                  return p ? (
                    <div key={id} className="flex items-baseline gap-3 text-sm py-1 border-b border-white/5">
                      <span className="text-white/50 w-24">{p.nombre}</span>
                      <span className="text-blue-400">+{qty} {p.unidad}</span>
                    </div>
                  ) : null
                })}
                <button onClick={() => { setEntregaForm({}); setEntregaOK(null) }} className="mt-4 flex items-center gap-1.5 text-white/40 hover:text-white/70 text-sm transition-colors">
                  <RefreshCw size={12}/> Nueva entrega
                </button>
              </div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center gap-6 flex-wrap">
                    <div className="flex items-center gap-3">
                      <span className="text-white/30 text-sm">Vehículo</span>
                      <select
                        value={entregaVeh}
                        onChange={e=>{setEntregaVeh(e.target.value);setEntregaForm({})}}
                        className="bg-transparent border-b border-white/15 text-white text-sm py-1 px-1 focus:outline-none focus:border-[#C9A227]/50 transition-colors"
                      >
                        {VEHICLES_DATA.map(v => <option key={v.id} value={v.id} className="bg-[#111]">{v.id} — {v.driver}</option>)}
                      </select>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-white/30 text-sm">Punto</span>
                      <select
                        value={entregaPunto}
                        onChange={e=>setEntregaPunto(parseInt(e.target.value))}
                        className="bg-transparent border-b border-white/15 text-white text-sm py-1 px-1 focus:outline-none focus:border-blue-400/50 transition-colors"
                      >
                        {PUNTOS_DATA.map(p => <option key={p.id} value={p.id} className="bg-[#111]">{p.nombre}</option>)}
                      </select>
                    </div>
                  </div>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/8">
                        <th className="text-left text-white/25 text-xs font-medium pb-2 pr-4">Producto</th>
                        <th className="text-right text-white/25 text-xs font-medium pb-2 pr-4">En vehículo</th>
                        <th className="text-right text-white/25 text-xs font-medium pb-2">A entregar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {PRODUCTOS.map(p => {
                        const disponible = (stockVehiculos[entregaVeh]||{})[p.id] || 0
                        const pedido = entregaForm[p.id] || 0
                        const excede = pedido > disponible
                        return (
                          <tr key={p.id} className="border-b border-white/5">
                            <td className="py-3 pr-4">
                              <span className="text-white/70 text-sm">{p.nombre}</span>
                            </td>
                            <td className="py-3 pr-4 text-right">
                              <span className={`text-sm font-semibold ${sc(disponible)}`}>{disponible}</span>
                              <span className="text-white/20 text-xs ml-1">{p.unidad}</span>
                            </td>
                            <td className="py-3 text-right">
                              <input
                                type="number" min="0" max={disponible}
                                value={entregaForm[p.id]||''}
                                onChange={e=>setEntregaForm(f=>({...f,[p.id]:Math.max(0,parseInt(e.target.value)||0)}))}
                                placeholder="0"
                                className={`w-20 bg-transparent border-b text-sm text-right py-1 px-1 focus:outline-none transition-colors ${excede ? 'border-red-500/50 text-red-400' : 'border-white/15 text-white focus:border-blue-400/50'}`}
                              />
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="space-y-5">
                  <div>
                    <div className="text-white/30 text-xs uppercase tracking-wider mb-1">Entrega</div>
                    <div className="text-white/20 text-xs mb-3">{entregaVeh} → {PUNTOS_DATA.find(p=>p.id===entregaPunto)?.nombre}</div>
                    {Object.entries(entregaForm).filter(([,q])=>q>0).length === 0
                      ? <p className="text-white/15 text-sm">Sin productos aún</p>
                      : Object.entries(entregaForm).filter(([,q])=>q>0).map(([id,qty]) => {
                          const p = PRODUCTOS.find(p=>p.id===parseInt(id))
                          const excede = qty > ((stockVehiculos[entregaVeh]||{})[parseInt(id)]||0)
                          return p ? (
                            <div key={id} className="flex items-baseline gap-2 text-sm mb-2">
                              <span className="text-white/40 flex-1">{p.nombre}</span>
                              <span className={`font-semibold ${excede ? 'text-red-400' : 'text-blue-400'}`}>{qty}</span>
                            </div>
                          ) : null
                        })
                    }
                  </div>
                  <button
                    onClick={confirmarEntrega}
                    disabled={!Object.values(entregaForm).some(q=>q>0) || Object.entries(entregaForm).some(([id,q])=>q>((stockVehiculos[entregaVeh]||{})[parseInt(id)]||0))}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
                    style={{ background: '#60a5fa', color: '#111' }}
                  >
                    <MapPin size={14}/> Confirmar Entrega
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {vista === 'puntos' && (
        <div className="space-y-1">
          <div className="mb-6">
            <h2 className="font-display font-bold text-white">Puntos de Venta</h2>
            <p className="text-white/25 text-xs mt-0.5">Stock actualizado por entregas de vehículos</p>
          </div>
          <div className="space-y-px">
            {PUNTOS_DATA.map(punto => {
              const isOpen = puntoOpen === punto.id
              const pStock = stockPuntos[punto.id] || {}
              const critico = PRODUCTOS.some(p => (pStock[p.id]||0) < 5)
              const bajo    = PRODUCTOS.some(p => (pStock[p.id]||0) < 20)
              return (
                <div key={punto.id}>
                  <button
                    onClick={() => setPuntoOpen(isOpen ? null : punto.id)}
                    className="w-full flex items-center gap-4 py-4 border-b border-white/6 hover:bg-white/2 transition-colors text-left px-1"
                  >
                    <MapPin size={14} className="text-blue-400/50 flex-shrink-0"/>
                    <div className="flex-1 flex items-center gap-3 flex-wrap">
                      <span className="text-white/80 text-sm font-medium">{punto.nombre}</span>
                      <span className="text-white/20 text-xs">{punto.barrio}</span>
                      {!punto.open && <span className="text-white/20 text-xs">cerrado</span>}
                      {critico && <span className="text-red-400/70 text-xs">critico</span>}
                      {!critico && bajo && <span className="text-orange-400/60 text-xs">stock bajo</span>}
                    </div>
                    {isOpen ? <ChevronUp size={14} className="text-white/25"/> : <ChevronDown size={14} className="text-white/25"/>}
                  </button>
                  {isOpen && (
                    <div className="py-5 px-1 border-b border-white/6">
                      <StockRow stock={pStock}/>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {log.length > 0 && (
        <div className="pt-6 border-t border-white/6">
          <div className="text-white/20 text-xs uppercase tracking-wider mb-4">Actividad reciente</div>
          <div className="space-y-2">
            {log.map((l, i) => (
              <div key={i} className="flex items-center gap-3 text-xs">
                <div className="w-1 h-1 bg-[#7DC242]/50 rounded-full flex-shrink-0"/>
                <span className="text-white/40">{l.msg}</span>
                <span className="text-white/15 ml-auto tabular-nums">{l.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
