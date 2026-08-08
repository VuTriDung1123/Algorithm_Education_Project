"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DPTableState } from "@/lib/data-structures/types";

interface DPTableViewProps {
    dpState: DPTableState;
}

export default function DPTableView({ dpState }: DPTableViewProps) {
    if (!dpState || !dpState.table || dpState.table.length === 0) return null;

    const rows = dpState.table.length;
    const cols = dpState.table[0].length;
    
    // Determine the color based on cell state
    const getColor = (state: string) => {
        switch(state) {
            case 'SELECTED': return 'bg-yellow-500 text-yellow-950 border-yellow-400 font-bold'; // Being computed
            case 'COMPARE': return 'bg-blue-500 text-white border-blue-400'; // Depends on this cell
            case 'FOUND': return 'bg-emerald-500 text-white border-emerald-400 font-bold'; // Final answer / Tracing path
            case 'DELETED': return 'bg-slate-700 text-slate-400 border-slate-600 opacity-50'; // Discarded
            default: return 'bg-slate-800 text-slate-200 border-slate-700'; // DEFAULT
        }
    };

    return (
        <div className="w-full flex flex-col items-center overflow-auto p-4 max-h-[500px]">
            <table className="border-collapse">
                <thead>
                    {dpState.colLabels && (
                        <tr>
                            {/* Empty corner cell if row labels exist */}
                            {dpState.rowLabels && <th className="p-2 border border-transparent"></th>}
                            {dpState.colLabels.map((label, j) => (
                                <th key={`col-label-${j}`} className="p-2 text-pink-400 font-bold min-w-[3rem] text-center">
                                    {label}
                                </th>
                            ))}
                        </tr>
                    )}
                </thead>
                <tbody>
                    <AnimatePresence>
                        {dpState.table.map((row, i) => (
                            <motion.tr key={`row-${i}`} layout>
                                {dpState.rowLabels && (
                                    <th className="p-2 text-pink-400 font-bold text-center border-r border-transparent">
                                        {dpState.rowLabels[i]}
                                    </th>
                                )}
                                {row.map((cell, j) => (
                                    <td key={`cell-${i}-${j}`} className="p-1">
                                        <motion.div
                                            layout
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.3 }}
                                            className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center border-2 rounded-md transition-colors ${getColor(cell.state)}`}
                                        >
                                            {cell.value}
                                        </motion.div>
                                    </td>
                                ))}
                            </motion.tr>
                        ))}
                    </AnimatePresence>
                </tbody>
            </table>
        </div>
    );
}
