import { useRef } from 'react';

import { FusePage } from '~components/layouts/page';
import { FusePageTransition } from '~components/layouts/transition';
import { useCurrentState } from '~hooks/memo/current_state';
import { useGoto } from '~hooks/memo/goto';
import { useTokenInfoCurrentRead } from '~hooks/store/local';
import { useIdentityKeys } from '~hooks/store/local-secure';
import { useTokenPrices } from '~hooks/store/local/memo/price';
import { useSonnerToast } from '~hooks/toast';
import { group_tokens_by_chain } from '~types/tokens';

import { FunctionHeader } from '../components/header';
import { AccountItem } from './components/account-item';
import { AddWalletDrawer } from './components/add-wallet-drawer';

function FunctionSwitchAccountPage() {
    const toast = useSonnerToast();

    const current_state = useCurrentState();
    const { setHide, goto: _goto } = useGoto();

    const { current_identity, main_mnemonic_identity, identity_list, pushIdentityByMainMnemonic } = useIdentityKeys();

    const current_tokens = useTokenInfoCurrentRead();
    const tokens_by_chain = group_tokens_by_chain(current_tokens);
    const token_prices = useTokenPrices(current_tokens, tokens_by_chain);
    const ref = useRef<HTMLDivElement>(null);

    return (
        <FusePage current_state={current_state} options={{ refresh_token_info_ic_sleep: 1000 * 60 * 5 }}>
            <div ref={ref} className="relative h-full w-full overflow-hidden">
                <FusePageTransition setHide={setHide}>
                    <div className="relative flex h-full w-full flex-col items-center justify-start pt-[52px]">
                        <FunctionHeader title={'Switch Wallets'} onBack={() => _goto(-1)} onClose={() => _goto('/')} />

                        <div className="flex h-full w-full flex-col justify-between">
                            <div className="flex w-full flex-1 flex-col gap-y-4 overflow-y-auto px-5 pb-5 pt-5">
                                {(identity_list ?? []).map((wallet) => (
                                    <AccountItem
                                        key={wallet.id}
                                        wallet={wallet}
                                        current_identity={current_identity}
                                        token_prices={token_prices}
                                        current_tokens={current_tokens}
                                    />
                                ))}
                            </div>

                            <AddWalletDrawer
                                trigger={
                                    <div className="p-5">
                                        <div className="flex h-12 w-full items-center justify-center rounded-xl bg-[#FFCF13] text-lg font-semibold text-black">
                                            Add wallet
                                        </div>
                                    </div>
                                }
                                container={ref.current ?? undefined}
                                onAddWalletByMainMnemonic={() => {
                                    pushIdentityByMainMnemonic().then((r) => {
                                        if (r === undefined) return;
                                        if (r === false) return;
                                        // notice successful
                                        toast.success('Create Account Success');
                                    });
                                }}
                                goto={_goto}
                                has_main_mnemonic={!!main_mnemonic_identity}
                                import_prefix={'/home/switch/account/import'}
                            />
                        </div>
                    </div>
                </FusePageTransition>
            </div>
        </FusePage>
    );
}

export default FunctionSwitchAccountPage;
