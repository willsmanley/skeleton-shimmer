import { useEffect, useRef, useState } from 'react';
import { Box, Flex, Image, Masonry } from 'gestalt';

// Generate skeleton pins
const skeletonPins = [...new Array(3)].map(() => [
  { id: 1, height: 316, width: 474 },
  { id: 2, height: 1081, width: 474 },
  { id: 3, height: 711, width: 474 },
  { id: 4, height: 632, width: 474 },
  { id: 5, height: 710, width: 474 },
]).flat();

// Function to get pins
function getPins() {
  const pins = [
    {
      color: '#2b3938',
      height: 316,
      src: 'https://i.ibb.co/sQzHcFY/stock9.jpg',
      width: 474,
      name: 'the Hang Son Doong cave in Vietnam',
    },
    {
      color: '#8e7439',
      height: 1081,
      src: 'https://i.ibb.co/zNDxPtn/stock10.jpg',
      width: 474,
      name: 'La Gran Muralla, Pekín, China',
    },
    {
      color: '#698157',
      height: 711,
      src: 'https://i.ibb.co/M5TdMNq/stock11.jpg',
      width: 474,
      name: 'Plitvice Lakes National Park, Croatia',
    },
    {
      color: '#4e5d50',
      height: 632,
      src: 'https://i.ibb.co/r0NZKrk/stock12.jpg',
      width: 474,
      name: 'Ban Gioc – Detian Falls : 2 waterfalls straddling the Vietnamese and Chinese border.',
    },
    {
      color: '#6d6368',
      height: 710,
      src: 'https://i.ibb.co/zmFd0Dv/stock13.jpg',
      width: 474,
      name: 'Border of China and Vietnam',
    },
  ];

  const pinList = [...new Array(3)].map(() => [...pins]).flat();
  return Promise.resolve(pinList);
}

// Component to display a single pin
function GridComponent({ data }) {
  return (
    <Flex direction="column">
      <Image
        alt={data.name}
        color={data.color}
        naturalHeight={data.height}
        naturalWidth={data.width}
        src={data.src}
      />
    </Flex>
  );
}

// Component to display a skeleton pin
function SkeletonPin({ height, width }) {
  const skeletonRef = useRef();
  const [delay, setDelay] = useState(0);

  useEffect(() => {
    const calculateDelay = () => {
      if (skeletonRef.current) {
        const rect = skeletonRef.current.getBoundingClientRect();
        const delayInSeconds = (rect.left + rect.top) / 100;
        setDelay(delayInSeconds);
      }
    };

    calculateDelay();
    window.addEventListener('resize', calculateDelay);

    return () => {
      window.removeEventListener('resize', calculateDelay);
    };
  }, []);

  return (
    <div
      ref={skeletonRef}
      style={{
        animationDelay: `${delay}s`,
        animationDuration: `${width / 100}s`,
      }}
      id="skeleton"
      className="skeleton"
    >
      <Box width={width} height={height} color="lightGray" />
    </div>
  );
}

// Main component
export default function Example() {
  const [pins, setPins] = useState(skeletonPins);
  const scrollContainerRef = useRef();
  const gridRef = useRef();

  useEffect(() => {
    setTimeout(() => {
      // getPins().then(setPins);
    }, 1000);
  }, []);

  return (
    <div ref={scrollContainerRef} style={{ overflowY: 'scroll', height: '100vh' }}>
      <Masonry
        ref={(ref) => {
          gridRef.current = ref;
        }}
        columnWidth={170}
        gutterWidth={20}
        items={pins}
        layout="basicCentered"
        renderItem={({ data }) => {
          return data.src ? (
            <GridComponent data={data} />
          ) : (
            <SkeletonPin height={data.height} width={data.width} />
          );
        }}
        scrollContainer={() => scrollContainerRef.current}
      />
    </div>
  );
}
