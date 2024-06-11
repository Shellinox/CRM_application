import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import {useEffect, useState} from "react";
import {NewOrder} from "./NewOrder";

export function Customers() {
    const [customers, setCustomers] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    useEffect(() => {
        loadCustomers();
    }, []);

    function createNewOrder(customer) {
        setSelectedCustomer(customer);
        setModalShow(true);
    }

    function loadCustomers() {
        fetch("/api/customers")
            .then((res) => res.json())
            .then(data => setCustomers(data));
    }

    const onHide = () => {
        setModalShow(false);
        loadCustomers();
    }

    return (<>
        <Table striped bordered hover>
            <thead>
            <tr>
                <th>#</th>
                <th>Name</th>
                <th>Age</th>
                <th>Email</th>
                <th>Last Order date</th>
                <th># of orders</th>
            </tr>
            </thead>
            <tbody>
            {
                customers.map((c, i) =>
                    (
                        <tr key={c.id}>
                            <td>{i + 1}</td>
                            <td>{c.name}</td>
                            <td>{c.age}</td>
                            <td>{c.email}</td>
                            <td>{c.lastOrderDate}</td>
                            <td>{c.totalOrder}</td>
                            <td>
                                <Button variant="primary" onClick={() => createNewOrder(c)}>
                                    New order
                                </Button>
                            </td>
                        </tr>
                    ))}
            </tbody>
        </Table>
        <NewOrder show={modalShow} customer={selectedCustomer} onHide={onHide}/>
    </>);
}