'use server';

import { cache } from "react";

/** Simulation data type */
export type SimulationData = {
    id: string;
    title: string;
    description: string;
    image: { url: string; width: number; height: number; alt: string };
    link: string;
    keyword: string;
    year: string;
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
    const simulations: SimulationData[] = [
        {
            id: '2022-heat_equation',
            title: 'Heat equation',
            description: 'The heat equation describes the temperature evolution inside materials. Using the latest GPU technologies, this simulations aim to compute this propagation considering some obstacles.',
            image: {
                url: 'https://firebasestorage.googleapis.com/v0/b/mecanicascience.appspot.com/o/simulations%2F10_thermal_conduction.png?alt=media',
                width: 800,
                height: 600,
                alt: 'Heat equation',
            },
            link: '/2022/ThermalConduction/',
            keyword: 'Thermodynamics',
            year: '2022',
            pinned: false
        },
        {
            id: '2022-ising-model',
            title: 'Ising model',
            description: 'The <c>Ising model</c> is a model from Statistical Physics modelling magnetism inside materials. In this simulation, GPU is used to simulate this model in real time, using the Metropolis Algorithm.',
            image: {
                url: 'https://firebasestorage.googleapis.com/v0/b/mecanicascience.appspot.com/o/simulations%2F9_modele_ising.png?alt=media',
                width: 800,
                height: 600,
                alt: 'Ising model',
            },
            keyword: 'Statistical Physics',
            link: '/2022/IsingModel/',
            year: '2022',
            pinned: true
        },
        {
            id: '2023-hydrogen-atom',
            title: 'Hydrogen atom',
            description: 'This simulation uses the latest GPU tools to view the orbitals wavefunctions of an Hydrogen Atom. The quantum numbers can be modified in real time.',
            image: {
                url: 'https://firebasestorage.googleapis.com/v0/b/mecanicascience.appspot.com/o/simulations%2F7_hydrogen_atom.png?alt=media',
                width: 800,
                height: 600,
                alt: 'Hydrogen atom',
            },
            keyword: 'Quantum Mechanics',
            link: '/2023/HydrogenAtom/',
            year: '2023',
            pinned: false
        },
        {
            id: '2021-electrostatic-field',
            title: 'Electrostatic Field',
            description: 'This project shows the electrostatic line fields beeing computed in real time. It computes and shows the field lines for entirely customizable sources.',
            image: {
                url: 'https://firebasestorage.googleapis.com/v0/b/mecanicascience.appspot.com/o/simulations%2F2_champ_electrique.png?alt=media',
                width: 800,
                height: 600,
                alt: 'Electrostatic Field',
            },
            keyword: 'Electromagnetism',
            link: '/2021/ElectrostaticField/',
            year: '2021',
            pinned: false
        }
    ];

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

