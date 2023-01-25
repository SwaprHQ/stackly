import { ContractTransaction } from "ethers";
import { useEffect, useState } from "react";

interface TransactionListProps {
    transactions: ContractTransaction[];
}

interface TransactionContainerProps {
    transaction: ContractTransaction;
}

const spinner = {
    interval: 80,
    frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
};

export function ASCIISpinner(): JSX.Element {
    const [frame, setFrame] = useState(0);

    useEffect(() => {
        const inte = setInterval(() => {
            setFrame((prev) => {
                return prev + 1 === spinner.frames.length ? 0 : frame + 1;
            });
        }, spinner.interval);

        return () => clearInterval(inte);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <span>{spinner.frames[frame]}</span>;
}

export function TransactionContainer({
    transaction,
}: TransactionContainerProps) {
    const [isConfirmed, setIsConfirmed] = useState(false);

    useEffect(() => {
        transaction.wait().then(() => {
            setIsConfirmed(true);
        });
    }, [transaction]);

    return (
        <div>
            <a
                href={`https://etherscan.io/tx/${transaction.hash}`}
                target="_blank"
                rel="noreferrer"
            >
                View on etherscan
            </a>
            {isConfirmed ? "Confirmed" : <ASCIISpinner />}
        </div>
    );
}

export function TransactionList({ transactions }: TransactionListProps) {
    if (transactions.length === 0) return null;

    return (
        <div>
            <h3>Transactions</h3>
            <ul>
                {transactions.map((transaction) => (
                    <TransactionContainer transaction={transaction} />
                ))}
            </ul>
        </div>
    );
}
