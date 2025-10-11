'use client'

import styles from './error.module.css'
import logger from "./api/client/logger";
import Header from './components/header/header';
import Button from './components/ui/buttons/button';
import HeaderAnimation from './components/header/header_animation';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
    logger.error(error);

    return (
        <html>
            <head>
                <title>Something went wrong!</title>
                <link rel="icon" type="image/ico" href="/imgs/favicon.ico" />
            </head>

            <body>
                <HeaderAnimation small />

                <Header>
                    <div className={styles.content}>
                        <p>Something went wrong!</p>
                    </div>

                    <div className={styles.buttons}>
                        <Button content='Go Home' link='/' size='standard' />
                        <span style={{ display: 'inline', marginLeft: '40px' }} />
                        <Button content='Try again' action={() => reset()} size='standard' />
                    </div>
                </Header>
            </body>
        </html>
    )
}