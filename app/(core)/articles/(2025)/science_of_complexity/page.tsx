import Footer from "@/app/components/footer/footer";
import Navbar from "@/app/components/header/navbar";
import { Metadata } from "next";
import React from "react";
import './page.module.css'
import ScienceComplexityApp from "./ScienceComplexityApp";

export const metadata: Metadata = {
    title: 'The Science of Complexity'
}

export default function Page() {
    return <>
        <Navbar small />

        <React.StrictMode>
            <ScienceComplexityApp />
        </React.StrictMode>

        <Footer />
    </>
}
