import type { PlasmoMessaging } from '@plasmohq/messaging';

import { query_current_session_connected_app } from '~hooks/store';
import { get_current_info } from '~hooks/store/local-secure';
import type { MessageResult } from '~lib/messages';
import { type Chain } from '~types/chain';
import type { CurrentWindow } from '~types/window';

export interface RequestBody {
    message_id: string;
    window?: CurrentWindow;
    timeout: number;
    chain: Chain;
    origin: string;
}
export type ResponseBody = MessageResult<boolean, string>;

const handler: PlasmoMessaging.MessageHandler<RequestBody, ResponseBody> = async (req, res) => {
    if (!req.body) return res.send({ err: 'request body is undefined' });
    const body: RequestBody = req.body;
    // const message_id = body.message_id;
    // const current_window = req.body.window;

    const current_info = await get_current_info();
    if (!current_info) return res.send({ ok: false });

    const connected = await query_current_session_connected_app(
        current_info.current_identity,
        current_info.current_chain_network,
        body.chain,
        body.origin,
    );
    return res.send({ ok: !!connected });
};

export default handler;
