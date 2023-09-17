import { useEffect, useRef, useState } from "react";
import styles from "./canvas.module.scss";

export const drawLine = (start, end, ctx, color, width) => {
  start = start ?? end;
  ctx.beginPath();
  ctx.lineWidth = width;
  ctx.strokeStyle = color;
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(start.x, start.y, 2, 0, 2 * Math.PI);
  ctx.fill();
};

const Canvas = ({ width, height, connection, roomId, canvasRef, disabled }) => {
  const [drawing, setDrawing] = useState(false);
  const [prevPoint, setPrevPoint] = useState(null);

  const [ctx, setCtx] = useState(null); // Dodajte stanje za ctx

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      setCtx(ctx);
    }
  }, []); // Koristite useEffect za postavljanje ctx samo jednom

  function onMouseDown(e) {
    if (disabled) return;
    setDrawing(true);
    setPrevPoint(getMousePosition(e));
  }

  function onMouseMove(e) {
    if (!drawing || !ctx) return; // Provjerite da li postoji ctx
    const currentPoint = getMousePosition(e);
    onDraw(ctx, currentPoint, prevPoint);
    setPrevPoint(currentPoint);
  }

  function onMouseUp() {
    setDrawing(false);
    setPrevPoint(null);
  }

  function getMousePosition(e) {
    if (!canvasRef.current) return { x: 0, y: 0 }; // Dodajte provjeru za canvasRef
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  function onDraw(ctx, point, prevPoint) {
    drawLine(prevPoint, point, ctx, "#171941", 5);

    if (connection && connection._connectionState === "Connected") {
      connection.invoke("DrawLine", point, prevPoint, roomId);
    }
  }

  return (
    <canvas
      className={styles.canvas}
      width={width}
      height={height}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onTouchStart={onMouseDown}
      onTouchMove={onMouseMove}
      onTouchEnd={onMouseUp}
      ref={canvasRef}
    />
  );
};

export default Canvas;
