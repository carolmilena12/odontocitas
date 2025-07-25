import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../services/firebase-config";
import { FaCalendarAlt, FaUsers, FaTooth } from "react-icons/fa";

const InicioComponent = ({ uidMedico }) => {
  const [citasHoy, setCitasHoy] = useState(0);

  useEffect(() => {
    const fetchCitasHoy = async () => {
      try {
        const citasRef = collection(db, "citas");
        const q = query(citasRef, where("id_medico", "==", uidMedico));
        const snapshot = await getDocs(q);

        const hoy = new Date();
        const hoyStr = hoy.toISOString().split("T")[0]; // "YYYY-MM-DD"

        const citasDeHoy = snapshot.docs.filter(doc => doc.data().fecha === hoyStr);
        setCitasHoy(citasDeHoy.length);
      } catch (error) {
        console.error("Error al obtener citas de hoy:", error);
        setCitasHoy(0);
      }
    };

    if (uidMedico) {
      fetchCitasHoy();
    }
  }, [uidMedico]);

  const stats = [
    { title: 'Citas Hoy', value: citasHoy.toString(), icon: <FaCalendarAlt className="text-pink-500" />, color: 'bg-pink-100' },
    { title: 'Pacientes', value: '84', icon: <FaUsers className="text-rose-500" />, color: 'bg-rose-100' },
    { title: 'Tratamientos', value: '9', icon: <FaTooth className="text-fuchsia-500" />, color: 'bg-fuchsia-100' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className={`${stat.color} p-4 rounded-xl shadow-sm`}>
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-pink-700">{stat.title}</p>
              <p className="text-2xl font-bold text-pink-800">{stat.value}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
              {stat.icon}
            </div>
          </div>
        </div>
      ))}

      <div className="md:col-span-2 lg:col-span-3 bg-white p-4 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-pink-800 mb-4">Citas recientes</h3>
        <div className="h-64 bg-pink-50 rounded-lg flex items-center justify-center text-pink-400">
          <p>{citasHoy > 0 ? "Citas pendientes de hoy" : "Sin citas pendientes hoy"}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-pink-800 mb-4">Tratamientos populares</h3>
        <div className="space-y-3">
          {['Limpieza', 'Blanqueamiento', 'Ortodoncia', 'Carillas'].map((item, i) => (
            <div key={i} className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-pink-100 flex items-center justify-center mr-3">
                <FaTooth className="text-pink-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-pink-800">{item}</p>
                <div className="w-full bg-pink-100 rounded-full h-2 mt-1">
                  <div 
                    className="h-2 rounded-full bg-pink-500" 
                    style={{ width: `${70 - (i * 15)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InicioComponent;

