'use server'

import { cache } from "react";

export const getArticles = cache(async function() {
    return [
        {
            title: 'Heat equation',
            description: 'The <c>heat equation</c> describes the temperature evolution inside materials. Using the latest GPU technologies, this simulations aim to compute this propagation considering some obstacles.',
            image: 'https://firebasestorage.googleapis.com/v0/b/mecanicascience.appspot.com/o/simulations%2F10_thermal_conduction.png?alt=media',
            link: '/articles/heat_equation',
            keyword: 'Thermodynamics',
            year: '2022'
        },
        {
            title: 'Ising model',
            description: 'The Ising model is a model from Statistical Physics modelling magnetism inside materials. In this simulation, GPU is used to simulate this model in real time, using the Metropolis Algorithm.',
            image: 'https://firebasestorage.googleapis.com/v0/b/mecanicascience.appspot.com/o/simulations%2F9_modele_ising.png?alt=media',
            link: '/articles/ising_model',
            keyword: 'Statistical Physics',
            year: '2022'
        },
        {
            title: 'Hydrogen atom',
            description: 'This simulation uses the latest GPU tools to view the orbitals wavefunctions of an Hydrogen Atom. The quantum numbers can be modified in real time.',
            image: 'https://firebasestorage.googleapis.com/v0/b/mecanicascience.appspot.com/o/simulations%2F7_hydrogen_atom.png?alt=media',
            link: '/articles/hydrogen_atom',
            keyword: 'Quantum Mechanics',
            year: '2022'
        },
        {
            title: 'Electrostatic Field',
            description: 'This project shows the electrostatic line fields beeing computed in real time. It computes and shows the field lines for entirely customizable sources.',
            image: 'https://firebasestorage.googleapis.com/v0/b/mecanicascience.appspot.com/o/simulations%2F2_champ_electrique.png?alt=media',
            link: '/articles/electrostatic_field',
            keyword: 'Electromagnetism',
            year: '2021'
        }
    ];
});
