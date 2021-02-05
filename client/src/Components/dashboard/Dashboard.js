import React, {useEffect} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {getCurrentProfile, deleteAccount} from '../../actions/profile';
import Spinner from '../Layout/Spinner';
import DashboardActions from './DashboardActions';
import Experience from './Experience';
import Education from './Education';

const Dashboard = ({getCurrentProfile, auth: {user}, profile: {profile, loading}}) => {

    useEffect(()=> {
        getCurrentProfile();
    }, []);

    return loading && profile == null ? <Spinner /> : 
    <>
        <h1 className='large text-primary'>Dashboard</h1>
        <p className='lead'>
            Welcome {user && user.name}
            </p>
            {profile != null ?
                <>
                    <DashboardActions />
                   { profile.experience && profile.experience.length != 0 ? <Experience experience={profile.experience} /> : null}
                    { profile.education && profile.education.length != 0 ? <Education education={profile.education} />: null}
                    <div className="my-2">
                        <button onClick= {deleteAccount()}>
                            <i className="fas fa-user-minus" /> Delete My Account
                         </button>
                    </div>
                </>
                :
                <>
                    <p>You have not yet setup the profile. Please do mate!</p>
                    <Link to='/create-profile' className='btn btn-primary my-1'>Create Profile</Link>
                </>}
        </> 
}

Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
    deleteAccount: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile
})
export default connect(mapStateToProps, {getCurrentProfile, deleteAccount})(Dashboard)
