import React from "react";

const PieChart = ({ data, size }) => {
  // Calculate the total value of the data
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);

  // Handle cases where some values are zero by assigning a minimum slice
  const adjustedData = data.map((item) => ({
    ...item,
    adjustedValue: item.value === 0 && totalValue > 0 ? 0.001 : item.value,
  }));

  const adjustedTotal = adjustedData.reduce(
    (sum, item) => sum + item.adjustedValue,
    0
  );

  // Function to calculate the path for each slice
  const getSlicePath = (cx, cy, radius, startAngle, endAngle) => {
    const startX = cx + radius * Math.cos((startAngle * Math.PI) / 180);
    const startY = cy + radius * Math.sin((startAngle * Math.PI) / 180);
    const endX = cx + radius * Math.cos((endAngle * Math.PI) / 180);
    const endY = cy + radius * Math.sin((endAngle * Math.PI) / 180);
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

    return `M ${cx},${cy} L ${startX},${startY} A ${radius},${radius} 0 ${largeArcFlag} 1 ${endX},${endY} Z`;
  };

  let currentAngle = 0; // Keep track of the current angle

  return (
    <div>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {adjustedData.map((item, index) => {
          const startAngle = currentAngle;
          const sliceAngle =
            totalValue === 0
              ? 360 / adjustedData.length
              : (item.adjustedValue / adjustedTotal) * 360;
          const endAngle = currentAngle + sliceAngle;

          const path = getSlicePath(
            size / 2, // Center X
            size / 2, // Center Y
            size / 2, // Radius
            startAngle,
            endAngle
          );

          currentAngle = endAngle; // Update the current angle

          return (
            <path
              key={index}
              d={path}
              fill={item.color}
              stroke="white"
              strokeWidth="0.5"
            />
          );
        })}
      </svg>
    </div>
  );
};

export default PieChart;
