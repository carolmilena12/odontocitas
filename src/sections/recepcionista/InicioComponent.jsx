import React from "react";
import { FaCalendarAlt, FaUsers, FaTooth, FaFileInvoiceDollar } from "react-icons/fa";

const InicioComponent = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Tarjetas resumen */}
      {[
        { title: 'Citas Hoy', value: '12', icon: <FaCalendarAlt className="text-pink-500" />, color: 'bg-pink-100' },
        { title: 'Pacientes', value: '84', icon: <FaUsers className="text-rose-500" />, color: 'bg-rose-100' },
        { title: 'Tratamientos', value: '9', icon: <FaTooth className="text-fuchsia-500" />, color: 'bg-fuchsia-100' },
        { title: 'Ingresos', value: '$3,450', icon: <FaFileInvoiceDollar className="text-purple-500" />, color: 'bg-purple-100' },
      ].map((stat, index) => (
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
      
      {/* Gráficos/estadísticas */}
      <div className="md:col-span-2 lg:col-span-3 bg-white p-4 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-pink-800 mb-4">Citas recientes</h3>
        <div className="h-64 bg-pink-50 rounded-lg flex items-center justify-center text-pink-400">
          Gráfico de citas (simulado)
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
