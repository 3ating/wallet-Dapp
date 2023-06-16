import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 25px;
    margin: 0 auto;
    padding: 5%;
    background-color: rgb(241, 245, 247);
    color: #ccc;
    border-radius: 10px;
`;

const InfoWrap = styled.div`
    display: flex;
    justify-content: space-between;
    background-color: rgb(255, 255, 255);
    padding: 0 5%;
`;

const Title = styled.p`
    color: #000;
    font-size: 30px;
    font-weight: 600;
    letter-spacing: 1px;
`;

const Address = styled.p`
    font-size: 24px;
    margin: 30px 0;
    color: #000;
    letter-spacing: 1px;
`;

const Balance = styled(Address)``;

const Wallet = () => {
    const [address, setAddress] = useState<string>('');
    const [balance, setBalance] = useState<string>('');

    useEffect(() => {
        const fetchBalance = async () => {
            const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_ALCHEMY_API);
            const userAddress = process.env.NEXT_PUBLIC_USER_ADDRESS;

            if (!userAddress) {
                console.error('User address is not set in the environment variables.');
                return;
            }

            const rawBalance = await provider.getBalance(userAddress);
            const parsedBalance = ethers.formatEther(rawBalance);

            const displayedAddress = `${userAddress.slice(0, 6)}...${userAddress.slice(-7)}`;

            setAddress(displayedAddress);
            setBalance(parsedBalance);
        };

        fetchBalance();
    }, []);

    return (
        <div>
            <Title>Account Info</Title>
            <Container>
                <InfoWrap>
                    <Address>Account Address</Address>
                    <Address>{address}</Address>
                </InfoWrap>
                <InfoWrap>
                    <Balance>ETH Balance</Balance>
                    <Balance>{balance} ETH</Balance>
                </InfoWrap>
            </Container>
        </div>
    );
};

export default Wallet;
