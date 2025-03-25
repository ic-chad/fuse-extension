import { anonymous, isCanisterIdText } from '@choptop/haw';
import { Button, Skeleton } from '@heroui/react';
import BigNumber from 'bignumber.js';
import CHAIN_BSC_SVG from 'data-base64:~assets/svg/chains/bsc.svg';
import CHAIN_ETH_SVG from 'data-base64:~assets/svg/chains/eth.svg';
import CHAIN_IC_SVG from 'data-base64:~assets/svg/chains/ic.min.svg';
import CHAIN_POL_SVG from 'data-base64:~assets/svg/chains/pol.svg';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Address } from 'viem';

import Icon from '~components/icon';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '~components/ui/drawer';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '~components/ui/select';
import { useERC20Metadata } from '~hooks/evm/contracts/multicall/read';
import { get_cached_data } from '~hooks/store/local';
import { useAllChainNetworks } from '~hooks/store/local-secure';
import { get_token_info_ic } from '~hooks/store/local/token/ic/info';
import { icrc1_logo } from '~lib/canisters/icrc1';
import { cn } from '~lib/utils/cn';
import type { Chain, EvmChain } from '~types/chain';
import type { AnyTokenInfo, CombinedTokenInfo } from '~types/tokens';
import { BscTokenStandard } from '~types/tokens/chain/bsc';
import { EthereumTokenStandard } from '~types/tokens/chain/ethereum';
import type { IcTokenInfo } from '~types/tokens/chain/ic';
import { PolygonTokenStandard } from '~types/tokens/chain/polygon';
import { get_token_logo, get_token_logo_key } from '~types/tokens/preset';

