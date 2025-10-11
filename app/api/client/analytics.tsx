'use client'

import { useEffect } from "react";
import { postUserInformations } from "./post_manager";

export function CustomAnalytics() {
    // Custom analytics after page load
    useEffect(() => {
        postUserInformations();
    }, []);
    return <></>;
}