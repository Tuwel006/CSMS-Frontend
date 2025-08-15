// src/pages/Home.jsx
import React from 'react';
import ScoreCard from '../components/ui/ScoreCard';
// import axios from 'axios';

const logos = {
  india: 'https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg',
  australia: 'https://upload.wikimedia.org/wikipedia/en/b/b9/Flag_of_Australia.svg',
  pakistan: 'https://upload.wikimedia.org/wikipedia/en/3/32/Flag_of_Pakistan.svg',
  england: 'https://upload.wikimedia.org/wikipedia/en/b/be/Flag_of_England.svg',
  bangladesh: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Flag_of_Bangladesh.svg',
  sriLanka: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Flag_of_Sri_Lanka.svg',
  southAfrica: 'https://upload.wikimedia.org/wikipedia/commons/a/af/Flag_of_South_Africa.svg',
  newZealand: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Flag_of_New_Zealand.svg',
};

const matches = [
  {
    team1: 'India',
    team2: 'Australia',
    logo1: logos.india,
    logo2: logos.australia,
    score1: '285/6 (47.3)',
    score2: 'Yet to bat',
    status: 'India batting',
    statusColor: 'text-blue-500',
    isLive: true
  },
  {
    team1: 'Pakistan',
    team2: 'England',
    logo1: logos.pakistan,
    logo2: logos.england,
    score1: '198/9 (50)',
    score2: '180/10 (48.2)',
    status: 'Pakistan won by 18 runs',
    statusColor: 'text-green-600',
    isLive: false
  },
  {
    team1: 'Bangladesh',
    team2: 'Sri Lanka',
    logo1: logos.bangladesh,
    logo2: logos.sriLanka,
    score1: '150/10 (36)',
    score2: '155/4 (28.4)',
    status: 'Sri Lanka won by 6 wickets',
    statusColor: 'text-green-600',
    isLive: false
  },
  {
    team1: 'South Africa',
    team2: 'New Zealand',
    logo1: logos.southAfrica,
    logo2: logos.newZealand,
    score1: '305/7 (50)',
    score2: '300/9 (50)',
    status: 'South Africa won by 5 runs',
    statusColor: 'text-green-600',
    isLive: false
  },
  {
    team1: 'India',
    team2: 'Pakistan',
    logo1: logos.india,
    logo2: logos.pakistan,
    score1: '320/8 (50)',
    score2: 'Live: 210/4 (35)',
    status: 'Pakistan chasing',
    statusColor: 'text-red-500',
    isLive: true
  },
  {
    team1: 'England',
    team2: 'Australia',
    logo1: logos.england,
    logo2: logos.australia,
    score1: '270/10 (49.1)',
    score2: '272/6 (47.4)',
    status: 'Australia won by 4 wickets',
    statusColor: 'text-green-600',
    isLive: false
  },
  {
    team1: 'Sri Lanka',
    team2: 'New Zealand',
    logo1: logos.sriLanka,
    logo2: logos.newZealand,
    score1: '240/10',
    score2: '240/10',
    status: 'Match tied',
    statusColor: 'text-yellow-500',
    isLive: false
  },
  {
    team1: 'South Africa',
    team2: 'Bangladesh',
    logo1: logos.southAfrica,
    logo2: logos.bangladesh,
    score1: 'Live: 130/2 (25)',
    score2: '',
    status: 'South Africa batting',
    statusColor: 'text-blue-600',
    isLive: true
  }
];

const Home = () => {
    
    return (
    <main className="flex-grow px-4 py-6 max-w-7xl mx-auto">
      <section className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-xl shadow text-gray-900 dark:text-white">
        <h2 className="text-xl font-bold mb-6">Live Matches</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match, index) => (
            <ScoreCard key={index} {...match} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default Home;
