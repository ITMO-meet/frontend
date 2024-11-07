import React, { useState } from 'react';
import "../../styles/examples.css"
import FeedPage from '../pages/FeedPage';

const people = [
  {
    id: 1,
    name: 'Jane Smith1',
    description: 'Product Designer',
    imageUrl: 'https://steamuserimages-a.akamaihd.net/ugc/1844789643806854188/FB581EAD503907F56A009F85371F6FB09A467FEC/?imw=512&imh=497&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true',
  },
  {
    id: 2,
    name: 'Jane Smith2',
    description: 'Product Designer',
    imageUrl: 'https://i.pinimg.com/736x/56/21/7b/56217b1ef6a69a2583ff13655d48bc53.jpg',
  },
  {
    id: 3,
    name: 'Jane Smith3',
    description: 'Product Designer',
    imageUrl: 'https://avatars.yandex.net/get-music-content/5878680/7bee58da.a.25445174-1/m1000x1000?webp=false',
  },
];

function FeedExample() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const getNext = () => {
    setCurrentIndex((prev) => (prev + 1) % people.length);
    return people[currentIndex];
  }
  return (
    <div className='examples'>
      <FeedPage getNextPerson={getNext} onLike={console.log} onDislike={console.log} onSuperLike={console.log} />
    </div>
  )
}

export default FeedExample;