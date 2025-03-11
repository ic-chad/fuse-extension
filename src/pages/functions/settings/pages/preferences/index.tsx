import { Switch } from '@heroui/react';
import { toast } from 'sonner';

import { FusePage } from '~components/layouts/page';
import { FusePageTransition } from '~components/layouts/transition';
import { useCurrentState } from '~hooks/memo/current_state';
import { useGoto } from '~hooks/memo/goto';

import { FunctionHeader } from '../../../components/header';
import { SettingsGroup } from '../../components/group';
import { SettingsItem } from '../../components/item';

function FunctionSettingsPreferencesPage() {
    const current_state = useCurrentState();

    const { setHide, goto } = useGoto();
    return (
        <FusePage current_state={current_state}>
            <FusePageTransition
                className="relative flex h-full w-full flex-col items-center justify-center pt-[52px]"
                setHide={setHide}
                header={
                    <FunctionHeader
                        title={'Preferences Settings'}
                        onBack={() => goto(-1)}
                        onClose={() => goto('/', { replace: true })}
                    />
                }
            >
                <SettingsGroup className="mt-6 w-full px-5">
                    <SettingsItem path={'/home/settings/preferences/currency'} title="Currency" tip="USD" />
                    <SettingsItem path={'/home/settings/preferences/language'} title="Language" tip={`English`} />
                </SettingsGroup>

                <SettingsGroup>
                    <SettingsItem
                        path={() => toast.info('Come soon')}
                        title="Fuse wallet actions on web"
                        arrow={false}
                        right={
                            <div className="switch-xs">
                                <Switch defaultSelected color="success" size="sm" />
                            </div>
                        }
                    />
                </SettingsGroup>
            </FusePageTransition>
        </FusePage>
    );
}

export default FunctionSettingsPreferencesPage;
