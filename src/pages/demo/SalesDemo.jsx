import { useState } from 'react'
import { ShoppingCart, Plus, Minus, Trash2, Printer, CheckCircle, Smartphone, Banknote, X } from 'lucide-react'

const MENU = [
  { id: 1, name: 'Arepa con Queso', price: 4500, emoji: '🫓', cat: 'Arepas' },
  { id: 2, name: 'Arepa con Jamón', price: 5000, emoji: '🥪', cat: 'Arepas' },
  { id: 3, name: 'Arepa Especial', price: 7500, emoji: '⭐', cat: 'Arepas' },
  { id: 4, name: 'Arepa Mixta', price: 8000, emoji: '🌟', cat: 'Arepas' },
  { id: 5, name: 'Chorizo Parrilla', price: 5500, emoji: '🌭', cat: 'Carnes' },
  { id: 6, name: 'Combo Chorizo x2', price: 9500, emoji: '🔥', cat: 'Carnes' },
  { id: 7, name: 'Jugo Natural', price: 3000, emoji: '🧃', cat: 'Bebidas' },
  { id: 8, name: 'Gaseosa', price: 2500, emoji: '🥤', cat: 'Bebidas' },
  { id: 9, name: 'Agua Cristal', price: 2000, emoji: '💧', cat: 'Bebidas' },
]

let invoiceCounter = 1001

