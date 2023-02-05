import { useState } from 'react';
import '../../styles/style.css';
import '../../styles/cardAndCarouselStyle.css';
import '../../styles/buttons.css';
import Card from 'react-bootstrap/Card';
import PersonAdd from '../../assets/person_add.svg';
import PersonRemove from '../../assets/person_remove.svg';
import PersonCheck from '../../assets/person_check.svg';
import PersonBlocked from '../../assets/person_blocked.svg';
import { useTitlesContract } from '../../CustomHooks/useTitlesContract';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

function RegistrarCard(props) {
    const titlesContract = useTitlesContract().current;

    const [isRegistrar, setIsRegistrar] = useState(props.isRegistrar);

    const [registrarStateIsChanging, setRegistrarStateIsChanging] = useState(false);
    const [registrarStateChangingAlertOpen, setRegistrarStateChangingAlertOpen] = useState(false);

    const removeRegistrarRole = async (address) => {
        return titlesContract.methods.removeRegistrarRole([address]).send({ from: props.account });
    }

    const addRegistrarRole = async (address) => {
        return titlesContract.methods.reactivateRegistrarRole([address]).send({ from: props.account });
    }

    const handleRegistrarStateChangeAlertClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
      
        setRegistrarStateChangingAlertOpen(false);
    }


    return (
        <Card className='registrar-card mb-4'>
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
                            <>
                            { 
                                !registrarStateIsChanging ?
                                    <Button className='remove-registrar-btn'
                                        onClick={() => {
                                            setRegistrarStateIsChanging(true);
                                            setRegistrarStateChangingAlertOpen(true);
                                            removeRegistrarRole(props.address).then(async () => {
                                                setRegistrarStateIsChanging(false);
                                                setIsRegistrar(false);
                                                await props.loadCentralContractRegistrars();
                                            }).catch(err => {
                                                setRegistrarStateIsChanging(false);
                                                console.log(err);
                                            })
                                        }}
                                    >
                                        Remove <img src={PersonRemove} /> 
                                    </Button> :
                                    <Button className='remove-registrar-btn disabled-btn'>
                                        Remove <img src={PersonRemove} /> 
                                    </Button>
                            }
                            </> :
                            <>
                            {
                                !registrarStateIsChanging ?
                                    <Button className='add-registrar-btn'
                                        onClick={() => {
                                            setRegistrarStateIsChanging(true);
                                            setRegistrarStateChangingAlertOpen(true);
                                            addRegistrarRole(props.address).then(async () => {
                                                setRegistrarStateIsChanging(false);
                                                setIsRegistrar(true);
                                                await props.loadCentralContractRegistrars();
                                            }).catch( err => {
                                                setRegistrarStateIsChanging(false);
                                                console.log(err);
                                            })
                                        }}
                                    >
                                        Add <img src={PersonAdd} /> 
                                    </Button> :
                                    <Button className='add-registrar-btn disabled-btn'>
                                        Add <img src={PersonAdd} /> 
                                    </Button>
                            }
                            </>
                        }
                    </Col>
                </Row>
            </Card.Header>
            <Snackbar open={registrarStateChangingAlertOpen} autoHideDuration={4000} onClose={handleRegistrarStateChangeAlertClose}>
                <MuiAlert
                    variant="filled"
                    onClose={handleRegistrarStateChangeAlertClose}
                    severity="info"
                    sx={{ width: "640x" }}
                >
                    <div className='centered'>
                        Please confirm the transaction and wait for the account's registrar role to be updated.
                    </div>
                </MuiAlert>
            </Snackbar>
        </Card>
    );
}

export default RegistrarCard;