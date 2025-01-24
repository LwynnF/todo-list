import React from "react";

function ProgressIndicator({
	completedPercentage,
	completedTodos,
	totalTodos,
}) {
	const radius = 50;
	const circumference = 2 * Math.PI * radius;
	const svgSize = 2 * radius + 20; // Add some padding for stroke width so text does not touch edge

	return (
		<div className="progress-indicator" style={{ marginTop: "10px" }}>
			{totalTodos > 0 && (
				<svg
					width={svgSize}
					height={svgSize}
					textAnchor="middle"
					dominantBaseline="middle"
	
				>
					<text
						x={svgSize / 2}
						y={svgSize / 2}
						textAnchor="middle"
						dominantBaseline="middle"
						fontSize="12"
						fill="#905b27"
						fontWeight={600}
					>
						<tspan
							x={svgSize / 2}
							dy="-0.3em"
						>
							{completedTodos}/{totalTodos} tasks
						</tspan>
						<tspan
							x={svgSize / 2}
							dy="1.2em"
						>
							completed
						</tspan>
					</text>
					<g transform={`rotate(-90 ${svgSize / 2} ${svgSize / 2})`}>
						{/* Remaining indicator */}
						<circle
							className="remaining"
							cx={svgSize / 2}
							cy={svgSize / 2}
							r={radius}
							stroke="#FEFAE0"
							strokeWidth="10"
							fill="none"
						/>
						{/* Completed indicator */}
						<circle
							className="completed"
							cx={svgSize / 2}
							cy={svgSize / 2}
							r={radius}
							stroke="#e7ecc6"
							strokeWidth="10"
							fill="none"
							strokeDasharray={circumference}
							strokeDashoffset={
								circumference - (completedPercentage / 100) * circumference
							}
						/>
					</g>
				</svg>
			)}
		</div>
	);
}

export default ProgressIndicator;
