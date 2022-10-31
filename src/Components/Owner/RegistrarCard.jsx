import { useState } from 'react';
import '../../styles/style.css';
import Card from 'react-bootstrap/Card';
import PersonAdd from '../../images/person_add.svg';
import PersonRemove from '../../images/person_remove.svg';
import PersonCheck from '../../images/person_check.svg';
import PersonBlocked from '../../images/person_blocked.svg';
import { useTitlesContract } from '../../CustomHooks/useTitlesContract';

function RegistrarCard(props) {
    const titlesContract = useTitlesContract().current;

    const [isAdmin, setisAdmin] = useState(props.isRegistrar);

    return (
        <Card>
            {
                isAdmin ?
                <Card.Img style={{height: '70px'}} src={PersonCheck} /> :
                <Card.Img style={{height: '70px'}} src={PersonBlocked} />
            }
            <Card.Header as="h5">Address: {props.address}</Card.Header>
        </Card>
    );
}

export default RegistrarCard;