import React from 'react';
import { motion, type HTMLMotionProps } from 'motion/react';

interface ZigZagItemProps extends HTMLMotionProps<'div'> {
  index?: number;
  direction?: 'left' | 'right' | 'auto';
  distance?: number;
  delay?: number;
  children: React.ReactNode;
  className?: string;
}

/**
 * ZigZagItem
 * Componente reutilizável com Framer Motion que aplica animação de entrada em "zigue-zague":
 * - Elementos de índice par entram deslizando da esquerda para a direita.
 * - Elementos de índice ímpar entram deslizando da direita para a esquerda.
 * - Re-engatilha toda vez que entra na viewport com `once: false`.
 */
export const ZigZagItem: React.FC<ZigZagItemProps> = ({
  index = 0,
  direction = 'auto',
  distance = 45,
  delay,
  children,
  className = '',
  ...props
}) => {
  // Determina direção: se auto, alterna entre esquerda (par) e direita (ímpar)
  const isLeft = direction === 'left' ? true : direction === 'right' ? false : index % 2 === 0;
  const initialX = isLeft ? -distance : distance;
  const calculatedDelay = delay !== undefined ? delay : (index % 4) * 0.1;

  return (
    <motion.div
      initial={{
        opacity: 0,
        x: initialX,
        y: 18,
        scale: 0.98,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
      }}
      viewport={{
        once: false, // Re-engatilha sempre que entra na viewport
        amount: 0.18, // Gatilho quando 18% do elemento estiver visível
      }}
      transition={{
        duration: 0.65,
        delay: calculatedDelay,
        ease: [0.16, 1, 0.3, 1], // Curva suave e dinâmica
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

interface ZigZagHeadingProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  from?: 'left' | 'right' | 'center';
}

/**
 * ZigZagHeading
 * Animação para títulos de seção, selos e subtítulos com re-disparo em viewport (once: false).
 */
export const ZigZagHeading: React.FC<ZigZagHeadingProps> = ({
  children,
  className = '',
  delay = 0,
  from = 'center',
  ...props
}) => {
  const initialX = from === 'left' ? -35 : from === 'right' ? 35 : 0;

  return (
    <motion.div
      initial={{
        opacity: 0,
        x: initialX,
        y: -20,
        scale: 0.96,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
      }}
      viewport={{
        once: false,
        amount: 0.25,
      }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

interface ZigZagContainerProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
}

/**
 * ZigZagContainer
 * Container pai para orquestrar seções com efeito contínuo de entrada.
 */
export const ZigZagContainer: React.FC<ZigZagContainerProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.1 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};
