import '../../styles/style.css';
import RegistrarCard from './RegistrarCard';

function AllRegistrars(props) {
    return (
        <>
            <div>
                <h1 className='text-center my-5 title-text'>All Registrars</h1>
            </div>
            <div>
                <RegistrarCard address="0xb4n4n4..." isRegistrar={true} />
            </div>
        </>
    );
}

export default AllRegistrars;