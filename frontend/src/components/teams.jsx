import React from 'react'
import { teams } from '../data';
const Teams = () => {
  return (
    <section  className="py-16 bg-gray-100">
    <div className="max-w-6xl mx-auto px-6">
      <h1 className="text-3xl font-bold text-center text-gray-800">
        Our <span className="text-indigo-600">Teams</span>
      </h1>
      <h3 className="text-lg text-gray-600 text-center mt-2">
        Meet our diverse team of creative minds, developers, and strategists — 
        the driving force behind every project's success.
      </h3>
    </div>
    {teams.map((team, i) => (
  
    <div className="bg-white rounded-lg shadow-md overflow-hidden p-6 flex flex-col items-center">
      <div className="w-32 h-32 overflow-hidden rounded-full">
        <img
          src={team.profile}
          alt={team.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="mt-4 text-center">
        <h3 className="text-lg font-semibold text-gray-800">{team.name}</h3>
        <p className="text-gray-500">{team.title}</p>
      </div>
    </div>
  
))}

  </section>
);
  
}

export default Teams