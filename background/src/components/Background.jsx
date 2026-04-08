import { useState, useEffect } from "react";

// ================= BACKGROUND =================
import spring1 from "../assets/backgrounds/spring/spring1.webp";
import spring2 from "../assets/backgrounds/spring/spring2.webp";
import spring3 from "../assets/backgrounds/spring/spring3.webp";

import summer1 from "../assets/backgrounds/summer/summer1.webp";
import summer2 from "../assets/backgrounds/summer/summer2.webp";
import summer3 from "../assets/backgrounds/summer/summer3.webp";

import autumn1 from "../assets/backgrounds/autumn/autumn1.webp";
import autumn2 from "../assets/backgrounds/autumn/autumn2.webp";
import autumn3 from "../assets/backgrounds/autumn/autumn3.webp";

import winter1 from "../assets/backgrounds/winter/winter1.webp";
import winter2 from "../assets/backgrounds/winter/winter2.webp";
import winter3 from "../assets/backgrounds/winter/winter3.webp";

// ================= PARTICLE =================

// 🌸 SPRING
import sakuraFlower from "../assets/particles/spring/sakura-flower.png";
import sakuraPetal1 from "../assets/particles/spring/sakura-petal-1.png";
import leaf1 from "../assets/particles/spring/leaves-1.png";
import leaf2 from "../assets/particles/spring/leaves-2.png";

// 🍂 AUTUMN
import autumnLeaf1 from "../assets/particles/autumn/leaf-1.png";
import autumnLeaf2 from "../assets/particles/autumn/leaf-2.png";
import autumnLeaf3 from "../assets/particles/autumn/leaf-3.png";
import autumnLeaf4 from "../assets/particles/autumn/leaf-4.png";
import autumnLeaf5 from "../assets/particles/autumn/leaf-5.png";
import pinecone1 from "../assets/particles/autumn/pinecone-1.png";
import pinecone2 from "../assets/particles/autumn/pinecone-2.png";

// ❄️ WINTER
import snowflake1 from "../assets/particles/winter/snowflake-1.png";
import snowflake2 from "../assets/particles/winter/snowflake-2.png";

// ================= DATA =================

const images = {
  spring: [spring1, spring2, spring3],
  summer: [summer1, summer2, summer3],
  autumn: [autumn1, autumn2, autumn3],
  winter: [winter1, winter2, winter3],
};

const particleImages = {
  spring: [sakuraFlower, sakuraPetal1, leaf1, leaf2],
  autumn: [
    autumnLeaf1,
    autumnLeaf2,
    autumnLeaf3,
    autumnLeaf4,
    autumnLeaf5,
    pinecone1,
    pinecone2,
  ],
  winter: [snowflake1, snowflake2],
};

// ================= COMPONENT =================

function Background({ season }) {
  const [index, setIndex] = useState(0);
  const [particles, setParticles] = useState([]);

  // đổi background
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images[season].length);
    }, 8000);

    return () => clearInterval(interval);
  }, [season]);

  // reset khi đổi mùa
  useEffect(() => {
    setIndex(0);
    setParticles([]);
  }, [season]);

  // spawn particle
  const spawnParticles = () => {
    const count = Math.floor(Math.random() * 10) + 1;
    const size = Math.random() * 25 + 20;
    const depth = Math.random();

    // 🎯 càng to → rơi chậm hơn
    const duration = 8 + (1 - depth) * 6;

    const newParticles = Array.from({ length: count }).map(() => {
      let img = null;
      let type = "img";

      if (season === "winter") {
        const isSnowflake = Math.random() > 0.5;

        if (isSnowflake) {
          const imgs = particleImages.winter;
          img = imgs[Math.floor(Math.random() * imgs.length)];
        } else {
          type = "dot"; // tuyết tròn
        }
      } else if (season !== "summer" && particleImages[season]) {
        const imgs = particleImages[season];
        img = imgs[Math.floor(Math.random() * imgs.length)];
      }

      return {
        id: Date.now() + Math.random(),
        left: Math.random() * 100,
        size,
        duration,
        delay: Math.random() * 2,
        rotate: Math.random() * 360,
        opacity: Math.random() * 0.5 + 0.5,

        drift: img?.includes("pinecone") ? 0 : Math.random() * 80 - 40,
        wind: Math.random() * 30 - 15,
        depth,

        life: duration * 1000, // 👈 dùng để xoá chuẩn

        img,
        type,
      };
    });

    setParticles((prev) => [...prev, ...newParticles]);

    newParticles.forEach((p) => {
      setTimeout(() => {
        setParticles((prev) => prev.filter((item) => item.id !== p.id));
      }, p.life);
    });
  };

  // loop spawn
  useEffect(() => {
    if (season === "summer") return;

    let isRunning = true;

    const loop = () => {
      if (!isRunning) return;

      spawnParticles();

      const next = Math.random() * 4000 + 1000;
      setTimeout(loop, next);
    };

    loop();

    return () => {
      isRunning = false;
    };
  }, [season]);

  return (
    <>
      {/* BACKGROUND */}
      <div
        className="background"
        style={{
          backgroundImage: `url(${images[season][index]})`,
        }}
      />

      {/* overlay */}
      <div className="overlay" />

      {/* ánh sáng mùa hè */}
      {season === "summer" && <div className="sunlight" />}

      {/* particle */}
      <div className="particle-container">
        {particles.map((p) =>
          p.type === "dot" ? (
            <span
              key={p.id}
              className="particle snow-dot"
              style={{
                left: `${p.left}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                opacity: p.opacity,
                animationDuration: `${p.duration * 1.2}s`,
                animationDelay: `${p.delay}s`,
                zIndex: p.depth > 0.5 ? 2 : 1,
              }}
            />
          ) : (
            <img
              key={p.id}
              src={p.img}
              className="particle"
              style={{
                left: `${p.left}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                opacity: p.opacity,

                transform: `scale(${0.6 + p.depth * 0.6}) rotate(${p.rotate}deg)`,

                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,

                "--drift": `${p.drift}px`,
                "--wind": `${p.wind}px`,

                zIndex: p.depth > 0.5 ? 2 : 1,
                filter: `blur(${(1 - p.depth) * 2}px)`,
              }}
            />
          ),
        )}
      </div>
    </>
  );
}

export default Background;
