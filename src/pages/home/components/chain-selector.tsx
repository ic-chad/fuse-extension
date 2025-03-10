
import ICLogo from 'data-base64:~assets/svg/chains/ic.svg';
import ArrowDown from 'data-base64:~assets/svg/common/arrow-down.svg';
import { useNavigate } from 'react-router-dom';

export const ChainSelector = () => {
    const navigate = useNavigate();
    return (
        <div
            className="flex cursor-pointer justify-between h-6 w-[42px] flex-shrink-0 items-center rounded-[25px] bg-[#333] p-[3px] pr-[7px]"
            onClick={() => navigate('/home/chains')}
        >
            <img src={ICLogo} className='w-[18px] h-[18px]' alt="IC" />
            <img src={ArrowDown} alt="ArrowDown" />
        </div>
    );
};
