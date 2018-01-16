import { combineReducers } from 'redux'
import paginated from 'paginated-redux'
import moment from 'moment'
import filter from './filterReducer'
import * as filterActions from '../actions/filterActions'
import * as eventActions from '../actions/eventActions'
import { mergeWithOverwrite } from './reducerHelpers/merge'
import buildFetching from './reducerHelpers/fetching'
import buildError from './reducerHelpers/error'

const defaultEventCollection = []

const makeSearchable = (event) => ({
    ...event,
    filterableIncidentId: event.incidentId.toString()
})

const addEventsToState = (state, events) => mergeWithOverwrite(state, events.map(event => makeSearchable(event)))

export const rawList = (state = defaultEventCollection, action) => {
    switch(action.type){
        case eventActions.RECEIVE_EVENT:
        case eventActions.POST_EVENT_SUCCEED:
            return addEventsToState(state, [{...action.event, timeReceived: moment()}])
        case eventActions.RECEIVE_EVENTS:
            return addEventsToState(state, action.events)
        case filterActions.CHANGE_EVENT_FILTER:
            return defaultEventCollection
        default:
            return state
    }
}

const actionSet = {
    try: eventActions.REQUEST_EVENT,
    succeed: eventActions.RECEIVE_EVENT,
    fail: eventActions.RECEIVE_EVENT_FAILURE
}

const fetching = buildFetching(actionSet)

const error = buildError(actionSet)

const pageArgs = {
    defaultPage: 1,
    defaultSortOrder: 'desc',
    defaultSortBy: 'occurred',
    defaultPer: 10,
    defaultFilter: '',
    defaultTotal: 0
}

export const pages = paginated(rawList, eventActions.pagination.types, pageArgs)

export const buildReducersObject = (defaultFilter) => (fetchingReducer, errorReducer, pagesReducer, filterReducer) => ({
    fetching: fetchingReducer,
    error: errorReducer,
    pages: pagesReducer,
    filter: filterReducer(defaultFilter)
})

export default (defaultFilter) => combineReducers(buildReducersObject(defaultFilter)(fetching, error, pages, filter))