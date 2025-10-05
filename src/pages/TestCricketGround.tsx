import React from 'react';
import CricketField from '../components/ui/CricketField';

const TestCricketGround: React.FC = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CricketField width={1100} height={820} />
    </div>
  );
};

export default TestCricketGround;
