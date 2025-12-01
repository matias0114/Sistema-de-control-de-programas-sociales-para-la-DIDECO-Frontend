import React, { useState } from "react";
import "./SidebarVisualizador.css";

function SidebarVisualizador({ isOpen, onClose, programas, onSelect }) {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  if (!isOpen) return null;

  const grupos = {
    activos: programas.filter(p => p.estado?.toLowerCase() === "activo"),
    inactivos: programas.filter(p => p.estado?.toLowerCase() === "finalizado"),
    borrador: programas.filter(p => p.estado?.toLowerCase() === "borrador"),
    todos: programas
  };

  return (
    <>
      <div className="sidevisual-overlay" onClick={onClose}></div>

      <div className={`sidevisual-panel ${isOpen ? "open" : ""}`}>
        
        <div className="sidevisual-header">
          <img src="/logo-circular.png" className="sidevisual-logo" alt="" />
          <h3>Programas</h3>
          <button className="sidevisual-close" onClick={onClose}>×</button>
        </div>

        <nav className="sidevisual-nav">

          {/* ACTIVOS */}
          <button 
            className="sidevisual-nav-item"
            onClick={() => toggleSection("activos")}
          >
            <span className="nav-icon">🟢</span>
            Activos
            <span className="right-number">{grupos.activos.length}</span>
          </button>

          {openSection === "activos" && (
            <div className="sidevisual-list">
              {grupos.activos.map(p => (
                <div 
                  key={p.idPrograma}
                  className="sidevisual-item"
                  onClick={() => { onSelect(p.idPrograma); onClose(); }}
                >
                  📘 {p.nombrePrograma}
                </div>
              ))}
            </div>
          )}

          {/* FINALIZADOS */}
          <button 
            className="sidevisual-nav-item"
            onClick={() => toggleSection("inactivos")}
          >
            <span className="nav-icon">🔴</span>
            Finalizados
            <span className="right-number">{grupos.inactivos.length}</span>
          </button>

          {openSection === "inactivos" && (
            <div className="sidevisual-list">
              {grupos.inactivos.map(p => (
                <div 
                  key={p.idPrograma}
                  className="sidevisual-item"
                  onClick={() => { onSelect(p.idPrograma); onClose(); }}
                >
                  📕 {p.nombrePrograma}
                </div>
              ))}
            </div>
          )}

          {/* BORRADOR */}
          <button 
            className="sidevisual-nav-item"
            onClick={() => toggleSection("borrador")}
          >
            <span className="nav-icon">🟡</span>
            Borrador
            <span className="right-number">{grupos.borrador.length}</span>
          </button>

          {openSection === "borrador" && (
            <div className="sidevisual-list">
              {grupos.borrador.map(p => (
                <div 
                  key={p.idPrograma}
                  className="sidevisual-item"
                  onClick={() => { onSelect(p.idPrograma); onClose(); }}
                >
                  📙 {p.nombrePrograma}
                </div>
              ))}
            </div>
          )}

          {/* TODOS */}
          <button 
            className="sidevisual-nav-item"
            onClick={() => toggleSection("todos")}
          >
            <span className="nav-icon">📋</span>
            Todos
            <span className="right-number">{grupos.todos.length}</span>
          </button>

          {openSection === "todos" && (
            <div className="sidevisual-list">
              {grupos.todos.map(p => (
                <div 
                  key={p.idPrograma}
                  className="sidevisual-item"
                  onClick={() => { onSelect(p.idPrograma); onClose(); }}
                >
                  📄 {p.nombrePrograma}
                </div>
              ))}
            </div>
          )}

        </nav>
      </div>
    </>
  );
}

export default SidebarVisualizador;
