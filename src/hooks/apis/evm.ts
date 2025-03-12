import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import type { Address } from 'viem';

import {
    getErc20TokenPrice,
    getMultipleErc20TokenPrices,
    getWalletErc20TransactionsHistory,
    getWalletNativeTransactionsHistory,
    type GetTransactionsHistoryArgs,
} from '~apis/evm';
import { useCurrentChainID } from '~hooks/evm/viem';
import { useCurrentIdentity } from '~hooks/store/local-secure';

export interface TransactionsHistoryInfiniteArgs extends Omit<GetTransactionsHistoryArgs, 'cursor' | 'address'> {
    initialCursor?: string;
}

export const useWalletNativeTransactionsHistory = (args: TransactionsHistoryInfiniteArgs) => {
    const chainID = useCurrentChainID();
    const { current_identity } = useCurrentIdentity();
    const address = current_identity?.address.evm.address;
    const enabled = !!chainID && !!address;
    const { limit, initialCursor = '' } = args;

    return useInfiniteQuery({
        queryKey: [`evm_${chainID}`, 'infinite_transactions_history', address, limit],
        queryFn: async ({ pageParam = initialCursor }) => {
            if (!chainID || !address) {
                throw new Error('Chain ID or address is not set');
            }
            return getWalletNativeTransactionsHistory(chainID, {
                address,
                limit,
                cursor: pageParam, // Use cursor as pagination parameter
            });
        },
        initialPageParam: initialCursor,
        // Use returned cursor as parameter for next page
        getNextPageParam: (lastPage) => {
            return lastPage.cursor || undefined;
        },
        // No need for getPreviousPageParam with cursor pagination
        maxPages: 100,
        enabled,
    });
};

export const useWalletErc20TransactionsHistory = (args: TransactionsHistoryInfiniteArgs) => {
    const chainID = useCurrentChainID();
    const { current_identity } = useCurrentIdentity();
    const address = current_identity?.address.evm.address;
    const enabled = !!chainID && !!address;
    const { limit, initialCursor = '' } = args;

    return useInfiniteQuery({
        queryKey: [`evm_${chainID}`, 'infinite_erc20_transfers', address, limit],
        queryFn: async ({ pageParam = initialCursor }) => {
            if (!chainID || !address) {
                throw new Error('Chain ID or address is not set');
            }

            return getWalletErc20TransactionsHistory(chainID, {
                address,
                limit,
                cursor: pageParam,
            });
        },
        initialPageParam: initialCursor,
        getNextPageParam: (lastPage) => {
            return lastPage.cursor || undefined;
        },
        maxPages: 100,
        enabled,
    });
};

/**
 * Hook to fetch single token price
 * @param address - Token contract address
 * @param options - Query options (enabled, refetchInterval, etc.)
 */
export const useTokenPrice = (address: Address, options = {}) => {
    const chainID = useCurrentChainID();
    const enabled = !!chainID && !!address;

    return useQuery({
        queryKey: [`evm_${chainID}`, 'token_price', address],
        queryFn: () => {
            if (!chainID || !address) throw new Error('Chain ID or address is not set');
            return getErc20TokenPrice(chainID, address);
        },
        enabled,
        ...options,
    });
};

/**
 * Hook to fetch multiple token prices
 * @param addresses - Array of token contract addresses
 * @param options - Query options (enabled, refetchInterval, etc.)
 */
export const useMultipleTokenPrices = (addresses: Address[], options = {}) => {
    const chainID = useCurrentChainID();
    const enabled = !!chainID && addresses.length > 0;

    return useQuery({
        queryKey: [`evm_${chainID}`, 'multiple_token_prices', addresses],
        queryFn: () => {
            if (!chainID) throw new Error('Chain ID is not set');
            return getMultipleErc20TokenPrices(
                chainID,
                addresses.map((addr) => ({ tokenAddress: addr })),
            );
        },
        enabled,
        ...options,
    });
};
