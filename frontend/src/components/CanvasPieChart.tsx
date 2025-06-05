import React, { useEffect, useRef } from 'react';

type Slice = {
  label: string;
  value: number;
  color: string;
};

type CanvasPieChartProps = {
  data: Slice[];
  width?: number;
  height?: number;
};

const CanvasPieChart: React.FC<CanvasPieChartProps> = ({ data, width = 300, height = 300 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const total = data.reduce((sum, slice) => sum + slice.value, 0);
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(width, height) / 2 - 40; 
    const innerRadius = radius * 0.6;
    let startAngle = -Math.PI / 2;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Reset transform to avoid accumulation
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    data.forEach(slice => {
      const sliceAngle = (slice.value / total) * 2 * Math.PI;
      
      // Draw outer arc (doughnut slice)
      ctx.beginPath();
      ctx.arc(cx, cy, radius, startAngle, startAngle + sliceAngle);
      ctx.arc(cx, cy, innerRadius, startAngle + sliceAngle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = slice.color;
      ctx.fill();

      // Draw label
      const midAngle = startAngle + sliceAngle / 2;
      const labelX = cx + (radius + 20) * Math.cos(midAngle);
      const labelY = cy + (radius + 20) * Math.sin(midAngle);
      
      ctx.fillStyle = slice.color;
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(slice.label, labelX, labelY);

      startAngle += sliceAngle;
    });
  }, [data, width, height]);

  return <canvas ref={canvasRef} width={width} height={height} />;
};


export default CanvasPieChart;