import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, ChevronRight, Menu as MenuIcon, X, Check, Phone } from 'lucide-react'

/* ── Data ────────────────────────────────────────────────────── */
const PRODUCTS = [
  { name: 'Arepa con Queso', price: 4500, emoji: '🫓', desc: 'Maíz blanco, queso costeño fundido' },
  { name: 'Arepa con Jamón', price: 5000, emoji: '🥪', desc: 'Jamón ahumado + queso mozzarella' },
  { name: 'Arepa Especial', price: 7500, emoji: '⭐', desc: 'Chorizo + huevo + queso + hogao' },
  { name: 'Arepa Mixta', price: 8000, emoji: '🌟', desc: 'Jamón + chorizo + queso + tomate' },
  { name: 'Chorizo Parrilla', price: 5500, emoji: '🌭', desc: 'Chorizo artesanal a la parrilla' },
  { name: 'Combo Chorizo x2', price: 9500, emoji: '🔥', desc: 'Dos chorizos + arepa + salsa' },
  { name: 'Jugo Natural', price: 3000, emoji: '🧃', desc: 'Naranja, mora, lulo o guanábana' },
  { name: 'Gaseosa 350ml', price: 2500, emoji: '🥤', desc: 'Coca-Cola, Sprite, Manzana' },
]

const PUNTOS = [
  { id: 1, name: 'Chapinero Centro', dir: 'Cra 13 #52-34', barrio: 'Chapinero', open: true, x: 55, y: 30 },
  { id: 2, name: 'Suba Plaza', dir: 'Av. Suba #115-20', barrio: 'Suba', open: true, x: 28, y: 18 },
  { id: 3, name: 'Kennedy Cl 38', dir: 'Cl 38 Sur #80-12', barrio: 'Kennedy', open: false, x: 30, y: 65 },
  { id: 4, name: 'Usaquén Norte', dir: 'Cra 6 #119-08', barrio: 'Usaquén', open: true, x: 63, y: 12 },
  { id: 5, name: 'Bosa Centro', dir: 'Tr 78D #70-52 Sur', barrio: 'Bosa', open: true, x: 20, y: 75 },
  { id: 6, name: 'Engativá', dir: 'Cl 63 #76-40', barrio: 'Engativá', open: true, x: 24, y: 40 },
  { id: 7, name: 'Teusaquillo', dir: 'Cra 24 #40-15', barrio: 'Teusaquillo', open: false, x: 45, y: 38 },
  { id: 8, name: 'Barrios Unidos', dir: 'Cra 50 #72-10', barrio: 'Barrios Unidos', open: true, x: 42, y: 26 },
  { id: 9, name: 'Fontibón', dir: 'Cl 17 #99-50', barrio: 'Fontibón', open: true, x: 18, y: 52 },
  { id: 10, name: 'Puente Aranda', dir: 'Cra 36 #6-31', barrio: 'Puente Aranda', open: true, x: 36, y: 52 },
]

/* ── Helpers ─────────────────────────────────────────────────── */
function useFade() {
  const ref = useRef()
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && e.target.classList.add('visible'), { threshold: 0.12 })
    obs.observe(el); return () => obs.disconnect()
  }, [])
  return ref
}

/* ── Logo ────────────────────────────────────────────────────── */
function Logo({ size = 'md' }) {
  const h = size === 'sm' ? 42 : 52
  return (
    <img src="/logo.png" alt="La Arepa · Chorizos & Bebidas" style={{height: h, width: 'auto', maxWidth: 200, objectFit: 'contain'}} />
  )
}

/* ── Navbar ──────────────────────────────────────────────────── */
function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const nav = useNavigate()
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', h); return () => window.removeEventListener('scroll', h)
  }, [])
  const links = [['Menú','#menu'],['Puntos','#puntos'],['Franquicias','#franquicias']]
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md border-b border-[#E5E5E5]' : 'bg-transparent'}`}>
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <Logo size="sm" />
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {links.map(([l, h]) => (
            <a key={l} href={h} className="text-[#1A1A1A]/50 hover:text-[#1A1A1A] transition-colors">{l}</a>
          ))}
        </div>
        <button onClick={() => nav('/demo')} className="hidden md:block bg-[#D62B2B] text-white font-bold px-5 py-2 rounded-full text-sm hover:bg-[#B82222] transition-all hover:scale-105 active:scale-95">
          Ingresar
        </button>
        <button className="md:hidden text-[#1A1A1A] p-1" onClick={() => setOpen(!open)}>
          {open ? <X size={22}/> : <MenuIcon size={22}/>}
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-white border-t border-[#E5E5E5] px-5 py-4 flex flex-col gap-4">
          {links.map(([l, h]) => (
            <a key={l} href={h} className="text-[#1A1A1A]/70 text-sm font-medium" onClick={() => setOpen(false)}>{l}</a>
          ))}
          <button onClick={() => nav('/demo')} className="bg-[#D62B2B] text-white font-bold px-4 py-2.5 rounded-full text-sm">Ingresar</button>
        </div>
      )}
    </nav>
  )
}

