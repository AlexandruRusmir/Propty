import React from 'react';
import '../../styles/parallaxStyle.css';
import '../../styles/style.css';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="wrapper">
            <div className="bgimg-1">
                <div className="caption">
                    <div>
                        <h1 className="text-light">Take easy <span className="text-warning"> Control</span> over all your <span className="text-warning"> Properties</span>!</h1>
                    </div>
                </div>
            </div>

            <div className="bg-dark text-light text-center">
                <h2 className="text-light py-3">The future of real estate is now with Propty!</h2>
                <div className="mx-5 pb-3">
                    <p>
                    Most real estate transactions are still conducted through wire transfers and require costly verification processes that can take days to complete. Blockchain-based transactions enable a streamlined process which delivers quickly and reduces costs.
                    </p>
                    <p>
                        Agents, buyers and sellers from all over the world love the simplicity and security of Propty.
                    </p>
                </div>
            </div>

            <div className="bgimg-2">
                <div className="caption">
                    <div>
                        <h1 className="text-light">Powered by <span className="text-info">Web3</span> Techonology</h1>
                    </div>
                </div>
            </div>

            <div className="bg-dark text-light text-center">
                <h2 className="text-light py-3">Blockchain technology is here!</h2>
                <div className="mx-5 pb-3">
                    <p>
                        Blockchain technology offers a form of shared record-keeping which is designed to be difficult to tamper with. Blockchain technology operates through decentralized peer-to-peer platforms, building resilience against the spread of corrupted information and boosting resistance to fraud.
                    </p>
                    <p>
                        With data distributed across a peer-to-peer network, brokers are able to have more control over their data, as it would be more difficult for it to be interfered with by any third parties. Market participants access more reliable data at a lower cost.
                    </p>
                </div>
            </div>

            <div className="bgimg-3">
                <div className="caption">
                    <div>
                        <h1 className="text-light">It has never been so <span className="text-info">safe</span> and <span className="text-info">easy</span> to handle your properties.</h1>
                    </div>
                </div>
            </div>

            <div className="bg-dark text-light text-center pb-4">
                <h2 className="text-light py-3">Take a look at all the listed properties!</h2>
                <div className='centered'>
                    <Link to='/all-properties' className='see-all-properties-btn text-light nav-link'>See All Properties</Link>
                </div>
            </div>

            <div className="bgimg-4">
                <div className="caption">
                    <div>
                        <h1 className="text-light">What are you waiting for? Get started now!</h1>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;