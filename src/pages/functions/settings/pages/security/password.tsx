import { Button } from '@heroui/react';
import { useCallback, useState } from 'react';

import InputPassword from '~components/input-password';
import { FusePage } from '~components/layouts/page';
import { FusePageTransition } from '~components/layouts/transition';
import { useCurrentState } from '~hooks/memo/current_state';
import { useGoto } from '~hooks/memo/goto';
import { useChangePassword } from '~hooks/store/local-secure';
import { useSonnerToast } from '~hooks/toast';

import { FunctionHeader } from '../../../components/header';

function FunctionSettingsSecurityChangePasswordPage() {
    const toast = useSonnerToast();
    const current_state = useCurrentState();

    const changePassword = useChangePassword();

    const { setHide, goto } = useGoto();
    const [old_password, setOldPassword] = useState('');
    const [new_password, setNewPassword] = useState('');
    const [new_confirm_password, setNewConfirmPassword] = useState('');

    const confirm = useCallback(() => {
        if (old_password === '') {
            toast.error('Old password is empty');
            return;
        }
        if (new_password === '') {
            toast.error('New password is empty');
            return;
        }
        changePassword(old_password, new_password).then((r) => {
            if (r === undefined) return;
            if (r === false) return;
            // notice successful
            toast.success('Successfully set');
            goto(-1);
        });
    }, [changePassword, old_password, new_password, toast, goto]);

    return (
        <FusePage current_state={current_state}>
            <FusePageTransition
                className="relative flex h-full w-full flex-col items-center justify-center pt-[52px]"
                setHide={setHide}
                header={
                    <FunctionHeader
                        title={'Change Password'}
                        onBack={() => goto(-1)}
                        onClose={() => goto('/', { replace: true })}
                    />
                }
            >
                <div className="flex h-full w-full flex-col justify-between px-5">
                    <div className="flex-1">
                        <div className="mt-5 w-full">
                            <label className="my-3 block text-sm">Old Password</label>
                            <InputPassword placeholder="Enter old password" onChange={(val) => setOldPassword(val)} />
                        </div>
                        <div className="mt-5 w-full">
                            <label className="my-3 block text-sm">New Password</label>
                            <InputPassword
                                placeholder="At least 8 characters"
                                onChange={(val) => setNewPassword(val)}
                            />
                        </div>
                        <div className="mt-5 w-full">
                            <label className="my-3 block text-sm">Confirm New Password</label>
                            <InputPassword
                                placeholder="Confirm Password"
                                onChange={(val) => setNewConfirmPassword(val)}
                            />
                        </div>
                    </div>
                    <div className="py-5">
                        <Button
                            className="h-[48px] w-full bg-[#FFCF13] text-lg font-semibold text-black"
                            isDisabled={
                                !old_password ||
                                !new_password ||
                                !new_confirm_password ||
                                new_confirm_password !== new_password
                            }
                            onPress={confirm}
                        >
                            Confirm
                        </Button>
                    </div>
                </div>
            </FusePageTransition>
        </FusePage>
    );
}

export default FunctionSettingsSecurityChangePasswordPage;
