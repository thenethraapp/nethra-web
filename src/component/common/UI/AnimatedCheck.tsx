import { motion } from "framer-motion";

interface AnimatedCheckProps {
  size?: number;   // Controls width & height
  color?: string;  // Stroke color
  duration?: number; // Animation duration in seconds
}

export default function AnimatedCheck({
  size = 80,
  color = "green",
  duration = 0.6,
}: AnimatedCheckProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 52 52"
      fill="none"
      stroke={color}
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <motion.path
        d="M14 27 L22 35 L38 17"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration }}
      />
    </motion.svg>
  );
}
