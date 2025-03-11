import { useEffect, useState } from 'react';
import { createPublicClient, http, type PublicClient } from 'viem';

import { useCurrentIdentity } from '~hooks/store/local-secure';

export const SHOULD_DEHYDRATE_QUERY_KEY = 'SHOULD_DEHYDRATE';

// evm chainID
export const useCurrentChainID = (): number | undefined => {
    const { current_identity_network } = useCurrentIdentity();
    if (!current_identity_network) return undefined;
    return current_identity_network.evm.network.chainId;
};

// create get and cache public client
const clients = new Map<number, PublicClient>(); // cache
export const useCurrentPublicClient = (): PublicClient | undefined => {
    const [client, setClient] = useState<PublicClient>();
    const chainId = useCurrentChainID();
    const { current_identity_network } = useCurrentIdentity();
    useEffect(() => {
        if (chainId === undefined) return;
        if (current_identity_network === undefined || !current_identity_network.evm) return;
        if (clients.has(chainId)) {
            setClient(clients.get(chainId));
            return;
        }
        const client = createPublicClient({
            chain: current_identity_network.evm.network.viemChain,
            transport: http(),
        });
        clients.set(chainId, client);
        setClient(client);
    }, [chainId, current_identity_network]);
    return client;
};
