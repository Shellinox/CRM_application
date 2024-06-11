import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import {Button} from "react-bootstrap";
import {useFieldArray, useForm} from "react-hook-form";

export function NewOrder(props) {
    const handleClose = () => props.onHide();

    //https://react-hook-form.com/docs/usefieldarray
    const {watch, control, register, handleSubmit, reset} = useForm({
        mode: 'all',
        defaultValues: {
            orderItems: [
                {
                    name: null,
                    unitPrice: null,
                    quantity: 1,
                }
            ]
        }
    });

    const {fields, append, remove} = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormProvider)
        name: "orderItems", // unique name for your Field Array
    });

    const orderItems = watch("orderItems");

    const total = orderItems.reduce((acc, curr) => acc + curr.unitPrice * curr.quantity, 0)

    const onShow = () => {
        reset()
    }

    const addRow = () => {
        append({
            name: null,
            unitPrice: null,
            quantity: 1,
        });
    };

    const saveOrder = async (data) => {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                date: new Date(),
                customer: props.customer,
                orderItems: [],
                ...data
            }),
        });

        if (!response.ok) {
            alert('Something went wrong!');
        } else {
            handleClose();
        }
    };

    return (
        <Modal {...props} size={"lg"} onShow={onShow}>
            <Modal.Header closeButton>
                <Modal.Title>New order</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form id={'orderForm'} onSubmit={handleSubmit(data => saveOrder(data))}>
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <td colSpan={6}>
                                Customer: <strong>{props.customer?.name} ({props.customer?.email})</strong>
                            </td>
                        </tr>
                        <tr>
                            <th>#</th>
                            <th>Item</th>
                            <th>Unit Price</th>
                            <th>Quantity</th>
                            <th>Total Price</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            fields.map((field, index) => (
                                <tr key={field.id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <Form.Control {...register(`orderItems.${index}.name`)}/>
                                    </td>
                                    <td>
                                        <Form.Control {...register(`orderItems.${index}.unitPrice`)} type={'number'}
                                                      step={0.1} min={0.1}
                                        />
                                    </td>
                                    <td>
                                        <Form.Control {...register(`orderItems.${index}.quantity`)} type={'number'}
                                                      step={1}
                                                      min={1}
                                        />
                                    </td>
                                    <td>
                                        {orderItems[index].unitPrice * orderItems[index].quantity}
                                    </td>
                                    <td>
                                        <Button size={"sm"} variant={"danger"} onClick={() => remove(index)}>
                                            X
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                        <tr>
                            <td colSpan={3}>
                                <Button onClick={addRow}>Add item</Button>
                            </td>
                            <th className={'text-end'}>Total:&nbsp;</th>
                            <th>{total}</th>
                            <td></td>
                        </tr>
                        </tfoot>
                    </Table>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="primary" type={"submit"} form={'orderForm'}>
                    Save Order
                </Button>
            </Modal.Footer>
        </Modal>
    );
}