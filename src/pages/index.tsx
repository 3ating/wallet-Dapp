import Wallet from './wallet';
import styled from 'styled-components';

const Container = styled.div`
    width: 100%;
    padding: 50px 25%;
    box-sizing: border-box;
    background-color: ${({ theme }) => theme.container.background};
    @media (max-width: 900px) {
        padding: 50px 15%;
    }
`;

export default function Home() {
    return (
        <Container>
            <Wallet />
        </Container>
    );
}
