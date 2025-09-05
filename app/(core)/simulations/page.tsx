import SimulationsList from "@/app/(home)/simulations/simulations";
import Footer from "@/app/components/footer/footer";
import Navbar from "@/app/components/header/navbar";

export default function Page() {
    return <>
        <Navbar />

        <SimulationsList inverted />

        <Footer />
    </>
}