import React from 'react';
import '../styles/ParallaxStyle.css';
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
                <h2 className="text-light py-3">Create your home workout!</h2>
                <div className="mx-5 pb-3">
                    <p>
                        Once you start working out from home, you may never want to return to the gym again. Think about it: there’s no need to get in a cold car, change into gym clothes, wait for machines, or breathe in all those curious aromas.
                    </p>
                    <p>
                        You spend a lot of time preparing for a workout: you have to pack your gym bag, get in the car, drive to the gym, park, change, and then, finally, hit the floor. Exercising at home allows you to bypass all those inconveniences and focus your time and energy on your workout routine.
                    </p>
                    <p>
                        Exercising around others can be exhilarating, but it can also be intimidating and discouraging. When working out at home, you can go at your own pace, and you don’t have to worry about the judgement of others.
                    </p>
                </div>
            </div>

            <div className="bgimg-2">
                <div className="caption">
                    <div>
                        <h1 className="text-light">Powered by <span className="text-warning">Web3</span> Techonology</h1>
                    </div>
                </div>
            </div>

            <div className="bg-dark text-light text-center">
                <h2 className="text-light py-3">No excuses!</h2>
                <div className="mx-5 pb-3">
                    <p>
                        Exercising from home allows you to fit in a workout whenever you’re feeling particularly inspired or energized. Many websites offer pre-recorded classNamees, which means no more fretting over the className filling up. You can also fit in fitness throughout your day, by getting in a couple of quick sets while you wait for your coffee to brew, oatmeal to cook, or Zoom meeting to start.        </p>
                    <p>
                        A cold night or a particularly difficult day at work may be enough to keep you from going to the gym. But when it comes to meeting your personal fitness goals, consistency is key. A home exercise routine provides the convenience necessary to never miss a workout.
                    </p>
                </div>
            </div>

            <div className="bgimg-3">
                <div className="caption">
                    <div>
                        <h1 className="text-light">Challenge Yourself!</h1>
                    </div>
                </div>
            </div>

            <div className="bg-dark text-light text-center">
                <h2 className="text-light py-3">Take a look at all the listed properties!</h2>
                <Button className='mt-3 mb-4' variant='warning'><Link to="/allproperties" className='nav-link text-dark'><strong>All Properties</strong></Link></Button>
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