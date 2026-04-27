import { AccountType } from "./_accountType";
import { AccountTransfer } from "./accountTransfer.model";
import { Transfer } from "./transfer.model";
export declare class Account {
    constructor(props?: Partial<Account>);
    id: string;
    type: AccountType;
    balance: bigint;
    owner: Account | undefined | null;
    owned: Account[];
    transfers: AccountTransfer[];
    transfersTo: Transfer[];
    transfersFrom: Transfer[];
    claimableDelegationCount: number;
}
