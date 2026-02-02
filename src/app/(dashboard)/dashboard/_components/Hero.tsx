"use client";

import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";

export const Hero = () => {
    const { user } = useUser();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl p-8 text-white mb-8 shadow-lg relative overflow-hidden"
        >
            {/* Background accents */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none" />

            <div className="relative z-10">
                <h1 className="text-3xl font-bold mb-2">
                    Welcome back, {user?.firstName}! 👋
                </h1>
                <p className="text-indigo-100 max-w-xl">
                    You're making great progress. Pick up where you left off or discover something new today.
                </p>
            </div>
        </motion.div>
    );
};
