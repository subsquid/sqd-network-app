import { TransferDirection } from "./_transferDirection";
import { Account } from "./account.model";
import { Transfer } from "./transfer.model";
export declare class AccountTransfer {
    constructor(props?: Partial<AccountTransfer>);
    id: string;
    direction: TransferDirection;
    account: Account;
    transfer: Transfer;
    balance: bigint;
}
