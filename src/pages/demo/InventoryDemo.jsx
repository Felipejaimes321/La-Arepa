import { useState } from 'react'

const PRODUCTOS = [
  { id: 1, nombre: 'Arepas',    unidad: 'und', emoji: '🫓' },
  { id: 2, nombre: 'Huevos',    unidad: 'und', emoji: '🥚' },
  { id: 3, nombre: 'Tocinetas', unidad: 'und', emoji: '🥓' },
  { id: 4, nombre: 'Chorizos',  unidad: 'und', emoji: '🌭' },
  { id: 5, nombre: 'Jamones',   unidad: 'kg',  emoji: '🥩' },
  { id: 6, nombre: 'Quesos',    unidad: 'kg',  emoji: '🧀' },
]

const VEHICLES_DATA = [
  { id: 'V01', driver: 'Juan Pérez',  route: 'Norte-Centro'  },
  { id: 'V02', driver: 'Mario López', route: 'Sur-Occidente' },
  { id: 'V03', driver: 'Carlos Ríos', route: 'Oriente'       },
]

const PUNTOS_DATA = [
  { id: 1, nombre: 'Chapinero Centro', barrio: 'Chapinero' },
  { id: 2, nombre: 'Suba Plaza',       barrio: 'Suba'      },
  { id: 3, nombre: 'Kennedy Cl 38',    barrio: 'Kennedy'   },
  { id: 4, nombre: 'Usaquén Norte',    barrio: 'Usaquén'   },
  { id: 5, nombre: 'Bosa Centro',      barrio: 'Bosa'      },
]

function stockColor(qty) {
  if (qty < 5)  return 'text-[#16A34A]'
  if (qty < 20) return 'text-orange-500'
  return 'text-[#1A1A1A]'
}

function StockGrid({ stock }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-x-6 gap-y-5">
      {PRODUCTOS.map(p => {
        const qty = stock[p.id] || 0
        return (
          <div key={p.id} className="flex flex-col gap-0.5">
            <div className={`font-display font-black text-3xl leading-none ${stockColor(qty)}`}>{qty}</div>
            <div className="text-[#1A1A1A]/50 text-xs mt-1">{p.nombre}</div>
            <div className="text-[#1A1A1A]/25 text-xs">{p.unidad}</div>
          </div>
        )
      })}
    </div>
  )
}

function SectionDivider() {
  return <div className="border-t border-[#E5E5E5]" />
}

let nextId = 1
function uid() { return nextId++ }

