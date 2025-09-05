import ArticlesList from "@/app/(home)/articles/articles";
import Footer from "@/app/components/footer/footer";
import Navbar from "@/app/components/header/navbar";

export default function Page() {
    return <>
        <Navbar />

        <ArticlesList inverted />

        <Footer />
    </>
}