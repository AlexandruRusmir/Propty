import '../../styles/style.css';
import RegistrarCard from './RegistrarCard';

function AllRegistrars(props) {
    return (
        <>
            <div>
                <h1 className='text-center my-5 title-text'>All Registrars</h1>
            </div>
            <div>
                <RegistrarCard address="0xA14304638C269F716B06ccFd8f0Cc5f2a9Bb79CC" isRegistrar={true} />
            </div>
            <div>
                <RegistrarCard address="0xA14304638C269F716B06ccFd8f0Cc5f2a9Bb79CC" isRegistrar={false} />
            </div>
        </>
    );
}

export default AllRegistrars;