/* ── Hero ────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section id="inicio" className="relative min-h-screen flex flex-col items-center justify-center text-center px-5 bg-grid overflow-hidden" style={{background:'#FAFAFA'}}>
      <div className="absolute inset-0 bg-gradient-to-b from-[#F5F0E8] via-[#FAFAFA] to-[#FAFAFA]" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#D62B2B]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-20 w-64 h-64 bg-[#D62B2B]/4 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 border border-[#D62B2B]/30 rounded-full px-4 py-1.5 text-[#D62B2B] text-xs font-semibold tracking-widest uppercase mb-8">
          Sabor Colombiano Auténtico
        </div>

        <h1 className="font-display font-black text-5xl md:text-7xl leading-[1.05] mb-6">
          <span className="text-[#1A1A1A]">La arepa que</span><br />
          <span className="gradient-gold">Colombia merece</span>
        </h1>

        <p className="text-[#1A1A1A]/50 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
          Más de 50 puntos de venta en toda la ciudad. Arepas rellenas, con huevo, chorizo, jamón y mucho más.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <a href="#menu" className="bg-[#D62B2B] text-white font-bold px-8 py-4 rounded-xl text-base hover:bg-[#B82222] transition-all hover:scale-105 active:scale-95">
            Ver el menú
          </a>
          <a href="#puntos" className="border border-[#1A1A1A]/20 text-[#1A1A1A] font-semibold px-8 py-4 rounded-xl text-base hover:bg-[#1A1A1A]/5 transition-all">
            Encuentra tu punto
          </a>
        </div>

        <div className="grid grid-cols-3 gap-8 max-w-sm mx-auto border-t border-[#1A1A1A]/8 pt-10">
          {[['12+','Años de sabor'],['50+','Puntos de venta'],['100%','Sabor colombiano']].map(([n, l]) => (
            <div key={n} className="text-center">
              <div className="font-display font-black text-3xl gradient-gold">{n}</div>
              <div className="text-[#1A1A1A]/40 text-xs mt-1 leading-snug">{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 scroll-bounce">
        <div className="w-5 h-9 border border-[#1A1A1A]/20 rounded-full flex justify-center pt-1.5">
          <div className="w-1 h-2 bg-[#1A1A1A]/25 rounded-full" />
        </div>
      </div>
    </section>
  )
}

/* ── Menu Section ────────────────────────────────────────────── */
function MenuSection() {
  const ref = useFade()
  const [cat, setCat] = useState('Todos')
  const cats = ['Todos', 'Arepas', 'Carnes', 'Bebidas']
  const catMap = { Arepas: ['Arepa con Queso','Arepa con Jamón','Arepa Especial','Arepa Mixta'], Carnes: ['Chorizo Parrilla','Combo Chorizo x2'], Bebidas: ['Jugo Natural','Gaseosa 350ml'] }
  const filtered = cat === 'Todos' ? PRODUCTS : PRODUCTS.filter(p => catMap[cat]?.includes(p.name))

  return (
    <section id="menu" className="py-24 px-5" style={{background:'#FAFAFA'}}>
      <div className="max-w-5xl mx-auto section-fade" ref={ref}>
        <div className="text-center mb-12">
          <span className="text-[#D62B2B] text-xs font-semibold tracking-widest uppercase">Nuestros productos</span>
          <h2 className="font-display font-black text-4xl md:text-5xl text-[#1A1A1A] mt-3">El menú</h2>
          <p className="text-[#1A1A1A]/40 mt-3 max-w-lg mx-auto">Hecho con ingredientes frescos, preparado con amor. Igual de rico en todos nuestros puntos.</p>
        </div>

        <div className="flex justify-center gap-2 mb-10 flex-wrap">
          {cats.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${cat === c ? 'bg-[#D62B2B] text-white' : 'border border-[#1A1A1A]/12 text-[#1A1A1A]/50 hover:border-[#1A1A1A]/25 hover:text-[#1A1A1A]'}`}>
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <div key={p.name} className="bg-white border border-[#E5E5E5] rounded-2xl p-5 card-hover cursor-default">
              <div className="text-4xl mb-3">{p.emoji}</div>
              <div className="font-semibold text-[#1A1A1A] text-sm leading-snug mb-1">{p.name}</div>
              <div className="text-[#1A1A1A]/40 text-xs mb-3 leading-relaxed">{p.desc}</div>
              <div className="font-display font-bold text-[#D62B2B] text-lg">${p.price.toLocaleString('es-CO')}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Map Section ─────────────────────────────────────────────── */
function MapSection() {
  const ref = useFade()
  const [search, setSearch] = useState('')
  const [sel, setSel] = useState(null)
  const filtered = PUNTOS.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.barrio.toLowerCase().includes(search.toLowerCase()) ||
    p.dir.toLowerCase().includes(search.toLowerCase())
  )
  const featured = PUNTOS.slice(0, 3)

  return (
    <section id="puntos" className="py-24 px-5" style={{background:'#F0EBE0'}}>
      <div className="max-w-5xl mx-auto section-fade" ref={ref}>
        <div className="mb-12">
          <span className="text-[#D62B2B] text-xs font-semibold tracking-widest uppercase">Encuéntranos</span>
          <h2 className="font-display font-black text-4xl md:text-5xl text-[#1A1A1A] mt-3">El punto más cercano</h2>
          <p className="text-[#1A1A1A]/40 mt-2 max-w-xl">Más de 50 puntos en toda la ciudad. Ingresa tu dirección y encuentra el más cercano.</p>
        </div>

        <div className="relative bg-white border border-[#E5E5E5] rounded-2xl overflow-hidden mb-6" style={{height: 340}}>
          <div className="absolute inset-0 opacity-5" style={{backgroundImage:'linear-gradient(#D62B2B 1px,transparent 1px),linear-gradient(90deg,#D62B2B 1px,transparent 1px)',backgroundSize:'36px 36px'}} />

          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 w-80">
            <div className="flex items-center gap-2 bg-white border border-[#E5E5E5] rounded-xl px-4 py-3 shadow-sm">
              <div className="w-2 h-2 bg-[#D62B2B] rounded-full flex-shrink-0" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Buscar por dirección o barrio..."
                className="bg-transparent text-[#1A1A1A] text-sm flex-1 focus:outline-none placeholder-[#1A1A1A]/30" />
            </div>
          </div>

          {filtered.map(p => (
            <button key={p.id} onClick={() => setSel(p)}
              className="absolute group"
              style={{left:`${p.x}%`, top:`${p.y}%`, transform:'translate(-50%,-50%)'}}>
              <div className="relative">
                <div className={`w-4 h-4 rounded-full border-2 transition-all ${sel?.id === p.id ? 'scale-150 bg-[#D62B2B] border-white' : 'bg-[#D62B2B]/70 border-[#D62B2B] hover:scale-125'}`} />
                {sel?.id === p.id && <div className="absolute inset-0 w-4 h-4 rounded-full bg-[#D62B2B]/30 ping2" />}
              </div>
            </button>
          ))}

          {sel && (
            <div className="absolute bottom-4 left-4 right-4 bg-white border border-[#D62B2B]/20 rounded-xl p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-[#1A1A1A] text-sm">{sel.name}</div>
                  <div className="text-[#1A1A1A]/40 text-xs mt-0.5">{sel.dir}</div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${sel.open ? 'bg-[#D62B2B]/10 text-[#D62B2B]' : 'bg-[#1A1A1A]/5 text-[#1A1A1A]/40'}`}>
                  {sel.open ? 'Abierto ahora' : 'Cerrado'}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {featured.map(p => (
            <div key={p.id} onClick={() => setSel(p)}
              className="bg-white border border-[#E5E5E5] rounded-xl p-4 cursor-pointer hover:border-[#D62B2B]/30 transition-all">
              <div className="font-semibold text-[#1A1A1A] text-sm mb-0.5">{p.name}</div>
              <div className="text-[#1A1A1A]/40 text-xs mb-3">{p.dir}</div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${p.open ? 'bg-[#D62B2B]/10 text-[#D62B2B]' : 'bg-[#1A1A1A]/5 text-[#1A1A1A]/40'}`}>
                {p.open ? 'Abierto ahora' : 'Cierra 8pm'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Franquicias ─────────────────────────────────────────────── */
function Franquicias() {
  const ref = useFade()
  const [form, setForm] = useState({ nombre:'', telefono:'', ciudad:'', capital:'Menos de $10M COP' })
  const [sent, setSent] = useState(false)

  return (
    <section id="franquicias" className="py-24 px-5" style={{background:'#FAFAFA'}}>
      <div className="max-w-5xl mx-auto section-fade" ref={ref}>
        <div className="bg-white border border-[#E5E5E5] rounded-2xl overflow-hidden shadow-sm">
          <div className="grid md:grid-cols-2">
            <div className="p-8 md:p-12">
              <span className="text-[#D62B2B] text-xs font-semibold tracking-widest uppercase">Franquicias</span>
              <h2 className="font-display font-black text-3xl md:text-4xl text-[#1A1A1A] mt-3 mb-4 leading-tight">
                Abre tu propio<br />punto de venta
              </h2>
              <p className="text-[#1A1A1A]/50 text-sm leading-relaxed mb-8">
                Únete a la familia. Más de 50 franquiciados exitosos respaldan el modelo.
              </p>
              <div className="space-y-3">
                {[
                  'Capacitación completa y soporte continuo',
                  'Abastecimiento centralizado desde punto central',
                  'Sistema de gestión de inventario y ventas incluido',
                  'Marca reconocida con más de 12 años en el mercado',
                ].map((b, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#D62B2B] flex-shrink-0 mt-2" />
                    <span className="text-[#1A1A1A]/60 text-sm leading-relaxed">{b}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 md:p-12 border-t md:border-t-0 md:border-l border-[#E5E5E5]">
              {sent ? (
                <div className="h-full flex flex-col items-center justify-center text-center min-h-64">
                  <div className="w-16 h-16 bg-[#D62B2B]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check size={28} className="text-[#D62B2B]" />
                  </div>
                  <h3 className="font-display font-bold text-[#1A1A1A] text-xl mb-2">¡Solicitud enviada!</h3>
                  <p className="text-[#1A1A1A]/40 text-sm">Nos pondremos en contacto en menos de 24 horas.</p>
                </div>
              ) : (
                <>
                  <h3 className="font-display font-bold text-[#1A1A1A] text-lg mb-6">Quiero ser franquiciado</h3>
                  <form onSubmit={e => { e.preventDefault(); setSent(true) }} className="space-y-4">
                    <div>
                      <label className="text-[#1A1A1A]/40 text-xs mb-1.5 block">Nombre completo</label>
                      <input required value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})}
                        placeholder="Tu nombre"
                        className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-4 py-3 text-[#1A1A1A] text-sm placeholder-[#1A1A1A]/25 focus:outline-none focus:border-[#D62B2B]/40 transition-colors" />
                    </div>
                    <div>
                      <label className="text-[#1A1A1A]/40 text-xs mb-1.5 block">Teléfono / WhatsApp</label>
                      <input required value={form.telefono} onChange={e => setForm({...form, telefono: e.target.value})}
                        placeholder="+57 300 000 0000"
                        className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-4 py-3 text-[#1A1A1A] text-sm placeholder-[#1A1A1A]/25 focus:outline-none focus:border-[#D62B2B]/40 transition-colors" />
                    </div>
                    <div>
                      <label className="text-[#1A1A1A]/40 text-xs mb-1.5 block">Ciudad de interés</label>
                      <input required value={form.ciudad} onChange={e => setForm({...form, ciudad: e.target.value})}
                        placeholder="Bogotá, Medellín..."
                        className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-4 py-3 text-[#1A1A1A] text-sm placeholder-[#1A1A1A]/25 focus:outline-none focus:border-[#D62B2B]/40 transition-colors" />
                    </div>
                    <div>
                      <label className="text-[#1A1A1A]/40 text-xs mb-1.5 block">Capital disponible</label>
                      <select value={form.capital} onChange={e => setForm({...form, capital: e.target.value})}
                        className="w-full bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-4 py-3 text-[#1A1A1A] text-sm focus:outline-none focus:border-[#D62B2B]/40 transition-colors">
                        <option>Menos de $10M COP</option>
                        <option>$10M – $20M COP</option>
                        <option>$20M – $30M COP</option>
                        <option>Más de $30M COP</option>
                      </select>
                    </div>
                    <button type="submit"
                      className="w-full bg-[#D62B2B] text-white font-bold py-3.5 rounded-xl hover:bg-[#B82222] transition-all hover:scale-[1.02] active:scale-95 text-sm mt-2">
                      Solicitar información
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Footer ──────────────────────────────────────────────────── */
function Footer() {
  const nav = useNavigate()
  return (
    <footer className="bg-[#F0EBE0] border-t border-[#E5E5E5] py-10 px-5">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <Logo size="sm" />
          <div className="text-[#1A1A1A]/30 text-xs mt-2">© 2025 La Arepa · Chorizos &amp; Bebidas</div>
        </div>
        <div className="flex items-center gap-4">
          <a href="#menu" className="text-[#1A1A1A]/40 text-sm hover:text-[#1A1A1A] transition-colors">Menú</a>
          <a href="#puntos" className="text-[#1A1A1A]/40 text-sm hover:text-[#1A1A1A] transition-colors">Puntos</a>
          <a href="#franquicias" className="text-[#1A1A1A]/40 text-sm hover:text-[#1A1A1A] transition-colors">Franquicias</a>
          <button onClick={() => nav('/demo')} className="bg-[#D62B2B] text-white font-bold px-5 py-2 rounded-full text-sm hover:bg-[#B82222] transition-all">
            Ingresar
          </button>
        </div>
      </div>
    </footer>
  )
}

/* ── Main Export ─────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{background:'#FAFAFA'}}>
      <Navbar />
      <Hero />
      <MenuSection />
      <MapSection />
      <Franquicias />
      <Footer />
    </div>
  )
}
