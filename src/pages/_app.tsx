import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { ThemeContext, ThemeProvider } from '../contexts/ThemeContext';
import lightTheme from '../styles/lightTheme';
import darkTheme from '../styles/darkTheme';
import { ReactNode, useContext } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ThemeProvider>
            <ThemeController>
                <Component {...pageProps} />
            </ThemeController>
        </ThemeProvider>
    );
}

const ThemeController = ({ children }: { children: ReactNode }) => {
    const { theme } = useContext(ThemeContext);
    return <StyledThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>{children}</StyledThemeProvider>;
};

export default MyApp;
