'use client'

import { useState } from "react";
import { Separator } from "../logic/text/TextEffects";
import styles from "./CommentsForm.module.css";
import logger from "@/app/api/client/logger";
import { postComment } from "@/app/api/client/post_manager";

export function CommentsForm() {

    // State for form fields and error/success
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [name, setName] = useState("");
    const [messageContent, setMessageContent] = useState("");
    const [sending, setSending] = useState(false);

    function validateEmail(email: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        setMessage(null);
        if (!validateEmail(email)) {
            setEmailError("Please enter a valid email address.");
            setMessage({ type: "error", text: "Please enter a valid email address." });
            return;
        }
        if (!name.trim() || !messageContent.trim()) {
            setMessage({ type: "error", text: "Please fill in all fields." });
            return;
        }
        setEmailError("");
        setSending(true);
        
        // Send message
        postComment(name, email, messageContent).then(success => {
            if (success) {
                setMessage({ type: "success", text: "Thank you for your message! I'll get back to you soon." });
                setName("");
                setEmail("");
                setMessageContent("");
            } else {
                logger.error(new Error("Failed to send comment (1)."));
                setMessage({ type: "error", text: "There was an error sending your message.\nPlease try again later or reach me directly using explorablesci@gmail.com." });
            }
            setSending(false);
        }).catch(() => {
            logger.error(new Error("Failed to send comment (2)."));
            setMessage({ type: "error", text: "There was an error sending your message.\nPlease try again later or reach me directly using explorablesci@gmail.com." });
            setSending(false);
        });
    }

    return <>
        <div className={styles['comments-g-container']}>
            <Separator />
            <div className={styles['comments-container']}>
                <form className={styles['comments-form']} onSubmit={handleSubmit}>
                    <input type="text" id="comments-name" placeholder="Name"
                        value={name}
                        onChange={e => setName(e.target.value)} />
                    <input
                        type="email"
                        id="comments-email"
                        placeholder="Email"
                        value={email}
                        onChange={e => {
                            setEmail(e.target.value);
                            if (emailError) setEmailError("");
                            if (message) setMessage(null);
                        }}
                        aria-invalid={!!emailError}
                    />
                    <textarea id="comments-content" placeholder="Your Message"
                        value={messageContent}
                        onChange={e => setMessageContent(e.target.value)}
                    />
                    <button
                        type="submit"
                        className={emailError || (message && message.type === "error") ? styles['error'] : ""}
                        disabled={sending}
                    >
                        {sending ? "Sending..." : "Contact me"}
                    </button>
                    {message && (
                        <div className={`${styles[`comments-message`]} ${styles[`comments-${message.type}`]}`} role="alert">
                            {message.text}
                        </div>
                    )}
                </form>
            </div>
        </div>
    </>;
}

