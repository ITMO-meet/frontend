import React from 'react';
import { motion } from 'framer-motion';

const pageVariants = {
    initial: (direction: number) => ({
        opacity: 0,
        x: direction > 0 ? 300 : -300,
    }),
    animate: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.5, ease: "easeOut" },
    },
    exit: (direction: number) => ({
        opacity: 0,
        x: direction > 0 ? -300 : 300,
        transition: { duration: 0.5, ease: "easeIn" },
    }),
};

const PageWrapper: React.FC<{ children: React.ReactNode; direction: number }> = ({ children, direction }) => {
    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            custom={direction}
            style={{ width: '100%' }}
        >
            {children}
        </motion.div>
    );
};

export default PageWrapper;
