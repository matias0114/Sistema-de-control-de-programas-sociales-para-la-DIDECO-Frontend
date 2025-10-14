import React, { useState, useEffect } from "react";
import ProgramaVisualizadorDetalle from './ProgramaVisualizadorDetalle';
import Layout from '../components/LayoutSimple'; 
import { useNavigate } from "react-router-dom";

function VisualizadorProgramas() {
  const [programas, setProgramas] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/programas")
      .then(res => res.json())
      .then(data => {
        setProgramas(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Cargando programas...</div>;

  return (
    <Layout title="Visualización de Programas">
      <div style={{maxWidth:1000,margin:"0 auto",padding:30}}>
        <h2 style={{color:"#1664c1",marginBottom:30}}>Programas disponibles</h2>
        {!selected ? (
          <table style={{width:"100%",background:"#fff",borderRadius:9,boxShadow:"0 2px 6px #ddd"}}>
            <thead>
              <tr style={{background:"#f4f9ff",color:"#333"}}>
                <th style={{padding:14}}>Nombre</th>
                <th style={{padding:14}}>Encargado</th>
                <th style={{padding:14}}>Estado</th>
                <th style={{padding:14}}></th>
              </tr>
            </thead>
            <tbody>
              {programas.map(p => (
                <tr key={p.idPrograma}>
                  <td style={{padding:10}}>{p.nombrePrograma}</td>
                  <td style={{padding:10}}>{p.usuario?.nombreUsuario || "Sin asignar"}</td>
                  <td style={{padding:10}}>{p.estado}</td>
                  <td style={{padding:10}}>
                    <button
                      style={{
                        background:"#1664c1",color:"white",
                        border:"none",borderRadius:5,
                        padding:"7px 15px",fontWeight:700,cursor:"pointer"
                      }}
                      onClick={() => setSelected(p.idPrograma)}
                    >
                      Ver detalles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <ProgramaVisualizadorDetalle idPrograma={selected} onBack={() => setSelected(null)} />
        )}
      </div>
    </Layout>
  );
}

export default VisualizadorProgramas;