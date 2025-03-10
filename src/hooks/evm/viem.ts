import { useEffect, useState } from 'react';
import { createPublicClient, http, type PublicClient } from 'viem';
import { mainnet } from 'viem/chains';

const clients = new Map<number, PublicClient>();

// create get and cache public client
export const useCurrentPublicClient = (chainId: number): PublicClient | undefined => {
    const [client, setClient] = useState<PublicClient>();
    useEffect(() => {
        if (clients.has(chainId)) {
            setClient(clients.get(chainId));
            return;
        }
        const client = createPublicClient({
            chain: mainnet,
            transport: http(),
        });
        clients.set(chainId, client);
        setClient(client);
    }, [chainId]);
    return client;
};
