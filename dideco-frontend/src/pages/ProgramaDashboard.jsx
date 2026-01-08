import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import EditarProgramaInfo from "./EditarProgramaInfo";
import CrearActividad from "./CrearActividad";
import IngresoPresupuesto from "./IngresoPresupuesto";
import PresupuestoChart from "./PresupuestoChart";
import GraficoProgreso from "./GraficoProgreso";
import GraficoGastosMensuales from "./GraficoGastosMensuales";
import "./programadashboard.css";
import "./crearactividad.css";

function ProgramaDashboard() {
  const { id } = useParams();
  const [programa, setPrograma] = useState(null);
  const [actividades, setActividades] = useState([]);
  const [presupuesto, setPresupuesto] = useState({});
  const [gastosMensuales, setGastosMensuales] = useState([]);
  const [beneficiarios, setBeneficiarios] = useState([]);
  const [showPresupuesto, setShowPresupuesto] = useState(false);
  const [showCrearActividad, setShowCrearActividad] = useState(false);
  const [showBeneficiarioForm, setShowBeneficiarioForm] = useState(false);
  const [editarBeneficiario, setEditarBeneficiario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const [presupuestosLista, setPresupuestosLista] = useState([]);
  console.log(
    "Fechas del programa:",
    programa?.fechaInicio,
    programa?.fechaFin || programa?.fechaTermino
  );



  function getActividadProgreso(act) {
    if (!act.fechaInicio || !act.fechaTermino) return 0;
    const inicio = new Date(act.fechaInicio);
    const fin = new Date(act.fechaTermino);
    const hoy = new Date();
    if (hoy <= inicio) return 0;
    if (hoy >= fin) return 100;
    const total = fin - inicio;
    const actual = hoy - inicio;
    return Math.round((actual / total) * 100);
  }

  const handleUpdatePrograma = async (newProg) => {
    try {
      //const response = await fetch(`http://localhost:8080/programas/${newProg.idPrograma}`, {
      const API_URL = process.env.REACT_APP_API_URL;
      const response = await fetch(`${API_URL}/programas/${newProg.idPrograma}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idPrograma: newProg.idPrograma,
          nombrePrograma: newProg.nombrePrograma,
          descripcion: newProg.descripcion,
          tipoPrograma: newProg.tipoPrograma,
          oficinaResponsable: newProg.oficinaResponsable,
          contactoEncargado: newProg.contactoEncargado,
          cupos: newProg.cupos,
          metas: newProg.metas,
          requisitosIngreso: newProg.requisitosIngreso,
          beneficios: newProg.beneficios,
          fechaInicio: newProg.fechaInicio,
          fechaFin: newProg.fechaFin,
          estado: newProg.estado,
          usuario: newProg.usuario
        })
      });
      
      if (response.ok) {
        await cargarDatosDashboard();
      } else {
        console.error('Error al actualizar el programa');
      }
    } catch (error) {
      console.error('Error en la actualización:', error);
    }
  };

  const handleAddActividad = async (data) => {
    //await fetch(`http://localhost:8080/actividades`, {
    const API_URL = process.env.REACT_APP_API_URL;
    await fetch(`${API_URL}/actividades`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    setShowCrearActividad(false);
    cargarDatosDashboard();
  };

  const handleAddPresupuesto = async (data) => {
    //await fetch(`http://localhost:8080/presupuestos`, {
    const API_URL = process.env.REACT_APP_API_URL;
    await fetch(`${API_URL}/presupuestos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    setShowPresupuesto(false);
    cargarDatosDashboard();
  };

  const cargarGastosMensuales = useCallback(() => {
    const gastosPorMes = {};

    actividades.forEach(actividad => {
      if (actividad.montoAsignado && actividad.fechaInicio) {
        const [yyyy, mm] = actividad.fechaInicio.split('-');
        const mes = Number(mm);
        const anio = Number(yyyy);
        const key = `${anio}-${mes}`;
        
        if (!gastosPorMes[key]) {
          gastosPorMes[key] = {
            total: 0,
            actividades: []
          };
        }
        
        gastosPorMes[key].total += parseFloat(actividad.montoAsignado) || 0;
        gastosPorMes[key].actividades.push({
          nombre: actividad.nombreActividad,
          monto: parseFloat(actividad.montoAsignado) || 0
        });
      }
    });

    const datosGrafico = Object.entries(gastosPorMes)
      .map(([key, data]) => {
        const [anio, mes] = key.split('-');
        return {
          mes: parseInt(mes),
          anio: parseInt(anio),
          total: data.total,
          actividades: data.actividades
        };
      })
      .sort((a, b) => {
        if (a.anio !== b.anio) return a.anio - b.anio;
        return a.mes - b.mes;
      });

    setGastosMensuales(datosGrafico);
  }, [actividades]);


  const cargarBeneficiarios = useCallback(async () => {
    try {
      //const resp = await fetch(`http://localhost:8080/beneficiarios-programa/programa/${id}`);
      const API_URL = process.env.REACT_APP_API_URL;
      const resp = await fetch(`${API_URL}/beneficiarios-programa/programa/${id}`);
      if (!resp.ok) throw new Error("No se pudieron cargar los beneficiarios");
      setBeneficiarios(await resp.json());
    } catch (err) {
      setBeneficiarios([]);
    }
  }, [id]);

  const cargarDatosDashboard = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      //const respPrograma = await fetch(`http://localhost:8080/programas/${id}`);
      const API_URL = process.env.REACT_APP_API_URL;
      const respPrograma = await fetch(`${API_URL}/programas/${id}`);
      if (!respPrograma.ok) throw new Error("Programa no encontrado");
      const programData = await respPrograma.json();
      setPrograma(programData);
      //const respActividades = await fetch(`http://localhost:8080/actividades`);
      const respActividades = await fetch(`${API_URL}/actividades`);
      const todasActividades = await respActividades.json();
      const actividadesData = todasActividades.filter(a => a.programa?.idPrograma === Number(id));
      setActividades(actividadesData);
      
      //const respPresupuesto = await fetch(`http://localhost:8080/presupuestos/programa/${id}`);
      const respPresupuesto = await fetch(`${API_URL}/presupuestos/programa/${id}`);
      const listaPresupuestos = respPresupuesto.ok ? await respPresupuesto.json() : [];

      setPresupuesto({
          asignado: listaPresupuestos.reduce((t, p) => t + Number(p.montoAsignado || 0), 0),
          ejecutado: 0
      });

      setPresupuestosLista(listaPresupuestos);
      await cargarBeneficiarios();      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { 
    cargarDatosDashboard();
  }, [cargarDatosDashboard]);

  useEffect(() => {
    if (actividades.length) {
      cargarGastosMensuales();
    }
  }, [actividades, cargarGastosMensuales]);

  useEffect(() => {
    if (programa && usuario && programa.usuario && programa.usuario.idUsuario !== usuario.idUsuario) {
      setError("No tienes permisos para acceder a este programa.");
      setTimeout(() => navigate("/"), 2000);
    }
  }, [programa, navigate, usuario]);

  const sumaMontosActividades = actividades.reduce(
    (total, act) => total + (parseFloat(act.montoAsignado) || 0),
    0
  );

  const getEstadoBadgeStyle = (estado) => {
    const estados = {
      'activo': { bg: '#ecfdf5', color: '#059669', border: '#10b981' },
      'finalizado': { bg: '#fef2f2', color: '#dc2626', border: '#ef4444' }
    };
    return estados[estado?.toLowerCase()] || estados['activo'];
  };


  const handleAddOrUpdateBeneficiario = async (data) => {
    if (editarBeneficiario) {
      //await fetch(`http://localhost:8080/beneficiarios-programa/${editarBeneficiario.idBeneficiario}`, {
      const API_URL = process.env.REACT_APP_API_URL;
      await fetch(`${API_URL}/beneficiarios-programa/${editarBeneficiario.idBeneficiario}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({...data, programa: {idPrograma: parseInt(id)}})
      });
    } else {
      //await fetch(`http://localhost:8080/beneficiarios-programa`, {
      const API_URL = process.env.REACT_APP_API_URL;
      await fetch(`${API_URL}/beneficiarios-programa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({...data, programa: {idPrograma: parseInt(id)}})
      });
    }
    setShowBeneficiarioForm(false);
    setEditarBeneficiario(null);
    cargarBeneficiarios();
  };

  const handleEditBeneficiario = beneficiario => {
    setEditarBeneficiario(beneficiario);
    setShowBeneficiarioForm(true);
  };

  const handleDeleteBeneficiario = async idBeneficiario => {
    if (window.confirm("¿Eliminar este beneficiario?")) {
      //await fetch(`http://localhost:8080/beneficiarios-programa/${idBeneficiario}`, { method: "DELETE" });
      const API_URL = process.env.REACT_APP_API_URL;
      await fetch(`${API_URL}/beneficiarios-programa/${idBeneficiario}`, { method: "DELETE" });
      cargarBeneficiarios();
    }
  };

  function BeneficiarioForm({ beneficiario, onSave, onCancel }) {
    const [form, setForm] = useState({
      nombreCompleto: beneficiario?.nombreCompleto || "",
      rut: beneficiario?.rut || "",
      telefono: beneficiario?.telefono || "",
      direccion: beneficiario?.direccion || ""
    });

    const [errors, setErrors] = useState({
      rut: "",
      telefono: "",
      direccion: ""
    });

    const limiteDireccion = 500;

    const validarRut = (rutCompleto) => {
      const rut = rutCompleto.replace(/\./g, "").replace(/-/g, "");

      if (rut.length < 2) return false;

      const cuerpo = rut.slice(0, -1);
      let dv = rut.slice(-1).toUpperCase();

      if (!/^[0-9]+$/.test(cuerpo)) return false;
      if (!/^[0-9K]$/.test(dv)) return false;

      let suma = 0;
      let multiplo = 2;

      for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += multiplo * parseInt(cuerpo[i]);
        multiplo = multiplo < 7 ? multiplo + 1 : 2;
      }

      const dvEsperado = 11 - (suma % 11);
      const dvResultado =
        dvEsperado === 11 ? "0" : dvEsperado === 10 ? "K" : dvEsperado.toString();

      return dv === dvResultado;
    };

    const handleChange = (e) => {
      const { name, value } = e.target;

      if (name === "telefono") {
        const regex = /^[0-9+ ]*$/;
        if (!regex.test(value)) {
          setErrors((prev) => ({
            ...prev,
            telefono: "Solo se permiten números y signo +"
          }));
        } else {
          setErrors((prev) => ({ ...prev, telefono: "" }));
        }
      }

      if (name === "direccion") {
        if (value.length > limiteDireccion) return;
        setErrors((prev) => ({ ...prev, direccion: "" }));
      }

      if (name === "rut") {
        if (value.trim() === "") {
          setErrors((prev) => ({ ...prev, rut: "" }));
        } else if (!validarRut(value)) {
          setErrors((prev) => ({
            ...prev,
            rut: "RUT inválido. Ej: 12.345.678-9"
          }));
        } else {
          setErrors((prev) => ({ ...prev, rut: "" }));
        }
      }

      setForm({ ...form, [name]: value });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if (errors.rut || errors.telefono || errors.direccion) return;
      onSave(form);
    };

    return (
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "32px",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          border: "2px solid #e5e7eb",
          maxWidth: "500px",
          width: "90vw",
          position: "relative"
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "28px",
            paddingBottom: "20px",
            borderBottom: "2px solid #f3f4f6"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                background: "linear-gradient(135deg, #1664c1 0%, #1e40af 100%)",
                padding: "12px",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(22, 100, 193, 0.2)"
              }}
            >
              <span style={{ fontSize: "24px" }}>👤</span>
            </div>
            <h2
              style={{
                margin: 0,
                fontSize: "22px",
                fontWeight: "700",
                color: "#1f2937"
              }}
            >
              {beneficiario ? "Editar Beneficiario" : "Nuevo Beneficiario"}
            </h2>
          </div>

          <button
            onClick={onCancel}
            title="Cerrar"
            style={{
              background: "transparent",
              border: "none",
              fontSize: "24px",
              color: "#9ca3af",
              cursor: "pointer",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "8px"
            }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Nombre Completo */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "8px",
                color: "#374151",
                fontSize: "13px",
                fontWeight: "700"
              }}
            >
              <span style={{ fontSize: "16px" }}>👤</span>
              Nombre Completo *
            </label>

            <input
              type="text"
              name="nombreCompleto"
              value={form.nombreCompleto}
              onChange={handleChange}
              required
              placeholder="Ingrese el nombre completo"
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "2px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "15px"
              }}
            />
          </div>

          {/* RUT con validación */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "8px",
                color: "#374151",
                fontSize: "13px",
                fontWeight: "700"
              }}
            >
              <span style={{ fontSize: "16px" }}>🆔</span>
              RUT
            </label>

            <input
              type="text"
              name="rut"
              value={form.rut}
              onChange={handleChange}
              placeholder="12.345.678-9"
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "2px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "15px"
              }}
            />

            {errors.rut && (
              <p style={{ color: "red", fontSize: "13px", marginTop: 4 }}>
                {errors.rut}
              </p>
            )}
          </div>

          {/* Teléfono */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "8px",
                color: "#374151",
                fontSize: "13px",
                fontWeight: "700"
              }}
            >
              <span style={{ fontSize: "16px" }}>📞</span>
              Teléfono
            </label>

            <input
              type="tel"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              placeholder="+56 9 1234 5678"
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "2px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "15px"
              }}
            />

            {errors.telefono && (
              <p style={{ color: "red", fontSize: "13px", marginTop: 4 }}>
                {errors.telefono}
              </p>
            )}
          </div>

          {/* Dirección con contador */}
          <div style={{ marginBottom: "28px" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "8px",
                color: "#374151",
                fontSize: "13px",
                fontWeight: "700"
              }}
            >
              <span style={{ fontSize: "16px" }}>📍</span>
              Dirección
            </label>

            <input
              type="text"
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              placeholder="Calle, número, comuna"
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "2px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "15px"
              }}
            />

            <div
              style={{
                fontSize: "12px",
                color: "#6b7280",
                marginTop: 4,
                textAlign: "right"
              }}
            >
              {form.direccion.length}/{limiteDireccion}
            </div>
          </div>

          {/* Botones */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              paddingTop: "20px",
              borderTop: "2px solid #f3f4f6",
              justifyContent: "flex-end"
            }}
          >
            <button
              type="button"
              onClick={onCancel}
              style={{
                padding: "12px 24px",
                background: "#f3f4f6",
                color: "#374151",
                border: "2px solid #e5e7eb",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "15px",
                fontWeight: "600"
              }}
            >
              ✕ Cancelar
            </button>

            <button
              type="submit"
              style={{
                padding: "12px 24px",
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                color: "white",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "15px",
                fontWeight: "600"
              }}
            >
              💾 {beneficiario ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    );
  }
  
  if (loading) {
    return (
      <Layout title="Cargando programa...">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          background: '#f8fafc',
          borderRadius: '12px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #1664c1',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '16px'
          }}></div>
          <p style={{ color: '#6b7280', fontSize: '16px' }}>Cargando programa...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Error">
        <div style={{
          textAlign: 'center',
          padding: '60px 40px',
          background: '#fef2f2',
          borderRadius: '12px',
          border: '1px solid #fecaca'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚠️</div>
          <h3 style={{ color: '#dc2626', marginBottom: '16px' }}>{error}</h3>
          <button 
            onClick={() => navigate(-1)} 
            className="btn-export"
            title="Volver a la página anterior"
            style={{ 
              background: '#dc2626',
              padding: '12px',
              fontSize: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '48px',
              height: '48px'
            }}
          >
            ←
          </button>
        </div>
      </Layout>
    );
  }

  if (!programa) {
    return (
      <Layout title="Dashboard">
        <div style={{
          textAlign: 'center',
          padding: '60px 40px',
          background: '#fef2f2',
          borderRadius: '12px'
        }}>
          <h3 style={{ color: '#dc2626' }}>Programa no encontrado</h3>
        </div>
      </Layout>
    );
  }

  const estadoStyle = getEstadoBadgeStyle(programa.estado);

  return (
    <Layout title={`${programa.nombrePrograma}`}>
      <div className="dashboard-container" style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1664c1 0%, #1e40af 100%)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          color: 'white',
          boxShadow: '0 10px 25px -5px rgba(22, 100, 193, 0.3)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decoración de fondo */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '200px',
            height: '200px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            filter: 'blur(40px)'
          }}></div>
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  padding: '16px',
                  borderRadius: '12px',
                  fontSize: '32px'
                }}>
                  📊
                </div>
                <div>
                  <h1 style={{
                    margin: '0 0 8px 0',
                    fontSize: '32px',
                    fontWeight: '700',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                  }}>
                    {programa.nombrePrograma}
                  </h1>
                  <span style={{
                    display: 'inline-block',
                    padding: '6px 16px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '600',
                    background: estadoStyle.bg,
                    color: estadoStyle.color,
                    border: `2px solid ${estadoStyle.border}`
                  }}>
                    {programa.estado || 'Activo'}
                  </span>
                </div>
              </div>
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginTop: '24px'
            }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '4px' }}>
                  👤 Encargado
                </div>
                <div style={{ fontSize: '16px', fontWeight: '600' }}>
                  {programa.usuario?.nombreUsuario || "Sin asignar"}
                </div>
              </div>
              
              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '4px' }}>
                  🏢 Oficina Responsable
                </div>
                <div style={{ fontSize: '16px', fontWeight: '600' }}>
                  {programa.oficinaResponsable || "—"}
                </div>
              </div>
              
              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '4px' }}>
                  📝 Total Actividades
                </div>
                <div style={{ fontSize: '24px', fontWeight: '700' }}>
                  {actividades.length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Editar información del programa */}
        <div style={{ marginBottom: '32px' }}>
          <EditarProgramaInfo programa={programa} onSave={handleUpdatePrograma} />
        </div>

        {/* Sección de gráficos*/}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '32px',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '24px' }}>📈</span>
              <h2 style={{
                margin: 0,
                fontSize: '24px',
                fontWeight: '700',
                color: '#1f2937'
              }}>
                Resumen del Programa
              </h2>
            </div>
            <button
              className="btn-export"
              onClick={() => setShowPresupuesto(!showPresupuesto)}
              title={showPresupuesto ? 'Cerrar formulario de presupuesto' : 'Ingresar presupuesto'}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px',
                fontSize: '20px',
                width: '48px',
                height: '48px',
                borderRadius: '12px'
              }}
            >
              {showPresupuesto ? '✕' : '💰'}
            </button>
          </div>
          <div style={{
              marginTop: "40px",
              background: "white",
              padding: "24px",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
              marginBottom: "40px"
          }}>
              <h3 style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#1f2937",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px"
              }}>
                  📄 Historial de Ingresos de Presupuesto
              </h3>

              {presupuestosLista.length === 0 ? (
                  <p style={{ color: "#6b7280", textAlign: "center", padding: "20px" }}>
                      Aún no existen ingresos registrados para este programa.
                  </p>
              ) : (
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                          <tr style={{ background: "#f3f4f6" }}>
                              <th style={{ padding: "12px", borderBottom: "2px solid #e5e7eb", textAlign: "left" }}>
                                  Origen
                              </th>
                              <th style={{ padding: "12px", borderBottom: "2px solid #e5e7eb", textAlign: "center" }}>
                                  Fecha
                              </th>
                              <th style={{ padding: "12px", borderBottom: "2px solid #e5e7eb", textAlign: "right" }}>
                                  Monto
                              </th>
                          </tr>
                      </thead>
                      <tbody>
                          {presupuestosLista.map((p, i) => (
                              <tr key={i} style={{ borderBottom: "1px solid #f3f4f6" }}>
                                  <td style={{ padding: "12px" }}>{p.fuentePresupuesto}</td>
                                  <td style={{ padding: "12px", textAlign: "center" }}>
                                    {p.fechaRegistro
                                      ? p.fechaRegistro.slice(0, 10).split("-").reverse().join("-")
                                      : "—"}
                                  </td>
                                  <td style={{ padding: "12px", textAlign: "right", fontWeight: "600" }}>
                                      ${Number(p.montoAsignado).toLocaleString("es-CL")}
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              )}
          </div>


          {showPresupuesto && (
            <div style={{
              marginBottom: '32px',
              padding: '24px',
              background: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e5e7eb'
            }}>
              <IngresoPresupuesto
                onAdd={handleAddPresupuesto}
                idPrograma={programa.idPrograma}
                onCancel={() => setShowPresupuesto(false)}
              />
            </div>
          )}

          {/* Grid de gráficos */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '32px',
            marginBottom: '32px'
          }}>
            <div style={{
              background: '#f0fdf4',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid #bbf7d0',
              textAlign: 'center'
            }}>
              <h3 style={{
                margin: '0 0 20px 0',
                fontSize: '18px',
                fontWeight: '700',
                color: '#166534',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}>
                <span>⏱️</span> Progreso Temporal
              </h3>
              <GraficoProgreso programa={programa} />
            </div>

            <div style={{
              background: '#eff6ff',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid #bfdbfe',
              textAlign: 'center'
            }}>
              <h3 style={{
                margin: '0 0 20px 0',
                fontSize: '18px',
                fontWeight: '700',
                color: '#1e40af',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}>
                <span>💰</span> Presupuesto
              </h3>
              <PresupuestoChart
                asignado={presupuesto.asignado}
                ejecutado={sumaMontosActividades}
              />
            </div>
          </div>

          {/* Gráfico de gastos mensuales */}
          <div style={{
            background: '#fef3c7',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #fde68a'
          }}>
            <h3 style={{
              margin: '0 0 20px 0',
              fontSize: '18px',
              fontWeight: '700',
              color: '#92400e',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              <span>📊</span> Gastos Mensuales
            </h3>
            {gastosMensuales.length > 0 ? (
              <GraficoGastosMensuales datos={gastosMensuales} />
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                color: '#92400e',
                fontSize: '15px'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📉</div>
                No hay datos de gastos disponibles
              </div>
            )}
          </div>
        </div>

        {/* Sección de actividades mejorada */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '24px' }}>📝</span>
              <h2 style={{
                margin: 0,
                fontSize: '24px',
                fontWeight: '700',
                color: '#1f2937'
              }}>
                Actividades del Programa
              </h2>
              <span style={{
                background: '#f3f4f6',
                color: '#374151',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                {actividades.length}
              </span>
            </div>
            <button
              className="btn-export"
              onClick={() => setShowCrearActividad(!showCrearActividad)}
              title={showCrearActividad ? 'Cancelar creación de actividad' : 'Agregar actividad'}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px',
                fontSize: '20px',
                width: '48px',
                height: '48px',
                borderRadius: '12px'
              }}
            >
              {showCrearActividad ? '✕' : '➕'}
            </button>
          </div>

          {showCrearActividad && (
            <div style={{
              marginBottom: '24px',
              padding: '24px',
              background: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e5e7eb'
            }}>
              <CrearActividad
                onAdd={handleAddActividad}
                idPrograma={programa.idPrograma}
                fechaInicioPrograma={programa.fechaInicio}
                fechaFinPrograma={programa.fechaFin || programa.fechaTermino}
                onCancel={() => setShowCrearActividad(false)}
              />
            </div>
          )}

          {actividades.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 40px',
              background: '#f9fafb',
              borderRadius: '12px',
              border: '2px dashed #d1d5db'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
              <h3 style={{
                color: '#6b7280',
                marginBottom: '8px',
                fontSize: '18px',
                fontWeight: '600'
              }}>
                No hay actividades registradas
              </h3>
              <p style={{ color: '#9ca3af', margin: 0 }}>
                Comienza agregando una nueva actividad para este programa.
              </p>
            </div>
          ) : (
            <div style={{
              overflowX: 'auto',
              borderRadius: '12px',
              border: '1px solid #e5e7eb'
            }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                background: '#fff'
              }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    <th style={{
                      padding: '16px',
                      textAlign: 'left',
                      fontWeight: '700',
                      color: '#374151',
                      fontSize: '14px',
                      borderBottom: '2px solid #e5e7eb'
                    }}>
                      Nombre
                    </th>
                    <th style={{
                      padding: '16px',
                      textAlign: 'center',
                      fontWeight: '700',
                      color: '#374151',
                      fontSize: '14px',
                      borderBottom: '2px solid #e5e7eb'
                    }}>
                      Fecha de Inicio
                    </th>
                    <th style={{
                      padding: '16px',
                      textAlign: 'right',
                      fontWeight: '700',
                      color: '#374151',
                      fontSize: '14px',
                      borderBottom: '2px solid #e5e7eb'
                    }}>
                      Monto Asignado
                    </th>
                    <th style={{
                      padding: '16px',
                      textAlign: 'center',
                      fontWeight: '700',
                      color: '#374151',
                      fontSize: '14px',
                      borderBottom: '2px solid #e5e7eb',
                      minWidth: '150px'
                    }}>
                      Progreso Temporal
                    </th>
                    <th style={{
                      padding: '16px',
                      textAlign: 'center',
                      fontWeight: '700',
                      color: '#374151',
                      fontSize: '14px',
                      borderBottom: '2px solid #e5e7eb'
                    }}>
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {actividades.map((act, index) => {
                    const progreso = getActividadProgreso(act);
                    return (
                      <tr
                        key={act.idActividad}
                        style={{
                          borderBottom: '1px solid #f3f4f6',
                          transition: 'background-color 0.2s ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <td style={{
                          padding: '16px',
                          color: '#1f2937',
                          fontSize: '15px',
                          fontWeight: '500'
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            <span style={{
                              background: '#eff6ff',
                              color: '#1d4ed8',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: '600'
                            }}>
                              #{index + 1}
                            </span>
                            {act.nombreActividad}
                          </div>
                        </td>
                        <td style={{
                          padding: '16px',
                          textAlign: 'center',
                          color: '#6b7280',
                          fontSize: '14px'
                        }}>
                          {act.fechaInicio ? (
                            <div style={{
                              display: 'inline-block',
                              background: '#f0f9ff',
                              color: '#0369a1',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              fontSize: '13px',
                              fontWeight: '600'
                            }}>
                              <p>{act.fechaInicio.split("-").reverse().join("-")}</p>
                            </div>
                          ) : '—'}
                        </td>
                        <td style={{
                          padding: '16px',
                          textAlign: 'right',
                          color: '#1f2937',
                          fontSize: '15px',
                          fontWeight: '600'
                        }}>
                          ${parseFloat(act.montoAsignado || 0).toLocaleString("es-CL")}
                        </td>
                        <td style={{ padding: '16px' }}>
                          <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            <div style={{
                              width: '100%',
                              maxWidth: '120px',
                              background: '#e5e7eb',
                              borderRadius: '999px',
                              height: '8px',
                              overflow: 'hidden',
                              position: 'relative'
                            }}>
                              <div style={{
                                width: `${progreso}%`,
                                background: progreso < 33 ? '#ef4444' : progreso < 66 ? '#f59e0b' : '#10b981',
                                height: '100%',
                                borderRadius: '999px',
                                transition: 'width 0.3s ease'
                              }}></div>
                            </div>
                            <span style={{
                              fontSize: '13px',
                              fontWeight: '600',
                              color: progreso < 33 ? '#ef4444' : progreso < 66 ? '#f59e0b' : '#10b981'
                            }}>
                              {progreso}%
                            </span>
                          </div>
                        </td>
                        <td style={{
                          padding: '16px',
                          textAlign: 'center'
                        }}>
                          <button
                            className="btn-small"
                            onClick={() => navigate(`/actividad-dashboard/${act.idActividad}`)}
                            title="Ver detalle de la actividad"
                            style={{
                              padding: '10px',
                              fontSize: '18px',
                              fontWeight: '600',
                              background: '#1664c1',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '40px',
                              height: '40px'
                            }}
                            onMouseOver={(e) => {
                              e.target.style.background = '#1e40af';
                              e.target.style.transform = 'translateY(-1px)';
                            }}
                            onMouseOut={(e) => {
                              e.target.style.background = '#1664c1';
                              e.target.style.transform = 'translateY(0)';
                            }}
                          >
                            👁️
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Beneficiarios del programa */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '32px',
          marginTop: '32px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.07)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px"
          }}>
            <h2 style={{fontSize: 22, fontWeight: 700, color: "#1f2937"}}>Beneficiarios del Programa</h2>
            <button
              className="btn-export"
              onClick={() => { setShowBeneficiarioForm(true); setEditarBeneficiario(null); }}
              title="Ingresar nuevo beneficiario"
              style={{
                padding: '12px',
                fontSize: '20px',
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              👤➕
            </button>
          </div>
          {beneficiarios.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '40px', color: '#6b7280', fontSize: '15px'
            }}>
              <div style={{ fontSize: '42px', marginBottom: '14px' }}>👤</div>
              Aún no hay beneficiarios registrados para este programa.
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", background: "#fff", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{padding: 12, borderBottom: '2px solid #e5e7eb'}}>Nombre</th>
                    <th style={{padding: 12, borderBottom: '2px solid #e5e7eb'}}>RUT</th>
                    <th style={{padding: 12, borderBottom: '2px solid #e5e7eb'}}>Teléfono</th>
                    <th style={{padding: 12, borderBottom: '2px solid #e5e7eb'}}>Dirección</th>
                    <th style={{padding: 12, borderBottom: '2px solid #e5e7eb'}}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {beneficiarios.map(b => (
                    <tr key={b.idBeneficiario} style={{borderBottom: '1px solid #e5e7eb'}}>
                      <td style={{padding: 12}}>{b.nombreCompleto || "—"}</td>
                      <td style={{padding: 12}}>{b.rut || "—"}</td>
                      <td style={{padding: 12}}>{b.telefono || "—"}</td>
                      <td style={{padding: 12}}>{b.direccion || "—"}</td>
                      <td style={{padding: 12, textAlign: "center"}}>
                        <button 
                          className="btn-small" 
                          title="Editar beneficiario"
                          style={{
                            marginRight: 6,
                            padding: '8px',
                            fontSize: '16px',
                            width: '36px',
                            height: '36px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }} 
                          onClick={()=>handleEditBeneficiario(b)}
                        >
                          ✏️
                        </button>
                        <button 
                          className="btn-small" 
                          title="Eliminar beneficiario"
                          onClick={()=>handleDeleteBeneficiario(b.idBeneficiario)} 
                          style={{
                            background: "#e11d48",
                            padding: '8px',
                            fontSize: '16px',
                            width: '36px',
                            height: '36px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {showBeneficiarioForm && (
            <div style={{
              position: "fixed", left: 0, top: 0, width: "100%", height: "100%",
              background: "rgba(0,0,0,0.17)", zIndex: 2000,
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <BeneficiarioForm
                beneficiario={editarBeneficiario}
                onSave={handleAddOrUpdateBeneficiario}
                onCancel={() => { setShowBeneficiarioForm(false); setEditarBeneficiario(null); }}
              />
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .dashboard-container > div:first-child {
            padding: 24px 20px !important;
          }
          
          .dashboard-container h1 {
            font-size: 24px !important;
          }
        }
      `}</style>
    </Layout>
  );
}

export default ProgramaDashboard;