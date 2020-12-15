import produce, { enableES5 } from 'immer'

enableES5()

// Action Types
export const types = {
  FETCH_START: 'API/FETCH_START',
  FETCH_SUCCESSED: 'API/FETCH_SUCCESSED',
  FETCH_FAILED: 'API/FETCH_FAILED',
}

// Reducer
const initState = {
  loading: false,
  success: false,
  error: false,
}

export function reducer(state = initState, action) {
  switch (action.type) {
    case types.FETCH_START:
      return produce(state, draft => {
        draft.loading = true
      })
    case types.FETCH_SUCCESSED:
      return produce(state, draft => {
        draft.loading = false
        draft.success = true
      })
    case types.FETCH_FAILED:
      return produce(state, draft => {
        draft.loading = false
        draft.success = false
        draft.error = true
      })
    default:
      return state
  }
}

// Action Creators
export function actions(options) {
  return dispatch => {
    dispatch({
      type: types.FETCH_START,
      payload: options,
    })

    return api
      .fetchList(options)
      .then(response => {
        dispatch({
          type: types.FETCH_SUCCESSED,
          payload: {
            options,
            response,
          },
        })
      })
      .catch(response => {
        dispatch({
          type: types.FETCH_FAILED,
          payload: {
            options,
            response,
          },
        })
      })
  }
}
