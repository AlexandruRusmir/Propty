import { useState } from 'react';
import '../../styles/style.css';
import '../../styles/cardAndCarouselStyle.css';
import '../../styles/buttons.css';
import Card from 'react-bootstrap/Card';
import PersonAdd from '../../images/person_add.svg';
import PersonRemove from '../../images/person_remove.svg';
import PersonCheck from '../../images/person_check.svg';
import PersonBlocked from '../../images/person_blocked.svg';
import { useTitlesContract } from '../../CustomHooks/useTitlesContract';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function RegistrarCard(props) {
    const titlesContract = useTitlesContract().current;

    const [isRegistrar, setIsRegistrar] = useState(props.isRegistrar);

    return (
        <Card className='registrar-card mb-5'>
            {
                isRegistrar ?
                <Card.Img className='my-2 registrar-state-image' src={PersonCheck} /> :
                <Card.Img className='my-2 registrar-state-image' src={PersonBlocked} />
            }
            <Card.Header className='py-4'>
                <Row>
                    <Col lg={9} md={12} className='registrar-card-text'>
                        <Card.Text><span className='registrar-address-text'>Address:</span> {props.address}</Card.Text>
                    </Col>
                    <Col lg={3} md={12} className='centered'>
                        {
                            isRegistrar ?
                            <Button className='remove-registrar-btn'>Remove <img src={PersonRemove} /> </Button> :
                            <Button className='add-registrar-btn'>Add <img src={PersonAdd} /> </Button>
                        }
                    </Col>
                </Row>
            </Card.Header>
        </Card>
    );
}

export default RegistrarCard;