import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin: 0 auto 50px;
    padding: 5%;
    background-color: rgb(241, 245, 247);
    color: #ccc;
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
    font-size: 22px;
    margin: 40px 0;
    color: #000;
    letter-spacing: 1px;
`;

const Balance = styled(Address)``;

const TransactionTextWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 0 5%;
`;

const TxHash = styled.p`
    color: black;
    margin: 0;
    font-size: 22px;
`;

const Block = styled(TxHash)`
    margin-right: 15px;
`;

const Transaction = styled(Address)`
    width: 100%;
`;

const HashBlockWrapper = styled.div`
    display: flex;
    justify-content: space-between;
`;

const Hash = styled.div``;

const BlockNumber = styled(Hash)`
    margin-right: 15px;
`;

const TransactionLine = styled.div`
    width: 100%;
    height: 3px;
    background-color: rgb(206, 209, 211);
    margin: 30px 0;
`;

const From = styled.div`
    font-size: 18px;
`;

const To = styled(From)`
    margin-top: 20px;
`;

const Wallet = () => {
    const [address, setAddress] = useState<string>('');
    const [balance, setBalance] = useState<string>('');
    const [transactions, setTransactions] = useState<ethers.TransactionResponse[]>([]);

    useEffect(() => {
        const fetchBalanceAndTransactions = async () => {
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

            const hashes = [
                '0x1eb6aab282d701d3d2eeb762bd426df625767e68ebf9c00b484905be1343304e',
                '0xf134054861dccf1f211e6fd92808475b2fb290489a4e41bc008260d8cc58b9f9',
            ];

            const transactionsData = (await Promise.all(hashes.map((hash) => provider.getTransaction(hash)))).filter(
                (tx): tx is ethers.TransactionResponse => tx !== null
            );

            setTransactions(transactionsData);
        };

        fetchBalanceAndTransactions();
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
            <Title>Transactions</Title>
            <Container>
                <TransactionTextWrapper>
                    <TxHash>TX Hash</TxHash>
                    <Block>Block</Block>
                </TransactionTextWrapper>
                {transactions.map((tx, i) => (
                    <InfoWrap key={i}>
                        <Transaction>
                            <HashBlockWrapper>
                                <Hash>{`${tx.hash.slice(0, 6)}...${tx.hash.slice(-7)}`}</Hash>
                                <BlockNumber>{tx.blockNumber}</BlockNumber>
                            </HashBlockWrapper>
                            <TransactionLine />
                            <From>from: {tx.from}</From>
                            <To>to: {tx.to}</To>
                        </Transaction>
                    </InfoWrap>
                ))}
            </Container>
        </div>
    );
};

export default Wallet;
