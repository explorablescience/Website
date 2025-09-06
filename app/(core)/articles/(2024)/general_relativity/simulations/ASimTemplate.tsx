import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import './../structure/ASection.css'
import Simulation from "../structure/Simulation";

export default function ASimTemplate() {
    return (
        <Simulation>
            <PerspectiveCamera makeDefault position={[5, 2, 2]} fov={60} />
            <OrbitControls />

            <ambientLight />
            <pointLight position={[10, 10, 10]} />

            <mesh name="Box">
                <meshStandardMaterial color="red" />
                <boxGeometry args={[1, 1, 1]} />
            </mesh>
        </Simulation>
    );
}