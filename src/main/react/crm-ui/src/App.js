import "./App.css";
import {Customers} from "./Customers";
import {Container, Tab, Tabs} from "react-bootstrap";
import {Campaigns} from "./Campaigns";

function App() {
    return (
        <Container className="mt-3">
            <Tabs defaultActiveKey="customer" className="mb-3">
                <Tab eventKey="customer" title="Customers">
                    <Customers/>
                </Tab>
                <Tab eventKey="compaings" title="Campaigns">
                    <Campaigns/>
                </Tab>
            </Tabs>
        </Container>
    );
}

export default App;
