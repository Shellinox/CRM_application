import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import {Button, Col, Row} from "react-bootstrap";
import {useFieldArray, useForm} from "react-hook-form";
import {useState} from "react";

export function NewCampaign(props) {
    const handleClose = () => props.onHide();
    const [audience, setAudience] = useState([]);

    //https://react-hook-form.com/docs/usefieldarray
    const {getValues, trigger, watch, control, register, handleSubmit, reset} = useForm({
        defaultValues: {
            subject: '',
            body: '',
            customers: [],
            filter: []
        }
    });

    const {fields, append, remove} = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormProvider)
        name: "filter", // unique name for your Field Array
    });

    const filters = watch("filter");

    const addCondition = () => {
        append({
            field: 'max(o.date)',
            operator: 'eq',
            value: null,
            conjunction: 'AND'
        });
    };

    const onShow = () => {
        setAudience([]);
        reset()
    }

    const saveCampaign = async (data) => {
        const response = await fetch('/api/campaigns', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...data,
                customers: await fetchAudience()
            }),
        });

        if (!response.ok) {
            alert('Something went wrong!');
        } else {
            handleClose();
        }
    };

    const fetchAudience = async () => {
        const data = await fetch('/api/customers/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(getValues('filter')),
        }).then(res => res.json());
        setAudience(data);
        return data;
    }

    return (
        <Modal {...props} size={"lg"} onShow={onShow}>
            <Modal.Header closeButton>
                <Modal.Title>New Campaign</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form id={'campaignForm'} onSubmit={handleSubmit(data => saveCampaign(data))}>
                    <Form.Group className="mb-3" controlId="subject">
                        <Form.Label>Subject</Form.Label>
                        <Form.Control {...register("subject")}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="body">
                        <Form.Label>Body</Form.Label>
                        <Form.Control as="textarea" rows={3} {...register("body")}/>
                        <Form.Text muted>
                            Use placeholder &#123;customer&#125; for customer name
                        </Form.Text>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="audience">
                        <Form.Label>Audience</Form.Label>
                        {
                            fields.map((field, i) => (
                                    <Row key={field.id}>
                                        {
                                            i > 0 ? <Col xs={{span: 8, offset: 2}} className="my-2">
                                                <Form.Select size="sm" {...register(`filter.${i}.conjunction`)}>
                                                    <option value="AND">AND</option>
                                                    <option value="OR">OR</option>
                                                </Form.Select>
                                            </Col> : ''
                                        }
                                        <Col xs={4}>
                                            <Form.Select {...register(`filter.${i}.field`)} onSelect={() => trigger()}>
                                                <option value="max(o.date)">Last order date</option>
                                                <option value="count(*)"># of orders</option>
                                                <option value="sum(o.total_amount)">Total spends</option>
                                                <option value="age">Age</option>
                                            </Form.Select>
                                        </Col>
                                        <Col xs={3}>
                                            <Form.Select {...register(`filter.${i}.operator`)}>
                                                <option value="eq">Equal</option>
                                                <option value="gt">Greater than</option>
                                                <option value="lt">Less than</option>
                                            </Form.Select>
                                        </Col>
                                        <Col xs={4}>
                                            <Form.Control
                                                type={filters[i].field === 'max(o.date)' ? 'date' : 'number'} {...register(`filter.${i}.value`)}
                                            />
                                        </Col>
                                        <Col>
                                            <Button variant={"danger"} size="sm" onClick={() => remove(i)}>X</Button>
                                        </Col>
                                    </Row>
                                )
                            )
                        }
                        <Row className="mt-2">
                            <Col>
                                <Button size="sm" onClick={addCondition}>Add condition</Button>
                            </Col>
                        </Row>
                        <Row className="mt-5">
                            <Col xs={12}>
                                <Button className="me-2" variant="info" size="sm" onClick={fetchAudience}>
                                    Fetch Audience
                                </Button>
                                # of audience: {audience.length}
                            </Col>
                        </Row>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="primary" type={"submit"} form={'campaignForm'}>
                    Create campaign
                </Button>
            </Modal.Footer>
        </Modal>
    );
}