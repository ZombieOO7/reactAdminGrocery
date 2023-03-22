/**
 * App Reducers
 */
import { combineReducers } from 'redux';
import settings from './settings';
import sidebarReducer from './SidebarReducer';
import authUserReducer from './AuthUserReducer';

const reducers = combineReducers({
   settings,
   sidebar: sidebarReducer,
   authUser: authUserReducer,
});

export default reducers;
