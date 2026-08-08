"use client";
import { motion } from "framer-motion";
import { TreeNodeData } from "@/lib/data-structures/types";

export default function TreeNode({ node }: { node: TreeNodeData }) {
    const { value, state, x, y } = node;

    let bgColor = "bg-slate-800";
    let borderColor = "border-slate-700";
    let textColor = "text-white";
    let zIndex = 10;

    if (state === 'ACCESS') {
        bgColor = "bg-green-600";
        borderColor = "border-green-400";
        zIndex = 20;
    } else if (state === 'SELECTED') {
        bgColor = "bg-yellow-600";
        borderColor = "border-yellow-400";
        textColor = "text-black";
        zIndex = 20;
    } else if (state === 'FOUND') {
        bgColor = "bg-blue-600";
        borderColor = "border-blue-400";
        zIndex = 30;
    } else if (state === 'DELETED') {
        bgColor = "bg-red-900/50";
        borderColor = "border-red-600";
        textColor = "text-red-400";
    }
    
    if (node.auxiliary?.isEnd) {
        borderColor = "border-emerald-400";
        bgColor = state === 'DEFAULT' ? "bg-slate-700" : bgColor;
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`absolute flex items-center justify-center rounded-full border-2 shadow-lg font-bold font-mono text-lg ${bgColor} ${borderColor} ${textColor}`}
            style={{
                width: 50,
                height: 50,
                left: `calc(${x}% - 25px)`,
                top: `${y}px`,
                zIndex
            }}
        >
            {value}
        </motion.div>
    );
}
