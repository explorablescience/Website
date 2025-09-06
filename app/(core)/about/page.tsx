import Footer from "@/app/components/footer/footer";
import Navbar from "@/app/components/header/navbar";

export default function Page() {
    return (
        <>
            <Navbar small />

            <div style={{height: "70vh", marginTop: "105px", color: "#171f2d", textAlign: "center", fontSize: "23px" }}>
                <p style={{ margin: "210px 0"}}>Work in progress...</p>
            </div>

            <Footer />
        </>
    )
}