export default function InventoryDemo() {
  const [vista, setVista] = useState('bodega')

  const [stockBodega, setStockBodega] = useState({ 1: 240, 2: 120, 3: 60, 4: 85, 5: 18, 6: 12 })
  const [stockVehiculos, setStockVehiculos] = useState({
    V01: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
    V02: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
    V03: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
  })
  const [stockPuntos, setStockPuntos] = useState({
    1: { 1: 40, 2: 24, 3: 12, 4: 18, 5: 4,  6: 3 },
    2: { 1: 55, 2: 30, 3: 8,  4: 22, 5: 6,  6: 4 },
    3: { 1: 10, 2: 5,  3: 2,  4: 4,  5: 1,  6: 1 },
    4: { 1: 62, 2: 40, 3: 15, 4: 28, 5: 7,  6: 5 },
    5: { 1: 38, 2: 18, 3: 6,  4: 14, 5: 3,  6: 2 },
  })

  const [ordenesDespacho, setOrdenesDespacho] = useState([])
  const [entregasPendientes, setEntregasPendientes] = useState([])
  const [notificaciones, setNotificaciones] = useState({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 })

  const [log, setLog] = useState([])
  const addLog = (actor, accion) =>
    setLog(l => [{ actor, accion, time: new Date().toLocaleTimeString('es-CO') }, ...l])

  const [bodegaVeh, setBodegaVeh] = useState('V01')
  const [bodegaForm, setBodegaForm] = useState({})
  const [bodegaMensaje, setBodegaMensaje] = useState(null)

  const [ingresoForm, setIngresoForm] = useState({})
  const [ingresoMensaje, setIngresoMensaje] = useState(null)

  const ingresarBodega = () => {
    const productos = Object.fromEntries(
      Object.entries(ingresoForm)
        .map(([id, q]) => [parseInt(id), parseInt(q) || 0])
        .filter(([, q]) => q > 0)
    )
    if (!Object.keys(productos).length) return

    setStockBodega(s => {
      const n = { ...s }
      Object.entries(productos).forEach(([id, q]) => { n[id] = (n[id] || 0) + q })
      return n
    })

    const totalItems = Object.values(productos).reduce((a, b) => a + b, 0)
    setIngresoMensaje(`Ingreso registrado exitosamente (${totalItems} items)`)
    setIngresoForm({})
    addLog('Bodega', `Ingresó nuevo stock (${totalItems} items)`)
  }

  const crearOrden = () => {
    const productos = Object.fromEntries(
      Object.entries(bodegaForm)
        .map(([id, q]) => [parseInt(id), parseInt(q) || 0])
        .filter(([, q]) => q > 0)
    )
    if (!Object.keys(productos).length) return
    const excede = Object.entries(productos).find(([id, q]) => q > (stockBodega[id] || 0))
    if (excede) return
    const orden = {
      id: uid(),
      vehiculoId: bodegaVeh,
      productos,
      estado: 'pendiente',
      creadoEn: new Date().toLocaleTimeString('es-CO'),
    }
    setOrdenesDespacho(o => [...o, orden])
    const driver = VEHICLES_DATA.find(v => v.id === bodegaVeh)?.driver
    setBodegaMensaje(`Orden enviada al conductor ${driver} — pendiente de aceptación`)
    setBodegaForm({})
    addLog('Bodega', `Orden #${orden.id} creada para ${bodegaVeh} (${driver})`)
  }

  const [conductorId, setConductorId] = useState('V01')
  const [entregaForm, setEntregaForm] = useState({})
  const [entregaPunto, setEntregaPunto] = useState(1)
  const [conductorMensaje, setConductorMensaje] = useState(null)

  const aceptarCarga = (orden) => {
    setOrdenesDespacho(o =>
      o.map(x => x.id === orden.id ? { ...x, estado: 'aceptada' } : x)
    )
    setStockBodega(s => {
      const n = { ...s }
      Object.entries(orden.productos).forEach(([id, q]) => { n[id] = (n[id] || 0) - q })
      return n
    })
    setStockVehiculos(s => {
      const n = { ...s, [orden.vehiculoId]: { ...s[orden.vehiculoId] } }
      Object.entries(orden.productos).forEach(([id, q]) => {
        n[orden.vehiculoId][id] = (n[orden.vehiculoId][id] || 0) + q
      })
      return n
    })
    const driver = VEHICLES_DATA.find(v => v.id === orden.vehiculoId)?.driver
    setConductorMensaje(`Carga recibida — inventario actualizado`)
    addLog(driver, `Aceptó orden #${orden.id} de Bodega`)
  }

  const registrarEntrega = () => {
    const productos = Object.fromEntries(
      Object.entries(entregaForm)
        .map(([id, q]) => [parseInt(id), parseInt(q) || 0])
        .filter(([, q]) => q > 0)
    )
    if (!Object.keys(productos).length) return
    const vStock = stockVehiculos[conductorId] || {}
    const excede = Object.entries(productos).find(([id, q]) => q > (vStock[id] || 0))
    if (excede) return
    const entrega = {
      id: uid(),
      vehiculoId: conductorId,
      puntoId: entregaPunto,
      productos,
      estado: 'pendiente',
      creadoEn: new Date().toLocaleTimeString('es-CO'),
    }
    setEntregasPendientes(e => [...e, entrega])
    setNotificaciones(n => ({ ...n, [entregaPunto]: (n[entregaPunto] || 0) + 1 }))
    const puntoNombre = PUNTOS_DATA.find(p => p.id === entregaPunto)?.nombre
    const driver = VEHICLES_DATA.find(v => v.id === conductorId)?.driver
    setConductorMensaje(`Entrega registrada — notificando al punto ${puntoNombre}`)
    setEntregaForm({})
    addLog(driver, `Registró entrega a ${puntoNombre}`)
  }

  const [puntoId, setPuntoId] = useState(1)

  const confirmarRecepcion = (entrega) => {
    setEntregasPendientes(e =>
      e.map(x => x.id === entrega.id ? { ...x, estado: 'confirmada' } : x)
    )
    setStockVehiculos(s => {
      const n = { ...s, [entrega.vehiculoId]: { ...s[entrega.vehiculoId] } }
      Object.entries(entrega.productos).forEach(([id, q]) => {
        n[entrega.vehiculoId][id] = Math.max(0, (n[entrega.vehiculoId][id] || 0) - q)
      })
      return n
    })
    setStockPuntos(s => {
      const n = { ...s, [entrega.puntoId]: { ...s[entrega.puntoId] } }
      Object.entries(entrega.productos).forEach(([id, q]) => {
        n[entrega.puntoId][id] = (n[entrega.puntoId][id] || 0) + q
      })
      return n
    })
    setNotificaciones(n => ({ ...n, [entrega.puntoId]: Math.max(0, (n[entrega.puntoId] || 0) - 1) }))
    const puntoNombre = PUNTOS_DATA.find(p => p.id === entrega.puntoId)?.nombre
    const driver = VEHICLES_DATA.find(v => v.id === entrega.vehiculoId)?.driver
    addLog(puntoNombre, `Confirmó recepción de entrega de ${driver}`)
  }

  const TABS = [
    { id: 'bodega',    label: 'Bodega'         },
    { id: 'conductor', label: 'Conductor'       },
    { id: 'punto',     label: 'Punto de Venta'  },
  ]

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="max-w-5xl mx-auto px-5 md:px-10 py-10 space-y-10">

        <div>
          <h1 className="font-display font-black text-3xl text-[#1A1A1A] tracking-tight leading-none">
            Inventario en tiempo real
          </h1>
          <p className="text-[#1A1A1A]/40 text-sm mt-2">
            Cada movimiento requiere una acción humana. Nadie puede decir "yo no sabía".
          </p>
        </div>

        <div className="flex items-end gap-8 border-b border-[#E5E5E5]">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setVista(tab.id); setBodegaMensaje(null); setConductorMensaje(null); setIngresoMensaje(null) }}
              className={`pb-3 text-sm font-medium transition-all -mb-px ${
                vista === tab.id
                  ? 'border-b-2 border-[#16A34A] text-[#16A34A]'
                  : 'text-[#1A1A1A]/40 hover:text-[#1A1A1A]/60 border-b-2 border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {vista === 'bodega' && (
          <VistaBodega
            stockBodega={stockBodega}
            stockVehiculos={stockVehiculos}
            ordenesDespacho={ordenesDespacho}
            bodegaVeh={bodegaVeh}
            setBodegaVeh={setBodegaVeh}
            bodegaForm={bodegaForm}
            setBodegaForm={setBodegaForm}
            bodegaMensaje={bodegaMensaje}
            setBodegaMensaje={setBodegaMensaje}
            crearOrden={crearOrden}
            ingresoForm={ingresoForm}
            setIngresoForm={setIngresoForm}
            ingresoMensaje={ingresoMensaje}
            setIngresoMensaje={setIngresoMensaje}
            ingresarBodega={ingresarBodega}
          />
        )}

        {vista === 'conductor' && (
          <VistaConductor
            conductorId={conductorId}
            setConductorId={setConductorId}
            ordenesDespacho={ordenesDespacho}
            stockVehiculos={stockVehiculos}
            entregaForm={entregaForm}
            setEntregaForm={setEntregaForm}
            entregaPunto={entregaPunto}
            setEntregaPunto={setEntregaPunto}
            conductorMensaje={conductorMensaje}
            setConductorMensaje={setConductorMensaje}
            aceptarCarga={aceptarCarga}
            registrarEntrega={registrarEntrega}
          />
        )}

        {vista === 'punto' && (
          <VistaPunto
            puntoId={puntoId}
            setPuntoId={setPuntoId}
            stockPuntos={stockPuntos}
            entregasPendientes={entregasPendientes}
            notificaciones={notificaciones}
            confirmarRecepcion={confirmarRecepcion}
          />
        )}

        <LogActividad log={log} />

      </div>
    </div>
  )
}

function VistaBodega({
  stockBodega, stockVehiculos, ordenesDespacho,
  bodegaVeh, setBodegaVeh, bodegaForm, setBodegaForm,
  bodegaMensaje, setBodegaMensaje, crearOrden,
  ingresoForm, setIngresoForm, ingresoMensaje, setIngresoMensaje, ingresarBodega
}) {
  const driver = VEHICLES_DATA.find(v => v.id === bodegaVeh)?.driver

  return (
    <div className="space-y-12">

      <div>
        <div className="flex items-center gap-3 mb-6">
          <h2 className="font-display font-bold text-xl text-[#1A1A1A]">Bodega Central</h2>
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-[#E5E5E5] text-xs text-green-600">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
            En línea
          </span>
        </div>
        <StockGrid stock={stockBodega} />
      </div>

      <SectionDivider />

      <div>
        <h3 className="font-display font-bold text-[#1A1A1A] mb-1">Ingresar Stock a Bodega</h3>
        <p className="text-[#1A1A1A]/35 text-xs mb-6">
          Añade nuevos productos al inventario disponible en la bodega central.
        </p>

        {ingresoMensaje ? (
          <div className="space-y-4">
            <div className="p-4 rounded-lg border border-[#E5E5E5] bg-white">
              <p className="text-green-600 text-sm font-medium">{ingresoMensaje}</p>
            </div>
            <button
              onClick={() => setIngresoMensaje(null)}
              className="px-4 py-2 border border-[#E5E5E5] bg-white text-[#1A1A1A] text-sm rounded-lg hover:border-[#1A1A1A]/20 transition-colors"
            >
              Nuevo ingreso
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E5E5E5]">
                    <th className="text-left text-[#1A1A1A]/30 text-xs font-medium pb-2 pr-4">Producto</th>
                    <th className="text-right text-[#1A1A1A]/30 text-xs font-medium pb-2">Cantidad a ingresar</th>
                  </tr>
                </thead>
                <tbody>
                  {PRODUCTOS.map(p => (
                    <tr key={p.id} className="border-b border-[#E5E5E5]">
                      <td className="py-3 pr-4">
                        <span className="text-[#1A1A1A]/70 text-sm">{p.nombre}</span>
                      </td>
                      <td className="py-3 text-right">
                        <input
                          type="number"
                          min="0"
                          value={ingresoForm[p.id] || ''}
                          onChange={e => setIngresoForm(f => ({ ...f, [p.id]: e.target.value }))}
                          placeholder="0"
                          className="w-24 bg-transparent border-b border-[#E5E5E5] text-[#1A1A1A] text-sm text-right py-1 px-1 focus:outline-none focus:border-[#16A34A]/40 transition-colors"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-5">
              <div>
                <div className="text-[#1A1A1A]/30 text-xs uppercase tracking-wider mb-1">Resumen de ingreso</div>
                {Object.entries(ingresoForm).filter(([, q]) => parseInt(q) > 0).length === 0
                  ? <p className="text-[#1A1A1A]/20 text-sm">Sin productos</p>
                  : Object.entries(ingresoForm).filter(([, q]) => parseInt(q) > 0).map(([id, qty]) => {
                      const p = PRODUCTOS.find(p => p.id === parseInt(id))
                      return p ? (
                        <div key={id} className="flex items-baseline gap-2 text-sm mb-2">
                          <span className="text-[#1A1A1A]/40 flex-1">{p.nombre}</span>
                          <span className="font-semibold tabular-nums text-[#1A1A1A]">{qty}</span>
                        </div>
                      ) : null
                    })
                }
              </div>
              <button
                onClick={ingresarBodega}
                disabled={!Object.values(ingresoForm).some(q => parseInt(q) > 0)}
                className="w-full py-2.5 rounded-lg font-semibold text-sm text-[#1A1A1A] border border-[#E5E5E5] hover:bg-[#F5F5F5] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Registrar Ingreso
              </button>
            </div>
          </div>
        )}
      </div>

      <SectionDivider />

      <div>
        <h3 className="font-display font-bold text-[#1A1A1A] mb-1">Crear Orden de Despacho</h3>
        <p className="text-[#1A1A1A]/35 text-xs mb-6">
          La orden queda pendiente hasta que el conductor la acepte. El stock no se mueve hasta ese momento.
        </p>

        {bodegaMensaje ? (
          <div className="space-y-4">
            <div className="p-4 rounded-lg border border-[#E5E5E5] bg-white">
              <p className="text-[#1A1A1A] text-sm font-medium">{bodegaMensaje}</p>
            </div>
            <button
              onClick={() => setBodegaMensaje(null)}
              className="px-4 py-2 border border-[#E5E5E5] bg-white text-[#1A1A1A] text-sm rounded-lg hover:border-[#1A1A1A]/20 transition-colors"
            >
              Nueva orden
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-5">
              <div className="flex items-center gap-3">
                <span className="text-[#1A1A1A]/40 text-sm">Vehículo</span>
                <select
                  value={bodegaVeh}
                  onChange={e => { setBodegaVeh(e.target.value); setBodegaForm({}) }}
                  className="flex-1 bg-white border border-[#E5E5E5] text-[#1A1A1A] text-sm py-2 px-3 rounded-lg focus:outline-none focus:border-[#16A34A]/40 transition-colors"
                >
                  {VEHICLES_DATA.map(v => (
                    <option key={v.id} value={v.id}>{v.id} — {v.driver} ({v.route})</option>
                  ))}
                </select>
              </div>

              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E5E5E5]">
                    <th className="text-left text-[#1A1A1A]/30 text-xs font-medium pb-2 pr-4">Producto</th>
                    <th className="text-right text-[#1A1A1A]/30 text-xs font-medium pb-2 pr-4">Disponible</th>
                    <th className="text-right text-[#1A1A1A]/30 text-xs font-medium pb-2">Cantidad</th>
                  </tr>
                </thead>
                <tbody>
                  {PRODUCTOS.map(p => {
                    const disponible = stockBodega[p.id] || 0
                    const pedido = parseInt(bodegaForm[p.id]) || 0
                    const excede = pedido > disponible
                    return (
                      <tr key={p.id} className="border-b border-[#E5E5E5]">
                        <td className="py-3 pr-4">
                          <span className="text-[#1A1A1A]/70 text-sm">{p.nombre}</span>
                        </td>
                        <td className="py-3 pr-4 text-right">
                          <span className={`text-sm font-semibold tabular-nums ${stockColor(disponible)}`}>{disponible}</span>
                          <span className="text-[#1A1A1A]/25 text-xs ml-1">{p.unidad}</span>
                        </td>
                        <td className="py-3 text-right">
                          <input
                            type="number"
                            min="0"
                            max={disponible}
                            value={bodegaForm[p.id] || ''}
                            onChange={e => setBodegaForm(f => ({ ...f, [p.id]: e.target.value }))}
                            placeholder="0"
                            className={`w-20 bg-transparent border-b text-sm text-right py-1 px-1 focus:outline-none transition-colors ${
                              excede
                                ? 'border-[#16A34A] text-[#16A34A]'
                                : 'border-[#E5E5E5] text-[#1A1A1A] focus:border-[#16A34A]/40'
                            }`}
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
                <div className="text-[#1A1A1A]/30 text-xs uppercase tracking-wider mb-1">Resumen</div>
                <div className="text-[#1A1A1A]/25 text-xs mb-3">Para: {driver}</div>
                {Object.entries(bodegaForm).filter(([, q]) => parseInt(q) > 0).length === 0
                  ? <p className="text-[#1A1A1A]/20 text-sm">Sin productos</p>
                  : Object.entries(bodegaForm).filter(([, q]) => parseInt(q) > 0).map(([id, qty]) => {
                      const p = PRODUCTOS.find(p => p.id === parseInt(id))
                      const excede = parseInt(qty) > (stockBodega[parseInt(id)] || 0)
                      return p ? (
                        <div key={id} className="flex items-baseline gap-2 text-sm mb-2">
                          <span className="text-[#1A1A1A]/40 flex-1">{p.nombre}</span>
                          <span className={`font-semibold tabular-nums ${excede ? 'text-[#16A34A]' : 'text-[#1A1A1A]'}`}>{qty}</span>
                        </div>
                      ) : null
                    })
                }
              </div>
              <button
                onClick={crearOrden}
                disabled={
                  !Object.values(bodegaForm).some(q => parseInt(q) > 0) ||
                  Object.entries(bodegaForm).some(([id, q]) => parseInt(q) > (stockBodega[parseInt(id)] || 0))
                }
                className="w-full py-2.5 rounded-lg font-semibold text-sm text-white bg-[#16A34A] disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
              >
                Crear Orden
              </button>
            </div>
          </div>
        )}
      </div>

      <SectionDivider />

      <div>
        <h3 className="font-display font-bold text-[#1A1A1A] mb-6">Órdenes en Curso</h3>
        {ordenesDespacho.length === 0 ? (
          <p className="text-[#1A1A1A]/25 text-sm">No hay órdenes creadas aún.</p>
        ) : (
          <div className="space-y-px">
            {[...ordenesDespacho].reverse().map(orden => {
              const v = VEHICLES_DATA.find(v => v.id === orden.vehiculoId)
              const nProd = Object.keys(orden.productos).length
              const estadoLabel =
                orden.estado === 'pendiente' ? 'Pendiente aceptación' : 'En tránsito'
              const estadoColor =
                orden.estado === 'pendiente' ? 'text-orange-500' : 'text-blue-500'
              return (
                <div key={orden.id} className="flex items-center gap-4 py-3 border-b border-[#E5E5E5]">
                  <div className="flex-1 min-w-0">
                    <span className="text-[#1A1A1A]/70 text-sm font-medium">{v?.id}</span>
                    <span className="text-[#1A1A1A]/35 text-sm ml-2">{v?.driver}</span>
                    <span className="text-[#1A1A1A]/25 text-xs ml-2">{nProd} productos</span>
                  </div>
                  <span className={`text-xs font-medium ${estadoColor}`}>{estadoLabel}</span>
                  <span className="text-[#1A1A1A]/20 text-xs tabular-nums">{orden.creadoEn}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>

    </div>
  )
}

function VistaConductor({
  conductorId, setConductorId,
  ordenesDespacho, stockVehiculos,
  entregaForm, setEntregaForm,
  entregaPunto, setEntregaPunto,
  conductorMensaje, setConductorMensaje,
  aceptarCarga, registrarEntrega,
}) {
  const conductor = VEHICLES_DATA.find(v => v.id === conductorId)
  const ordenesPendientes = ordenesDespacho.filter(
    o => o.vehiculoId === conductorId && o.estado === 'pendiente'
  )
  const vStock = stockVehiculos[conductorId] || {}

  return (
    <div className="space-y-12">

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="text-[#1A1A1A]/30 text-xs mb-1">Viendo como</div>
          <select
            value={conductorId}
            onChange={e => { setConductorId(e.target.value); setEntregaForm({}); setConductorMensaje(null) }}
            className="bg-white border border-[#E5E5E5] text-[#1A1A1A] text-sm py-2 px-3 rounded-lg focus:outline-none focus:border-[#16A34A]/40 transition-colors"
          >
            {VEHICLES_DATA.map(v => (
              <option key={v.id} value={v.id}>{v.driver} ({v.id})</option>
            ))}
          </select>
        </div>
        <div className="text-right">
          <div className="text-[#1A1A1A]/70 text-sm font-medium">{conductor?.driver}</div>
          <div className="text-[#1A1A1A]/30 text-xs">Ruta: {conductor?.route}</div>
        </div>
      </div>

      <SectionDivider />

      <div>
        <h3 className="font-display font-bold text-[#1A1A1A] mb-1">Órdenes pendientes de aceptación</h3>
        <p className="text-[#1A1A1A]/35 text-xs mb-6">
          Al aceptar la carga, el stock sale de bodega y entra al vehículo.
        </p>

        {conductorMensaje && (
          <div className="mb-6 p-4 rounded-lg border border-[#E5E5E5] bg-white">
            <p className="text-[#1A1A1A] text-sm font-medium">{conductorMensaje}</p>
            <button
              onClick={() => setConductorMensaje(null)}
              className="mt-2 text-xs text-[#1A1A1A]/40 hover:text-[#1A1A1A]/60 transition-colors"
            >
              Cerrar
            </button>
          </div>
        )}

        {ordenesPendientes.length === 0 ? (
          <p className="text-[#1A1A1A]/25 text-sm">Sin órdenes pendientes para este conductor.</p>
        ) : (
          <div className="space-y-4">
            {ordenesPendientes.map(orden => (
              <div key={orden.id} className="p-5 rounded-lg border border-[#E5E5E5] bg-white space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[#1A1A1A]/70 text-sm font-medium">Orden #{orden.id}</span>
                    <span className="text-[#1A1A1A]/25 text-xs ml-2">{orden.creadoEn}</span>
                  </div>
                  <span className="text-orange-500 text-xs font-medium">Pendiente aceptación</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {Object.entries(orden.productos).map(([id, qty]) => {
                    const p = PRODUCTOS.find(p => p.id === parseInt(id))
                    return p ? (
                      <div key={id} className="flex flex-col gap-0.5">
                        <div className="font-display font-black text-2xl leading-none text-[#1A1A1A]">{qty}</div>
                        <div className="text-[#1A1A1A]/40 text-xs">{p.nombre}</div>
                        <div className="text-[#1A1A1A]/20 text-xs">{p.unidad}</div>
                      </div>
                    ) : null
                  })}
                </div>
                <button
                  onClick={() => aceptarCarga(orden)}
                  className="px-5 py-2 rounded-lg font-semibold text-sm text-white bg-[#16A34A] transition-opacity hover:opacity-90"
                >
                  Aceptar Carga
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <SectionDivider />

      <div>
        <h3 className="font-display font-bold text-[#1A1A1A] mb-6">Mi inventario actual</h3>
        <StockGrid stock={vStock} />
      </div>

      <SectionDivider />

      <div>
        <h3 className="font-display font-bold text-[#1A1A1A] mb-1">Entregar a punto de venta</h3>
        <p className="text-[#1A1A1A]/35 text-xs mb-6">
          La entrega queda pendiente hasta que el punto confirme. El stock no se mueve hasta ese momento.
        </p>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-3">
              <span className="text-[#1A1A1A]/40 text-sm">Punto</span>
              <select
                value={entregaPunto}
                onChange={e => { setEntregaPunto(parseInt(e.target.value)); setEntregaForm({}) }}
                className="flex-1 bg-white border border-[#E5E5E5] text-[#1A1A1A] text-sm py-2 px-3 rounded-lg focus:outline-none focus:border-[#16A34A]/40 transition-colors"
              >
                {PUNTOS_DATA.map(p => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
            </div>

            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E5E5E5]">
                  <th className="text-left text-[#1A1A1A]/30 text-xs font-medium pb-2 pr-4">Producto</th>
                  <th className="text-right text-[#1A1A1A]/30 text-xs font-medium pb-2 pr-4">En vehículo</th>
                  <th className="text-right text-[#1A1A1A]/30 text-xs font-medium pb-2">Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {PRODUCTOS.map(p => {
                  const disponible = vStock[p.id] || 0
                  const pedido = parseInt(entregaForm[p.id]) || 0
                  const excede = pedido > disponible
                  return (
                    <tr key={p.id} className="border-b border-[#E5E5E5]">
                      <td className="py-3 pr-4">
                        <span className="text-[#1A1A1A]/70 text-sm">{p.nombre}</span>
                      </td>
                      <td className="py-3 pr-4 text-right">
                        <span className={`text-sm font-semibold tabular-nums ${stockColor(disponible)}`}>{disponible}</span>
                        <span className="text-[#1A1A1A]/25 text-xs ml-1">{p.unidad}</span>
                      </td>
                      <td className="py-3 text-right">
                        <input
                          type="number"
                          min="0"
                          max={disponible}
                          value={entregaForm[p.id] || ''}
                          onChange={e => setEntregaForm(f => ({ ...f, [p.id]: e.target.value }))}
                          placeholder="0"
                          className={`w-20 bg-transparent border-b text-sm text-right py-1 px-1 focus:outline-none transition-colors ${
                            excede
                              ? 'border-[#16A34A] text-[#16A34A]'
                              : 'border-[#E5E5E5] text-[#1A1A1A] focus:border-[#16A34A]/40'
                          }`}
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
              <div className="text-[#1A1A1A]/30 text-xs uppercase tracking-wider mb-1">Resumen</div>
              <div className="text-[#1A1A1A]/25 text-xs mb-3">
                {conductor?.driver} → {PUNTOS_DATA.find(p => p.id === entregaPunto)?.nombre}
              </div>
              {Object.entries(entregaForm).filter(([, q]) => parseInt(q) > 0).length === 0
                ? <p className="text-[#1A1A1A]/20 text-sm">Sin productos</p>
                : Object.entries(entregaForm).filter(([, q]) => parseInt(q) > 0).map(([id, qty]) => {
                    const p = PRODUCTOS.find(p => p.id === parseInt(id))
                    const excede = parseInt(qty) > (vStock[parseInt(id)] || 0)
                    return p ? (
                      <div key={id} className="flex items-baseline gap-2 text-sm mb-2">
                        <span className="text-[#1A1A1A]/40 flex-1">{p.nombre}</span>
                        <span className={`font-semibold tabular-nums ${excede ? 'text-[#16A34A]' : 'text-[#1A1A1A]'}`}>{qty}</span>
                      </div>
                    ) : null
                  })
              }
            </div>
            <button
              onClick={registrarEntrega}
              disabled={
                !Object.values(entregaForm).some(q => parseInt(q) > 0) ||
                Object.entries(entregaForm).some(([id, q]) => parseInt(q) > (vStock[parseInt(id)] || 0))
              }
              className="w-full py-2.5 rounded-lg font-semibold text-sm text-white bg-[#16A34A] disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
            >
              Registrar Entrega
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}

function VistaPunto({
  puntoId, setPuntoId,
  stockPuntos, entregasPendientes,
  notificaciones, confirmarRecepcion,
}) {
  const punto = PUNTOS_DATA.find(p => p.id === puntoId)
  const pStock = stockPuntos[puntoId] || {}
  const pendientes = entregasPendientes.filter(
    e => e.puntoId === puntoId && e.estado === 'pendiente'
  )
  const nBadge = notificaciones[puntoId] || 0

  return (
    <div className="space-y-12">

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="text-[#1A1A1A]/30 text-xs mb-1">Viendo como</div>
          <select
            value={puntoId}
            onChange={e => setPuntoId(parseInt(e.target.value))}
            className="bg-white border border-[#E5E5E5] text-[#1A1A1A] text-sm py-2 px-3 rounded-lg focus:outline-none focus:border-[#16A34A]/40 transition-colors"
          >
            {PUNTOS_DATA.map(p => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>
        </div>
        <div className="text-right flex items-center gap-3">
          <div>
            <div className="text-[#1A1A1A]/70 text-sm font-medium">{punto?.nombre}</div>
            <div className="text-[#1A1A1A]/30 text-xs">{punto?.barrio}</div>
          </div>
          {nBadge > 0 && (
            <div className="w-6 h-6 rounded-full bg-[#16A34A] flex items-center justify-center">
              <span className="text-white text-xs font-bold">{nBadge}</span>
            </div>
          )}
        </div>
      </div>

      <SectionDivider />

      <div>
        <h3 className="font-display font-bold text-[#1A1A1A] mb-1">Entregas por confirmar</h3>
        <p className="text-[#1A1A1A]/35 text-xs mb-6">
          Al confirmar la recepción, el stock sale del vehículo y entra al punto.
        </p>

        {pendientes.length === 0 ? (
          <p className="text-[#1A1A1A]/25 text-sm">Sin entregas pendientes.</p>
        ) : (
          <div className="space-y-4">
            {pendientes.map(entrega => {
              const v = VEHICLES_DATA.find(v => v.id === entrega.vehiculoId)
              return (
                <div
                  key={entrega.id}
                  className="p-5 rounded-lg border border-[#16A34A]/30 bg-white space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[#1A1A1A]/70 text-sm font-medium">
                        {v?.driver} ({v?.id})
                      </span>
                      <span className="text-[#1A1A1A]/25 text-xs ml-2">{entrega.creadoEn}</span>
                    </div>
                    <span className="text-orange-500 text-xs font-medium">Pendiente confirmación</span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {Object.entries(entrega.productos).map(([id, qty]) => {
                      const p = PRODUCTOS.find(p => p.id === parseInt(id))
                      return p ? (
                        <div key={id} className="flex flex-col gap-0.5">
                          <div className="font-display font-black text-2xl leading-none text-[#1A1A1A]">{qty}</div>
                          <div className="text-[#1A1A1A]/40 text-xs">{p.nombre}</div>
                          <div className="text-[#1A1A1A]/20 text-xs">{p.unidad}</div>
                        </div>
                      ) : null
                    })}
                  </div>
                  <button
                    onClick={() => confirmarRecepcion(entrega)}
                    className="px-5 py-2 rounded-lg font-semibold text-sm text-white bg-[#16A34A] transition-opacity hover:opacity-90"
                  >
                    Confirmar Recepción
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <SectionDivider />

      <div>
        <h3 className="font-display font-bold text-[#1A1A1A] mb-6">Mi inventario actual</h3>
        <StockGrid stock={pStock} />
      </div>

    </div>
  )
}

function LogActividad({ log }) {
  if (log.length === 0) return null
  return (
    <div className="pt-8 border-t border-[#E5E5E5]">
      <div className="text-[#1A1A1A]/25 text-xs uppercase tracking-wider mb-4">Log de actividad</div>
      <div className="space-y-2">
        {log.map((l, i) => (
          <div key={i} className="flex items-center gap-3 text-xs">
            <div className="w-1 h-1 rounded-full bg-[#16A34A]/40 flex-shrink-0" />
            <span className="text-[#1A1A1A]/50 font-medium">{l.actor}</span>
            <span className="text-[#1A1A1A]/35">—</span>
            <span className="text-[#1A1A1A]/40 flex-1">{l.accion}</span>
            <span className="text-[#1A1A1A]/20 tabular-nums ml-auto">{l.time}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
