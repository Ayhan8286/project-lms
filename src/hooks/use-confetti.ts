"use client";

import confetti from "canvas-confetti";

export const useConfettiStore = () => {
    const onOpen = () => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    };

    return {
        onOpen,
    }
};
