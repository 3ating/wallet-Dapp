import { createContext, ReactNode, useEffect, useState } from 'react';
import { SyncLoader } from 'react-spinners';
import styled from 'styled-components';

export const ThemeContext = createContext({
    theme: 'light',
    toggleTheme: () => {},
});

const LoaderContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
`;

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [themeLoaded, setThemeLoaded] = useState(false);
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        const fetchTheme = async () => {
            const savedTheme = await localStorage.getItem('theme');
            if (savedTheme) {
                setTheme(savedTheme);
            }
            setThemeLoaded(true);
        };

        fetchTheme();
    }, []);

    const toggleTheme = () => {
        setTheme((prevTheme) => {
            const newTheme = prevTheme === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            return newTheme;
        });
    };

    if (!themeLoaded) {
        return (
            <LoaderContainer>
                <SyncLoader color='#ffab34' />
            </LoaderContainer>
        );
    }

    return <ThemeContext.Provider value={{ theme, toggleTheme }}>{themeLoaded && children}</ThemeContext.Provider>;
};