export default function SalesDemo() {
  const [cart, setCart] = useState([])
  const [cat, setCat] = useState('Todos')
  const [payMethod, setPayMethod] = useState(null)
  const [efectivo, setEfectivo] = useState('')
  const [invoice, setInvoice] = useState(null)
  const [clientName, setClientName] = useState('')
  const [step, setStep] = useState('pos')

  const cats = ['Todos', 'Arepas', 'Carnes', 'Bebidas']
  const filtered = cat === 'Todos' ? MENU : MENU.filter(m => m.cat === cat)

  const addItem = (item) => {
    setCart(c => {
      const ex = c.find(i => i.id === item.id)
      return ex ? c.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i) : [...c, { ...item, qty: 1 }]
    })
  }

  const updateQty = (id, delta) => {
    setCart(c => c.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter(i => i.qty > 0))
  }

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0)
  const cambio = parseInt(efectivo) - total

  const confirmarVenta = () => {
    const inv = {
      numero: `FAC-${invoiceCounter++}`,
      fecha: new Date().toLocaleString('es-CO'),
      vendedor: 'María Rodríguez',
      punto: 'Chapinero Centro',
      items: [...cart],
      total,
      metodo: payMethod,
      cliente: clientName || 'Anónimo',
      efectivo: payMethod === 'efectivo' ? parseInt(efectivo) : null,
      cambio: payMethod === 'efectivo' ? cambio : null,
    }
    setInvoice(inv)
    setStep('invoice')
  }

  const nueva = () => {
    setCart([]); setPayMethod(null); setEfectivo(''); setClientName(''); setInvoice(null); setStep('pos')
  }

  if (step === 'invoice' && invoice) {
    return (
      <div className="p-5 md:p-8 flex justify-center" style={{background:'#FAFAFA'}}>
        <div className="w-full max-w-md">
          <div className="bg-white border border-green-300/60 rounded-2xl p-6 shadow-sm">
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-green-500/15 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle size={28} className="text-green-500"/>
              </div>
              <div className="font-display font-black text-[#1A1A1A] text-xl">¡Venta Confirmada!</div>
              <div className="text-[#1A1A1A]/40 text-sm mt-1">{invoice.numero}</div>
            </div>

            <div className="bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl p-4 font-mono text-xs space-y-1 mb-4">
              <div className="text-center text-[#16A34A] font-bold text-sm mb-2">🫓 LA AREPA · CHORIZO & BEBIDA</div>
              <div className="text-center text-[#1A1A1A]/50 mb-3">{invoice.punto}</div>
              <div className="flex justify-between text-[#1A1A1A]/60"><span>Factura:</span><span className="text-[#1A1A1A]">{invoice.numero}</span></div>
              <div className="flex justify-between text-[#1A1A1A]/60"><span>Fecha:</span><span className="text-[#1A1A1A]">{invoice.fecha}</span></div>
              <div className="flex justify-between text-[#1A1A1A]/60"><span>Vendedor:</span><span className="text-[#1A1A1A]">{invoice.vendedor}</span></div>
              <div className="flex justify-between text-[#1A1A1A]/60"><span>Cliente:</span><span className="text-[#1A1A1A]">{invoice.cliente}</span></div>
              <div className="border-t border-[#E5E5E5] my-2"/>
              {invoice.items.map(i => (
                <div key={i.id} className="flex justify-between">
                  <span className="text-[#1A1A1A]/70">{i.emoji} {i.name} ×{i.qty}</span>
                  <span className="text-[#1A1A1A]">${(i.price*i.qty).toLocaleString()}</span>
                </div>
              ))}
              <div className="border-t border-[#E5E5E5] my-2"/>
              <div className="flex justify-between font-bold text-[#16A34A]"><span>TOTAL</span><span>${invoice.total.toLocaleString()}</span></div>
              <div className="flex justify-between text-[#1A1A1A]/60"><span>Método:</span><span className="text-[#1A1A1A] capitalize">{invoice.metodo}</span></div>
              {invoice.cambio !== null && invoice.cambio >= 0 && (
                <div className="flex justify-between text-green-600"><span>Cambio:</span><span>${invoice.cambio.toLocaleString()}</span></div>
              )}
            </div>

            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 bg-[#F0EBE0] text-[#1A1A1A] py-3 rounded-xl hover:bg-[#E5DDD0] transition-colors text-sm font-semibold">
                <Printer size={15}/> Imprimir
              </button>
              <button onClick={nueva} className="flex-1 bg-[#16A34A] text-white font-bold py-3 rounded-xl hover:bg-[#15803D] transition-all text-sm">
                Nueva Venta
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col md:flex-row overflow-hidden" style={{background:'#FAFAFA'}}>
      <div className="flex-1 overflow-y-auto p-5 border-r border-[#E5E5E5]">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-display font-black text-xl text-[#1A1A1A]">POS · Ventas</h1>
          <div className="text-[#1A1A1A]/40 text-xs">Chapinero Centro</div>
        </div>

        <div className="flex gap-2 mb-4 flex-wrap">
          {cats.map(c => (
            <button key={c} onClick={() => setCat(c)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${cat===c?'bg-[#16A34A] text-white':'bg-[#1A1A1A]/8 text-[#1A1A1A]/60 hover:bg-[#1A1A1A]/12'}`}>{c}</button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {filtered.map(item => (
            <button key={item.id} onClick={() => addItem(item)} className="pos-btn bg-white border border-[#E5E5E5] rounded-xl p-4 text-left hover:border-[#16A34A]/30 transition-all hover:-translate-y-0.5 group shadow-sm">
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{item.emoji}</div>
              <div className="text-[#1A1A1A] text-xs font-semibold leading-tight">{item.name}</div>
              <div className="text-[#16A34A] font-display font-bold text-sm mt-1">${item.price.toLocaleString()}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="w-full md:w-80 bg-white flex flex-col border-t md:border-t-0 border-[#E5E5E5]" style={{maxHeight:'100vh'}}>
        <div className="p-4 border-b border-[#E5E5E5] flex items-center gap-2">
          <ShoppingCart size={18} className="text-[#16A34A]"/>
          <span className="font-display font-bold text-[#1A1A1A]">Orden</span>
          {cart.length > 0 && (
            <button onClick={() => setCart([])} className="ml-auto text-[#1A1A1A]/30 hover:text-red-500 transition-colors"><Trash2 size={14}/></button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {cart.length === 0 ? (
            <div className="text-center py-12 text-[#1A1A1A]/30">
              <ShoppingCart size={32} className="mx-auto mb-2 opacity-30"/>
              <p className="text-sm">Toca un producto para agregar</p>
            </div>
          ) : cart.map(item => (
            <div key={item.id} className="flex items-center gap-2 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl p-3">
              <span className="text-lg flex-shrink-0">{item.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="text-[#1A1A1A] text-xs font-medium truncate">{item.name}</div>
                <div className="text-[#16A34A] text-xs">${(item.price*item.qty).toLocaleString()}</div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => updateQty(item.id,-1)} className="w-6 h-6 rounded-full bg-[#1A1A1A]/8 flex items-center justify-center hover:bg-red-500/15 transition-colors"><Minus size={10} className="text-[#1A1A1A]"/></button>
                <span className="text-[#1A1A1A] text-sm font-bold w-5 text-center">{item.qty}</span>
                <button onClick={() => updateQty(item.id,1)} className="w-6 h-6 rounded-full bg-[#1A1A1A]/8 flex items-center justify-center hover:bg-green-500/15 transition-colors"><Plus size={10} className="text-[#1A1A1A]"/></button>
              </div>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <div className="p-4 border-t border-[#E5E5E5] space-y-3">
            <input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Nombre del cliente (opcional)"
              className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-3 py-2 text-[#1A1A1A] text-sm placeholder-[#1A1A1A]/30 focus:outline-none focus:border-[#16A34A]/40"/>

            <div className="flex gap-2">
              <button onClick={() => setPayMethod('efectivo')} className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${payMethod==='efectivo'?'bg-green-500/15 border border-green-500/40 text-green-700':'bg-[#1A1A1A]/6 text-[#1A1A1A]/60 hover:bg-[#1A1A1A]/10'}`}>
                <Banknote size={14}/> Efectivo
              </button>
              <button onClick={() => setPayMethod('nequi')} className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${payMethod==='nequi'?'bg-pink-500/15 border border-pink-500/40 text-pink-600':'bg-[#1A1A1A]/6 text-[#1A1A1A]/60 hover:bg-[#1A1A1A]/10'}`}>
                <Smartphone size={14}/> Nequi
              </button>
              <button onClick={() => setPayMethod('daviplata')} className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${payMethod==='daviplata'?'bg-yellow-500/15 border border-yellow-500/40 text-yellow-700':'bg-[#1A1A1A]/6 text-[#1A1A1A]/60 hover:bg-[#1A1A1A]/10'}`}>
                <Smartphone size={14}/> DaviPlata
              </button>
            </div>

            {payMethod === 'efectivo' && (
              <div className="space-y-1.5">
                <input type="number" value={efectivo} onChange={e=>setEfectivo(e.target.value)} placeholder="Monto recibido" className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-3 py-2 text-[#1A1A1A] text-sm focus:outline-none focus:border-[#16A34A]/40"/>
                {efectivo && <div className={`text-xs px-2 ${cambio >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {cambio >= 0 ? `Cambio: $${cambio.toLocaleString()}` : `Falta: $${Math.abs(cambio).toLocaleString()}`}
                </div>}
              </div>
            )}

            {(payMethod === 'nequi' || payMethod === 'daviplata') && (
              <div className="bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl p-3 text-xs text-[#1A1A1A]/50 text-center">
                📸 El vendedor captura el pantallazo de la transacción
              </div>
            )}

            <div className="flex justify-between font-display font-bold text-lg border-t border-[#E5E5E5] pt-2">
              <span className="text-[#1A1A1A]">Total</span>
              <span className="text-[#16A34A]">${total.toLocaleString()}</span>
            </div>

            <button onClick={confirmarVenta} disabled={!payMethod || (payMethod==='efectivo' && cambio < 0)}
              className="w-full bg-[#16A34A] text-white font-bold py-3.5 rounded-xl hover:bg-[#15803D] transition-all disabled:opacity-40 disabled:cursor-not-allowed text-sm">
              ✓ Confirmar Venta
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
