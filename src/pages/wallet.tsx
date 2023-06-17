import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { tokenABI } from '../utils/tokenABI';
import { ETHEREUM_ADDRESS, USDC_ADDRESS, USDT_ADDRESS, TX_HASH1, TX_HASH2 } from '../utils/constants';
import styled from 'styled-components';
import Loader from '../components/Loader';
import ThemeBtn from '@/components/ThemeBtn';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin: 0 auto;
    padding: 5%;
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    min-width: 500px;
    max-width: 100%;
    box-sizing: border-box;
`;

const FirstContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
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
    color: ${({ theme }) => theme.colors.text};
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

const Balance = styled(Address)`
    display: flex;
    align-items: center;
`;

const EyeIcon = styled(AiOutlineEye)`
    margin-left: 5px;
    cursor: pointer;
`;

const EyeInvisibleIcon = styled(AiOutlineEyeInvisible)`
    margin-left: 5px;
    cursor: pointer;
`;

const TransactionTextWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 0 5%;
`;

const TxHash = styled.p`
    color: ${({ theme }) => theme.colors.text};
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
    const [showEthBalance, setShowEthBalance] = useState<boolean>(true);
    const [showUsdcBalance, setShowUsdcBalance] = useState<boolean>(true);
    const [showUsdtBalance, setShowUsdtBalance] = useState<boolean>(true);

    const fetchEthBalance = async (provider: ethers.JsonRpcProvider) => {
        const rawBalance = await provider.getBalance(ETHEREUM_ADDRESS);
        const parsedBalance = ethers.formatEther(rawBalance);
        const displayedAddress = `${ETHEREUM_ADDRESS.slice(0, 6)}...${ETHEREUM_ADDRESS.slice(-7)}`;
        setAddress(displayedAddress);
        setEthBalance(parsedBalance);
    };

    const fetchTokenBalances = async (provider: ethers.JsonRpcProvider) => {
        const usdcContract = new ethers.Contract(USDC_ADDRESS, tokenABI, provider);
        const usdtContract = new ethers.Contract(USDT_ADDRESS, tokenABI, provider);
        const [rawUsdcBalance, rawUsdtBalance] = await Promise.all([
            usdcContract.balanceOf(ETHEREUM_ADDRESS),
            usdtContract.balanceOf(ETHEREUM_ADDRESS),
        ]);

        const parsedUsdcBalance = ethers.formatUnits(rawUsdcBalance, 6);
        const parsedUsdtBalance = ethers.formatUnits(rawUsdtBalance, 6);

        setUsdcBalance(parsedUsdcBalance);
        setUsdtBalance(parsedUsdtBalance);
    };

    const fetchTransactions = async (provider: ethers.JsonRpcProvider, hashes: string[]) => {
        const transactionsData = (
            await Promise.all(hashes.map((hash: string) => provider.getTransaction(hash)))
        ).filter((tx): tx is ethers.TransactionResponse => tx !== null);
        setTransactions(transactionsData);
    };

    const fetchBalanceAndTransactions = async () => {
        const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_ALCHEMY_API);
        const balancePromise = fetchEthBalance(provider);
        const tokenBalancesPromise = fetchTokenBalances(provider);
        const hashes = [TX_HASH1, TX_HASH2];
        const transactionsPromise = fetchTransactions(provider, hashes);

        await Promise.all([balancePromise, tokenBalancesPromise, transactionsPromise]);
    };

    const toggleEthBalanceVisibility = () => {
        setShowEthBalance((prev) => !prev);
    };

    const toggleUsdcBalanceVisibility = () => {
        setShowUsdcBalance((prev) => !prev);
    };

    const toggleUsdtBalanceVisibility = () => {
        setShowUsdtBalance((prev) => !prev);
    };

    useEffect(() => {
        fetchBalanceAndTransactions();
    }, []);

    return (
        <div>
            <FirstContainer>
                <Title>Account Info</Title>
                <ThemeBtn />
            </FirstContainer>
            <Container>
                <InfoWrap>
                    <Address>Account Address</Address>
                    {!address ? <Loader /> : <Address>{address}</Address>}
                </InfoWrap>
                <InfoWrap>
                    <Balance>
                        ETH Balance{' '}
                        {showEthBalance ? (
                            <EyeIcon className='eye-icon' onClick={toggleEthBalanceVisibility} />
                        ) : (
                            <EyeInvisibleIcon className='eye-icon' onClick={toggleEthBalanceVisibility} />
                        )}
                    </Balance>
                    {!ethBalance ? <Loader /> : <Balance>{showEthBalance ? ethBalance : '***'}</Balance>}
                </InfoWrap>
            </Container>
            <Title>Transactions</Title>
            <Container>
                <TransactionTextWrapper>
                    <TxHash>TX Hash</TxHash>
                    <Block>Block</Block>
                </TransactionTextWrapper>
                {transactions.length == 0 ? (
                    <>
                        <TransLoadingInfoWrap>
                            <Loader />
                        </TransLoadingInfoWrap>
                        <TransLoadingInfoWrap>
                            <Loader />
                        </TransLoadingInfoWrap>
                    </>
                ) : (
                    transactions.map((tx, i) => (
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
                    ))
                )}
            </Container>
            <Title>Token Holdings</Title>
            <Container>
                <InfoWrap>
                    <TokenBalance>
                        USDC Balance
                        {showUsdcBalance ? (
                            <EyeIcon className='eye-icon' onClick={toggleUsdcBalanceVisibility} />
                        ) : (
                            <EyeInvisibleIcon className='eye-icon' onClick={toggleUsdcBalanceVisibility} />
                        )}
                    </TokenBalance>
                    {!usdcBalance ? <Loader /> : <TokenBalance>{showUsdcBalance ? usdcBalance : '***'}</TokenBalance>}
                </InfoWrap>
                <InfoWrap>
                    <TokenBalance>
                        USDT Balance
                        {showUsdtBalance ? (
                            <EyeIcon className='eye-icon' onClick={toggleUsdtBalanceVisibility} />
                        ) : (
                            <EyeInvisibleIcon className='eye-icon' onClick={toggleUsdtBalanceVisibility} />
                        )}
                    </TokenBalance>
                    {!usdtBalance ? <Loader /> : <TokenBalance>{showUsdtBalance ? usdtBalance : '***'}</TokenBalance>}
                </InfoWrap>
            </Container>
        </div>
    );
};

export default Wallet;
