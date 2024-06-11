import Table from "react-bootstrap/Table";
import {useEffect, useState} from "react";
import {NewCampaign} from "./NewCampaign";
import Button from "react-bootstrap/Button";

export function Campaigns() {
    const [campaigns, setCampaigns] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    useEffect(() => {
        loadCampaigns();
    }, []);

    function createNewCampaign(customer) {
        setSelectedCustomer(customer);
        setModalShow(true);
    }

    function loadCampaigns() {
        fetch("/api/campaigns")
            .then((res) => res.json())
            .then(data => setCampaigns(data));
    }

    const onHide = () => {
        setModalShow(false);
        loadCampaigns();
    }

    return (<>
        <Button className="mb-2" onClick={createNewCampaign}>Create new campaign</Button>
        <Table striped bordered hover>
            <thead>
            <tr>
                <th>#</th>
                <th>Date & Time</th>
                <th>Subject</th>
                <th>Body</th>
                <th># of audience</th>
            </tr>
            </thead>
            <tbody>
            {
                campaigns.map((c, i) =>
                    (
                        <tr key={c.id}>
                            <td>{i + 1}</td>
                            <td>{c.date}</td>
                            <td>{c.subject}</td>
                            <td>{c.body}</td>
                            <td>{c.customers.length}</td>
                        </tr>
                    ))}
            </tbody>
        </Table>
        <NewCampaign show={modalShow} customer={selectedCustomer} onHide={onHide}/>
    </>);
}