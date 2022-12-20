import Card from 'react-bootstrap/Card';
import HouseInHand from '../../assets/house_in_hand.svg';
import '../../styles/cardAndCarouselStyle.css';
import '../../styles/style.css';
import Button from 'react-bootstrap/Button';
import DeployTitleContract from './DeployTitleContract';
import { useState } from 'react';
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

function MyPropertiesCard(props) {
    const [addNewContractShow, setAddNewContractShow] = useState(false)
    const [deployConfirmAlertOpen, setDeployConfirmAlertOpen] = useState(false);
    const [deployFailAlertOpen, setDeployFailAlertOpen] = useState(false);

    const handleDeployAlertClose = (event, reason) => {
      if (reason === "clickaway") {
          return;
      }
    
      setDeployConfirmAlertOpen(false);
    }

    const handleDeployFailAlertClose = (event, reason) => {
      if (reason === "clickaway") {
          return;
      }
    
      setDeployConfirmAlertOpen(false);
    }

    return (
      <>
        <Card className='my-properties-card'>
            <Card.Header as="h5">Easily track all your properties</Card.Header>
            <Card.Body>
              <Card.Text>
                Here are all the registered properties that you currently own. You can easily handle everything that belongs to you from inside this page.
              </Card.Text>
              <Card.Img variant="bottom" style={{height: '100px'}} src={HouseInHand} />
              <DeployTitleContract
                loadMyProperties={async () => {await props.loadMyProperties()}}
                show={addNewContractShow}
                onAddNewContractHide={() => setAddNewContractShow(false)}
                key={props.account + 'addPropertyModal'}
                account={props.account}
                setDeployConfirmAlertOpen={setDeployConfirmAlertOpen}
                setDeployFailAlertOpen={setDeployFailAlertOpen}
              />
              <div className='centered mt-5 mb-2'>
                <Button className='modify-contract-btn' onClick={() => {setAddNewContractShow(true);}} >Add a new Property</Button>
              </div>
          </Card.Body>
        </Card>
        <Snackbar open={deployConfirmAlertOpen} autoHideDuration={4000} onClose={handleDeployAlertClose}>
            <MuiAlert
              variant="filled"
              onClose={handleDeployAlertClose}
              severity="success"
              sx={{ width: "310px" }}
            >
                <div className='centered'>
                    Contract successfully deployed!
                </div>
            </MuiAlert>
        </Snackbar>
        <Snackbar open={deployFailAlertOpen} autoHideDuration={4000} onClose={handleDeployFailAlertClose}>
            <MuiAlert
              variant="filled"
              onClose={handleDeployFailAlertClose}
              severity="warning"
              sx={{ width: "310px" }}
            >
                <div className='centered'>
                    Something went wrong deploying!
                </div>
            </MuiAlert>
        </Snackbar>
      </>
    );
}

export default MyPropertiesCard;