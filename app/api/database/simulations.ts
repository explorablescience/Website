'use server';

import { cache } from "react";
import simulations_data from '../data/simulations.json';

/** Simulation data type */
export type SimulationData = {
    id: string;
    title: string;
    description: string;
    image: { url: string; width: number; height: number; alt: string };
    link: string;
    github: string;
    keyword: string;
    year: string;
    date: string;
    pinned: boolean;
}

/**
 * Get simulations from the database
 * Returns an object with:
 * - by_id: a mapping from simulation id to its index in the data array
 * - by_display: an array of indices in the data array, sorted by pinned and year
 * - data: an array of all simulations
 */
const getSimulations = cache(async function () {
    // Get simulations from database
    const simulations: SimulationData[] = simulations_data.simulations as SimulationData[];

    // Sort by id for faster access
    const simulations_by_id: { [key: string]: number } = {};
    simulations.forEach((sim, idx) => {
        simulations_by_id[sim.id] = idx;
    });

    // Sort by pinned, then year
    const simulations_by_pinned: number[] = [];
    simulations.forEach((sim, idx) => {
        if (sim.pinned) {
            simulations_by_pinned.unshift(idx);
        } else {
            simulations_by_pinned.push(idx);
        }
    });
    simulations_by_pinned.sort((a, b) => {
        const sim_a = simulations[a];
        const sim_b = simulations[b];
        if (sim_a.pinned && !sim_b.pinned) return -1;
        if (!sim_a.pinned && sim_b.pinned) return 1;
        if (sim_a.year > sim_b.year) return -1;
        if (sim_a.year < sim_b.year) return 1;
        return 0;
    });

    // Sort by year
    const simulations_by_year: number[] = [];
    simulations.forEach((_, idx) => {
        simulations_by_year.push(idx);
    });
    simulations_by_year.sort((a, b) => {
        const sim_a = simulations[a];
        const sim_b = simulations[b];
        if (sim_a.year > sim_b.year) return -1;
        if (sim_a.year < sim_b.year) return 1;
        return 0;
    });

    // Return all data
    return {
        by_id: simulations_by_id,
        by_pinned: simulations_by_pinned,
        by_year: simulations_by_year,
        data: simulations
    };
});

/**
 * Get all simulations
 */
export async function getAllSimulations(): Promise<SimulationData[]> {
    const simulations = await getSimulations();
    return simulations.data;
}

/** Get simulations sorted by pinned and year
 * @param max Maximum number of simulations to return
 * @returns An array of simulations
 */
export async function getSimulationsByPinned(max?: number): Promise<SimulationData[]> {
    const simulations = await getSimulations();
    const sorted = simulations.by_pinned.map(idx => simulations.data[idx]);
    return max ? sorted.slice(0, max) : sorted;
}

/** Get simulations sorted by year
 * @param max Maximum number of simulations to return
 * @returns An array of simulations
 */
export async function getSimulationsByYear(max?: number): Promise<SimulationData[]> {
    const simulations = await getSimulations();
    const sorted = simulations.by_year.map(idx => simulations.data[idx]);
    return max ? sorted.slice(0, max) : sorted;
}

/** Get a simulation by its id
 * @param sim_id Simulation id
 * @returns The simulation data, or null if not found
 */
export async function getSimulationById(sim_id: string): Promise<SimulationData | null> {
    const simulations = await getSimulations();
    const idx = simulations.by_id[sim_id];
    if (idx === undefined) {
        return null;
    }
    return simulations.data[idx];
}

