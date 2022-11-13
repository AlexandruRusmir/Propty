import Card from 'react-bootstrap/Card';
import HouseInHand from '../../images/house_in_hand.svg';
import '../../styles/cardAndCarouselStyle.css';
import '../../styles/style.css';
import Button from 'react-bootstrap/Button';
import DeployTitleContract from './DeployTitleContract';
import { useState } from 'react';
import { propTypes } from 'react-bootstrap/esm/Image';

function MyPropertiesCard(props) {
    const [addNewContractShow, setAddNewContractShow] = useState(false)

    return (
      <Card className='my-properties-card'>
          <Card.Header as="h5">Easily track all your properties</Card.Header>
          <Card.Body>
            <Card.Text>
              Here are all the registered properties that you currently own. You can easily handle everything that belongs to you from inside this page.
            </Card.Text>
            <Card.Img variant="bottom" style={{height: '100px'}} src={HouseInHand} />
            <DeployTitleContract
              show={addNewContractShow}
              onAddNewContractHide={() => setAddNewContractShow(false)}
              key={props.account + 'addPropertyModal'}
              account={props.account}
            />
            <div className='centered mt-5 mb-2'>
              <Button className='modify-contract-btn' onClick={() => {setAddNewContractShow(true);}} >Add a Title Contract</Button>
            </div>
        </Card.Body>
      </Card>
    );
}

export default MyPropertiesCard;