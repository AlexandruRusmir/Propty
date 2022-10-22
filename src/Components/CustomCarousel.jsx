import Carousel from 'react-bootstrap/Carousel';
import HouseEditSvg from '../images/house_edit.svg';
import QuietTown from '../images/quiet_town.svg';
import SelectHouse from '../images/select_house.svg';
import '../styles/cardAndCarouselStyle.css';

function CustomCarousel() {
  return (
    <Carousel controls={false} variant="dark" style={{height: '400px'}} className='d-flex justify-content-center align-items-center'>
      <Carousel.Item interval={2000}>
        <img
          className="d-block w-100 carousel-picture"
          src={HouseEditSvg}
          alt="First slide"
        />
        <Carousel.Caption>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item interval={2000}>
        <img
          className="d-block h-70 carousel-picture"
          src={QuietTown}
          alt="Second slide"
        />

        <Carousel.Caption>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item interval={2000}>
        <img
          className="d-block h-60 carousel-picture"
          src={SelectHouse}
          alt="Third slide"
        />

        <Carousel.Caption>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default CustomCarousel;