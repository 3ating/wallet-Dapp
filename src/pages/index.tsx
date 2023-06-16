import { Inter } from 'next/font/google';
import Wallet from './wallet';
import styled from 'styled-components';
const inter = Inter({ subsets: ['latin'] });

const Container = styled.div`
    width: 100%;
    padding: 50px 350px;
    box-sizing: border-box;
`;

export default function Home() {
    return (
        <Container>
            <Wallet />
        </Container>
    );
}
