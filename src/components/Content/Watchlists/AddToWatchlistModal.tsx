import {
    Form,
    type FormInstance,
    Input,
    Modal,
    Radio,
    Select,
    Space,
    Typography
} from 'antd';
import { match } from 'ts-pattern';
import { Spinner } from '../../UI/Spinner';
import './AddToWatchlistModal.scss';
import { useForceUpdate } from '../../hooks/useForceUpdate';
import {
    useAddStockToWatchlist,
    useCreateWatchlist,
    useGetWatchlistNames
} from '../../../queries/WatchlistQueries';

interface Props {
    readonly show: boolean;
    readonly symbol: string;
    readonly onClose: () => void;
}

type WatchlistSelectionType = 'existing' | 'new';

interface ModalFormData {
    readonly watchlistSelectionType: WatchlistSelectionType;
    readonly newWatchListName: string;
    readonly existingWatchlistName: string;
}

interface ModalFormProps {
    readonly form: FormInstance<ModalFormData>;
    readonly existingWatchlistNames: ReadonlyArray<string>;
    readonly onFormChange: () => void;
}

const ModalForm = (props: ModalFormProps) => {
    const isNewWatchlist =
        props.form.getFieldsValue().watchlistSelectionType === 'new';
    const newWatchlistStyle = isNewWatchlist ? undefined : { display: 'none' };
    const existingWatchlistStyle = isNewWatchlist
        ? { display: 'none' }
        : undefined;

    return (
        <Form
            form={props.form}
            preserve
            onValuesChange={props.onFormChange}
            initialValues={{
                watchlistSelectionType: 'existing'
            }}
        >
            <Form.Item name="watchlistSelectionType">
                <Radio.Group>
                    <Space direction="vertical">
                        <Radio value="existing">Existing Watchlist</Radio>
                        <Radio value="new">New Watchlist</Radio>
                    </Space>
                </Radio.Group>
            </Form.Item>
            <Form.Item name="newWatchListName" style={newWatchlistStyle}>
                <Input data-testid="new-watchlist-input" />
            </Form.Item>
            <Form.Item
                name="existingWatchlistName"
                style={existingWatchlistStyle}
            >
                <Select data-testid="existing-watchlist-select" showSearch>
                    {props.existingWatchlistNames.map((name) => (
                        <Select.Option key={name} value={name}>
                            {name}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>
        </Form>
    );
};

type WatchlistAndSave = [
    name: string,
    fn: (args: { watchlistName: string; stockSymbol: string }) => void
];

type OnOk = () => void;
const useOnOk = (
    stockSymbol: string,
    form: FormInstance<ModalFormData>,
    onClose: () => void
): OnOk => {
    const { mutate: addStockToWatchlist } = useAddStockToWatchlist();
    const { mutate: createWatchlist } = useCreateWatchlist();
    return () => {
        const values: ModalFormData = form.getFieldsValue();
        const [watchlistName, saveAction] = match(values)
            .with(
                { watchlistSelectionType: 'existing' },
                (_): WatchlistAndSave => [
                    _.existingWatchlistName,
                    addStockToWatchlist
                ]
            )
            .otherwise(
                (_): WatchlistAndSave => [_.newWatchListName, createWatchlist]
            );
        saveAction({ watchlistName, stockSymbol });
        onClose();
    };
};

const isOkButtonDisabled = (form: FormInstance<ModalFormData>): boolean => {
    const formValues = form.getFieldsValue();
    return (
        ((formValues.watchlistSelectionType === 'existing' ||
            formValues.watchlistSelectionType === undefined) &&
            !formValues.existingWatchlistName) ||
        (formValues.watchlistSelectionType === 'new' &&
            !formValues.newWatchListName)
    );
};

export const AddToWatchlistModal = (props: Props) => {
    const forceUpdate = useForceUpdate();
    const [form] = Form.useForm<ModalFormData>();
    const {
        data: watchlistNames,
        isFetching: getWatchlistNamesLoading,
        isError: getWatchlistNamesError
    } = useGetWatchlistNames();

    const Body = match({
        getWatchlistNamesLoading,
        getWatchlistNamesError
    })
        .with({ getWatchlistNamesLoading: true }, () => <Spinner />)
        .with(
            { getWatchlistNamesLoading: false, getWatchlistNamesError: true },
            () => (
                <Typography.Title className="ErrorMsg" level={3}>
                    Error Loading Watchlist Names
                </Typography.Title>
            )
        )
        .otherwise(() => (
            <ModalForm
                form={form}
                onFormChange={forceUpdate}
                existingWatchlistNames={watchlistNames ?? []}
            />
        ));

    const onClose = () => {
        form.resetFields();
        props.onClose();
    };

    const onOk = useOnOk(props.symbol, form, onClose);
    const okButtonDisabled = isOkButtonDisabled(form);

    return (
        <Modal
            title={`Add ${props.symbol} to Watchlist`}
            className="add-to-watchlist-modal"
            data-testid="add-to-watchlist-modal"
            open={props.show}
            onCancel={onClose}
            onOk={onOk}
            okButtonProps={{
                disabled: okButtonDisabled
            }}
        >
            {Body}
        </Modal>
    );
};
