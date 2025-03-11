import { useEffect, useMemo, useState } from 'react';

import Icon from '~components/icon';
import { cn } from '~lib/utils/cn';
import { truncate_text } from '~lib/utils/text';
import type { FuseRecord } from '~types/records';
import type { ApprovedIcRecord } from '~types/records/approved/approved_ic';
import type { ConnectedRecord } from '~types/records/connected';
import type { TokenTransferredIcRecord } from '~types/records/token/transferred_ic';

export const RecordNoData = () => {
    return (
        <div className="flex h-full w-full flex-col items-center justify-center">
            <Icon name="icon-empty" className="h-[70px] w-[70px] text-[#999999]" />
            <p className="text-sm text-[#999999]">No data found</p>
        </div>
    );
};

export const RecordSkeleton = () => {
    return (
        <div className="flex h-full w-full flex-col items-center justify-center">
            <Icon name="icon-loading" className="mb-1 h-[24px] w-[24px] animate-spin text-[#999999]" />
            <p className="text-sm text-[#999999]">loading...</p>
        </div>
    );
};

const RecordItemConnected = ({ value }: { value: ConnectedRecord }) => {
    console.log('🚀 ~ RecordItemConnected ~ value:', value);

    return (
        <>
            <div className="flex items-center">
                {value?.favicon ? (
                    <img src={value.favicon} className="h-10 w-10 rounded-full" />
                ) : (
                    <Icon name="icon-web" className="h-10 w-10 rounded-full"></Icon>
                )}
                <div className="ml-[10px]">
                    <strong className="block text-base text-[#EEEEEE]">Connected</strong>
                    <p className="max-w-[150px] truncate text-xs text-[#999999]">To {value.title}</p>
                </div>
            </div>
            <p className="max-w-[150px] truncate text-base font-semibold text-[#EEEEEE]">{value.origin}</p>
        </>
    );
};

const RecordItemApprovedIc = ({ value }: { value: ApprovedIcRecord }) => {
    const [args, setArgs] = useState<
        | {
              owner: string;
              amount: number;
              memo: null;
              fee: null;
              from_subaccount: null;
              created_at_time: null;
          }
        | undefined
    >(undefined);

    useEffect(() => {
        if (!value) return;

        const arg = {
            owner: 'ylpwz-52h2c-fvw26-jp5os-4e4r6-lh4tk-iqbjd-qve3t-t3qtz-nwylo-wae',
            amount: 1000000000000,
            memo: null,
            fee: null,
            from_subaccount: null,
            created_at_time: null,
        };
        setArgs(arg);
    }, [value]);

    return (
        <>
            <div className="flex items-center">
                <img
                    src="https://metrics.icpex.org/images/ryjl3-tyaaa-aaaaa-aaaba-cai.png"
                    className="h-10 w-10 rounded-full"
                />
                <div className="ml-[10px]">
                    <strong className="block text-base text-[#EEEEEE]">Send</strong>
                    <span className="text-xs text-[#999999]">To {truncate_text(args?.owner || '')}</span>
                </div>
            </div>
            <div className={cn('text-base font-semibold text-[#EEEEEE]')}>
                {args?.amount ? args.amount ** 10 * 8 : '--'} ICP
            </div>
        </>
    );
};

const RecordItemTokenTransferredIc = ({ value }: { value: TokenTransferredIcRecord }) => {
    console.log('🚀 ~ RecordItemTokenTransferredIc ~ value:', value);
    return <>RecordItemTokenTransferredIc</>;
};

export const RecordItem = ({
    itemData,
    handleOpenDetail,
}: {
    itemData: FuseRecord;
    handleOpenDetail: (itemData: FuseRecord) => void;
}) => {
    const [key, value] = useMemo(() => {
        const entries = Object.entries(itemData);
        return entries.length > 0 ? entries[0] : [null, null];
    }, [itemData]);

    if (!key || !value) return null;

    return (
        <>
            <div
                className="flex w-full cursor-pointer items-center justify-between px-5 py-[10px] transition duration-300 hover:bg-[#333333]"
                onClick={() => handleOpenDetail(itemData)}
            >
                {key === 'connected' && <RecordItemConnected value={value} />}

                {key === 'approved_ic' && <RecordItemApprovedIc value={value} />}

                {/* ! Need test data */}
                {key === 'token_transferred_ic' && <RecordItemTokenTransferredIc value={value} />}
            </div>
        </>
    );
};
