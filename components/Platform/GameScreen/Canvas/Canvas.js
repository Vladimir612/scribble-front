import { useOnDraw } from "../Hooks";
import styles from "./canvas.module.scss";

const Canvas = ({ width, height }) => {
  const { setCanvasRef, onCanvasMouseDown } = useOnDraw(onDraw);

  function onDraw(ctx, point, prevPoint) {
    drawLine(prevPoint, point, ctx, "#171941", 5);
  }

  function drawLine(start, end, ctx, color, width) {
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
  }

  return (
    <canvas
      onMouseDown={onCanvasMouseDown}
      ref={setCanvasRef}
      className={styles.canvas}
      width={width}
      height={height}
    />
  );
};

export default Canvas;
