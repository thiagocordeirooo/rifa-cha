import React, { useEffect } from "react";

const ConfettiCanvas: React.FC = () => {
  useEffect(() => {
    function showConfetti() {
      let W = window.innerWidth;
      let H = window.innerHeight;
      const canvas = document.getElementById("canvas") as HTMLCanvasElement;
      const context = canvas?.getContext("2d");
      const maxConfettis = 150;
      const particles: ConfettiParticle[] = [];

      const possibleColors = [
        "DodgerBlue",
        "OliveDrab",
        "Gold",
        "Pink",
        "SlateBlue",
        "LightBlue",
        "Gold",
        "Violet",
        "PaleGreen",
        "SteelBlue",
        "SandyBrown",
        "Chocolate",
        "Crimson",
      ];

      function randomFromTo(from: number, to: number) {
        return Math.floor(Math.random() * (to - from + 1) + from);
      }

      class ConfettiParticle {
        x: number;
        y: number;
        r: number;
        d: number;
        color: string;
        tilt: number;
        tiltAngleIncremental: number;
        tiltAngle: number;

        constructor() {
          this.x = Math.random() * W;
          this.y = Math.random() * H - H;
          this.r = randomFromTo(11, 33);
          this.d = Math.random() * maxConfettis + 11;
          this.color = possibleColors[Math.floor(Math.random() * possibleColors.length)];
          this.tilt = Math.floor(Math.random() * 33) - 11;
          this.tiltAngleIncremental = Math.random() * 0.07 + 0.05;
          this.tiltAngle = 0;
        }

        draw(context: CanvasRenderingContext2D) {
          context.beginPath();
          context.lineWidth = this.r / 2;
          context.strokeStyle = this.color;
          context.moveTo(this.x + this.tilt + this.r / 3, this.y);
          context.lineTo(this.x + this.tilt, this.y + this.tilt + this.r / 5);
          context.stroke();
        }
      }

      function draw() {
        requestAnimationFrame(draw);

        if (context) {
          context.clearRect(0, 0, W, H);

          particles.forEach((particle) => {
            particle.tiltAngle += particle.tiltAngleIncremental;
            particle.y += (Math.cos(particle.d) + 3 + particle.r / 2) / 2;
            particle.tilt = Math.sin(particle.tiltAngle) * 15;

            if (particle.y > H || particle.x > W + 30 || particle.x < -30) {
              particle.x = Math.random() * W;
              particle.y = -30;
              particle.tilt = Math.floor(Math.random() * 10) - 20;
            }

            particle.draw(context);
          });
        }
      }

      window.addEventListener(
        "resize",
        () => {
          W = window.innerWidth;
          H = window.innerHeight;
          if (canvas) {
            canvas.width = W;
            canvas.height = H;
          }
        },
        false
      );

      for (let i = 0; i < maxConfettis; i++) {
        particles.push(new ConfettiParticle());
      }

      if (canvas) {
        canvas.width = W;
        canvas.height = H;
        draw();
      }
    }

    showConfetti();
  }, []);

  return <canvas id="canvas" style={{ position: "fixed", top: 0, left: 0 }} />;
};

export default ConfettiCanvas;
