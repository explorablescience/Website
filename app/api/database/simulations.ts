'use server';

import { cache } from "react";

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
            id: '2020-tidal_forces',
            title: "Tiding forces",
            description: "This program aims to simulate the <c>tidal forces</c> on Earth, exerted under the influence of <c>gravitationnal interaction</c> with the Moon.",
            image: {
                url: 'https://firebasestorage.googleapis.com/v0/b/mecanicascience.appspot.com/o/simulations%2F3_simulation_forces_marees.png?alt=media',
                width: 800,
                height: 600,
                alt: "Tiding forces",
            },
            link: '/2020/Tidal%20Forces/',
            github: 'https://github.com/xam4lor/ForceDesMarees',
            keyword: 'Mechanics',
            year: '2020',
            pinned: false
        },
        {
            id: '2020-wave_propagation',
            title: "Wave propagation",
            description: "This simulation helps to better understand what waves are, through the simulation of different wave types. For instance, <c>plane 2D waves</c>, <c>plane 3D waves</c> and <c>circular 3D waves</c>.",
            image: {
                url: 'https://firebasestorage.googleapis.com/v0/b/mecanicascience.appspot.com/o/simulations%2F6_wave_propagation.png?alt=media',
                width: 800,
                height: 600,
                alt: "Wave propagation",
            },
            link: '/2020/Wave%20Propagation/',
            github: 'https://github.com/mecanicascience/Simulations/tree/master/2020/Wave%20Propagation',
            keyword: 'Optics',
            year: '2020',
            pinned: false
        },
        {
            id: '2022-heat_equation',
            title: "Heat equation",
            description: "The heat equation describes the <c>temperature evolution</c> inside materials. Using the latest GPU technologies, this simulations aim to compute this <c>propagation</c> considering some <c>obstacles</c>.",
            image: {
                url: 'https://firebasestorage.googleapis.com/v0/b/mecanicascience.appspot.com/o/simulations%2F10_thermal_conduction.png?alt=media',
                width: 800,
                height: 600,
                alt: "Heat equation",
            },
            link: '/2022/ThermalConduction/',
            github: 'https://github.com/mecanicascience/Simulations/tree/master/2022/ThermalConduction',
            keyword: 'Thermodynamics',
            year: '2022',
            pinned: false
        },
        {
            id: '2020-courbes_lissajous',
            title: "Lissajous curves",
            description: "Lissajous curves are geometric shapes that regularly appears in physics, and very often in <c>optics</c>. This simulation allows to visualize these <c>different curves</c>.",
            image: {
                url: 'https://firebasestorage.googleapis.com/v0/b/mecanicascience.appspot.com/o/simulations%2F4_courbes_lissajous.png?alt=media',
                width: 800,
                height: 600,
                alt: "Lissajous curves",
            },
            link: '/2020/Lissajous%20Curves/',
            github: 'https://github.com/mecanicascience/Simulations/tree/master/2020/Lissajous%20Curves',
            keyword: 'Optics',
            year: '2020',
            pinned: false
        },
        {
            id: '2020-multiple_springs',
            title: "Coupled springs",
            description: "<c>Coupling multiple springs</c> can, as their number increase to infinity, to simulate a <c>plane wave</c>. This program allows to better understand this phenomena.",
            image: {
                url: 'https://firebasestorage.googleapis.com/v0/b/mecanicascience.appspot.com/o/simulations%2F5_multiple_springs.png?alt=media',
                width: 800,
                height: 600,
                alt: "Coupled springs",
            },
            link: '/2020/Multiple%20Springs/',
            github: 'https://github.com/mecanicascience/Simulations/tree/master/2020/Multiple%20Springs',
            keyword: 'Mechanics',
            year: '2020',
            pinned: false
        },
        {
            id: '2022-hydrogen_atom',
            title: "Hydrogen atom",
            description: "This simulation uses the latest GPU tools to view the <c>orbitals wavefunctions</c> of an <c>Hydrogen Atom</c>. The quantum numbers can be modified in real time.",
            image: {
                url: 'https://firebasestorage.googleapis.com/v0/b/mecanicascience.appspot.com/o/simulations%2F7_hydrogen_atom.png?alt=media',
                width: 800,
                height: 600,
                alt: "Hydrogen atom",
            },
            link: '/2022/HydrogenAtom/',
            github: 'https://github.com/mecanicascience/Simulations/tree/master/2022/HydrogenAtom',
            keyword: 'Quantum Mechanics',
            year: '2022',
            pinned: false
        },
        {
            id: '2022-modele_ising',
            title: "Ising model",
            description: "The Ising model is a model from Statistical Physics modelling <c>magnetism inside materials</c>. In this simulation, GPU is used to simulate this model in real time, using the <c>Metropolis Algorithm</c>.",
            image: {
                url: 'https://firebasestorage.googleapis.com/v0/b/mecanicascience.appspot.com/o/simulations%2F9_modele_ising.png?alt=media',
                width: 800,
                height: 600,
                alt: "Ising model",
            },
            link: '/2022/IsingModel/',
            github: 'https://github.com/mecanicascience/Simulations/tree/master/2022/IsingModel',
            keyword: 'Statistical Physics',
            year: '2022',
            pinned: true
        },
        {
            id: '2020-simulation_systeme_solaire',
            title: "Solar system",
            description: "The Solar System is a physical system really complex to simulate. In this simulation, linked to the N-Body article (in french), a <c>simulation of this Solar System</c> is made.",
            image: {
                url: 'https://firebasestorage.googleapis.com/v0/b/mecanicascience.appspot.com/o/simulations%2F1_simulation_systeme_solaire.png?alt=media',
                width: 800,
                height: 600,
                alt: "Solar system",
            },
            link: '/2020/Article_Le_probleme_a_N_corps/07_Solar_System_Simulation/',
            github: 'https://github.com/mecanicascience/Simulations/tree/master/2020/Article_Le_probleme_a_N_corps/07_Solar_System_Simulation',
            keyword: 'Mechanics',
            year: '2020',
            pinned: false
        },
        {
            id: '2021-neuro_evolution_landers',
            title: "Neuro-evolution algorithm",
            description: "Realisation of a <c>Neuro-evolutive</c> algorithm that can train spaceships to hover, based on the <c>NEAT algorithm</c> (NeuroEvolution of Augmented Topologies).",
            image: {
                url: 'https://firebasestorage.googleapis.com/v0/b/mecanicascience.appspot.com/o/simulations%2F8_neuro_evolution_landers.png?alt=media',
                width: 800,
                height: 600,
                alt: "Neuro-evolution algorithm",
            },
            link: '/2021/LanderSimulation/',
            github: 'https://github.com/mecanicascience/Lander-Simulation',
            keyword: 'Computer Science',
            year: '2021',
            pinned: false
        },
        {
            id: '2021-champ_electrique',
            title: "Electrostatic field",
            description: "This project shows the <c>electrostatic line fields<8c> beeing computed in real time. It computes and shows the field lines for entirely <c>customizable sources</c>.",
            image: {
                url: 'https://firebasestorage.googleapis.com/v0/b/mecanicascience.appspot.com/o/simulations%2F2_champ_electrique.png?alt=media',
                width: 800,
                height: 600,
                alt: "Electrostatic field",
            },
            link: '/2020/ElectrostaticField/',
            github: 'https://github.com/xam4lor/ElectromagnetismFields/',
            keyword: 'Electromagnetism',
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

