import dayjs from 'dayjs';
import { useMemo, useState } from 'react';

import { FusePage } from '~components/layouts/page';
import { FusePageTransition } from '~components/layouts/transition';
import { useCurrentState } from '~hooks/memo/current_state';
import { useGoto } from '~hooks/memo/goto';
import { useCurrentIdentity } from '~hooks/store/local-secure';
import { useFuseRecordList } from '~hooks/store/local/memo/record';
import type { FuseRecord } from '~types/records';
import type { ApprovedIcRecord } from '~types/records/approved/approved_ic';
import type { ConnectedRecord } from '~types/records/connected';
import type { TokenTransferredIcRecord } from '~types/records/token/transferred_ic';

import { FunctionHeader } from '../components/header';
import RecordDetailDrawer from './components/record-detail-drawer';
import { RecordItem, RecordNoData, RecordSkeleton } from './components/record-list';

function FunctionRecordsPage() {
    const current_state = useCurrentState();
    const { setHide, goto } = useGoto();
    const { current_identity_network } = useCurrentIdentity();

    const [list, { done, load }] = useFuseRecordList(current_identity_network);
    console.debug(`🚀 ~ RecordPage ~ list:`, list, done, load);

    const [isOpen, setIsOpen] = useState(false);
    const [currentDetail, setCurrentDetail] = useState<FuseRecord | undefined>(undefined);

    const handleOpenDetail = (item: FuseRecord) => {
        setIsOpen(true);
        setCurrentDetail(item);
    };

    const getDateString = (timestamp: number) => dayjs(timestamp).format('MM/DD/YYYY');

    const groupedRecords = useMemo(() => {
        return list.reduce<Record<string, FuseRecord[]>>((acc, item) => {
            const entryType = Object.keys(item)[0] as keyof FuseRecord;
            const created = (item[entryType] as ConnectedRecord | TokenTransferredIcRecord | ApprovedIcRecord)?.created;

            if (created) {
                const dateKey = getDateString(created);
                (acc[dateKey] ||= []).push(item);
            }

            return acc;
        }, {});
    }, [list]);

    return (
        <FusePage current_state={current_state}>
            <FusePageTransition setHide={setHide}>
                <div className="relative flex h-full w-full flex-col items-center justify-start pt-[52px]">
                    <FunctionHeader title="History" onBack={() => goto('/')} />

                    <div className="w-full flex-1 overflow-y-auto">
                        {!done ? (
                            <RecordSkeleton />
                        ) : list.length === 0 ? (
                            <RecordNoData />
                        ) : (
                            <div className="flex flex-col">
                                {Object.entries(groupedRecords).map(([date, records]) => (
                                    <div key={date} className="flex flex-col">
                                        <div className="px-5 py-[5px] text-xs text-[#999999]">{date}</div>
                                        {records.map((record, idx) => (
                                            <RecordItem
                                                key={idx}
                                                itemData={record}
                                                handleOpenDetail={handleOpenDetail}
                                            />
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {currentDetail && (
                        <RecordDetailDrawer isOpen={isOpen} setIsOpen={setIsOpen} currentDetail={currentDetail} />
                    )}
                </div>
            </FusePageTransition>
        </FusePage>
    );
}

export default FunctionRecordsPage;
