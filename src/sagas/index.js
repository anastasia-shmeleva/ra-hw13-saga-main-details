import { 
  put, 
  spawn, 
  call,
  takeLatest,
  takeEvery
} from 'redux-saga/effects';

import { 
  getServicesRequest,
  getServicesSuccess,
  getServicesFailure,
  getItemSuccess,
  getItemFailure,
} from '../actions/actionCreators';

import { 
  GET_ITEM_REQUEST
} from'../actions/actionTypes';

import { 
  fetchServices,
  fetchServiceItem,
} from '../api/index';


// workers
function* getServicesRequestSaga() {
  yield put(getServicesRequest())
}

function* getServicesSaga() {
  try {
    const receiveServices = yield call(fetchServices);
    yield put(getServicesSuccess(receiveServices));
  } catch (error) {
    yield put(getServicesFailure(error));
  }
}

function* getItemSaga(action) {
  try {
    const receiveItem = yield call(fetchServiceItem, action.payload.id);
    yield put(getItemSuccess(receiveItem));
  } catch (error) {
    yield put(getItemFailure(error));
  }
}

// watchers
function* watchGetServicesSaga() {
  yield takeLatest(getServicesRequestSaga, getServicesSaga);
}

function* watchGetServiceItemSaga() {
  yield takeEvery(GET_ITEM_REQUEST, getItemSaga);
}


export default function* saga() {
  yield spawn(watchGetServicesSaga);
  yield spawn(watchGetServiceItemSaga);
}