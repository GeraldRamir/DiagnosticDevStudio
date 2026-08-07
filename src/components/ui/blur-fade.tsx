"use client"

import { useRef } from "react"
import {
  motion,
  useInView,
  useReducedMotion,
  type MotionProps,
  type UseInViewOptions,
  type Variants,
} from "motion/react"

type MarginType = UseInViewOptions["margin"]

interface BlurFadeProps extends MotionProps {
  children: React.ReactNode
  className?: string
  variant?: {
    hidden: { y: number }
    visible: { y: number }
  }
  duration?: number
  delay?: number
  offset?: number
  direction?: "up" | "down" | "left" | "right"
  inView?: boolean
  inViewMargin?: MarginType
  /** Kept for API compat — blur disabled for performance */
  blur?: string
  once?: boolean
}

/**
 * Lightweight scroll reveal (opacity + translate only).
 * No CSS filter:blur — that was tanking scroll FPS.
 */
export function BlurFade({
  children,
  className,
  variant,
  duration = 0.35,
  delay = 0,
  offset = 10,
  direction = "up",
  inView = true,
  inViewMargin = "0px 0px -60px 0px",
  once = true,
  ...props
}: BlurFadeProps) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const inViewResult = useInView(ref, { once, margin: inViewMargin })
  const isInView = !inView || inViewResult

  const axis = direction === "left" || direction === "right" ? "x" : "y"
  const from =
    direction === "right" || direction === "down" ? -offset : offset

  const defaultVariants: Variants = reduce
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }
    : {
        hidden: { [axis]: from, opacity: 0 },
        visible: { [axis]: 0, opacity: 1 },
      }

  const combinedVariants = variant ?? defaultVariants

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={combinedVariants}
      transition={{
        delay: delay,
        duration: reduce ? 0.15 : duration,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}
