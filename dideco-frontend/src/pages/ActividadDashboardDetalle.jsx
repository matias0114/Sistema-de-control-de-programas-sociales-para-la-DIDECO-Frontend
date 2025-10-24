import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AvanceTemporalDonut from "./AvanceTemporalDonut";
import AgregarAvance from "./AgregarAvance";

function ActividadDashboardDetalle() {
  const { idActividad } = useParams();
  const [actividad, setActividad] = useState(null);
  const [avances, setAvances] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showEditarModal, setShowEditarModal] = useState(false);
  const [showAgregarAvance, setShowAgregarAvance] = useState(false);
  const [avanceToEdit, setAvanceToEdit] = useState(null);

  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const navigate = useNavigate();

  // Cargar datos
  useEffect(() => {
    async function fetchDatos() {
      setLoading(true);
      try {
        const resAct = await fetch(`http://localhost:8080/actividades`);
        const acts = await resAct.json();
        const actData = acts.find((a) => a.idActividad == idActividad);
        setActividad(actData || null);

        const resAv = await fetch(`http://localhost:8080/avances`);
        const avs = await resAv.json();
        setAvances(
          avs.filter(
            (av) =>
              av.idActividad == idActividad ||
              av.actividad?.idActividad == idActividad
          )
        );
      } catch (err) {
        console.error("Error al cargar datos:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDatos();
  }, [idActividad]);

  // Guardar cambios en actividad
  async function handleSaveActividad(e) {
    e.preventDefault();
    try {
      await fetch(`http://localhost:8080/actividades/${idActividad}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(actividad),
      });
      setShowEditarModal(false);
      const res = await fetch(`http://localhost:8080/actividades`);
      const acts = await res.json();
      const actData = acts.find((a) => a.idActividad == idActividad);
      setActividad(actData);
    } catch (err) {
      console.error("Error al actualizar actividad", err);
    }
  }

  // Agregar o editar avance
  async function handleAddEditarAvance(payload) {
    try {
      if (payload.idAvance) {
        // EDITAR AVANCE EXISTENTE
        await fetch(`http://localhost:8080/avances/${payload.idAvance}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...payload,
            actividad: { idActividad: Number(idActividad) },
            usuario: usuario ? { idUsuario: usuario.idUsuario } : undefined,
          }),
        });
        setAvanceToEdit(null);
      } else {
        // CREAR NUEVO AVANCE
        await fetch(`http://localhost:8080/avances`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...payload,
            actividad: { idActividad: Number(idActividad) },
            usuario: usuario ? { idUsuario: usuario.idUsuario } : undefined,
          }),
        });
        setShowAgregarAvance(false);
      }

      // Recargar avances
      const resAv = await fetch(`http://localhost:8080/avances`);
      const avs = await resAv.json();
      setAvances(
        avs.filter(
          (av) =>
            av.idActividad == idActividad ||
            av.actividad?.idActividad == idActividad
        )
      );
    } catch (err) {
      console.error("Error al guardar avance", err);
    }
  }

  if (loading) return <p style={{ padding: 30 }}>Cargando...</p>;
  if (!actividad)
    return (
      <div style={{ padding: 30 }}>
        No se encontró la actividad{" "}
        <button onClick={() => navigate(-1)}>Volver</button>
      </div>
    );

  return (
    <div
      style={{
        maxWidth: 1100,
        margin: "40px auto",
        background: "#f7fbfd",
        borderRadius: 12,
        padding: "32px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <button onClick={() => navigate(-1)} className="btn-volver-header">
        ← Volver
      </button>

      {/* Encabezado */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <h1 style={{ color: "#136fb1", margin: 0 }}>
          {actividad.nombreActividad}
        </h1>
        <button className="btn-small" onClick={() => setShowEditarModal(true)}>
          Editar actividad
        </button>
      </div>

      {/* Información principal */}
      <div
        style={{
          display: "flex",
          gap: 45,
          alignItems: "flex-start",
          marginTop: 15,
        }}
      >
        <div style={{ flex: 2 }}>
          <p>
            <b>Descripción:</b> {actividad.descripcion || "Sin descripción"}
          </p>
          <p>
            <b>Responsable:</b> {actividad.responsable || "—"}
          </p>
          <p>
            <b>Monto asignado:</b>{" "}
            {actividad.montoAsignado
              ? `$${parseFloat(actividad.montoAsignado).toLocaleString("es-CL")}`
              : "—"}
          </p>
          <p>
            <b>Metas:</b> {actividad.metas || "—"}
          </p>
          <p>
            <b>Fecha inicio:</b> {actividad.fechaInicio || "—"}
          </p>
          <p>
            <b>Fecha término:</b> {actividad.fechaTermino || "—"}
          </p>
        </div>
        <div
          style={{
            flex: 1,
            background: "#eaf3fa",
            borderRadius: 10,
            padding: 15,
          }}
        >
          <AvanceTemporalDonut
            fechaInicio={actividad.fechaInicio}
            fechaTermino={actividad.fechaTermino}
          />
        </div>
      </div>

      {/* Modal editar actividad */}
      {showEditarModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: "30px",
              width: "90%",
              maxWidth: 500,
              boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
            }}
          >
            <h2 style={{ color: "#136fb1" }}>Editar actividad</h2>
            <form onSubmit={handleSaveActividad}>
              <label>
                Nombre:
                <br />
                <input
                  name="nombreActividad"
                  value={actividad.nombreActividad}
                  onChange={(e) =>
                    setActividad({
                      ...actividad,
                      nombreActividad: e.target.value,
                    })
                  }
                />
              </label>
              <label>
                Descripción:
                <br />
                <textarea
                  name="descripcion"
                  value={actividad.descripcion}
                  onChange={(e) =>
                    setActividad({ ...actividad, descripcion: e.target.value })
                  }
                  style={{ width: "100%", height: 60 }}
                />
              </label>
              <label>
                Responsable:
                <br />
                <input
                  name="responsable"
                  value={actividad.responsable || ""}
                  onChange={(e) =>
                    setActividad({ ...actividad, responsable: e.target.value })
                  }
                />
              </label>
              <label>
                Monto asignado:
                <br />
                <input
                  type="number"
                  name="montoAsignado"
                  value={actividad.montoAsignado || ""}
                  onChange={(e) =>
                    setActividad({
                      ...actividad,
                      montoAsignado: e.target.value,
                    })
                  }
                />
              </label>
              <label>
                Metas:
                <br />
                <input
                  name="metas"
                  value={actividad.metas || ""}
                  onChange={(e) =>
                    setActividad({ ...actividad, metas: e.target.value })
                  }
                />
              </label>
              <label>
                Fecha inicio:
                <br />
                <input
                  type="date"
                  value={actividad.fechaInicio || ""}
                  onChange={(e) =>
                    setActividad({
                      ...actividad,
                      fechaInicio: e.target.value,
                    })
                  }
                />
              </label>
              <label>
                Fecha término:
                <br />
                <input
                  type="date"
                  value={actividad.fechaTermino || ""}
                  onChange={(e) =>
                    setActividad({
                      ...actividad,
                      fechaTermino: e.target.value,
                    })
                  }
                />
              </label>

              <div style={{ marginTop: 20, textAlign: "right" }}>
                <button type="submit" className="btn-small">
                  Guardar
                </button>
                <button
                  type="button"
                  className="btn-small"
                  style={{ marginLeft: 10, background: "#ccc" }}
                  onClick={() => setShowEditarModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Avances */}
      <div style={{ marginTop: 30 }}>
        <h2>Avances</h2>
        {avances.length === 0 ? (
          <>
            <p style={{ color: "#777" }}>Sin avances registrados.</p>
            <button
              className="btn-small"
              style={{ marginTop: 10 }}
              onClick={() => {
                setAvanceToEdit(null);
                setShowAgregarAvance(true);
              }}
            >
              Agregar avance
            </button>
          </>
        ) : (
          <>
            <table
              style={{
                width: "100%",
                background: "#fff",
                borderRadius: 8,
                boxShadow: "0 1px 8px rgba(0,0,0,0.1)",
              }}
            >
              <thead>
                <tr style={{ background: "#e9f2fb" }}>
                  <th>#</th>
                  <th>Descripción</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Objetivos</th>
                  <th>Editar</th>
                </tr>
              </thead>
              <tbody>
                {avances.map((av, i) => (
                  <tr key={av.idAvance || av.descripcion + i}>
                    <td>{i + 1}</td>
                    <td>{av.descripcion}</td>
                    <td>
                      {av.fechaAvance
                        ? new Date(av.fechaAvance).toLocaleDateString("es-CL")
                        : "—"}
                    </td>
                    <td>{av.estado || "—"}</td>
                    <td>{av.objetivosAlcanzados || "—"}</td>
                    <td>
                      <button
                        className="btn-small"
                        onClick={() => {
                          setShowAgregarAvance(false);
                          setAvanceToEdit(av);
                        }}
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {!showAgregarAvance && !avanceToEdit && (
              <button
                className="btn-small"
                style={{ marginTop: 10 }}
                onClick={() => {
                  setAvanceToEdit(null);
                  setShowAgregarAvance(true);
                }}
              >
                Agregar avance
              </button>
            )}
          </>
        )}

        {/* Modal agregar avance */}
        {showAgregarAvance && !avanceToEdit && (
          <div style={{ marginTop: 18 }}>
            <AgregarAvance
              avance={null}
              idUsuario={usuario?.idUsuario}
              idActividad={actividad.idActividad}
              onAdd={handleAddEditarAvance}
              onCancel={() => setShowAgregarAvance(false)}
              modoEdicion={false}
            />
          </div>
        )}

        {/* Modal editar avance */}
        {avanceToEdit && (
          <div style={{ marginTop: 18 }}>
            <AgregarAvance
              avance={avanceToEdit}
              idUsuario={usuario?.idUsuario}
              idActividad={actividad.idActividad}
              onAdd={handleAddEditarAvance}
              onCancel={() => setAvanceToEdit(null)}
              modoEdicion={true}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ActividadDashboardDetalle;