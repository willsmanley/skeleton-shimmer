import { useCallback, useRef, useEffect, useState } from "react";
import { Box, Flex, Image, Masonry } from "gestalt";

const randomPinHeight = () => Math.random() * 200 + 100;

// Generate skeleton pins
const skeletonPins = [...new Array(3)]
  .map(() => [
    { id: 1, height: randomPinHeight(), width: 474 },
    { id: 2, height: randomPinHeight(), width: 474 },
    { id: 3, height: randomPinHeight(), width: 474 },
    { id: 4, height: randomPinHeight(), width: 474 },
    { id: 5, height: randomPinHeight(), width: 474 },
  ])
  .flat()

// Function to get pins
function getPins() {
  const pins = [
    {
      color: "#2b3938",
      height: 316,
      src: "https://i.ibb.co/sQzHcFY/stock9.jpg",
      width: 474,
      name: "the Hang Son Doong cave in Vietnam",
    },
    {
      color: "#8e7439",
      height: 1081,
      src: "https://i.ibb.co/zNDxPtn/stock10.jpg",
      width: 474,
      name: "La Gran Muralla, Pekín, China",
    },
    {
      color: "#698157",
      height: 711,
      src: "https://i.ibb.co/M5TdMNq/stock11.jpg",
      width: 474,
      name: "Plitvice Lakes National Park, Croatia",
    },
    {
      color: "#4e5d50",
      height: 632,
      src: "https://i.ibb.co/r0NZKrk/stock12.jpg",
      width: 474,
      name: "Ban Gioc – Detian Falls : 2 waterfalls straddling the Vietnamese and Chinese border.",
    },
    {
      color: "#6d6368",
      height: 710,
      src: "https://i.ibb.co/zmFd0Dv/stock13.jpg",
      width: 474,
      name: "Border of China and Vietnam",
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
function SkeletonPin({ height }) {
  const refCallback = useCallback((ref) => {
    // rewrite parent to use abs vs transform
    if (ref) {
      const parentEl = ref.parentElement;
      if (parentEl.style.transform) {
        const styles = getComputedStyle(parentEl);
        if (styles.transform) {
          const matrix = new DOMMatrix(styles.transform);
          const { m41: x, m42: y } = matrix;
          parentEl.style.transform = "";
          parentEl.style.top = `${y}px`;
          parentEl.style.left = `${x}px`;
        }
      }
    }
  }, []);
  return (
    <div className="skeleton" ref={refCallback}>
      <Box width="100%" height={height} color="lightGray" />
    </div>
  );
}

// Main component
export default function App() {
  const [pins, setPins] = useState(skeletonPins);
  const scrollContainerRef = useRef();
  const gridRef = useRef();

  useEffect(() => {
    setTimeout(() => {
      getPins().then(setPins);
    }, 2500);
  }, []);

  return (
    <div
      ref={scrollContainerRef}
      style={{ overflowY: "scroll", height: "100vh" }}
    >
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
