import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { tokenABI } from '../utils/tokenABI';
import { ETHEREUM_ADDRESS, USDC_ADDRESS, USDT_ADDRESS, TX_HASH1, TX_HASH2 } from './constants';
import styled from 'styled-components';
import Loader from '../components/Loader';

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
    align-items: center;
    background-color: rgb(255, 255, 255);
    padding: 0 5%;
`;

const TransLoadingInfoWrap = styled(InfoWrap)`
    justify-content: center;
    height: 231px;
`;

const Title = styled.p`
    color: #000;
    font-size: 28px;
    font-weight: 600;
    letter-spacing: 1px;
`;

const Address = styled.div`
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

const TokenBalance = styled(Balance)``;

const Wallet = () => {
    const [address, setAddress] = useState<string>('');
    const [ethBalance, setEthBalance] = useState<string>('');
    const [usdcBalance, setUsdcBalance] = useState<string>('');
    const [usdtBalance, setUsdtBalance] = useState<string>('');
    const [transactions, setTransactions] = useState<ethers.TransactionResponse[]>([]);

    useEffect(() => {
        const fetchBalanceAndTransactions = async () => {
            const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_ALCHEMY_API);
            const rawBalance = await provider.getBalance(ETHEREUM_ADDRESS);
            const parsedBalance = ethers.formatEther(rawBalance);
            const displayedAddress = `${ETHEREUM_ADDRESS.slice(0, 6)}...${ETHEREUM_ADDRESS.slice(-7)}`;

            setAddress(displayedAddress);
            setEthBalance(parsedBalance);

            const usdcContract = new ethers.Contract(USDC_ADDRESS, tokenABI, provider);
            const usdtContract = new ethers.Contract(USDT_ADDRESS, tokenABI, provider);

            const rawUsdcBalance = await usdcContract.balanceOf(ETHEREUM_ADDRESS);
            const parsedUsdcBalance = ethers.formatUnits(rawUsdcBalance, 6);

            const rawUsdtBalance = await usdtContract.balanceOf(ETHEREUM_ADDRESS);
            const parsedUsdtBalance = ethers.formatUnits(rawUsdtBalance, 6);

            setUsdcBalance(parsedUsdcBalance);
            setUsdtBalance(parsedUsdtBalance);

            const hashes = [TX_HASH1, TX_HASH2];

            const transactionsData = (await Promise.all(hashes.map((hash) => provider.getTransaction(hash)))).filter(
                (tx): tx is ethers.TransactionResponse => tx !== null
            );

            setTransactions(transactionsData);
        };

        fetchBalanceAndTransactions();
    }, []);

    return (
        <div>
            <>
                <Title>Account Info</Title>
                <Container>
                    <InfoWrap>
                        <Address>Account Address</Address>
                        {address === '' ? <Loader /> : <Address>{address}</Address>}
                    </InfoWrap>
                    <InfoWrap>
                        <Balance>ETH Balance</Balance>
                        {ethBalance === '' ? <Loader /> : <Balance>{ethBalance} ETH</Balance>}
                    </InfoWrap>
                </Container>
                <Title>Transactions</Title>
                <Container>
                    <TransactionTextWrapper>
                        <TxHash>TX Hash</TxHash>
                        <Block>Block</Block>
                    </TransactionTextWrapper>
                    {transactions.length == 0 && (
                        <>
                            <TransLoadingInfoWrap>
                                <Loader />
                            </TransLoadingInfoWrap>
                            <TransLoadingInfoWrap>
                                <Loader />
                            </TransLoadingInfoWrap>
                        </>
                    )}
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
                <Title>Token Holdings</Title>
                <Container>
                    <InfoWrap>
                        <TokenBalance>USDC Balance</TokenBalance>
                        {usdcBalance === '' ? <Loader /> : <TokenBalance>{usdcBalance} USDC</TokenBalance>}
                    </InfoWrap>
                    <InfoWrap>
                        <TokenBalance>USDT Balance</TokenBalance>
                        {usdtBalance === '' ? <Loader /> : <TokenBalance>{usdtBalance} USDT</TokenBalance>}
                    </InfoWrap>
                </Container>
            </>
        </div>
    );
};

export default Wallet;
