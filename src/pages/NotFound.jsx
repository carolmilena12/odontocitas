import React from 'react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-pink-50">
      <h1 className="text-6xl font-bold text-pink-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-pink-800 mb-2">Página no encontrada</h2>
      <p className="text-pink-500 mb-6">La URL que ingresaste no existe o no tienes acceso.</p>
      <a href="/" className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg font-semibold">Ir al inicio</a>
    </div>
  );
}
