import { Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingCart, BarChart2, Truck, ArrowLeft, Menu as MenuIcon2, X } from 'lucide-react'
import { useState } from 'react'
import DashboardDemo from './demo/DashboardDemo'
import InventoryDemo from './demo/InventoryDemo'
import SalesDemo from './demo/SalesDemo'
import ReportsDemo from './demo/ReportsDemo'
import RoutesDemo from './demo/RoutesDemo'

const NAV = [
  { to: '/demo', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/demo/inventario', icon: Package, label: 'Inventario' },
  { to: '/demo/ventas', icon: ShoppingCart, label: 'Ventas POS' },
  { to: '/demo/rutas', icon: Truck, label: 'Rutas' },
  { to: '/demo/reportes', icon: BarChart2, label: 'Reportes' },
]

export default function DemoApp() {
  const nav = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen flex" style={{background:'#FAFAFA'}}>
      {/* Sidebar desktop */}
      <aside className="hidden md:flex flex-col w-60 bg-white border-r border-[#E5E5E5] fixed h-full">
        <div className="px-5 py-5 border-b border-[#E5E5E5]">
          <img src="/logo.png" alt="La Arepa" style={{height:38, width:'auto', objectFit: 'contain'}}/>
          <div className="text-[#1A1A1A]/35 text-xs mt-1.5">Demo — Rol: Administrador</div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} end={to==='/demo'} className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-[#16A34A]/8 text-[#16A34A] border border-[#16A34A]/20' : 'text-[#1A1A1A]/50 hover:text-[#1A1A1A] hover:bg-[#1A1A1A]/5'}`
            }>
              <Icon size={17}/> {label}
            </NavLink>
          ))}
        </nav>
        <div className="px-3 pb-4">
          <button onClick={() => nav('/')} className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-[#1A1A1A]/35 hover:text-[#1A1A1A] text-sm transition-colors">
            <ArrowLeft size={16}/> Volver al sitio
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#E5E5E5] px-4 h-14 flex items-center justify-between">
        <span className="font-display font-black text-[#16A34A]">La Arepa</span>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-[#1A1A1A]">{mobileOpen ? <X/> : <MenuIcon2/>}</button>
      </div>
      {mobileOpen && (
        <div className="md:hidden fixed top-14 left-0 right-0 z-40 bg-white border-b border-[#E5E5E5] px-3 py-3 space-y-1">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} end={to==='/demo'} onClick={() => setMobileOpen(false)}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-[#16A34A]/8 text-[#16A34A]' : 'text-[#1A1A1A]/50'}`}>
              <Icon size={17}/>{label}
            </NavLink>
          ))}
          <button onClick={() => nav('/')} className="flex items-center gap-2 px-3 py-2.5 text-[#1A1A1A]/40 text-sm"><ArrowLeft size={16}/>Volver</button>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 md:ml-60 pt-14 md:pt-0">
        <Routes>
          <Route index element={<DashboardDemo />} />
          <Route path="inventario" element={<InventoryDemo />} />
          <Route path="ventas" element={<SalesDemo />} />
          <Route path="rutas" element={<RoutesDemo />} />
          <Route path="reportes" element={<ReportsDemo />} />
        </Routes>
      </main>
    </div>
  )
}