const CustomTokenDrawer = ({
    trigger,
    container,
    isTokenExist,
    pushIcToken,
    pushCustomToken,
}: {
    trigger: React.ReactNode;
    container?: HTMLElement | null;
    isTokenExist: (token: { chain: Chain; address: string }) => boolean;
    pushIcToken: (token: IcTokenInfo) => Promise<void>;
    pushCustomToken: (token: AnyTokenInfo, chain: Chain) => Promise<void>;
}) => {
    const [chain_networks] = useAllChainNetworks();

    const [open, setOpen] = useState(false);

    const [address, setAddress] = useState<string>('');
    const [evmAddress, setEvmAddress] = useState<string>('');
    const [chain, setChain] = useState<Chain>();
    const [evmChain, setEvmChain] = useState<EvmChain>('ethereum');

    const isCanisterId = useMemo(() => isCanisterIdText(address), [address]);
    // 校验是否是evm 合约地址
    const isValidEvmAddress = useMemo(() => {
        if (!evmAddress) return true;
        return /^0x[a-fA-F0-9]{40}$/.test(evmAddress);
    }, [evmAddress]);

    const isExist = useMemo(() => {
        if (isCanisterId) return isTokenExist({ chain: 'ic', address });
        return false;
    }, [isCanisterId, isTokenExist, address]);

    const isEvmExist = useMemo(() => {
        if (!evmChain) return false;

        return isTokenExist({ chain: evmChain, address: evmAddress });
        // return false;
    }, [evmChain, isTokenExist, evmAddress]);

    const [ic_token, setIcToken] = useState<IcTokenInfo>();
    const [evm_token, setEvmToken] = useState<AnyTokenInfo>();

    const [pushing, setPushing] = useState(false);

    const getLogo = (chain: Chain) => {
        if (chain === 'ic') return CHAIN_IC_SVG;
        if (chain.indexOf('ethereum') >= 0) return CHAIN_ETH_SVG;
        if (chain.indexOf('pol') >= 0) return CHAIN_POL_SVG;
        if (chain.indexOf('bsc') >= 0) return CHAIN_BSC_SVG;
    };

    const onSelectChange = (val: Chain) => {
        setChain(val);
        if (val === 'ic') return;
        setEvmChain(val as EvmChain);
    };

    const onPushToken = () => {
        if (!chain) return;

        if (pushing) return;

        if (chain === 'ic') {
            if (isCanisterId && !ic_token) return;

            if (isCanisterId && ic_token) {
                setPushing(true);
                pushIcToken(ic_token)
                    .then(() => setOpen(false))
                    .finally(() => setPushing(false));
            }
            return;
        }

        if (evmAddress && !evm_token) return;

        if (evmAddress && evm_token) {
            setPushing(true);
            pushCustomToken(evm_token, chain)
                .then(() => setOpen(false))
                .finally(() => setPushing(false));
        }
    };

    const icBtnDisable = chain === 'ic' && (!isCanisterId || !ic_token || isExist);
    const evmBtnDisable = chain !== 'ic' && (!evmAddress || !evm_token || isEvmExist);

    return (
        <Drawer open={open} onOpenChange={setOpen} container={container}>
            <DrawerTrigger>{trigger}</DrawerTrigger>
            <DrawerContent
                className="flex h-full !max-h-full w-full flex-col items-center justify-between border-0 bg-transparent pt-[50px]"
                overlayClassName="bg-black/50"
            >
                <DrawerHeader className="w-full shrink-0 border-t border-[#333333] bg-[#0a0600] px-5 pb-0 pt-1 text-left">
                    <DrawerTitle>
                        <div className="flex w-full items-center justify-between py-3">
                            <span className="text-sm text-white">Add Custom Token</span>
                            <DrawerClose>
                                <span className="cursor-pointer text-sm text-[#FFCF13] transition duration-300 hover:opacity-85">
                                    Close
                                </span>
                            </DrawerClose>
                        </div>
                    </DrawerTitle>
                    <DrawerDescription className="hidden" />
                </DrawerHeader>

                <div className="flex h-full w-full shrink flex-col justify-between bg-[#0a0600] px-5 pb-5">
                    <div className="w-full flex-1 flex-col">
                        <div className="mt-3 w-full">
                            <div className="w-full">
                                <label className="block py-3 text-sm">Network</label>
                                <Select onValueChange={(val) => onSelectChange(val as Chain)}>
                                    <SelectTrigger className="!h-[48px] w-full rounded-xl border border-[#333333] bg-[#0a0600] px-3 text-sm outline-none transition duration-300 hover:border-[#FFCF13] focus:border-[#FFCF13]">
                                        <SelectValue className="!h-[48px] !w-full" placeholder="Select Network" />
                                    </SelectTrigger>
                                    <SelectContent className="w-full rounded-xl border border-[#333333] bg-[#0a0600] text-sm">
                                        {chain_networks.map((net) => {
                                            return (
                                                <SelectItem
                                                    key={net.chain}
                                                    value={net.chain}
                                                    className="h-[44px] w-full !bg-[#0a0600] px-3 text-sm text-[#eee] outline-none hover:!bg-[#2B2B2B] hover:!text-[#eee] active:!text-[#eee]"
                                                >
                                                    <div className="justify- flex h-full w-full items-center gap-x-2 text-[#eee]">
                                                        <div className="h-7 w-7 rounded-full">
                                                            <img
                                                                src={getLogo(net.chain)}
                                                                alt=""
                                                                className="h-full w-full rounded-full"
                                                            />
                                                        </div>
                                                        {net.name}
                                                    </div>
                                                </SelectItem>
                                            );
                                        })}
                                        <SelectGroup></SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* ic  */}
                        {chain && chain === 'ic' && (
                            <div className="mt-3 w-full">
                                <div className="w-full">
                                    <label className="block py-3 text-sm">Canister ID</label>
                                    <input
                                        type="text"
                                        className={cn(
                                            'h-[48px] w-full rounded-xl border border-[#333333] bg-transparent px-3 text-sm outline-none transition duration-300 hover:border-[#FFCF13] focus:border-[#FFCF13]',
                                            !isCanisterId && address && '!border-red-500 hover:!border-red-500',
                                        )}
                                        placeholder="Enter canister id"
                                        onChange={(e) => setAddress(e.target.value)}
                                        value={address}
                                    />
                                </div>
                                <div className="mt-2 w-full">
                                    {!isCanisterId && !address && <div> </div>}
                                    {!isCanisterId && address && (
                                        <div className="text-red-500"> Wrong Canister Id </div>
                                    )}
                                    {isCanisterId && (
                                        <LoadCanisterInfo
                                            canister_id={address}
                                            token={ic_token}
                                            setToken={setIcToken}
                                        />
                                    )}
                                </div>
                            </div>
                        )}

                        {chain && chain !== 'ic' && (
                            <div className="mt-3 w-full">
                                <div className="w-full">
                                    <label className="block py-3 text-sm">Contract address</label>
                                    <input
                                        type="text"
                                        className={cn(
                                            'h-[48px] w-full rounded-xl border border-[#333333] bg-transparent px-3 text-sm outline-none transition duration-300 hover:border-[#FFCF13] focus:border-[#FFCF13]',
                                            !isValidEvmAddress && evmAddress && '!border-red-500 hover:!border-red-500',
                                        )}
                                        placeholder="Contract address"
                                        onChange={(e) => setEvmAddress(e.target.value)}
                                        value={evmAddress}
                                    />
                                </div>
                                <div className="mt-2 w-full">
                                    {isEvmExist && evmAddress && (
                                        <div className="text-red-500">Token already exists</div>
                                    )}
                                    {!isValidEvmAddress && evmAddress && (
                                        <div className="text-red-500"> Invalid EVM address</div>
                                    )}
                                    {/* show token info */}
                                    {evmAddress && evmChain && (
                                        <LoadEvmCustomTokenInfo
                                            chain={evmChain as EvmChain}
                                            address={evmAddress as Address}
                                            token={evm_token}
                                            setToken={setEvmToken}
                                        />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <Button
                        className="h-[48px] shrink-0 bg-[#FFCF13] text-lg font-semibold text-black"
                        isDisabled={icBtnDisable || evmBtnDisable || pushing}
                        onPress={() => onPushToken()}
                    >
                        Add Token
                    </Button>
                </div>
            </DrawerContent>
        </Drawer>
    );
};

export default CustomTokenDrawer;

const LoadEvmCustomTokenInfo = ({
    chain,
    address,
    token,
    setToken,
}: {
    chain: EvmChain;
    address: Address;
    token: AnyTokenInfo | undefined;
    setToken: (token: AnyTokenInfo) => void;
}) => {
    const { metadata, isError, isSuccess } = useERC20Metadata(chain, address);
    const [logo, setLogo] = useState<string>();

    const getTokenStandard = useCallback(() => {
        if (chain.indexOf('ethereum') >= 0) {
            return EthereumTokenStandard.ERC20;
        }
        if (chain.indexOf('polygon') >= 0) {
            return PolygonTokenStandard.ERC20;
        }
        if (chain.indexOf('bsc') >= 0) {
            return BscTokenStandard.BEP20;
        }
    }, [chain]);

    useEffect(() => {
        if (!address || !chain) return;
        if (token && token.address === address) return;

        if (isSuccess && metadata) {
            const tokenData = { ...metadata, standards: [getTokenStandard()] } as unknown as AnyTokenInfo;
            setToken(tokenData);

            get_token_logo({ [chain]: tokenData } as CombinedTokenInfo).then(setLogo);
        }
    }, [address, chain, getTokenStandard, isSuccess, metadata, setToken, token]);

    if (!token || !chain || !address) return;

    return (
        <div className="text-sm">
            {isError && <div className="text-sm text-red-500">Wrong Contract address</div>}
            <div className="w-full rounded-xl bg-[#181818] px-4 py-1">
                <div className="flex w-full items-center justify-between border-b border-[#222222] py-3 text-sm">
                    <span className="text-[#999999]">Name</span>
                    <div className="flex items-center">
                        {logo ? (
                            <div className="mr-2">
                                <img src={logo} className="h-5 w-5 rounded-full" />
                            </div>
                        ) : (
                            <div className="mr-2">
                                <Icon name="icon-defaultImg" className="h-5 w-5"></Icon>
                            </div>
                        )}
                        <span>{token.name}</span>
                    </div>
                </div>
                <div className="flex w-full items-center justify-between border-b border-[#222222] py-3 text-sm">
                    <span className="text-[#999999]">Symbol</span>
                    <span>{token.symbol}</span>
                </div>
                <div className="flex w-full items-center justify-between border-b border-[#222222] py-3 text-sm">
                    <span className="text-[#999999]">Decimals</span>
                    <span>{token.decimals}</span>
                </div>
                {0 < token.standards.length && (
                    <div className="flex w-full items-center justify-between py-3">
                        <span className="text-[#999999]">Standards</span>
                        <div className="flex items-center">
                            {token.standards.map((s) => (
                                <span key={s} className="pl-2">
                                    {s.toUpperCase()}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const LoadCanisterInfo = ({
    canister_id,
    token,
    setToken,
}: {
    canister_id: string;
    token: IcTokenInfo | undefined;
    setToken: (token: IcTokenInfo | undefined) => void;
}) => {
    const [logo, setLogo] = useState<string>();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (token?.canister_id === canister_id) return;
        setToken(undefined);
        setError('');
        setLoading(true);
        get_token_info_ic(canister_id)
            .then((t) => {
                if (t) {
                    setToken(t);
                    // try to cached logo
                    icrc1_logo(anonymous, canister_id).then((logo) => {
                        if (logo) {
                            setLogo(logo);
                            const key = get_token_logo_key({ ic: { canister_id } });
                            get_cached_data(key, async () => logo);
                        }
                    });
                } else setError('Not found');
            })
            .finally(() => setLoading(false));
    }, [token, canister_id, setToken]);
    return (
        <div className="text-sm">
            {loading && (
                <div className="w-full rounded-xl bg-[#181818] px-4 py-1 dark">
                    <div className="flex w-full items-center justify-between border-b border-[#222222] py-3 text-sm">
                        <span>
                            <Skeleton className="h-4 w-[60px] rounded-lg" />
                        </span>
                        <div className="flex items-center">
                            <Skeleton className="mr-2 flex h-5 w-5 rounded-full" />
                            <span>
                                <Skeleton className="h-4 w-[50px] rounded-lg" />
                            </span>
                        </div>
                    </div>
                    {Array.from({ length: 5 }).map((_, _index) => (
                        <div
                            key={_index}
                            className="flex w-full items-center justify-between border-b border-[#222222] py-3 text-sm last:border-b-0"
                        >
                            <span>
                                <Skeleton className="h-4 w-[60px] rounded-lg" />
                            </span>
                            <span>
                                <Skeleton className="h-4 w-[70px] rounded-lg" />
                            </span>
                        </div>
                    ))}
                </div>
            )}
            {error && <div className="text-sm text-red-500">{error}</div>}
            {token && (
                <div className="w-full rounded-xl bg-[#181818] px-4 py-1">
                    <div className="flex w-full items-center justify-between border-b border-[#222222] py-3 text-sm">
                        <span className="text-[#999999]">Name</span>
                        <div className="flex items-center">
                            {logo ? (
                                <div className="mr-2">
                                    <img src={logo} className="h-5 w-5 rounded-full" />
                                </div>
                            ) : (
                                <div className="mr-2">
                                    <Icon name="icon-defaultImg" className="h-5 w-5"></Icon>
                                </div>
                            )}
                            <span>{token.name}</span>
                        </div>
                    </div>
                    <div className="flex w-full items-center justify-between border-b border-[#222222] py-3 text-sm">
                        <span className="text-[#999999]">Symbol</span>
                        <span>{token.symbol}</span>
                    </div>
                    <div className="flex w-full items-center justify-between border-b border-[#222222] py-3 text-sm">
                        <span className="text-[#999999]">Decimals</span>
                        <span>{token.decimals}</span>
                    </div>
                    <div className="flex w-full items-center justify-between border-b border-[#222222] py-3 text-sm">
                        <span className="text-[#999999]">Fee</span>
                        <span>
                            {BigNumber(token.fee)
                                .dividedBy(new BigNumber(10).pow(new BigNumber(token.decimals)))
                                .toFixed()}
                        </span>
                    </div>
                    {0 < token.standards.length && (
                        <div className="flex w-full items-center justify-between py-3">
                            <span className="text-[#999999]">Standards</span>
                            <div className="flex items-center">
                                {token.standards.map((s) => (
                                    <span key={s} className="pl-2">
                                        {s.toUpperCase()}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
