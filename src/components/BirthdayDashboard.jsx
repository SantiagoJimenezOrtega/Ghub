// BirthdayDashboard.jsx
import React, { useState } from 'react';

function BirthdayDashboard({ students }) {
  const [notifiedId, setNotifiedId] = useState(null);

  const handleNotify = async (studentId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/birthdays/${studentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notified: true }),
      });
      if (response.ok) {
        setNotifiedId(studentId);
      }
    } catch (error) {
      console.error('Error notifying birthday:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">🎂 Cumpleaños Próximos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {students && students.map(student => (
          <div key={student.id} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-purple-800">{student.nickname}</h3>
                <p className="text-sm text-gray-600">{new Date(student.birthdate).toLocaleDateString()}</p>
              </div>
              <button
                onClick={() => handleNotify(student.id)}
                disabled={notifiedId === student.id}
                className={`px-3 py-1 rounded text-white ${notifiedId === student.id ? 'bg-gray-400' : 'bg-purple-600 hover:bg-purple-700'}`}
              >
                {notifiedId === student.id ? 'Notified!' : 'Notify'}
              </button>
            </div>
            {student.photo_url && (
              <div className="mt-2">
                <img src={student.photo_url} alt="profile" className="w-full h-32 object-cover rounded" />
              </div>
            )}
          </div>
        ))}
        {(!students || students.length === 0) && (
          <p className="text-white italic">No hay estudiantes registrados o cargando...</p>
        )}
      </div>
    </div>
  );
}

export default BirthdayDashboard;