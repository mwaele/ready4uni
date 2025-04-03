import React from "react";
import { teams } from "../data";

const Teams = () => {
  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section title */}
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Our <span className="text-indigo-600">Teams</span>
        </h1>
        {/* Section subtitle */}
        <h3 className="text-lg text-gray-600 text-center mt-2">
          Meet our diverse team of creative minds, developers, and strategists —
          the driving force behind every project's success.
        </h3>
      </div>

      {/* Loop through the teams data and display each team member */}
      {teams.map((team, i) => (
        <div
          key={i} // Unique key for React rendering
          className="bg-white rounded-lg shadow-md overflow-hidden p-6 flex flex-col items-center"
        >
          {/* Profile image container */}
          <div className="w-32 h-32 overflow-hidden rounded-full">
            <img
              src={team.profile}
              alt={team.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Team member details */}
          <div className="mt-4 text-center">
            <h3 className="text-lg font-semibold text-gray-800">{team.name}</h3>
            <p className="text-gray-500">{team.title}</p>
          </div>

          {/* Social media icons */}
          <div className="flex items-center justify-center gap-4 mt-3">
            {team.social.map((item, index) => (
              <a
                href={item.url || "#"} // Default link if no URL is provided
                target="_blank"
                // noopener Prevents the newly opened tab from gaining access to the window.opener object. noreferrer Prevents the browser from sending the Referer header when navigating to the new page.
                rel="noopener noreferrer"
                key={index} // Unique key for React rendering
                className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition duration-300"
              >
                {item.icon}
              </a>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};

export default Teams;
