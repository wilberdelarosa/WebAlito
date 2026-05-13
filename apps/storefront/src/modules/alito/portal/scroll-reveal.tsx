"use client"

import { motion } from "framer-motion"

type ScrollRevealProps = {
 children: React.ReactNode
 className?: string
 delay?: number
 duration?: number
 distance?: number
 once?: boolean
}

export function ScrollReveal({
 children,
 className,
 delay = 0,
 duration = 0.55,
 distance = 28,
 once = true,
}: ScrollRevealProps) {
 return (
 <motion.div
 initial={{ opacity: 0, y: distance }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once, amount: 0.18 }}
 transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
 className={className}
 >
 {children}
 </motion.div>
 )
}