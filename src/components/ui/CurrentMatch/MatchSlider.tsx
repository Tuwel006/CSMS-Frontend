// src/components/MatchSlider.tsx
import React from 'react';
import Slider from 'react-slick';
import { useCurrentMatchContext } from '@/context/CurrentMatchContext';
import MatchCard from '../../ui/card/CurrentMatchCard';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const MatchSlider: React.FC = () => {
  const { matches } = useCurrentMatchContext();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="p-5">
      <Slider {...settings}>
        {matches.map(match => (
          <MatchCard key={match.id} match={match} />
        ))}
      </Slider>
    </div>
  );
};

export default MatchSlider;
