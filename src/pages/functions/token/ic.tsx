import { useEffect, useState } from 'react';
import { useLocation, type NavigateFunction } from 'react-router-dom';

import Icon from '~components/icon';
import { FusePage } from '~components/layouts/page';
import { FusePageTransition } from '~components/layouts/transition';
import { useCurrentState } from '~hooks/memo/current_state';
import { useGoto } from '~hooks/memo/goto';
import { useSonnerToast } from '~hooks/toast';
import { FunctionHeader } from '~pages/functions/components/header';

function FunctionTokenIcPage() {
    const current_state = useCurrentState();

    const { setHide, goto: _goto, navigate } = useGoto();

    const location = useLocation();
    const [canister_id, setCanisterId] = useState<string>();

    useEffect(() => {
        const canister_id = location.state.canister_id;
        if (!canister_id) return _goto(-1);
        setCanisterId(canister_id);
    }, [_goto, location]);

    if (!canister_id) return <></>;
    return (
        <FusePage current_state={current_state} options={{ refresh_token_info_ic_sleep: 1000 * 60 * 5 }}>
            <FusePageTransition setHide={setHide}>
                <div className="relative flex h-full w-full flex-col items-center justify-start pt-[52px]">
                    <FunctionHeader title={'Token xxx'} onBack={() => _goto('/')} onClose={() => _goto('/')} />

                    <InnerPage canister_id={canister_id} navigate={navigate} />
                </div>
            </FusePageTransition>
        </FusePage>
    );
}

export default FunctionTokenIcPage;

