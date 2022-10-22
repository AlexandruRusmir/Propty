import Card from 'react-bootstrap/Card';
import HouseInHand from '../images/house_in_hand.svg';
import '../styles/cardAndCarouselStyle.css';

function MyPropertiesCard() {
  return (
    <Card className='my-properties-card'>
        <Card.Header as="h5">Easily track all your properties</Card.Header>
        <Card.Body>
            <Card.Text>
                Here are all the registered properties that you currently own. You can easily handle everything that belongs to you from inside this page.
            </Card.Text>
            <Card.Img variant="bottom" style={{height: '100px'}} src={HouseInHand} />
      </Card.Body>
    </Card>
  );
}

export default MyPropertiesCard;