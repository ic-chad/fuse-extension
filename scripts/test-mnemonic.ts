import { random_mnemonic, validate_mnemonic } from '~lib/mnemonic';

const main = async () => {
    console.error(
        validate_mnemonic('fence upset kiwi pretty pen oyster once bachelor fence engage captain page'),
        'wrong mnemonic 1',
    );
    console.error(
        validate_mnemonic('fence upset kiwi pretty pen oyster tooth bachelor too engage captain page'),
        'wrong mnemonic 2',
    );
    console.error(
        validate_mnemonic('fence upset kiwi pretty pen oyster fence bachelor too engage captain page'),
        'wrong mnemonic 3',
    );
    console.error(
        validate_mnemonic('fence upset kiwi pretty pen oyster once bachelor fence engage captain page'),
        'wrong mnemonic 4',
    );

    console.error(random_mnemonic(12), '===  wrong mnemonic 5');
};

main();