const InnerPage = ({ canister_id, navigate }: { canister_id: string; navigate: NavigateFunction }) => {
    const toast = useSonnerToast();

    // test
    const text =
        'The Internet Computer is a public blockchain network enabled by new science from first principles. It is millions of times more powerful and can replace clouds and traditional IT. The network – created by ICP, or Internet Computer Protocol – is orchestrated by permissionless decentralized governance and is hosted on sovereign hardware devices run by independent parties. Its purpose is to extend the public internet with native cloud computing functionality.';
    const [isExpanded, setIsExpanded] = useState(false);
    const truncatedText = text.slice(0, 200);
    const shouldTruncate = text.length > 200;
    return (
        <div className="mt-3 w-full flex-1 overflow-y-auto">
            <div className="flex w-full items-center px-5">
                <img
                    src="https://metrics.icpex.org/images/ryjl3-tyaaa-aaaaa-aaaba-cai.png"
                    className="mr-2 h-10 w-10 rounded-full"
                />
                <div className="w-auto">
                    <div className="block text-sm text-[#999999]">
                        <strong className="pr-3 text-base text-[#EEEEEE]">Internet Computer</strong>
                        ICP
                    </div>
                    <div className="m-1 block text-sm text-[#999999]">
                        $10.97
                        <span className="ml-2 rounded-sm bg-[#193620] px-2 py-[1px] text-[#00C431]">+2.8%</span>
                    </div>
                </div>
            </div>
            <div className="my-4 px-5">
                <div className="flex items-center">
                    <strong className="text-4xl text-[#FFCF13]">800.1203</strong>
                    <Icon name="icon-wallet" className="ml-3 h-4 w-4 text-[#999999]" />
                </div>
                <span className="block w-full text-sm text-[#999999]">≈$8,160.91</span>
            </div>
            <div className="my-2 flex w-full items-center justify-between px-5">
                {[
                    {
                        callback: () => navigate('/home/token/ic/transfer', { state: { canister_id } }),
                        icon: 'icon-send',
                        name: 'Send',
                    },
                    {
                        callback: () => navigate('/home/token/ic/receive'),
                        icon: 'icon-receive',
                        name: 'Receive',
                    },
                    {
                        callback: () => {
                            toast.info('Come soon');
                            // navigate('/home/swap')
                        },
                        icon: 'icon-swap',
                        name: 'Swap',
                    },
                    {
                        callback: () => {
                            toast.info('Come soon');
                        },
                        icon: 'icon-history',
                        name: 'History',
                    },
                ].map(({ callback, icon, name }) => (
                    <div
                        key={icon}
                        onClick={callback}
                        className="flex h-[70px] w-[70px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-[#333333] transition duration-300 hover:border-[#FFCF13]"
                    >
                        <Icon name={icon} className="h-[20px] w-[20px] cursor-pointer font-semibold text-[#FFCF13]" />
                        <span className="pt-1 text-xs text-[#EEEEEE]">{name}</span>
                    </div>
                ))}
            </div>
            <div className="flex w-full flex-col px-5">
                <h3 className="py-2 text-sm text-[#999999]">About</h3>
                <div className="text-sm">
                    {isExpanded ? text : truncatedText}
                    {shouldTruncate && (
                        <>
                            {!isExpanded && '...'}
                            <span
                                className="ml-2 cursor-pointer text-[#FFCF13]"
                                onClick={() => setIsExpanded(!isExpanded)}
                            >
                                {isExpanded ? 'Less' : 'More'}
                            </span>
                        </>
                    )}
                </div>
                <div className="mt-5 w-full rounded-xl bg-[#181818]">
                    <div className="flex w-full items-center justify-between px-3 py-2 text-sm">
                        <span className="text-[#999999]">Market cap</span>
                        <span>$4,967,486,846</span>
                    </div>
                    <div className="flex w-full items-center justify-between px-3 py-2 text-sm">
                        <span className="text-[#999999]">FDV</span>
                        <span>$5,479,917,847</span>
                    </div>
                    <div className="flex w-full items-center justify-between px-3 py-2 text-sm">
                        <span className="text-[#999999]">Circulating Supply</span>
                        <span>479,349,112</span>
                    </div>
                    <div className="flex w-full items-center justify-between px-3 py-2 text-sm">
                        <span className="text-[#999999]">Total supply</span>
                        <span>528,797,325</span>
                    </div>
                    <div className="flex w-full items-center p-3">
                        <Icon name="icon-web" className="h-4 w-4 cursor-pointer duration-300 hover:text-[#FFCF13]" />
                        <Icon name="icon-x" className="mx-3 h-3 w-3 cursor-pointer duration-300 hover:text-[#FFCF13]" />
                        <Icon
                            name="icon-discord"
                            className="h-4 w-4 cursor-pointer duration-300 hover:text-[#FFCF13]"
                        />
                    </div>
                </div>
            </div>

            <div className="mt-5 w-full pb-5">
                <h3 className="block px-5 pb-4 text-sm text-[#999999]">Transactions</h3>
                {/* test data */}
                <div className="flex w-full flex-col">
                    <span className="px-5 py-[5px] text-xs text-[#999999]">02/24/2025</span>
                    <div className="flex w-full cursor-pointer items-center justify-between px-5 py-[10px] transition duration-300 hover:bg-[#333333]">
                        <div className="flex items-center">
                            <img
                                src="https://metrics.icpex.org/images/ryjl3-tyaaa-aaaaa-aaaba-cai.png"
                                className="h-10 w-10 rounded-full"
                            />
                            <div className="ml-[10px]">
                                <strong className="block text-base text-[#EEEEEE]">Send</strong>
                                <span className="text-xs text-[#999999]">To uyrhg...cqe</span>
                            </div>
                        </div>
                        <div className="text-base font-semibold text-[#EEEEEE]">-11.55 ICP</div>
                    </div>
                    <div className="flex w-full cursor-pointer items-center justify-between px-5 py-[10px] transition duration-300 hover:bg-[#333333]">
                        <div className="flex items-center">
                            <img
                                src="https://metrics.icpex.org/images/ryjl3-tyaaa-aaaaa-aaaba-cai.png"
                                className="h-10 w-10 rounded-full"
                            />
                            <div className="ml-[10px]">
                                <strong className="block text-base text-[#EEEEEE]">Swap</strong>
                                <span className="text-xs text-[#999999]">To ICS</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="text-sm text-[#999999]">-1.34 ICP</div>
                            <div className="text-base font-semibold text-[#00C431]">+42,582.76 ICS</div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col">
                    <span className="px-5 py-[5px] text-xs text-[#999999]">01/20/2025</span>
                    <div className="flex w-full cursor-pointer items-center justify-between px-5 py-[10px] transition duration-300 hover:bg-[#333333]">
                        <div className="flex items-center">
                            <img
                                src="https://metrics.icpex.org/images/xevnm-gaaaa-aaaar-qafnq-cai.png"
                                className="h-10 w-10 rounded-full"
                            />
                            <div className="ml-[10px]">
                                <strong className="block text-base text-[#EEEEEE]">Send</strong>
                                <span className="text-xs text-[#999999]">To uyrhg...cqe</span>
                            </div>
                        </div>
                        <div className="text-base font-semibold text-[#EEEEEE]">-374 ckUSDC</div>
                    </div>
                    <div className="flex w-full cursor-pointer items-center justify-between px-5 py-[10px] transition duration-300 hover:bg-[#333333]">
                        <div className="flex items-center">
                            <img
                                src="https://metrics.icpex.org/images/ryjl3-tyaaa-aaaaa-aaaba-cai.png"
                                className="h-10 w-10 rounded-full"
                            />
                            <div className="ml-[10px]">
                                <strong className="block text-base text-[#EEEEEE]">Reveive</strong>
                                <span className="text-xs text-[#999999]">From 87bba...413</span>
                            </div>
                        </div>
                        <div className="text-base font-semibold text-[#00C431]">+36.98 ICP</div>
                    </div>
                    <div className="flex w-full cursor-pointer items-center justify-between px-5 py-[10px] transition duration-300 hover:bg-[#333333]">
                        <div className="flex items-center">
                            <img
                                src="https://metrics.icpex.org/images/o64gq-3qaaa-aaaam-acfla-cai.png"
                                className="h-10 w-10 rounded-full"
                            />
                            <div className="ml-[10px]">
                                <strong className="block text-base text-[#EEEEEE]">Reveive</strong>
                                <span className="text-xs text-[#999999]">From 87bba...413</span>
                            </div>
                        </div>
                        <div className="text-base font-semibold text-[#00C431]">+92,387,862 ICU</div>
                    </div>
                    <div className="flex w-full cursor-pointer items-center justify-between px-5 py-[10px] transition duration-300 hover:bg-[#333333]">
                        <div className="flex items-center">
                            <img
                                src="https://app.icpswap.com/images/tokens/ca6gz-lqaaa-aaaaq-aacwa-cai.png"
                                className="h-10 w-10 rounded-full"
                            />
                            <div className="ml-[10px]">
                                <strong className="block text-base text-[#EEEEEE]">Swap</strong>
                                <span className="text-xs text-[#999999]">To ICS</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="text-sm text-[#999999]">-3.8 ICP</div>
                            <div className="text-base font-semibold text-[#00C431]">+89,452.34 ICS</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
